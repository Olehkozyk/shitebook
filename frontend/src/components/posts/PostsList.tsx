import React, {useEffect, useState} from 'react';
import PostItem from "@/components/posts/PostItem";
import CommentPopup from "@/components/posts/CommentPopup";
import Cookies from "js-cookie";

const PostsList = ({posts}) => {
    if (!posts || posts.length === 0) {
        return <p>No Posts</p>;
    }
    const [openComment, setOpenComment] = useState(false);
    const [popupCommentData, setPopupData] = useState([]);
    const [idPostCommentPopup, setIdPostCommentPopup] = useState(0);
    const token = Cookies.get('shite_access_token');
    const handleOpenComment = async (postId) => {
        try {
            let response = await fetch(`api/posts/comments?token=${token}&postId=${postId}`, {method: 'GET'})
            response = await response.json();
            if(response.status) {
                setPopupData(response.data.results);
                setIdPostCommentPopup(postId);
                setOpenComment(true);
            }
        } catch (error) {
            console.log(error)
        }
    };

    const handleComment = async (postId, commentText = '') => {
        let comment = commentText.trim();
        if(!comment) return;
        try {
            let response = await fetch(`api/posts/comments`, {
                method: 'POST',
                body: JSON.stringify({
                    token,
                    postId,
                    comment
                })
            })
            if(response.ok) {
                response = await response.json();
                setPopupData(prevData => [response, ...prevData]);
            }

        } catch (error) {
            console.log(error)
        }
    }

    const handleCloseComment = () => {
        setPopupData([]);
        setIdPostCommentPopup(0);
        setOpenComment(false);
    };
    return (
        <>
            <div className="container my-3 mx-auto">
                <div className="flex flex-wrap -mx-1 lg:-mx-4">
                    {posts.map(post => (
                        <PostItem key={post.id} post={post} onOpenComment={handleOpenComment} />
                    ))}
                </div>
                {openComment && <CommentPopup idPostComment={idPostCommentPopup}
                                              popupCommentData={popupCommentData}
                                              onComment={handleComment}
                                              onClose={handleCloseComment} />}
            </div>
        </>
    );
};

export default PostsList;