"use client";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ArrowRight } from "lucide-react";
import Link from "next/link";


export const AlgoLink = ({ name, link }) => {
  return (
    <Link
      href={link}
      rel="noopener noreferrer"
      className="flex items-center justify-between px-4 py-2 rounded-md hover:text-blue-500 transition-colors group"
    >
      <span>{name}</span>
      <ArrowRight className="size-4 group-hover:translate-x-1 relative transition-transform duration-300" />
    </Link>
  );
};

export const CategorySection = ({ name, children }) => {
  const [open, setOpen] = useState(true);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="mb-2">
      <CollapsibleTrigger className="bg-primary/10 py-3 px-4 flex items-center justify-between w-full font-semibold rounded-md cursor-pointer mb-1">
        {name || "Unnamed"}
        <ChevronDown
          className={`w-5 h-5 transition-transform ${open ? "rotate-0" : "-rotate-90"}`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col gap-1 pl-1">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};