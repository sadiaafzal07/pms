"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Plus,
  Download,
  Eye,
  Edit,
  XCircle,
  CheckCircle,
} from "lucide-react";
import { getAllOrders, getCustomerById, type Order } from "../data/mockData";

export function OrderList() {
  const [orders, setOrders] = useState<Order[]>(getAllOrders());
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<string>("all");
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  const getCustomer = (customerId: string) => getCustomerById(customerId);

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((o) => {
        const customer = getCustomer(o.customer_id);
        return (
          o.id.toLowerCase().includes(query) ||
          customer?.name.toLowerCase().includes(query) ||
          customer?.phone.toLowerCase().includes(query) ||
          o.items.some((item) =>
            item.medicine_name.toLowerCase().includes(query)
          ) ||
          o.status.toLowerCase().includes(query)
        );
      });
    }

    if (selectedStatuses.length > 0) {
      result = result.filter((o) => selectedStatuses.includes(o.status));
    }

    if (selectedChannels.length > 0) {
      result = result.filter((o) => selectedChannels.includes(o.channel));
    }

    if (dateRange !== "all") {
      const today = new Date("2025-12-12");
      result = result.filter((o) => {
        const orderDate = new Date(o.date);
        const diffDays = Math.floor(
          (today.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (dateRange === "today") return diffDays === 0;
        if (dateRange === "7") return diffDays <= 7;
        return true;
      });
    }

    return result.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [orders, searchQuery, selectedStatuses, selectedChannels, dateRange]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // "Showing 1–7 of 7 orders" format
  const showingFrom =
    filteredOrders.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const showingTo = Math.min(currentPage * itemsPerPage, filteredOrders.length);

  const handleMarkCompleted = (id: string) => {
    setOrders(
      orders.map((o) =>
        o.id === id && o.items.length > 0 && o.status !== "cancelled"
          ? { ...o, status: "completed" }
          : o
      )
    );
  };

  const handleCancel = (id: string) => {
    if (confirm("Are you sure you want to cancel this order?")) {
      setOrders(
        orders.map((o) => (o.id === id ? { ...o, status: "cancelled" } : o))
      );
    }
  };

  // Format date to match Figma: "2025-12-12"
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toISOString().split("T")[0];
  };

  // Format Order ID to ORD-001 style
  const formatOrderId = (id: string) => {
    // If already in ORD-XXX format, return as-is
    if (id.startsWith("ORD-")) return id;
    // Otherwise format numeric id
    const num = id.replace(/\D/g, "");
    return `ORD-${num.padStart(3, "0")}`;
  };

  const getStatusBadge = (status: Order["status"]) => {
    const config: Record<string, { bg: string; text: string; label: string }> =
      {
        pending: {
          bg: "bg-gray-100",
          text: "text-gray-600",
          label: "Pending",
        },
        processing: {
          bg: "bg-blue-100",
          text: "text-blue-700",
          label: "Confirmed",
        },
        ready: {
          bg: "bg-purple-100",
          text: "text-purple-700",
          label: "Ready",
        },
        "out-for-delivery": {
          bg: "bg-orange-100",
          text: "text-orange-700",
          label: "Preparing",
        },
        completed: {
          bg: "bg-green-100",
          text: "text-green-700",
          label: "Completed",
        },
        cancelled: {
          bg: "bg-red-100",
          text: "text-red-600",
          label: "Cancelled",
        },
      };
    const c = config[status] ?? config.pending;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${c.bg} ${c.text}`}
      >
        {c.label}
      </span>
    );
  };

  const getChannelBadge = (channel: Order["channel"]) => {
    const config: Record<string, { bg: string; text: string; label: string }> =
      {
        whatsapp: {
          bg: "bg-green-100",
          text: "text-green-700",
          label: "WhatsApp",
        },
        call: {
          bg: "bg-blue-100",
          text: "text-blue-700",
          label: "Call",
        },
        "walk-in": {
          bg: "bg-gray-100",
          text: "text-gray-600",
          label: "Walk-in",
        },
      };
    const c = config[channel] ?? config["walk-in"];
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${c.bg} ${c.text}`}
      >
        {c.label}
      </span>
    );
  };

  // Contextual action buttons matching Figma:
  // completed or cancelled → view only
  // active → view + edit + complete + cancel
  const getActionButtons = (order: Order) => {
    const isTerminal =
      order.status === "completed" || order.status === "cancelled";

    return (
      <div className="flex items-center gap-2">
        {/* View — always shown */}
        <Link
          href={`/orders/${order.id}`}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          title="View order"
        >
          <Eye className="w-4 h-4" />
        </Link>

        {/* Edit — only for active orders */}
        {!isTerminal && (
          <Link
            href={`/orders/${order.id}/edit`}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Edit order"
          >
            <Edit className="w-4 h-4" />
          </Link>
        )}

        {/* Mark completed — only for active orders */}
        {!isTerminal && (
          <button
            onClick={() => handleMarkCompleted(order.id)}
            className="text-gray-400 hover:text-green-600 transition-colors"
            title="Mark as completed"
          >
            <CheckCircle className="w-4 h-4" />
          </button>
        )}

        {/* Cancel — only for active orders */}
        {!isTerminal && (
          <button
            onClick={() => handleCancel(order.id)}
            className="text-gray-400 hover:text-red-600 transition-colors"
            title="Cancel order"
          >
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="p-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Orders</h1>
        <p className="text-sm text-gray-500">
          Manage pharmacy orders and prescriptions
        </p>
      </div>

      {/* Search + Filters */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Order ID, customer name, phone, medicine, or status..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
            showFilters
              ? "border-blue-500 text-blue-600 bg-blue-50"
              : "border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Showing count + Export + New Order */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {filteredOrders.length === 0
            ? "No orders found"
            : `Showing ${showingFrom}–${showingTo} of ${filteredOrders.length} orders`}
        </p>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <Link
            href="/orders/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Order
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-white">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Order ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Order Date &amp; Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Customer Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Phone
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Order Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Order Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Total Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-12 text-center text-sm text-gray-400"
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              paginatedOrders.map((order) => {
                const customer = getCustomer(order.customer_id);
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        href={`/orders/${order.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        {formatOrderId(order.id)}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {formatDate(order.date)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {customer?.name || "Unknown"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {customer?.phone || "—"}
                    </td>
                    <td className="px-4 py-3">
                      {getChannelBadge(order.channel)}
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      {getActionButtons(order)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Items per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-2 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="disabled:opacity-40 hover:text-gray-900 transition-colors"
            >
              Previous
            </button>
            <span className="text-gray-500">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages || totalPages === 0}
              className="disabled:opacity-40 hover:text-gray-900 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}