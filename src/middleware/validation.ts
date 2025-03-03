import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

//Creamos el middleware, que tiene que tener el req, res y next que en dado caso de que pase el middleware lo que hacemos es ejecutar la siguiente funcion, tiene que ser de tipo NextFuncion de express
export const handleInputErrors = (req: Request, res: Response, next : NextFunction) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({errors: errors.array()});
        return;
    }
    //Si esta vacio los errores ejecutamos la siguiente funcion
    next();
}