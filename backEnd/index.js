import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongodb from 'mongodb';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

const app = express();
// se usa cors para permitir solicitudes desde otros dominios
app.use(cors());
const PORT = process.env.PORT || 3000;

// se usa body-parser para parsear el cuerpo de las solicitudes
app.use(bodyParser.json());

// Funcion para registrar logs de acciones
const log = async (sujeto, objeto, accion)=>{  
    toLog = {};
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
            let incio = Number(req.query._start) || 0;
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
        }
        else{
            let data = await db.colllection("ejemplo402").find({}).project({_id:0}).toArray();
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
// la funcion updateOne recibe un objeto JSON en el cuerpo de la solicitud
// y actualiza el documento con el id especificado en la URL
app.put("/reportes/:id", async(req,res)=>{
	let valores=req.body
	valores["id"]=Number(valores["id"])
	let data =await db.collection("ejemplo402").updateOne({"id":valores["id"]}, {"$set":valores})
	data=await db.collection("ejemplo402").find({"id":valores["id"]}).project({_id:0}).toArray();
	res.json(data[0]);
})

async function connectToDB(){
	let client=new MongoClient("mongodb://127.0.0.1:27017/tc2007b" || process.env.MONGODB_URI);
	await client.connect();
	db=client.db();
	console.log("conectado a la base de datos");
}

// Registro de usuarios
// La funcion registra un nuevo usuario en la coleccion "usuarios402"
// El password se guarda hasheado con argon2
// Si el usuario ya existe, se devuelve un error 403
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

// Login de usuarios
// La funcion verifica las credenciales del usuario
// Si son correctas, devuelve un token JWT
// Si no, devuelve un error 401
app.post("/login", async (req, res)=>{
	let user=req.body.username;
	let pass=req.body.password;
	let data=await db.collection("usuarios402").findOne({"usuario":user});
	if(data==null){
		res.sendStatus(401);
	}else if(await argon2.verify(data.password, pass)){
		let token=jwt.sign({"usuario":data.usuario, "tipo":data.tipo}, "secretKey", {expiresIn: 900})
		res.json({"token":token, "id":data.usuario, "nombre":data.nombre, "tipo":data.tipo});
	}else{
		res.sendStatus(401);
	}
})



// middleware para verificar quien es el usuario autenticado
const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user){
            return res.status(401).json({ message: 'No autorizado' });
        }
        if(!allowedRoles.includes(req.user.tipo)){
            return res.status(403).json({ message: 'Acceso denegado' });
        }
        next();
    }
}

//getMyReportes
// La funcion getMyReportes devuelve los reportes creados por el usuario autenticado
// Requiere autenticacion con JWT
app.get("reportes/mis-reportes", async (req, res)=>{
    try {
        let token = req.get("Authentication");
        let verifedToken = await jwt.verify(token, 'secretKey');

    }
    catch(error){
        res.status(401).json({ message: 'No autorizado', error: error.message });
    }
});

app.listen(PORT, ()=>{
	connectToDB();
	console.log("aplicacion corriendo en puerto 3000");
});


