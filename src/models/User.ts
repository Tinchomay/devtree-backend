import mongoose, { Schema, Document } from "mongoose";

//definimos la interfaz para el usuario
export interface IUser extends Document {
    handle : string;
    name: string;
    email: string;
    password: string;
    description: string;
    image: string;
    links: string;
}

//definimos schema
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    handle: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    links: {
        type: String,
        default: '[]'
    }
})

//exportamos el modelo pasando como generico la interfaz para garantizar que asi seran los documentos que crearemos
export const User = mongoose.model<IUser>('User', userSchema);