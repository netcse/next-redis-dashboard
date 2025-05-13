import { NextRequest, NextResponse } from 'next/server';
import {getPaginatedUsers, saveUserToDB} from '@/services/userService';
import { User } from '@/types/user';

export async function GET(req: NextRequest) {

    try {
        const url = new URL(req.url);
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '10');

        const { usersWithId, totalUsers } = await getPaginatedUsers(page, limit);

        if (usersWithId.length === 0) {
            return NextResponse.json({ message: 'No users found' }, { status: 404 });
        }

        return NextResponse.json({ users: usersWithId, totalUsers });
    } catch (err: unknown) {
        if (err instanceof Error) {
            return NextResponse.json({ error: err.message }, { status: 400 });
        }
        return NextResponse.json({ error: 'Unknown error' }, { status: 400 });
    }
}

export async function POST(req: NextRequest) {
    try {

        const user: User = await req.json();

        await saveUserToDB(user);

        return NextResponse.json({ message: 'User saved' });
    } catch (err: unknown) {
        if (err instanceof Error) {
            return NextResponse.json({ error: err.message || 'Error' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Unknown error' }, { status: 400 });
    }
}