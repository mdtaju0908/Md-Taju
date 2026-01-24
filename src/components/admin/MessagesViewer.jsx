import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { FaTrash, FaEnvelope } from 'react-icons/fa';

const MessagesViewer = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data } = await api.get('/messages');
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this message?')) {
      try {
        await api.delete(`/messages/${id}`);
        fetchMessages();
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Messages</h2>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No messages yet.</p>
        ) : (
          messages.map(msg => (
            <div key={msg._id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-blue-500">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-4">
                    <FaEnvelope className="text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">{msg.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{msg.email}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(msg.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(msg._id)} 
                  className="text-red-500 hover:text-red-700 p-2"
                  title="Delete Message"
                >
                  <FaTrash />
                </button>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                {msg.message}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MessagesViewer;
