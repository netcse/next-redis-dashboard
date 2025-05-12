'use client';

import { useState, useEffect } from 'react';

type User = {
    name: string;
    sex: string;
    dob: string;
    email: string;
    mobile: string;
    address: string;
};

const Home = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(false);
    const usersPerPage = 10;

    const fetchUsers = async (page: number) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/user?page=${page}&limit=${usersPerPage}`);
            const { users, totalUsers } = await response.json();
            setUsers(users);

            // For now, assume we return a fixed total count in the response
            setTotalUsers(totalUsers);  // You can get this from Redis or calculate it in API
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // IIFE (Immediately Invoked Function Expression)
        (async () => {
            try {
                await fetchUsers(currentPage);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        })();
    }, [currentPage]);


    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(totalUsers / usersPerPage);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-semibold text-center mb-6">Paginated Users</h1>

            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : !users || users.length === 0 ? (
                <p className="text-center text-gray-500">No users found.</p>
            ) : (
                <div>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {users.map((user, index) => (
                            <li
                                key={index}
                                className={`p-6 rounded-xl shadow-md transition-transform duration-200 hover:scale-[1.02] ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                                    }`}
                            >
                                <h2 className="text-xl font-semibold text-blue-700 mb-2">{user.name}</h2>
                                <div className="text-sm text-gray-700 space-y-1">
                                    <p><span className="font-medium text-gray-800">Sex:</span> {user.sex}</p>
                                    <p><span className="font-medium text-gray-800">Date of Birth:</span> {user.dob}</p>
                                    <p><span className="font-medium text-gray-800">Email:</span> {user.email}</p>
                                    <p><span className="font-medium text-gray-800">Mobile:</span> {user.mobile}</p>
                                    <p><span className="font-medium text-gray-800">Address:</span> {user.address}</p>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="flex justify-center mt-6">
                        <button
                            className={`px-4 py-2 mx-2 rounded-lg ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span className="flex items-center justify-center text-lg font-medium">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            className={`px-4 py-2 mx-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
