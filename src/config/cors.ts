import { CorsOptions } from "cors";

export const corsConfig : CorsOptions = {
    //el parametro origin es de donde se esta originando la peticion 
    origin: function(origin, callback){
        const whiteList = [process.env.FRONTEND_URL]

        //Si iniciamos el servicio como api de desarrollo que permita las conexiones de undefined porque postman no viene con origin. -- es la bandera que pasamos en el script
        if(process.argv[2] === '--api') whiteList.push(undefined);

        //definimos de donde vamos a recibir peticiones
        if(whiteList.includes(origin)){
            callback(null, true);
        } else {
            //si no es de ese lugar negamos
            callback(new Error(`Error de CORS: La solicitud de origen ${origin} no está permitida.`));
        }
    }
}