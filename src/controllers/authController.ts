import { Request, Response } from 'express';
import { db } from "../drizzle/db.js";
import { UserTable } from "../drizzle/schema.js";
import { hashPassword, comparePasswords } from "../utils/passwordUtils.js";
import { generateToken } from "../utils/jwtUtils.js";
import { generateSecretKey } from "../utils/keys.js";
import { eq } from "drizzle-orm";

interface CreateUserRequest {
    name: string;
    email: string;
    password: string;
}

interface loginUserRequest {
    name: string;
    email: string;
    password: string;
}

export async function createUser(req: Request, res: Response) {
    const { name, email, password }: CreateUserRequest = req.body;

    console.log("Received request to create user:", req.body);
    if (!name) return res.status(400).json({ error: "Name is required" });
    if (!email) return res.status(400).json({ error: "Email is required" });
    if (!password) return res.status(400).json({ error: "Password is required" });

    try {
        const existingUser = await db.select().from(UserTable).where(eq(UserTable.email, email));
        
        if (existingUser.length > 0) {
            return res.status(409).json({ error: "User with this email already exists" });
        }

        const hashedPassword = await hashPassword(password);
            
        const result = await db.insert(UserTable).values({
            name,
            email,
            password: hashedPassword,
            secret_key: generateSecretKey(),
        }).returning({
            id: UserTable.id,
            name: UserTable.name,
            email: UserTable.email,
            secret_key: UserTable.secret_key
        });

        const token = generateToken({ id: result[0].id }, result[0].secret_key);

        return res.status(201).json({
            name: result[0].name,
            email: result[0].email,
            token
        });
    } catch (error) {
        console.error("Failed to create user:", error);
        res.status(500).json({ error: "Failed to create user" });
    }
}

export async function loginUser(req: Request, res: Response) {
    const { email, password }: loginUserRequest = req.body;

    if (!email) return res.status(400).json({ error: "Email is required" });
    if (!password) return res.status(400).json({ error: "Password is required" });

    try {
        const user = await db.select().from(UserTable).where(eq(UserTable.email, email));
        if (user.length === 0) return res.status(404).json({ error: "User with email does not exist" });

        // validate password
        const isValidPassword = await comparePasswords(password, user[0].password);
        if (!isValidPassword) return res.status(401).json({ error: "Invalid password" });

        // generate token
        const token = generateToken({ id: user[0].id }, user[0].secret_key);
        return res.status(200).json({
            name: user[0].name,
            email: user[0].email,
            token
        });
    }catch (error) {
        console.error("Failed to login user");
        return res.status(501).json({error: "Failed to login user"});
    }
}
