import React, {useState} from 'react';
import Image from 'next/image'
import Link from "next/link";
import {formatDate} from "@/utils/formateDate";
import PostsIcon from "@/public/icons-navbar/icon-posts.svg";
import LikeIcon from "@/public/icon-shite.svg";
import CommentsIcon from "@/public/icon-comments.svg";
import Cookies from "js-cookie";

const PostItem = ({post}) => {
    if (!post) {
        return <p>No Post</p>;
    }
    const [isLike, setIsLike] = useState(post.is_liked);
    const [countLike, setCountLike] = useState(post.likes_count);

    console.log(post);
    const like = async () => {
        const token = Cookies.get('shite_access_token');  // Получаем токен из куки
        try {
            const response = await fetch(`/api/posts/like/`, {
                method: 'POST',
                body: JSON.stringify({
                    token,
                    postId: post.id
                })
            });
            const data = await response.json();
            console.log(data);
            if (response.ok && data.status) {
                setIsLike(data.is_like)
                setCountLike(data.likes_count)
            }
        } catch (error) {
            console.error('Network error', error);
        }
    };
    return (
        <>
            <article key={post.id} className="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
                <div className="bg-gray-600 overflow-hidden rounded-lg shadow-lg">
                    <Image
                        src={post.image_url}
                        width={500}
                        height={500}
                        className="block h-auto w-full"
                        alt={post.title}
                    />

                    <header className="flex items-center justify-between leading-tight p-2 md:p-4">
                        <h2 className="no-underline text-white">
                            {post.title}
                        </h2>
                        <p className="text-white text-sm">
                            {formatDate(post.created_at)}
                        </p>
                    </header>

                    <footer className="leading-none p-2 md:p-4">
                        <Link
                            className="flex items-center no-underline hover:underline text-white"
                            href={`user/${post.author.id}`}>
                            {post.author.profile.avatar_url ? (
                                <Image
                                    src={post.author.profile.avatar_url}
                                    width={50}
                                    height={50}
                                    className="h-12 w-12 rounded-full"
                                    alt={post.author.username}
                                />
                            ) : (
                                <PostsIcon className="h-12 w-12 rounded-full"/>
                            )}
                            <p className="ml-2 text-sm test-white">
                                {post.author.username}
                            </p>
                        </Link>
                        <div className="flex items-end">
                            <div className="no-underline cursor-pointer flex items-center flex-col" onClick={like}>
                                <LikeIcon className={`h-12 w-12  ${isLike ? 'text-red-800' : ''}`}/>
                                <span>{countLike}</span>
                            </div>
                            <div className="no-underline cursor-pointer flex items-center flex-col">
                                <CommentsIcon className={`h-12 w-12 max-h-7 mb-1`}/>
                                <span>{post.comments_count}</span>
                            </div>
                        </div>

                    </footer>
                </div>

            </article>
        </>
    );
};

export default PostItem;