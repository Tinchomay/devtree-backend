import colors from "colors";
import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        //obtenemos la url de atlas le quitamos la ultima parte y ponemos el nombre de la bd
        const MONGO_URI = process.env.MONGO_URI;
        const {connection} = await mongoose.connect(MONGO_URI);
        //podemos ver a que servidor estamos conectados
        const url = `${connection.host}:${connection.port}`
        console.log(colors.cyan.bold(`MongoDB Conectado en ${url}`))
    } catch (error) {
        console.log(error)
        process.exit(1);
    }
}