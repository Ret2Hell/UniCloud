"use client";

import Image from "next/image";
import React, { useState } from "react";
import NavItem from "./NavItem";
import { ChevronRight, ChevronLeft, Folder, Heart, LogOut } from "lucide-react";
import { useLogoutMutation } from "@/state/api";
import { useRouter } from "next/navigation";

const AppSidebar = () => {
  const [logout] = useLogoutMutation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();

  function toggleSidebar() {
    setIsCollapsed((prev) => !prev);
  }

  const handleLogout = async () => {
    try {
      await logout({}).unwrap();
      router.push("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };
  const sidebarClass =
    (isCollapsed ? "w-20" : "w-64") +
    " bg-white p-4 min-h-[calc(100vh-4rem)] relative flex flex-col";

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
      <nav className="mt-8 flex flex-col gap-1">
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
      <div className="mt-auto" onClick={handleLogout}>
        <NavItem name="Logout" href="#" isCollapsed={isCollapsed}>
          <LogOut />
        </NavItem>
      </div>
    </aside>
  );
};

export default AppSidebar;
