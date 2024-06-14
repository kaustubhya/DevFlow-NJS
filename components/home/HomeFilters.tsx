"use client";

import { HomePageFilters } from "@/constants/filters";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { formUrlQuery } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";

const HomeFilters = () => {
  // const active = "frequent"; // old frontend code
  // This class tells us wich tag button is currently active

  const searchParams = useSearchParams();
  const router = useRouter();

  const [active, setActive] = useState("");

  const handleTypeClick = (item: string) => {
    // for query change in url effect for filters

    if (active === item) {
      setActive(""); // sets color of inactive tab

      const newUrl = formUrlQuery({
        // why send params again when we already have q (querries). ANS -> There could already be many other params like category, filtering, pages etc..
        params: searchParams.toString(),
        key: "filter",
        value: null,
        // see lib > utils.tsx
      });
      // we are back from lib.utils (we modified only the search property here, keeping all other url same)
      router.push(newUrl, { scroll: false });
    } else {
      setActive(item); // sets color of active tab

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: item.toLowerCase(),
        // see lib > utils.tsx
        // Initially, filters were active and on clicking them, they became unactive, so to reverse it, we put the activation code in else and de-activation code in if
      });

      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {/* These tags will be hidden in smaller screens */}
      {HomePageFilters.map((item) => (
        <Button
          key={item.value}
          onClick={() => {}}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${
            active === item.value
              ? "bg-primary-100 text-primary-500"
              : "bg-light-800 text-light-500"
          }`}
          // https://tailwindcss.com/docs/text-transform#transforming-text
          onClickCapture={() => handleTypeClick(item.value)}
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;
