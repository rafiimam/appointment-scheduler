// src/components/users/UserSearch.tsx

import React, { useEffect, useState } from 'react';
import { User } from '../../types'; // Adjust the import path as necessary

interface UserSearchProps {
  onUserSelect: (user: User | null) => void;
  selectedUser: User | null;
}

const UserSearch: React.FC<UserSearchProps> = ({ onUserSelect, selectedUser }) => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!query) {
        setUsers([]);
        return;
      }

      setIsLoading(true);

      try {
        // Replace with your actual API or data fetching logic
        const response = await fetch(`/api/users?search=${query}`);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [query]);

  const handleSelect = (user: User) => {
    onUserSelect(user);
    setQuery(''); // Clear the search input after selection
    setUsers([]); // Clear the user list after selection
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a user..."
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
      />
      {isLoading && <div className="absolute left-3 top-10 text-gray-500">Loading...</div>}
      {users.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {users.map((user) => (
            <li
              key={user.id}
              onClick={() => handleSelect(user)}
              className={`cursor-pointer px-3 py-2 hover:bg-blue-100 ${selectedUser?.id === user.id ? 'bg-blue-50' : ''}`}
            >
              {user.username} ({user.email})
            </li>
          ))}
        </ul>
      )}
      {users.length === 0 && query && !isLoading && (
        <div className="absolute left-3 top-10 text-gray-500">No users found.</div>
      )}
    </div>
  );
};

export default UserSearch;
