export default function FieldForm({ newField, setNewField, onSubmit, onClose }) {
    const types = ['date', 'number', 'string', 'boolean'];

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-medium mb-4">Add New Field</h2>
                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            type="text"
                            value={newField.title}
                            onChange={(e) =>
                                setNewField({ ...newField, title: e.target.value })
                            }
                            className="mt-1 block w-full border rounded-md p-2"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Type
                        </label>
                        <select
                            value={newField.type}
                            onChange={(e) =>
                                setNewField({ ...newField, type: e.target.value })
                            }
                            className="mt-1 block w-full border rounded-md p-2"
                        >
                            {types.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>
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
