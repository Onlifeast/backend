import express from 'express';


const itemsRouter = express.Router()


itemsRouter.get('/', (req: express.Request, res: express.Response) => {
    // returns all  items
});

itemsRouter.get('/:id', (req: express.Request, res: express.Response) => {
    // returns a single item
});

export default itemsRouter;