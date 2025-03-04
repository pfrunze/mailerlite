import { useEffect, useState } from 'react';
import FieldsTable from './FieldsTable';
import FieldForm from './FieldForm';

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
            setFields(fields.filter((field) => field.id !== id));
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

    return (
        <div className="p-6">
            <FieldsTable fields={fields} onDelete={handleDelete} />

            {showModal && (
                <FieldForm
                    newField={newField}
                    setNewField={setNewField}
                    onSubmit={handleAddField}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}
