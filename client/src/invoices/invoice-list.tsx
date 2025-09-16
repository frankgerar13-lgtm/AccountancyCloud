import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Eye, Download, Send, Edit, Trash2 } from "lucide-react";

interface InvoiceListProps {
  invoices: any[];
  isLoading: boolean;
}

export default function InvoiceList({ invoices, isLoading }: InvoiceListProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "paid":
        return "default";
      case "overdue":
        return "destructive";
      case "sent":
        return "secondary";
      default:
        return "outline";
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(amount || '0'));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle data-testid="text-invoices-list-title">Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3" data-testid="loader-invoices-list">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2" data-testid="text-invoices-list-title">
          <FileText className="h-5 w-5" />
          Invoices ({invoices.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id} data-testid={`row-invoice-${invoice.id}`}>
                <TableCell>
                  <div className="font-medium" data-testid={`text-invoice-number-${invoice.id}`}>
                    {invoice.invoiceNumber}
                  </div>
                </TableCell>
                <TableCell>
                  <div data-testid={`text-client-name-${invoice.id}`}>
                    {invoice.client?.name || 'N/A'}
                  </div>
                  {invoice.client?.email && (
                    <div className="text-sm text-muted-foreground">
                      {invoice.client.email}
                    </div>
                  )}
                </TableCell>
                <TableCell data-testid={`text-issue-date-${invoice.id}`}>
                  {new Date(invoice.issueDate).toLocaleDateString()}
                </TableCell>
                <TableCell data-testid={`text-due-date-${invoice.id}`}>
                  {new Date(invoice.dueDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="font-medium" data-testid={`text-total-amount-${invoice.id}`}>
                    {formatCurrency(invoice.totalAmount)}
                  </div>
                  {parseFloat(invoice.paidAmount || '0') > 0 && (
                    <div className="text-sm text-muted-foreground">
                      Paid: {formatCurrency(invoice.paidAmount)}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={getStatusVariant(invoice.status)}
                    data-testid={`badge-status-${invoice.id}`}
                  >
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      data-testid={`button-view-${invoice.id}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      data-testid={`button-download-${invoice.id}`}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    {invoice.status === 'draft' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        data-testid={`button-send-${invoice.id}`}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      data-testid={`button-edit-${invoice.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      data-testid={`button-delete-${invoice.id}`}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {invoices.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8" data-testid="text-no-invoices">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No invoices found</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
