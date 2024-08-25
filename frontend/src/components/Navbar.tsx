"use client";
import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import StoreIcon from '@/public/icons-navbar/store-icon.svg';
import ChatIcon from '@/public/icons-navbar/chat-icon.svg';
import AccountIcon from '@/public/icons-navbar/account-icon.svg';
import PostsIcon from '@/public/icons-navbar/icon-posts.svg';
import LogoutIcon from '@/public/icons-navbar/logout-icon.svg';
import SearchIcon from '@/public/icons-navbar/search-icon.svg';
import FriendsIcon from '@/public/icons-navbar/friends-icon.svg';

const NavBar = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const router = useRouter();
    const path = usePathname();
    const disableNavbar = [
        "/login",
        "/registration",
    ];

    useEffect(() => {
        const token = Cookies.get('shite_access_token');

        const fetchUserProfile = async () => {
            if (!token) return;

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
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile().then(r => r);
    }, []);

    const handleLogout = () => {
        Cookies.remove('shite_access_token');
        Cookies.remove('shite_refresh_token');
        router.push('/login');
    };

    const styles = {
        'li': 'flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group',
        'link': 'flex items-center w-full',
        'icon': 'flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white',
        'title': 'flex-1 ms-3 whitespace-nowrap w-full text-left',
    };

    return (
        <>
            {!disableNavbar.includes(path) && (
                <aside
                    className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
                    aria-label="Sidebar"
                >
                    <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                        <ul className="space-y-2 font-medium">
                            <li className='mb-10'>
                                <span className='flex gap-3 items-center mb-4'>
                                <span
                                    className='flex items-center justify-center bg-teal-50 h-[60px] w-[60px] rounded-full'>
                                    <svg className='h-full w-full' viewBox="-20 15 190 190" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                              d="M35.656 135.492C28.695 127.235 30.609 112.676 41.664 109.749C45.63 123.761 61.838 128.696 76.968 128.696C92.091 128.696 103.92 122.848 106.238 111.654C116.933 114.091 122.695 125.035 114.645 135.393C99.38 155.039 49.508 151.924 35.656 135.492ZM76.769 122.779C63.98 122.779 47.905 116.783 47.905 106.388C47.905 93.332 71.701 92.908 69.594 77.166C79.33 78.813 84.058 83.512 84.058 90.939C84.058 99.058 77.554 102.047 77.554 102.047L80.443 105.987C80.443 105.987 88.094 101.146 90.468 99.834C96.762 100.688 100.332 104.154 100.332 109.654C100.332 117.688 87.387 122.781 76.769 122.779Z"
                                              fill="#000000"/>
                                    </svg>
                                </span>

                                    <span className='text-xl'>
                                        {currentUser && currentUser}
                                    </span>
                                </span>
                                <hr/>
                            </li>
                            <li className={styles.li}>
                                <Link className={styles.link} href="/search">
                                    <SearchIcon className={styles.icon}/>
                                    <span className={styles.title}>Search</span>
                                </Link>
                            </li>
                            <li className={styles.li}>
                                <Link className={styles.link} href="/">
                                    <StoreIcon className={styles.icon}/>
                                    <span className={styles.title}>Stories</span>
                                </Link>
                            </li>
                            <li className={styles.li}>
                                <Link className={styles.link} href="/posts">
                                    <PostsIcon className={styles.icon}/>
                                    <span className={styles.title}>Posts</span>
                                </Link>
                            </li>
                            <li className={styles.li}>
                                <Link className={styles.link} href="/chats">
                                    <ChatIcon className={styles.icon}/>
                                    <span className={styles.title}>Chats</span>
                                </Link>
                            </li>
                            <li className={styles.li}>
                                <Link className={styles.link} href="/friends">
                                    <FriendsIcon className={styles.icon}/>
                                    <span className={styles.title}>Friends</span>
                                </Link>
                            </li>
                            <li className={styles.li}>
                                <Link className={styles.link} href="/account">
                                    <AccountIcon className={styles.icon}/>
                                    <span className={styles.title}>Account</span>
                                </Link>
                            </li>
                            <li className={styles.li}>
                                <button className={styles.link} onClick={handleLogout}>
                                    <LogoutIcon className={styles.icon}/>
                                    <span className={styles.title}>Logout</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </aside>
            )}
        </>
    );
};

export default NavBar;