"use client";

import { sidebarLinks } from "@/constants";
import React from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SignedOut } from "@clerk/nextjs";
import { Button } from "../ui/button";

const LeftSidebar = () => {
  const pathname = usePathname();

  return (
    <section className="background-light900_dark200 light-border shadow-light-300 custom-scrollbar sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 max-sm:hidden lg:w-[266px] dark:shadow-none">
      {/* Use the overflow-y-auto utility to allow vertical scrolling if needed.  */}

      <div className="flex flex-1 flex-col gap-6">
        {sidebarLinks.map((item) => {
          const isActive =
            (pathname.includes(item.route) && item.route.length > 1) ||
            pathname === item.route;
          return (
            // the sidebar links is just an array of objects, so we just return the SheetClose in each one of them.

            <Link
              key={item.route}
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
              <p
                className={`${isActive ? "base-bold" : "base-medium"} max-lg:hidden`}
              >
                {/* max-lg:hidden => This will make only the icons of the sidebar visible when we start to collapse the sidebar */}

                {item.label}
              </p>
            </Link>
          );
        })}
      </div>

      <SignedOut>
        <div className="flex flex-col gap-3">
          <Link href="/sign-in">
            <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
              {/* Showing only text of Login and Signup button and not images when we expand the screen i.e. increase the screen size */}
              <Image
                src="/assets/icons/accounts.svg"
                alt="login"
                width={20}
                height={20}
                className="invert-colors lg:hidden"
              />
              {/* max-lg:hidden => Showing only images of Login and Signup button and not text when we collapse the screen i.e. reduce the screen size */}
              <span className="primary-text-gradient max-lg:hidden">
                Log In
              </span>
            </Button>
          </Link>

          <Link href="/sign-up">
            <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
              {/* Showing only text of Login and Signup button and not images when we expand the screen i.e. increase the screen size */}
              <Image
                src="/assets/icons/sign-up.svg"
                alt="sign up"
                width={20}
                height={20}
                className="invert-colors lg:hidden"
              />
              {/* max-lg:hidden => Showing only images of Login and Signup button and not text when we collapse the screen i.e. reduce the screen size */}
              <span className="max-lg:hidden">Sign Up</span>
            </Button>
          </Link>
        </div>
      </SignedOut>
    </section>
  );
};

export default LeftSidebar;
