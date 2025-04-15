"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavItem = ({ children, href, name, isCollapsed }: NavItemProps) => {
  const isActive = usePathname().startsWith(href);

  const className = cn(
    "mb-1 flex items-center gap-2 p-2 cursor-pointer",
    isActive ? "bg-[#696cff] text-white" : "text-slate-500",
    isCollapsed ? "rounded-full h-10 w-10 justify-center" : "rounded-md",
    "hover:bg-[#696cff] hover:text-white",
    name === "Logout" && "text-red-500 hover:bg-red-500"
  );

  return (
    <Link href={href} className={className}>
      {children}
      {!isCollapsed && <span>{name}</span>}
    </Link>
  );
};

export default NavItem;
