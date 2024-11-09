import express from 'express';
import { db } from '../drizzle/db.js';
import { ItemsTable } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';


export async function getItem(req: express.Request, res: express.Response) {
    // returns a single item
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({success: false, message: 'Missing item id'});
    }

    const item = await db.select().from(ItemsTable).where(eq(ItemsTable.id, id)).limit(1);

    if (!item) {
        return res.status(404).json({success: false, message: 'Item not found'});
    }

    return res.status(200).json({success: true, item});
}

export function getItems(req: express.Request, res: express.Response) {
    // returns all  items
    const items = db.select().from(ItemsTable);
    if (!items) {
        return res.status(404).json({success: false, message: 'No items found'});
    }

    return res.status(200).json({success: true, items});
}