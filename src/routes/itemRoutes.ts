import express from 'express';
import { getItems, getItem } from '../controllers/itemController.js';


const itemsRouter = express.Router()


itemsRouter.get('/', (req: express.Request, res: express.Response) => {
    // returns all  items
    getItems(req, res);
});

itemsRouter.get('/:id', (req: express.Request, res: express.Response) => {
    // returns a single item
    getItem(req, res);
});

export default itemsRouter;