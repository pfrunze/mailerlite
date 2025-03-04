import { formatToDateTimeString } from '@/utils/dateTimeUtils';

export default function SubscribersTable({
    columns,
    subscribers,
    selectedFields,
    fields,
    sortBy,
    sortDirection,
    onSort,
    onDeleteSubscriber,
}) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead className="bg-gray-100">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column}
                                onClick={() => onSort(column)}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            >
                                {column === 'created_at' ? 'Subscribed' : column}
                                {sortBy === column && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
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
                                <td
                                    key={column}
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                >
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
                                        subscriber.fields.find((f) => f.id === field.id)?.pivot
                                            ?.value || '-';
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
                                    onClick={() => onDeleteSubscriber(subscriber.id)}
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
    );
}
