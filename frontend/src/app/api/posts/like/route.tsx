import {NextResponse} from "next/server";

export async function POST(request: Request) {
    try {
        const data = await request.json()
        console.log(data)
        if(!data.token) throw new Error('Token is missing');
        if(!data.postId) throw new Error('Post id is missing');
        let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${data.postId}/like/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.token}`
            },
            body: JSON.stringify({
                post_id: data.post_id
            }),
        });
        if (!response.ok) {
            throw new Error('Invalid credentials');
        }
        response = await response.json();
        return NextResponse.json(response)
    } catch (error) {
        return NextResponse.json({
            status: false,
            message: error.message,
        });
    }
}
