"use client";

import { Menu, ShoppingCart, User, LogOut, UserCircle, Package } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "react-toastify";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error: unknown) {
      console.log(error)
    }
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-primary transition-colors hover:text-primary/90">
          Mega Mall
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Button>
          </Link>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm font-medium text-gray-900">
                  {user?.fullName}
                </div>
                <div className="px-2 py-1.5 text-xs text-gray-500">
                  {user?.email}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer py-2">
                  <UserCircle className="w-4 h-4 mr-2" />
                  <Link href="/profile" className="flex w-full">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer py-2">
                  <Package className="w-4 h-4 mr-2" />
                  <Link href="/orders" className="flex w-full">Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer py-2 text-destructive focus:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/signin">
                <Button variant="ghost" size="sm" className="text-sm font-medium">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="text-sm font-medium">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px]">
                <Link href="/" className="flex items-center py-6 text-xl font-bold text-primary">
                  Mega Mall
                </Link>
                <div className="flex flex-col space-y-6 mt-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="text-base font-medium text-gray-700 hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}

                  {/* Cart Link for Mobile */}
                  <Link href="/cart" className="flex items-center justify-between text-base font-medium text-gray-700 hover:text-primary transition-colors">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      Cart
                    </div>
                    {itemCount > 0 && (
                      <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {itemCount > 99 ? '99+' : itemCount}
                      </span>
                    )}
                  </Link>

                  <div className="h-px bg-gray-200 my-2"></div>
                  {isAuthenticated ? (
                    <>
                      <div className="text-sm font-medium text-gray-900 mb-2">
                        {user?.fullName}
                      </div>
                      <Link href="/profile" className="text-base font-medium text-gray-700 hover:text-primary">
                        Profile
                      </Link>
                      <Link href="/orders" className="text-base font-medium text-gray-700 hover:text-primary">
                        Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="text-base font-medium text-destructive text-left w-full"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/signin" className="text-base font-medium text-gray-700 hover:text-primary">
                        Sign In
                      </Link>
                      <Link href="/signup" className="text-base font-medium text-primary hover:text-primary/80">
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
