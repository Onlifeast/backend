import express from "express";

const paymentRouter = express.Router();

paymentRouter.post('/initialise', (req: express.Request, res: express.Response) => {
    // users to start the payment process
})
.put('/confirm', (req: express.Request, res: express.Response) => {
    // users to confirm the payment
})

export default paymentRouter;