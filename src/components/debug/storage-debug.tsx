"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, RefreshCw } from "lucide-react";

export function StorageDebug() {
  const { toast } = useToast();

  const clearStorage = () => {
    try {
      localStorage.removeItem('biztycoon_balance');
      localStorage.removeItem('biztycoon_businesses');

      toast({
        title: "Storage Cleared!",
        description: "Refreshing page to load fresh data...",
      });

      // Dispatch event to notify other components
      window.dispatchEvent(new Event('biztycoon_storage_update'));

      // Refresh page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear storage. Check console for details.",
        variant: "destructive",
      });
      console.error("Storage clear error:", error);
    }
  };

  const checkStorage = () => {
    const balance = localStorage.getItem('biztycoon_balance');
    const businesses = localStorage.getItem('biztycoon_businesses');

    let businessCount = 0;
    try {
      if (businesses) {
        const parsed = JSON.parse(businesses);
        businessCount = Array.isArray(parsed) ? parsed.length : 0;
      }
    } catch (e) {
      businessCount = -1; // Indicates corrupt data
    }

    toast({
      title: "Storage Status",
      description: `Balance: $${balance || '0'}\nBusinesses: ${businessCount >= 0 ? businessCount : 'CORRUPT DATA!'}`,
    });

    console.log('=== BizTycoon Storage Debug ===');
    console.log('Balance:', balance);
    console.log('Businesses:', businesses);
    console.log('==============================');
  };

  return (
    <Card className="border-2 border-dashed border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
      <CardHeader>
        <CardTitle className="text-yellow-900 dark:text-yellow-100">Storage Debug Tools</CardTitle>
        <CardDescription className="text-yellow-800 dark:text-yellow-200">
          Use these tools if you're experiencing data issues
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          onClick={checkStorage}
          variant="outline"
          className="w-full"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Check Storage Status
        </Button>
        <Button
          onClick={clearStorage}
          variant="destructive"
          className="w-full"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear All Data & Restart
        </Button>
        <p className="text-xs text-yellow-800 dark:text-yellow-300 mt-2">
          ⚠️ Clearing data will reset your balance to $10,000 and remove all businesses
        </p>
      </CardContent>
    </Card>
  );
}
