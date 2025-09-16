import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const purchaseOrderSchema = z.object({
  poNumber: z.string().min(1, "PO number is required"),
  vendorId: z.string().min(1, "Vendor is required"),
  orderDate: z.string().min(1, "Order date is required"),
  expectedDate: z.string().optional(),
  subtotal: z.string(),
  taxAmount: z.string(),
  totalAmount: z.string(),
  notes: z.string().optional(),
});

interface PurchaseOrderFormProps {
  purchaseOrder?: any;
  vendors: any[];
  onSuccess: () => void;
}

export default function PurchaseOrderForm({ purchaseOrder, vendors, onSuccess }: PurchaseOrderFormProps) {
  const { toast } = useToast();
  const isEditing = !!purchaseOrder;

  const form = useForm<z.infer<typeof purchaseOrderSchema>>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      poNumber: purchaseOrder?.poNumber || `PO-${Date.now()}`,
      vendorId: purchaseOrder?.vendorId || "",
      orderDate: purchaseOrder?.orderDate || "",
      expectedDate: purchaseOrder?.expectedDate || "",
      subtotal: purchaseOrder?.subtotal || "0",
      taxAmount: purchaseOrder?.taxAmount || "0",
      totalAmount: purchaseOrder?.totalAmount || "0",
      notes: purchaseOrder?.notes || "",
    },
  });

  const createPOMutation = useMutation({
    mutationFn: async (data: z.infer<typeof purchaseOrderSchema>) => {
      const url = isEditing ? `/api/purchase-orders/${purchaseOrder.id}` : "/api/purchase-orders";
      const method = isEditing ? "PUT" : "POST";
      const response = await apiRequest(method, url, {
        ...data,
        status: "pending",
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Purchase order ${isEditing ? "updated" : "created"} successfully`,
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || `Failed to ${isEditing ? "update" : "create"} purchase order`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof purchaseOrderSchema>) => {
    createPOMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="poNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PO Number</FormLabel>
                <FormControl>
                  <Input {...field} data-testid="input-po-number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vendorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vendor *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-vendor">
                      <SelectValue placeholder="Select a vendor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {vendors.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.name}
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
            name="orderDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order Date *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} data-testid="input-order-date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expectedDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expected Delivery Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} data-testid="input-expected-date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Line Items Placeholder */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4" data-testid="text-line-items-title">Line Items</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <p className="text-sm text-muted-foreground">Line items functionality will be implemented</p>
            </div>
          </CardContent>
        </Card>

        {/* Totals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="subtotal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subtotal</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} data-testid="input-subtotal" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="taxAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax Amount</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} data-testid="input-tax-amount" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="totalAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Amount</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} data-testid="input-total-amount" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Additional notes..." {...field} data-testid="textarea-notes" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex justify-end space-x-2">
          <Button
            type="submit"
            disabled={createPOMutation.isPending}
            data-testid="button-save-purchase-order"
          >
            {createPOMutation.isPending ? "Saving..." : isEditing ? "Update Purchase Order" : "Create Purchase Order"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
