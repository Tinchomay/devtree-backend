import { NextFunction, Request, Response } from 'express';
import { validateJWT } from '../utils/jwt';
import { IUser, User } from '../models/User';
//con declare global exponemos la interfaz a todo el proyecto
declare global {
    //Seleccionamos Express que es donde estamos trabajando
    namespace Express {
        //Seleccionamos la interfaz de request de express
        interface Request {
            //agregamos una nueva propiedad y que estructura va a tener
            user?: IUser;
        }
    }
}
export const authenticate = async (req : Request, res : Response, next : NextFunction) => {  
    const bearer = req.headers.authorization;
    if(!bearer) {
        const error = new Error('No autorizado');
        res.status(401).json({error: error.message});
        return 
    }
    //extraemos el token
    const [, token] = bearer.split(' ');
    if(!token) {
        const error = new Error('No autorizado');
        res.status(401).json({error: error.message});
        return 
    }
    //consultamos el token y hacemos la consulta a la BD y algun posible error con la BD
    try {
        const id = validateJWT(token);
        if (!id){
            res.status(401).json({ message: 'Token inválido' });
            return;
        } 
        const user = await User.findById(id).select(['-password']);
        if (!user){
            res.status(404).json({ message: 'No existe un usuario con el id indicado'});
            return;
        }
        req.user = user;
        next();
        return;
    } catch (error) {
        res.status(500).json({ message: error.message });
        return;
    }
}