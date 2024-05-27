import { Router } from "express";
import { ProductManager } from '../config/ProductManager.js'
import logger from '../utils/logger.js';

const productManager = new ProductManager('./src/data/products.json')
const productsRouter = Router()

productsRouter.get('/', async (req, res) => {
    try {
        const { limit, page, filter, ord } = req.query;
        let metFilter;
        const pag = page !== undefined ? page : 1;
        const limi = limit !== undefined ? limit : 10;

        if (filter == "true" || filter == "false") {
            metFilter = "status"
        } else {
            if (filter !== undefined)
                metFilter = "category";
        }

        const query = metFilter != undefined ? { [metFilter]: filter } : {};
        const ordQuery = ord !== undefined ? { price: ord } : {};

        logger.info(`Consultando productos con query: ${JSON.stringify(query)} y orden: ${JSON.stringify(ordQuery)}`);

        const prods = await productModel.paginate(query, { limit: limi, page: pag, sort: ordQuery });
        logger.info(`Productos obtenidos: ${JSON.stringify(prods)}`);
        res.status(200).send(prods)

    } catch (error) {
        logger.error(`Error al consultar productos: ${error}`);
        res.status(500).render('templates/error', {
            error: error,
        });
    }
});


productsRouter.get('/:pid', async (req, res) => {
    try {
        const idProducto = req.params.pid 
        const prod = await productManager.getProductById(idProducto)
        if (prod) {
            logger.info(`Producto ${idProducto} encontrado: ${JSON.stringify(prod)}`);
            res.status(200).send(prod)
    }
        else {
            logger.warning(`Producto ${idProducto} no encontrado`);
            res.status(404).send("Producto no existe")
        }
    } catch (error) {
        logger.error(`Error al consultar el producto ${req.params.pid}: ${error}`);
        res.status(500).send(`Error interno del servidor al consultar producto: ${error}`)
    }
})

productsRouter.post('/', async (req, res) => {
    try {
        const product = req.body
        logger.info(`Creando producto: ${JSON.stringify(product)}`);
        const mensaje = await productManager.addProduct(product)
        if (mensaje == "Producto cargado correctamente") {
            logger.info(`Producto creado correctamente: ${JSON.stringify(product)}`);
            res.status(200).send(mensaje)
        }
        else{

            logger.warning(`Error al crear producto: ${mensaje}`);
            res.status(400).send(mensaje)
        }
    } catch (error) {
        logger.error(`Error al crear producto: ${error}`);
        res.status(500).send(`Error interno del servidor al crear producto: ${error}`)
    }
})

productsRouter.put('/:pid', async (req, res) => {
    try {
        const idProducto = req.params.pid;
        const updateProduct = req.body;
        logger.info(`Actualizando producto ${idProducto} con datos: ${JSON.stringify(updateProduct)}`);
        const mensaje = await productManager.updateProduct(idProducto, updateProduct)
        if (mensaje == "Producto actualizado correctamente"){
            logger.info(`Producto ${idProducto} actualizado correctamente`);
            res.status(200).send(mensaje)
        }
        else {
            logger.warning(`Error al actualizar producto ${idProducto}: ${mensaje}`);
            res.status(404).send(mensaje)
        }
    } catch (error) {
        logger.error(`Error al actualizar el producto ${req.params.pid}: ${error}`);
        res.status(500).send(`Error interno del servidor al actualizar producto: ${error}`)
    }
})

productsRouter.delete('/:pid', async (req, res) => {
    try {
        const idProducto = req.params.pid
        logger.info(`Eliminando producto ${idProducto}`);
        const mensaje = await productManager.deleteProduct(idProducto)
        if (mensaje == "Producto eliminado correctamente") {
            logger.info(`Producto ${idProducto} eliminado correctamente`);
            res.status(200).send(mensaje)
        }
        else {
            logger.warning(`Error al eliminar producto ${idProducto}: ${mensaje}`);
            res.status(404).send(mensaje)
        }
    } catch (error) {
        logger.error(`Error al eliminar el producto ${req.params.pid}: ${error}`);
        res.status(500).send(`Error interno del servidor al eliminar producto: ${error}`)
    }
})

export default productsRouter