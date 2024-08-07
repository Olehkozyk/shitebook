"use client";
import {useEffect, useState} from "react";
import Cookies from "js-cookie";

export default function Page({ params }: { params: { slug: string } }) {
    const [user, setUser] = useState({});
    const token = Cookies.get('shite_access_token');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                let response = await fetch(`/api/user/profile?token=${token}&userId=${params.slug}`, {method: 'GET'})
                response = await response.json();
                if(response.status) {
                    setUser(response.data)
                }
                console.log(response, 'response')

            } catch (error) {
                console.log(error)
            }
        };
        token && fetchUser();
    }, []);

    return <>
        <div className="p-4 sm:ml-64">
            <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                <div>User: {user.username}</div>
            </div>
        </div>
    </>

}