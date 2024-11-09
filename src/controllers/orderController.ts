import express from 'express';
import { OrderTable, OrderItemsTable, UserTable, ItemsTable } from '../drizzle/schema.js';
import { db } from '../drizzle/db.js';
import { eq, and } from 'drizzle-orm';



export async function getOrders(req: express.Request, res: express.Response) {
    // returns all  orders
    const orders = await db.select().from(OrderTable)
        .leftJoin(OrderItemsTable, eq(OrderItemsTable.order_id, OrderTable.id))
        .leftJoin(ItemsTable, eq(ItemsTable.id, OrderItemsTable.item_id))
        .leftJoin(UserTable, eq(UserTable.id, OrderTable.user_id))
        .orderBy(OrderTable.created_at);

    if (!orders) {
        return res.status(404).json({success: false, message: 'No orders found'});
    }
    return res.status(200).json({success: true, orders});
}
export async function addOrder(req: express.Request, res: express.Response) {
    // users to add new orders
    const { orderItems } = req.body;

    const { id } = req.body.user.id;
    if (!id) return res.status(500).json({ error: "ID is required either user user token is invalid or expired" });

    if (!orderItems) {
        return res.status(400).json({success: false, message: 'No order items provided'});
    }
    const order = await db.insert(OrderTable).values({
        user_id: id,
        status: 'pending',
    }).returning();

    if (!order) {
        return res.status(400).json({success: false, message: 'Order not created'});
    }

    const orderId = order[0].id;
    const orderItemsPromises = orderItems.map(async (item: any) => {
        const { item_id, quantity, price } = item;
        const orderItem = await db.insert(OrderItemsTable).values({
            order_id: orderId,
            item_id,
            quantity,
            price,
        }).returning();
        return orderItem[0];
    });

    const orderItemsAdded = await Promise.all(orderItemsPromises);
    return res.status(200).json({success: true, order: order[0], orderItems: orderItemsAdded});
}

export async function updateOrder(req: express.Request, res: express.Response) {
    // users to update orders
    const { id } = req.body.user.id;
    const { orderId } = req.params;
    const { updatedOrder } = req.body;

    try {
        await db.transaction(async (trx) => {
            const order = await trx
                .select({ id: OrderTable.id })
                .from(OrderTable)
                .where(eq(OrderTable.id, orderId))
                .limit(1);
            if (!order) {
                return res.status(404).json({success: false, message: 'Order not found'});
            }

            // Update the items
            if (updatedOrder && Array.isArray(updatedOrder)) {
                for (const item of updatedOrder) {
                    const existingItem = await trx
                        .select({ id: OrderItemsTable.id, quantity: OrderItemsTable.quantity })
                        .from(OrderItemsTable)
                        .where(and(
                            eq(OrderItemsTable.order_id, orderId),
                            eq(OrderItemsTable.item_id, item.item_id)
                        ))
                        .limit(1);

                    if (existingItem) {
                        const stockAdjustment = existingItem[0].quantity - item.quantity;
                        const itemDetails = await trx
                            .select({ stock: ItemsTable.stock })
                            .from(ItemsTable)
                            .where(eq(ItemsTable.id, item.item_id))
                            .limit(1);

                        if (!itemDetails || itemDetails[0].stock < stockAdjustment) {
                            return res.status(400).json({success: false, message: 'Not enough stock'});
                        }

                        await trx
                            .update(ItemsTable)
                            .set({ stock: stockAdjustment })
                            .where(eq(ItemsTable.id, item.item_id));

                        await trx
                            .update(OrderItemsTable)
                            .set({ quantity: item.quantity })
                            .where(and(
                                eq(OrderItemsTable.order_id, orderId),
                                eq(OrderItemsTable.item_id, item.item_id)
                            ));
                    } else {
                        const itemDetails = await trx
                            .select({ stock: ItemsTable.stock })
                            .from(ItemsTable)
                            .where(eq(ItemsTable.id, item.item_id))
                            .limit(1);
                        
                        if (!itemDetails || itemDetails[0].stock < item.quantity) {
                            return res.status(400).json({success: false, message: 'Not enough stock'});
                        }

                        await trx
                            .update(ItemsTable)
                            .set({ stock: itemDetails[0].stock - item.quantity })
                            .where(eq(ItemsTable.id, item.item_id));

                        await trx.insert(OrderItemsTable).values({
                            order_id: orderId,
                            item_id: item.item_id,
                            quantity: item.quantity,
                            price: item.price,
                        });
                    }
                }
            }

            return res.status(200).json({success: true, message: 'Order updated'});
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
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