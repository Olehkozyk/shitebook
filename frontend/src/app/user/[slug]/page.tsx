"use client";
import React, {useEffect, useState} from "react";
import Cookies from "js-cookie";
import PostsList from "@/components/posts/PostsList";

export default function Page({params}: { params: { slug: string } }) {
    const [user, setUser] = useState({});
    const [requestFriend, setRequestFriend] = useState(false);
    const [acceptFriend, setAcceptFriend] = useState(false);
    const [isFriend, setIsFriend] = useState(false);
    const token = Cookies.get('shite_access_token');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                let response = await fetch(`/api/user/profile?token=${token}&userId=${params.slug}`, {method: 'GET'})
                response = await response.json();
                console.log(response, 'fetchUser')
                if (response.status) {
                    setUser(response.data)
                    setRequestFriend(response.data.friend_request_sent)
                }

            } catch (error) {
                console.log(error)
            }
        };
        const fetchIsRequest = async () => {
            try {
                let response = await fetch(`/api/user/friends/request-friend?token=${token}`, {method: 'GET'})
                response = await response.json();

                if (response.status) {
                    console.log(response, 'fetchIsRequest')
                    response.data.forEach(item => {
                        if(String(item.from_user.id) === String(params.slug)) {
                            setAcceptFriend(true);
                        }
                    });
                }
            } catch (error) {
                console.log(error)
            }
        };

        const isFriend = async () => {
            try {
                let response = await fetch(`/api/user/friends/is-friend?token=${token}&userId=${params.slug}`, {method: 'GET'})
                response = await response.json();

                if (response.status) {
                    console.log(response)
                    setIsFriend(response.is_friend);
                }
            } catch (error) {
                console.log(error)
            }
        };
        token && fetchUser() && fetchIsRequest() && isFriend();
    }, []);

    const addRemoveRequestFriend = async (id, addRequest = true,) => {
        if (!id) return;
        const route = addRequest ? '/add-friend/' : '/remove-request-friend/';
        try {
            let response = await fetch(`/api/user/friends${route}`, {
                method: 'POST',
                body: JSON.stringify({token, userId: id}),
            })
            response = await response.json();
            if (response.status) setRequestFriend(addRequest)
        } catch (error) {
            console.log(error)
        }
    }

    const acceptRemoveFriend = async (id, accept = true) => {
        if (!id) return;
        const route = accept ? '/accept-friend/' : '/remove-friend/';

        try {
            let response = await fetch(`/api/user/friends${route}`, {
                method: 'POST',
                body: JSON.stringify({token, userId: id}),
            })
            response = await response.json();
            if (response.status) {
                setIsFriend(accept);
            }
        } catch (error) {
            console.log(error)
        }
    }

    let button;
    const classBtn = 'w-auto mt-5 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800';
    if(requestFriend && !acceptFriend && !isFriend) {
        button = <button onClick={() => addRemoveRequestFriend(params.slug, false)} className={classBtn}>Remove request</button>
    } else if(!acceptFriend && !isFriend) {
        button = <button onClick={() => addRemoveRequestFriend(params.slug, true)} className={classBtn}>Add fried</button>
    } else if(acceptFriend && !isFriend) {
        button = <button onClick={() => acceptRemoveFriend(params.slug)} className={classBtn}>Accept to friend</button>
    } else if(isFriend) {
        button = <button onClick={() => acceptRemoveFriend(params.slug, false)} className={classBtn}>Remove from friend</button>
    }
    return <>
        <div className="p-4 sm:ml-64">
            <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                <div>User: {user.username}</div>
                {button}
            </div>
        </div>
    </>

}