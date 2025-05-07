import React from 'react';

const RecentActivityTable = () => {
  // Sample data
  const activities = [
    {
      id: 1,
      bookTitle: 'Introduction to Algorithms',
      borrower: 'Jane Doe',
      borrowDate: '2024-07-01',
      returnDate: '2024-08-01',
      status: 'Returned'
    },
    {
      id: 2,
      bookTitle: 'Clean Code',
      borrower: 'John Smith',
      borrowDate: '2024-07-05',
      returnDate: '2024-07-20',
      status: 'Overdue'
    },
    {
      id: 3,
      bookTitle: 'Design Patterns',
      borrower: 'Alice Johnson',
      borrowDate: '2024-07-10',
      returnDate: '2024-08-10',
      status: 'Borrowed'
    },
  ];

  return (
    <div className="w-full flex flex-col px-6 py-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Activity</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-4 py-2 text-left text-gray-600">Book Title</th>
              <th className="px-4 py-2 text-left text-gray-600">Borrower</th>
              <th className="px-4 py-2 text-left text-gray-600">Borrow Date</th>
              <th className="px-4 py-2 text-left text-gray-600">Return Date</th>
              <th className="px-4 py-2 text-left text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {activities.map(activity => (
              <tr key={activity.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2 text-gray-800">{activity.bookTitle}</td>
                <td className="px-4 py-2 text-gray-800">{activity.borrower}</td>
                <td className="px-4 py-2 text-gray-800">{activity.borrowDate}</td>
                <td className="px-4 py-2 text-gray-800">{activity.returnDate}</td>
                <td className={`px-4 py-2 text-gray-800 ${activity.status === 'Overdue' ? 'text-red-500' : activity.status === 'Returned' ? 'text-green-500' : 'text-yellow-500'}`}>
                  {activity.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentActivityTable;
