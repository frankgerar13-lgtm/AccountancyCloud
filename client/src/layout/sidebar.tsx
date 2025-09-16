import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Users,
  Receipt,
  ShoppingCart,
  Truck,
  University,
  Scale,
  CreditCard,
  Wrench,
  BarChart3,
  List
} from "lucide-react";

const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    active: true
  },
  {
    title: "Sales",
    items: [
      { title: "Invoices", href: "/invoices", icon: FileText },
      { title: "Clients", href: "/clients", icon: Users },
    ]
  },
  {
    title: "Purchases",
    items: [
      { title: "Bills", href: "/bills", icon: Receipt },
      { title: "Purchase Orders", href: "/purchase-orders", icon: ShoppingCart },
      { title: "Vendors", href: "/vendors", icon: Truck },
    ]
  },
  {
    title: "Banking",
    items: [
      { title: "Bank Feeds", href: "/bank-feeds", icon: University },
      { title: "Reconciliation", href: "/bank-reconciliation", icon: Scale },
    ]
  },
  {
    title: "Expenses",
    items: [
      { title: "Expense Claims", href: "/expense-claims", icon: CreditCard },
      { title: "Fixed Assets", href: "/fixed-assets", icon: Wrench },
    ]
  },
  {
    title: "Reports",
    items: [
      { title: "Financial Reports", href: "/reports", icon: BarChart3 },
      { title: "Chart of Accounts", href: "/chart-of-accounts", icon: List },
    ]
  }
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-card border-r border-border flex-shrink-0">
      <nav className="p-4 space-y-2">
        <div className="space-y-1">
          {navigationItems.map((item, index) => {
            if (item.href) {
              // Single navigation item
              const Icon = item.icon;
              const isActive = location === item.href || (item.href === "/dashboard" && location === "/");
              
              return (
                <Link key={index} href={item.href}>
                  <a className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-secondary text-muted-foreground"
                  )} data-testid={`link-${item.title.toLowerCase().replace(' ', '-')}`}>
                    <Icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </a>
                </Link>
              );
            } else {
              // Navigation group
              return (
                <div key={index} className="pt-4">
                  <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    {item.title}
                  </h3>
                  {item.items?.map((subItem, subIndex) => {
                    const Icon = subItem.icon;
                    const isActive = location === subItem.href;
                    
                    return (
                      <Link key={subIndex} href={subItem.href}>
                        <a className={cn(
                          "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                          isActive 
                            ? "bg-primary text-primary-foreground font-medium" 
                            : "hover:bg-secondary text-muted-foreground"
                        )} data-testid={`link-${subItem.title.toLowerCase().replace(' ', '-')}`}>
                          <Icon className="h-4 w-4" />
                          <span>{subItem.title}</span>
                        </a>
                      </Link>
                    );
                  })}
                </div>
              );
            }
          })}
        </div>
      </nav>
    </aside>
  );
}
