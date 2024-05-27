import { Router } from "express";
import { userModel } from "../models/user.js";

const userRouter = Router()

userRouter.get('/', async (req, res) => {
    try {
        const users = await userModel.find();
        logger.info("Consulta de usuarios exitosa");
        res.status(200).send(users);
    } catch (e) {
        logger.error(`Error al consultar usuarios: ${e}`);
        res.status(500).send(`Error al consultar usuarios: ${e}`);
    }
});

export default userRouter