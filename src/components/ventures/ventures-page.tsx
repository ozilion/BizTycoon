"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from 'react';
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import {
  Briefcase,
  CupSoda,
  Laptop,
  Cookie,
  Leaf,
  Coffee,
  ShoppingCart,
  Bus,
  Fuel,
  Building,
  Gamepad2,
  Banknote,
  TrendingUp,
  Clock
} from "lucide-react";

interface Business {
  id: string;
  name: string;
  sector: string;
  icon: React.ElementType;
  imageUrl: string;
  cost: number;
  incomePerSecond: number;
  marketValue: number;
  level: number;
  upgradeCost: number;
  productionTime: number;
  lastCollected: number;
  aiHint: string;
  baseIncomePerSecond?: number;
}

const availableBusinesses: Omit<Business, 'id' | 'lastCollected' | 'level' | 'marketValue' | 'upgradeCost'>[] = [
    { name: "Classic Lemonade Stand", sector: "Food & Beverage", icon: CupSoda, imageUrl: "https://picsum.photos/seed/lemonade/400/200", cost: 500, incomePerSecond: 0.5, productionTime: 600, aiHint: "lemonade stand" },
    { name: "Tech Tinker Inc.", sector: "Technology Services", icon: Laptop, imageUrl: "https://picsum.photos/seed/webdev/400/200", cost: 2000, incomePerSecond: 2, productionTime: 1200, aiHint: "computer desk" },
    { name: "The Artisan Bakery", sector: "Food & Beverage", icon: Cookie, imageUrl: "https://picsum.photos/seed/bakery/400/200", cost: 8000, incomePerSecond: 4, productionTime: 1800, aiHint: "artisan bread" },
    { name: "Green Thumb Landscaping", sector: "Services", icon: Leaf, imageUrl: "https://picsum.photos/seed/landscaping/400/200", cost: 12000, incomePerSecond: 6, productionTime: 3600, aiHint: "garden tools" },
    { name: "Bytes & Brews Cafe", sector: "Food & Tech", icon: Coffee, imageUrl: "https://picsum.photos/seed/techcafe/400/200", cost: 25000, incomePerSecond: 10, productionTime: 4500, aiHint: "modern cafe" },
    { name: "The General Store", sector: "Retail", icon: ShoppingCart, imageUrl: "https://picsum.photos/seed/retail/400/200", cost: 40000, incomePerSecond: 4, productionTime: 2700, aiHint: "general store" },
    { name: "Indie Game Studio", sector: "Entertainment", icon: Gamepad2, imageUrl: "https://picsum.photos/seed/gamestudio/400/200", cost: 50000, incomePerSecond: 12, productionTime: 9000, aiHint: "game development" },
    { name: "Metro Transit", sector: "Transportation", icon: Bus, imageUrl: "https://picsum.photos/seed/transit/400/200", cost: 120000, incomePerSecond: 10, productionTime: 5400, aiHint: "city bus" },
    { name: "Cornerstone Construction", sector: "Construction", icon: Building, imageUrl: "https://picsum.photos/seed/construction/400/200", cost: 200000, incomePerSecond: 15, productionTime: 10800, aiHint: "construction site" },
];

interface FormattedBusinessStrings {
  cost: string;
  incomePerSecond: string;
}

export default function VenturesPage() {
  const [balance, setBalance] = useState(0);
  const [formattedBalance, setFormattedBalance] = useState("0");
  const [ownedBusinesses, setOwnedBusinesses] = useState<Business[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();
  const [formattedBizStrings, setFormattedBizStrings] = useState<Record<string, FormattedBusinessStrings>>({});

  // Load state from localStorage on mount
  useEffect(() => {
    const savedBalance = localStorage.getItem('biztycoon_balance');
    const savedBusinesses = localStorage.getItem('biztycoon_businesses');

    if (savedBalance) {
      setBalance(parseFloat(savedBalance));
    } else {
      setBalance(10000); // Default starting balance
    }

    if (savedBusinesses) {
      try {
        const parsed = JSON.parse(savedBusinesses);
        const iconMap: Record<string, React.ElementType> = {
          'Banknote': Banknote,
          'Briefcase': Briefcase,
          'Fuel': Fuel,
          'CupSoda': CupSoda,
          'Laptop': Laptop,
          'Cookie': Cookie,
          'Leaf': Leaf,
          'Coffee': Coffee,
          'ShoppingCart': ShoppingCart,
          'Gamepad2': Gamepad2,
          'Bus': Bus,
          'Building': Building,
        };
        const restoredBusinesses = parsed.map((biz: Business) => ({
          ...biz,
          icon: iconMap[biz.icon as unknown as string] || Briefcase
        }));
        setOwnedBusinesses(restoredBusinesses);
      } catch (error) {
        console.error('Failed to parse saved businesses:', error);
      }
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    setFormattedBalance(balance.toLocaleString());
  }, [balance]);

  useEffect(() => {
    const newFormattedBizStrings: Record<string, FormattedBusinessStrings> = {};
    availableBusinesses.forEach(biz => {
        newFormattedBizStrings[biz.name] = {
            cost: biz.cost.toLocaleString(),
            incomePerSecond: biz.incomePerSecond.toLocaleString(),
        };
    });
    setFormattedBizStrings(newFormattedBizStrings);
  }, []);

  const establishBusiness = (businessToEstablish: Omit<Business, 'id' | 'lastCollected' | 'level'| 'marketValue' | 'upgradeCost'>) => {
    if (balance >= businessToEstablish.cost) {
      const newBusiness: Business = {
        ...businessToEstablish,
        id: `${businessToEstablish.sector.toLowerCase().replace(/[^a-z0-9]/gi, '')}-${Date.now()}`,
        level: 1,
        marketValue: businessToEstablish.cost * 1.2,
        upgradeCost: businessToEstablish.cost * 0.5,
        lastCollected: Date.now(),
      };

      const newBalance = balance - newBusiness.cost;
      const newOwnedBusinesses = [...ownedBusinesses, newBusiness];

      setBalance(newBalance);
      setOwnedBusinesses(newOwnedBusinesses);

      // Save to localStorage
      localStorage.setItem('biztycoon_balance', newBalance.toString());
      const businessesToSave = newOwnedBusinesses.map(biz => {
        // Find icon name by reference
        let iconName = 'Briefcase'; // default
        if (biz.icon === Banknote) iconName = 'Banknote';
        else if (biz.icon === Briefcase) iconName = 'Briefcase';
        else if (biz.icon === Fuel) iconName = 'Fuel';
        else if (biz.icon === CupSoda) iconName = 'CupSoda';
        else if (biz.icon === Laptop) iconName = 'Laptop';
        else if (biz.icon === Cookie) iconName = 'Cookie';
        else if (biz.icon === Leaf) iconName = 'Leaf';
        else if (biz.icon === Coffee) iconName = 'Coffee';
        else if (biz.icon === ShoppingCart) iconName = 'ShoppingCart';
        else if (biz.icon === Gamepad2) iconName = 'Gamepad2';
        else if (biz.icon === Bus) iconName = 'Bus';
        else if (biz.icon === Building) iconName = 'Building';

        return {
          ...biz,
          icon: iconName
        };
      });
      localStorage.setItem('biztycoon_businesses', JSON.stringify(businessesToSave));

      toast({ title: "Business Established!", description: `${newBusiness.name} is now part of your empire.` });
    } else {
      toast({
        title: "Insufficient Funds",
        description: `You need $${formattedBizStrings[businessToEstablish.name]?.cost || businessToEstablish.cost.toLocaleString()} to establish ${businessToEstablish.name}.`,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2 text-2xl font-bold text-primary">
            <Briefcase className="h-7 w-7" />
            Business Ventures
          </CardTitle>
          <div className="flex items-center gap-2 text-accent">
            <Banknote className="h-8 w-8" />
            <span className="text-3xl font-semibold">${formattedBalance}</span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Browse and establish new business ventures to grow your empire.
          </p>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-semibold mb-4 text-primary">Available Ventures</h2>
        {availableBusinesses.filter(availBiz => !ownedBusinesses.some(ownedBiz => ownedBiz.name === availBiz.name)).length === 0 ? (
          <Card className="text-center p-8 shadow-md">
            <CardContent>
              <p className="text-muted-foreground">You've established all available ventures for now! Expand your current ones or check back later for new opportunities.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableBusinesses.filter(availBiz => !ownedBusinesses.some(ownedBiz => ownedBiz.name === availBiz.name)).map((biz, index) => (
              <Card key={index} className="shadow-md hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <biz.icon className="h-6 w-6 text-primary" />
                      {biz.name}
                    </CardTitle>
                    <span className="text-xs text-muted-foreground">{biz.sector}</span>
                  </div>
                  <CardDescription>
                    {formattedBizStrings[biz.name] ?
                      `Cost: $${formattedBizStrings[biz.name].cost} | Income: $${formattedBizStrings[biz.name].incomePerSecond}/sec`
                      : `Cost: $${biz.cost.toLocaleString()} | Income: $${biz.incomePerSecond.toLocaleString()}/sec`
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Image
                    src={biz.imageUrl}
                    alt={biz.name}
                    width={400}
                    height={200}
                    className="rounded-md mb-4 object-cover aspect-video"
                    data-ai-hint={biz.aiHint}
                  />
                  <Button onClick={() => establishBusiness(biz)} className="w-full" disabled={balance < biz.cost}>
                    Establish Business
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
