"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MessageCircle,
  PhoneCall,
  FileText
} from "lucide-react";

import { getRefillById, getCustomerById } from "../data/mockData";
import type { Refill } from "../data/mockData";

export function RefillDetail() {

  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const refillData = getRefillById(id);
  const [refill, setRefill] = useState<Refill | undefined>(refillData);

  if (!refill) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-gray-900 mb-2">
          Refill Not Found
        </h2>

        <Link
          href="/refills"
          className="text-blue-600 hover:text-blue-700"
        >
          Back to Refills
        </Link>
      </div>
    );
  }

  const customer = getCustomerById(refill.customer_id);

  const getStatusBadge = (status: Refill["status"]) => {

    const badges = {
      new: "bg-blue-100 text-blue-700",
      approved: "bg-green-100 text-green-700",
      ready: "bg-yellow-100 text-yellow-700",
      completed: "bg-gray-100 text-gray-700",
      cancelled: "bg-red-100 text-red-700"
    };

    const labels = {
      new: "New Request",
      approved: "Approved",
      ready: "Ready",
      completed: "Completed",
      cancelled: "Cancelled"
    };

    return (
      <span className={`inline-flex px-3 py-1 rounded-full ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof badges]}
      </span>
    );
  };

  const getChannelIcon = (channel: Refill["channel"]) => {
    if (channel === "whatsapp") return <MessageCircle className="w-5 h-5" />;
    if (channel === "voice") return <PhoneCall className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  const getChannelLabel = (channel: Refill["channel"]) => {

    const labels = {
      whatsapp: "WhatsApp AI",
      voice: "Voice AI",
      manual: "Manual Entry"
    };

    return labels[channel];
  };

  const subtotal = refill.medicines.reduce(
    (sum, m) => sum + m.qty * m.unit_price,
    0
  );

  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleStatusChange = (newStatus: Refill["status"]) => {
    setRefill({ ...refill, status: newStatus });
  };

  const handleCancel = () => {

    if (confirm("Are you sure you want to cancel this refill?")) {
      setRefill({ ...refill, status: "cancelled" });
    }
  };

  const canProgress = () => {

    if (refill.status === "new") return "approve";
    if (refill.status === "approved") return "ready";
    if (refill.status === "ready") return "complete";

    return null;
  };

  const progressAction = canProgress();

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

        <h1 className="text-gray-900 mb-2">
          Refill {refill.id}
        </h1>

        {getStatusBadge(refill.status)}

      </div>


      {/* Layout */}

      <div className="grid grid-cols-3 gap-6">


        {/* LEFT */}

        <div className="col-span-2 space-y-6">

          {/* Customer */}

          <div className="bg-white border border-gray-200 rounded-lg p-6">

            <h3 className="text-gray-900 mb-4">
              Customer Information
            </h3>

            <div className="grid grid-cols-2 gap-6">

              <div>
                <div className="text-sm text-gray-600 mb-1">Name</div>

                <Link
                  href={`/customers/${refill.customer_id}`}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {customer?.name || "Unknown"}
                </Link>

              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">Phone</div>
                <div className="text-gray-900">{customer?.phone || "—"}</div>
              </div>

              <div className="col-span-2">
                <div className="text-sm text-gray-600 mb-1">Address</div>
                <div className="text-gray-900">{customer?.address || "—"}</div>
              </div>

            </div>

          </div>


          {/* Medicines */}

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">

            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-gray-900">Medicines</h3>
            </div>

            <table className="w-full">

              <thead className="bg-gray-50 border-b border-gray-200">

                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-600">Medicine</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600">Strength</th>
                  <th className="px-6 py-3 text-right text-xs text-gray-600">Qty</th>
                  <th className="px-6 py-3 text-right text-xs text-gray-600">Unit Price</th>
                  <th className="px-6 py-3 text-right text-xs text-gray-600">Subtotal</th>
                </tr>

              </thead>

              <tbody className="divide-y divide-gray-200">

                {refill.medicines.map((medicine, index) => (

                  <tr key={index}>

                    <td className="px-6 py-3 text-gray-900">
                      {medicine.medicine_name}
                    </td>

                    <td className="px-6 py-3 text-gray-700">
                      {medicine.strength}
                    </td>

                    <td className="px-6 py-3 text-right text-gray-700">
                      {medicine.qty}
                    </td>

                    <td className="px-6 py-3 text-right text-gray-700">
                      ${medicine.unit_price.toFixed(2)}
                    </td>

                    <td className="px-6 py-3 text-right text-gray-900">
                      ${(medicine.qty * medicine.unit_price).toFixed(2)}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>


        {/* RIGHT SIDEBAR */}

        <div className="space-y-6">

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

          </div>


          {/* Actions */}

          <div className="bg-white border border-gray-200 rounded-lg p-6">

            <h3 className="text-gray-900 mb-4">
              Actions
            </h3>

            {progressAction === "approve" && (
              <button
                onClick={() => handleStatusChange("approved")}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Approve Refill
              </button>
            )}

            {progressAction === "ready" && (
              <button
                onClick={() => handleStatusChange("ready")}
                className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg"
              >
                Mark Ready
              </button>
            )}

            {progressAction === "complete" && (
              <button
                onClick={() => handleStatusChange("completed")}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Mark Completed
              </button>
            )}

            {refill.status !== "completed" &&
              refill.status !== "cancelled" && (

                <button
                  onClick={handleCancel}
                  className="w-full px-4 py-2 mt-2 border border-red-300 text-red-700 rounded-lg"
                >
                  Cancel Refill
                </button>

              )}

          </div>

        </div>

      </div>

    </div>

  );
}