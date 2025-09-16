import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const expenseClaimSchema = z.object({
  claimNumber: z.string().min(1, "Claim number is required"),
  description: z.string().min(1, "Description is required"),
  amount: z.string().min(1, "Amount is required"),
  expenseDate: z.string().min(1, "Expense date is required"),
  category: z.string().optional(),
  accountId: z.string().optional(),
  notes: z.string().optional(),
});

interface ExpenseClaimFormProps {
  onSuccess: () => void;
}

export default function ExpenseClaimForm({ onSuccess }: ExpenseClaimFormProps) {
  const { toast } = useToast();

  const { data: accounts } = useQuery({
    queryKey: ["/api/accounts"],
  });

  const form = useForm<z.infer<typeof expenseClaimSchema>>({
    resolver: zodResolver(expenseClaimSchema),
    defaultValues: {
      claimNumber: `EXP-${Date.now()}`,
      description: "",
      amount: "",
      expenseDate: "",
      category: "",
      accountId: "",
      notes: "",
    },
  });

  const createClaimMutation = useMutation({
    mutationFn: async (data: z.infer<typeof expenseClaimSchema>) => {
      const response = await apiRequest("POST", "/api/expense-claims", {
        ...data,
        userId: "current-user-id", // In a real app, this would come from auth context
        status: "submitted",
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Expense claim submitted successfully",
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit expense claim",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof expenseClaimSchema>) => {
    createClaimMutation.mutate(data);
  };

  const expenseCategories = [
    "Travel",
    "Meals",
    "Office Supplies",
    "Equipment",
    "Training",
    "Marketing",
    "Utilities",
    "Other"
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="claimNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Claim Number</FormLabel>
                <FormControl>
                  <Input {...field} readOnly data-testid="input-claim-number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expenseDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expense Date *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} data-testid="input-expense-date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description *</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the expense..." 
                  {...field} 
                  data-testid="textarea-description" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    placeholder="0.00" 
                    {...field} 
                    data-testid="input-amount" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="accountId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-account">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {accounts?.filter((account: any) => account.type === 'expense').map((account: any) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.code} - {account.name}
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
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Any additional information..." 
                  {...field} 
                  data-testid="textarea-notes" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Receipt Upload Placeholder */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Receipt</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <p className="text-sm text-muted-foreground">Receipt upload functionality will be implemented</p>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-2">
          <Button
            type="submit"
            disabled={createClaimMutation.isPending}
            data-testid="button-submit-expense-claim"
          >
            {createClaimMutation.isPending ? "Submitting..." : "Submit Expense Claim"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
