export default function SubscriberForm({
    newSubscriber,
    setNewSubscriber,
    showMoreFields,
    setShowMoreFields,
    fields,
    states,
    onFieldValueChange,
    onSubmit,
    onClose,
}) {
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-medium mb-4">Add New Subscriber</h2>
                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            value={newSubscriber.email}
                            onChange={(e) =>
                                setNewSubscriber({ ...newSubscriber, email: e.target.value })
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
                                setNewSubscriber({ ...newSubscriber, name: e.target.value })
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
                                setNewSubscriber({ ...newSubscriber, state: e.target.value })
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
                                                        newSubscriber.fields[field.id] === true
                                                    }
                                                    onChange={() =>
                                                        onFieldValueChange(field.id, true)
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
                                                        newSubscriber.fields[field.id] === false
                                                    }
                                                    onChange={() =>
                                                        onFieldValueChange(field.id, false)
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
                                                onFieldValueChange(field.id, e.target.value)
                                            }
                                            className="mt-1 block w-full border rounded-md p-2"
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            value={newSubscriber.fields[field.id] || ''}
                                            onChange={(e) =>
                                                onFieldValueChange(field.id, e.target.value)
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
                            onClick={onClose}
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
    );
}
