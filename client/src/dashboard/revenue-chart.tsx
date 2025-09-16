import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RevenueChart() {
  return (
    <Card data-testid="card-revenue-chart">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle data-testid="text-chart-title">Revenue Trend</CardTitle>
          <Select defaultValue="6months">
            <SelectTrigger className="w-auto" data-testid="select-chart-period">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
              <SelectItem value="2years">Last 2 years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 bg-muted rounded-lg flex items-center justify-center" data-testid="chart-placeholder-revenue">
          <p className="text-muted-foreground">Revenue Chart - Chart.js integration pending</p>
        </div>
      </CardContent>
    </Card>
  );
}
