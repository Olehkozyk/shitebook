import React, {useState} from 'react';
import Link from "next/link";
import Image from "next/image";
import PostsIcon from "@/public/icons-navbar/icon-posts.svg";
import IconMark from "@/public/icon-mark.svg";
import IconClose from "@/public/icon-close.svg";
import Cookies from "js-cookie";


const ListRequestUsers = ({users, addRemoveRequestFriend}) => {

    return (
        <>

            <div className="py-5 sm:py-6">
                <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-20 px-6 lg:px-8 xl:grid-cols-3">
                    {users.length > 0 && <ul role="list" className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">
                        {users.map((user) => (
                            <li key={user.from_user.id} className="flex items-center justify-between gap-x-6">
                                <div className='flex items-center gap-4'>
                                <Link href={'user/' + user.from_user.id}>
                                    {user?.from_user?.profile?.avatar_url ? (
                                        <Image
                                            src={user?.from_user?.profile.avatar_url}
                                            width={50}
                                            height={50}
                                            className="h-12 w-12 rounded-full"
                                            alt={user?.from_user.username}
                                        />
                                    ) : (
                                        <div
                                            className='flex items-center justify-center bg-teal-50 h-[40px] w-[40px] rounded-full'>
                                            <PostsIcon className="h-12 w-12 rounded-full"/>
                                        </div>
                                    )}
                                </Link>
                                <h3 className="text-base text-white font-semibold leading-7 tracking-tight">
                                    {user.from_user.username}
                                </h3>
                                </div>
                                <div className='flex items-stretch justify-stretch flex-col gap-4'>
                                    <button
                                        className="text-xs w-full rounded-lg bg-teal-500 p-2 font-semibold leading-6 text-teal-950 flex justify-between items-center"
                                        onClick={() => addRemoveRequestFriend(user.from_user.id)}>
                                        Accept friend<IconMark className="text-teal-950 w-5 ms-4"/>
                                    </button>
                                    <button
                                        className="text-sm rounded-lg bg-rose-300 p-2 font-semibold leading-6 text-red-800 flex justify-between items-center"
                                        onClick={() => addRemoveRequestFriend(user.from_user.id, false)}>
                                        Remove request<IconClose className="text-red-800 w-5 ms-4"/>
                                    </button>
                                </div>

                            </li>
                        ))}
                    </ul>}
                    {users.length === 0 && <h2>No one request</h2>}
                </div>
            </div>
        </>
    );
};

export default ListRequestUsers;