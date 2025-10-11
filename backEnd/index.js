import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongodb from 'mongodb';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

const { MongoClient } = mongodb;  // ← AGREGADO: Desestructurar MongoClient

const app = express();
let db;  // ← AGREGADO: Declarar variable db

// se usa cors para permitir solicitudes desde otros dominios
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

// Endpoint get reportes de la aplicacion
// Requiere autenticacion con JWT
// Soporta getList y getOne
 app.get('/reportes', async (req, res) => {
    try {
        let token = req.get("Authentication");
        let verifedToken = await jwt.verify(token, 'secretKey');
        let user = verifedToken.usuario;
        if("_sort" in req.query){ // getList
            let sortBy = req.query._sort;
            let sortOrder = req.query._order === 'ASC' ? 1 : -1;
            let inicio = Number(req.query._start) || 0;  // ← CORREGIDO: incio → inicio
            let fin = Number(req.query._end) || 10;
            let sorter = {};
            sorter[sortBy] = sortOrder;
            let data= await db.collection("ejemplo402").find({}).sort(sorter).project({_id:0}).toArray();
		    res.set("Access-Control-Expose-Headers", "X-Total-Count");
		    res.set("X-Total-Count", data.length);
		    data=data.slice(inicio,fin)
		    log(user, "reportes", "leer");
		    res.json(data)
        }
        else if("id" in req.query){ // getOne
            let data = [];
            for(let index in req.query.id){
                let dataParcial = await db.collection("ejemplo402").find({id: Number(req.query.id[index])}).project({_id:0}).toArray();
                data = await data.concat(dataParcial);
            }
            res.json(data);  // ← AGREGADO: faltaba enviar respuesta
        }
        else{
            let data = await db.collection("ejemplo402").find({}).project({_id:0}).toArray();  // ← CORREGIDO: colllection → collection
            // Los headers necesarios para que react-admin pueda interpretar la respuesta
            res.set("Access-Control-Expose-Headers", "X-Total-Count");
            res.set("X-Total-Count", data.length);
            res.json(data);
        }
    }
    catch (error) {
        res.status(401).json({ message: 'No autorizado', error: error.message });
    }
 });

 // getOne

app.get("/reportes/:id", async (req, res) => {
    let data = await db.collection("ejemplo402").find({id: Number(req.params.id)}).project({_id:0}).toArray();
    res.json(data[0]);
});

// createOne 
// la funcion createOne recibe un objeto JSON en el cuerpo de la solicitud
// y lo inserta en la coleccion "ejemplo402"
app.post('/reportes', async (req, res) => {
    let valores = req.body;
    valores["id"] = Number(valores["id"]);
    let data = await db.collection("ejemplo402").insertOne(valores);
    res.json(data);
});

//deleteOne
// 
app.delete("/reportes/:id", async (req, res) => {
    let data = await db.collection("ejemplo402").deleteOne({id: Number(req.params.id)});
    res.json(data);
});

//updateOne
app.put("/reportes/:id", async(req,res)=>{
	let valores=req.body
	valores["id"]=Number(valores["id"])
	let data =await db.collection("ejemplo402").updateOne({"id":valores["id"]}, {"$set":valores})
	data=await db.collection("ejemplo402").find({"id":valores["id"]}).project({_id:0}).toArray();
	res.json(data[0]);
})

async function connectToDB(){
    let client=new MongoClient("mongodb://127.0.0.1:27017");  // ← CORREGIDO: quitar /tc2007b
    await client.connect();
    db=client.db("proteccionCivil");  // ← CORREGIDO: especificar base de datos aquí
    console.log("conectado a la base de datos");
}


app.post("/registrarse", async(req, res)=>{
	let user=req.body.username;
	let pass=req.body.password;
	let nombre=req.body.nombre;
	let tipo=req.body.tipo;
	let data=await db.collection("usuarios402").findOne({"usuario":user})
	if(data==null){
		const hash=await argon2.hash(pass, {type: argon2.argon2id, memoryCost: 19*1024, timeCost:2, parallelism:1, saltLength:16})
		let usuarioAgregar={"usuario":user, "password":hash, "nombre":nombre, "tipo":tipo}
		data=await db.collection("usuarios402").insertOne(usuarioAgregar);
		res.sendStatus(201);
	}else{
		res.sendStatus(403)
	}
})

app.post("/login", async (req, res)=>{
	let user=req.body.username;
	let pass=req.body.password;
	let data=await db.collection("usuarios402").findOne({"usuario":user});
	if(data==null){
		res.sendStatus(401);
	}else if(await argon2.verify(data.password, pass)){
		let token=jwt.sign({"usuario":data.usuario}, "secretKey", {expiresIn: 900})
		res.json({"token":token, "id":data.usuario, "nombre":data.nombre})
	}else{
		res.sendStatus(401);
	}
})

// REPORTES EU

app.get('/reportesEU', async (req, res) => {
    try{
	let token=req.get("Authentication");
	let verifiedToken=await jwt.verify(token, "secretKey");
	let user=verifiedToken.usuario;	
	if("_sort" in req.query){//getList
		let sortBy=req.query._sort;
		let sortOrder=req.query._order=="ASC"?1:-1;
		let inicio=Number(req.query._start);
		let fin=Number(req.query._end);
		let sorter={}
		sorter[sortBy]=sortOrder;
		let data= await db.collection("reportesEU").find({}).sort(sorter).project({_id:0}).toArray();
		res.set("Access-Control-Expose-Headers", "X-Total-Count");
		res.set("X-Total-Count", data.length);
		data=data.slice(inicio,fin)
		log(user, "reportesEU", "leer");
		res.json(data)
	}else if("id" in req.query){
		let data=[];
		for(let index=0; index<req.query.id.length; index++){
			let dataParcial=await db.collection("reportesEU").find({id: Number(req.query.id[index])}).project({_id:0}).toArray()
			data= await data.concat(dataParcial);
		}
		res.json(data);
	}else{
		let data=await db.collection("reportesEU").find(req.query).project({_id:0}).toArray();
		res.set("Access-Control-Expose-Headers", "X-Total-Count");
		res.set("X-Total-Count", data.length);
		res.json(data);
	}
	}catch{
		res.sendStatus(401);
	}
});

// GET /reportesEU/:id - Obtener un reporte específico
app.get("/reportesEU/:id", async (req, res) => {
    try {
        let token = req.get("Authentication");
        let verifiedToken = await jwt.verify(token, "secretKey");
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
        let verifiedToken = await jwt.verify(token, "secretKey");
        let user = verifiedToken.usuario;
        
        let valores = req.body;
        
        // Generar ID único
        let ultimoReporte = await db.collection("reportesEU").find({}).sort({id: -1}).limit(1).toArray();
        valores["id"] = ultimoReporte.length > 0 ? ultimoReporte[0].id + 1 : 1;
        
        // Agregar metadatos
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
        let verifiedToken = await jwt.verify(token, "secretKey");
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
        let verifiedToken = await jwt.verify(token, "secretKey");
        let user = verifiedToken.usuario;
        
        let data = await db.collection("reportesEU").deleteOne({id: Number(req.params.id)});
        log(user, "reportesEU", "eliminar");
        res.json(data);
    } catch {
        res.sendStatus(401);
    }
});

// ==================== REPORTES EMERGENCIAS HOSPITALARIAS ====================

// GET /reportesEH - Listar reportes
app.get('/reportesEH', async (req, res) => {
    try{
        let token=req.get("Authentication");
        let verifiedToken=await jwt.verify(token, "secretKey");
        let user=verifiedToken.usuario;	
        if("_sort" in req.query){
            let sortBy=req.query._sort;
            let sortOrder=req.query._order=="ASC"?1:-1;
            let inicio=Number(req.query._start);
            let fin=Number(req.query._end);
            let sorter={}
            sorter[sortBy]=sortOrder;
            let data= await db.collection("reportesEH").find({}).sort(sorter).project({_id:0}).toArray();
            res.set("Access-Control-Expose-Headers", "X-Total-Count");
            res.set("X-Total-Count", data.length);
            data=data.slice(inicio,fin)
            log(user, "reportesEH", "leer");
            res.json(data)
        }else if("id" in req.query){
            let data=[];
            for(let index=0; index<req.query.id.length; index++){
                let dataParcial=await db.collection("reportesEH").find({id: Number(req.query.id[index])}).project({_id:0}).toArray()
                data= await data.concat(dataParcial);
            }
            res.json(data);
        }else{
            let data=await db.collection("reportesEH").find(req.query).project({_id:0}).toArray();
            res.set("Access-Control-Expose-Headers", "X-Total-Count");
            res.set("X-Total-Count", data.length);
            res.json(data);
        }
    }catch{
        res.sendStatus(401);
    }
});

// GET /reportesEH/:id - Obtener un reporte específico
app.get("/reportesEH/:id", async (req, res) => {
    try {
        let token = req.get("Authentication");
        let verifiedToken = await jwt.verify(token, "secretKey");
        let user = verifiedToken.usuario;
        
        let data = await db.collection("reportesEH").find({id: Number(req.params.id)}).project({_id:0}).toArray();
        log(user, "reportesEH", "leer");
        res.json(data[0]);
    } catch {
        res.sendStatus(401);
    }
});

// POST /reportesEH - Crear un nuevo reporte
app.post('/reportesEH', async (req, res) => {
    try {
        let token = req.get("Authentication");
        let verifiedToken = await jwt.verify(token, "secretKey");
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
app.put("/reportesEH/:id", async (req, res) => {
    try {
        let token = req.get("Authentication");
        let verifiedToken = await jwt.verify(token, "secretKey");
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
app.delete("/reportesEH/:id", async (req, res) => {
    try {
        let token = req.get("Authentication");
        let verifiedToken = await jwt.verify(token, "secretKey");
        let user = verifiedToken.usuario;
        
        let data = await db.collection("reportesEH").deleteOne({id: Number(req.params.id)});
        log(user, "reportesEH", "eliminar");
        res.json(data);
    } catch {
        res.sendStatus(401);
    }
});

app.listen(PORT, ()=>{
	connectToDB();
	console.log("aplicacion corriendo en puerto 3000");
});
