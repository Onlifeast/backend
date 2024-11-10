import express from 'express';
import { db } from '../drizzle/db.js';
import { CartTable, CartItemsTable, ItemsTable, OrderItemsTable, OrderTable } from '../drizzle/schema.js';
import { eq, and } from 'drizzle-orm';


export async function addToCart(req: express.Request, res: express.Response) {
    // users to add items to cart
    const { id } = req.body.user.id;
    const { itemId, quantity } = req.body;

    if (!id) {
        return res.status(400).json({success: false, message: 'Invalid user'});
    }

    if (!itemId) return res.status(400).json({success: false, message: 'Provide item id'});
    if (!quantity) return res.status(400).json({success: false, message: 'Provide quantity'});

    try {
        const item = await db.select().from(ItemsTable).where(eq(ItemsTable.id, itemId)).limit(1);
        if (!item) {
            return res.status(404).json({success: false, message: 'Item with itemId not found'});
        }
        if (item[0].stock < quantity) {
            return res.status(400).json({success: false, message: 'Insufficient stock'});
        }

        
        let cart, cartId
        cart = await db.select().from(CartTable).where(eq(CartTable.user_id, id)).limit(1);
        if (!cart) {
            // create cart
            cart = await db.insert(CartTable).values({ user_id: id }).returning();
        }
        cartId = cart[0].id;

        // check if item is already in cart
        const itemDetails = await db.select().from(CartItemsTable).where(and(eq(CartItemsTable.cart_id, cartId), eq(CartItemsTable.item_id, itemId))).limit(1);
        if (itemDetails.length > 0) {
            // update quantity
            await db.update(CartItemsTable).set({ quantity: itemDetails[0].quantity + quantity }).where(and(eq(CartItemsTable.cart_id, cartId), eq(CartItemsTable.item_id, itemId)));
        } else {
            // add item to cart
            await db.insert(CartItemsTable).values({ cart_id: cartId, item_id: itemId, quantity });
        }

        return res.status(200).json({success: true, message: 'Item added to cart'});

    } catch (error) {
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
}

export async function viewCart(req: express.Request, res: express.Response) {
    // users to view cart
    const { id } = req.body.user.id;
    if (!id) {
        return res.status(400).json({success: false, message: 'Invalid user'});
    }
    try {
        const cart = await db.
            select().
            from(CartTable)
            .where(eq(CartTable.user_id, id))
            .leftJoin(CartItemsTable, eq(CartItemsTable.cart_id, CartTable.id))
            .leftJoin(ItemsTable, eq(ItemsTable.id, CartItemsTable.item_id))
            .orderBy(CartItemsTable.created_at);

        if (!cart) {
            return res.status(404).json({success: false, message: 'Cart not found'});
        }
        return res.status(200).json({success: true, cart});
    } catch (error) {
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
}

export async function removeFromCart(req: express.Request, res: express.Response) {
    // users to remove items from cart
    const { id } = req.body.user.id;
    const { itemId } = req.body;

    if (!id) {
        return res.status(400).json({success: false, message: 'Invalid user'});
    }
    if (!itemId) return res.status(400).json({success: false, message: 'Provide item id'});
    try {
        const cart = await db.select().from(CartTable).where(eq(CartTable.user_id, id)).limit(1);
        if (!cart) {
            return res.status(404).json({success: false, message: 'Cart not found'});
        }
        const cartId = cart[0].id;
        const itemDetails = await db.select().from(CartItemsTable).where(and(eq(CartItemsTable.cart_id, cartId), eq(CartItemsTable.item_id, itemId))).limit(1);
        if (itemDetails.length === 0) {
            return res.status(404).json({success: false, message: 'Item not found in cart'});
        }
        await db.delete(CartItemsTable).where(and(eq(CartItemsTable.cart_id, cartId), eq(CartItemsTable.item_id, itemId)));
        return res.status(200).json({success: true, message: 'Item removed from cart'});
    } catch (error) {
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
}

export async function clearCart(req: express.Request, res: express.Response) {
    // users to clear cart
    const { id } = req.body.user.id;
    if (!id) {
        return res.status(400).json({success: false, message: 'Invalid user'});
    }
    try {
        const cart = await db.select().from(CartTable).where(eq(CartTable.user_id, id)).limit(1);
        if (!cart) {
            return res.status(404).json({success: false, message: 'Cart not found'});
        }
        const cartId = cart[0].id;
        await db.delete(CartItemsTable).where(eq(CartItemsTable.cart_id, cartId));
        return res.status(200).json({success: true, message: 'Cart cleared'});
    } catch (error) {
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
}

export async function checkout(req: express.Request, res: express.Response) {
    // users to checkout cart
    const { id } = req.body.user.id;
    if (!id) {
        return res.status(400).json({success: false, message: 'Invalid user'});
    }
    try {
        const cartItems = await db.select().from(CartItemsTable).where(eq(CartItemsTable.cart_id, id)).leftJoin(ItemsTable, eq(ItemsTable.id, CartItemsTable.item_id));
        if (cartItems.length === 0) {
            return res.status(404).json({success: false, message: 'Cart is empty'});
        }
        const insufficientStock = [];
        for (const item of cartItems) {
            const itemDetails = await db.select().from(ItemsTable).where(eq(ItemsTable.id, item.cartitems.item_id)).limit(1);
            if (itemDetails[0].stock < item.cartitems.quantity) {
                insufficientStock.push({
                    itemId: item.cartitems.item_id,
                    availableStock: item ? item.cartitems.quantity : 0,
                });
            }
        }

        if (insufficientStock.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Insufficient stock',
                insufficientStock});
        }

        // Deduct stock and create order
        const orderItems = [];
        for (const item of cartItems) {
            const itemDetails = await db.select().from(ItemsTable).where(eq(ItemsTable.id, item.cartitems.item_id)).limit(1);
            await db.update(ItemsTable).set({stock: itemDetails[0].stock - item.cartitems.quantity}).where(eq(ItemsTable.id, item.cartitems.item_id));
            orderItems.push({
                itemId: item.cartitems.item_id,
                quantity: item.cartitems.quantity,
            });
        }

        // create order
        const order = await db.insert(OrderTable).values({
            user_id: id,
            total_price: cartItems.reduce((acc, item) => acc + item.cartitems.quantity * (item.items?.price ?? 0), 0),
            status: 'processing',
        }).returning();

        for (const item of orderItems) {
            await db.insert(OrderItemsTable).values({
                order_id: order[0].id,
                item_id: item.itemId,
                quantity: item.quantity,
                price: (await db.select().from(ItemsTable).where(eq(ItemsTable.id, item.itemId)).limit(1))[0].price,
            });
        }

        // clear cart
        await db.delete(CartItemsTable).where(eq(CartItemsTable.cart_id, id));

        return res.status(200).json({
            success: true, 
            message: 'Order placed successfully',
            order: {
                id: order[0].id,
                total_price: order[0].total_price,
                status: order[0].status,
                items: orderItems,
            }
        });

    } catch (error) {
        return res.status(500).json({success: false, error: 'Internal server error'});
    }
}