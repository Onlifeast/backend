import express from 'express';


const orderRouter = express.Router();

orderRouter.get('/', (req: express.Request, res: express.Response) => {
    // get all orders (to admin)
})

orderRouter.get('/:id', (req: express.Request, res: express.Response) => {
    // get order by id (to admin)
})

orderRouter.post('/', (req: express.Request, res: express.Response) => {
    // create order (to user)
})

orderRouter.put('/:id', (req: express.Request, res: express.Response) => {
    // update order (to user)
})

orderRouter.delete('/:id', (req: express.Request, res: express.Response) => {
    // delete order (to user)
})

export default orderRouter;