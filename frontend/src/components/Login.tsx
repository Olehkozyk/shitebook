import React from "react";
import {useForm, SubmitHandler} from "react-hook-form";
import {useRouter} from "next/navigation";
import Cookies from 'js-cookie';
import Link from "next/link";
import IconPoopDog from "@/public/icon-poop-dog.svg";

type FormData = {
    login: string;
    password: string;
};

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: {errors},
        setError,
    } = useForm<FormData>({
        defaultValues: {
            login: '',
            password: '',
        }
    });

    const router = useRouter();
    const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
        try {
            let response = await fetch('api/auth/login', {
                method: 'POST',
                body: JSON.stringify({...data})
            })
            response = await response.json();
            if (response.status) {
                Cookies.set('shite_access_token', response.data.access, {secure: true, sameSite: 'Strict'});
                Cookies.set('shite_refresh_token', response.data.refresh, {secure: true, sameSite: 'Strict'});
                router.push("/");
            } else {
                setError("root", {type: "manual", message: 'Incorrect login or password'});
            }
        } catch (err) {
            setError("root", {type: "manual", message: "Unexpected error occurred"});
        }
    };

    return (
        <>
            <section className="bg-gray-50 dark:bg-gray-900 h-full">
                <div className="flex h-screen flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <Link href="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        <IconPoopDog className="me-3 flex-shrink-0 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'" />
                        Shitebook
                    </Link>
                    <div
                        className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Sign in to your account
                            </h1>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                                <div>
                                    <label htmlFor="login"
                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your username or email</label>
                                    <input
                                        id="login"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        type="text"
                                        {...register("login", {required: true})} placeholder="Username or email"/>
                                </div>
                                <div>
                                    <label htmlFor="password"
                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="Password"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        {...register("password", {required: true})} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                            <input id="remember" aria-describedby="remember" type="checkbox"
                                                   className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                                                   required=""/>
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                    Sign in
                                </button>
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Don’t have an account yet?
                                    <Link href="/registration" className="font-medium text-primary-600 hover:underline dark:text-primary-500 ms-1">Sign up</Link>
                                </p>
                            </form>
                            {errors.root && <span>{errors.root.message}</span>}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
};

export default Login;