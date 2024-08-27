"use client";
import PostsList from "@/components/posts/PostsList";
import {useEffect, useState} from "react";
import Cookies from "js-cookie";

export default function Home() {
    const [posts, setPosts] = useState([]);
    const token = Cookies.get('shite_access_token');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                let response = await fetch(`/api/search/posts?token=${token}`, {method: 'GET'})
                response = await response.json();
                if (response.status) setPosts(response.data.results);
            } catch (error) {
                console.log(error)
            }
        };
        token && fetchPosts();
    }, []);
    return <>
        <div className="p-4 sm:ml-64">
            <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                <h1>Stories</h1>

                <PostsList posts={posts} />
            </div>
        </div>
    </>
}