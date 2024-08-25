'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';

interface Chat {
    id: number;
    title: string;
    created_at: string;
    participants: number[];
}

async function fetchChats(token: string) {
    const response = await fetch('http://127.0.0.1:8000/api/chats/', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch chats');
    }

    return await response.json();
}

export default function Page() {
    const [chats, setChats] = useState<Chat[]>([]);
    const [currentUser, setCurrentUser] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = Cookies.get('shite_access_token');

        if (!token) {
            console.error('No access token found');
            return;
        }

        const fetchCurrentUser = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setCurrentUser(data.data.id);
                } else {
                    console.error('Failed to fetch user profile');
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchCurrentUser();

        fetchChats(token)
            .then((fetchedChats) => {
                setChats(fetchedChats);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching chats:', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="p-4 sm:ml-64">
                <div className="text-2xl font-bold p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:ml-64">
            <div className="p-4 border-2 border-dashed rounded-lg border-gray-700">
                <h1 className="mb-4">Chat toilets</h1>
                <ul>
                    {chats
                        .filter((chat) => chat.participants.includes(currentUser!))
                        .map((chat) => (
                            <li key={chat.id} className="mb-4 no-underline">
                                <Link href={`/chats/${chat.id}?title=${encodeURIComponent(chat.title)}`} className="flex justify-between items-center no-underline text-xs transition-opacity hover:opacity-60">
                                    <span>{chat.title}</span>
                                    <span className='opacity-60'>Created At: {new Date(chat.created_at).toLocaleString()}</span>
                                </Link>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
}