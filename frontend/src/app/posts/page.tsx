"use client";
import PostsList from "@/components/posts/PostsList";

export default function Page() {
  return <>
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
        <PostsList />
      </div>
    </div>
  </>
}