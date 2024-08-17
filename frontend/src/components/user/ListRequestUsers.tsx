import React, {useState} from 'react';
import Link from "next/link";
import Image from "next/image";
import PostsIcon from "@/public/icons-navbar/icon-posts.svg";
import IconMark from "@/public/icon-mark.svg";
import Cookies from "js-cookie";


const ListRequestUsers = ({users}) => {
    const token = Cookies.get('shite_access_token');
    const acceptFriend = async (id) => {
        if (!id) return;

        try {
            let response = await fetch(`/api/user/friends/accept-friend/`, {
                method: 'POST',
                body: JSON.stringify({token, userId: id}),
            })
            response = await response.json();
            if (response.status) {
                console.log(response);
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <div className="py-5 sm:py-6">
                <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-20 px-6 lg:px-8 xl:grid-cols-3">
                    <ul role="list" className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">
                        {users.map((user) => (
                            <li key={user.from_user.id} className="flex items-center gap-x-6">
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
                                        <PostsIcon className="h-16 w-16 rounded-full"/>
                                    )}
                                </Link>
                                <div>
                                    <h3 className="text-base text-white font-semibold leading-7 tracking-tight">
                                        {user.from_user.username}
                                    </h3>
                                    <p className="text-sm font-semibold leading-6 text-indigo-600">
                                        {user.from_user.first_name} {user.from_user.last_name}
                                    </p>
                                    <button onClick={() => acceptFriend(user.from_user.id)}>
                                        <IconMark className="text-green-600 w-5"/>
                                    </button>

                                </div>

                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default ListRequestUsers;