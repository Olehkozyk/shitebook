export default async function Home() {
    const res = await fetch(`http://127.0.0.1:8000/api/posts`)
    const data = await res.json()
    return (
        <>
            <h1>Home</h1>
            <ul>
                {data.map(item =>
                    <div key={item.id}>
                        <li>{item.title}</li>
                    </div>
                )}
            </ul>
        </>
    );
}

