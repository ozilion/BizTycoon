
"use client";

import type { NextPage } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Banknote, 
  Briefcase, 
  TrendingUp, 
  Clock, 
  Zap, 
  Building, 
  ShoppingCart, 
  Bus, 
  Fuel, 
  HelpCircle,
  CupSoda,
  Laptop,
  Cookie,
  Leaf,
  Coffee,
  Gamepad2
} from "lucide-react";
import { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import { trackAdEngagement, showInterstitialAd, loadInterstitialAd } from '@/services/admob';
import { useToast } from "@/hooks/use-toast";


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
  productionTime: number; // in seconds
  lastCollected: number; // timestamp
  aiHint: string;
  baseIncomePerSecond?: number; // Store original income for ad boost revert
}

const initialBusinesses: Business[] = [
  { id: "bank-1", name: "Community Bank", sector: "Finance", icon: Banknote, imageUrl: "https://picsum.photos/seed/bank/400/200", cost: 50000, incomePerSecond: 5, marketValue: 60000, level: 1, upgradeCost: 25000, productionTime: 3600, lastCollected: Date.now(), aiHint: "modern bank" },
  { id: "sports-1", name: "Local Kickers FC", sector: "Sports", icon: Briefcase, imageUrl: "https://picsum.photos/seed/sports/400/200", cost: 75000, incomePerSecond: 8, marketValue: 90000, level: 1, upgradeCost: 35000, productionTime: 7200, lastCollected: Date.now(), aiHint: "soccer stadium"  },
  { id: "fuel-1", name: "Speedy Gas", sector: "Energy", icon: Fuel, imageUrl: "https://picsum.photos/seed/fuel/400/200", cost: 30000, incomePerSecond: 3, marketValue: 35000, level: 1, upgradeCost: 15000, productionTime: 1800, lastCollected: Date.now(), aiHint: "gas station"  },
];

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

interface FormattedAvailableBusinessStrings {
  cost: string;
  incomePerSecond: string;
}

export const DashboardPage: NextPage = () => {
  const initialBalance = 10000;
  const [balance, setBalance] = useState(initialBalance);
  const [formattedBalance, setFormattedBalance] = useState(initialBalance.toString());
  const [ownedBusinesses, setOwnedBusinesses] = useState<Business[]>([]);
  const [hourlyIncome, setHourlyIncome] = useState(0);
  const [formattedHourlyIncome, setFormattedHourlyIncome] = useState("0");
  const [dailyIncome, setDailyIncome] = useState(0);
  const [formattedDailyIncome, setFormattedDailyIncome] = useState("0");
  const { toast } = useToast();
  const [formattedAvailableBizStrings, setFormattedAvailableBizStrings] = useState<Record<string, FormattedAvailableBusinessStrings>>({});

  // Refs to avoid stale closures
  const ownedBusinessesRef = useRef<Business[]>([]);
  const adBoostTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());


  useEffect(() => {
    loadInterstitialAd();
  }, []);

  // Keep ref in sync with state
  useEffect(() => {
    ownedBusinessesRef.current = ownedBusinesses;
  }, [ownedBusinesses]);

  useEffect(() => {
    setFormattedBalance(balance.toLocaleString());
  }, [balance]);

  useEffect(() => {
    setFormattedHourlyIncome(hourlyIncome.toLocaleString());
  }, [hourlyIncome]);

  useEffect(() => {
    setFormattedDailyIncome(dailyIncome.toLocaleString());
  }, [dailyIncome]);

  useEffect(() => {
    const calculateIncome = () => {
      let currentTotalIncomePerSecond = 0;
      const now = Date.now();
      let collectedAmount = 0;

      setOwnedBusinesses(prevBusinesses =>
        prevBusinesses.map(biz => {
          const secondsSinceLastCollect = Math.floor((now - biz.lastCollected) / 1000);
          const collectableSeconds = Math.min(secondsSinceLastCollect, biz.productionTime);
          const incomeGenerated = collectableSeconds * biz.incomePerSecond;
          collectedAmount += incomeGenerated;
          return { ...biz, lastCollected: biz.lastCollected + collectableSeconds * 1000 };
        })
      );

      setBalance(prev => prev + collectedAmount);

      // Use ref to get current businesses instead of stale closure
      currentTotalIncomePerSecond = ownedBusinessesRef.current.reduce((sum, biz) => sum + biz.incomePerSecond, 0);
      setHourlyIncome(currentTotalIncomePerSecond * 3600);
      setDailyIncome(currentTotalIncomePerSecond * 3600 * 24);
    };

    const interval = setInterval(calculateIncome, 1000); // Update income every second
    return () => clearInterval(interval);
  }, []); // Empty dependency array - interval runs once and cleanup properly


  const establishBusiness = (businessToEstablish: Omit<Business, 'id' | 'lastCollected' | 'level'| 'marketValue' | 'upgradeCost'>) => {
    if (balance >= businessToEstablish.cost) {
      const newBusiness: Business = {
        ...businessToEstablish,
        id: `${businessToEstablish.sector.toLowerCase().replace(/[^a-z0-9]/gi, '')}-${Date.now()}`, // Sanitize sector for ID
        level: 1,
        marketValue: businessToEstablish.cost * 1.2,
        upgradeCost: businessToEstablish.cost * 0.5,
        lastCollected: Date.now(),
      };
      setBalance(prevBalance => prevBalance - newBusiness.cost);
      setOwnedBusinesses(prevBusinesses => [...prevBusinesses, newBusiness]);
      toast({ title: "Business Established!", description: `${newBusiness.name} is now part of your empire.` });
    } else {
      toast({ title: "Insufficient Funds", description: `You need $${(formattedAvailableBizStrings[businessToEstablish.name]?.cost || businessToEstablish.cost.toLocaleString())} to establish ${businessToEstablish.name}.`, variant: "destructive" });
    }
  };

  const collectIncome = (businessId: string) => {
    const now = Date.now();
    let collectedAmount = 0;
    let collectedBusinessName = "";
    setOwnedBusinesses(prevBusinesses => 
      prevBusinesses.map(biz => {
        if (biz.id === businessId) {
          const secondsSinceLastCollect = Math.floor((now - biz.lastCollected) / 1000);
          const collectableSeconds = Math.min(secondsSinceLastCollect, biz.productionTime);
          const incomeGenerated = collectableSeconds * biz.incomePerSecond;
          collectedAmount += incomeGenerated;
          collectedBusinessName = biz.name;
          return { ...biz, lastCollected: now };
        }
        return biz;
      })
    );
    setBalance(prevBalance => prevBalance + collectedAmount);
    if (collectedAmount > 0 && collectedBusinessName) {
        toast({ title: "Income Collected!", description: `Collected $${collectedAmount.toLocaleString()} from ${collectedBusinessName}.` });
    }
  };
  
  const handleWatchAd = async (businessId: string) => {
    const adShown = await showInterstitialAd();
    if (adShown) {
      await trackAdEngagement();
      let boostedBusinessName = "";

      // Clear existing timeout for this business if any
      const existingTimeout = adBoostTimeoutsRef.current.get(businessId);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
        adBoostTimeoutsRef.current.delete(businessId);
      }

      setOwnedBusinesses(prevBusinesses =>
        prevBusinesses.map(biz => {
          if (biz.id === businessId) {
            boostedBusinessName = biz.name;
            toast({ title: "Ad Watched!", description: `${biz.name} production boosted!` });
            // Store base income if not already stored
            const baseIncome = biz.baseIncomePerSecond ?? biz.incomePerSecond;
            return {
              ...biz,
              baseIncomePerSecond: baseIncome,
              incomePerSecond: baseIncome * 1.2 // 20% boost from base
            };
          }
          return biz;
        })
      );

      // Store timeout ID for cleanup
      const timeoutId = setTimeout(() => {
         setOwnedBusinesses(prevBusinesses =>
            prevBusinesses.map(biz => {
              if (biz.id === businessId) {
                // Restore to base income
                const restoredIncome = biz.baseIncomePerSecond ?? biz.incomePerSecond;
                return {
                  ...biz,
                  incomePerSecond: restoredIncome,
                  baseIncomePerSecond: undefined // Clear base income
                };
              }
              return biz;
            })
          );
          adBoostTimeoutsRef.current.delete(businessId);
          if (boostedBusinessName) {
            toast({ title: "Boost Expired", description: `Production boost for ${boostedBusinessName} has ended.` });
          }
      }, 60 * 60 * 1000); // Boost for 1 hour

      adBoostTimeoutsRef.current.set(businessId, timeoutId);
    } else {
       toast({ title: "Ad Not Available", description: "Please try again later.", variant: "destructive" });
    }
  };

  // Client-side only state for formatted income values to avoid hydration issues with toLocaleString
  const [clientIncomeReadyToCollect, setClientIncomeReadyToCollect] = useState<{[key: string]: string}>({});

  // Cleanup all timeouts on unmount
  useEffect(() => {
    return () => {
      adBoostTimeoutsRef.current.forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
      adBoostTimeoutsRef.current.clear();
    };
  }, []);

  useEffect(() => {
    const newClientIncomeReadyToCollect: {[key: string]: string} = {};
    ownedBusinesses.forEach(biz => {
      const now = Date.now();
      const secondsSinceLastCollect = Math.floor((now - biz.lastCollected) / 1000);
      const collectableSeconds = Math.min(secondsSinceLastCollect, biz.productionTime);
      const incomeReady = collectableSeconds * biz.incomePerSecond;
      newClientIncomeReadyToCollect[biz.id] = incomeReady.toLocaleString();
    });
    setClientIncomeReadyToCollect(newClientIncomeReadyToCollect);

    const newFormattedAvailableBizStrings: Record<string, FormattedAvailableBusinessStrings> = {};
    availableBusinesses.forEach(biz => {
        newFormattedAvailableBizStrings[biz.name] = {
            cost: biz.cost.toLocaleString(),
            incomePerSecond: biz.incomePerSecond.toLocaleString(),
        };
    });
    setFormattedAvailableBizStrings(newFormattedAvailableBizStrings);

  }, [ownedBusinesses]); // Removed balance from dependencies - only recalculate when businesses change

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-3xl font-bold text-primary">Dashboard</CardTitle>
          <div className="flex items-center gap-2 text-accent">
            <Banknote className="h-8 w-8" />
            <span className="text-3xl font-semibold">${formattedBalance}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg shadow">
              <Clock className="h-6 w-6 text-primary" />
              <div>
                <p className="text-muted-foreground">Hourly Income</p>
                <p className="font-semibold text-lg">${formattedHourlyIncome}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg shadow">
              <TrendingUp className="h-6 w-6 text-primary" />
              <div>
                <p className="text-muted-foreground">Daily Income</p>
                <p className="font-semibold text-lg">${formattedDailyIncome}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div id="available-ventures">
        <h2 className="text-2xl font-semibold mb-4 text-primary">Available Ventures</h2>
        {availableBusinesses.filter(availBiz => !ownedBusinesses.some(ownedBiz => ownedBiz.name === availBiz.name)).length === 0 && <p className="text-muted-foreground">You've established all available ventures for now! Expand your current ones or check back later for new opportunities.</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableBusinesses.filter(availBiz => !ownedBusinesses.some(ownedBiz => ownedBiz.name === availBiz.name)).map((biz, index) => (
            <Card key={index} className="shadow-md hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-xl"><biz.icon className="h-6 w-6 text-primary" />{biz.name}</CardTitle>
                   <span className="text-xs text-muted-foreground">{biz.sector}</span>
                </div>
                <CardDescription>
                    {formattedAvailableBizStrings[biz.name] ? 
                        `Cost: $${formattedAvailableBizStrings[biz.name].cost} | Income: $${formattedAvailableBizStrings[biz.name].incomePerSecond}/sec`
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
      </div>
      
      <Separator />

      <div>
        <h2 className="text-2xl font-semibold mb-4 text-primary">My Businesses</h2>
        {ownedBusinesses.length === 0 ? (
          <Card className="text-center p-8 shadow-md">
            <CardHeader>
              <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="text-xl">No Businesses Yet!</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">Start your empire by establishing a new business venture from the "Available Ventures" section.</CardDescription>
              <Button onClick={() => {
                  const availableVenturesSection = document.querySelector('#available-ventures');
                  if (availableVenturesSection) {
                    availableVenturesSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}>
                Find Ventures
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ownedBusinesses.map((biz) => {
              const now = Date.now();
              const secondsSinceLastCollect = Math.floor((now - biz.lastCollected) / 1000);
              const collectableSeconds = Math.min(secondsSinceLastCollect, biz.productionTime);
              const progressPercentage = biz.productionTime > 0 ? (collectableSeconds / biz.productionTime) * 100 : 0;
              const incomeReadyToCollectNum = collectableSeconds * biz.incomePerSecond;
              const displayIncomeReadyToCollect = clientIncomeReadyToCollect[biz.id] || '0';


              return (
                <Card key={biz.id} className="shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
                  <CardHeader>
                     <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-xl"><biz.icon className="h-6 w-6 text-primary" />{biz.name}</CardTitle>
                        <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">Lvl {biz.level}</span>
                     </div>
                    <CardDescription>Sector: {biz.sector} | Income: ${biz.incomePerSecond.toLocaleString()}/sec</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-between">
                    <div>
                        <Image 
                            src={biz.imageUrl} 
                            alt={biz.name} 
                            width={400} 
                            height={200} 
                            className="rounded-md mb-4 object-cover aspect-video"
                            data-ai-hint={biz.aiHint} 
                        />
                        <div className="mb-2">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Production Cycle</span>
                            <span>{Math.floor(collectableSeconds/60)}m / {biz.productionTime > 0 ? biz.productionTime/60 : 0}m</span>
                            </div>
                            <Progress value={progressPercentage} className="w-full h-2" />
                            <p className="text-xs text-muted-foreground mt-1 text-right">Ready: ${displayIncomeReadyToCollect}</p>
                        </div>
                    </div>
                    <div className="space-y-2 mt-auto">
                        <Button onClick={() => collectIncome(biz.id)} className="w-full" disabled={incomeReadyToCollectNum <= 0}>
                            Collect ${displayIncomeReadyToCollect}
                        </Button>
                        <Button onClick={() => handleWatchAd(biz.id)} variant="outline" className="w-full border-accent text-accent hover:bg-accent/10">
                            <Zap className="mr-2 h-4 w-4" /> Watch Ad for Boost
                        </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

