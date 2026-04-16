"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, AlertTriangle } from "lucide-react";
import { mockCustomers, mockMedicines } from "../data/mockData";

interface OrderItem {
  medicine_id: string;
  medicine_name: string;
  strength: string;
  form: string;
  qty: number;
  unit_price: number;
  stock: number;
}

export function NewOrderPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [channel, setChannel] = useState<"whatsapp" | "call" | "walk-in">("walk-in");
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");

  // Autofill customer
  const handlePhoneChange = (phone: string) => {
    setFormData({ ...formData, phone });

    const customer = mockCustomers.find((c) => c.phone === phone);

    if (customer) {
      setFormData({
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
      });
    }
  };

  const handleAddItem = () => {
    if (!selectedMedicine || quantity < 1) return;

    const medicine = mockMedicines.find((m) => m.id === selectedMedicine);
    if (!medicine) return;

    const newItem: OrderItem = {
      medicine_id: medicine.id,
      medicine_name: medicine.name,
      strength: medicine.strength,
      form: medicine.form || "Tablet",
      qty: quantity,
      unit_price: medicine.unit_price,
      stock: medicine.total_qty || 0,
    };

    setItems([...items, newItem]);
    setSelectedMedicine("");
    setQuantity(1);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleClearForm = () => {
    if (confirm("Are you sure you want to clear the entire form?")) {
      setFormData({ name: "", phone: "", address: "" });
      setItems([]);
      setChannel("walk-in");
      setDiscount(0);
      setNotes("");
    }
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.qty * item.unit_price,
    0
  );

  const tax = subtotal * 0.08;
  const total = subtotal + tax - discount;

  const hasInsufficientStock = (item: OrderItem) => {
    return item.qty > item.stock;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      alert("Please add at least one item to the order");
      return;
    }

    const hasStockIssue = items.some((item) => hasInsufficientStock(item));

    if (hasStockIssue) {
      alert("Some items have insufficient stock.");
      return;
    }

    alert("Order created successfully!");

    router.push("/orders");
  };

  return (
    <div className="p-8">

      {/* Header */}

      <div className="mb-6">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>

        <h1 className="text-gray-900">New Order</h1>
      </div>

      <form onSubmit={handleSubmit}>

        <div className="grid grid-cols-3 gap-6">

          {/* Left Side */}

          <div className="col-span-2 space-y-6">

            {/* Customer */}

            <div className="bg-white border border-gray-200 rounded-lg p-6">

              <h3 className="text-gray-900 mb-4">Customer Details</h3>

              <div className="grid grid-cols-2 gap-4">

                <input
                  type="tel"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />

                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />

                <input
                  type="text"
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg col-span-2"
                />
              </div>
            </div>

            {/* Add Items */}

            <div className="bg-white border border-gray-200 rounded-lg p-6">

              <h3 className="text-gray-900 mb-4">Add Items</h3>

              <div className="flex gap-3 mb-4">

                <select
                  value={selectedMedicine}
                  onChange={(e) => setSelectedMedicine(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select medicine...</option>

                  {mockMedicines.map((medicine: any) => (
                    <option key={medicine.id} value={medicine.id}>
                      {medicine.name} - {medicine.strength} ({medicine.form})
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  value={quantity}
                  min="1"
                  onChange={(e) =>
                    setQuantity(parseInt(e.target.value) || 1)
                  }
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                />

                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>

              </div>

              {/* Items */}

              {items.length === 0 ? (

                <div className="text-center text-gray-500 py-8 border border-dashed border-gray-300 rounded-lg">
                  No items added
                </div>

              ) : (

                <table className="w-full">

                  <tbody className="divide-y">

                    {items.map((item, index) => {

                      const insufficient = hasInsufficientStock(item);

                      return (
                        <tr key={index} className={insufficient ? "bg-red-50" : ""}>

                          <td className="px-4 py-3">
                            {item.medicine_name}
                            {insufficient && (
                              <AlertTriangle className="inline w-4 h-4 text-red-600 ml-2" />
                            )}
                          </td>

                          <td className="px-4 py-3">{item.qty}</td>

                          <td className="px-4 py-3 text-right">
                            ${item.unit_price}
                          </td>

                          <td className="px-4 py-3 text-right">
                            ${(item.qty * item.unit_price).toFixed(2)}
                          </td>

                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </td>

                        </tr>
                      );
                    })}

                  </tbody>

                </table>

              )}

            </div>

          </div>

          {/* Right Summary */}

          <div className="bg-white border border-gray-200 rounded-lg p-6">

            <h3 className="text-gray-900 mb-4">Order Summary</h3>

            <div className="space-y-3">

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Discount</span>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) =>
                    setDiscount(parseFloat(e.target.value) || 0)
                  }
                  className="w-20 border px-2 rounded"
                />
              </div>

              <div className="border-t pt-3 flex justify-between">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg"
            >
              Save Order
            </button>

          </div>

        </div>

      </form>
    </div>
  );
}