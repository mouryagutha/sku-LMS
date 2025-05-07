import React, { useState, useEffect } from 'react';
import { fetchAllLoans } from '../services/services';

const ActivityLog = () => {
  const [bookLoans, setBookLoans] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalLoans, setTotalLoans] = useState(0);
  const limit = 10;

  useEffect(() => {
    const fetchBookLoans = async () => {
      try {
        const { loans, totalLoans } = await fetchAllLoans(page, limit);
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
        setTotalLoans(totalLoans);
      } catch (error) {
        console.error('Error fetching book loans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookLoans();
  }, [page]);

  const filteredLogs = bookLoans.filter(log =>
    log.action.toLowerCase().includes(searchText.toLowerCase()) ||
    log.details.toLowerCase().includes(searchText.toLowerCase())
  );

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setLoading(true);
  };

  const totalPages = Math.ceil(totalLoans / limit);

  return (
    <div className="w-full py-6 flex flex-col px-6 items-center">
      <h1 className="text-2xl text-start w-full font-bold text-gray-800 mb-4">Activity Log</h1>
      
      <div className="w-full flex mb-4 justify-between">
        <input
          type="text"
          className="px-4 py-2 border border-gray-300 rounded-lg w-1/3"
          placeholder="Search activities"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      
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
            ) : filteredLogs.length > 0 ? (
              filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50 popp">
                  <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">{log?.date}</td>
                  <td className="px-1 py-4 border-b border-gray-200 text-sm text-gray-700">
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
                <td colSpan="4" className="px-4 py-4 text-center text-gray-700">No activities found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between w-full">
        <button
          className="px-4 py-2 bg-gray-200 rounded-lg"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2">{`Page ${page} of ${totalPages}`}</span>
        <button
          className="px-4 py-2 bg-gray-200 rounded-lg"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ActivityLog;
