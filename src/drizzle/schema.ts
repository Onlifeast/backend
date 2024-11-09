import { doublePrecision, integer, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import crypto from 'crypto';
import { relations } from 'drizzle-orm';

export const UserTable = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255}).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone_number: varchar('phone_number', { length: 255 }).notNull(),
  password: varchar('password').notNull(),
  role: varchar('role').notNull().default('user'),
  secret_key: varchar('secret_key').notNull().default(crypto.randomBytes(32).toString('hex')),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const UserRelations = relations(UserTable, ({many}) => ({
  cart: many(CartTable),
  order: many(OrderTable)
}));


export const BusinessTable = pgTable('businesses', {
  id: uuid('id').primaryKey().defaultRandom(),
  business_name: varchar('business_name', { length: 255 }).notNull(),
  location: varchar('location', {length: 255}).notNull(),
  contact_info: varchar('contact_info').notNull().array(2),
  owner_id: uuid('owner_id').notNull().references(() => UserTable.id),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const BusinessRelations = relations(BusinessTable, ({one, many}) => ({
  owner: one(UserTable, {
    fields: [BusinessTable.owner_id],
    references: [UserTable.id]
  }),
  items: many(ItemsTable)
}));

export const ItemsTable = pgTable('items', {
  id: uuid('id').primaryKey().defaultRandom(),
  item_name: varchar('item_name').notNull(),
  description: text('description').notNull(),
  price: doublePrecision('price').notNull(),
  stock: integer('stock').notNull(),
  business_id: uuid('business_id').notNull().references(() => BusinessTable.id),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const ItemsRelations = relations(ItemsTable, ({one}) => ({
  business: one(BusinessTable, {
    fields: [ItemsTable.business_id],
    references: [BusinessTable.id]
  })
}));

export const CartTable = pgTable('cart', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').notNull().references(() => UserTable.id),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const CartRelations = relations(CartTable, ({one, many}) => ({
  user: one(UserTable, {
    fields: [CartTable.user_id],
    references: [UserTable.id]
  }),
  cartItems: many(CartItemsTable)
}));

export const CartItemsTable = pgTable('cartitems', {
  id: uuid('id').primaryKey().defaultRandom(),
  quantity: integer('quantity').notNull().default(0),
  cart_id: uuid('cart_id').notNull().references(() => CartTable.id),
  item_id: uuid('item_id').notNull().references(() => ItemsTable.id),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const CartItemRelations = relations(CartItemsTable, ({one}) => ({
  cart: one(CartTable, {
    fields: [CartItemsTable.cart_id],
    references: [CartTable.id]
  }),
  item: one(ItemsTable, {
    fields: [CartItemsTable.item_id],
    references: [ItemsTable.id]
  })
}));
export const OrderTable = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').notNull().references(() => UserTable.id),
  status: varchar('status').notNull().default('pending'),
  total_price: doublePrecision('total_price').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const OrderRelations = relations(OrderTable, ({one, many}) => ({
  user: one(UserTable, {
    fields: [OrderTable.user_id],
    references: [UserTable.id]
  }),
  orderItems: many(OrderItemsTable)
}));

export const OrderItemsTable = pgTable('orderitems', {
  id: uuid('id').primaryKey().defaultRandom(),
  quantity: integer('quantity').notNull(),
  price: doublePrecision('price').notNull(),
  order_id: uuid('order_id').notNull().references(() => OrderTable.id),
  item_id: uuid('item_id').notNull().references(() => ItemsTable.id),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const OrderItemsRelations = relations(OrderItemsTable, ({one}) => ({
  order: one(OrderTable, {
    fields: [OrderItemsTable.order_id],
    references: [OrderTable.id]
  }),
  item: one(ItemsTable, {
    fields: [OrderItemsTable.item_id],
    references: [ItemsTable.id]
  })
}));