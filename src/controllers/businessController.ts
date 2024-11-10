import e from 'express';
import express from 'express';
import { BusinessTable } from '../drizzle/schema.js';
import { db } from '../drizzle/db.js';
import { eq } from 'drizzle-orm';

export function getBusinesses(req: express.Request, res: express.Response) {
    // returns all  business
    const businesses = db.select().from(BusinessTable);
    if (!businesses) {
        return res.status(404).json({success: false, message: 'No businesses found'});
    }
    return res.status(200).json({success: true, businesses});

}

export function addBusiness(req: express.Request, res: express.Response) {
    // admins to register new businesses
    const { name, description, location, contact_info, businesOwnerId } = req.body;

    if (!name) return res.status(400).json({success: false, message: 'Name is required'});
    if (!description) return res.status(400).json({success: false, message: 'Description is required'});
    if (!location) return res.status(400).json({success: false, message: 'Location is required'});
    if (!contact_info) return res.status(400).json({success: false, message: 'Contact info is required'});
    if (!businesOwnerId) return res.status(400).json({success: false, message: 'Business owner id is required'});

    try {
        const business = db.insert(BusinessTable).values({ business_name: name, owner_id: businesOwnerId, location, contact_info }).returning();
        return res.status(200).json({success: true, business});
    } catch (error) {
        return res.status(500).json({success: false, message: 'Internal server error'});
    }
}
export function updateBusiness(req: express.Request, res: express.Response) {
    // business to update their businesses
    const { id } = req.body.user.id;
}

export function deleteBusiness(req: express.Request, res: express.Response) {
    // business to delete their businesses
}

export function getBusinessById(req: express.Request, res: express.Response) {
    // returns a single business
}

export function getBusinessItems(req: express.Request, res: express.Response) {
    // returns a single business's items
}

export function addBusinessItem(req: express.Request, res: express.Response) {
    // business to add items to their business
}

export function updateBusinessItem(req: express.Request, res: express.Response) {
    // business to update items in their business
}

export function deleteBusinessItem(req: express.Request, res: express.Response) {
    // business to delete items from their business
}

