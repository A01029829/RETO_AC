import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongodb from 'mongodb';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import https from 'https';
import fs from 'fs';

import {rolePermissions, requirePermission, getReportFilter} from "./Emergencias-PreHos/Authentication.mjs"

const { MongoClient } = mongodb;

const app = express();
let db;  

app.use(cors());

const PORT = process.env.PORT || 3000;

// se usa body-parser para parsear el cuerpo de las solicitudes
app.use(bodyParser.json());

// Funcion para registrar logs de acciones
const log = async (sujeto, objeto, accion)=>{  
    let toLog = {};
    toLog["timestamp"] = new Date();
    toLog["sujeto"] = sujeto;
    toLog["objeto"] = objeto;
    toLog["accion"] = accion;
    await db.collection("logs").insertOne(toLog);
} 

// Funcion para calcular el turno actual basado en la hora y dia de la semana
const calcularTurnoActual = () => {
    const ahora = new Date();
    const diaSemana = ahora.getDay(); // 0 = Domingo...
    const hora = ahora.getHours();
    const minutos = ahora.getMinutes();
    const horaDecimal = hora + minutos / 60;
    
    // Sabados y domingos: Descanso
    const esFinDeSemana = diaSemana === 0 || diaSemana === 6;
    
    if (!esFinDeSemana) {
        // Lunes a viernes
        if (horaDecimal >= 8 && horaDecimal < 15) {
            return {
                nombre: "Turno Matutino L-V",
                descripcion: "Lunes a viernes, de 8:00 a 15:00 horas",
                horario: "8:00 - 15:00",
                codigo: "LV_0815"
            };
        } else if (horaDecimal >= 15 && horaDecimal < 21) {
            return {
                nombre: "Turno Vespertino L-V",
                descripcion: "Lunes a viernes, de 15:00 a 21:00 horas",
                horario: "15:00 - 21:00",
                codigo: "LV_1521"
            };
        } else if (horaDecimal >= 21 || horaDecimal < 8) {
            // Turno nocturno - depende del dia
            if (diaSemana === 1 || diaSemana === 3 || diaSemana === 5) {
                // Lunes, miercoles, viernes
                return {
                    nombre: "Turno Nocturno LMV",
                    descripcion: "Lunes, miércoles y viernes, de 21:00 a 8:00 horas",
                    horario: "21:00 - 8:00",
                    codigo: "LMV_2108"
                };
            } else {
                // Martes, jueves
                return {
                    nombre: "Turno Nocturno MJD",
                    descripcion: "Martes, jueves y domingo, de 21:00 a 8:00 horas",
                    horario: "21:00 - 8:00",
                    codigo: "MJD_2108"
                };
            }
        }
    } else {
        // Sabados y domingos
        if (horaDecimal >= 8 && horaDecimal < 20) {
            return {
                nombre: "Turno Día SD",
                descripcion: "Sábados y domingos, de 8:00 a 20:00 horas",
                horario: "8:00 - 20:00",
                codigo: "SD_0820"
            };
        } else {
            // De 20:00 a 8:00
            return {
                nombre: "Turno Noche SD",
                descripcion: "Sábados y domingos, de 20:00 a 8:00 horas",
                horario: "20:00 - 8:00",
                codigo: "SD_2008"
            };
        }
    }
    
    // Fallback para evitar errores 
    return {
        nombre: "Sin turno definido",
        descripcion: "No se pudo determinar el turno",
        horario: "N/A",
        codigo: "UNDEFINED"
    };
}; 

async function connectToDB(){
    try {
        const connectionString = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
        console.log("Intentando conectar a:", connectionString); 
        let client=new MongoClient(connectionString);
        await client.connect();
        db=client.db("proteccionCivil");
        console.log("conectado a la base de datos");
    } catch (error) {
        console.error("Error conectando a la base de datos:", error);
    }
}

// Registro de usuarios (solo admin)
// La funcion registra un nuevo usuario en la coleccion "usuarios402"
// El password se guarda hasheado con argon2
// Si el usuario ya existe, se devuelve un error 403
app.post("/registrarse", requirePermission('gestionar_usuarios'), async(req, res)=>{
	try {
		let user=req.body.username;
		let pass=req.body.password;
		let nombre=req.body.nombre;
		let tipo=req.body.tipo;
		let turno=req.body.turno || null;
		
		let data=await db.collection("usuarios402").findOne({"usuario":user})
		if(data==null){
			const hash=await argon2.hash(pass, {type: argon2.argon2id, memoryCost: 19*1024, timeCost:2, parallelism:1, saltLength:16})
			let usuarioAgregar={"usuario":user, "password":hash, "nombre":nombre, "tipo":tipo, "turno":turno}
			data=await db.collection("usuarios402").insertOne(usuarioAgregar);
			log(req.user.usuario, "usuarios402", "crear");
			res.sendStatus(201);
		}else{
			res.sendStatus(403)
		}
	} catch (error) {
		res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
	}
})

// GET /usuarios - Listar usuarios (solo admin)
app.get('/usuarios', requirePermission('gestionar_usuarios'), async (req, res) => {
	try {
		const { _start, _end, _sort, _order } = req.query;
		
		let sortObj = {};
		if (_sort) {
			sortObj[_sort] = _order === 'DESC' ? -1 : 1;
		}
		
		const usuarios = await db.collection("usuarios402")
			.find({})
			.project({ password: 0, _id: 0 })
			.sort(sortObj)
			.skip(parseInt(_start) || 0)
			.limit(parseInt(_end) - parseInt(_start) || 10)
			.toArray();
		
		const usuariosConId = usuarios.map(u => ({ ...u, id: u.usuario }));
		
		const total = await db.collection("usuarios402").countDocuments({});
		
		res.set('X-Total-Count', total);
		res.set('Access-Control-Expose-Headers', 'X-Total-Count');
		res.json(usuariosConId);
	} catch (error) {
		res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
	}
})

// GET /usuarios/:id - Obtener un usuario especifico 
app.get('/usuarios/:id', requirePermission('gestionar_usuarios'), async (req, res) => {
	try {
		const usuario = await db.collection("usuarios402")
			.findOne({ usuario: req.params.id }, { projection: { password: 0, _id: 0 } });
		
		if (!usuario) {
			return res.status(404).json({ message: 'Usuario no encontrado' });
		}
		
		const usuarioConId = { ...usuario, id: usuario.usuario };
		
		res.json(usuarioConId);
	} catch (error) {
		res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
	}
})

// PUT /usuarios/:id - Actualizar un usuario (solo admin)
app.put('/usuarios/:id', requirePermission('gestionar_usuarios'), async (req, res) => {
	try {
		const { nombre, tipo, turno } = req.body;
		const updateData = { nombre, tipo, turno };
		
		await db.collection("usuarios402").updateOne(
			{ usuario: req.params.id },
			{ $set: updateData }
		);
		
		const usuario = await db.collection("usuarios402")
			.findOne({ usuario: req.params.id }, { projection: { password: 0, _id: 0 } });
		
		const usuarioConId = { ...usuario, id: usuario.usuario };
		
		log(req.user.usuario, "usuarios402", "actualizar");
		res.json(usuarioConId);
	} catch (error) {
		res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
	}
})

// DELETE /usuarios/:id - Eliminar un usuario (solo admin)
app.delete('/usuarios/:id', requirePermission('gestionar_usuarios'), async (req, res) => {
	try {
		await db.collection("usuarios402").deleteOne({ usuario: req.params.id });
		log(req.user.usuario, "usuarios402", "eliminar");
		res.json({ id: req.params.id, usuario: req.params.id });
	} catch (error) {
		res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
	}
})

// Login de usuarios
// La funcion verifica las credenciales del usuario
// Si son correctas, devuelve un token JWT
// Si no, devuelve un error 401
app.post("/login", async (req, res)=>{
	let user=req.body.usuario;
	let pass=req.body.password;
	let data=await db.collection("usuarios402").findOne({"usuario":user});
	if(data==null){
		res.sendStatus(401);
	}else if(await argon2.verify(data.password, pass)){
    let token=jwt.sign({"usuario":data.usuario, "tipo":data.tipo, "turno":data.turno}, process.env.JWTKEY, {expiresIn: 900})
		res.json({"token":token, "id":data.usuario, "nombre":data.nombre, "tipo":data.tipo, "turno":data.turno});
	}else{
		res.sendStatus(401);
	}
})

// GET /me - Obtener informacion del usuario actual
app.get("/me", async (req, res) => {
	try {
		let token = req.get("Authentication");
		if (!token) {
			return res.status(401).json({ message: 'Token no proporcionado' });
		}
		
        let verifiedToken = await jwt.verify(token, process.env.JWTKEY);
		let user = verifiedToken.usuario;
		
		// Buscar informacion completa del usuario
		let userData = await db.collection("usuarios402").findOne(
			{ "usuario": user },
			{ projection: { password: 0, _id: 0 } }
		);
		
		if (!userData) {
			return res.status(404).json({ message: 'Usuario no encontrado' });
		}
		
		// Calculo del turno actual
		const turnoActual = calcularTurnoActual();
		
		res.json({
			id: userData.usuario,
			usuario: userData.usuario,
			nombre: userData.nombre,
			tipo: userData.tipo,
			turno: userData.turno,
			turnoActual: turnoActual
		});
	} catch (error) {
		res.status(401).json({ message: 'No autorizado', error: error.message });
	}
});

// REPORTES Emergencias Urbanas

app.get('/reportesEU', async (req, res) => {
    try{
		let token=req.get("Authentication");
        let verifiedToken=await jwt.verify(token, process.env.JWTKEY);
		let user=verifiedToken.usuario;
		
		// Aplicar filtro segun el rol del usuario
		const filter = getReportFilter(verifiedToken);
        // getList
        if("_sort" in req.query){
			let sortBy=req.query._sort;
			let sortOrder=req.query._order=="ASC"?1:-1;
			let inicio=Number(req.query._start);
			let fin=Number(req.query._end);
			let sorter={}
			sorter[sortBy]=sortOrder;
			
			// Aplicar filtro del usuario
			let data= await db.collection("reportesEU").find(filter).sort(sorter).project({_id:0}).toArray();
			res.set("Access-Control-Expose-Headers", "X-Total-Count");
			res.set("X-Total-Count", data.length);
			data=data.slice(inicio,fin)
			log(user, "reportesEU", "leer");
			res.json(data)
		}else if("id" in req.query){
			let data=[];
			for(let index=0; index<req.query.id.length; index++){
				let dataParcial=await db.collection("reportesEU").find({...filter, id: Number(req.query.id[index])}).project({_id:0}).toArray()
				data= await data.concat(dataParcial);
			}
			res.json(data);
		}else{
			// Combinar filtro del usuario con los parametros
			let combinedFilter = {...filter, ...req.query};
			let data=await db.collection("reportesEU").find(combinedFilter).project({_id:0}).toArray();
			res.set("Access-Control-Expose-Headers", "X-Total-Count");
			res.set("X-Total-Count", data.length);
			res.json(data);
		}
	}catch{
		res.sendStatus(401);
	}
});

// GET /reportesEU/:id - Obtener un reporte especifico
app.get("/reportesEU/:id", async (req, res) => {
    try {
        let token = req.get("Authentication");
    let verifiedToken = await jwt.verify(token, process.env.JWTKEY);
        let user = verifiedToken.usuario;
        
        let data = await db.collection("reportesEU").find({id: Number(req.params.id)}).project({_id:0}).toArray();
        log(user, "reportesEU", "leer");
        res.json(data[0]);
    } catch {
        res.sendStatus(401);
    }
});

// POST /reportesEU - Crear un nuevo reporte
app.post('/reportesEU', async (req, res) => {
    try {
        let token = req.get("Authentication");
        let verifiedToken = await jwt.verify(token, process.env.JWTKEY);
        let user = verifiedToken.usuario;
        
        let valores = req.body;
        
        // Generar ID unico
        let ultimoReporte = await db.collection("reportesEU").find({}).sort({id: -1}).limit(1).toArray();
        valores["id"] = ultimoReporte.length > 0 ? ultimoReporte[0].id + 1 : 1;
        valores["fecha_creacion"] = new Date();
        valores["creado_por"] = user;
        
        await db.collection("reportesEU").insertOne(valores);
        log(user, "reportesEU", "crear");
        res.json(valores);
    } catch {
        res.sendStatus(401);
    }
});

// PUT /reportesEU/:id - Actualizar un reporte
app.put("/reportesEU/:id", async (req, res) => {
    try {
        let token = req.get("Authentication");
        let verifiedToken = await jwt.verify(token, process.env.JWTKEY);
        let user = verifiedToken.usuario;
        
        let valores = req.body;
        valores["id"] = Number(req.params.id);
        valores["fecha_modificacion"] = new Date();
        valores["modificado_por"] = user;
        
        await db.collection("reportesEU").updateOne({"id": valores["id"]}, {"$set": valores});
        let data = await db.collection("reportesEU").find({"id": valores["id"]}).project({_id:0}).toArray();
        log(user, "reportesEU", "actualizar");
        res.json(data[0]);
    } catch {
        res.sendStatus(401);
    }
});

// DELETE /reportesEU/:id - Eliminar un reporte
app.delete("/reportesEU/:id", async (req, res) => {
    try {
        let token = req.get("Authentication");
        let verifiedToken = await jwt.verify(token,process.env.JWTKEY);
        let user = verifiedToken.usuario;
        
        let data = await db.collection("reportesEU").deleteOne({id: Number(req.params.id)});
        log(user, "reportesEU", "eliminar");
        res.json(data);
    } catch {
        res.sendStatus(401);
    }
});

// ==================== REPORTES EMERGENCIAS HOSPITALARIAS ====================

// GET /reportesEH - Listar reportes con permisos
app.get('/reportesEH', requirePermission('ver_propios_reportes'), async (req, res) => {
    try{
        let token=req.get("Authentication");
        let verifiedToken=await jwt.verify(token,process.env.JWTKEY);
        let user=verifiedToken.usuario;
        
        const filter = getReportFilter(verifiedToken);
        
        if("_sort" in req.query){
            let sortBy=req.query._sort;
            let sortOrder=req.query._order=="ASC"?1:-1;
            let inicio=Number(req.query._start);
            let fin=Number(req.query._end);
            let sorter={}
            sorter[sortBy]=sortOrder;

            let data= await db.collection("reportesEH").find(filter).sort(sorter).project({_id:0}).toArray();
            res.set("Access-Control-Expose-Headers", "X-Total-Count");
            res.set("X-Total-Count", data.length);
            data=data.slice(inicio,fin)
            log(user, "reportesEH", "leer");
            res.json(data)
        }else if("id" in req.query){
            let data=[];
            for(let index=0; index<req.query.id.length; index++){
                let dataParcial=await db.collection("reportesEH").find({...filter, id: Number(req.query.id[index])}).project({_id:0}).toArray()
                data= await data.concat(dataParcial);
            }
            res.json(data);
        }else{
            let data=await db.collection("reportesEH").find(filter).project({_id:0}).toArray();
            res.set("Access-Control-Expose-Headers", "X-Total-Count");
            res.set("X-Total-Count", data.length);
            res.json(data);
        }
    }catch{
        res.sendStatus(401);
    }
});

// GET /reportesEH/:id - Obtener un reporte especifico
app.get("/reportesEH/:id", async (req, res) => {
    try {
        let token = req.get("Authentication");
        let verifiedToken = await jwt.verify(token, process.env.JWTKEY);
        let user = verifiedToken.usuario;

        const filter = getReportFilter(verifiedToken);
        let query = { id: Number(req.params.id) };
        
        // Si hay filtro, agregarlo
        if (filter.creado_por) {
            query.creado_por = filter.creado_por;
        }
        
        let data = await db.collection("reportesEH").find(query).project({_id:0}).toArray();
        
        if(data.length === 0) {
            return res.status(404).json({ message: 'Reporte no encontrado' });
        }

        log(user, "reportesEH", "leer");
        res.json(data[0]);
    } catch {
        res.sendStatus(401);
    }
});

// POST /reportesEH - Crear un nuevo reporte
app.post('/reportesEH', requirePermission('crear_reportes'), async (req, res) => {
    try {
        let token = req.get("Authentication");
        let verifiedToken = await jwt.verify(token, process.env.JWTKEY);
        let user = verifiedToken.usuario;
        
        let valores = req.body;
        let ultimoReporte = await db.collection("reportesEH").find({}).sort({id: -1}).limit(1).toArray();
        valores["id"] = ultimoReporte.length > 0 ? ultimoReporte[0].id + 1 : 1;
        valores["fecha_creacion"] = new Date();
        valores["creado_por"] = user;
        
        await db.collection("reportesEH").insertOne(valores);
        log(user, "reportesEH", "crear");
        res.json(valores);
    } catch {
        res.sendStatus(401);
    }
});

// PUT /reportesEH/:id - Actualizar un reporte
app.put("/reportesEH/:id", requirePermission('editar_reportes'), async (req, res) => {
    try {
        let token = req.get("Authentication");
        let verifiedToken = await jwt.verify(token,process.env.JWTKEY);
        let user = verifiedToken.usuario;
        
        let valores = req.body;
        valores["id"] = Number(req.params.id);
        valores["fecha_modificacion"] = new Date();
        valores["modificado_por"] = user;
        
        await db.collection("reportesEH").updateOne({"id": valores["id"]}, {"$set": valores});
        let data = await db.collection("reportesEH").find({"id": valores["id"]}).project({_id:0}).toArray();
        log(user, "reportesEH", "actualizar");
        res.json(data[0]);
    } catch {
        res.sendStatus(401);
    }
});

// DELETE /reportesEH/:id - Eliminar un reporte
app.delete("/reportesEH/:id", requirePermission('eliminar_reportes'),  async (req, res) => {
    try {
        let token = req.get("Authentication");
        let verifiedToken = await jwt.verify(token,await process.env.JWTKEY);
        let user = verifiedToken.usuario;
        
        let data = await db.collection("reportesEH").deleteOne({id: Number(req.params.id)});
        log(user, "reportesEH", "eliminar");
        res.json(data);
    } catch {
        res.sendStatus(401);
    }
});


// GET /notas - Listar notas
app.get('/notas', async (req, res) => {
    try {
        let token = req.get("Authentication");
        let verifiedToken = await jwt.verify(token, process.env.JWTKEY);
        let user = verifiedToken.usuario;
        
        if ("_sort" in req.query) {
            let sortField = req.query._sort;
            let sortOrder = req.query._order === 'ASC' ? 1 : -1;
            let sortObj = {};
            sortObj[sortField] = sortOrder;
            
            let start = parseInt(req.query._start) || 0;
            let end = parseInt(req.query._end) || 10;
            
            let data = await db.collection("notas")
                .find({})
                .project({_id: 0})
                .sort(sortObj)
                .skip(start)
                .limit(end - start)
                .toArray();
            
            let total = await db.collection("notas").countDocuments({});
            
            res.set('X-Total-Count', total);
            res.set('Access-Control-Expose-Headers', 'X-Total-Count');
            res.json(data);
        } else {
            let data = await db.collection("notas")
                .find({})
                .project({_id: 0})
                .toArray();
            
            let total = data.length;
            res.set('X-Total-Count', total);
            res.set('Access-Control-Expose-Headers', 'X-Total-Count');
            res.json(data);
        }
        
        log(user, "notas", "listar");
    } catch {
        res.sendStatus(401);
    }
});

// GET /notas/:id - Obtener una nota específica
app.get("/notas/:id", async (req, res) => {
    try {
        let token = req.get("Authentication");

        let verifiedToken = await jwt.verify(token, process.env.JWTKEY);
        let user = verifiedToken.usuario;
        
        let data = await db.collection("notas")
            .find({id: Number(req.params.id)})
            .project({_id: 0})
            .toArray();
        
        log(user, "notas", "leer");
        res.json(data[0]);
    } catch {
        res.sendStatus(401);
    }
});

// POST /notas - Crear una nueva nota
app.post('/notas', async (req, res) => {
    try {
        let token = req.get("Authentication");
        let verifiedToken = await jwt.verify(token, await process.env.JWTKEY);
        let user = verifiedToken.usuario;
        
        let valores = req.body;
        
        // Generar ID único
        let ultimaNota = await db.collection("notas")
            .find({})
            .sort({id: -1})
            .limit(1)
            .toArray();
        valores["id"] = ultimaNota.length > 0 ? ultimaNota[0].id + 1 : 1;
        
        // Agregar metadatos
        valores["fecha_creacion"] = new Date();
        valores["creado_por"] = user;
        
        await db.collection("notas").insertOne(valores);
        log(user, "notas", "crear");
        res.json(valores);
    } catch {
        res.sendStatus(401);
    }
});

// PUT /notas/:id - Actualizar una nota
app.put("/notas/:id", async (req, res) => {
    try {
        let token = req.get("Authentication");
        let verifiedToken = await jwt.verify(token, await process.env.JWTKEY);
        let user = verifiedToken.usuario;
        
        let valores = req.body;
        valores["id"] = Number(req.params.id);
        
        await db.collection("notas").updateOne(
            {"id": valores["id"]}, 
            {"$set": valores}
        );
        
        let data = await db.collection("notas")
            .find({"id": valores["id"]})
            .project({_id: 0})
            .toArray();
        
        log(user, "notas", "actualizar");
        res.json(data[0]);
    } catch {
        res.sendStatus(401);
    }
});

// DELETE /notas/:id - Eliminar una nota
app.delete("/notas/:id", async (req, res) => {
    try {
        let token = req.get("Authentication");
        let verifiedToken = await jwt.verify(token, await process.env.JWTKEY);
        let user = verifiedToken.usuario;
        
        let data = await db.collection("notas").deleteOne({id: Number(req.params.id)});
        log(user, "notas", "eliminar");
        res.json(data);
    } catch {
        res.sendStatus(401);
    }
});


// Endpoints para las graficas

// GET /estadisticas/serie-temporal - Total de emergencias por fecha
app.get('/estadisticas/serie-temporal', requirePermission('ver_estadisticas'), async (req, res) => {
    try {
        // Permisos y parametros de query
        const user = req.user.usuario;
        const { fechaInicio, fechaFin, tipo, turno, gravedad, agrupacion = 'dia' } = req.query;
        let filter = {};
        if (turno) filter.turno = turno;
        if (gravedad && tipo === 'EU') filter.gravedad = gravedad;
        let todosLosReportes = [];
        
        if (!tipo || tipo === 'EH') {
            let filterEH = { ...filter };
            if (fechaInicio || fechaFin) {
                filterEH.hora_llamada = {};
                if (fechaInicio) filterEH.hora_llamada.$gte = new Date(fechaInicio);
                if (fechaFin) filterEH.hora_llamada.$lte = new Date(fechaFin);
            }
            
            let reportesEH = await db.collection('reportesEH')
                .find(filterEH)
                .project({ hora_llamada: 1, _id: 0 })
                .toArray();
            reportesEH.forEach(r => {
                if (r.hora_llamada) {
                    todosLosReportes.push({ fecha: r.hora_llamada });
                }
            });
        }
        
        if (!tipo || tipo === 'EU') {
            let filterEU = { ...filter };
            if (fechaInicio || fechaFin) {
                filterEU.fecha = {};
                if (fechaInicio) filterEU.fecha.$gte = new Date(fechaInicio);
                if (fechaFin) filterEU.fecha.$lte = new Date(fechaFin);
            }
            
            let reportesEU = await db.collection('reportesEU')
                .find(filterEU)
                .project({ fecha: 1, _id: 0 })
                .toArray();
            todosLosReportes = todosLosReportes.concat(reportesEU);
        }
        
        // Agrupar por fecha segun el tipo de agrupacion
        let agrupado = {};
        todosLosReportes.forEach(reporte => {
            if (!reporte.fecha) return;
            
            let fecha = new Date(reporte.fecha);
            let clave;
            
            switch (agrupacion) {
                case 'dia':
                    clave = fecha.toISOString().split('T')[0]; // Año, mes, dia
                    break;
                case 'semana':
                    let primerDia = new Date(fecha);
                    primerDia.setDate(fecha.getDate() - fecha.getDay());
                    clave = primerDia.toISOString().split('T')[0];
                    break;
                case 'mes':
                    clave = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
                    break;
                default:
                    clave = fecha.toISOString().split('T')[0];
            }
            
            if (!agrupado[clave]) {
                agrupado[clave] = 0;
            }
            agrupado[clave]++;
        });
        
        // Conversion a array y ordenamiento
        let resultado = Object.keys(agrupado).map(fecha => ({
            fecha,
            count: agrupado[fecha]
        })).sort((a, b) => a.fecha.localeCompare(b.fecha));
        
        log(user, "estadisticas", "serie-temporal");
        res.json(resultado);
    } catch (error) {
        res.status(401).json({ message: 'No autorizado', error: error.message });
    }
});

// GET /estadisticas/distribucion-tipo - Conteo por tipo de emergencia
app.get('/estadisticas/distribucion-tipo', requirePermission('ver_estadisticas'), async (req, res) => {
    try {
        const user = req.user.usuario;
        const { fechaInicio, fechaFin, turno } = req.query;
        let filter = {};
        if (fechaInicio || fechaFin) {
            filter.fecha = {};
            if (fechaInicio) filter.fecha.$gte = new Date(fechaInicio);
            if (fechaFin) filter.fecha.$lte = new Date(fechaFin);
        }
        if (turno) filter.turno = turno;

        const countEH = await db.collection('reportesEH').countDocuments(filter);
        const countEU = await db.collection('reportesEU').countDocuments(filter);
        const countNotas = await db.collection('notas').countDocuments(filter);
        
        let resultado = [
            { tipo: 'Prehospitalaria', value: countEH },
            { tipo: 'Urbana', value: countEU },
            { tipo: 'Notas sin folio', value: countNotas }
        ];
        
        log(user, "estadisticas", "distribucion-tipo");
        res.json(resultado);
    } catch (error) {
        res.status(401).json({ message: 'No autorizado', error: error.message });
    }
});

// GET /estadisticas/tiempo-respuesta - Promedio de tiempo de respuesta por turno
app.get('/estadisticas/tiempo-respuesta', requirePermission('ver_estadisticas'), async (req, res) => {
    try {
        const user = req.user.usuario;
        const { fechaInicio, fechaFin } = req.query;
        
        let filter = {};
        if (fechaInicio || fechaFin) {
            filter.fecha = {};
            if (fechaInicio) filter.fecha.$gte = new Date(fechaInicio);
            if (fechaFin) filter.fecha.$lte = new Date(fechaFin);
        }
        
        let reportesEH = await db.collection('reportesEH')
            .find({ ...filter, tiempo_traslado: { $exists: true } })
            .project({ turno: 1, tiempo_traslado: 1, _id: 0 })
            .toArray();
            
        let reportesEU = await db.collection('reportesEU')
            .find({ ...filter, tiempo_traslado: { $exists: true } })
            .project({ turno: 1, tiempo_traslado: 1, _id: 0 })
            .toArray();
        
        let todosReportes = [...reportesEH, ...reportesEU];

        let agrupado = {};
        todosReportes.forEach(reporte => {
            let turnoKey = reporte.turno || 'Sin turno';
            if (!agrupado[turnoKey]) {
                agrupado[turnoKey] = { suma: 0, cantidad: 0 };
            }
            agrupado[turnoKey].suma += reporte.tiempo_traslado;
            agrupado[turnoKey].cantidad++;
        });
        
        // Calculo de promedios y formato
        let resultado = Object.keys(agrupado).map(turno => ({
            turno: turno === '1' ? 'Matutino' : turno === '2' ? 'Vespertino' : turno === '3' ? 'Nocturno' : turno,
            minutos: Math.round(agrupado[turno].suma / agrupado[turno].cantidad)
        }));
        
        log(user, "estadisticas", "tiempo-respuesta");
        res.json(resultado);
    } catch (error) {
        res.status(401).json({ message: 'No autorizado', error: error.message });
    }
});

// GET /estadisticas/uso-unidades - Servicios y horas por unidad
app.get('/estadisticas/uso-unidades', requirePermission('ver_estadisticas'), async (req, res) => {
    try {
        const user = req.user.usuario;
        const { fechaInicio, fechaFin } = req.query;
        
        let filter = {};
        if (fechaInicio || fechaFin) {
            filter.fecha = {};
            if (fechaInicio) filter.fecha.$gte = new Date(fechaInicio);
            if (fechaFin) filter.fecha.$lte = new Date(fechaFin);
        }
        
        let reportesEH = await db.collection('reportesEH')
            .find({ ...filter, numero_ambulancia: { $exists: true } })
            .project({ 
                numero_ambulancia: 1, 
                hora_llamada: 1, 
                hora_base: 1,
                hora_salida: 1,
                _id: 0 
            })
            .toArray();
            
        let reportesEU = await db.collection('reportesEU')
            .find({ ...filter })
            .project({ num_unidad_legal: 1, tiempo_traslado: 1, _id: 0 })
            .toArray();
        
        let agrupado = {};
        reportesEH.forEach(reporte => {
            let unidad = reporte.numero_ambulancia || 'Sin unidad';
            if (!agrupado[unidad]) {
                agrupado[unidad] = { servicios: 0, horas: 0 };
            }
            agrupado[unidad].servicios++;
            
            if (reporte.hora_llamada && reporte.hora_base) {
                try {
                    let horaLlamada = new Date(reporte.hora_llamada);
                    let [h, m, s] = reporte.hora_base.split(':').map(Number);
                    let horaBase = new Date(horaLlamada);
                    horaBase.setHours(h, m, s || 0);
                    
                    // Verificar si no es el dia siguiente
                    if (horaBase < horaLlamada) {
                        horaBase.setDate(horaBase.getDate() + 1);
                    }
                    
                    let diffMs = horaBase - horaLlamada;
                    let diffHoras = diffMs / (1000 * 60 * 60);
                    
                    agrupado[unidad].horas += diffHoras;
                } catch (error) {
                    console.error('Error calculando tiempo para ambulancia:', unidad, error);
                }
            }
        });
        
        reportesEU.forEach(reporte => {
            let unidad = reporte.num_unidad_legal || null;
            if (unidad) {
                if (!agrupado[unidad]) {
                    agrupado[unidad] = { servicios: 0, horas: 0 };
                }
                agrupado[unidad].servicios++;
                agrupado[unidad].horas += (reporte.tiempo_traslado || 0) / 60;
            }
        });
        
        // Formateo de resultado
        let resultado = Object.keys(agrupado).map(unidad => ({
            unidad,
            servicios: agrupado[unidad].servicios,
            horas: Math.round(agrupado[unidad].horas * 10) / 10
        }));
        
        log(user, "estadisticas", "uso-unidades");
        res.json(resultado);
    } catch (error) {
        console.error('Error en /estadisticas/uso-unidades:', error);
        res.status(500).json({ message: 'Error al calcular uso de unidades', error: error.message });
    }
});

// GET /estadisticas/demografia - Distribucion de atendidos por edad y genero
app.get('/estadisticas/demografia', requirePermission('ver_estadisticas'), async (req, res) => {
    try {
        const user = req.user.usuario;
        const { fechaInicio, fechaFin } = req.query;
        let filter = {};
        if (fechaInicio || fechaFin) {
            filter.fecha = {};
            if (fechaInicio) filter.fecha.$gte = new Date(fechaInicio);
            if (fechaFin) filter.fecha.$lte = new Date(fechaFin);
        }
        
        // Obtener reportes con datos demograficos (edad y sexo)
        let reportesEH = await db.collection('reportesEH')
            .find({ ...filter, paciente_edad: { $exists: true }, paciente_sexo: { $exists: true } })
            .project({ paciente_edad: 1, paciente_sexo: 1, _id: 0 })
            .toArray();

        let rangos = {
            '0-17': { hombres: 0, mujeres: 0 },
            '18-30': { hombres: 0, mujeres: 0 },
            '31-60': { hombres: 0, mujeres: 0 },
            '60+': { hombres: 0, mujeres: 0 }
        };
        
        reportesEH.forEach(reporte => {
            let edad = reporte.paciente_edad;
            let sexo = reporte.paciente_sexo?.toLowerCase();
            
            if (edad === undefined || !sexo) return;
            
            let rango;
            if (edad <= 17) rango = '0-17';
            else if (edad <= 30) rango = '18-30';
            else if (edad <= 60) rango = '31-60';
            else rango = '60+';
            
            if (sexo === 'masculino' || sexo === 'm') {
                rangos[rango].hombres++;
            } else if (sexo === 'femenino' || sexo === 'f') {
                rangos[rango].mujeres++;
            }
        });
        
        // Formateo de resultado
        let resultado = Object.keys(rangos).map(rango => ({
            rango,
            hombres: rangos[rango].hombres,
            mujeres: rangos[rango].mujeres
        }));
        
        log(user, "estadisticas", "demografia");
        res.json(resultado);
    } catch (error) {
        res.status(401).json({ message: 'No autorizado', error: error.message });
    }
});

// GET /estadisticas/ultimos-reportes - Ultimos 10 reportes para el listado lateral
app.get('/estadisticas/ultimos-reportes', requirePermission('ver_estadisticas'), async (req, res) => {
    try {
        const user = req.user.usuario; 
        const { limite = 10, tipo } = req.query;

        let reportes = [];
        
        if (!tipo || tipo === 'EH') {
            let reportesEH = await db.collection('reportesEH')
                .find({})
                .sort({ fecha: -1 })
                .limit(parseInt(limite))
                .project({
                    id: 1,
                    fecha: 1,
                    turno: 1,
                    ubicacion_descripcion: 1,
                    tipo_servicio: 1,
                    _id: 0
                })
                .toArray();
            
            reportes = reportes.concat(reportesEH.map(r => ({
                folio: `EH-${r.id}`,
                fecha: r.fecha,
                tipo: r.tipo_servicio || 'Prehospitalaria',
                turno: r.turno === '1' ? 'Matutino' : r.turno === '2' ? 'Vespertino' : 'Nocturno',
                ubicacion: r.ubicacion_descripcion
            })));
        }
        
        if (!tipo || tipo === 'EU') {
            let reportesEU = await db.collection('reportesEU')
                .find({})
                .sort({ fecha: -1 })
                .limit(parseInt(limite))
                .project({
                    id: 1,
                    fecha: 1,
                    turno: 1,
                    ubicacion_descripcion: 1,
                    tipo_servicio: 1,
                    _id: 0
                })
                .toArray();
            
            reportes = reportes.concat(reportesEU.map(r => ({
                folio: `EU-${r.id}`,
                fecha: r.fecha,
                tipo: r.tipo_servicio || 'Urbana',
                turno: r.turno === '1' ? 'Matutino' : r.turno === '2' ? 'Vespertino' : 'Nocturno',
                ubicacion: r.ubicacion_descripcion
            })));
        }
        
        // Ordenamiento por fecha 
        reportes.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        reportes = reportes.slice(0, parseInt(limite));
        
        log(user, "estadisticas", "ultimos-reportes");
        res.json(reportes);
    } catch (error) {
        res.status(401).json({ message: 'No autorizado', error: error.message });
    }
});

// GET /estadisticas/distribucion-subtipo - Por tipo de emergencia
app.get('/estadisticas/distribucion-subtipo', requirePermission('ver_estadisticas'), async (req, res) => {
    try {
        const user = req.user.usuario;
        const { fechaInicio, fechaFin, turno, tipo } = req.query;
        
        let filter = {};
        if (fechaInicio || fechaFin) {
            filter.fecha = {};
            if (fechaInicio) filter.fecha.$gte = new Date(fechaInicio);
            if (fechaFin) filter.fecha.$lte = new Date(fechaFin);
        }
        if (turno) filter.turno = turno;
        
        let resultado = [];
        
        // Tipos de reportes EH
        if (!tipo || tipo === 'EH') {
            let subtiposEH = await db.collection('reportesEH').aggregate([
                { $match: filter },
                {
                    $group: {
                        _id: '$tipo_servicio',
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } }
            ]).toArray();
            
            resultado = resultado.concat(subtiposEH.map(s => ({
                tipo: 'Prehospitalaria',
                subtipo: s._id || 'Sin especificar',
                count: s.count
            })));
        }
        
        // Obtener tipos de reportes EU
        if (!tipo || tipo === 'EU') {
            let subtiposEU = await db.collection('reportesEU').aggregate([
                { $match: filter },
                {
                    $group: {
                        _id: '$tipo_servicio',
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } }
            ]).toArray();
            
            resultado = resultado.concat(subtiposEU.map(s => ({
                tipo: 'Urbana',
                subtipo: s._id || 'Sin especificar',
                count: s.count
            })));
        }
        
        log(user, "estadisticas", "distribucion-subtipo");
        res.json(resultado);
    } catch (error) {
        res.status(401).json({ message: 'No autorizado', error: error.message });
    }
});


const options = {
      key: fs.readFileSync('backend.key'),
      cert: fs.readFileSync('backend.crt')
    };

https.createServer(options, app).listen(3000, async () => {
	await process.loadEnvFile(".env");
	connectToDB();
	console.log('HTTPS Server running on port 3000');
});

/*
app.listen(PORT, '0.0.0.0', ()=>{
	connectToDB();
	console.log(`aplicacion corriendo en puerto ${PORT} (accesible desde todas las interfaces)`);
});
*/


