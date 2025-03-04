import React, { useEffect, useState } from 'react';

export default function FieldsTab({ showModal, setShowModal }) {
    const [fields, setFields] = useState([]);
    const [newField, setNewField] = useState({ title: '', type: 'string' });

    const fetchFields = async () => {
        const response = await fetch('/api/fields');
        const data = await response.json();
        setFields(data);
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this field?')) {
            await fetch(`/api/fields/${id}`, { method: 'DELETE' });
            setFields(fields.filter(field => field.id !== id));
        }
    };

    const handleAddField = async (e) => {
        e.preventDefault();
        await fetch('/api/fields', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newField),
        });
        setNewField({ title: '', type: 'string' });
        setShowModal(false);
        fetchFields();
    };

    useEffect(() => {
        fetchFields();
    }, []);

    const types = ['date', 'number', 'string', 'boolean'];

    return (
        <div className="p-6">
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {fields.map(field => (
                            <tr key={field.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{field.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{field.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button
                                        onClick={() => handleDelete(field.id)}
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

            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-medium mb-4">Add New Field</h2>
                        <form onSubmit={handleAddField}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    value={newField.title}
                                    onChange={(e) => setNewField({ ...newField, title: e.target.value })}
                                    className="mt-1 block w-full border rounded-md p-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Type</label>
                                <select
                                    value={newField.type}
                                    onChange={(e) => setNewField({ ...newField, type: e.target.value })}
                                    className="mt-1 block w-full border rounded-md p-2"
                                >
                                    {types.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
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
        </div>
    );
}
