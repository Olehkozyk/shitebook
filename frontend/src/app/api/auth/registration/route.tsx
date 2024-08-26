import {NextResponse} from "next/server";

export async function POST(request: Request) {
    try {
        const data = await request.json()
        if(!data.email || !data.password) throw new Error('Email or password is missing');
        let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/register/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
            body: JSON.stringify({
                username: data.username,
                password: data.password,
                repeat_password: data.repeatPassword,
                email: data.email,
            }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            const errorMessages = [];
            for (const [field, messages] of Object.entries(errorData.errors)) {
                for (const message of messages) {
                    errorMessages.push(`${message}`);
                }
            }
            throw new Error(errorMessages.join(', '));
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
