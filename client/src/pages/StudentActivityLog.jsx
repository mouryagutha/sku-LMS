import React, { useState, useEffect } from 'react';
import { fetchStudentLoans } from '../services/services';

const StudentLoans = () => {
    const [bookLoans, setBookLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const profile = JSON.parse(localStorage.getItem('user')) || {};
    // console.log(profile.student.id);
    const studentId = profile?.student?.id;
    useEffect(() => {
        const fetchLoans = async () => {
            try {
                const loans = await fetchStudentLoans(studentId);
                console.log('API Response:', loans);

                if (!Array.isArray(loans)) {
                    throw new Error('Expected response to be an array');
                }

                // Format the response
                const formattedLogs = loans.map(loan => ({
                    id: loan._id,
                    date: new Date(loan.date).toLocaleDateString(),
                    action: loan.status === 'borrowed' ? 'Borrowed Book' : 'Returned Book',
                    details: (
                        loan.bookDetails && Array.isArray(loan.bookDetails) ?
                            `${loan.bookDetails.map(book => book.title).join(', ')} was ${loan.status === 'borrowed' ? 'borrowed' : 'returned'} by ${loan.studentId.name}.` :
                            `Error: Book details not available for loan ID ${loan._id}`
                    ),
                    issuedBy: loan.issuedBy.name,
                }));

                setBookLoans(formattedLogs);
            } catch (error) {
                console.error('Error fetching student loans:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLoans();
    }, [studentId]);

    return (
        <div className="w-full py-6 flex flex-col px-6 items-center">
            <h1 className="text-2xl text-start w-full font-bold text-gray-800 mb-4">Student Loans</h1>

            <div className="w-full overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                    <thead>
                        <tr className='popp'>
                            <th className="px-3 py-3.5 border-b border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600 tracking-wider">Date</th>
                            <th className="px-4 py-3.5 border-b border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600 tracking-wider">Action</th>
                            <th className="px-4 py-3.5 border-b border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600 tracking-wider">Details</th>
                            <th className="px-4 py-3.5 border-b border-gray-200 bg-gray-100 text-left text-md font-semibold text-gray-600 tracking-wider">Issued By</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="px-4 py-4 text-center text-gray-700">Loading...</td>
                            </tr>
                        ) : bookLoans.length > 0 ? (
                            bookLoans.map(log => (
                                <tr key={log.id} className="hover:bg-gray-50 popp">
                                    <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">{log?.date}</td>
                                    <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">
                                        {log?.action === 'Borrowed Book' ? (
                                            <span className="bg-green-100 px-3 py-1 rounded-xl border border-green-300 text-green-500">{log?.action}</span>
                                        ) : (
                                            <span className="bg-red-100 px-3 py-1 rounded-xl border border-red-300 text-red-500">{log?.action}</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">{log?.details}</td>
                                    <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">{log?.issuedBy}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-4 py-4 text-center text-gray-700">No loans found for this student.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentLoans;
