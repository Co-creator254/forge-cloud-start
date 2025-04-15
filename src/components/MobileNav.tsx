
import * as React from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const items = [
  {
    title: "Home",
    href: "/",
  },
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

export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base sm:hidden"
          aria-label="Toggle Menu"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <Link
          to="/"
          className="flex items-center"
          onClick={() => setOpen(false)}
        >
          <span className="font-bold">AgriConnect</span>
        </Link>
        <div className="flex flex-col space-y-3 mt-4">
          {items.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setOpen(false)}
            >
              {item.title}
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
