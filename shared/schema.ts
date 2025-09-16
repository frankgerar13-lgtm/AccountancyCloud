import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, integer, boolean, jsonb, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  companyName: text("company_name"),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Clients table
export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  country: text("country"),
  taxId: text("tax_id"),
  paymentTerms: integer("payment_terms").default(30),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Vendors table
export const vendors = pgTable("vendors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  country: text("country"),
  taxId: text("tax_id"),
  paymentTerms: integer("payment_terms").default(30),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Chart of Accounts
export const accounts = pgTable("accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  type: text("type").notNull(), // asset, liability, equity, revenue, expense
  subType: text("sub_type"), // current_asset, fixed_asset, etc.
  parentId: varchar("parent_id"),
  isActive: boolean("is_active").default(true),
  description: text("description"),
  balance: decimal("balance", { precision: 12, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Bank Accounts
export const bankAccounts = pgTable("bank_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  accountNumber: text("account_number"),
  bankName: text("bank_name"),
  accountType: text("account_type"), // checking, savings, credit_card
  balance: decimal("balance", { precision: 12, scale: 2 }).default("0.00"),
  isActive: boolean("is_active").default(true),
  accountId: varchar("account_id").references(() => accounts.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Invoices
export const invoices = pgTable("invoices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  invoiceNumber: text("invoice_number").notNull().unique(),
  clientId: varchar("client_id").notNull().references(() => clients.id),
  issueDate: date("issue_date").notNull(),
  dueDate: date("due_date").notNull(),
  status: text("status").notNull().default("draft"), // draft, sent, paid, overdue, cancelled
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
  taxAmount: decimal("tax_amount", { precision: 12, scale: 2 }).default("0.00"),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  paidAmount: decimal("paid_amount", { precision: 12, scale: 2 }).default("0.00"),
  notes: text("notes"),
  terms: text("terms"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Invoice Line Items
export const invoiceLineItems = pgTable("invoice_line_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  invoiceId: varchar("invoice_id").notNull().references(() => invoices.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
  rate: decimal("rate", { precision: 12, scale: 2 }).notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  accountId: varchar("account_id").references(() => accounts.id),
});

// Bills (Accounts Payable)
export const bills = pgTable("bills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  billNumber: text("bill_number"),
  vendorId: varchar("vendor_id").notNull().references(() => vendors.id),
  issueDate: date("issue_date").notNull(),
  dueDate: date("due_date").notNull(),
  status: text("status").notNull().default("pending"), // pending, paid, overdue
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
  taxAmount: decimal("tax_amount", { precision: 12, scale: 2 }).default("0.00"),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  paidAmount: decimal("paid_amount", { precision: 12, scale: 2 }).default("0.00"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Purchase Orders
export const purchaseOrders = pgTable("purchase_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  poNumber: text("po_number").notNull().unique(),
  vendorId: varchar("vendor_id").notNull().references(() => vendors.id),
  orderDate: date("order_date").notNull(),
  expectedDate: date("expected_date"),
  status: text("status").notNull().default("pending"), // pending, received, cancelled
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
  taxAmount: decimal("tax_amount", { precision: 12, scale: 2 }).default("0.00"),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Expense Claims
export const expenseClaims = pgTable("expense_claims", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  claimNumber: text("claim_number").notNull().unique(),
  userId: varchar("user_id").notNull().references(() => users.id),
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  expenseDate: date("expense_date").notNull(),
  status: text("status").notNull().default("submitted"), // submitted, approved, rejected, paid
  category: text("category"), // travel, meals, office_supplies, etc.
  accountId: varchar("account_id").references(() => accounts.id),
  receiptUrl: text("receipt_url"),
  notes: text("notes"),
  approvedBy: varchar("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Bank Transactions
export const bankTransactions = pgTable("bank_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bankAccountId: varchar("bank_account_id").notNull().references(() => bankAccounts.id),
  transactionDate: date("transaction_date").notNull(),
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  type: text("type").notNull(), // debit, credit
  balance: decimal("balance", { precision: 12, scale: 2 }),
  isReconciled: boolean("is_reconciled").default(false),
  reconciledAt: timestamp("reconciled_at"),
  matchedTransactionId: varchar("matched_transaction_id"),
  importedFrom: text("imported_from"), // csv, api, manual
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Journal Entries (for double-entry bookkeeping)
export const journalEntries = pgTable("journal_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entryNumber: text("entry_number").notNull().unique(),
  entryDate: date("entry_date").notNull(),
  description: text("description").notNull(),
  reference: text("reference"), // invoice number, bill number, etc.
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  status: text("status").notNull().default("posted"), // draft, posted
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Journal Entry Line Items
export const journalEntryLineItems = pgTable("journal_entry_line_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  journalEntryId: varchar("journal_entry_id").notNull().references(() => journalEntries.id, { onDelete: "cascade" }),
  accountId: varchar("account_id").notNull().references(() => accounts.id),
  description: text("description"),
  debitAmount: decimal("debit_amount", { precision: 12, scale: 2 }).default("0.00"),
  creditAmount: decimal("credit_amount", { precision: 12, scale: 2 }).default("0.00"),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  expenseClaims: many(expenseClaims),
}));

export const clientsRelations = relations(clients, ({ many }) => ({
  invoices: many(invoices),
}));

export const vendorsRelations = relations(vendors, ({ many }) => ({
  bills: many(bills),
  purchaseOrders: many(purchaseOrders),
}));

export const accountsRelations = relations(accounts, ({ one, many }) => ({
  parent: one(accounts, { fields: [accounts.parentId], references: [accounts.id] }),
  children: many(accounts),
  bankAccounts: many(bankAccounts),
  journalEntryLineItems: many(journalEntryLineItems),
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  client: one(clients, { fields: [invoices.clientId], references: [clients.id] }),
  lineItems: many(invoiceLineItems),
}));

export const invoiceLineItemsRelations = relations(invoiceLineItems, ({ one }) => ({
  invoice: one(invoices, { fields: [invoiceLineItems.invoiceId], references: [invoices.id] }),
  account: one(accounts, { fields: [invoiceLineItems.accountId], references: [accounts.id] }),
}));

export const billsRelations = relations(bills, ({ one }) => ({
  vendor: one(vendors, { fields: [bills.vendorId], references: [vendors.id] }),
}));

export const purchaseOrdersRelations = relations(purchaseOrders, ({ one }) => ({
  vendor: one(vendors, { fields: [purchaseOrders.vendorId], references: [vendors.id] }),
}));

export const expenseClaimsRelations = relations(expenseClaims, ({ one }) => ({
  user: one(users, { fields: [expenseClaims.userId], references: [users.id] }),
  approver: one(users, { fields: [expenseClaims.approvedBy], references: [users.id] }),
  account: one(accounts, { fields: [expenseClaims.accountId], references: [accounts.id] }),
}));

export const bankAccountsRelations = relations(bankAccounts, ({ one, many }) => ({
  account: one(accounts, { fields: [bankAccounts.accountId], references: [accounts.id] }),
  transactions: many(bankTransactions),
}));

export const bankTransactionsRelations = relations(bankTransactions, ({ one }) => ({
  bankAccount: one(bankAccounts, { fields: [bankTransactions.bankAccountId], references: [bankAccounts.id] }),
}));

export const journalEntriesRelations = relations(journalEntries, ({ many }) => ({
  lineItems: many(journalEntryLineItems),
}));

export const journalEntryLineItemsRelations = relations(journalEntryLineItems, ({ one }) => ({
  journalEntry: one(journalEntries, { fields: [journalEntryLineItems.journalEntryId], references: [journalEntries.id] }),
  account: one(accounts, { fields: [journalEntryLineItems.accountId], references: [accounts.id] }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertClientSchema = createInsertSchema(clients).omit({ id: true, createdAt: true });
export const insertVendorSchema = createInsertSchema(vendors).omit({ id: true, createdAt: true });
export const insertAccountSchema = createInsertSchema(accounts).omit({ id: true, createdAt: true });
export const insertBankAccountSchema = createInsertSchema(bankAccounts).omit({ id: true, createdAt: true });
export const insertInvoiceSchema = createInsertSchema(invoices).omit({ id: true, createdAt: true });
export const insertInvoiceLineItemSchema = createInsertSchema(invoiceLineItems).omit({ id: true });
export const insertBillSchema = createInsertSchema(bills).omit({ id: true, createdAt: true });
export const insertPurchaseOrderSchema = createInsertSchema(purchaseOrders).omit({ id: true, createdAt: true });
export const insertExpenseClaimSchema = createInsertSchema(expenseClaims).omit({ id: true, createdAt: true, approvedAt: true });
export const insertBankTransactionSchema = createInsertSchema(bankTransactions).omit({ id: true, createdAt: true });
export const insertJournalEntrySchema = createInsertSchema(journalEntries).omit({ id: true, createdAt: true });
export const insertJournalEntryLineItemSchema = createInsertSchema(journalEntryLineItems).omit({ id: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type Vendor = typeof vendors.$inferSelect;
export type InsertVendor = z.infer<typeof insertVendorSchema>;
export type Account = typeof accounts.$inferSelect;
export type InsertAccount = z.infer<typeof insertAccountSchema>;
export type BankAccount = typeof bankAccounts.$inferSelect;
export type InsertBankAccount = z.infer<typeof insertBankAccountSchema>;
export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type InvoiceLineItem = typeof invoiceLineItems.$inferSelect;
export type InsertInvoiceLineItem = z.infer<typeof insertInvoiceLineItemSchema>;
export type Bill = typeof bills.$inferSelect;
export type InsertBill = z.infer<typeof insertBillSchema>;
export type PurchaseOrder = typeof purchaseOrders.$inferSelect;
export type InsertPurchaseOrder = z.infer<typeof insertPurchaseOrderSchema>;
export type ExpenseClaim = typeof expenseClaims.$inferSelect;
export type InsertExpenseClaim = z.infer<typeof insertExpenseClaimSchema>;
export type BankTransaction = typeof bankTransactions.$inferSelect;
export type InsertBankTransaction = z.infer<typeof insertBankTransactionSchema>;
export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
export type JournalEntryLineItem = typeof journalEntryLineItems.$inferSelect;
export type InsertJournalEntryLineItem = z.infer<typeof insertJournalEntryLineItemSchema>;
