
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

export default function VenturesPage() {
  return (
    <div className="container mx-auto p-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold text-primary">
            <Briefcase className="h-7 w-7" />
            Business Ventures
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is where you'll establish new businesses and manage your existing ventures. 
            Functionality to list available and owned businesses will be implemented here.
            For now, please see the Dashboard for business management.
          </p>
          {/* Placeholder for business listing and creation UI */}
          <div className="mt-6 p-8 border-2 border-dashed border-border rounded-lg text-center">
            <p className="text-lg text-muted-foreground">Business management features coming soon!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
