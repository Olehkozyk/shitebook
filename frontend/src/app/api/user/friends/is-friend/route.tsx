import {NextResponse} from "next/server";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const token = url.searchParams.get('token') ?? '';
        const userId = url.searchParams.get('userId') ?? '';
        if (!token) throw new Error('Token is missing')
        if (!userId) throw new Error('userId is missing')
        const urlRequest = `${process.env.NEXT_PUBLIC_API_URL}/users/is-friend/?user_id=${userId}`;
        let response = await fetch(urlRequest, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        response = await response.json();
        if (!response) throw new Error('Failed to fetch data')
        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json({
            status: false,
            message: error.message,
        });
    }
}
