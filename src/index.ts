import colors from "colors";
import app from "./server";

const port = +process.env.PORT || 3000;

//Escuchamos en el puerto 3000
app.listen(port, () => {
    console.log(colors.magenta.italic('Server is running on port:'), port);
});