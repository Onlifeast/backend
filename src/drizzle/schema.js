import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const UserTable = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255}).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  password: varchar('password').notNull(),
  role: varchar('role').notNull().default('user'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});