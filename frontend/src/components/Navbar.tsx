'use client';
import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import Image from 'next/image'
import {usePathname, useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import StoreIcon from '@/public/icons-navbar/store-icon.svg';
import ChatIcon from '@/public/icons-navbar/chat-icon.svg';
import AccountIcon from '@/public/icons-navbar/account-icon.svg';
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

    const fetchUserProfile = async (token) => {
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
                console.log('fetchUserProfile', data);
                setCurrentUser(data.data);
            } else {
                setCurrentUser(null);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            setCurrentUser(null);
        }
    };

    useEffect(() => {
        const token = Cookies.get('shite_access_token');
        if (token) {
            fetchUserProfile(token);
        }
    }, [path]);

    const handleLogout = () => {
        Cookies.remove('shite_access_token');
        Cookies.remove('shite_refresh_token');
        setCurrentUser(null);
        router.push('/login');
    };


    const styles = {
        li: 'flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group',
        link: 'flex items-center w-full',
        icon: 'flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white',
        title: 'flex-1 ms-3 whitespace-nowrap w-full text-left',
        active: 'bg-gray-700',
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

                                         {currentUser?.profile?.avatar_url ? (
                                             <Image
                                                 src={currentUser?.profile.avatar_url}
                                                 width={50}
                                                 height={50}
                                                 className="h-12 w-12 rounded-full"
                                                 alt={currentUser?.username}
                                             />
                                         ) : (
                                             <span
                                                 className='flex items-center justify-center bg-teal-50 h-[60px] w-[60px] rounded-full'>
                                             <svg className='h-full w-full' viewBox="-20 15 190 190" fill="none"
                                                  xmlns="http://www.w3.org/2000/svg">
                                                 <path
                                                     d="M35.656 135.492C28.695 127.235 30.609 112.676 41.664 109.749C45.63 123.761 61.838 128.696 76.968 128.696C92.091 128.696 103.92 122.848 106.238 111.654C116.933 114.091 122.695 125.035 114.645 135.393C99.38 155.039 49.508 151.924 35.656 135.492ZM76.769 122.779C63.98 122.779 47.905 116.783 47.905 106.388C47.905 93.332 71.701 92.908 69.594 77.166C79.33 78.813 84.058 83.512 84.058 90.939C84.058 99.058 77.554 102.047 77.554 102.047L80.443 105.987C80.443 105.987 88.094 101.146 90.468 99.834C96.762 100.688 100.332 104.154 100.332 109.654C100.332 117.688 87.387 122.781 76.769 122.779Z"
                                                     fill="#000000"/>
                                             </svg>
                                             </span>
                                         )}


                                    <span className='text-xl'>
                                         {currentUser?.username}
                                    </span>
                                </span>
                                <hr/>
                            </li>
                            <li className={`${styles.li} ${path === '/search' ? styles.active : ''}`}>
                                <Link className={styles.link} href="/search">
                                    <SearchIcon className={styles.icon}/>
                                    <span className={styles.title}>Search</span>
                                </Link>
                            </li>
                            <li className={`${styles.li} ${path === '/' ? styles.active : ''}`}>
                                <Link className={styles.link} href="/">
                                    <StoreIcon className={styles.icon}/>
                                    <span className={styles.title}>Stories</span>
                                </Link>
                            </li>
                            <li className={`${styles.li} ${path === '/posts' ? styles.active : ''}`}>
                                <Link className={styles.link} href="/posts">
                                    <svg className={styles.icon} height="24" width="25" viewBox="0 0 24 24"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path fill="currentColor"
                                              d="m11.36 2c-.21 0-.49.12-.79.32-.57.38-1.72 1.58-2.17 2.78-.34.9-.35 1.72-.21 2.33-.56.1-.97.28-1.13.35-.51.22-1.59 1.18-1.69 2.67-.03.52.04 1.05.2 1.55-.66.19-1.04.43-1.07.44-.32.12-.85.49-1 .69-.35.4-.58.87-.71 1.37-.29 1.09-.19 2.33.34 3.33.29.56.69 1.17 1.13 1.6 1.44 1.48 3.92 2.04 5.88 2.36 2.39.4 4.89.26 7.12-.66 3.35-1.39 4.24-3.63 4.38-4.24.29-1.39-.07-2.7-.22-3.02-.22-.46-.58-.93-1.17-1.23-.4-.25-.75-.38-1.01-.44.26-.95-.11-1.7-.62-2.26-.77-.82-1.56-.94-1.56-.94.26-.5.36-1.1.22-1.68-.16-.71-.55-1.16-1.06-1.46-.52-.31-1.16-.46-1.82-.58-.32-.06-1.65-.25-2.2-1.01-.45-.62-.46-1.74-.58-2.07-.05-.13-.12-.2-.26-.2m4.64 7.61c.07 0 .13.01.19.01 1.43.16 2.45 1.54 2.28 3.07s-1.47 2.65-2.9 2.49c-1.43-.18-2.45-1.53-2.28-3.07.16-1.45 1.35-2.55 2.71-2.5m-7.38 0c1.33.04 2.44 1.17 2.54 2.6.12 1.54-.95 2.87-2.38 2.98h-.01c-1.43.11-2.69-1.05-2.81-2.59-.11-1.54.96-2.87 2.39-2.98.09-.01.18-.01.27-.01m.02 1.7c-.04 0-.07 0-.11.01-.56.07-.96.58-.89 1.13.06.55.57.94 1.13.87s.96-.58.9-1.13c-.06-.52-.52-.89-1.03-.88m7.3.02c-.52.02-.94.42-.98.95-.04.55.39 1.03.95 1.06.59.04 1.05-.39 1.09-.94.04-.56-.39-1.04-.95-1.07-.05 0-.05 0-.11 0m-7.23 4.82c.29-.01.55.08.79.13 1.18.22 2.2.25 2.69.25s1.5-.03 2.67-.25c.41-.08.88-.25 1.25 0 .48.32.13 1.47-.61 2.25-.46.47-1.53 1.38-3.31 1.38s-2.86-.91-3.31-1.38c-.74-.78-1.09-1.93-.62-2.25.14-.09.29-.13.45-.13z"/>
                                    </svg>
                                    <span className={styles.title}>My Posts</span>
                                </Link>
                            </li>
                            <li className={`${styles.li} ${path === '/chats' ? styles.active : ''}`}>
                                <Link className={styles.link} href="/chats">
                                    <ChatIcon className={styles.icon}/>
                                    <span className={styles.title}>Chats</span>
                                </Link>
                            </li>
                            <li className={`${styles.li} ${path === '/friends' ? styles.active : ''}`}>
                                <Link className={styles.link} href="/friends">
                                    <FriendsIcon className={styles.icon}/>
                                    <span className={styles.title}>Friends</span>
                                </Link>
                            </li>
                            <li className={`${styles.li} ${path === '/account' ? styles.active : ''}`}>
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