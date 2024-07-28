import React, {useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import Image from 'next/image'
const PostsList = () => {
    const [posts, setPosts] = useState([]);
    const token = Cookies.get('shite_access_token');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                let response = await fetch(`api/posts?token=${token}`, {method: 'GET'})
                response = await response.json();
                if (response.status) setPosts(response.data);
            } catch (error) {
                console.log(error)
            }
        };
        token && fetchPosts();
    }, []);

    return (
        <div>
            <h1>User Posts</h1>
            {posts?.length > 0 ? (
                <ul>
                    {posts.map(post => (
                        <li key={post.id}>
                            {post.title}
                            {post.image_url && (
                                    <Image
                                        src={post.image_url}
                                        width={500}
                                        height={500}
                                        alt="Picture of the author"
                                    />
                                )
                            }
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No posts found</p>
            )}
        </div>
    );
};

export default PostsList;