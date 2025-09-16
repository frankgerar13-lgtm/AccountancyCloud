import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, FileText, PiggyBank, CreditCard, TrendingUp, Clock, University, TrendingDown } from "lucide-react";

interface MetricsCardsProps {
  metrics: any;
  isLoading: boolean;
}

export default function MetricsCards({ metrics, isLoading }: MetricsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} data-testid={`skeleton-metric-${i}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-12 w-12 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num || 0);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Revenue */}
      <Card data-testid="card-total-revenue">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium" data-testid="text-revenue-label">Total Revenue</p>
              <p className="text-2xl font-bold text-foreground" data-testid="text-revenue-amount">
                {formatCurrency(metrics?.totalRevenue || 0)}
              </p>
              <p className="text-sm text-green-600 mt-1" data-testid="text-revenue-growth">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                {metrics?.revenueGrowth || '0'}% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Outstanding Invoices */}
      <Card data-testid="card-outstanding-invoices">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium" data-testid="text-outstanding-label">Outstanding Invoices</p>
              <p className="text-2xl font-bold text-foreground" data-testid="text-outstanding-amount">
                {formatCurrency(metrics?.outstandingInvoices || 0)}
              </p>
              <p className="text-sm text-orange-600 mt-1" data-testid="text-overdue-info">
                <Clock className="inline h-3 w-3 mr-1" />
                {metrics?.overdueInvoicesCount || 0} overdue
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cash Balance */}
      <Card data-testid="card-cash-balance">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium" data-testid="text-cash-label">Cash Balance</p>
              <p className="text-2xl font-bold text-foreground" data-testid="text-cash-amount">
                {formatCurrency(metrics?.cashBalance || 0)}
              </p>
              <p className="text-sm text-blue-600 mt-1" data-testid="text-bank-accounts-info">
                <University className="inline h-3 w-3 mr-1" />
                {metrics?.bankAccountsCount || 0} accounts
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <PiggyBank className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Expenses */}
      <Card data-testid="card-monthly-expenses">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium" data-testid="text-expenses-label">Monthly Expenses</p>
              <p className="text-2xl font-bold text-foreground" data-testid="text-expenses-amount">
                {formatCurrency(metrics?.monthlyExpenses || 0)}
              </p>
              <p className="text-sm text-red-600 mt-1" data-testid="text-expense-growth">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                {metrics?.expenseGrowth || '0'}% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
