import {NextResponse} from "next/server";

export async function POST(request: Request) {
    try {
        const data = await request.json()
        if(!data.token) throw new Error('Token is missing');
        if(!data.userId) throw new Error('userId id is missing');
        let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/accept-friend/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.token}`
            },
            body: JSON.stringify({
                from_user_id: data.userId
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
