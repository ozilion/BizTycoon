
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Home, Briefcase, User, Settings, DollarSign, Zap, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { DashboardPage } from '@/components/dashboard/dashboard-page';
import { ThemeToggle } from '@/components/theme-toggle';

export default function BizTycoonApp() {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-3">
            <DollarSign className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-primary">BizTycoon</h1>
              <p className="text-xs text-muted-foreground">Your Business Empire Awaits</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/" passHref legacyBehavior>
                <SidebarMenuButton isActive tooltip="Dashboard">
                  <Home />
                  Dashboard
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/ventures" passHref legacyBehavior>
                <SidebarMenuButton tooltip="Business Ventures">
                  <Briefcase />
                  Ventures
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/profile" passHref legacyBehavior>
                <SidebarMenuButton tooltip="Profile">
                  <User />
                  Profile
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 flex flex-col gap-2">
          <Link href="/premium" passHref legacyBehavior>
             <Button variant="default" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                <Zap className="mr-2 h-4 w-4" /> Go Premium
              </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://picsum.photos/100/100?q=avatar" alt="User Avatar" data-ai-hint="user avatar" />
                <AvatarFallback>BT</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">User Name</span>
            </div>
            <ThemeToggle />
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-2">
          <SidebarTrigger className="md:hidden" />
           <div className="flex items-center gap-2 ml-auto">
             <SettingsDialog />
           </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:px-6 sm:py-0">
          <DashboardPage />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function SettingsDialog() {
  // Placeholder for settings modal, will be implemented later.
  // For now, it's a simple button.
  return (
    <Button variant="outline" size="icon" aria-label="Settings">
      <Settings className="h-5 w-5" />
    </Button>
  );
}
