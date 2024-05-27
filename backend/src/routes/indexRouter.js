import cartRouter from './cartRouter.js'
import productsRouter from './productsRouter.js'
import userRouter from './userRouter.js'
import upload from '../config/multer.js'
import sessionRouter from './sessionRouter.js'
import express from 'express'
import { __dirname } from '../path.js'
import logger from '../utils/logger.js';

const logger = require('../utils/logger');
const indexRouter = express.Router()

//Routes
indexRouter.get('/', (req, res) => {
    res.status(200).send("Bienvenido/a!")
})
indexRouter.use('/public', express.static(__dirname + '/public'))
indexRouter.use('/api/products', productsRouter, express.static(__dirname + '/public'))
indexRouter.use('/api/cart', cartRouter)
indexRouter.use('/api/users', userRouter)
indexRouter.use('/api/session', sessionRouter)

indexRouter.post('/upload', upload.single('product'), (req, res) => {
    try {
        logger.info('Archivo cargado:', req.file);
        res.status(200).send("Imagen cargada correctamente")
    } catch (e) {
        logger.error('Error al cargar imagen:', e);
        res.status(500).send("Error al cargar imagen")
    }
})

router.get('/loggerTest', (req, res) => {
    logger.debug('This is a debug log');
    logger.http('This is an HTTP log');
    logger.info('This is an info log');
    logger.warning('This is a warning log');
    logger.error('This is an error log');
    logger.fatal('This is a fatal log');
    
    res.send('Logger test completed. Check the logs for output.');
  });

export default indexRouter