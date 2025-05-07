import React, { useState } from 'react';

const CodeSelectionModal = ({ book, onClose, onSelectCode }) => {
  const [selectedCode, setSelectedCode] = useState('');

  const handleCodeChange = (code) => {
    setSelectedCode(code);
  };

  const handleConfirm = () => {
    onSelectCode(selectedCode);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30">
      <div className="bg-white p-6 rounded-lg shadow-lg w-5/6 md:w-1/3">
        <h2 className="text-xl font-semibold mb-4">
          Select Copy Code for {book.title}
        </h2>
        <div>
          <ul className="space-y-2 select-none">
            {book.copies.map((copy) => (
              <label
                key={copy.code}
                className={`border p-2 rounded-md flex gap-4 hover:bg-zinc-100 relative ${copy.status === 'borrowed' ? 'bg-gray-200 cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={() => handleCodeChange(copy.code)}
              >
                <input
                  type="radio"
                  name="copyCode"
                  value={copy.code}
                  checked={selectedCode === copy.code}
                  onChange={() => handleCodeChange(copy.code)}
                  className="mr-2"
                  disabled={copy.status === 'borrowed'}
                />
                {copy.code}
                {copy.status === 'available' && (
                  <div>
                    <span className='size-2 bg-green-500 rounded-full absolute right-1 top-1 ring-green-200 ring-2'></span>
                  </div>
                )}
              </label>
            ))}
          </ul>
        </div>
        <div className="mt-4 flex w-full justify-end gap-2">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 w-full bg-zinc-900 text-white rounded-md"
            onClick={handleConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeSelectionModal;
