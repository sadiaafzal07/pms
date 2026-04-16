"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Plus } from "lucide-react";
import {
  getMedicineById,
  deleteMedicine,
  calculateMedicineStatus,
  type Medicine,
} from "../data/mockData";

export function MedicineDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const medicineData = getMedicineById(id!);
  const [medicine] = useState<Medicine | undefined>(medicineData);

  if (!medicine) {
    return (
      <div className="p-8">
        <div className="text-center py-20">
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Medicine Not Found
          </h2>
          <Link href="/inventory" className="text-blue-600 hover:text-blue-700 text-sm">
            ← Back to Inventory
          </Link>
        </div>
      </div>
    );
  }

  const status = calculateMedicineStatus(medicine);

  const getStatusBadge = (
    s: "in-stock" | "low-stock" | "expiring-soon" | "expired" | "out-of-stock"
  ) => {
    const config = {
      "in-stock": { bg: "bg-green-100", text: "text-green-700", label: "In Stock" },
      "low-stock": { bg: "bg-yellow-100", text: "text-yellow-700", label: "Low Stock" },
      "expiring-soon": { bg: "bg-orange-100", text: "text-orange-700", label: "Expiring Soon" },
      "expired": { bg: "bg-red-100", text: "text-red-600", label: "Expired" },
      "out-of-stock": { bg: "bg-gray-100", text: "text-gray-600", label: "Out of Stock" },
    };
    const c = config[s];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
        {c.label}
      </span>
    );
  };

  // Delete: remove from shared store then navigate back to inventory
  const handleDelete = () => {
    if (
      confirm(
        `Are you sure you want to delete ${medicine.name}? This action cannot be undone.`
      )
    ) {
      deleteMedicine(medicine.id);
      router.push("/inventory");
    }
  };

  return (
    <div className="p-8">

      {/* Back link */}
      <Link
        href="/inventory"
        className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 mb-5"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Inventory
      </Link>

      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          {medicine.name}
        </h1>
        <div className="flex items-center gap-3">
          {getStatusBadge(status)}
          <span className="text-sm text-gray-500">{medicine.generic}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">

        {/* Medicine Information */}
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-medium text-gray-900">
                Medicine Information
              </h3>
              <Link
                href={`/inventory/${medicine.id}/edit`}
                className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800"
              >
                <Edit className="w-4 h-4" />
                Edit Details
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
              <div>
                <p className="text-xs text-gray-500 mb-1">Brand Name</p>
                <p className="text-sm text-gray-900">{medicine.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Generic Name</p>
                <p className="text-sm text-gray-900">{medicine.generic}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Strength</p>
                <p className="text-sm text-gray-900">{medicine.strength}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Form</p>
                <p className="text-sm text-gray-900">{medicine.form}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Category</p>
                <p className="text-sm text-gray-900">{medicine.category}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Unit Price</p>
                <p className="text-sm text-gray-900">
                  ${medicine.unit_price.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Minimum Stock Level</p>
                <p className="text-sm text-gray-900">{medicine.min_stock} units</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Quantity</p>
                <p className="text-sm text-gray-900">{medicine.total_qty} units</p>
              </div>
              {medicine.description && (
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 mb-1">Description</p>
                  <p className="text-sm text-gray-900">{medicine.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Quick Stats */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-base font-medium text-gray-900 mb-4">
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Quantity</span>
                <span className="text-gray-900 font-medium">{medicine.total_qty}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Min Stock Level</span>
                <span className="text-gray-900 font-medium">{medicine.min_stock}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Batches</span>
                <span className="text-gray-900 font-medium">{medicine.batches.length}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-base font-medium text-gray-900 mb-4">Actions</h3>
            <div className="space-y-2">

              {/* Edit Medicine → goes to edit page */}
              <Link
                href={`/inventory/${medicine.id}/edit`}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Edit className="w-4 h-4" />
                Edit Medicine
              </Link>

              {/* Add Batch → goes to detail page with batch tab */}
              <Link
                href={`/inventory/${medicine.id}?tab=batch`}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Batch
              </Link>

              {/* Delete — removes from store and redirects */}
              <button
                onClick={handleDelete}
                className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
              >
                Delete Medicine (Admin)
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}