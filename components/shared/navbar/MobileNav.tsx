"use client";

import React from "react";

// Using Sheets (see notes): https://ui.shadcn.com/docs/components/sheet
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";

const NavContent = () => {
  const pathname = usePathname();
  //   this is a hook, hence use "use client"

  return (
    // Take this section to the full height of the screen
    <section className="flex h-full flex-col gap-6 pt-16">
      {sidebarLinks.map((item) => {
        const isActive =
          (pathname.includes(item.route) && item.route.length > 1) ||
          pathname === item.route;
        return (
          // the sidebar links is just an array of objects, so we just return the SheetClose in each one of them.

          <SheetClose asChild key={item.route}>
            <Link
              href={item.route}
              className={`${isActive ? "primary-gradient text-light-900 rounded-lg" : "text-dark300_light900"} flex items-center justify-start gap-4 bg-transparent p-4`}
            >
              {/* Styling the links in sidebar above */}

              <Image
                src={item.imgURL}
                alt={item.label}
                width={20}
                height={20}
                className={`${isActive ? "" : "invert-colors"}`}
              />
              <p className={`${isActive ? "base-bold" : "base-medium"}`}>
                {item.label}
              </p>
            </Link>
          </SheetClose>
        );
      })}
    </section>
  );
};

const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {/* This SheetTrigger Acts as a Child */}
        <Image
          src="/assets/icons/hamburger.svg"
          width={36}
          height={36}
          alt="Menu"
          className="invert-colors cursor-pointer sm:hidden"
        />
        {/* Hamburger only visible in small devices, it will be hidden in larger devices */}
      </SheetTrigger>
      <SheetContent
        side="left"
        className="background-light900_dark200 border-none "
      >
        <Link href="/" className="flex items-center gap-1">
          <Image
            src="/assets/images/site-logo.svg"
            width={23}
            height={23}
            alt="DevFlow"
          />
          <p className="h2-bold text-dark100_light900 font-spaceGrotesk">
            Dev <span className="text-primary-500">Flow</span>
          </p>
        </Link>
        <div>
          <SheetClose asChild>
            {/* asChild means, show something in there */}
            <NavContent />
          </SheetClose>

          {/* Now suppose we are signed out, we will have buttons to sign us back in */}
          <SignedOut>
            <div className="flex flex-col gap-3">
              <SheetClose asChild>
                <Link href="/sign-in">
                  <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                    <span className="primary-text-gradient">Log In</span>
                  </Button>
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link href="/sign-up">
                  <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none">
                    Sign Up
                  </Button>
                </Link>
              </SheetClose>
            </div>
          </SignedOut>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
