import React from "react";
import {useForm, SubmitHandler} from "react-hook-form";
import {useRouter} from "next/navigation";
import Cookies from 'js-cookie';
import Link from "next/link";
import IconPoopDog from '@/public/icon-poop-dog.svg'

type FormData = {
    login: string;
    password: string;
};

const Registation = () => {
    const {
        register,
        handleSubmit,
        formState: {errors},
        setError,
    } = useForm<FormData>({
        defaultValues: {
            email: '',
            username: '',
            password: '',
            repeatPassword: '',
        }
    });

    const router = useRouter();
    const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
        const dateVal = {...data};
        if(dateVal.password !== dateVal.repeatPassword) {
            setError("root", {type: "manual", message: "Password doesn't match"});
            return;
        }
        try {
            let response = await fetch('api/auth/registration', {
                method: 'POST',
                body: JSON.stringify({...data})
            })
            response = await response.json();
            if (response.status) {
                Cookies.set('shite_access_token', response.data.access, {secure: true, sameSite: 'Strict'});
                Cookies.set('shite_refresh_token', response.data.refresh, {secure: true, sameSite: 'Strict'});
                router.push("/");
            } else {
                setError("root", {type: "manual", message: response.message});
            }
        } catch (err) {
            setError("root", {type: "manual", message: "Unexpected error occurred"});
        }
    };

    return (
        <>
            <section className="bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <Link href="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                       <IconPoopDog className="me-3 flex-shrink-0 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'" />
                        Shitebook
                    </Link>
                    <div
                        className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Registration
                            </h1>
                            {errors.root && <span className='text-red-800'>{errors.root.message}</span>}
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                                <div>
                                    <label htmlFor="email"
                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your
                                        email</label>
                                    <input
                                        id="email"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        style={{color: 'black'}} type="email"
                                        {...register("email", {required: true})} placeholder="Email"/>
                                </div>
                                <div>
                                    <label htmlFor="username"
                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                                    <input
                                        id="text"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        style={{color: 'black'}} type="text"
                                        {...register("username", {required: true})} placeholder="Username"/>
                                </div>
                                <div>
                                    <label htmlFor="password"
                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>

                                    <input
                                        id="password"
                                        style={{color: 'black'}} type="password"
                                        placeholder="Password"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        {...register("password", {required: true})} />
                                </div>
                                <div>
                                    <label htmlFor="repeat-password"
                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Repeat
                                        password</label>
                                    <input
                                        id="repeat-password"
                                        style={{color: 'black'}} type="password"
                                        placeholder="Repeat password"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        {...register("repeatPassword", {required: true})} />
                                </div>
                                <button type="submit"
                                        className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                    Sign up
                                </button>
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Do you have an account?
                                    <Link href="/login"
                                          className="font-medium text-primary-600 hover:underline dark:text-primary-500 ms-1">Sign
                                        in</Link>
                                </p>
                            </form>

                        </div>
                    </div>
                </div>
            </section>


        </>
    )

};

export default Registation;