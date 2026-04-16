"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { mockCustomers, mockMedicines } from "../data/mockData";

interface MedicineItem {
  medicine_id: string;
  medicine_name: string;
  strength: string;
  qty: number;
  unit_price: number;
}

export function NewRefillPage() {

  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [medicines, setMedicines] = useState<MedicineItem[]>([]);

  const handlePhoneChange = (phone: string) => {

    setFormData({ ...formData, phone });

    const customer = mockCustomers.find(
      (c) => c.phone === phone
    );

    if (customer) {
      setFormData({
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
      });
    }
  };

  const handleAddMedicine = () => {

    if (!selectedMedicine || quantity < 1) return;

    const medicine = mockMedicines.find(
      (m) => m.id === selectedMedicine
    );

    if (!medicine) return;

    const newItem: MedicineItem = {
      medicine_id: medicine.id,
      medicine_name: medicine.name,
      strength: medicine.strength,
      qty: quantity,
      unit_price: medicine.unit_price,
    };

    setMedicines([...medicines, newItem]);
    setSelectedMedicine("");
    setQuantity(1);
  };

  const handleRemoveMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const subtotal = medicines.reduce(
    (sum, m) => sum + m.qty * m.unit_price,
    0
  );

  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleSubmit = (e: React.FormEvent) => {

    e.preventDefault();

    if (medicines.length === 0) {
      alert("Please add at least one medicine");
      return;
    }

    alert("Refill request created successfully!");

    router.push("/refills");
  };

  return (

    <div className="p-8">

      {/* Header */}

      <div className="mb-6">

        <Link
          href="/refills"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Refills
        </Link>

        <h1 className="text-gray-900">
          New Refill Request
        </h1>

      </div>

      <form onSubmit={handleSubmit}>

        <div className="grid grid-cols-3 gap-6">

          {/* Main Section */}

          <div className="col-span-2 space-y-6">

            {/* Customer */}

            <div className="bg-white border border-gray-200 rounded-lg p-6">

              <h3 className="text-gray-900 mb-4">
                Customer Information
              </h3>

              <div className="grid grid-cols-2 gap-4">

                <input
                  type="tel"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) =>
                    handlePhoneChange(e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />

                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />

                <input
                  type="text"
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: e.target.value,
                    })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg col-span-2"
                />

              </div>

            </div>

            {/* Medicines */}

            <div className="bg-white border border-gray-200 rounded-lg p-6">

              <h3 className="text-gray-900 mb-4">
                Add Medicines
              </h3>

              <div className="flex gap-3 mb-4">

                <select
                  value={selectedMedicine}
                  onChange={(e) =>
                    setSelectedMedicine(e.target.value)
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                >

                  <option value="">
                    Select medicine...
                  </option>

                  {mockMedicines.map((medicine) => (

                    <option
                      key={medicine.id}
                      value={medicine.id}
                    >
                      {medicine.name} - {medicine.strength}
                    </option>

                  ))}

                </select>

                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      parseInt(e.target.value) || 1
                    )
                  }
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                />

                <button
                  type="button"
                  onClick={handleAddMedicine}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>

              </div>

              {medicines.length === 0 ? (

                <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                  No medicines added yet
                </div>

              ) : (

                <table className="w-full">

                  <tbody className="divide-y">

                    {medicines.map((medicine, index) => (

                      <tr key={index}>

                        <td className="px-4 py-3">
                          {medicine.medicine_name}
                        </td>

                        <td className="px-4 py-3">
                          {medicine.strength}
                        </td>

                        <td className="px-4 py-3 text-right">
                          {medicine.qty}
                        </td>

                        <td className="px-4 py-3 text-right">
                          ${medicine.unit_price}
                        </td>

                        <td className="px-4 py-3 text-right">
                          ${(medicine.qty * medicine.unit_price).toFixed(2)}
                        </td>

                        <td className="px-4 py-3 text-center">

                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveMedicine(index)
                            }
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              )}

            </div>

          </div>

          {/* Summary */}

          <div className="bg-white border border-gray-200 rounded-lg p-6">

            <h3 className="text-gray-900 mb-4">
              Summary
            </h3>

            <div className="space-y-3">

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
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
              Create Refill Request
            </button>

          </div>

        </div>

      </form>

    </div>
  );
}