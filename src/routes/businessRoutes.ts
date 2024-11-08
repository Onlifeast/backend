import express from 'express';


const businessRouter = express.Router()

businessRouter.get('/', (req: express.Request, res: express.Response) => {
    // returns all  business
});

businessRouter.put('/', (req: express.Request, res: express.Response) => {
    // admins to register new businesses
});

businessRouter.put('/', (req: express.Request, res: express.Response) => {
    // business to update their businesses
});

businessRouter.put('/businesss/:id', (req: express.Request, res: express.Response) => {
    // business to update their businesses
});

businessRouter.delete('/:id', (req: express.Request, res: express.Response) => {
    // business to delete their businesses
});

businessRouter.get('/:id', (req: express.Request, res: express.Response) => {
    // returns a single business
});

businessRouter.get('/:id/items', (req: express.Request, res: express.Response) => {
    // returns a single business's items
});

businessRouter.post('/:id/items', (req: express.Request, res: express.Response) => {
    // business to add items to their business
});

businessRouter.put('/:id/items/:item_id', (req: express.Request, res: express.Response) => {
    // business to update items in their business
});

businessRouter.delete('/:id/items/:item_id', (req: express.Request, res: express.Response) => {
    // business to delete items from their business
});

businessRouter.get('/:id/orders', (req: express.Request, res: express.Response) => {
    // returns a single business's orders
});



export default businessRouter;

