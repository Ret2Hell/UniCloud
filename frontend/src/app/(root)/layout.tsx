import AppSidebar from "@/components/AppSidebar";

export default function AppLayout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-[#f5f5f9]">
      <AppSidebar />
      <div className="px-5 w-full overflow-y-scroll overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
