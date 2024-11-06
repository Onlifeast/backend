import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import crypto from 'crypto';
import { text } from 'drizzle-orm/mysql-core';

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
  name: varchar('name', { length: 255}).notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  contact_info: varchar('contact_info', { length: 255 }).notNull(),
});

export const ReviewTable = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').notNull(),
  business_id: uuid('business_id').notNull(),
  rating: varchar('rating', { length: 255 }).notNull(),
  comment: varchar('comment', { length: 255 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const BusinessReviewTable = pgTable('business_reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  business_id: uuid('business_id').notNull(),
  review_id: uuid('review_id').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const UserBusinessTable = pgTable('user_businesses', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').notNull(),
  business_id: uuid('business_id').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const UserReviewTable = pgTable('user_reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').notNull(),
  review_id: uuid('review_id').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const UserBusinessReviewTable = pgTable('user_business_reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').notNull(),
  business_review_id: uuid('business_review_id').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const ItemsTable = pgTable('items', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name').notNull(),
  description: text('description').notNull(),
  price: varchar('price').notNull(),
  image: varchar('image').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
})

export const BusinessItemsTable = pgTable('business_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  business_id: uuid('business_id').notNull(),
  item_id: uuid('item_id').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const UserItemsTable = pgTable('user_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').notNull(),
  item_id: uuid('item_id').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const UserBusinessItemsTable = pgTable('user_business_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').notNull(),
  business_item_id: uuid('business_item_id').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const OrderTable = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').notNull(),
  business_id: uuid('business_id').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const OrderItemTable = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  order_id: uuid('order_id').notNull(),
  item_id: uuid('item_id').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const UserOrderTable = pgTable('user_orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').notNull(),
  order_id: uuid('order_id').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const UserBusinessOrderTable = pgTable('user_business_orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').notNull(),
  business_order_id: uuid('business_order_id').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const CartTable = pgTable('carts', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const CartItemTable = pgTable('cart_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  cart_id: uuid('cart_id').notNull(),
  item_id: uuid('item_id').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});