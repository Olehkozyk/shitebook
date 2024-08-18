"use client";
import React, {useEffect, useState} from "react";
import Cookies from "js-cookie";
import ListUsers from "@/components/user/ListUsers";
import ListRequestUsers from "@/components/user/ListRequestUsers";
export default function Friends() {
    const [friendShow, setFriendShow] = useState('friend');
    const [listFriend, setListFriend] = useState([]);
    const [listRequestFriend, setListRequestFriend] = useState([]);
    const token = Cookies.get('shite_access_token');
    useEffect(() => {
        const fetchFriendsList = async () => {
            try {
                let response = await fetch(`/api/user/friends/friends-list?token=${token}`, {method: 'GET'})
                response = await response.json();
                if (response.status) {
                    setListFriend(response.data)
                }

            } catch (error) {
                console.log(error)
            }
        };

        const fetchRequestFriendsList = async () => {
            try {
                let response = await fetch(`/api/user/friends/request-friend?token=${token}`, {method: 'GET'})
                response = await response.json();
                if (response.status) {
                    setListRequestFriend(response.data)
                    console.log(response.data);
                }
            } catch (error) {
                console.log(error)
            }

        };

        token && fetchFriendsList() && fetchRequestFriendsList();
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
            if (response.status) setListRequestFriend(listRequestFriend.map(item => item.from_user.id !== id));
        } catch (error) {
            console.log(error)
        }
    }
    return <>
        <div className="p-4 sm:ml-64">
            <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                <ul className="hidden mb-4 text-sm font-medium text-center text-gray-500 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
                    <li className="w-full focus-within:z-10 cursor-pointer ">
                        <div
                            className={`flex items-center w-full text-gray-900 bg-gray-100 border-r border-gray-200 dark:border-gray-700 rounded-s-lg focus:ring-4 focus:outline-none focus:ring-blue-300 dark:hover:text-white dark:bg-gray-${friendShow === 'friend' ? '700' : '800'} dark:hover:bg-gray-700`}
                            aria-current="page">
                            <input
                                id="horizontal-list-radio-license"
                                type="radio"
                                checked={friendShow === 'friend'}
                                onChange={() => setFriendShow('friend')}
                                className="hidden"
                            />
                            <label htmlFor="horizontal-list-radio-license"
                                   className="p-4 ms-2 text-sm font-medium cursor-pointer text-gray-900 dark:text-gray-300 w-full block">
                                Friend
                            </label>
                        </div>
                    </li>
                    <li className="w-full focus-within:z-10 cursor-pointer">
                        <div
                            className={`flex items-center w-full text-gray-900 bg-gray-100 border-r border-gray-200 dark:border-gray-700 rounded-e-lg focus:ring-4 focus:outline-none focus:ring-blue-300 dark:hover:text-white dark:bg-gray-${friendShow === 'request' ? '700' : '800'} dark:hover:bg-gray-700`}
                            aria-current="page">
                            <input
                                id="horizontal-list-radio-id"
                                type="radio"
                                checked={friendShow === 'request'}
                                onChange={() => setFriendShow('request')}
                                className="hidden"
                            />
                            <label htmlFor="horizontal-list-radio-id"
                                   className="p-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 w-full block cursor-pointer">
                                Request Friend
                            </label>
                        </div>
                    </li>
                </ul>
                {listFriend.length > 0 && friendShow === 'friend' && (<ListUsers users={listFriend}/>)}
                {listRequestFriend.length > 0 && friendShow === 'request' &&  (<ListRequestUsers addRemoveRequestFriend={addRemoveRequestFriend} users={listRequestFriend} />)}
            </div>
        </div>
    </>
}