import { Router } from "express";
import { CartManager } from "../config/CartManager.js";
const cartManager = new CartManager('./src/data/cart.json');
import Cart from '../models/cart.js'; // Importar el modelo de Carts
import logger from '../utils/logger.js';

const cartRouter = Router();

// Obtener todos los productos del carrito con detalle
cartRouter.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await Cart.findById(cartId).populate('products.id_prod');
        logger.info(`Carrito ${cartId} recuperado con éxito`);
        res.status(200).send(cart);
    } catch (error) {
        logger.error(`Error al recuperar el carrito ${req.params.cid}: ${error}`);
        res.status(500).send(`Error interno del servidor al consultar carrito: ${error}`);
    }
});

// Eliminar un producto específico del carrito
cartRouter.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const mensaje = await cartManager.removeProductFromCart(cartId, productId);
        logger.info(`Producto ${productId} eliminado del carrito ${cartId} con éxito`);
        res.status(200).send(mensaje);
    } catch (error) {
        logger.error(`Error al eliminar el producto ${req.params.pid} del carrito ${req.params.cid}: ${error}`);
        res.status(500).send(`Error interno del servidor al eliminar producto del carrito: ${error}`);
    }
});

// Actualizar el carrito con un arreglo de productos
cartRouter.put('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const { products } = req.body;
        const mensaje = await cartManager.updateCart(cartId, products);
        logger.info(`Carrito ${cartId} actualizado con éxito con los productos: ${JSON.stringify(products)}`);
        res.status(200).send(mensaje);
    } catch (error) {
        logger.error(`Error al actualizar el carrito ${req.params.cid} con los productos ${JSON.stringify(req.body.products)}: ${error}`);
        res.status(500).send(`Error interno del servidor al actualizar carrito: ${error}`);
    }
});

// Actualizar la cantidad de ejemplares de un producto en el carrito
cartRouter.put('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const { quantity } = req.body;
        const mensaje = await cartManager.updateProductQuantity(cartId, productId, quantity);
        logger.info(`Cantidad del producto ${productId} en el carrito ${cartId} actualizada a ${quantity}`);
        res.status(200).send(mensaje);
    } catch (error) {
        logger.error(`Error al actualizar la cantidad del producto ${req.params.pid} en el carrito ${req.params.cid} a ${req.body.quantity}: ${error}`);
        res.status(500).send(`Error interno del servidor al actualizar cantidad del producto en el carrito: ${error}`);
    }
});

// Eliminar todos los productos del carrito
cartRouter.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const mensaje = await cartManager.clearCart(cartId);
        logger.info(`Todos los productos eliminados del carrito ${cartId} con éxito`);
        res.status(200).send(mensaje);
    } catch (error) {
        logger.error(`Error al eliminar todos los productos del carrito ${req.params.cid}: ${error}`);
        res.status(500).send(`Error interno del servidor al eliminar todos los productos del carrito: ${error}`);
    }
});

export default cartRouter;