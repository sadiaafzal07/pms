"use client";

import { useState } from 'react';
import { Save, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const [hasChanges, setHasChanges] = useState(false);

  // Pharmacy Information State
  const [pharmacyInfo, setPharmacyInfo] = useState({
    name: 'HealthCare Pharmacy',
    phone: '+92 300 1234567',
    whatsapp: '+92 300 1234567',
    address: '123 Medical Plaza, F-7 Markaz, Islamabad',
  });

  // Order & Refill Settings State
  const [orderSettings, setOrderSettings] = useState({
    enableOrderProcessing: true,
    enableRefillRequests: true,
    defaultOrderStatus: 'pending',
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    notifyNewOrders: true,
    notifyRefillRequests: true,
    notifyLowStock: true,
  });

  // Language & System Preferences State
  const [systemPreferences, setSystemPreferences] = useState({
    defaultLanguage: 'english',
    dateFormat: 'DD/MM/YYYY',
  });

  // Mock users data
  const [users, setUsers] = useState([
    { id: '1', name: 'Ahmed Khan', role: 'Admin', status: 'Active' },
    { id: '2', name: 'Sara Ali', role: 'Staff', status: 'Active' },
    { id: '3', name: 'Bilal Ahmed', role: 'Staff', status: 'Active' },
    { id: '4', name: 'Fatima Hassan', role: 'Staff', status: 'Inactive' },
  ]);

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState('staff');

  const handleSaveChanges = () => {
    // In a real app, this would save to the backend
    toast.success('Settings saved successfully!');
    setHasChanges(false);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
        : user
    ));
    setHasChanges(true);
  };

  const deleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
      setHasChanges(true);
      toast.success('User deleted successfully');
    }
  };

  return (
    <div className="p-8 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage pharmacy configuration and user preferences</p>
      </div>

      {/* 1. Pharmacy Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-gray-900 mb-4">Pharmacy Information</h2>
        <p className="text-sm text-gray-600 mb-4">
          Basic pharmacy details shown in invoices and AI responses
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Pharmacy Name</label>
            <input
              type="text"
              value={pharmacyInfo.name}
              onChange={(e) => {
                setPharmacyInfo({ ...pharmacyInfo, name: e.target.value });
                setHasChanges(true);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={pharmacyInfo.phone}
              onChange={(e) => {
                setPharmacyInfo({ ...pharmacyInfo, phone: e.target.value });
                setHasChanges(true);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">WhatsApp Number</label>
            <input
              type="tel"
              value={pharmacyInfo.whatsapp}
              onChange={(e) => {
                setPharmacyInfo({ ...pharmacyInfo, whatsapp: e.target.value });
                setHasChanges(true);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Address</label>
            <input
              type="text"
              value={pharmacyInfo.address}
              onChange={(e) => {
                setPharmacyInfo({ ...pharmacyInfo, address: e.target.value });
                setHasChanges(true);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 2. Order & Refill Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-gray-900 mb-4">Order & Refill Settings</h2>
        <p className="text-sm text-gray-600 mb-4">
          Control basic order and refill workflow behavior
        </p>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <div className="text-gray-900">Enable Order Processing</div>
              <div className="text-sm text-gray-600">Allow new orders to be created and processed</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={orderSettings.enableOrderProcessing}
                onChange={(e) => {
                  setOrderSettings({ ...orderSettings, enableOrderProcessing: e.target.checked });
                  setHasChanges(true);
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <div className="text-gray-900">Enable Refill Requests</div>
              <div className="text-sm text-gray-600">Allow customers to submit refill requests</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={orderSettings.enableRefillRequests}
                onChange={(e) => {
                  setOrderSettings({ ...orderSettings, enableRefillRequests: e.target.checked });
                  setHasChanges(true);
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-2">Default Order Status</label>
            <select
              value={orderSettings.defaultOrderStatus}
              onChange={(e) => {
                setOrderSettings({ ...orderSettings, defaultOrderStatus: e.target.value });
                setHasChanges(true);
              }}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
            </select>
            <p className="text-sm text-gray-600 mt-1">Initial status for new orders</p>
          </div>
        </div>
      </div>

      {/* 3. User Management */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-gray-900">User Management</h2>
            <p className="text-sm text-gray-600 mt-1">Manage staff access and roles</p>
          </div>
          <button 
            onClick={() => setShowAddUserModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-gray-600">Name</th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">Role</th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-xs text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{user.name}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs ${
                      user.role === 'Admin' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs ${
                      user.status === 'Active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => toggleUserStatus(user.id)}
                        className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50" 
                        title={user.status === 'Active' ? 'Deactivate' : 'Activate'}
                      >
                        {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button 
                        onClick={() => deleteUser(user.id)}
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
      </div>

      {/* 4. Notification Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-gray-900 mb-4">Notification Settings</h2>
        <p className="text-sm text-gray-600 mb-4">
          Enable or disable internal staff notifications
        </p>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <div className="text-gray-900">Notify staff for new orders</div>
              <div className="text-sm text-gray-600">Alert staff when a new order is placed</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.notifyNewOrders}
                onChange={(e) => {
                  setNotificationSettings({ ...notificationSettings, notifyNewOrders: e.target.checked });
                  setHasChanges(true);
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <div className="text-gray-900">Notify staff for refill requests</div>
              <div className="text-sm text-gray-600">Alert staff when a refill request is submitted</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.notifyRefillRequests}
                onChange={(e) => {
                  setNotificationSettings({ ...notificationSettings, notifyRefillRequests: e.target.checked });
                  setHasChanges(true);
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <div className="text-gray-900">Notify staff for low stock alerts</div>
              <div className="text-sm text-gray-600">Alert staff when medicines are running low</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.notifyLowStock}
                onChange={(e) => {
                  setNotificationSettings({ ...notificationSettings, notifyLowStock: e.target.checked });
                  setHasChanges(true);
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* 5. Language & System Preferences */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-gray-900 mb-4">Language & System Preferences</h2>
        <p className="text-sm text-gray-600 mb-4">
          Configure system language and display formats
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Default Language</label>
            <select
              value={systemPreferences.defaultLanguage}
              onChange={(e) => {
                setSystemPreferences({ ...systemPreferences, defaultLanguage: e.target.value });
                setHasChanges(true);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="english">English</option>
              <option value="urdu">Urdu</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-2">Date Format</label>
            <select
              value={systemPreferences.dateFormat}
              onChange={(e) => {
                setSystemPreferences({ ...systemPreferences, dateFormat: e.target.value });
                setHasChanges(true);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save Changes Button */}
      {hasChanges && (
        <div className="fixed bottom-4 left-0 right-0 flex justify-center z-50">
          <button
            onClick={handleSaveChanges}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-gray-900 mb-4">Add New User</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter user name"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => {
                    if (!newUserName.trim()) return toast.error('Please enter a name');
                    const newUser = {
                      id: (users.length + 1).toString(),
                      name: newUserName,
                      role: newUserRole === 'admin' ? 'Admin' : 'Staff',
                      status: 'Active',
                    };
                    setUsers([...users, newUser]);
                    setShowAddUserModal(false);
                    setNewUserName('');
                    setNewUserRole('staff');
                    setHasChanges(true);
                    toast.success('User added successfully');
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add User
                </button>
                <button
                  onClick={() => {
                    setShowAddUserModal(false);
                    setNewUserName('');
                    setNewUserRole('staff');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}