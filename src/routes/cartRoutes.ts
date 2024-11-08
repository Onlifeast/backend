import express from 'express';

const cartRouter = express.Router()

cartRouter.get('/', (req: express.Request, res: express.Response) => {
    // returns all  carts to admin
});

cartRouter.put('/', (req: express.Request, res: express.Response) => {
    // users to add new carts
});

cartRouter.put('/', (req: express.Request, res: express.Response) => {
    // users to update carts
});

cartRouter.post('/', (req: express.Request, res: express.Response) => {
    // users to add items to their carts
});

export default cartRouter;