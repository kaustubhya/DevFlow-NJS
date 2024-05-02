import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  // Children here is all the pages in the sign-up and sign-in folder.

  // {children} : { children: React.ReactNode } => Defining children in typescript of type React.ReactNode.
  return (
    <main className="flex min-h-screen w-full items-center justify-center">
      <div>{children}</div>
    </main>
  );
};

export default Layout;
