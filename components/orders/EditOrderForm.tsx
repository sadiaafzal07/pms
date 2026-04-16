"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import {
  getOrderById,
  getCustomerById,
  type Order,
  type OrderItem,
} from "@/components/data/mockData";

export function EditOrderForm() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const existing = getOrderById(id);

  const [form, setForm] = useState<{
    status: Order["status"];
    channel: Order["channel"];
    payment_status: Order["payment_status"];
    notes: string;
    items: OrderItem[];
  }>({
    status: existing?.status ?? "pending",
    channel: existing?.channel ?? "walk-in",
    payment_status: existing?.payment_status ?? "unpaid",
    notes: existing?.notes ?? "",
    items: existing?.items ? existing.items.map((i) => ({ ...i })) : [],
  });

  const [saved, setSaved] = useState(false);

  if (!existing) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 mb-4">Order not found.</p>
        <Link href="/orders" className="text-blue-600 hover:text-blue-800 text-sm">
          ← Back to Orders
        </Link>
      </div>
    );
  }

  const customer = getCustomerById(existing.customer_id);

  const subtotal = form.items.reduce(
    (sum, item) => sum + item.qty * item.unit_price,
    0
  );
  const tax = parseFloat((subtotal * 0.08).toFixed(2));
  const total = parseFloat((subtotal + tax - existing.discount).toFixed(2));

  const handleItemChange = (
    index: number,
    field: keyof OrderItem,
    value: string | number
  ) => {
    setForm((prev) => {
      const items = [...prev.items];
      items[index] = {
        ...items[index],
        [field]: field === "qty" || field === "unit_price" ? Number(value) : value,
      };
      return { ...prev, items };
    });
  };

  const handleAddItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { medicine_name: "", strength: "", form: "Tablet", qty: 1, unit_price: 0 },
      ],
    }));
  };

  const handleRemoveItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    Object.assign(existing, {
      ...form,
      subtotal,
      tax,
      total,
      updated_at: new Date().toISOString().slice(0, 16).replace("T", " "),
    });
    setSaved(true);
    setTimeout(() => router.push(`/orders/${id}`), 800);
  };

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="p-8">

      {/* Back */}
      <Link
        href={`/orders/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 mb-5"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Order {id}
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Edit Order</h1>
        <p className="text-sm text-gray-500">
          Editing order for{" "}
          <span className="font-medium text-gray-700">
            {customer?.name ?? "Unknown"}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">

        {/* Left — order settings + items */}
        <div className="col-span-2 space-y-6">

          {/* Order Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-base font-medium text-gray-900 mb-5">Order Details</h3>
            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="block text-xs text-gray-500 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, status: e.target.value as Order["status"] }))
                  }
                  className={inputClass}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Confirmed</option>
                  <option value="ready">Ready</option>
                  <option value="out-for-delivery">Preparing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Order Type</label>
                <select
                  value={form.channel}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, channel: e.target.value as Order["channel"] }))
                  }
                  className={inputClass}
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="call">Call</option>
                  <option value="walk-in">Walk-in</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Payment Status</label>
                <select
                  value={form.payment_status}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      payment_status: e.target.value as Order["payment_status"],
                    }))
                  }
                  className={inputClass}
                >
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Notes</label>
                <input
                  value={form.notes}
                  onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                  placeholder="Optional notes..."
                  className={inputClass}
                />
              </div>

            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-base font-medium text-gray-900">Order Items</h3>
              <button
                onClick={handleAddItem}
                className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>

            <div className="p-4 space-y-3">
              {form.items.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-6">
                  No items. Click "Add Item" to add medicines.
                </p>
              )}
              {form.items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-2 items-end p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="col-span-4">
                    <label className="block text-xs text-gray-400 mb-1">Medicine</label>
                    <input
                      value={item.medicine_name}
                      onChange={(e) => handleItemChange(index, "medicine_name", e.target.value)}
                      placeholder="Medicine name"
                      className={inputClass}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs text-gray-400 mb-1">Strength</label>
                    <input
                      value={item.strength}
                      onChange={(e) => handleItemChange(index, "strength", e.target.value)}
                      placeholder="500mg"
                      className={inputClass}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs text-gray-400 mb-1">Form</label>
                    <select
                      value={item.form}
                      onChange={(e) => handleItemChange(index, "form", e.target.value)}
                      className={inputClass}
                    >
                      {["Tablet", "Capsule", "Syrup", "Injection", "Cream", "Drops"].map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-1">
                    <label className="block text-xs text-gray-400 mb-1">Qty</label>
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) => handleItemChange(index, "qty", e.target.value)}
                      min={1}
                      className={inputClass}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs text-gray-400 mb-1">Price ($)</label>
                    <input
                      type="number"
                      value={item.unit_price}
                      onChange={(e) => handleItemChange(index, "unit_price", e.target.value)}
                      min={0}
                      step={0.01}
                      className={inputClass}
                    />
                  </div>

                  <div className="col-span-1 flex justify-center">
                    <button
                      onClick={() => handleRemoveItem(index)}
                      title="Remove item"
                      className="text-gray-400 hover:text-red-600 transition-colors mb-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right — customer + summary + actions */}
        <div className="space-y-6">

          {/* Customer (read-only) */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-base font-medium text-gray-900 mb-4">Customer</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Name</span>
                <Link
                  href={`/customers/${existing.customer_id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {customer?.name ?? "—"}
                </Link>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Phone</span>
                <span className="text-gray-900">{customer?.phone ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Address</span>
                <span className="text-gray-900 text-right max-w-[140px]">
                  {customer?.address ?? "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Live order summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-base font-medium text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Items</span>
                <span className="text-gray-900">{form.items.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tax (8%)</span>
                <span className="text-gray-900">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Discount</span>
                <span className="text-gray-900">-${existing.discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-medium">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Save / Cancel */}
          <div className="space-y-2">
            <button
              onClick={handleSave}
              disabled={saved}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {saved ? "Saved!" : "Save Changes"}
            </button>
            <Link
              href={`/orders/${id}`}
              className="block w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors text-center"
            >
              Cancel
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}