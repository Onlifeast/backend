import { doublePrecision, integer, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import crypto from 'crypto';

export const UserTable = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255}).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  password: varchar('password').notNull(),
  role: varchar('role').notNull().default('user'),
  secret_key: varchar('secret_key').notNull().default(crypto.randomBytes(32).toString('hex')),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});


export const BusinessTable = pgTable('businesses', {
  id: uuid('id').primaryKey().defaultRandom(),
  business_name: varchar('business_name', { length: 255 }).notNull(),
  location: varchar('location', {length: 255}).notNull(),
  contact_info: varchar('contact_info').notNull().array(2),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const ItemsTable = pgTable('items', {
  id: uuid('id').primaryKey().defaultRandom(),
  item_name: varchar('item_name').notNull(),
  description: text('description').notNull(),
  price: doublePrecision('price').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const CartTable = pgTable('cart', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const CartItems = pgTable('cartitems', {
  id: uuid('id').primaryKey().defaultRandom(),
  quantity: integer('quantity').notNull().default(0),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const OrderTable = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const OrderItemsTable = pgTable('orderitems', {
  id: uuid('id').primaryKey().defaultRandom(),
  quantity: integer('quantity').notNull(),
  price: doublePrecision('price').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});