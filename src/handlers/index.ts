import { User } from '../models/User';
import type {Request, Response} from 'express';
import { comparePassword, hashPassword } from '../utils/auth';
import slugify from 'slugify';
import { generateJWT, validateJWT } from '../utils/jwt';
import formidable from 'formidable';
import cloudinary from '../config/cloudinary';
import { v4 as uuid} from 'uuid';

export const createAccount = async (req: Request, res:Response ) => {
    const {name, email, password, handle} = req.body;

    const userExists = await User.findOne({email});
    if(userExists){
        res.status(400).json('El correo ya se encuentra registrado');
        return;
    }

    const handleRequest  = slugify(handle, {lower: true});
    const handleExists = await User.findOne({handle: handleRequest});
    if(handleExists){
        res.status(400).json('El nombre de usuario ya se encuentra registrado');
        return;
    }

    try {
        const user = await User.create({
            name,
            handle : handleRequest,
            email, 
            password : await hashPassword(password)
        });
        const token = generateJWT({id: user.id})
        res.status(201).json({
            message: 'Usuario creado correctamente',
            token
        });
        return;
    } catch (error) {
        res.status(500).json('Error al crear el usuario');
        return; 
    }

}

export const login = async (req : Request, res: Response) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if(!user){
        res.status(404).json('No existe un usuario con el correo indicado');
        return;
    }

    const isValidPassword = await comparePassword(password, user.password);
    if(!isValidPassword){
        res.status(401).json('Contraseña incorrecta');
        return;
    }

    const token = generateJWT({id: user.id});
    res.send(token);
    
}

export const getUser = async (req : Request, res: Response) => {
    const user = req.user;
    res.json(user);
    return;
}

export const updateProfile = async (req : Request, res: Response) => {
    const {description, links} = req.body;
    const handle = slugify(req.body.handle, {lower: true});
    try {
        //tomamos el user del request
        const user = req.user;
        if(handle !== user.handle){
            const existingUser = await User.findOne({handle});
            if(existingUser){
                const error = new Error('El nombre de usuario ya se encuentra registrado');
                res.status(409).json({error: error.message});
                return;
            }
            user.handle = handle;
        }
        user.description = description;
        user.links = links;
        await user.save();
        res.json('Usuario actualizado correctamente');
        return;
    } catch (e) {
        const error = new Error('Error al actualizar el perfil')
        res.status(500).json({error: error.message});
        return;
    }
}

export const uploadImage = async (req : Request, res: Response) => {
    //formidable para leer las imagenes
    const form = formidable({ multiples: false });
    const extractUUID = (url : string) => {
        const regex = /(?:v\d+\/)([^\/]+)\.[^\/]+$/;
        const match = url.match(regex);
        return match ? match[1].split('.')[0] : null;
    }
    try {
        if(req.user.image){
            const oldImage = extractUUID(req.user.image);
            await cloudinary.api.delete_resources([oldImage], { 
                    type: 'upload', 
                    resource_type: 'image' 
            });
        }
        form.parse(req, (err, fields, files) => {
            //files son los archivos que se mandan, y tenemos que obtener el elemento con el nombre que mandemos en la peticion
            cloudinary.uploader.upload(files.image[0].filepath, {
                //podemos establecer valores aqui como nombres, o tamaños
                public_id : uuid(),
                quality: "auto",
                width: 1200,
                crop: "scale",
                fetch_format: "auto"
            }, async function (error, result) {
                if(error){
                    const error = new Error('Error al cargar la imagen')
                    res.status(500).json({error: error.message});
                    return;
                }
                if(result){
                    req.user.image = result.secure_url;
                    await req.user.save();
                    res.json({image : result.secure_url});
                    return;
                }
            })
        });
    } catch (e) {
        const error = new Error('Error al actualizar el perfil')
        res.status(500).json({error: error.message});
        return;
    }
}

export const getUserByHandle = async (req : Request, res: Response) => {
    try {
        //extraemos el handle
        const { handle } = req.params;
        if(handle) {
            const user = await User.findOne({ handle }).select('-password -_id -__v -email');
            if(!user){
                const error = new Error('El usuario no existe')
                res.status(404).json({ error: error.message });
                return 
            }
            res.json(user);
            return 
        }
        const error = new Error('El handle no es valido')
        res.status(500).json({error: error.message});
        return;
    } catch (e) {
        const error = new Error('Hubo un error');
        res.status(500).json({error: error.message});
        return;
    }
}

export const searchByhandle = async(req: Request, res: Response) => {
    const {handle} = req.params;
    try {
        const userExists = await User.findOne({handle});
        if(userExists) {
            const error = new Error(`${handle} ya se encuentra registrado`);
            res.status(409).json({error: error.message});
            return;
        }
        res.json(`${handle} esta disponible`);
        return;
    } catch (e) {
        const error = new Error('Ocurrio un error')
        res.status(500).json({error: error.message});
        return;
    }
} 