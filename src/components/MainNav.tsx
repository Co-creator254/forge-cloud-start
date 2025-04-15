
import * as React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const items = [
  {
    title: "Commodity Trading",
    href: "/commodity-trading",
  },
  {
    title: "Supply Chain",
    href: "/supply-chain-problems",
  },
  {
    title: "Data",
    href: "/kilimo-ams-data",
  },
  {
    title: "APIs",
    href: "/api-docs",
  },
];

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      {items.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
