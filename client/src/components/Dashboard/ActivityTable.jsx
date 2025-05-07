import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react'

const ActivityTable = () => {
    const navigate = useNavigate();
    const [filterText, setFilterText] = useState('');
    const [sortColumn, setSortColumn] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    const activities = [
        {
            bookTitle: 'Introduction to Algorithms',
            studentName: 'John Doe',
            borrowDate: '2023-07-01',
            dueDate: '2023-07-21',
            status: 'Returned',
        },
        {
            bookTitle: 'Clean Code',
            studentName: 'Jane Smith',
            borrowDate: '2023-07-05',
            dueDate: '2023-07-25',
            status: 'Overdue',
        },
        {
            bookTitle: 'Design Patterns',
            studentName: 'Emily Johnson',
            borrowDate: '2023-07-10',
            dueDate: '2023-07-30',
            status: 'Borrowed',
        },
        {
            bookTitle: 'Design Patterns',
            studentName: 'Emily Johnson',
            borrowDate: '2023-07-10',
            dueDate: '2023-07-30',
            status: 'Borrowed',
        },
        {
            bookTitle: 'Design Patterns',
            studentName: 'Emily Johnson',
            borrowDate: '2023-07-10',
            dueDate: '2023-07-30',
            status: 'Borrowed',
        },
        {
            bookTitle: 'Clean Code',
            studentName: 'Jane Smith',
            borrowDate: '2023-07-05',
            dueDate: '2023-07-25',
            status: 'Overdue',
        }, {
            bookTitle: 'Introduction to Algorithms',
            studentName: 'John Doe',
            borrowDate: '2023-07-01',
            dueDate: '2023-07-21',
            status: 'Returned',
        }, {
            bookTitle: 'Clean Code',
            studentName: 'Jane Smith',
            borrowDate: '2023-07-05',
            dueDate: '2023-07-25',
            status: 'Overdue',
        }, {
            bookTitle: 'Introduction to Algorithms',
            studentName: 'John Doe',
            borrowDate: '2023-07-01',
            dueDate: '2023-07-21',
            status: 'Returned',
        }, {
            bookTitle: 'Clean Code',
            studentName: 'Jane Smith',
            borrowDate: '2023-07-05',
            dueDate: '2023-07-25',
            status: 'Overdue',
        },
    ];

    const handleSort = (column) => {
        const order = sortColumn === column && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortOrder(order);
    };

    const filteredActivities = activities.filter(activity =>
        activity.bookTitle.toLowerCase().includes(filterText.toLowerCase()) ||
        activity.studentName.toLowerCase().includes(filterText.toLowerCase())
    );

    const sortedActivities = filteredActivities.sort((a, b) => {
        if (sortColumn) {
            if (sortOrder === 'asc') {
                return a[sortColumn] > b[sortColumn] ? 1 : -1;
            } else {
                return a[sortColumn] < b[sortColumn] ? 1 : -1;
            }
        }
        return 0;
    });

    return (
        <div className="w-full flex flex-col px-6 items-center">
            <h1 className="text-2xl flex items-center gap-2 text-start w-full font-bold text-gray-800 mb-4">
                Recent Activity
                <ArrowUpRight className='size-7' />
            </h1>
            <div className="w-full flex mb-4">
                {/* <input
          type="text"
          className="px-4 py-2 border border-gray-300 rounded-lg"
          placeholder="Filter by book title or student name"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        /> */}
            </div>
            <div className="w-full overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-2xl shadow-md ">
                    <thead className='rounded-t-2xl bg-gray-100'>
                        <tr className='popp'>
                            <th
                                className="px-4 py-3.5 border-b border-gray-200 text-left text-md font-semibold text-gray-600  tracking-wider cursor-pointer"
                                onClick={() => handleSort('bookTitle')}
                            >
                                Book Title
                            </th>
                            <th
                                className="px-4 py-3.5 border-b border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600  tracking-wider cursor-pointer"
                                onClick={() => handleSort('studentName')}
                            >
                                Student Name
                            </th>
                            <th
                                className="px-4 py-3.5 border-b border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600  tracking-wider cursor-pointer"
                                onClick={() => handleSort('borrowDate')}
                            >
                                Borrow Date
                            </th>
                            <th
                                className="px-4 py-3.5 border-b border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600  tracking-wider cursor-pointer"
                                onClick={() => handleSort('dueDate')}
                            >
                                Due Date
                            </th>
                            <th className="px-4 py-3.5 border-b border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600  tracking-wider">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedActivities.map((activity, index) => (
                            <tr key={index} className="hover:bg-gray-50 popp cursor-pointer">
                                <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">{activity.bookTitle}</td>
                                <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">{activity.studentName}</td>
                                <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">{activity.borrowDate}</td>
                                <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">{activity.dueDate}</td>
                                <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">
                                    <span className={`px-3 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${activity.status === 'Returned' ? 'bg-green-200 text-green-800' :
                                        activity.status === 'Overdue' ? 'bg-red-200 text-red-800' :
                                            'bg-yellow-200 text-yellow-800'
                                        }`}>
                                        {activity.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button
                className="mt-4 px-6 popp py-2 bg-zinc-800 text-white rounded-lg"
                onClick={() => navigate('/activity')}
            >
                View More
            </button>
        </div>
    );
};

export default ActivityTable;
