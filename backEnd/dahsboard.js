import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongodb from 'mongodb';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { requirePermission } from './Emergencias-PreHos/Authentication.mjs';

// se usa cors para permitir solicitudes desde otros dominios
app.use(cors());
const PORT = process.env.PORT || 3000;

// se usa body-parser para parsear el cuerpo de las solicitudes
app.use(bodyParser.json());

app.get("/dashboard/estadisticas", requirePermission("gestionar_usuarios"), async (req, res) =>{
    try{
        
    }
})