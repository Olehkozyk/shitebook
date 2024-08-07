import React, {useState} from 'react';
import CloseIcon from "@/public/icon-close.svg";
import PostItem from "@/components/posts/PostItem";
import Image from "next/image";
import PostsIcon from "@/public/icons-navbar/icon-posts.svg";
import Link from "next/link";
import {formatDate} from "@/utils/formateDate";
const CommentPopup = ({idPostComment, popupCommentData, onClose, onComment}) => {
    const [commentText, setCommentText] = useState('');
    const handleChange = (event) => {
        setCommentText(event.target.value);
    };

    return (
        <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center flex items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div
                        className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Comments
                        </h3>
                        <button type="button"
                                onClick={() => onClose()}
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                            <CloseIcon className="w-3 h-3"/>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>

                    <div className="p-4 md:p-5 max-w-md text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
                        {popupCommentData.map(comment => (
                            <div key={comment.id} className="flex pb-3 items-center ">
                                <Link
                                    className="flex items-center no-underline hover:underline text-white"
                                    href={`user/${comment.author.id}`}>
                                {comment.author.profile.avatar_url ? (
                                    <Image
                                        src={comment.author.profile.avatar_url}
                                        width={50}
                                        height={50}
                                        className="h-12 w-12 rounded-full"
                                        alt={comment.author.username}
                                    />
                                ) : (
                                    <PostsIcon className="h-12 w-12 rounded-full"/>
                                )}
                                </Link>
                                <div className="flex flex-col ml-2">
                                    <div
                                        className=" text-gray-500 md:text-lg dark:text-gray-400">{comment?.author.username}</div>
                                    <span className="md:text-sm mb-1 text-gray-500">{formatDate(comment.created_at, true)}</span>
                                    <p className="text-lg font-semibold">{comment.content}</p>
                                </div>

                            </div>
                        ))}

                    </div>

                    <div className="p-4 md:p-5 space-y-4">
                         <textarea
                             className="bg-transparent border-2 w-full p-4 resize-none"
                             name="comment"
                             cols="30"
                             rows="5"
                             value={commentText}
                             onChange={handleChange}
                         />
                        <button
                            onClick={() => onComment(idPostComment, commentText)}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                            type="submit">
                            Comment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentPopup;