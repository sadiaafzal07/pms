"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Phone, MapPin, Calendar, Activity, MessageCircle, PhoneCall, Eye } from 'lucide-react';
import { getCustomerById, getCustomerOrders, getCustomerRefills } from '../data/mockData';

export function CustomerProfile() {
  const { id } = useParams<{ id: string }>();
  const customer = getCustomerById(id!);
  const orders = getCustomerOrders(id!);
  const refills = getCustomerRefills(id!);

  if (!customer) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h2 className="text-gray-900 mb-2">Customer Not Found</h2>
          <Link href="/customers" className="text-blue-600 hover:text-blue-700">
            Back to Customers
          </Link>
        </div>
      </div>
    );
  }

  const getBadge = (type: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      chronic: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Chronic Patient' },
      new: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'New Customer' },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Inactive' },
      active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Active' },
    };
    const badge = badges[type];
    return (
      <span className={`inline-flex px-3 py-1 rounded-full text-sm ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      new: 'bg-blue-100 text-blue-700',
      approved: 'bg-green-100 text-green-700',
      ready: 'bg-yellow-100 text-yellow-700',
    };
    return (
      <span className={`inline-flex px-2 py-0.5 rounded text-xs ${badges[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getChannelIcon = (channel: string) => {
    if (channel === 'whatsapp') return <MessageCircle className="w-4 h-4" />;
    if (channel === 'voice') return <PhoneCall className="w-4 h-4" />;
    return <span className="w-4 h-4" />;
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/customers"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Customers
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-gray-900 mb-2">{customer.name}</h1>
            <div className="flex items-center gap-3">
              {getBadge(customer.type)}
            </div>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <div className="text-sm text-gray-600 mb-1">Phone</div>
              <div className="text-gray-900">{customer.phone}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <div className="text-sm text-gray-600 mb-1">Address</div>
              <div className="text-gray-900">{customer.address}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <div className="text-sm text-gray-600 mb-1">Customer Since</div>
              <div className="text-gray-900">{customer.customer_since}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Activity className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <div className="text-sm text-gray-600 mb-1">Last Activity</div>
              <div className="text-gray-900">{customer.last_order_date || 'No activity'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Total Orders</div>
          <div className="text-2xl text-gray-900">{customer.total_orders}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Total Refills</div>
          <div className="text-2xl text-gray-900">{refills.length}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Lifetime Value</div>
          <div className="text-2xl text-gray-900">
            ${orders.reduce((sum, o) => sum + o.amount, 0).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Order History */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-gray-900">Order History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Order ID</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Date</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Amount</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Channel</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No orders yet
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-gray-900">{order.id}</td>
                    <td className="px-6 py-3 text-gray-700">{order.date}</td>
                    <td className="px-6 py-3 text-gray-700">${order.amount.toFixed(2)}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2 text-gray-700">
                        {getChannelIcon(order.channel)}
                        <span className="capitalize">{order.channel}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3">{getStatusBadge(order.status)}</td>
                    <td className="px-6 py-3">
                      <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refill History */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-gray-900">Refill History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Refill ID</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Medicine(s)</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Date</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {refills.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No refills yet
                  </td>
                </tr>
              ) : (
                refills.map((refill) => (
                  <tr key={refill.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-gray-900">{refill.id}</td>
                    <td className="px-6 py-3 text-gray-700">
                      {refill.medicines[0].medicine_name}
                      {refill.medicines.length > 1 && (
                        <span className="text-gray-500"> +{refill.medicines.length - 1} more</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-gray-700">{refill.request_date}</td>
                    <td className="px-6 py-3">{getStatusBadge(refill.status)}</td>
                    <td className="px-6 py-3">
                      <Link
                        href ={`/refills/${refill.id}`}
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes Section */}
      {customer.notes && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-3">Notes</h3>
          <p className="text-gray-700">{customer.notes}</p>
        </div>
      )}
    </div>
  );
}
