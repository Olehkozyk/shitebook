import {NextResponse} from "next/server";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const token = formData.get('token');
        if (!token) throw new Error('Token is missing');
        const requestData = new FormData();
        requestData.append('title', formData.get('title'));
        requestData.append('description', formData.get('description'));

        const image = formData.get('image');
        if (image) {
            requestData.append('image', image);
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/create/`, {
            method: 'POST',
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


