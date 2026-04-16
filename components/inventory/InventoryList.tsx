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
  Package,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import {
  getAllMedicines,
  deleteMedicine,
  calculateMedicineStatus,
  type Medicine,
} from "../data/mockData";

export function InventoryList() {
  const [medicines, setMedicines] = useState<Medicine[]>(getAllMedicines());
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedForms, setSelectedForms] = useState<string[]>([]);
  const [showLowStock, setShowLowStock] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  const expiringSoonCount = medicines.filter(
    (m) => calculateMedicineStatus(m) === "expiring-soon"
  ).length;

  const expiredCount = medicines.filter(
    (m) => calculateMedicineStatus(m) === "expired"
  ).length;

  const filteredMedicines = useMemo(() => {
    let result = medicines.map((m) => ({
      ...m,
      status: calculateMedicineStatus(m),
    }));

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.generic.toLowerCase().includes(query)
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter((m) => selectedCategories.includes(m.category));
    }

    if (selectedForms.length > 0) {
      result = result.filter((m) => selectedForms.includes(m.form));
    }

    if (showLowStock) {
      result = result.filter(
        (m) => m.status === "low-stock" || m.status === "out-of-stock"
      );
    }

    return result;
  }, [medicines, searchQuery, selectedCategories, selectedForms, showLowStock]);

  const totalPages = Math.ceil(filteredMedicines.length / itemsPerPage);

  const paginatedMedicines = filteredMedicines.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const showingFrom =
    filteredMedicines.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const showingTo = Math.min(
    currentPage * itemsPerPage,
    filteredMedicines.length
  );

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      deleteMedicine(id);
      setMedicines(getAllMedicines());
    }
  };

  const getStatusBadge = (
    status: "in-stock" | "low-stock" | "expiring-soon" | "expired" | "out-of-stock"
  ) => {
    const config = {
      "in-stock": { bg: "bg-green-100", text: "text-green-700", label: "In Stock" },
      "low-stock": { bg: "bg-yellow-100", text: "text-yellow-700", label: "Low Stock" },
      "expiring-soon": { bg: "bg-orange-100", text: "text-orange-700", label: "Expiring Soon" },
      "expired": { bg: "bg-red-100", text: "text-red-600", label: "Expired" },
      "out-of-stock": { bg: "bg-gray-100", text: "text-gray-600", label: "Out of Stock" },
    };
    const c = config[status];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
        {c.label}
      </span>
    );
  };

  return (
    <div className="p-8">

      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Inventory</h1>
        <p className="text-sm text-gray-500">Manage medicine stock and batches</p>
      </div>

      {/* Alert cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <div>
            <div className="text-sm font-medium text-yellow-900">
              {expiringSoonCount} Expiring Soon
            </div>
            <div className="text-xs text-yellow-700">Within 90 days</div>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <div className="text-sm font-medium text-red-900">
              {expiredCount} Expired Items
            </div>
            <div className="text-xs text-red-700">Action required</div>
          </div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search medicines..."
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

      {/* Showing count + actions */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {filteredMedicines.length === 0
            ? "No medicines found"
            : `Showing ${showingFrom}–${showingTo} of ${filteredMedicines.length} medicines`}
        </p>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <Link
            href="/inventory/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Medicine
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Generic</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Strength</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Form</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Category</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">Qty</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Batch</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Expiry</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">Price</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedMedicines.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-4 py-12 text-center text-sm text-gray-400">
                  No medicines found.
                </td>
              </tr>
            ) : (
              paginatedMedicines.map((medicine) => (
                <tr key={medicine.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/inventory/${medicine.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      {medicine.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{medicine.generic}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{medicine.strength}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{medicine.form}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{medicine.category}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{medicine.total_qty}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{medicine.batches.length} batch</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{medicine.batches[0]?.expiry_date ?? "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">${medicine.unit_price}</td>
                  <td className="px-4 py-3">{getStatusBadge(calculateMedicineStatus(medicine))}</td>

                  {/* Action buttons — view, edit, add batch, delete */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">

                      {/* View */}
                      <Link
                        href={`/inventory/${medicine.id}`}
                        title="View medicine"
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      {/* Edit */}
                      <Link
                        href={`/inventory/${medicine.id}/edit`}
                        title="Edit medicine"
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>

                      {/* Add Batch */}
                      <Link
                        href={`/inventory/${medicine.id}?tab=batch`}
                        title="Add batch"
                        className="text-gray-400 hover:text-green-600 transition-colors"
                      >
                        <Package className="w-4 h-4" />
                      </Link>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(medicine.id, medicine.name)}
                        title="Delete medicine"
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
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