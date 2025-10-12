
import jwt from 'jsonwebtoken';



// Matriz de permisos
export const rolePermissions = {
    administrador: {
        ver_propios_reportes: true,
        ver_reportes_de_turnos: true,
        ver_todos_los_reportes: true,
        editar_reportes: true,
        subir_evidencias: true,
        gestionar_usuarios: true,
        gestionar_turnos: true,
        gestionar_roles: true,
        ver_estadisticas: true,
        exportar_datos: true,
        ver_usuarios: true,
    },
    jefeDeTurno: {
        ver_propios_reportes: true,
        ver_reportes_de_turnos: true,
        ver_estadisticas: true,
        exportar_datos: true,
        editar_reportes: true,
    },
    operador: {
        ver_propios_reportes: true,
        subir_evidencias: true,
        crear_reportes: true,
        ver_estadisticas: false,
        editar_reportes: false,
    }
};



// middleware para verificar permisos
export const requirePermission = (permission) => {
    return async (req, res, next) => {
        try {
            const token = req.get("Authentication");
            if (!token) {
                return res.status(401).json({ message: 'Token no proporcionado' });
            }

            const verifiedToken = await jwt.verify(token, 'secretKey');
            const userRole = verifiedToken.tipo;

            if (!rolePermissions[userRole] || !rolePermissions[userRole][permission]) {
                return res.status(403).json({ 
                    message: 'No tienes permiso para realizar esta acción',
                    requiredPermission: permission,
                    userRole: userRole
                }); 
            }
            
            req.user = verifiedToken;
            next();
        } catch(error) {
            res.status(401).json({ message: 'No autorizado', error: error.message });
        }
    }
};

// Filtrar reportes segun el rol del usuario
export const getReportFilter = (user) => {
    const role = user.tipo;
    const username = user.usuario;
    const turno = user.turno;

    if(role === 'administrador'){
        return {}; // Sin filtro, puede ver todos los reportes
    }
    else if(role === 'jefeDeTurno'){
        // Puede ver todos los reportes de su turno
        if(turno) {
            return { turno: turno };
        }
        return {}; // Si no tiene turno asignado, ve todos
    }
    else if(role === 'operador'){
        return { creado_por: username }; // Solo puede ver sus propios reportes
    }

    return { _id: null }; // No puede ver ningun reporte (por seguridad)
}