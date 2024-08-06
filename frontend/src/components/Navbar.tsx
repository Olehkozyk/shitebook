"use client";
import React from 'react';
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
    const router = useRouter();

    const handleLogout = () => {
        Cookies.remove('shite_access_token');
        Cookies.remove('shite_refresh_token');
        router.push('/login');
    };
    const path = usePathname();
    const disableNavbar = [
        "/login",
        "/registration",
    ]

    const styles = {
        'li': 'flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group',
        'link': 'flex items-center w-full',
        'icon': 'flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white',
        'title': 'flex-1 ms-3 whitespace-nowrap w-full text-left',
    }

    return <>
        {!disableNavbar.includes(path) && (
            <aside className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
                <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                    <ul className="space-y-2 font-medium">
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
    </>;
};

export default NavBar;