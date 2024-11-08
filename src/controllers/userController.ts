import { UserTable } from "../drizzle/schema.js";
import { db } from "../drizzle/db.js";
import { eq } from "drizzle-orm";
import express from "express";
import { hashPassword, comparePasswords } from "../utils/passwordUtils.js";


export async function getUserById(req: express.Request, res: express.Response) {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "ID is required" });

    const user = await db.select().from(UserTable).where(eq(UserTable.id, id));
    if (user.length === 0) return res.status(404).json({ error: "User not found" });

    return res.status(200).json(user[0]);
}

export async function getUsers(req: express.Request, res: express.Response) {
    const users = await db.select().from(UserTable);
    if (users.length === 0) return res.status(404).json({ error: "Users not found" });
    return res.status(200).json(users);
}

export async function deleteUser(req: express.Request, res: express.Response) {
    const { id } = req.body.user.id;
    if (!id) return res.status(400).json({ error: "ID is required either user token is invalid or expired" });

    const user = await db.select().from(UserTable).where(eq(UserTable.id, id));
    if (user.length === 0) return res.status(404).json({ error: "User not found" });

    const deletedUser = await db.delete(UserTable).where(eq(UserTable.id, id)).returning();
    if (deletedUser.length === 0) return res.status(500).json({ error: "Error deleting user" });
    
    return res.status(200).json(deletedUser[0]);
}

export async function updateUserName(req: express.Request, res: express.Response) {
    const { id } = req.body.user.id;    
    if (!id) return res.status(500).json({ error: "ID is required either user token is invalid or expired" });

    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    const user = await db.select().from(UserTable).where(eq(UserTable.id, id));
    if (user.length === 0) return res.status(404).json({ error: "User not found" });

    const updatedUser = await db.update(UserTable).set({ name: name }).where(eq(UserTable.id, id)).returning();
    if (updatedUser.length === 0) return res.status(500).json({ error: "Error updating user" });
    return res.status(200).json(updatedUser[0]);
}

export async function updateUserEmail(req: express.Request, res: express.Response) {
    const { email, newEmail } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });
    if (!email.includes("@")) return res.status(400).json({ error: "Email is invalid" });

    const user = await db.select().from(UserTable).where(eq(UserTable.email, email));
    if (user.length === 0) return res.status(404).json({ error: "User  with email not found" });

    const updatedUser = await db.update(UserTable).set({ email: newEmail }).where(eq(UserTable.email, email)).returning();
    if (updatedUser.length === 0) return res.status(500).json({ error: "Error updating user" });
    return res.status(200).json(updatedUser[0]);
}

export async function updatePassword(req: express.Request, res: express.Response) {
    const { id } = req.body.user.id;
    if (!id) return res.status(500).json({ error: "ID is required either user user token is invalid or expired" });

    const { password, newPassword } = req.body;
    if (!password) return res.status(400).json({ error: "Password is required" });
    if (!newPassword) return res.status(400).json({ error: "New password is required" });
    if (password === newPassword) return res.status(400).json({ error: "New password cannot be the same as the old password" });
    if (newPassword.length < 8) return res.status(400).json({ error: "New password must be at least 8 characters long" });

    const user = await db.select().from(UserTable).where(eq(UserTable.id, id));
    if (user.length === 0) return res.status(404).json({error: 'User not found'});

    // check if old password is correct
    if (!(await comparePasswords(password, user[0].password))) return res.status(400).json({ error: "Password is incorrect" });

    // hash new password
    const hashedPassword = await hashPassword(newPassword);

    const updatedUser = await db.update(UserTable).set({password: hashedPassword}).where(eq(UserTable.id, id)).returning();
    if (!updatedUser) return res.status(500).json({error: 'Error updating password'});
    return res.status(200).json({message: 'Password updated successfully'});
}

// export async function updateUserAddress(req: express.Request, res: express.Response) {
//     const { id } = req.body.user.id;
//     if (!id) return res.status(500).json({ error: "ID is required either user user token is invalid or expired" });
//     const { address } = req.body;
//     if (!address) return res.status(400).json({ error: "Address is required" });
//     const user = await db.select().from(UserTable).where(eq(UserTable.id, id));
//     if (user.length === 0) return res.status(404).json({ error: "User not found" });
//     const updatedUser = await db.update(UserTable).set({ address }).where(eq(UserTable.id, id)).returning();
//     if (updatedUser.length === 0) return res.status(500).json({ error: "Error updating user" });
//     return res.status(200).json(updatedUser[0]);
// }

export async function updateUserPhone(req: express.Request, res: express.Response) {
    const { id } = req.body.user.id;
    if (!id) return res.status(500).json({ error: "ID is required either user user token is invalid or expired" });

    const { phoneNumber } = req.body;
    if (!phoneNumber) return res.status(400).json({ error: "Phone is required" });
    if (phoneNumber.length < 10) return res.status(400).json({ error: "Phone number must be at least 10 characters long" });
    if (!phoneNumber.match(/^[0-9]+$/)) return res.status(400).json({ error: "Phone number must be a number" });

    const user = await db.select().from(UserTable).where(eq(UserTable.id, id));
    if (user.length === 0) return res.status(404).json({ error: "User not found" });

    const updatedUser = await db.update(UserTable).set({ phone_number: phoneNumber }).where(eq(UserTable.id, id)).returning();
    if (updatedUser.length === 0) return res.status(500).json({ error: "Error updating user" });
    return res.status(200).json(updatedUser[0]);
}