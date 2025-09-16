import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ExpenseChart() {
  return (
    <Card data-testid="card-expense-chart">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle data-testid="text-expense-chart-title">Expense Breakdown</CardTitle>
          <Button variant="ghost" size="sm" data-testid="button-view-expense-details">
            View Details
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 bg-muted rounded-lg flex items-center justify-center" data-testid="chart-placeholder-expense">
          <p className="text-muted-foreground">Expense Chart - Chart.js integration pending</p>
        </div>
      </CardContent>
    </Card>
  );
}
