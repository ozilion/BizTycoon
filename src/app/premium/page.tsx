
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Star, CheckCircle } from "lucide-react";

export default function PremiumPage() {
  const premiumFeatures = [
    "Unlock exclusive business ventures",
    "Higher daily income bonuses",
    "Ad-free experience",
    "Priority support",
    "Unique profile badge",
    "Early access to new features",
  ];

  return (
    <div className="container mx-auto p-4">
      <Card className="shadow-lg max-w-2xl mx-auto border-2 border-accent">
        <CardHeader className="text-center">
          <Zap className="h-16 w-16 text-accent mx-auto mb-4" />
          <CardTitle className="text-3xl font-bold text-accent">
            BizTycoon Premium
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-2">
            Supercharge your empire and unlock exclusive benefits!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3 text-primary">Premium Features:</h3>
            <ul className="space-y-2">
              {premiumFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-accent mb-1">$9.99 / month</p>
            <p className="text-xs text-muted-foreground">(Billed monthly, cancel anytime)</p>
          </div>
          <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-6">
            <Star className="mr-2 h-5 w-5" /> Upgrade to Premium
          </Button>
           <p className="text-xs text-center text-muted-foreground mt-4">
            Premium features are currently under development. This page is a preview.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
