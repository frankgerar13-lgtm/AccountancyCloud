import { Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <i className="fas fa-chart-line text-primary-foreground text-sm"></i>
            </div>
            <h1 className="text-xl font-bold text-foreground">FinanceFlow</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" data-testid="button-notifications">
            <Bell className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" data-testid="button-settings">
            <Settings className="h-4 w-4 text-muted-foreground" />
          </Button>
          <div className="flex items-center space-x-2 pl-4 border-l border-border">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-medium" data-testid="text-user-initials">JD</span>
            </div>
            <span className="text-sm font-medium" data-testid="text-user-name">John Doe</span>
          </div>
        </div>
      </div>
    </header>
  );
}
