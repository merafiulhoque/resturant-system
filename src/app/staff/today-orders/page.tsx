// src/app/staff/today-orders/page.tsx

export default function StaffTodayOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">Today's Orders</h2>
        <p className="text-gray-400 mt-1">View all orders created today</p>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
        <div className="w-16 h-16 bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Today's Orders</h3>
        <p className="text-gray-400 mb-6">
          This feature is coming soon. You will be able to view and review all orders created today here.
        </p>
        <div className="inline-block px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm">
          Under Development
        </div>
      </div>
    </div>
  );
}