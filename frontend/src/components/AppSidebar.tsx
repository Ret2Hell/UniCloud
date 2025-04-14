"use client";

import Image from "next/image";
import React, { useState } from "react";
import NavItem from "./NavItem";
import { ChevronRight, ChevronLeft, Folder, Heart } from "lucide-react";

const AppSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  function toggleSidebar() {
    setIsCollapsed((prev) => !prev);
  }
  const sidebarClass =
    (isCollapsed ? "w-20" : "w-64") +
    " bg-white p-4 min-h-[calc(100vh-4rem)] relative";

  return (
    <aside className={sidebarClass}>
      <div className="flex items-center ">
        <Image src="logo.svg" alt="Logo" width={44} height={44} />
        {!isCollapsed && (
          <h1 className="text-2xl font-bold text-slate-600">UniCloud</h1>
        )}
        <div className="absolute -right-5 p-2 rounded-full outline-none bg-[#f5f5f9]">
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-full outline-none bg-[#696cff] hover:bg-[#5f61e6] text-white flex items-center justify-center cursor-pointer"
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>
      </div>
      <nav className="mt-4 flex flex-col gap-1">
        <NavItem name="Explorer" href="/home" isCollapsed={isCollapsed}>
          <Folder />
        </NavItem>
        <NavItem
          name="My Collection"
          href="/home/my-collection"
          isCollapsed={isCollapsed}
        >
          <Heart />
        </NavItem>
      </nav>
    </aside>
  );
};

export default AppSidebar;
