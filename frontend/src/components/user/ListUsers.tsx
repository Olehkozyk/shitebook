import React, {useState} from 'react';
import Link from "next/link";
import Image from "next/image";
import PostsIcon from "@/public/icons-navbar/icon-posts.svg";
import ChatIcon from "@/public/icon-chat.svg";


const ListUsers = ({users}) => {

    return (
        <>
            <div className="py-5 sm:py-6">
                <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-20 px-6 lg:px-8 xl:grid-cols-3">
                    {users.length > 0 &&  <ul role="list" className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">
                        {users.map((user) => (
                            <li key={user.id} className="flex items-center gap-x-6">
                                <Link  href={'user/' + user.id}>
                                    {user?.profile?.avatar_url ? (
                                        <Image
                                            src={user?.profile.avatar_url}
                                            width={50}
                                            height={50}
                                            className="h-12 w-12 rounded-full"
                                            alt={user.username}
                                        />
                                    ) : (
                                        <PostsIcon className="h-16 w-16 rounded-full"/>
                                    )}
                                </Link>
                                <div>
                                    <h3 className="text-base text-white font-semibold leading-7 tracking-tight">
                                        {user.username}
                                    </h3>
                                    <p className="text-sm font-semibold leading-6 text-indigo-600">
                                        {user.first_name} {user.last_name}
                                    </p>
                                    {user.chat_id &&
                                        <Link href={'chats/'+user.chat_id}>
                                            <ChatIcon className="text-white w-7" />
                                        </Link>}
                                </div>

                            </li>
                        ))}
                    </ul>}
                    {users.length === 0 && <h2>No one friends</h2>}
                </div>
            </div>
        </>
    );
};

export default ListUsers;