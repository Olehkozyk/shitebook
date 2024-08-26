"use client";
import PostsList from "@/components/posts/PostsList";
import {useEffect, useState} from "react";
import Cookies from "js-cookie";
import Link from "next/link";

export default function Page() {
  const [posts, setPosts] = useState([]);
  const token = Cookies.get('shite_access_token');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let response = await fetch(`api/posts?token=${token}`, {method: 'GET'})
        response = await response.json();
        console.log(response, 'response')
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
        <h2 className='text-xl mb-4'>Publication</h2>
        <Link href='posts/create' className="font-medium text-primary-600 hover:underline dark:text-primary-500 pe-3">Create New Post</Link>
        <PostsList posts={posts} />
      </div>
    </div>
  </>
}