"use client";
import React, {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {SubmitHandler, useForm} from "react-hook-form";
import {useRouter} from "next/navigation";
import Image from "next/image";


export default function Page() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const token = Cookies.get("shite_access_token");

    const {
        register,
        handleSubmit,
        formState: {errors},
        setError,
        reset,
    } = useForm({
        defaultValues: async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const resp = await response.json();
                setCurrentUser(resp.data);
                return {
                    firstName: resp.data.first_name,
                    lastName: resp.data.last_name,
                };
            } else {
                return {
                    firstName: '',
                    lastName: '',
                };
            }
        },
    });
    const router = useRouter();
    const onSubmit: SubmitHandler<FormData> = async (data) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("token", token);
            formData.append("firstName", data.firstName);
            formData.append("lastName", data.lastName);

            if (data.avatar) {
                formData.append("avatar", data.avatar[0]);
            }

            const response = await fetch("/api/user/profile/update", {
              method: "POST",
              body: formData,
            });

            const result = await response.json();
            if(result.id) {
                setCurrentUser(result)
                location.reload();
            } else {
                setError("root", { type: "manual", message: "Some problem" });
            }

        } catch (err) {
            console.log(err, 'err')
            setError("root", {type: "manual", message: "Unexpected error occurred"});
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 sm:ml-64">
            <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                <h2 className="mb-4">Account</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                    <div>
                        <label
                            htmlFor="firstName"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            First Name
                        </label>
                        <input
                            id="title"
                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            type="firstName"
                            {...register("firstName", {required: false})}
                            placeholder="First name"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="lastName"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Last name
                        </label>
                        <input
                            id="lastName"
                            placeholder="Last name"
                            type="text"
                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            {...register("lastName", {required: false})}
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="avatar"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Avatar
                        </label>

                        <div className="flex items-center">
                            <div className='flex gap-3 items-center me-4'>
                                {currentUser?.profile?.avatar_url ? (
                                    <Image
                                        src={currentUser?.profile.avatar_url}
                                        width={50}
                                        height={50}
                                        className="h-12 w-12 rounded-full"
                                        alt={currentUser?.username}
                                    />
                                ) : (
                                    <div
                                        className='flex items-center justify-center bg-teal-50 h-[60px] w-[60px] rounded-full'>
                                        <svg className='h-full w-full' viewBox="-20 15 190 190" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M35.656 135.492C28.695 127.235 30.609 112.676 41.664 109.749C45.63 123.761 61.838 128.696 76.968 128.696C92.091 128.696 103.92 122.848 106.238 111.654C116.933 114.091 122.695 125.035 114.645 135.393C99.38 155.039 49.508 151.924 35.656 135.492ZM76.769 122.779C63.98 122.779 47.905 116.783 47.905 106.388C47.905 93.332 71.701 92.908 69.594 77.166C79.33 78.813 84.058 83.512 84.058 90.939C84.058 99.058 77.554 102.047 77.554 102.047L80.443 105.987C80.443 105.987 88.094 101.146 90.468 99.834C96.762 100.688 100.332 104.154 100.332 109.654C100.332 117.688 87.387 122.781 76.769 122.779Z"
                                                fill="#000000"/>
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <input
                                id="avatar"
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                type="file"
                                {...register("avatar", {required: false})}
                                placeholder="Avatar"
                            />
                        </div>

                    </div>
                    <button
                        type="submit"
                        className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Update"}
                    </button>
                </form>
                {errors.root && <span>{errors.root.message}</span>}
            </div>
        </div>
    );
}