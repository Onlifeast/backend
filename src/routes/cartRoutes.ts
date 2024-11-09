import express from 'express';

const cartRouter = express.Router()

cartRouter.post('/add', (req: express.Request, res: express.Response) => {
    // add item to cart
})
.get('/', (req: express.Request, res: express.Response) => {
    // view cart
})
.put('/update', (req: express.Request, res: express.Response) => {
    // update cart
})
.delete('/remove', (req: express.Request, res: express.Response) => {
    // remove item from cart
})
.delete('/clear', (req: express.Request, res: express.Response) => {
    // clear cart
})
.post('/checkout', (req: express.Request, res: express.Response) => {
    // process payment
})

export default cartRouter;