import {
  users, clients, vendors, accounts, bankAccounts, invoices, invoiceLineItems,
  bills, purchaseOrders, expenseClaims, bankTransactions, journalEntries, journalEntryLineItems,
  type User, type InsertUser, type Client, type InsertClient, type Vendor, type InsertVendor,
  type Account, type InsertAccount, type BankAccount, type InsertBankAccount,
  type Invoice, type InsertInvoice, type InvoiceLineItem, type InsertInvoiceLineItem,
  type Bill, type InsertBill, type PurchaseOrder, type InsertPurchaseOrder,
  type ExpenseClaim, type InsertExpenseClaim, type BankTransaction, type InsertBankTransaction,
  type JournalEntry, type InsertJournalEntry, type JournalEntryLineItem, type InsertJournalEntryLineItem
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sql, sum, count } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Clients
  getClients(): Promise<Client[]>;
  getClient(id: string): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: string, client: Partial<InsertClient>): Promise<Client>;
  deleteClient(id: string): Promise<void>;

  // Vendors
  getVendors(): Promise<Vendor[]>;
  getVendor(id: string): Promise<Vendor | undefined>;
  createVendor(vendor: InsertVendor): Promise<Vendor>;
  updateVendor(id: string, vendor: Partial<InsertVendor>): Promise<Vendor>;
  deleteVendor(id: string): Promise<void>;

  // Accounts
  getAccounts(): Promise<Account[]>;
  getAccount(id: string): Promise<Account | undefined>;
  createAccount(account: InsertAccount): Promise<Account>;
  updateAccount(id: string, account: Partial<InsertAccount>): Promise<Account>;
  deleteAccount(id: string): Promise<void>;

  // Bank Accounts
  getBankAccounts(): Promise<BankAccount[]>;
  getBankAccount(id: string): Promise<BankAccount | undefined>;
  createBankAccount(bankAccount: InsertBankAccount): Promise<BankAccount>;
  updateBankAccount(id: string, bankAccount: Partial<InsertBankAccount>): Promise<BankAccount>;

  // Invoices
  getInvoices(): Promise<(Invoice & { client: Client; lineItems: InvoiceLineItem[] })[]>;
  getInvoice(id: string): Promise<(Invoice & { client: Client; lineItems: InvoiceLineItem[] }) | undefined>;
  createInvoice(invoice: InsertInvoice, lineItems: InsertInvoiceLineItem[]): Promise<Invoice>;
  updateInvoice(id: string, invoice: Partial<InsertInvoice>): Promise<Invoice>;
  deleteInvoice(id: string): Promise<void>;

  // Bills
  getBills(): Promise<(Bill & { vendor: Vendor })[]>;
  getBill(id: string): Promise<(Bill & { vendor: Vendor }) | undefined>;
  createBill(bill: InsertBill): Promise<Bill>;
  updateBill(id: string, bill: Partial<InsertBill>): Promise<Bill>;

  // Purchase Orders
  getPurchaseOrders(): Promise<(PurchaseOrder & { vendor: Vendor })[]>;
  getPurchaseOrder(id: string): Promise<(PurchaseOrder & { vendor: Vendor }) | undefined>;
  createPurchaseOrder(purchaseOrder: InsertPurchaseOrder): Promise<PurchaseOrder>;
  updatePurchaseOrder(id: string, purchaseOrder: Partial<InsertPurchaseOrder>): Promise<PurchaseOrder>;

  // Expense Claims
  getExpenseClaims(): Promise<(ExpenseClaim & { user: User; account?: Account })[]>;
  getExpenseClaim(id: string): Promise<(ExpenseClaim & { user: User; account?: Account }) | undefined>;
  createExpenseClaim(expenseClaim: InsertExpenseClaim): Promise<ExpenseClaim>;
  updateExpenseClaim(id: string, expenseClaim: Partial<InsertExpenseClaim>): Promise<ExpenseClaim>;
  approveExpenseClaim(id: string, approverId: string): Promise<ExpenseClaim>;

  // Bank Transactions
  getBankTransactions(bankAccountId?: string): Promise<(BankTransaction & { bankAccount: BankAccount })[]>;
  getBankTransaction(id: string): Promise<BankTransaction | undefined>;
  createBankTransaction(transaction: InsertBankTransaction): Promise<BankTransaction>;
  updateBankTransaction(id: string, transaction: Partial<InsertBankTransaction>): Promise<BankTransaction>;
  reconcileTransaction(id: string): Promise<BankTransaction>;

  // Dashboard Metrics
  getDashboardMetrics(): Promise<{
    totalRevenue: string;
    outstandingInvoices: string;
    cashBalance: string;
    monthlyExpenses: string;
    revenueGrowth: string;
    overdueInvoicesCount: number;
    bankAccountsCount: number;
    expenseGrowth: string;
  }>;

  // Financial Reports
  getProfitLossReport(startDate: string, endDate: string): Promise<any>;
  getBalanceSheetReport(date: string): Promise<any>;
  getCashFlowReport(startDate: string, endDate: string): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Clients
  async getClients(): Promise<Client[]> {
    return await db.select().from(clients).where(eq(clients.isActive, true)).orderBy(clients.name);
  }

  async getClient(id: string): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client || undefined;
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const [client] = await db.insert(clients).values(insertClient).returning();
    return client;
  }

  async updateClient(id: string, updateClient: Partial<InsertClient>): Promise<Client> {
    const [client] = await db.update(clients).set(updateClient).where(eq(clients.id, id)).returning();
    return client;
  }

  async deleteClient(id: string): Promise<void> {
    await db.update(clients).set({ isActive: false }).where(eq(clients.id, id));
  }

  // Vendors
  async getVendors(): Promise<Vendor[]> {
    return await db.select().from(vendors).where(eq(vendors.isActive, true)).orderBy(vendors.name);
  }

  async getVendor(id: string): Promise<Vendor | undefined> {
    const [vendor] = await db.select().from(vendors).where(eq(vendors.id, id));
    return vendor || undefined;
  }

  async createVendor(insertVendor: InsertVendor): Promise<Vendor> {
    const [vendor] = await db.insert(vendors).values(insertVendor).returning();
    return vendor;
  }

  async updateVendor(id: string, updateVendor: Partial<InsertVendor>): Promise<Vendor> {
    const [vendor] = await db.update(vendors).set(updateVendor).where(eq(vendors.id, id)).returning();
    return vendor;
  }

  async deleteVendor(id: string): Promise<void> {
    await db.update(vendors).set({ isActive: false }).where(eq(vendors.id, id));
  }

  // Accounts
  async getAccounts(): Promise<Account[]> {
    return await db.select().from(accounts).where(eq(accounts.isActive, true)).orderBy(accounts.code);
  }

  async getAccount(id: string): Promise<Account | undefined> {
    const [account] = await db.select().from(accounts).where(eq(accounts.id, id));
    return account || undefined;
  }

  async createAccount(insertAccount: InsertAccount): Promise<Account> {
    const [account] = await db.insert(accounts).values(insertAccount).returning();
    return account;
  }

  async updateAccount(id: string, updateAccount: Partial<InsertAccount>): Promise<Account> {
    const [account] = await db.update(accounts).set(updateAccount).where(eq(accounts.id, id)).returning();
    return account;
  }

  async deleteAccount(id: string): Promise<void> {
    await db.update(accounts).set({ isActive: false }).where(eq(accounts.id, id));
  }

  // Bank Accounts
  async getBankAccounts(): Promise<BankAccount[]> {
    return await db.select().from(bankAccounts).where(eq(bankAccounts.isActive, true)).orderBy(bankAccounts.name);
  }

  async getBankAccount(id: string): Promise<BankAccount | undefined> {
    const [bankAccount] = await db.select().from(bankAccounts).where(eq(bankAccounts.id, id));
    return bankAccount || undefined;
  }

  async createBankAccount(insertBankAccount: InsertBankAccount): Promise<BankAccount> {
    const [bankAccount] = await db.insert(bankAccounts).values(insertBankAccount).returning();
    return bankAccount;
  }

  async updateBankAccount(id: string, updateBankAccount: Partial<InsertBankAccount>): Promise<BankAccount> {
    const [bankAccount] = await db.update(bankAccounts).set(updateBankAccount).where(eq(bankAccounts.id, id)).returning();
    return bankAccount;
  }

  // Invoices
  async getInvoices(): Promise<(Invoice & { client: Client; lineItems: InvoiceLineItem[] })[]> {
    const invoicesWithClients = await db
      .select()
      .from(invoices)
      .leftJoin(clients, eq(invoices.clientId, clients.id))
      .orderBy(desc(invoices.createdAt));

    const result = [];
    for (const { invoices: invoice, clients: client } of invoicesWithClients) {
      const lineItems = await db
        .select()
        .from(invoiceLineItems)
        .where(eq(invoiceLineItems.invoiceId, invoice.id));

      result.push({
        ...invoice,
        client: client!,
        lineItems,
      });
    }

    return result;
  }

  async getInvoice(id: string): Promise<(Invoice & { client: Client; lineItems: InvoiceLineItem[] }) | undefined> {
    const [invoiceWithClient] = await db
      .select()
      .from(invoices)
      .leftJoin(clients, eq(invoices.clientId, clients.id))
      .where(eq(invoices.id, id));

    if (!invoiceWithClient) return undefined;

    const lineItems = await db
      .select()
      .from(invoiceLineItems)
      .where(eq(invoiceLineItems.invoiceId, id));

    return {
      ...invoiceWithClient.invoices,
      client: invoiceWithClient.clients!,
      lineItems,
    };
  }

  async createInvoice(insertInvoice: InsertInvoice, lineItems: InsertInvoiceLineItem[]): Promise<Invoice> {
    const [invoice] = await db.insert(invoices).values(insertInvoice).returning();
    
    if (lineItems.length > 0) {
      const lineItemsWithInvoiceId = lineItems.map(item => ({
        ...item,
        invoiceId: invoice.id,
      }));
      await db.insert(invoiceLineItems).values(lineItemsWithInvoiceId);
    }

    return invoice;
  }

  async updateInvoice(id: string, updateInvoice: Partial<InsertInvoice>): Promise<Invoice> {
    const [invoice] = await db.update(invoices).set(updateInvoice).where(eq(invoices.id, id)).returning();
    return invoice;
  }

  async deleteInvoice(id: string): Promise<void> {
    await db.delete(invoiceLineItems).where(eq(invoiceLineItems.invoiceId, id));
    await db.delete(invoices).where(eq(invoices.id, id));
  }

  // Bills
  async getBills(): Promise<(Bill & { vendor: Vendor })[]> {
    const billsWithVendors = await db
      .select()
      .from(bills)
      .leftJoin(vendors, eq(bills.vendorId, vendors.id))
      .orderBy(desc(bills.createdAt));

    return billsWithVendors.map(({ bills: bill, vendors: vendor }) => ({
      ...bill,
      vendor: vendor!,
    }));
  }

  async getBill(id: string): Promise<(Bill & { vendor: Vendor }) | undefined> {
    const [billWithVendor] = await db
      .select()
      .from(bills)
      .leftJoin(vendors, eq(bills.vendorId, vendors.id))
      .where(eq(bills.id, id));

    if (!billWithVendor) return undefined;

    return {
      ...billWithVendor.bills,
      vendor: billWithVendor.vendors!,
    };
  }

  async createBill(insertBill: InsertBill): Promise<Bill> {
    const [bill] = await db.insert(bills).values(insertBill).returning();
    return bill;
  }

  async updateBill(id: string, updateBill: Partial<InsertBill>): Promise<Bill> {
    const [bill] = await db.update(bills).set(updateBill).where(eq(bills.id, id)).returning();
    return bill;
  }

  // Purchase Orders
  async getPurchaseOrders(): Promise<(PurchaseOrder & { vendor: Vendor })[]> {
    const posWithVendors = await db
      .select()
      .from(purchaseOrders)
      .leftJoin(vendors, eq(purchaseOrders.vendorId, vendors.id))
      .orderBy(desc(purchaseOrders.createdAt));

    return posWithVendors.map(({ purchase_orders: po, vendors: vendor }) => ({
      ...po,
      vendor: vendor!,
    }));
  }

  async getPurchaseOrder(id: string): Promise<(PurchaseOrder & { vendor: Vendor }) | undefined> {
    const [poWithVendor] = await db
      .select()
      .from(purchaseOrders)
      .leftJoin(vendors, eq(purchaseOrders.vendorId, vendors.id))
      .where(eq(purchaseOrders.id, id));

    if (!poWithVendor) return undefined;

    return {
      ...poWithVendor.purchase_orders,
      vendor: poWithVendor.vendors!,
    };
  }

  async createPurchaseOrder(insertPO: InsertPurchaseOrder): Promise<PurchaseOrder> {
    const [po] = await db.insert(purchaseOrders).values(insertPO).returning();
    return po;
  }

  async updatePurchaseOrder(id: string, updatePO: Partial<InsertPurchaseOrder>): Promise<PurchaseOrder> {
    const [po] = await db.update(purchaseOrders).set(updatePO).where(eq(purchaseOrders.id, id)).returning();
    return po;
  }

  // Expense Claims
  async getExpenseClaims(): Promise<(ExpenseClaim & { user: User; account?: Account })[]> {
    const claimsWithUsers = await db
      .select()
      .from(expenseClaims)
      .leftJoin(users, eq(expenseClaims.userId, users.id))
      .leftJoin(accounts, eq(expenseClaims.accountId, accounts.id))
      .orderBy(desc(expenseClaims.createdAt));

    return claimsWithUsers.map(({ expense_claims: claim, users: user, accounts: account }) => ({
      ...claim,
      user: user!,
      account: account || undefined,
    }));
  }

  async getExpenseClaim(id: string): Promise<(ExpenseClaim & { user: User; account?: Account }) | undefined> {
    const [claimWithUser] = await db
      .select()
      .from(expenseClaims)
      .leftJoin(users, eq(expenseClaims.userId, users.id))
      .leftJoin(accounts, eq(expenseClaims.accountId, accounts.id))
      .where(eq(expenseClaims.id, id));

    if (!claimWithUser) return undefined;

    return {
      ...claimWithUser.expense_claims,
      user: claimWithUser.users!,
      account: claimWithUser.accounts || undefined,
    };
  }

  async createExpenseClaim(insertClaim: InsertExpenseClaim): Promise<ExpenseClaim> {
    const [claim] = await db.insert(expenseClaims).values(insertClaim).returning();
    return claim;
  }

  async updateExpenseClaim(id: string, updateClaim: Partial<InsertExpenseClaim>): Promise<ExpenseClaim> {
    const [claim] = await db.update(expenseClaims).set(updateClaim).where(eq(expenseClaims.id, id)).returning();
    return claim;
  }

  async approveExpenseClaim(id: string, approverId: string): Promise<ExpenseClaim> {
    const [claim] = await db
      .update(expenseClaims)
      .set({
        status: "approved",
        approvedBy: approverId,
        approvedAt: new Date(),
      })
      .where(eq(expenseClaims.id, id))
      .returning();
    return claim;
  }

  // Bank Transactions
  async getBankTransactions(bankAccountId?: string): Promise<(BankTransaction & { bankAccount: BankAccount })[]> {
    let query = db
      .select()
      .from(bankTransactions)
      .leftJoin(bankAccounts, eq(bankTransactions.bankAccountId, bankAccounts.id));

    if (bankAccountId) {
      query = query.where(eq(bankTransactions.bankAccountId, bankAccountId));
    }

    const transactionsWithAccounts = await query.orderBy(desc(bankTransactions.transactionDate));

    return transactionsWithAccounts.map(({ bank_transactions: transaction, bank_accounts: account }) => ({
      ...transaction,
      bankAccount: account!,
    }));
  }

  async getBankTransaction(id: string): Promise<BankTransaction | undefined> {
    const [transaction] = await db.select().from(bankTransactions).where(eq(bankTransactions.id, id));
    return transaction || undefined;
  }

  async createBankTransaction(insertTransaction: InsertBankTransaction): Promise<BankTransaction> {
    const [transaction] = await db.insert(bankTransactions).values(insertTransaction).returning();
    return transaction;
  }

  async updateBankTransaction(id: string, updateTransaction: Partial<InsertBankTransaction>): Promise<BankTransaction> {
    const [transaction] = await db
      .update(bankTransactions)
      .set(updateTransaction)
      .where(eq(bankTransactions.id, id))
      .returning();
    return transaction;
  }

  async reconcileTransaction(id: string): Promise<BankTransaction> {
    const [transaction] = await db
      .update(bankTransactions)
      .set({
        isReconciled: true,
        reconciledAt: new Date(),
      })
      .where(eq(bankTransactions.id, id))
      .returning();
    return transaction;
  }

  // Dashboard Metrics
  async getDashboardMetrics(): Promise<{
    totalRevenue: string;
    outstandingInvoices: string;
    cashBalance: string;
    monthlyExpenses: string;
    revenueGrowth: string;
    overdueInvoicesCount: number;
    bankAccountsCount: number;
    expenseGrowth: string;
  }> {
    // Total Revenue (paid invoices)
    const [revenueResult] = await db
      .select({ total: sum(invoices.paidAmount) })
      .from(invoices)
      .where(eq(invoices.status, "paid"));

    // Outstanding Invoices
    const [outstandingResult] = await db
      .select({ total: sum(sql`${invoices.totalAmount} - ${invoices.paidAmount}`) })
      .from(invoices)
      .where(sql`${invoices.status} IN ('sent', 'overdue')`);

    // Cash Balance (sum of all bank accounts)
    const [cashResult] = await db
      .select({ total: sum(bankAccounts.balance) })
      .from(bankAccounts)
      .where(eq(bankAccounts.isActive, true));

    // Overdue invoices count
    const [overdueResult] = await db
      .select({ count: count() })
      .from(invoices)
      .where(and(
        eq(invoices.status, "overdue"),
        sql`${invoices.dueDate} < CURRENT_DATE`
      ));

    // Bank accounts count
    const [bankAccountsResult] = await db
      .select({ count: count() })
      .from(bankAccounts)
      .where(eq(bankAccounts.isActive, true));

    // Monthly expenses (current month)
    const currentMonth = new Date();
    currentMonth.setDate(1);
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const [expensesResult] = await db
      .select({ total: sum(expenseClaims.amount) })
      .from(expenseClaims)
      .where(and(
        gte(expenseClaims.expenseDate, currentMonth.toISOString().split('T')[0]),
        sql`${expenseClaims.expenseDate} < ${nextMonth.toISOString().split('T')[0]}`
      ));

    return {
      totalRevenue: (revenueResult?.total || "0"),
      outstandingInvoices: (outstandingResult?.total || "0"),
      cashBalance: (cashResult?.total || "0"),
      monthlyExpenses: (expensesResult?.total || "0"),
      revenueGrowth: "12.3", // Placeholder - would need historical data
      overdueInvoicesCount: Number(overdueResult?.count || 0),
      bankAccountsCount: Number(bankAccountsResult?.count || 0),
      expenseGrowth: "5.2", // Placeholder - would need historical data
    };
  }

  // Financial Reports (simplified implementations)
  async getProfitLossReport(startDate: string, endDate: string): Promise<any> {
    // This would be a complex query involving revenue and expense accounts
    return { message: "P&L report functionality to be implemented" };
  }

  async getBalanceSheetReport(date: string): Promise<any> {
    // This would show assets, liabilities, and equity as of a specific date
    return { message: "Balance sheet report functionality to be implemented" };
  }

  async getCashFlowReport(startDate: string, endDate: string): Promise<any> {
    // This would show cash flow from operations, investing, and financing
    return { message: "Cash flow report functionality to be implemented" };
  }
}

export const storage = new DatabaseStorage();
