import {NextResponse} from "next/server";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const token = formData.get('token');
        if (!token) throw new Error('Token is missing');
        const requestData = new FormData();
        requestData.append('first_name', formData.get('firstName'));
        requestData.append('last_name', formData.get('lastName'));

        const image = formData.get('avatar');
        if (image) {
            requestData.append('avatar', image);
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile/update/`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: requestData,
        });
        if (!response.ok) {
            throw new Error('Invalid credentials');
        }

        const result = await response.json();
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({
            status: false,
            message: error.message,
        });
    }
}


