"use client";
import React, {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {SubmitHandler, useForm} from "react-hook-form";
import {useRouter} from "next/navigation";
import Link from "next/link";
type FormData = {
  title: string;
  description: string;
  image: {};
  likes: number;
};
export default function Page() {
  const [posts, setPosts] = useState([]);
  const token = Cookies.get('shite_access_token');
  const {
    register,
    handleSubmit,
    formState: {errors},
    setError,
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      image: {},
      likes: 0,
    }
  });
  const router = useRouter();
  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    try {
      const formData = new FormData();
      formData.append('token', token);
      formData.append('title', data.title);
      formData.append('description', data.description);

      // Assuming 'image' is a File or Blob
      if (data.image) {
        formData.append('image', data.image[0]);
      }

      const response = await fetch('/api/posts/create', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      if (result.id) {
        router.push('/posts/')
      } else {
        setError("root", { type: "manual", message: 'Some problem' });
      }
    } catch (err) {
      setError("root", { type: "manual", message: "Unexpected error occurred" });
    }
  };

  return <>
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
        <h2>Create post</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
          <div>
            <label htmlFor="title"
                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
            <input
                id="title"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="text"
                {...register("title", {required: true})} placeholder="Title"/>
          </div>
          <div>
            <label htmlFor="description"
                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
            <textarea
                id="description"
                placeholder="Description"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                {...register("description", {required: true})} />
          </div>
          <div>
            <label htmlFor="image"
                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Image</label>
            <input
                id="image"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="file"
                {...register("image", {required: true})} placeholder="Image"/>
          </div>
          <button type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
            Create
          </button>

        </form>
        {errors.root && <span>{errors.root.message}</span>}
      </div>
    </div>
  </>
}