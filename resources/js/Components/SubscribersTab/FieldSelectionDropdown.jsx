import { useState } from 'react';

export default function FieldSelectionDropdown({
    fields,
    selectedFields,
    setSelectedFields,
    dropdownRef,
}) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleFieldToggle = (fieldId) => {
        setSelectedFields((prev) =>
            prev.includes(fieldId)
                ? prev.filter((id) => id !== fieldId)
                : [...prev, fieldId]
        );
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="inline-flex items-center px-4 py-3 text-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
                Select Fields
                <svg
                    className="w-2 h-2 ml-2 text-gray-500"
                    aria-hidden="true"
                    fill="none"
                    viewBox="0 0 10 6"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                    />
                </svg>
            </button>

            {isDropdownOpen && (
                <div className="absolute z-10 mt-2 bg-white rounded-lg shadow-sm w-60">
                    <ul className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700">
                        {fields.map((field) => (
                            <li key={field.id}>
                                <div className="flex items-center p-2 rounded-sm hover:bg-gray-100">
                                    <input
                                        id={`checkbox-field-${field.id}`}
                                        type="checkbox"
                                        checked={selectedFields.includes(field.id)}
                                        onChange={() => handleFieldToggle(field.id)}
                                        className="hover:cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
                                    />
                                    <label
                                        htmlFor={`checkbox-field-${field.id}`}
                                        className="hover:cursor-pointer w-full ml-2 text-sm font-medium text-gray-900"
                                    >
                                        {field.title}
                                    </label>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
