// src/app/staff/today-bills/page.tsx

export default function StaffTodayBillsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">Today's Bills</h2>
        <p className="text-gray-400 mt-1">View all bills generated today</p>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
        <div className="w-16 h-16 bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Today's Bills</h3>
        <p className="text-gray-400 mb-6">
          This feature is coming soon. You will be able to view and review all bills generated today here.
        </p>
        <div className="inline-block px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm">
          Under Development
        </div>
      </div>
    </div>
  );
}