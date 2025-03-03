import { Router } from "express";
import { createAccount, getUser, getUserByHandle, login, searchByhandle, updateProfile, uploadImage } from "./handlers";
import {body} from 'express-validator';
import { handleInputErrors } from "./middleware/validation";
import { authenticate } from "./middleware/auth";

//Extraemos el router de express
const router = Router();

//autenticacion y registro
router.post('/auth/register', 
    body('handle').
        notEmpty().
        withMessage('El usuario es requerido'), 
    body('email').
        notEmpty().withMessage('El email es requerido').
        isEmail().withMessage('El formato de email es invalido'),  
    body('password').
        isLength({min: 8}).withMessage('El password es requerido y tiene que ser minimo de 8 caracteres'),
    body('name').
        notEmpty().
        withMessage('El nombre es requerido'),
    handleInputErrors,
    createAccount
);

router.post('/auth/login',
    body('email').
        notEmpty().withMessage('El email es requerido').
        isEmail().withMessage('El formato de email es invalido'),  
    body('password').
        notEmpty().withMessage('El password es obligatorio'),
    handleInputErrors,
    login
);

router.get('/user', authenticate, getUser);

router.patch('/user', 
    body('handle').
        notEmpty().
        withMessage('El usuario es requerido'),
    body('description').
        notEmpty().
        withMessage('La descripción es requerida'),
    handleInputErrors,
    authenticate, 
    updateProfile);

router.post('/user/image', authenticate, uploadImage);

//hacemos la ruta dinamica para obtener el handle, esto sera un parametro
router.get('/:handle', getUserByHandle);

router.post('/search',
    body('handle')
        .notEmpty()
        .withMessage('El handle es requerido'),
    handleInputErrors,
    searchByhandle);

export default router;