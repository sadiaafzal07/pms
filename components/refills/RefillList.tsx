"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Plus,
  Download,
  CheckCircle,
  Eye,
  AlertTriangle,
  X as XIcon,
} from "lucide-react";
import { mockRefills, mockCustomers, type Refill } from "../data/mockData";

export function RefillList() {
  const [refills, setRefills] = useState<Refill[]>(mockRefills);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedChannel, setSelectedChannel] = useState("all");
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  const TODAY = new Date("2025-12-12");

  const getCustomerName = (customerId: string) =>
    mockCustomers.find((c) => c.id === customerId)?.name || "Unknown";

  const getCustomerPhone = (customerId: string) =>
    mockCustomers.find((c) => c.id === customerId)?.phone || "—";

  const isOverdue = (refill: Refill) => {
    if (!refill.next_due) return false;
    const due = new Date(refill.next_due);
    return (
      (TODAY.getTime() - due.getTime()) / (1000 * 60 * 60 * 24) > 3
    );
  };

  // Stats
  const upcomingCount = refills.filter((r) => {
    if (!r.next_due) return false;
    const due = new Date(r.next_due);
    const diff = Math.floor(
      (due.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff >= 0 && diff <= 7;
  }).length;

  const overdueCount = refills.filter((r) => isOverdue(r)).length;
  const pendingCount = refills.filter((r) => r.status === "new").length;

  const filteredRefills = useMemo(() => {
    let result = [...refills];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.id.toLowerCase().includes(query) ||
          getCustomerName(r.customer_id).toLowerCase().includes(query) ||
          getCustomerPhone(r.customer_id).toLowerCase().includes(query) ||
          r.medicines.some((m) =>
            m.medicine_name.toLowerCase().includes(query)
          )
      );
    }

    if (selectedStatus !== "all") {
      result = result.filter((r) => r.status === selectedStatus);
    }

    if (selectedChannel !== "all") {
      result = result.filter((r) => r.channel === selectedChannel);
    }

    return result;
  }, [refills, searchQuery, selectedStatus, selectedChannel]);

  const totalPages = Math.ceil(filteredRefills.length / itemsPerPage);
  const paginatedRefills = filteredRefills.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const showingFrom =
    filteredRefills.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const showingTo = Math.min(
    currentPage * itemsPerPage,
    filteredRefills.length
  );

  const handleBulkApprove = () => {
    setRefills(
      refills.map((r) =>
        r.status === "new" ? { ...r, status: "approved" } : r
      )
    );
  };

  const handleApprove = (id: string) => {
    setRefills(
      refills.map((r) =>
        r.id === id && r.status === "new" ? { ...r, status: "approved" } : r
      )
    );
  };

  const handleCancel = (id: string) => {
    if (confirm("Cancel this refill?")) {
      setRefills(
        refills.map((r) =>
          r.id === id ? { ...r, status: "cancelled" } : r
        )
      );
    }
  };

  const getStatusBadge = (status: Refill["status"]) => {
    const config: Record<string, { bg: string; text: string; label: string }> =
      {
        new: { bg: "bg-blue-100", text: "text-blue-700", label: "New Request" },
        approved: { bg: "bg-green-100", text: "text-green-700", label: "Approved" },
        ready: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Ready" },
        completed: { bg: "bg-gray-100", text: "text-gray-600", label: "Completed" },
        cancelled: { bg: "bg-red-100", text: "text-red-600", label: "Cancelled" },
      };
    const c = config[status] ?? config.new;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${c.bg} ${c.text}`}
      >
        {c.label}
      </span>
    );
  };

  const getChannelBadge = (channel: Refill["channel"]) => {
    const config: Record<string, { bg: string; text: string; label: string }> =
      {
        whatsapp: { bg: "bg-green-100", text: "text-green-700", label: "WhatsApp AI" },
        voice: { bg: "bg-blue-100", text: "text-blue-700", label: "Voice AI" },
        manual: { bg: "bg-gray-100", text: "text-gray-600", label: "Manual" },
      };
    const c = config[channel as string] ?? config.manual;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${c.bg} ${c.text}`}
      >
        {c.label}
      </span>
    );
  };

  // Contextual actions:
  // completed | cancelled → view only
  // approved | ready      → view + cancel
  // new                   → view + approve + cancel
  const getActionButtons = (refill: Refill) => {
    const isTerminal =
      refill.status === "completed" || refill.status === "cancelled";
    const isNew = refill.status === "new";

    return (
      <div className="flex items-center gap-2">
        <Link
          href={`/refills/${refill.id}`}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          title="View refill"
        >
          <Eye className="w-4 h-4" />
        </Link>

        {isNew && (
          <button
            onClick={() => handleApprove(refill.id)}
            className="text-gray-400 hover:text-green-600 transition-colors"
            title="Approve refill"
          >
            <CheckCircle className="w-4 h-4" />
          </button>
        )}

        {!isTerminal && (
          <button
            onClick={() => handleCancel(refill.id)}
            className="text-gray-400 hover:text-red-600 transition-colors"
            title="Cancel refill"
          >
            <XIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toISOString().split("T")[0];
  };

  return (
    <div className="p-8">

      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Refills</h1>
        <p className="text-sm text-gray-500">
          Manage prescription refill requests
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-blue-700">
            {upcomingCount}
          </div>
          <div className="text-sm text-blue-600 mt-0.5">
            Upcoming Refills (Next 7 days)
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-red-700">
            {overdueCount}
          </div>
          <div className="text-sm text-red-600 mt-0.5">Overdue Refills</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-yellow-700">
            {pendingCount}
          </div>
          <div className="text-sm text-yellow-600 mt-0.5">
            Multiple Pending Requests
          </div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Refill ID, phone, customer name, or medicine..."
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

      {/* Showing count + Export + Bulk Approve + New Refill */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {filteredRefills.length === 0
            ? "No refills found"
            : `Showing ${showingFrom}–${showingTo} of ${filteredRefills.length} refills`}
        </p>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={handleBulkApprove}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            Bulk Approve
          </button>
          <Link
            href="/refills/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Refill
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Refill ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Phone
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Medicine
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Qty
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Last Refill
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Next Due
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Channel
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedRefills.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="px-4 py-12 text-center text-sm text-gray-400"
                >
                  No refills found.
                </td>
              </tr>
            ) : (
              paginatedRefills.map((refill) => {
                const overdue = isOverdue(refill);
                const primaryMed = refill.medicines[0];
                const extraCount = refill.medicines.length - 1;

                return (
                  <tr
                    key={refill.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Refill ID */}
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      {refill.id}
                    </td>

                    {/* Name — clickable link */}
                    <td className="px-4 py-3 text-sm">
                      <Link
                        href={`/refills/${refill.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {getCustomerName(refill.customer_id)}
                      </Link>
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {getCustomerPhone(refill.customer_id)}
                    </td>

                    {/* Medicine — show "+1 more" if multiple */}
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {primaryMed?.medicine_name || "—"}
                      {extraCount > 0 && (
                        <span className="ml-1 text-xs text-blue-500">
                          +{extraCount} more
                        </span>
                      )}
                    </td>

                    {/* Qty */}
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {primaryMed?.qty ?? "—"}
                    </td>

                    {/* Last Refill */}
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {formatDate(refill.request_date)}
                    </td>

                    {/* Next Due — red warning if overdue */}
                    <td className="px-4 py-3 text-sm">
                      {refill.next_due ? (
                        <span
                          className={`flex items-center gap-1 ${
                            overdue ? "text-red-600 font-medium" : "text-gray-700"
                          }`}
                        >
                          {overdue && (
                            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                          )}
                          {formatDate(refill.next_due)}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    {/* Channel */}
                    <td className="px-4 py-3">
                      {getChannelBadge(refill.channel)}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      {getStatusBadge(refill.status)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      {getActionButtons(refill)}
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