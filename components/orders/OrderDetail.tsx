"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Trash2, Plus, Printer } from "lucide-react";
import { getOrderById, getCustomerById, type Order } from "../data/mockData";

export function OrderDetail() {

  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const orderData = getOrderById(id);
  const [order, setOrder] = useState<Order | undefined>(orderData);

  if (!order) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="text-center">
          <h2 className="text-gray-900 mb-2">Order Not Found</h2>

          <Link
            href="/orders"
            className="text-blue-600 hover:text-blue-700"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const customer = getCustomerById(order.customer_id);

  const getStatusBadge = (status: Order["status"]) => {

    const badges = {
      pending: "bg-gray-100 text-gray-700",
      processing: "bg-blue-100 text-blue-700",
      ready: "bg-purple-100 text-purple-700",
      "out-for-delivery": "bg-orange-100 text-orange-700",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };

    const labels = {
      pending: "Pending",
      processing: "Confirmed",
      ready: "Ready",
      "out-for-delivery": "Preparing",
      completed: "Completed",
      cancelled: "Cancelled",
    };

    return (
      <span className={`inline-flex px-3 py-1 rounded-full ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof badges] }
      </span>
    );
  };

  const getChannelBadge = (channel: Order["channel"]) => {

    const badges = {
      whatsapp: "bg-green-100 text-green-700",
      call: "bg-blue-100 text-blue-700",
      "walk-in": "bg-gray-100 text-gray-700",
    };

    const labels = {
      whatsapp: "WhatsApp",
      call: "Call",
      "walk-in": "Walk-in",
    };

    return (
      <span className={`inline-flex px-3 py-1 rounded-full ${badges[channel as keyof typeof badges]}`}>
        {labels[channel as keyof typeof badges]}
      </span>
    );
  };

  const handleStatusChange = (newStatus: Order["status"]) => {
    setOrder({ ...order, status: newStatus });
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel this order?")) {
      setOrder({ ...order, status: "cancelled" });
    }
  };

  const isEditable =
    order.status !== "cancelled" && order.status !== "completed";

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* Header */}

      <div className="mb-4 sm:mb-6">

        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-blue-600 hover:text-blue-700 mb-2 sm:mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

          <div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl text-gray-900 mb-2 sm:mb-3 font-semibold">
              Order {order.id}
            </h1>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {getStatusBadge(order.status)}
              {getChannelBadge(order.channel)}
            </div>

            <div className="mt-2 text-xs sm:text-sm text-gray-600">
              <div>Created: {order.created_at}</div>
              <div>Last Updated: {order.updated_at}</div>
            </div>

          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

        {/* LEFT SIDE */}

        <div className="col-span-1 lg:col-span-2 space-y-4 sm:space-y-6">

          {/* Customer */}

          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">

            <div className="flex items-center justify-between mb-4 sm:mb-5 gap-3">

              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Customer Information
              </h3>

              <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                <Edit className="w-4 h-4" />
                Edit Customer
              </button>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <div className="text-sm text-gray-600 mb-1">
                  Name
                </div>

                <Link
                  href={`/customers/${order.customer_id}`}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {customer?.name || "Unknown Customer"}
                </Link>

              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">
                  Phone
                </div>

                <div className="text-gray-900">
                  {customer?.phone || "—"}
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2">

                <div className="text-sm text-gray-600 mb-1">
                  Address
                </div>

                <div className="text-gray-900">
                  {customer?.address || "—"}
                </div>

              </div>

            </div>

          </div>

          {/* Items Table */}

          <div className="bg-white border border-gray-200 rounded-lg">

            <div className="px-6 py-4 border-b border-gray-200 flex justify-between">

              <h3 className="text-gray-900">
                Order Items
              </h3>

              {isEditable && (
                <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              )}

            </div>

            <div className="overflow-x-auto">
            <table className="w-full">

              <tbody className="divide-y">

                {order.items.map((item:any, index: number) => (

                  <tr key={index}>

                    <td className="px-6 py-3">
                      {item.medicine_name}
                    </td>

                    <td className="px-6 py-3">
                      {item.strength}
                    </td>

                    <td className="px-6 py-3">
                      {item.form}
                    </td>

                    <td className="px-6 py-3 text-right">
                      {item.qty}
                    </td>

                    <td className="px-6 py-3 text-right">
                      ${item.unit_price.toFixed(2)}
                    </td>

                    <td className="px-6 py-3 text-right">
                      ${(item.qty * item.unit_price).toFixed(2)}
                    </td>

                    {isEditable && (

                      <td className="px-6 py-3 text-center">

                        <div className="flex justify-center gap-2">

                          <button className="p-1 text-gray-600 hover:text-blue-600">
                            <Edit className="w-4 h-4" />
                          </button>

                          <button className="p-1 text-gray-600 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>

                      </td>

                    )}

                  </tr>

                ))}

              </tbody>

            </table>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="space-y-6">

          <div className="bg-white border border-gray-200 rounded-lg p-6">

            <h3 className="text-gray-900 mb-4">
              Order Summary
            </h3>

            <div className="space-y-3">

              <div className="flex justify-between">
                <span>Total Items</span>
                <span>{order.items.length}</span>
              </div>

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>

              <div className="border-t pt-3 flex justify-between">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}