import { UserTable } from "../drizzle/schema.js";
import { db } from "../drizzle/db.js";
import { eq } from "drizzle-orm";
import express from "express";


export async function getUserById(req: express.Request, res: express.Response) {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "ID is required" });

    const user = await db.select().from(UserTable).where(eq(UserTable.id, id));
    if (user.length === 0) return res.status(404).json({ error: "User not found" });

    return res.status(200).json(user[0]);
}
