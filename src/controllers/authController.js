import { db } from "../drizzle/db.js";
import { UserTable } from "../drizzle/schema.js";
import { hashPassword, comparePasswords } from "../utils/passwordUtils.js";

export async function createUser(req, res) {
    const { name, email, password } = req.body;

    if (!name) return res.status(400).json({ error: "Name is required" });
    if (!email) return res.status(400).json({ error: "Email is required" });
    if (!password) return res.status(400).json({ error: "Password is required" });

    try {
        // Check if user exists
        const existingUser = await db.select().from(UserTable).where(eq(UserTable.email, email));
        
        if (existingUser.length > 0) {
            return res.status(409).json({ error: "User with this email already exists" });
        }

        // hash the password
        const hashedPassword = await hashPassword(password);
            
        const result = await db.insert(UserTable).values({
            name,
            email,
            password: hashedPassword,
        }).returning({
            id: UserTable.id,
            name: UserTable.name,
            email: UserTable.email
        });

        res.status(201).json(result);
    } catch (error) {
        console.error("Failed to create user:", error);
        res.status(500).json({ error: "Failed to create user" });
    }
}


export async function loginUser(req, res) {
    const { email, password } = req.body;

    if (!email) return res.status(400).json({ error: "Email is required" });
    if (!password) return res.status(400).json({ error: "Password is required" });

    try {
        const user = await db.query.UserTable.findFirst({
        where: (user, { eq }) => eq(user.email, email),
        });
        if (!user) return res.status(401).json({ error: "Invalid credentials" });
        const isPasswordValid = await comparePasswords(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ error: "Invalid credentials" });
        res.status(200).json({ message: "Login successful" });
    }
    catch (error) {
        console.error("Failed to login user:", error);
        res.status(500).json({ error: "Failed to login user" });
    }
}