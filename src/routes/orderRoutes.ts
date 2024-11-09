import express from 'express';
import { getOrders, addOrder, deleteOrder, updateOrder, getOrderById } from '../controllers/orderController.js';


const orderRouter = express.Router();

orderRouter.get('/', (req: express.Request, res: express.Response) => {
    // get all orders (to admin)
    getOrders(req, res);
})

orderRouter.get('/:orderId', (req: express.Request, res: express.Response) => {
    // get order by id (to admin)
    getOrderById(req, res);
})

orderRouter.post('/', (req: express.Request, res: express.Response) => {
    // create order (to user)
    addOrder(req, res);
})

orderRouter.put('/:orderId', (req: express.Request, res: express.Response) => {
    // update order (to user)
    updateOrder(req, res);
})

orderRouter.delete('/:orderId', (req: express.Request, res: express.Response) => {
    // delete order (to user)
    deleteOrder(req, res);
})

export default orderRouter;