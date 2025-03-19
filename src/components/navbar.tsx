"use client";

import Link from "next/link";
import { createClient } from "../../supabase/client";
import { Button } from "./ui/button";
import { Home, Menu } from "lucide-react";
import UserProfile from "./user-profile";
import LanguageSwitcher from "./language-switcher";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useState } from "react";

export default function Navbar() {
  const supabase = createClient();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    getUser();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" prefetch className="text-xl font-bold flex items-center">
          <Home className="mr-2 text-blue-600" />
          <span className="text-blue-600">Sakan</span>
          <span className="text-gray-800">Egypt</span>
        </Link>

        <div className="hidden md:flex space-x-6">
          <Link
            href="/properties"
            className="text-gray-700 hover:text-blue-600"
          >
            Properties
          </Link>
          <Link href="/furniture" className="text-gray-700 hover:text-blue-600">
            Furniture
          </Link>
          <Link
            href="/maintenance"
            className="text-gray-700 hover:text-blue-600"
          >
            Maintenance
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-blue-600">
            About Us
          </Link>
        </div>

        <div className="flex gap-4 items-center">
          <LanguageSwitcher />

          {user ? (
            <>
              <Link href="/dashboard" className="hidden md:block">
                <Button>Dashboard</Button>
              </Link>
              <UserProfile />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="hidden md:block px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="hidden md:block px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-4 mt-8">
                  <Link href="/properties" className="text-lg font-medium">
                    Properties
                  </Link>
                  <Link href="/furniture" className="text-lg font-medium">
                    Furniture
                  </Link>
                  <Link href="/maintenance" className="text-lg font-medium">
                    Maintenance
                  </Link>
                  <Link href="/about" className="text-lg font-medium">
                    About Us
                  </Link>
                  {user ? (
                    <Link href="/dashboard" className="text-lg font-medium">
                      Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link href="/sign-in" className="text-lg font-medium">
                        Sign In
                      </Link>
                      <Link href="/sign-up" className="text-lg font-medium">
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
    </nav>
  );
}
