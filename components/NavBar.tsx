"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  SignInButton,
  UserButton,
  ClerkLoaded,
  useAuth,
  useUser,
} from "@clerk/nextjs";

const NavBar = () => {
  const navItems = [
    { label: "Library", href: "/" },
    { label: "Add New", href: "/books/new" },
  ];

  const pathname = usePathname();

  const { isSignedIn } = useAuth();
  const { user } = useUser();

  return (
    <header className="w-full fixed z-50 bg-(--bg-primary)">
      <div className="wrapper navbar-height py-4 flex justify-between items-center">
        <Link href="/" className="flex gap-0.5 items-center">
          <Image
            src="/assets/logo.png"
            alt="WiseNovel AI"
            width={42}
            height={26}
          />
          <span className="logo-text">WiseNovel AI</span>
        </Link>

        <nav className="w-fit flex gap-7.5 items-center">
          {navItems.map(({ label, href }) => {
            const isActive =
              pathname === href || (href !== "/" && pathname.startsWith(href));

            return (
              <Link
                key={label}
                href={href}
                className={cn(
                  "nav-link-base",
                  isActive ? "nav-link-active" : "text-black hover:opacity-70",
                )}
              >
                {label}
              </Link>
            );
          })}
          <div className="flex gap-2 items-center">
            <ClerkLoaded>
              {isSignedIn ? (
                <>
                  <UserButton />
                  {user?.firstName && (
                    <Link href="/subscription" className="nav-user-name">
                      {" "}
                      {user.firstName}{" "}
                    </Link>
                  )}
                </>
              ) : (
                <SignInButton mode="modal">
                  <div className="nav-user-link">
                    <button className="text-black hover:opacity-70">
                      Sign in
                    </button>
                  </div>
                </SignInButton>
              )}
            </ClerkLoaded>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
