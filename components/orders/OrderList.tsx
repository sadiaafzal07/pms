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
  X,
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

  // ─── Filter toggle helpers ───────────────────────────────────────────────
  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
    setCurrentPage(1);
  };

  const toggleChannel = (channel: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedStatuses([]);
    setSelectedChannels([]);
    setDateRange("all");
    setCurrentPage(1);
  };

  const activeFilterCount =
    selectedStatuses.length + selectedChannels.length + (dateRange !== "all" ? 1 : 0);

  // ─── Filtering logic ─────────────────────────────────────────────────────
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
          o.items.some((item) => item.medicine_name.toLowerCase().includes(query)) ||
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
      const today = new Date();
      result = result.filter((o) => {
        const orderDate = new Date(o.date);
        const diffDays = Math.floor(
          (today.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (dateRange === "today") return diffDays === 0;
        if (dateRange === "7") return diffDays <= 7;
        if (dateRange === "30") return diffDays <= 30;
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

  const showingFrom = filteredOrders.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
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
      setOrders(orders.map((o) => (o.id === id ? { ...o, status: "cancelled" } : o)));
    }
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toISOString().split("T")[0];

  const formatOrderId = (id: string) => {
    if (id.startsWith("ORD-")) return id;
    const num = id.replace(/\D/g, "");
    return `ORD-${num.padStart(3, "0")}`;
  };

  const getStatusBadge = (status: Order["status"]) => {
    const config: Record<string, { bg: string; text: string; label: string }> = {
      pending:          { bg: "bg-gray-100",   text: "text-gray-600",   label: "Pending"   },
      processing:       { bg: "bg-blue-100",   text: "text-blue-700",   label: "Confirmed" },
      ready:            { bg: "bg-purple-100", text: "text-purple-700", label: "Ready"     },
      "out-for-delivery":{ bg: "bg-orange-100",text: "text-orange-700", label: "Preparing" },
      completed:        { bg: "bg-green-100",  text: "text-green-700",  label: "Completed" },
      cancelled:        { bg: "bg-red-100",    text: "text-red-600",    label: "Cancelled" },
    };
    const c = config[status] ?? config.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${c.bg} ${c.text}`}>
        {c.label}
      </span>
    );
  };

  const getChannelBadge = (channel: Order["channel"]) => {
    const config: Record<string, { bg: string; text: string; label: string }> = {
      whatsapp: { bg: "bg-green-100", text: "text-green-700", label: "WhatsApp" },
      call:     { bg: "bg-blue-100",  text: "text-blue-700",  label: "Call"     },
      "walk-in":{ bg: "bg-gray-100",  text: "text-gray-600",  label: "Walk-in"  },
    };
    const c = config[channel] ?? config["walk-in"];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${c.bg} ${c.text}`}>
        {c.label}
      </span>
    );
  };

  const getActionButtons = (order: Order) => {
    const isTerminal = order.status === "completed" || order.status === "cancelled";
    return (
      <div className="flex items-center gap-2">
        <Link
          href={`/orders/${order.id}`}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          title="View order"
        >
          <Eye className="w-4 h-4" />
        </Link>
        {!isTerminal && (
          <Link
            href={`/orders/${order.id}/edit`}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Edit order"
          >
            <Edit className="w-4 h-4" />
          </Link>
        )}
        {!isTerminal && (
          <button
            onClick={() => handleMarkCompleted(order.id)}
            className="text-gray-400 hover:text-green-600 transition-colors"
            title="Mark as completed"
          >
            <CheckCircle className="w-4 h-4" />
          </button>
        )}
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

  // ─── Status / Channel options ─────────────────────────────────────────────
  const statusOptions = [
    { value: "pending",           label: "Pending"   },
    { value: "processing",        label: "Confirmed" },
    { value: "ready",             label: "Ready"     },
    { value: "out-for-delivery",  label: "Preparing" },
    { value: "completed",         label: "Completed" },
    { value: "cancelled",         label: "Cancelled" },
  ];

  const channelOptions = [
    { value: "whatsapp", label: "WhatsApp" },
    { value: "call",     label: "Call"     },
    { value: "walk-in",  label: "Walk-in"  },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 mb-1">Orders</h1>
        <p className="text-xs sm:text-sm text-gray-500">Manage customer orders and deliveries</p>
      </div>

      {/* Search + Filter button */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Order ID, customer name, phone, medicine, or status..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
            showFilters || activeFilterCount > 0
              ? "border-blue-500 text-blue-600 bg-blue-50"
              : "border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* ── FILTER PANEL ── */}
      {showFilters && (
        <div className="mb-4 p-4 bg-white border border-gray-200 rounded-lg space-y-4">

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Filter Orders</span>
            <div className="flex items-center gap-3">
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Clear all
                </button>
              )}
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* Order Status */}
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Order Status
              </p>
              <div className="space-y-1.5">
                {statusOptions.map((s) => (
                  <label key={s.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedStatuses.includes(s.value)}
                      onChange={() => toggleStatus(s.value)}
                      className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{s.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Order Type */}
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Order Type
              </p>
              <div className="space-y-1.5">
                {channelOptions.map((c) => (
                  <label key={c.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedChannels.includes(c.value)}
                      onChange={() => toggleChannel(c.value)}
                      className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{c.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Date Range
              </p>
              <div className="space-y-1.5">
                {[
                  { value: "all",   label: "All time"    },
                  { value: "today", label: "Today"       },
                  { value: "7",     label: "Last 7 days" },
                  { value: "30",    label: "Last 30 days"},
                ].map((d) => (
                  <label key={d.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="dateRange"
                      value={d.value}
                      checked={dateRange === d.value}
                      onChange={() => { setDateRange(d.value); setCurrentPage(1); }}
                      className="w-3.5 h-3.5 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{d.label}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedStatuses.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200"
            >
              {statusOptions.find((o) => o.value === s)?.label}
              <button onClick={() => toggleStatus(s)} className="hover:text-blue-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {selectedChannels.map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200"
            >
              {channelOptions.find((o) => o.value === c)?.label}
              <button onClick={() => toggleChannel(c)} className="hover:text-blue-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {dateRange !== "all" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200">
              {dateRange === "today" ? "Today" : dateRange === "7" ? "Last 7 days" : "Last 30 days"}
              <button onClick={() => setDateRange("all")} className="hover:text-blue-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Count + Export + New Order */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <p className="text-sm text-gray-500">
          {filteredOrders.length === 0
            ? "No orders found"
            : `Showing ${showingFrom}–${showingTo} of ${filteredOrders.length} orders`}
        </p>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <Link
            href="/orders/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Order</span>
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-white">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Order Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Customer Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Order Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Order Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">Total Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-400">
                    No orders found.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => {
                  const customer = getCustomer(order.customer_id);
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/orders/${order.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          {formatOrderId(order.id)}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{formatDate(order.date)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{customer?.name || "Unknown"}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{customer?.phone || "—"}</td>
                      <td className="px-4 py-3">{getChannelBadge(order.channel)}</td>
                      <td className="px-4 py-3">{getStatusBadge(order.status)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">PKR {order.total.toLocaleString()}</td>
                      <td className="px-4 py-3">{getActionButtons(order)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Items per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
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
            <span className="text-gray-500">Page {currentPage} of {totalPages || 1}</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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