import express from 'express';
import { OrderTable, OrderItemsTable, UserTable, ItemsTable } from '../drizzle/schema.js';
import { db } from '../drizzle/db.js';
import { eq, and, sql } from 'drizzle-orm';



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
    const { id } = req.body.user.id;
    const { orderItems } = req.body;

    if (!id) {
        return res.status(400).json({success: false, message: 'Invalid user'});
    }

    if (!orderItems || !Array.isArray(orderItems)) {
        return res.status(400).json({success: false, message: 'Invalid order items'});
    }

    try {
        await db.transaction(async (trx) => {
            let totalPrice = 0;
            const orderItemsData = [];

            for (const orderItem of orderItems) {
                const itemDetails = await trx
                    .select({ id: ItemsTable.id, price: ItemsTable.price, stock: ItemsTable.stock })
                    .from(ItemsTable)
                    .where(eq(ItemsTable.id, orderItem.item_id))
                    .limit(1);

                if (!itemDetails || itemDetails.length === 0) {
                    return res.status(404).json({success: false, message: 'Item is out of stock or insufficient stock'});
                }

                totalPrice += itemDetails[0].price * orderItem.quantity;

                await trx
                    .update(ItemsTable)
                    .set({ stock: itemDetails[0].stock - orderItem.quantity })
                    .where(eq(ItemsTable.id, orderItem.item_id));

                orderItemsData.push({
                    item_id: orderItem.item_id,
                    quantity: orderItem.quantity,
                    price: orderItem.price,
                });
            }

            // create new order
            const [order] = await trx
                .insert(OrderTable)
                .values({
                    user_id: id,
                    total_price: totalPrice,
                    status: 'pending',                                       
                })
                .returning();

            // create order items
            await trx
                .insert(OrderItemsTable)
                .values(orderItemsData.map((item) => ({
                    order_id: order.id,
                    ...item,
                })));
            return res.status(201).json({
                success: true,
                message: 'Order created successfully',
                order: {
                    id: order.id,
                    userId: order.user_id,
                    status: order.status,
                    total_price: order.total_price,
                    items: orderItemsData
                }
            });
        })
    } catch (error) {
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
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
    const { orderId } = req.params;

    try {
        db.transaction(async (trx) => {
            const order = await trx
                .select({ id: OrderTable.id })
                .from(OrderTable)
                .where(eq(OrderTable.id, orderId))
                .limit(1);
            if (!order) {
                return res.status(404).json({success: false, message: 'Order not found'});
            }

            // Fetch the items for the order
            const orderItems = await trx
                .select({ id: OrderItemsTable.id, quantity: OrderItemsTable.quantity })
                .from(OrderItemsTable)
                .where(eq(OrderItemsTable.order_id, orderId));

            // Restore stock for each item
            for (const orderItem of orderItems) {
                const itemDetails = await trx
                    .update(ItemsTable)
                    .set({ stock: sql`${ItemsTable.stock} + ${orderItem.quantity}` })
                    .where(eq(ItemsTable.id, orderItem.id))
            }

            // delete order items
            await trx.delete(OrderItemsTable).where(eq(OrderItemsTable.order_id, orderId));

            // delete order
            await trx.delete(OrderTable).where(eq(OrderTable.id, orderId));
        });
    } catch (error) {
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
}

export async function getOrderById(req: express.Request, res: express.Response) {
    // returns a single order

    const { orderId } = req.params;

    if (!orderId) {
        return res.status(400).json({success: false, message: 'Order ID is required'});
    }

    try {
        const orderDetails = await db.select({
            id: OrderTable.id,
            user_id: OrderTable.user_id,
            status: OrderTable.status,
            created_at: OrderTable.created_at,
            updated_at: OrderTable.updated_at,
            total: sql<number>`COALESCE(SUM(${OrderItemsTable.quantity} * ${OrderItemsTable.price}), 0)`
        })
            .from(OrderTable)
            .where(eq(OrderTable.id, orderId))
            .leftJoin(OrderItemsTable, eq(OrderItemsTable.order_id, OrderTable.id))
            .groupBy(OrderTable.id);
        if (!orderDetails) {
            return res.status(404).json({success: false, message: 'Order not found'});
        }

        return res.status(200).json({success: true, order: orderDetails[0]});
    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
}