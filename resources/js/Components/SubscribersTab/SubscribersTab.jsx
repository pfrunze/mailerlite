import { useEffect, useState, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import SubscribersTable from './SubscribersTable';
import SubscriberForm from './SubscriberForm';
import FieldSelectionDropdown from './FieldSelectionDropdown';

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
    const [newSubscriber, setNewSubscriber] = useState({
        email: '',
        name: '',
        state: 'active',
        fields: {},
    });
    const [showMoreFields, setShowMoreFields] = useState(false);

    const dropdownRef = useRef(null);

    const columns = ['email', 'name', 'state', 'created_at'];
    const states = ['active', 'unsubscribed', 'junk', 'bounced', 'unconfirmed'];

    useEffect(() => {
        fetchSubscribers();
        fetchFields();
    }, [page, stateFilter, sortBy, sortDirection]);

    const fetchSubscribers = async () => {
        try {
            const params = new URLSearchParams({
                page,
                per_page: perPage,
                ...(stateFilter && { 'filter[state]': stateFilter }),
                ...(sortBy && { sort_by: sortBy, sort_direction: sortDirection }),
            });

            const response = await fetch(`/api/subscribers?${params}`, {
                headers: { Accept: 'application/json' },
            });

            const data = await response.json();
            setSubscribers(data.data);
            setTotal(data.total);
        } catch (error) {
            toast.error('Error fetching subscribers.');
        }
    };

    const fetchFields = async () => {
        try {
            const response = await fetch('/api/fields', {
                headers: { Accept: 'application/json' },
            });
            const data = await response.json();
            setFields(data);
        } catch (error) {
            toast.error('Error fetching fields.');
        }
    };

    const handleFieldValueChange = (fieldId, value) => {
        setNewSubscriber((prev) => ({
            ...prev,
            fields: { ...prev.fields, [fieldId]: value },
        }));
    };

    const handleAddSubscriber = async (e) => {
        e.preventDefault();
        const formattedFields = Object.entries(newSubscriber.fields).map(
            ([fieldId, value]) => ({
                id: parseInt(fieldId, 10),
                value: value,
            })
        );

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
                                    .replace('.value', '')}`.replace(/\d+/g, '')
                            );
                        }
                        return messages.map((message) => message);
                    })
                    .flat();
                const errorMessage =
                    formattedErrors.join(' ') || 'Failed to add subscriber.';
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
            try {
                const response = await fetch(`/api/subscribers/${id}`, {
                    method: 'DELETE',
                    headers: { Accept: 'application/json' },
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    toast.error(errorData.message || 'Failed to delete subscriber.');
                    return;
                }
                await fetchSubscribers();
                toast.success('Subscriber deleted successfully!');
            } catch (error) {
                toast.error('Error deleting subscriber.');
            }
        }
    };

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortBy(column);
            setSortDirection('asc');
        }
    };

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

                <FieldSelectionDropdown
                    fields={fields}
                    selectedFields={selectedFields}
                    setSelectedFields={setSelectedFields}
                    dropdownRef={dropdownRef}
                />
            </div>

            <SubscribersTable
                columns={columns}
                subscribers={subscribers}
                selectedFields={selectedFields}
                fields={fields}
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={handleSort}
                onDeleteSubscriber={handleDeleteSubscriber}
            />

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
                <SubscriberForm
                    newSubscriber={newSubscriber}
                    setNewSubscriber={setNewSubscriber}
                    showMoreFields={showMoreFields}
                    setShowMoreFields={setShowMoreFields}
                    fields={fields}
                    states={states}
                    onFieldValueChange={handleFieldValueChange}
                    onSubmit={handleAddSubscriber}
                    onClose={() => setShowModal(false)}
                />
            )}

            <ToastContainer />
        </div>
    );
}
