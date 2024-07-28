import {NextResponse} from "next/server";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const token = url.searchParams.get('token');
        if (!token) throw new Error('Token is missing')
        let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/`, {
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
