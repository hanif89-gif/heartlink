"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  Users, 
  Flag, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/reports", icon: Flag, label: "Reports" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

const SidebarContent = ({ pathname, setIsOpen }: { pathname: string; setIsOpen: (val: boolean) => void }) => (
  <div className="flex flex-col h-full bg-slate-900 text-slate-300 w-64 shadow-2xl">
    <div className="p-6 flex items-center gap-3">
      <div className="bg-pink-500 rounded-full p-2">
        <HeartLinkIcon />
      </div>
      <div>
        <h2 className="text-white font-bold text-xl leading-none">Admin Panel</h2>
        <span className="text-xs text-pink-400 font-medium">HeartLink App</span>
      </div>
    </div>

    <nav className="flex-1 px-4 py-6 space-y-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive 
                ? "bg-pink-500/10 text-pink-500 font-semibold" 
                : "hover:bg-slate-800 hover:text-white"
            }`}
          >
            <item.icon size={20} className={isActive ? "text-pink-500" : "text-slate-400"} />
            {item.label}
          </Link>
        );
      })}
    </nav>

    <div className="p-4 border-t border-slate-800">
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-all text-slate-400"
      >
        <LogOut size={20} />
        Logout
      </button>
    </div>
  </div>
);

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <div className="lg:hidden fixed top-0 left-0 w-full h-16 bg-slate-900 flex items-center px-4 z-50 shadow-md">
        <button onClick={() => setIsOpen(true)} className="text-white">
          <Menu size={28} />
        </button>
        <span className="text-white font-bold text-lg ml-4">HeartLink Admin</span>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="absolute top-0 left-0 h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <SidebarContent pathname={pathname} setIsOpen={setIsOpen} />
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 -right-12 text-white bg-slate-900 rounded-full p-1"
              >
                <X size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar (Permanent) */}
      <div className="hidden lg:block h-screen fixed top-0 left-0">
        <SidebarContent pathname={pathname} setIsOpen={setIsOpen} />
      </div>
    </>
  );
}

function HeartLinkIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
    </svg>
  );
}
