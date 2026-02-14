// src/app/admin/staff-pay/page.tsx

export default function StaffPayPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white">Staff Pay</h2>
        <p className="text-gray-400 mt-1">Manage staff salaries and payments</p>
      </div>

      {/* Placeholder Card */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
        <div className="w-16 h-16 bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Staff Pay</h3>
        <p className="text-gray-400 mb-6">
          This feature is coming soon. You will be able to manage staff salaries and process payments here.
        </p>
        <div className="inline-block px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm">
          Under Development
        </div>
      </div>
    </div>
  );
}