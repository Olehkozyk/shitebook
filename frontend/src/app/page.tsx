"use client";
import Image from 'next/image'

async function getData() {

    const res = await fetch(`http://127.0.0.1:8000/api/posts`);
    const data = await res.json();
    // You can return Date, Map, Set, etc.

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
    }
    console.log(data);

    return data
}

export default async function Page() {
    const data = await getData()

    return <main>
        <h1>Home</h1>
        <ul>
            {data.map(item =>
                <div key={item.id}>
                    <li>{item.title}</li>
                    <Image
                        width="100"
                        height="100"
                        src={item.image_url} />
                </div>
            )}
        </ul>
    </main>
}