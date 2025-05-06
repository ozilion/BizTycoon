
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, DollarSign, TrendingUp, TrendingDown, Building } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  // Placeholder data - will be dynamic later
  const userProfile = {
    name: "Tycoon User",
    avatarUrl: "https://picsum.photos/200/200?q=profile",
    avatarFallback: "TU",
    totalMarketValue: 1250000,
    totalIncome: 75000,
    totalExpenses: 25000,
    establishedCompanies: [
      { id: "1", name: "Community Bank", sector: "Finance", value: 600000 },
      { id: "2", name: "Local Kickers FC", sector: "Sports", value: 450000 },
      { id: "3", name: "Speedy Gas", sector: "Energy", value: 200000 },
    ],
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col items-center text-center pb-4">
          <Avatar className="h-24 w-24 mb-4 border-4 border-primary">
            <AvatarImage src={userProfile.avatarUrl} alt={userProfile.name} data-ai-hint="person avatar" />
            <AvatarFallback className="text-3xl">{userProfile.avatarFallback}</AvatarFallback>
          </Avatar>
          <CardTitle className="flex items-center gap-2 text-3xl font-bold text-primary">
            <User className="h-8 w-8" />
            {userProfile.name}
          </CardTitle>
          <CardDescription className="text-md">Aspiring Business Mogul</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-center">
            <Card className="p-4 shadow-sm bg-secondary">
              <DollarSign className="h-8 w-8 text-accent mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Total Market Value</p>
              <p className="text-2xl font-semibold">${userProfile.totalMarketValue.toLocaleString()}</p>
            </Card>
            <Card className="p-4 shadow-sm bg-secondary">
              <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Total Income</p>
              <p className="text-2xl font-semibold">${userProfile.totalIncome.toLocaleString()}</p>
            </Card>
            <Card className="p-4 shadow-sm bg-secondary">
              <TrendingDown className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-semibold">${userProfile.totalExpenses.toLocaleString()}</p>
            </Card>
          </div>
          
          <Separator className="my-6" />

          <div>
            <h3 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
              <Building className="h-6 w-6" />
              Established Companies
            </h3>
            {userProfile.establishedCompanies.length > 0 ? (
              <ul className="space-y-3">
                {userProfile.establishedCompanies.map((company) => (
                  <li key={company.id} className="p-4 border rounded-lg shadow-sm flex justify-between items-center bg-background hover:bg-secondary/50 transition-colors">
                    <div>
                      <p className="font-medium">{company.name}</p>
                      <p className="text-xs text-muted-foreground">{company.sector}</p>
                    </div>
                    <p className="font-semibold text-primary">${company.value.toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center py-4">No companies established yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
