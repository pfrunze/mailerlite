import { useState } from 'react';
import Layout from '@/Layouts/Layout';

import SubscribersTab from '@/Components/SubscribersTab/SubscribersTab';
import FieldsTab from '@/Components/FieldsTab/FieldsTab';

export default function Welcome() {
    const [activeTab, setActiveTab] = useState('subscribers');
    const [showSubscriberModal, setShowSubscriberModal] = useState(false);
    const [showFieldModal, setShowFieldModal] = useState(false);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleAddClick = () => {
        if (activeTab === 'subscribers') {
            setShowSubscriberModal(true);
        } else if (activeTab === 'fields') {
            setShowFieldModal(true);
        }
    };

    return (
        <Layout>
            <div className="flex justify-between items-center mb-4">
                <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                    <li className="me-2">
                        <button
                            onClick={() => handleTabClick('subscribers')}
                            className={`inline-block p-4 rounded-t-lg ${
                                activeTab === 'subscribers'
                                    ? 'text-blue-600 bg-gray-100 active dark:bg-gray-800 dark:text-blue-500'
                                    : 'hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300'
                            }`}
                            aria-current={activeTab === 'subscribers' ? 'page' : undefined}
                        >
                            Subscribers
                        </button>
                    </li>
                    <li className="me-2">
                        <button
                            onClick={() => handleTabClick('fields')}
                            className={`inline-block p-4 rounded-t-lg ${
                                activeTab === 'fields'
                                    ? 'text-blue-600 bg-gray-100 active dark:bg-gray-800 dark:text-blue-500'
                                    : 'hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300'
                            }`}
                        >
                            Fields
                        </button>
                    </li>
                </ul>
                <button
                    onClick={handleAddClick}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                >
                    {activeTab === 'subscribers' ? 'Add Subscriber' : 'Add Field'}
                </button>
            </div>

            {activeTab === 'subscribers' && (
                <SubscribersTab
                    showModal={showSubscriberModal}
                    setShowModal={setShowSubscriberModal}
                />
            )}
            {activeTab === 'fields' && (
                <FieldsTab
                    showModal={showFieldModal}
                    setShowModal={setShowFieldModal}
                />
            )}
        </Layout>
    );
}
