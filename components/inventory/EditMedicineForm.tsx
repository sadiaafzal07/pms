"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getMedicineById } from "@/components/data/mockData";

export function EditMedicineForm() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const existing = getMedicineById(id);

  const [form, setForm] = useState({
    name: existing?.name ?? "",
    generic: existing?.generic ?? "",
    strength: existing?.strength ?? "",
    form: existing?.form ?? "",
    category: existing?.category ?? "",
    unit_price: existing?.unit_price ?? 0,
    min_stock: existing?.min_stock ?? 0,
    total_qty: existing?.total_qty ?? 0,
    description: existing?.description ?? "",
  });

  const [saved, setSaved] = useState(false);

  if (!existing) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 text-center">
        <p className="text-gray-500 mb-4">Medicine not found.</p>
        <Link href="/inventory" className="text-blue-600 hover:text-blue-800 text-sm">
          ← Back to Inventory
        </Link>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "unit_price" || name === "min_stock" || name === "total_qty"
          ? Number(value)
          : value,
    }));
  };

  const handleSave = () => {
    Object.assign(existing, form);
    setSaved(true);
    setTimeout(() => router.push(`/inventory/${id}`), 800);
  };

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* Back */}
      <Link
        href={`/inventory/${id}`}
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-blue-600 hover:text-blue-800 mb-3 sm:mb-5"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to {existing.name}
      </Link>

      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 mb-1 sm:mb-2">Edit Medicine</h1>
        <p className="text-xs sm:text-sm text-gray-500">Update details for {existing.name}</p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 space-y-4 sm:space-y-5">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

            <div>
              <label className="block text-xs text-gray-500 mb-1">Brand Name</label>
              <input name="name" value={form.name} onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Generic Name</label>
              <input name="generic" value={form.generic} onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Strength</label>
              <input name="strength" value={form.strength} onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Form</label>
              <select name="form" value={form.form} onChange={handleChange} className={inputClass}>
                {["Tablet", "Capsule", "Syrup", "Injection", "Cream", "Drops"].map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Category</label>
              <input name="category" value={form.category} onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Unit Price ($)</label>
              <input type="number" name="unit_price" value={form.unit_price} onChange={handleChange} min={0} step={0.01} className={inputClass} />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Min Stock Level</label>
              <input type="number" name="min_stock" value={form.min_stock} onChange={handleChange} min={0} className={inputClass} />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Total Quantity</label>
              <input type="number" name="total_qty" value={form.total_qty} onChange={handleChange} min={0} className={inputClass} />
            </div>

          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saved}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {saved ? "Saved!" : "Save Changes"}
            </button>
            <Link
              href={`/inventory/${id}`}
              className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}