'use client';

import {useState, useEffect} from 'react';
import Image from 'next/image';


type User = {
    name: string;
    sex: string;
    dob: string;
    email: string;
    mobile: string;
    address: string;
};

type UserWithId = User & { id: string }; // To track Redis key (users:<id>)

const Home = () => {
    const [users, setUsers] = useState<UserWithId[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserWithId | null>(null);
    const [formData, setFormData] = useState<Partial<User>>({});
    const usersPerPage = 10;

    const fetchUsers = async (page: number) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/users?page=${page}&limit=${usersPerPage}`);

            const {users, totalUsers} = await response.json();

            setUsers(users); // Make sure your API includes Redis key (id) with each user
            setTotalUsers(totalUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        (async () => {
            await fetchUsers(currentPage);
        })();
    }, [currentPage]);

    const handleUserClick = (user: UserWithId) => {
        setSelectedUser(user);
        setFormData(user);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };


    const handleSave = async () => {
        if (!selectedUser) return;

        const requiredFields = ['name', 'sex', 'dob', 'email', 'mobile', 'address'];


        // Validate all required fields
        for (const field of requiredFields) {
            const value = formData[field as keyof typeof formData] ?? '';
            if (value.toString().trim() === '') {
                alert(`Please fill out the "${field}" field.`);
                return;
            }

        }

        // Step 2: Validate mobile number (must be 11 digits)
        if (!/^\d{11}$/.test(formData.mobile ?? '')) {
            alert("Mobile number must be exactly 11 digits.");
            return;
        }

        // Step 3: Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email ?? '')) {
            alert("Please enter a valid email address.");
            return;
        }

        try {
            const response = await fetch(`/api/users/${selectedUser.id}`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                setSelectedUser(null);
                await fetchUsers(currentPage);
            } else {
                console.error('Failed to update users');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handlePageChange = (page: number) => setCurrentPage(page);
    const totalPages = Math.ceil(totalUsers / usersPerPage);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-semibold text-center mb-6">1M Users Grid</h1>

            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : !users || users.length === 0 ? (
                <p className="text-center text-gray-500">No users found.</p>
            ) : (
                <div>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {users.map((user) => {
                            const avatarUrl = `https://i.pravatar.cc/150?u=${user.id}`; // unique avatar
                            return (
                                <li
                                    key={user.id}
                                    onClick={() => handleUserClick(user)}
                                    className="cursor-pointer flex items-center p-4 rounded-xl shadow-md bg-white hover:shadow-lg transition"
                                >
                                    <Image
                                        src={avatarUrl}
                                        alt={user.name}
                                        width={64} // equivalent to w-16 (16 * 4 = 64px)
                                        height={64} // equivalent to h-16
                                        className="rounded-full object-cover mr-4 border border-gray-300"
                                    />

                                    <div className="text-sm text-gray-700 space-y-1">
                                        <h2 className="text-lg font-semibold text-blue-700">{user.name}</h2>
                                        <p><span className="font-medium text-gray-800">Sex:</span> {user.sex}</p>
                                        <p><span className="font-medium text-gray-800">DOB:</span> {user.dob}</p>
                                        <p><span className="font-medium text-gray-800">Email:</span> {user.email}</p>
                                        <p><span className="font-medium text-gray-800">Mobile:</span> {user.mobile}</p>
                                        <p><span className="font-medium text-gray-800">Address:</span> {user.address}
                                        </p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>


                    {/* Simple popup modal */}
                    {selectedUser && (
                        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
                             onClick={() => setSelectedUser(null)} // closes on the backdrop click
                        >
                            <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg w-[90%] md:w-1/2"
                                 onClick={(e) => e.stopPropagation()} // prevent inner click from closing
                            >
                                <h2 className="text-xl font-bold mb-4">Edit User</h2>
                                <div className="grid gap-4">
                                    {/* Name */}
                                    <input
                                        name="name"
                                        value={formData.name || ''}
                                        onChange={handleInputChange}
                                        placeholder="Name"
                                        className="p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded"
                                        type="text"
                                    />

                                    {/* Sex Dropdown */}
                                    <select
                                        name="sex"
                                        value={formData.sex || ''}
                                        onChange={handleInputChange}
                                        className="p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded"
                                    >
                                        <option value="">Select Sex</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>

                                    {/* Date of Birth */}
                                    <input
                                        name="dob"
                                        value={formData.dob || ''}
                                        onChange={handleInputChange}
                                        placeholder="Date of Birth"
                                        className="p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded"
                                        type="date"
                                    />

                                    {/* Email */}
                                    <input
                                        name="email"
                                        value={formData.email || ''}
                                        onChange={handleInputChange}
                                        placeholder="Email"
                                        className="p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded"
                                        type="email"
                                        required
                                    />

                                    {/* Mobile (Bangladesh format) */}
                                    <input
                                        name="mobile"
                                        value={formData.mobile || ''}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d{0,11}$/.test(value)) {
                                                setFormData({...formData, mobile: value});
                                            }
                                        }}
                                        placeholder="Mobile (e.g. 017xxxxxxxx)"
                                        className="p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded"
                                        type="tel"
                                    />

                                    {/* Address */}
                                    <input
                                        name="address"
                                        value={formData.address || ''}
                                        onChange={handleInputChange}
                                        placeholder="Address"
                                        className="p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded"
                                        type="text"
                                    />
                                </div>

                                <div className="flex justify-end mt-4 gap-2">
                                    <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                                            onClick={() => setSelectedUser(null)}
                                    >Cancel
                                    </button>
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                                            onClick={handleSave}
                                    >Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-center mt-6">
                        <button
                            className={`px-4 py-2 mx-2 rounded-lg ${currentPage === 1 ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span className="flex items-center justify-center text-lg font-medium">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            className={`px-4 py-2 mx-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
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
