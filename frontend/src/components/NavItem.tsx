"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import React from "react";

const NavItem = ({ children, href, name, isCollapsed }: NavItemProps) => {
  return (
    <Link
      href={href}
      className={`mb-1 flex items-center gap-2 p-2  hover:bg-[#696cff] hover:text-white cursor-pointer ${
        usePathname().startsWith(href)
          ? "bg-[#696cff] text-white"
          : "text-slate-500"
      }
    ${isCollapsed ? "rounded-full h-10 w-10 justify-center" : "rounded-md"}
  `}
    >
      {children}
      {!isCollapsed && <span>{name}</span>}
    </Link>
  );
};

export default NavItem;
