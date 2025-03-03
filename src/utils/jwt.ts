import jwt, {JwtPayload} from 'jsonwebtoken';


//El payload es la informacion que va a guardar el JWT
export const generateJWT = (payload : JwtPayload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        //en las opciones ponemos cuanto tiempo queremos que dure el token, 1h una hora, 6m es seis minutos, 1d es un dia
        expiresIn: '180d'
    });
    return token;
}

export const validateJWT = (token: string) => {
    //Agregamos el try por si surgen errores en la validacion
    try {
        const result = jwt.verify(token, process.env.JWT_SECRET);
        if(typeof result === 'object' && result.id){
            return result.id;
        } 
    } catch (error) {
        return null;
    }
    return null;

};