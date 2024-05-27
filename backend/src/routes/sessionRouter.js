import { Router } from "express";
import passport from "passport";
import logger from '../utils/logger.js'; 

const sessionRouter = Router()

sessionRouter.get('/login', passport.authenticate('login'), async (req, res) => {
    try {
        if (!req.user) {
            logger.warning("Intento de login fallido: usuario o contraseña no válidos");
            return res.status(401).send("Usuario o contraseña no validos")
        }

        req.session.user = {
            email: req.user.email,
            first_name: req.user.first_name
        }
        logger.info(`Usuario ${req.user.email} logueado correctamente`);
        res.status(200).send("Usuario logueado correctamente")

    } catch (e) {
        logger.error(`Error al loguear usuario: ${e}`);
        res.status(500).send("Error al loguear usuario")
    }
})

sessionRouter.post('/register', passport.authenticate('register'), async (req, res) => {
    try {
        if (!req.user) {
            logger.warning("Intento de registro fallido: usuario ya existente");
            return res.status(400).send("Usuario ya existente en la aplicacion")
        }
        logger.info(`Usuario ${req.user.email} registrado correctamente`);
        res.status(200).send("Usuario creado correctamente")

    } catch (e) {
        logger.error(`Error al registrar usuario: ${e}`);
        res.status(500).send("Error al registrar usuario")
    }
})

sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { r })

sessionRouter.get('/githubSession', passport.authenticate('github'), async (req, res) => {
    try {
        req.session.user = {
            email: req.user.email,
            first_name: req.user.name
        };
        logger.info(`Usuario ${req.user.email} autenticado con GitHub`);
        res.redirect('/');
    } catch (e) {
        logger.error(`Error en la sesión de GitHub: ${e}`);
        res.status(500).send("Error en la sesión de GitHub");
    }
})  

sessionRouter.get('/logout', (req, res) => {
    req.session.destroy((e) => {
        if (e) {
            logger.error(`Error al cerrar sesión: ${e}`);
            res.status(500).send("Error al cerrar sesión");
        } else {
            logger.info("Sesión cerrada correctamente");
            res.status(200).redirect("/");
        }
    });
});

export default sessionRouter