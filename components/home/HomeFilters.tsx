"use client";

import { HomePageFilters } from "@/constants/filters";
import React from "react";
import { Button } from "../ui/button";

const HomeFilters = () => {
  const active = "newest";
  // This class tells us wich tag button is currently active

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
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;
