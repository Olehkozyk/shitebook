import {NextResponse} from "next/server";

export async function POST(request: Request) {
    try {
        const data = await request.json()
        if(!data.login || !data.password) throw new Error('Login or password is missing');
        let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
            body: JSON.stringify({ ...data }),
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
