// src/app/admin/analytics/page.tsx

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white">Analytics</h2>
        <p className="text-gray-400 mt-1">View detailed reports and analytics of your restaurant</p>
      </div>

      {/* Placeholder Card */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
        <div className="w-16 h-16 bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Analytics Dashboard</h3>
        <p className="text-gray-400 mb-6">
          This feature is coming soon. You will be able to view detailed analytics, charts, and reports here.
        </p>
        <div className="inline-block px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm">
          Under Development
        </div>
      </div>
    </div>
  );
}