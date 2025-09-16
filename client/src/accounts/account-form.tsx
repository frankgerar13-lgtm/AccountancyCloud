import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const accountSchema = z.object({
  code: z.string().min(1, "Account code is required"),
  name: z.string().min(1, "Account name is required"),
  type: z.string().min(1, "Account type is required"),
  subType: z.string().optional(),
  parentId: z.string().optional(),
  description: z.string().optional(),
  balance: z.string().default("0.00"),
  isActive: z.boolean().default(true),
});

interface AccountFormProps {
  account?: any;
  accounts: any[];
  onSuccess: () => void;
}

export default function AccountForm({ account, accounts, onSuccess }: AccountFormProps) {
  const { toast } = useToast();
  const isEditing = !!account;

  const form = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      code: account?.code || "",
      name: account?.name || "",
      type: account?.type || "",
      subType: account?.subType || "",
      parentId: account?.parentId || "",
      description: account?.description || "",
      balance: account?.balance || "0.00",
      isActive: account?.isActive ?? true,
    },
  });

  const accountMutation = useMutation({
    mutationFn: async (data: z.infer<typeof accountSchema>) => {
      const url = isEditing ? `/api/accounts/${account.id}` : "/api/accounts";
      const method = isEditing ? "PUT" : "POST";
      const response = await apiRequest(method, url, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Account ${isEditing ? "updated" : "created"} successfully`,
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || `Failed to ${isEditing ? "update" : "create"} account`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof accountSchema>) => {
    accountMutation.mutate(data);
  };

  const accountTypes = [
    { value: "asset", label: "Asset" },
    { value: "liability", label: "Liability" },
    { value: "equity", label: "Equity" },
    { value: "revenue", label: "Revenue" },
    { value: "expense", label: "Expense" },
  ];

  const getSubTypeOptions = (type: string) => {
    switch (type) {
      case "asset":
        return [
          { value: "current_asset", label: "Current Asset" },
          { value: "fixed_asset", label: "Fixed Asset" },
          { value: "other_asset", label: "Other Asset" },
        ];
      case "liability":
        return [
          { value: "current_liability", label: "Current Liability" },
          { value: "long_term_liability", label: "Long-term Liability" },
          { value: "other_liability", label: "Other Liability" },
        ];
      case "equity":
        return [
          { value: "owner_equity", label: "Owner's Equity" },
          { value: "retained_earnings", label: "Retained Earnings" },
        ];
      case "revenue":
        return [
          { value: "operating_revenue", label: "Operating Revenue" },
          { value: "other_revenue", label: "Other Revenue" },
        ];
      case "expense":
        return [
          { value: "operating_expense", label: "Operating Expense" },
          { value: "other_expense", label: "Other Expense" },
        ];
      default:
        return [];
    }
  };

  const selectedType = form.watch("type");
  const subTypeOptions = getSubTypeOptions(selectedType);

  // Filter parent accounts (same type, not self)
  const parentAccountOptions = accounts.filter(
    (acc) => acc.type === selectedType && acc.id !== account?.id
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Code *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="1000" 
                    {...field} 
                    data-testid="input-account-code" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Name *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Cash in Bank" 
                    {...field} 
                    data-testid="input-account-name" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Account Type and Sub-type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Type *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-account-type">
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {accountTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
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
            name="subType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sub-type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={!selectedType}
                >
                  <FormControl>
                    <SelectTrigger data-testid="select-account-subtype">
                      <SelectValue placeholder="Select sub-type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subTypeOptions.map((subType) => (
                      <SelectItem key={subType.value} value={subType.value}>
                        {subType.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Parent Account */}
        <FormField
          control={form.control}
          name="parentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent Account</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={parentAccountOptions.length === 0}
              >
                <FormControl>
                  <SelectTrigger data-testid="select-parent-account">
                    <SelectValue placeholder="Select parent account (optional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {parentAccountOptions.map((parentAccount) => (
                    <SelectItem key={parentAccount.id} value={parentAccount.id}>
                      {parentAccount.code} - {parentAccount.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Opening Balance */}
        <FormField
          control={form.control}
          name="balance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Opening Balance</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  placeholder="0.00"
                  {...field} 
                  data-testid="input-opening-balance" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Account description..." 
                  {...field} 
                  data-testid="textarea-description" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Active Status */}
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Active Status</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Enable this account for transactions
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  data-testid="switch-active-status"
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex justify-end space-x-2">
          <Button
            type="submit"
            disabled={accountMutation.isPending}
            data-testid="button-save-account"
          >
            {accountMutation.isPending ? "Saving..." : isEditing ? "Update Account" : "Create Account"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
