import {NextResponse} from "next/server";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const search = url.searchParams.get('search') ?? '';
        const token = url.searchParams.get('token') ?? '';
        const urlRequest = `${process.env.NEXT_PUBLIC_API_URL}/users/list/${search ? `?search=${search}` : ''}`;
        if (!token) throw new Error('Token is missing')
        let response = await fetch(urlRequest, {
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
