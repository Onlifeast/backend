import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import crypto from 'crypto';
export const UserTable = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    password: varchar('password').notNull(),
    role: varchar('role').notNull().default('user'),
    secret_key: varchar('secret_key').notNull().default(crypto.randomBytes(32).toString('hex')),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});
