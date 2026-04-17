import Link from "next/link";
import { Users, RefreshCw, ShoppingCart, TrendingUp, AlertCircle } from 'lucide-react';
import { mockCustomers, mockRefills } from './data/mockData';

export default function Dashboard() {
  const totalCustomers = mockCustomers.length;
  const activeCustomers = mockCustomers.filter(c => c.type === 'active' || c.type === 'chronic').length;
  const totalRefills = mockRefills.length;
  const pendingRefills = mockRefills.filter(r => r.status === 'new').length;
  const chronicPatients = mockCustomers.filter(c => c.type === 'chronic').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl text-gray-900 mb-1 sm:mb-2 font-semibold">Pharmacy Management System </h1>
        <p className="text-sm sm:text-base text-gray-600">Welcome to DawaAI</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl text-gray-900 mb-1 font-semibold">{totalCustomers}</div>
          <div className="text-xs sm:text-sm text-gray-600">Total Customers</div>
          <div className="text-xs text-green-600 mt-2">
            {activeCustomers} active
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl text-gray-900 mb-1 font-semibold">{totalRefills}</div>
          <div className="text-xs sm:text-sm text-gray-600">Total Refills</div>
          <div className="text-xs text-yellow-600 mt-2">
            {pendingRefills} pending
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl text-gray-900 mb-1 font-semibold">0</div>
          <div className="text-xs sm:text-sm text-gray-600">Orders Today</div>
          <div className="text-xs text-gray-500 mt-2">
            Coming soon
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl text-gray-900 mb-1 font-semibold">{chronicPatients}</div>
          <div className="text-xs sm:text-sm text-gray-600">Chronic Patients</div>
          <div className="text-xs text-blue-600 mt-2">
            Requires regular monitoring
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl text-gray-900 mb-3 sm:mb-4 font-semibold">Quick Actions</h3>
          <div className="space-y-2 sm:space-y-3">
            <Link
              href="/refills/new"
              className="block px-3 sm:px-4 py-2 sm:py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm sm:text-base font-medium">Create New Refill</div>
                  <div className="text-xs text-blue-600">Process a refill request</div>
                </div>
              </div>
            </Link>
            <Link
              href="/customers"
              className="block px-3 sm:px-4 py-2 sm:py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm sm:text-base font-medium">View All Customers</div>
                  <div className="text-xs text-green-600">Manage customer information</div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl text-gray-900 mb-3 sm:mb-4 font-semibold">Alerts & Notifications</h3>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-yellow-50 rounded-lg">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs sm:text-sm text-gray-900 font-medium">{pendingRefills} Pending Refills</div>
                <div className="text-xs text-gray-600">Requires approval</div>
              </div>
              <Link href="/refills" className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 flex-shrink-0">
                View
              </Link>
            </div>
            <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-blue-50 rounded-lg">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs sm:text-sm text-gray-900 font-medium">{chronicPatients} Chronic Patients</div>
                <div className="text-xs text-gray-600">Regular monitoring needed</div>
              </div>
              <Link href="/customers" className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 flex-shrink-0">
                View
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <h3 className="text-lg sm:text-xl text-gray-900 font-semibold">Recent Refills</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs text-gray-600">Refill ID</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs text-gray-600">Customer</th>
                <th className="hidden sm:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs text-gray-600">Medicine</th>
                <th className="hidden md:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs text-gray-600">Date</th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockRefills.slice(0, 5).map((refill) => {
                const customer = mockCustomers.find(c => c.id === refill.customer_id);
                const statusColors = {
                  new: 'bg-blue-100 text-blue-700',
                  approved: 'bg-green-100 text-green-700',
                  ready: 'bg-yellow-100 text-yellow-700',
                  completed: 'bg-gray-100 text-gray-700',
                  cancelled: 'bg-red-100 text-red-700',
                };
                return (
                  <tr key={refill.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm">
                      <Link href={`/refills/${refill.id}`} className="text-blue-600 hover:text-blue-700">
                        {refill.id}
                      </Link>
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm text-gray-900">{customer?.name || 'Unknown'}</td>
                    <td className="hidden sm:table-cell px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm text-gray-700">
                      {refill.medicines[0].medicine_name}
                      {refill.medicines.length > 1 && <span className="text-gray-500"> +{refill.medicines.length - 1}</span>}
                    </td>
                    <td className="hidden md:table-cell px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm text-gray-700">{refill.request_date}</td>
                    <td className="px-3 sm:px-6 py-2 sm:py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs ${statusColors[refill.status]}`}>
                        {refill.status.charAt(0).toUpperCase() + refill.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 text-center">
          <Link href="/refills" className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 inline-block">
            View All Refills →
          </Link>
        </div>
      </div>
    </div>
  );
}
