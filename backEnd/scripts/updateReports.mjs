import { MongoClient } from 'mongodb';

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function updateReports() {
    try {
        await client.connect();
        console.log("Conectado a MongoDB");
        
        const db = client.db("proteccionCivil");
        
        // Actualizar reportes EH que no tengan creado_por
        const resultEH = await db.collection("reportesEH").updateMany(
            { creado_por: { $exists: false } },
            { $set: { creado_por: "admin", turno: "matutino" } }
        );
        
        console.log(`Actualizados ${resultEH.modifiedCount} reportes EH`);
        
        // Actualizar reportes EU que no tengan creado_por
        const resultEU = await db.collection("reportesEU").updateMany(
            { creado_por: { $exists: false } },
            { $set: { creado_por: "admin", turno: "matutino" } }
        );
        
        console.log(`Actualizados ${resultEU.modifiedCount} reportes EU`);
        
        console.log("\n Reportes actualizados");
        
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await client.close();
    }
}

updateReports();
