import React, {useState} from "react";
import {useForm, SubmitHandler, Controller} from "react-hook-form";
import {useRouter} from "next/navigation";
import Cookies from 'js-cookie';
import SearchIcon from "@/public/icons-navbar/search-icon.svg";
import PostsIcon from '@/public/icons-navbar/icon-posts.svg';
import {formatDate} from "@/utils/formateDate";
import Image from "next/image";
import PostsList from "@/components/posts/PostsList";

type FormData = {
    search: string;
};

const SearchComponent = () => {
    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: {errors},
        setError
    } = useForm<FormData>({
        defaultValues: {
            filter: "posts",
            search: "",
        },
    });

    const [timeoutId, setTimeoutId] = useState(null);
    const router = useRouter();
    const token = Cookies.get('shite_access_token');
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("posts");
    const [resultsUser, setResultsUser] = useState([]);
    const [resultsPosts, setResultsPosts] = useState([]);
    const ajaxRequestSearch = async (data: string, filterBy: string) => {
        const value = data.trim();
        if (value.length > 3) {
            try {
                let response = await fetch(`api/search/${filterBy}?search=${value}&token=${token}`, {
                    method: 'GET',
                })
                response = await response.json();
                if (response.status) {
                    console.log(response)
                    switch (filterBy) {
                        case 'posts':
                            setResultsUser([])
                            setResultsPosts(response.data.results)
                            break;
                        case 'users':
                            setResultsPosts([])
                            setResultsUser(response.data.results)
                            break;
                        default:
                            break;
                    }
                } else {
                    setError("root", {type: "manual", message: 'Error request users list'});
                    setResultsUser([])
                    setResultsPosts([])
                }
            } catch (err) {
                setError("root", {type: "manual", message: "Error request users list"});
                setResultsUser([])
                setResultsPosts([])
            }
        }
    };


    const handleFilterChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const filterBy = event.target.value;
        setFilter(filterBy);
        await ajaxRequestSearch(search, filterBy);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = event.target.value;
        setSearch(newSearchTerm);
        clearTimeout(timeoutId!);
        const newTimeoutId = setTimeout(async () => {
            await ajaxRequestSearch(newSearchTerm, filter);
        }, 500);
        setTimeoutId(newTimeoutId);
    };

    return (
        <>
            <form className="mx-auto">
                <ul className="items-center mb-4 w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                        <div className="flex items-center ps-3">
                            <input
                                id="horizontal-list-radio-license"
                                type="radio"
                                value="posts"
                                checked={filter === "posts"}
                                onChange={handleFilterChange}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                            />
                            <label htmlFor="horizontal-list-radio-license"
                                   className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                Publication
                            </label>
                        </div>
                    </li>
                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                        <div className="flex items-center ps-3">
                            <input
                                id="horizontal-list-radio-id"
                                type="radio"
                                value="users"
                                checked={filter === "users"}
                                onChange={handleFilterChange}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                            />
                            <label htmlFor="horizontal-list-radio-id"
                                   className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                People
                            </label>
                        </div>
                    </li>
                </ul>

                <label htmlFor="default-search"
                       className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <SearchIcon className="w-4 h-4 text-gray-500 dark:text-gray-400"/>
                    </div>
                    <Controller
                        name="search"
                        control={control}
                        defaultValue=""
                        render={({field}) => (
                            <input
                                id="default-search"
                                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                {...field}
                                type="text"
                                placeholder="Search..."
                                onChange={(e) => {
                                    field.onChange(e);
                                    handleSearchChange(e);
                                }}
                            />
                        )}
                    />
                </div>
            </form>
            {errors.root && <span>{errors.root.message}</span>}
            {resultsPosts.length > 0 && (
               <PostsList posts={resultsPosts} />
            )}

            {resultsUser.length > 0 && (
                <div className="py-5 sm:py-6">
                    <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-20 px-6 lg:px-8 xl:grid-cols-3">
                        <ul role="list" className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">
                            {resultsUser.map((user) => (
                                <li key={user.id}>
                                    <div className="flex items-center gap-x-6">
                                        {user.profile.avatar_url ? (
                                            <Image
                                                src={user.profile.avatar_url}
                                                width={50}
                                                height={50}
                                                className="h-12 w-12 rounded-full"
                                                alt={user.username}
                                            />
                                        ) : (
                                            <PostsIcon className="h-16 w-16 rounded-full"/>
                                        )}
                                        <div>
                                            <h3 className="text-base text-white font-semibold leading-7 tracking-tight">
                                                {user.username}
                                            </h3>
                                            <p className="text-sm font-semibold leading-6 text-indigo-600">
                                                {user.first_name} {user.last_name}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </>
    )
};

export default SearchComponent;