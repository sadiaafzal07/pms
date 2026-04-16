"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  RefreshCw,
  Users,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/inventory", label: "Inventory", icon: Package },
    { path: "/orders", label: "Orders", icon: ShoppingCart },
    { path: "/refills", label: "Refills", icon: RefreshCw },
    { path: "/customers", label: "Customers", icon: Users },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex-shrink-0">

      <div className="p-6">
        <h1 className="text-blue-600 text-lg font-semibold">
          Pharmacy MS
        </h1>
      </div>

      <nav className="px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                isActive
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

    </aside>
  );
}