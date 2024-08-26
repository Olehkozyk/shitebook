'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import Cookies from 'js-cookie';

interface Message {
    user: string;
    message: string;
    timestamp: string;
}

const ChatPage: React.FC = () => {
    const { id } = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const chatTitle = searchParams.get('title');
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const ws = useRef<WebSocket | null>(null);
    const chatWindowRef = useRef<HTMLDivElement | null>(null);
    const emojiPickerRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const token = Cookies.get('shite_access_token');

        const fetchUserProfile = async () => {
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setCurrentUser(data.data.username);
                } else {
                    router.push('/login');
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                router.push('/login');
            }
        };

        fetchUserProfile();
    }, []);

    useEffect(() => {
        if (currentUser && id) {
            const token = Cookies.get('shite_access_token');

            const checkChatAccess = async () => {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chats/${id}/`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        router.push('/chats');
                        return;
                    }

                    const data = await response.json();

                    if (data.errors && data.errors.detail === "No Chat matches the given query.") {
                        router.push('/chats');
                    }
                } catch (error) {
                    console.error('Error checking chat access:', error);
                    router.push('/chats');
                }
            };

            checkChatAccess();
        }
    }, [currentUser, id]);

    useEffect(() => {
        if (currentUser && id && !ws.current) {
            const token = Cookies.get('shite_access_token');
            const socket = new WebSocket(`${process.env.NEXT_PUBLIC_WS}/chats/${id}/?token=${token}`);
            ws.current = socket;

            socket.onopen = () => console.log('WebSocket connection established');

            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.messages) {
                    setMessages(data.messages.map(msg => ({
                        user: msg.sender__username,
                        message: msg.content,
                        timestamp: msg.timestamp
                    })));
                } else {
                    setMessages((prevMessages) => [...prevMessages, data]);
                }
            };

            socket.onerror = (error) => console.error('WebSocket error:', error);

            socket.onclose = () => {
                console.log('WebSocket connection closed');
                ws.current = null;
            };
        }
    }, [currentUser, id]);

    const sendMessage = () => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN && newMessage.trim()) {
            const message = {
                user: currentUser || 'Anonymous',
                message: newMessage,
            };
            ws.current.send(JSON.stringify(message));
            setNewMessage('');
            setShowEmojiPicker(false);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    };

    const addEmoji = (emoji: any) => {
        setNewMessage(newMessage + emoji.native);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            emojiPickerRef.current &&
            !emojiPickerRef.current.contains(event.target as Node)
        ) {
            setShowEmojiPicker(false);
        }
    };

    useEffect(() => {
        if (showEmojiPicker) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showEmojiPicker]);

    if (!currentUser) {
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
                <h1 className="text-2xl font-bold mb-4">Name of the toilet: {chatTitle || id}</h1>
                <div className="chat-window overflow-y-auto h-[80vh]" ref={chatWindowRef}>
                    {messages.map((msg, index) => {
                        const isCurrentUser = msg.user === currentUser;
                        const formattedDate = new Date(msg.timestamp).toLocaleString();

                        return (
                            <div
                                key={index}
                                className={`message flex ${isCurrentUser ? 'justify-start' : 'justify-end'}`}>
                                <div
                                    className={`p-2 rounded-lg gap-y-1 flex flex-col mb-4 ${isCurrentUser ? 'bg-teal-700 text-white' : 'bg-teal-50 text-black'}`}>
                                    <span className='text-sm'>{msg.user} :</span>
                                    <span>{msg.message}</span>
                                    <i className='text-xs opacity-60 self-end'>{formattedDate}</i>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="flex items-stretch">
                    <div className='flex-1 relative'>
                        <input
                            className="text-white w-full p-3 rounded-lg bg-gray-800"
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message..."
                        />
                        <button
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="absolute top-1/2 right-4 -translate-y-1/2 transition-all hover:opacity-60"
                        >
                            💩
                        </button>
                    </div>
                    <button onClick={sendMessage} className="ml-2 flex bg-teal-700 p-2 rounded-lg gap-1 items-center transition-all hover:opacity-60">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                             className="feather feather-send h-[15px] w-[15px]">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                        Send
                    </button>
                </div>
                {showEmojiPicker && (
                    <div className="absolute bottom-16" ref={emojiPickerRef}>
                        <Picker data={data} onEmojiSelect={addEmoji}/>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;