import { NextRequest, NextResponse } from 'next/server';
import { saveUserToRedis, getUserBySlug } from '@/services/userService';
import { User } from '@/types/user';

export async function POST(req: NextRequest, context: { params: { slug: string } }) {
    try {
        const { slug } = context.params;
        const user: User = await req.json();

        await saveUserToRedis(slug, user);

        return NextResponse.json({ message: 'User saved' });
    } catch (err: unknown) {
        if (err instanceof Error) {
            return NextResponse.json({ error: err.message || 'Error' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Unknown error' }, { status: 400 });
    }
}

export async function GET(
    _req: NextRequest,
    context: { params: { slug: string } }
) {
    try {
        const { slug } = context.params;

        const user = await getUserBySlug(slug);

        if (!user || Object.keys(user).length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (err: unknown) {
        if (err instanceof Error) {
            return NextResponse.json({ error: err.message || 'Error' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Unknown error' }, { status: 400 });
    }
}
