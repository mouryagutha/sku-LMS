import React from 'react'

const TextAreaField = ({ id, label, value, onChange, placeholder }) => (
    <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={id}>
            {label}
        </label>
        <textarea
            className="shadow appearance-none border rounded w-full h-24 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
        ></textarea>
    </div>
);


export default TextAreaField