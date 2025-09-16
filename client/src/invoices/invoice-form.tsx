import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const invoiceSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  subtotal: z.string(),
  taxAmount: z.string(),
  totalAmount: z.string(),
  notes: z.string().optional(),
  terms: z.string().optional(),
});

const lineItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.string().min(1, "Quantity is required"),
  rate: z.string().min(1, "Rate is required"),
  amount: z.string(),
});

interface InvoiceFormProps {
  clients: any[];
  onSuccess: () => void;
}

export default function InvoiceForm({ clients, onSuccess }: InvoiceFormProps) {
  const { toast } = useToast();
  const [lineItems, setLineItems] = useState([
    { description: "", quantity: "1", rate: "0", amount: "0" }
  ]);

  const form = useForm<z.infer<typeof invoiceSchema>>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      clientId: "",
      invoiceNumber: "",
      issueDate: "",
      dueDate: "",
      subtotal: "0",
      taxAmount: "0",
      totalAmount: "0",
      notes: "",
      terms: "",
    },
  });

  const createInvoiceMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/invoices", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Invoice created successfully",
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create invoice",
        variant: "destructive",
      });
    },
  });

  const calculateLineItemAmount = (quantity: string, rate: string) => {
    const qty = parseFloat(quantity) || 0;
    const rt = parseFloat(rate) || 0;
    return (qty * rt).toFixed(2);
  };

  const calculateTotals = () => {
    const subtotal = lineItems.reduce((sum, item) => {
      return sum + parseFloat(calculateLineItemAmount(item.quantity, item.rate));
    }, 0);
    
    const taxAmount = subtotal * 0.1; // 10% tax
    const totalAmount = subtotal + taxAmount;

    form.setValue("subtotal", subtotal.toFixed(2));
    form.setValue("taxAmount", taxAmount.toFixed(2));
    form.setValue("totalAmount", totalAmount.toFixed(2));
  };

  const updateLineItem = (index: number, field: string, value: string) => {
    const newLineItems = [...lineItems];
    newLineItems[index] = { ...newLineItems[index], [field]: value };
    
    if (field === "quantity" || field === "rate") {
      newLineItems[index].amount = calculateLineItemAmount(
        newLineItems[index].quantity,
        newLineItems[index].rate
      );
    }
    
    setLineItems(newLineItems);
    calculateTotals();
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { description: "", quantity: "1", rate: "0", amount: "0" }]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      const newLineItems = lineItems.filter((_, i) => i !== index);
      setLineItems(newLineItems);
      calculateTotals();
    }
  };

  const onSubmit = (data: z.infer<typeof invoiceSchema>) => {
    const validLineItems = lineItems.filter(item => 
      item.description && parseFloat(item.quantity) > 0 && parseFloat(item.rate) > 0
    );

    if (validLineItems.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one valid line item",
        variant: "destructive",
      });
      return;
    }

    const formattedLineItems = validLineItems.map(item => ({
      description: item.description,
      quantity: item.quantity,
      rate: item.rate,
      amount: item.amount,
    }));

    createInvoiceMutation.mutate({
      ...data,
      status: "draft",
      lineItems: formattedLineItems,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Invoice Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-client">
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="invoiceNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice Number</FormLabel>
                <FormControl>
                  <Input placeholder="INV-2024-001" {...field} data-testid="input-invoice-number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="issueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issue Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} data-testid="input-issue-date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} data-testid="input-due-date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Line Items */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4" data-testid="text-line-items-title">Line Items</h3>
            <div className="space-y-4">
              {lineItems.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-end" data-testid={`line-item-${index}`}>
                  <div className="col-span-5">
                    <label className="text-sm font-medium">Description</label>
                    <Input
                      placeholder="Item description"
                      value={item.description}
                      onChange={(e) => updateLineItem(index, "description", e.target.value)}
                      data-testid={`input-description-${index}`}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium">Quantity</label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(index, "quantity", e.target.value)}
                      data-testid={`input-quantity-${index}`}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium">Rate</label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.rate}
                      onChange={(e) => updateLineItem(index, "rate", e.target.value)}
                      data-testid={`input-rate-${index}`}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium">Amount</label>
                    <div className="text-sm text-muted-foreground pt-2" data-testid={`text-amount-${index}`}>
                      ${parseFloat(item.amount || "0").toFixed(2)}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLineItem(index)}
                      disabled={lineItems.length === 1}
                      data-testid={`button-remove-line-${index}`}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={addLineItem}
              className="mt-4"
              data-testid="button-add-line-item"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Line Item
            </Button>
          </CardContent>
        </Card>

        {/* Totals */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2 max-w-xs ml-auto">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span data-testid="text-subtotal">${form.watch("subtotal")}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%):</span>
                <span data-testid="text-tax">${form.watch("taxAmount")}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total:</span>
                <span data-testid="text-total">${form.watch("totalAmount")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes and Terms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Input placeholder="Additional notes..." {...field} data-testid="input-notes" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Terms</FormLabel>
                <FormControl>
                  <Input placeholder="Payment terms..." {...field} data-testid="input-terms" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-between items-center pt-6 border-t">
          <div className="space-x-2">
            <Button type="button" variant="outline" data-testid="button-save-draft">
              Save as Draft
            </Button>
            <Button type="button" variant="outline" data-testid="button-preview-pdf">
              Preview PDF
            </Button>
          </div>
          <div className="space-x-2">
            <Button
              type="submit"
              disabled={createInvoiceMutation.isPending}
              data-testid="button-create-invoice-submit"
            >
              {createInvoiceMutation.isPending ? "Creating..." : "Create Invoice"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
