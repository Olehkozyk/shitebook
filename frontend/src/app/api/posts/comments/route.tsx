import {NextResponse} from "next/server";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const token = url.searchParams.get('token');
        const ipPost = url.searchParams.get('postId');
        if (!token) throw new Error('Token is missing')
        if (!ipPost) throw new Error('Id post is missing')

        let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${ipPost}/comments/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        response = await response.json();
        if (!response) throw new Error('Failed to fetch data')
        return NextResponse.json({
            status: true,
            data: response
        });
    } catch (error) {
        return NextResponse.json({
            status: false,
            message: error.message,
        });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        if (!data.token) throw new Error('Token is missing');
        if (!data.postId) throw new Error('Post id is missing');
        if (!data.comment) throw new Error('Comment id is missing');
        let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/comment/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.token}`
            },
            body: JSON.stringify({
                post: data.postId,
                content: data.comment
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
