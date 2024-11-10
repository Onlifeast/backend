import express from 'express';
import { addToCart, viewCart, removeFromCart, clearCart, checkout } from '../controllers/cartController.js';

const cartRouter = express.Router()

cartRouter.post('/add', (req: express.Request, res: express.Response) => {
    // add item to cart
    addToCart(req, res);
})
.get('/', (req: express.Request, res: express.Response) => {
    // view cart
    viewCart(req, res);
})
.put('/update', (req: express.Request, res: express.Response) => {
    // update cart
})
.delete('/remove', (req: express.Request, res: express.Response) => {
    // remove item from cart
    removeFromCart(req, res);
})
.delete('/clear', (req: express.Request, res: express.Response) => {
    // clear cart
    clearCart(req, res);
})
.post('/checkout', (req: express.Request, res: express.Response) => {
    // process payment
    checkout(req, res);
})

export default cartRouter;