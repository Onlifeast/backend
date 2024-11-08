import e from 'express';
import express from 'express';


export function getOrders(req: express.Request, res: express.Response) {
    // returns all  orders
}

export function addOrder(req: express.Request, res: express.Response) {
    // users to add new orders
}

export function updateOrder(req: express.Request, res: express.Response) {
    // users to update orders
}

export function deleteOrder(req: express.Request, res: express.Response) {
    // users to delete orders
}

export function getOrderById(req: express.Request, res: express.Response) {
    // returns a single order
}

export function getOrderItems(req: express.Request, res: express.Response) {
    // returns a single order's items
}

export function addOrderItem(req: express.Request, res: express.Response) {
    // users to add items to their orders
}

export function updateOrderItem(req: express.Request, res: express.Response) {
    // users to update items in their orders
}