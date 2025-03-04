import { useEffect, useState, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SubscribersTab({ showModal, setShowModal }) {
    const [subscribers, setSubscribers] = useState([]);
    const [page, setPage] = useState(1);
    const [perPage] = useState(5);
    const [total, setTotal] = useState(0);
    const [stateFilter, setStateFilter] = useState('');

    const [sortBy, setSortBy] = useState('created_at');
    const [sortDirection, setSortDirection] = useState('desc');

    const [fields, setFields] = useState([]);
    const [selectedFields, setSelectedFields] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [newSubscriber, setNewSubscriber] = useState({ email: '', name: '', state: 'active', fields: {} });
    const [showMoreFields, setShowMoreFields] = useState(false);
    const dropdownRef = useRef(null);

    const columns = ['email', 'name', 'state', 'created_at'];

    const fetchSubscribers = async () => {
        const params = new URLSearchParams({
            page,
            per_page: perPage,
            ...(stateFilter && { 'filter[state]': stateFilter }),
            ...(sortBy && { sort_by: sortBy, sort_direction: sortDirection }),
        });

        const response = await fetch(`/api/subscribers?${params}`, {
            headers: { 'Accept': 'application/json' },
        });
        const data = await response.json();
        setSubscribers(data.data);
        setTotal(data.total);
    };

    const fetchFields = async () => {
        const response = await fetch('/api/fields', {
            headers: { 'Accept': 'application/json' },
        });
        const data = await response.json();
        setFields(data);
    };

    const handleAddSubscriber = async (e) => {
        e.preventDefault();
        const formattedFields = Object.entries(newSubscriber.fields).map(([fieldId, value]) => ({
            id: parseInt(fieldId, 10),
            value: value,
        }));

        const payload = {
            ...newSubscriber,
            fields: formattedFields,
        };

        try {
            const response = await fetch('/api/subscribers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                const formattedErrors = Object.entries(errorData.errors)
                    .map(([key, messages]) => {
                        if (key.startsWith('fields.')) {
                            const index = key.split('.')[1];
                            const fieldId = payload.fields[index]?.id;
                            const field = fields.find((f) => f.id === fieldId);
                            const fieldName = field ? field.title : 'Field';
                            return messages.map((message) =>
                                `${fieldName} ${message
                                    .replace('The fields.', '')
                                    .replace('.value', '')
                                }`.replace(/\d+/g, '')
                            );
                        }
                        return messages.map((message) => message);
                    })
                    .flat();
                const errorMessage = formattedErrors.join(' ') || 'Failed to add subscriber.';
                toast.error(errorMessage);
                return;
            }

            setNewSubscriber({ email: '', name: '', state: 'active', fields: {} });
            setShowMoreFields(false);
            setShowModal(false);
            await fetchSubscribers();
            toast.success('Subscriber added successfully!');
        } catch (error) {
            toast.error('An unexpected error occurred.');
            console.error('Error:', error);
        }
    };

    const handleDeleteSubscriber = async (id) => {
        if (confirm('Are you sure you want to delete this subscriber?')) {
            const response = await fetch(`/api/subscribers/${id}`, {
                method: 'DELETE',
                headers: { 'Accept': 'application/json' },
            });
            if (!response.ok) {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to delete subscriber.');
                return;
            }
            await fetchSubscribers();
            toast.success('Subscriber deleted successfully!');
        }
    };

    useEffect(() => {
        fetchSubscribers();
        fetchFields();
    }, [page, stateFilter, sortBy, sortDirection]);

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortBy(column);
            setSortDirection('asc');
        }
    };

    const handleFieldToggle = (fieldId) => {
        setSelectedFields((prev) =>
            prev.includes(fieldId)
                ? prev.filter((id) => id !== fieldId)
                : [...prev, fieldId]
        );
    };

    const handleFieldValueChange = (fieldId, value) => {
        setNewSubscriber((prev) => ({
            ...prev,
            fields: { ...prev.fields, [fieldId]: value },
        }));
    };

    const states = ['active', 'unsubscribed', 'junk', 'bounced', 'unconfirmed'];

    return (
        <div className="p-6">
            <div className="mb-4 flex justify-between">
                <select
                    value={stateFilter}
                    onChange={(e) => setStateFilter(e.target.value)}
                    className="p-2 border rounded-md inline-flex items-center px-4 py-3 text-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">All States</option>
                    {states.map((state) => (
                        <option key={state} value={state}>
                            {state}
                        </option>
                    ))}
                </select>

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
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                    <thead className="bg-gray-100">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column}
                                    onClick={() => handleSort(column)}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                >
                                    {column === 'created_at' ? 'Subscribed' : column}
                                    {sortBy === column &&
                                        (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                                </th>
                            ))}

                            {fields
                                .filter((field) => selectedFields.includes(field.id))
                                .map((field) => (
                                    <th
                                        key={field.id}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {field.title}
                                    </th>
                                ))}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {subscribers.map((subscriber) => (
                            <tr key={subscriber.id} className="hover:bg-gray-50">
                                {columns.map((column) => (
                                    <td key={column} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {column === 'created_at' ? (
                                        formatToDateTimeString(subscriber.created_at) ?? '-'
                                        ) : column === 'state' ? (
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            subscriber.state === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : subscriber.state === 'unsubscribed'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}
                                        >
                                            {subscriber.state}
                                        </span>
                                        ) : (
                                        subscriber[column] ?? '-'
                                        )}
                                    </td>
                                    ))}

                                {fields
                                    .filter((field) => selectedFields.includes(field.id))
                                    .map((field) => {
                                        const fieldValue =
                                            subscriber.fields.find(
                                                (f) => f.id === field.id
                                            )?.pivot.value || '-';
                                        return (
                                            <td
                                                key={field.id}
                                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                            >
                                                {fieldValue}
                                            </td>
                                        );
                                    })}

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <button
                                        onClick={() =>
                                            handleDeleteSubscriber(subscriber.id)
                                        }
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-between">
                <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span>
                    Page {page} of {Math.ceil(total / perPage)}
                </span>
                <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= Math.ceil(total / perPage)}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-medium mb-4">
                            Add New Subscriber
                        </h2>
                        <form onSubmit={handleAddSubscriber}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={newSubscriber.email}
                                    onChange={(e) =>
                                        setNewSubscriber({
                                            ...newSubscriber,
                                            email: e.target.value,
                                        })
                                    }
                                    className="mt-1 block w-full border rounded-md p-2"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={newSubscriber.name}
                                    onChange={(e) =>
                                        setNewSubscriber({
                                            ...newSubscriber,
                                            name: e.target.value,
                                        })
                                    }
                                    className="mt-1 block w-full border rounded-md p-2"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    State
                                </label>
                                <select
                                    value={newSubscriber.state}
                                    onChange={(e) =>
                                        setNewSubscriber({
                                            ...newSubscriber,
                                            state: e.target.value,
                                        })
                                    }
                                    className="mt-1 block w-full border rounded-md p-2"
                                >
                                    {states.map((state) => (
                                        <option key={state} value={state}>
                                            {state}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowMoreFields(!showMoreFields)}
                                className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                {showMoreFields ? 'Hide Fields' : 'Show More Fields'}
                            </button>

                            {showMoreFields && (
                                <div className="mb-4 max-h-48 overflow-y-auto">
                                    {fields.map((field) => (
                                        <div key={field.id} className="mb-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                {field.title}
                                            </label>
                                            {field.type === 'boolean' ? (
                                                <div className="flex items-center space-x-4 mt-1">
                                                    <div className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            id={`${field.id}_yes`}
                                                            name={`field_${field.id}`}
                                                            value="true"
                                                            checked={
                                                                newSubscriber.fields[field.id] ===
                                                                true
                                                            }
                                                            onChange={() =>
                                                                handleFieldValueChange(
                                                                    field.id,
                                                                    true
                                                                )
                                                            }
                                                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                        />
                                                        <label
                                                            htmlFor={`${field.id}_yes`}
                                                            className="ml-2 text-sm text-gray-700"
                                                        >
                                                            Yes
                                                        </label>
                                                    </div>

                                                    <div className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            id={`${field.id}_no`}
                                                            name={`field_${field.id}`}
                                                            value="false"
                                                            checked={
                                                                newSubscriber.fields[field.id] ===
                                                                false
                                                            }
                                                            onChange={() =>
                                                                handleFieldValueChange(
                                                                    field.id,
                                                                    false
                                                                )
                                                            }
                                                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                        />
                                                        <label
                                                            htmlFor={`${field.id}_no`}
                                                            className="ml-2 text-sm text-gray-700"
                                                        >
                                                            No
                                                        </label>
                                                    </div>
                                                </div>
                                            ) : field.type === 'date' ? (
                                                <input
                                                    type="date"
                                                    value={newSubscriber.fields[field.id] || ''}
                                                    onChange={(e) =>
                                                        handleFieldValueChange(
                                                            field.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="mt-1 block w-full border rounded-md p-2"
                                                />
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={newSubscriber.fields[field.id] || ''}
                                                    onChange={(e) =>
                                                        handleFieldValueChange(
                                                            field.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="mt-1 block w-full border rounded-md p-2"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-200 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
}
