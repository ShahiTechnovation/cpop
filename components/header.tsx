"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/components/wallet-provider"
import { Logo } from "@/components/logo"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, LogOut, User } from "lucide-react"

export function Header() {
  const { connected, connectWallet, disconnectWallet, publicKey, username } = useWallet()
  const pathname = usePathname()

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Events", path: "/events" },
    { name: "Explore", path: "/explore" },
  ]

  return (
    <header className="border-b border-border/40 backdrop-blur-sm fixed w-full z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.path ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {connected ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  {username ||
                    (publicKey
                      ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`
                      : "Connected")}
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <User size={16} />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/my-tokens" className="flex items-center gap-2">
                    <span>My Tokens</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={disconnectWallet} className="flex items-center gap-2 text-destructive">
                  <LogOut size={16} />
                  <span>Disconnect</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={connectWallet} className="bg-primary hover:bg-primary/90">
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
