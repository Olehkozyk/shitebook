"use client";
import SearchComponent from "@/components/Search";

export default function Search() {
    return <>
        <div className="p-4 sm:ml-64">
            <div className="p-4 border-2 border-gray-200 rounded-lg dark:border-gray-700">
                <SearchComponent />
            </div>
        </div>
    </>
}