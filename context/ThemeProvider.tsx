// This is used for light and dark theme
// We will create a context for this

// Since this is a provider, we will add 'use client' directive on top

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// for the sake of typescript
interface ThemeContextType {
  mode: string;
  setMode: (mode: string) => void;
  // here in set mode we have a function which accepts the mode as a string and returns void (it does not return anything, simply changes the mode)
}

// creating context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
// undefined is the default value

// We will wrap our entire app with this theme provider function
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // defined children type here ↑

  // We can use any state here
  const [mode, setMode] = useState("");
  // This state can be light or dark

  const handleThemeChange = () => {
    if (mode === "dark") {
      setMode("light");
      document.documentElement.classList.add("light");
    } else {
      setMode("dark");
      document.documentElement.classList.add("dark");
    }
  };

  // When will we make use of this => At the start of the app, hence, useEffect
  useEffect(() => {
    handleThemeChange();
  }, [mode]);
  // Call handleThemeChange(); every time mode in dependency changes

  // Every provider has to return something, generally they return a context
  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeContext.Provider>
    // By putting mode and set mode in value, we can use it in everywhere in our app
    // Wrapping the children with theme context provider means giving all children components, the option of adapting light or dark theme.
  );
}

// Whenever we create a custom context, it is better to use this export function
export function useTheme() {
  // This eases our work
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
