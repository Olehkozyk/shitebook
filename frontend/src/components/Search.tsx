import React, {useState} from "react";
import {useForm, SubmitHandler, Controller} from "react-hook-form";
import {useRouter} from "next/navigation";
import Cookies from 'js-cookie';
import SearchIcon from "@/public/icons-navbar/search-icon.svg";
import PostsIcon from '@/public/icons-navbar/icon-posts.svg';
import {formatDate} from "@/utils/formateDate";
import Image from "next/image";
import PostsList from "@/components/posts/PostsList";
import Link from "next/link";
import ListUsers from "@/components/user/ListUsers";

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
                    switch (filterBy) {
                        case 'posts':
                            setResultsUser([])
                            setResultsPosts(response.data.results)
                            break;
                        case 'users':
                            setResultsPosts([])
                            console.log(response.data.results, 'response.data.results')
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
                <ul className="hidden mb-4 text-sm font-medium text-center text-gray-500 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
                    <li className="w-full focus-within:z-10 cursor-pointer ">
                        <div
                            className={`flex items-center w-full text-gray-900 bg-gray-100 border-r border-gray-200 dark:border-gray-700 rounded-s-lg focus:ring-4 focus:outline-none focus:ring-blue-300 dark:hover:text-white dark:bg-gray-${filter === "posts" ? '700' : '800'} dark:hover:bg-gray-700`}
                            aria-current="page">
                            <input
                                id="horizontal-list-radio-license"
                                type="radio"
                                value="posts"
                                checked={filter === "posts"}
                                onChange={handleFilterChange}
                                className="hidden"
                            />
                            <label htmlFor="horizontal-list-radio-license"
                                   className="p-4 ms-2 text-sm font-medium cursor-pointer text-gray-900 dark:text-gray-300 w-full block">
                                Publication
                            </label>
                        </div>
                    </li>
                    <li className="w-full focus-within:z-10 cursor-pointer">
                        <div
                            className={`flex items-center w-full text-gray-900 bg-gray-100 border-r border-gray-200 dark:border-gray-700 rounded-e-lg focus:ring-4 focus:outline-none focus:ring-blue-300 dark:hover:text-white dark:bg-gray-${filter === "users" ? '700' : '800'} dark:hover:bg-gray-700`}
                            aria-current="page">
                            <input
                                id="horizontal-list-radio-id"
                                type="radio"
                                value="users"
                                checked={filter === "users"}
                                onChange={handleFilterChange}
                                className="hidden"
                            />
                            <label htmlFor="horizontal-list-radio-id"
                                   className="p-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 w-full block cursor-pointer">
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
            {resultsPosts.length > 0 && (<PostsList posts={resultsPosts}/>)}
            {resultsUser.length > 0 && (<ListUsers users={resultsUser}/>)}
        </>
    )
};

export default SearchComponent;