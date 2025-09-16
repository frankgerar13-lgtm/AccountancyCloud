import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertClientSchema, insertVendorSchema, insertAccountSchema, insertBankAccountSchema,
  insertInvoiceSchema, insertInvoiceLineItemSchema, insertBillSchema, insertPurchaseOrderSchema,
  insertExpenseClaimSchema, insertBankTransactionSchema, insertUserSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Dashboard endpoint
  app.get("/api/dashboard/metrics", async (req, res) => {
    try {
      const metrics = await storage.getDashboardMetrics();
      res.json(metrics);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching dashboard metrics: " + error.message });
    }
  });

  // Users endpoints
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating user: " + error.message });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching user: " + error.message });
    }
  });

  // Clients endpoints
  app.get("/api/clients", async (req, res) => {
    try {
      const clients = await storage.getClients();
      res.json(clients);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching clients: " + error.message });
    }
  });

  app.post("/api/clients", async (req, res) => {
    try {
      const clientData = insertClientSchema.parse(req.body);
      const client = await storage.createClient(clientData);
      res.json(client);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating client: " + error.message });
    }
  });

  app.get("/api/clients/:id", async (req, res) => {
    try {
      const client = await storage.getClient(req.params.id);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json(client);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching client: " + error.message });
    }
  });

  app.put("/api/clients/:id", async (req, res) => {
    try {
      const clientData = insertClientSchema.partial().parse(req.body);
      const client = await storage.updateClient(req.params.id, clientData);
      res.json(client);
    } catch (error: any) {
      res.status(400).json({ message: "Error updating client: " + error.message });
    }
  });

  app.delete("/api/clients/:id", async (req, res) => {
    try {
      await storage.deleteClient(req.params.id);
      res.json({ message: "Client deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: "Error deleting client: " + error.message });
    }
  });

  // Vendors endpoints
  app.get("/api/vendors", async (req, res) => {
    try {
      const vendors = await storage.getVendors();
      res.json(vendors);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching vendors: " + error.message });
    }
  });

  app.post("/api/vendors", async (req, res) => {
    try {
      const vendorData = insertVendorSchema.parse(req.body);
      const vendor = await storage.createVendor(vendorData);
      res.json(vendor);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating vendor: " + error.message });
    }
  });

  app.get("/api/vendors/:id", async (req, res) => {
    try {
      const vendor = await storage.getVendor(req.params.id);
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      res.json(vendor);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching vendor: " + error.message });
    }
  });

  app.put("/api/vendors/:id", async (req, res) => {
    try {
      const vendorData = insertVendorSchema.partial().parse(req.body);
      const vendor = await storage.updateVendor(req.params.id, vendorData);
      res.json(vendor);
    } catch (error: any) {
      res.status(400).json({ message: "Error updating vendor: " + error.message });
    }
  });

  app.delete("/api/vendors/:id", async (req, res) => {
    try {
      await storage.deleteVendor(req.params.id);
      res.json({ message: "Vendor deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: "Error deleting vendor: " + error.message });
    }
  });

  // Accounts endpoints
  app.get("/api/accounts", async (req, res) => {
    try {
      const accounts = await storage.getAccounts();
      res.json(accounts);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching accounts: " + error.message });
    }
  });

  app.post("/api/accounts", async (req, res) => {
    try {
      const accountData = insertAccountSchema.parse(req.body);
      const account = await storage.createAccount(accountData);
      res.json(account);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating account: " + error.message });
    }
  });

  app.get("/api/accounts/:id", async (req, res) => {
    try {
      const account = await storage.getAccount(req.params.id);
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }
      res.json(account);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching account: " + error.message });
    }
  });

  app.put("/api/accounts/:id", async (req, res) => {
    try {
      const accountData = insertAccountSchema.partial().parse(req.body);
      const account = await storage.updateAccount(req.params.id, accountData);
      res.json(account);
    } catch (error: any) {
      res.status(400).json({ message: "Error updating account: " + error.message });
    }
  });

  // Bank Accounts endpoints
  app.get("/api/bank-accounts", async (req, res) => {
    try {
      const bankAccounts = await storage.getBankAccounts();
      res.json(bankAccounts);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching bank accounts: " + error.message });
    }
  });

  app.post("/api/bank-accounts", async (req, res) => {
    try {
      const bankAccountData = insertBankAccountSchema.parse(req.body);
      const bankAccount = await storage.createBankAccount(bankAccountData);
      res.json(bankAccount);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating bank account: " + error.message });
    }
  });

  // Invoices endpoints
  app.get("/api/invoices", async (req, res) => {
    try {
      const invoices = await storage.getInvoices();
      res.json(invoices);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching invoices: " + error.message });
    }
  });

  app.post("/api/invoices", async (req, res) => {
    try {
      const { lineItems, ...invoiceData } = req.body;
      const validatedInvoice = insertInvoiceSchema.parse(invoiceData);
      const validatedLineItems = z.array(insertInvoiceLineItemSchema).parse(lineItems || []);
      
      const invoice = await storage.createInvoice(validatedInvoice, validatedLineItems);
      res.json(invoice);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating invoice: " + error.message });
    }
  });

  app.get("/api/invoices/:id", async (req, res) => {
    try {
      const invoice = await storage.getInvoice(req.params.id);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      res.json(invoice);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching invoice: " + error.message });
    }
  });

  app.put("/api/invoices/:id", async (req, res) => {
    try {
      const invoiceData = insertInvoiceSchema.partial().parse(req.body);
      const invoice = await storage.updateInvoice(req.params.id, invoiceData);
      res.json(invoice);
    } catch (error: any) {
      res.status(400).json({ message: "Error updating invoice: " + error.message });
    }
  });

  app.delete("/api/invoices/:id", async (req, res) => {
    try {
      await storage.deleteInvoice(req.params.id);
      res.json({ message: "Invoice deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: "Error deleting invoice: " + error.message });
    }
  });

  // Bills endpoints
  app.get("/api/bills", async (req, res) => {
    try {
      const bills = await storage.getBills();
      res.json(bills);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching bills: " + error.message });
    }
  });

  app.post("/api/bills", async (req, res) => {
    try {
      const billData = insertBillSchema.parse(req.body);
      const bill = await storage.createBill(billData);
      res.json(bill);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating bill: " + error.message });
    }
  });

  // Purchase Orders endpoints
  app.get("/api/purchase-orders", async (req, res) => {
    try {
      const purchaseOrders = await storage.getPurchaseOrders();
      res.json(purchaseOrders);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching purchase orders: " + error.message });
    }
  });

  app.post("/api/purchase-orders", async (req, res) => {
    try {
      const poData = insertPurchaseOrderSchema.parse(req.body);
      const purchaseOrder = await storage.createPurchaseOrder(poData);
      res.json(purchaseOrder);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating purchase order: " + error.message });
    }
  });

  // Expense Claims endpoints
  app.get("/api/expense-claims", async (req, res) => {
    try {
      const expenseClaims = await storage.getExpenseClaims();
      res.json(expenseClaims);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching expense claims: " + error.message });
    }
  });

  app.post("/api/expense-claims", async (req, res) => {
    try {
      const claimData = insertExpenseClaimSchema.parse(req.body);
      const expenseClaim = await storage.createExpenseClaim(claimData);
      res.json(expenseClaim);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating expense claim: " + error.message });
    }
  });

  app.put("/api/expense-claims/:id/approve", async (req, res) => {
    try {
      const { approverId } = req.body;
      if (!approverId) {
        return res.status(400).json({ message: "Approver ID is required" });
      }
      const expenseClaim = await storage.approveExpenseClaim(req.params.id, approverId);
      res.json(expenseClaim);
    } catch (error: any) {
      res.status(400).json({ message: "Error approving expense claim: " + error.message });
    }
  });

  // Bank Transactions endpoints
  app.get("/api/bank-transactions", async (req, res) => {
    try {
      const bankAccountId = req.query.bankAccountId as string;
      const transactions = await storage.getBankTransactions(bankAccountId);
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching bank transactions: " + error.message });
    }
  });

  app.post("/api/bank-transactions", async (req, res) => {
    try {
      const transactionData = insertBankTransactionSchema.parse(req.body);
      const transaction = await storage.createBankTransaction(transactionData);
      res.json(transaction);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating bank transaction: " + error.message });
    }
  });

  app.put("/api/bank-transactions/:id/reconcile", async (req, res) => {
    try {
      const transaction = await storage.reconcileTransaction(req.params.id);
      res.json(transaction);
    } catch (error: any) {
      res.status(400).json({ message: "Error reconciling transaction: " + error.message });
    }
  });

  // Reports endpoints
  app.get("/api/reports/profit-loss", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start date and end date are required" });
      }
      const report = await storage.getProfitLossReport(startDate as string, endDate as string);
      res.json(report);
    } catch (error: any) {
      res.status(500).json({ message: "Error generating P&L report: " + error.message });
    }
  });

  app.get("/api/reports/balance-sheet", async (req, res) => {
    try {
      const { date } = req.query;
      if (!date) {
        return res.status(400).json({ message: "Date is required" });
      }
      const report = await storage.getBalanceSheetReport(date as string);
      res.json(report);
    } catch (error: any) {
      res.status(500).json({ message: "Error generating balance sheet: " + error.message });
    }
  });

  app.get("/api/reports/cash-flow", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start date and end date are required" });
      }
      const report = await storage.getCashFlowReport(startDate as string, endDate as string);
      res.json(report);
    } catch (error: any) {
      res.status(500).json({ message: "Error generating cash flow report: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
