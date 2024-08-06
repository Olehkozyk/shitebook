import React, {useState} from 'react';
import PostItem from "@/components/posts/PostItem";
import CommentPopup from "@/components/posts/CommentPopup";

const PostsList = ({posts}) => {
    if (!posts || posts.length === 0) {
        return <p>No Posts</p>;
    }
    // const [openComment, setOpenComment] = useState(false);
    return (
        <>
            <div className="container my-3 mx-auto">
                <div className="flex flex-wrap -mx-1 lg:-mx-4">
                    {posts.map(post => (
                        <PostItem key={post.id} post={post} />
                    ))}
                </div>
                {/*<CommentPopup />*/}
            </div>
        </>
    );
};

export default PostsList;