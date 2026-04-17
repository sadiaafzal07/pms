"use client";
import { useState, useMemo } from 'react';
import Link from "next/link";
import { Search, Filter, Plus, Download, Upload, ChevronDown, X, Eye, Edit, FileText, RefreshCw, Trash2 } from 'lucide-react';
import { mockCustomers, type Customer } from '../data/mockData';
import { AddCustomerModal } from './AddCustomerModal';
import { EditCustomerModal } from './EditCustomerModal';

export function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [activityRange, setActivityRange] = useState<string>('all');
  const [hasRefills, setHasRefills] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and search logic
  const filteredCustomers = useMemo(() => {
    let result = [...customers];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        c =>
          c.name.toLowerCase().includes(query) ||
          c.phone.toLowerCase().includes(query) ||
          c.address.toLowerCase().includes(query)
      );
    }

    // Type filter
    if (selectedType !== 'all') {
      if (selectedType === 'chronic') {
        result = result.filter(c => c.type === 'chronic');
      } else if (selectedType === 'new') {
        result = result.filter(c => c.type === 'new');
      } else if (selectedType === 'inactive') {
        result = result.filter(c => c.type === 'inactive');
      }
    }

    // Activity range filter
    if (activityRange !== 'all') {
      const today = new Date('2025-12-12');
      result = result.filter(c => {
        if (!c.last_order_date) return false;
        const lastOrder = new Date(c.last_order_date);
        const diffDays = Math.floor((today.getTime() - lastOrder.getTime()) / (1000 * 60 * 60 * 24));
        
        if (activityRange === '7') return diffDays <= 7;
        if (activityRange === '30') return diffDays <= 30;
        if (activityRange === '90') return diffDays <= 90;
        return true;
      });
    }

    // Has refills filter
    if (hasRefills !== 'all') {
      result = result.filter(c => {
        const hasRefill = c.last_refill_date !== null;
        return hasRefills === 'yes' ? hasRefill : !hasRefill;
      });
    }

    return result;
  }, [customers, searchQuery, selectedType, activityRange, hasRefills]);

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const activeFiltersCount = [
    selectedType !== 'all',
    activityRange !== 'all',
    hasRefills !== 'all',
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedType('all');
    setActivityRange('all');
    setHasRefills('all');
  };

  const getStatusBadge = (type: Customer['type']) => {
    const badges = {
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-gray-100 text-gray-700',
      chronic: 'bg-blue-100 text-blue-700',
      new: 'bg-purple-100 text-purple-700',
    };
    const labels = {
      active: 'Active',
      inactive: 'Inactive',
      chronic: 'Chronic',
      new: 'New',
    };
    return (
      <span className={`inline-flex px-2 py-0.5 rounded text-xs ${badges[type]}`}>
        {labels[type]}
      </span>
    );
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowEditModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  const handleAddCustomer = (customer: Omit<Customer, 'id'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: `C${String(customers.length + 1).padStart(3, '0')}`,
    };
    setCustomers([...customers, newCustomer]);
    setShowAddModal(false);
  };

  const handleUpdateCustomer = (updated: Customer) => {
    setCustomers(customers.map(c => c.id === updated.id ? updated : c));
    setShowEditModal(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl text-gray-900 mb-1 sm:mb-2 font-semibold">Customers</h1>
        <p className="text-sm sm:text-base text-gray-600">Manage your pharmacy customers</p>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 cursor-pointer hover:bg-yellow-100 transition-colors">
          <div className="text-yellow-800">
            <div className="text-xl sm:text-2xl font-semibold mb-0.5 sm:mb-1">3</div>
            <div className="text-xs sm:text-sm">Long Time No Activity</div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 cursor-pointer hover:bg-blue-100 transition-colors">
          <div className="text-blue-800">
            <div className="text-xl sm:text-2xl font-semibold mb-0.5 sm:mb-1">3</div>
            <div className="text-xs sm:text-sm">Chronic Patients</div>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 cursor-pointer hover:bg-green-100 transition-colors">
          <div className="text-green-800">
            <div className="text-xl sm:text-2xl font-semibold mb-0.5 sm:mb-1">5</div>
            <div className="text-xs sm:text-sm">Multiple Refills Pending</div>
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, phone, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
              showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Customer Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="chronic">Chronic</option>
                  <option value="new">New (Last 30 days)</option>
                  <option value="inactive">Inactive (&gt;90 days)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Activity Range</label>
                <select
                  value={activityRange}
                  onChange={(e) => setActivityRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Time</option>
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Has Refills</label>
                <select
                  value={hasRefills}
                  onChange={(e) => setHasRefills(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="mt-3 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <div className="text-sm text-gray-600">
          Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} customers
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Import CSV</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Customer</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-gray-600">Name</th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">Phone</th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">Address</th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">Total Orders</th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">Last Order</th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">Last Refill</th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link href ={`/customers/${customer.id}`} className="text-blue-600 hover:text-blue-700">
                      {customer.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{customer.phone}</td>
                  <td className="px-4 py-3 text-gray-700 max-w-xs truncate" title={customer.address}>
                    {customer.address}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{customer.total_orders}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {customer.last_order_date || '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {customer.last_refill_date || '—'}
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(customer.type)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href ={`/customers/${customer.id}`}
                        className="p-1 text-gray-600 hover:text-blue-600"
                        title="View Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleEdit(customer)}
                        className="p-1 text-gray-600 hover:text-blue-600"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 text-gray-600 hover:text-blue-600"
                        title="View Order History"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 text-gray-600 hover:text-blue-600"
                        title="View Refill History"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="p-1 text-gray-600 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Items per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddCustomerModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddCustomer}
        />
      )}
      {showEditModal && editingCustomer && (
        <EditCustomerModal
          customer={editingCustomer}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateCustomer}
        />
      )}
    </div>
  );
}
