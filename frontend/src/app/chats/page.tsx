async function getData() {

    const res = await fetch(`http://127.0.0.1:8000/api/chats/create`, {
      method: 'POST',
      body: JSON.stringify({
          user1: 1,
          user2: 2,
      }),
    });
    const data = await res.json();
    // You can return Date, Map, Set, etc.

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
    }

    return data
}

export default async function Page() {
    const data = await getData()
  console.log(data);
    return <>
        <h1>Chats</h1>
    </>
}