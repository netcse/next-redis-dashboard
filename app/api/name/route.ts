import {NextRequest, NextResponse} from 'next/server';
import {getName, saveName} from '@/services/nameService';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        await saveName(body.name);
        return NextResponse.json({message: 'Name saved'});
    } catch (err: unknown) {
        if (err instanceof Error) {
            return NextResponse.json({error: err.message || 'Error'}, {status: 400});
        }
        return NextResponse.json({error: 'Unknown error'}, {status: 400});
    }
}

export async function GET() {
    try {
        const name = await getName();
        return NextResponse.json({name});
    } catch (err: unknown) {
        if (err instanceof Error) {
            return NextResponse.json({error: err.message || 'Error'}, {status: 400});
        }
        return NextResponse.json({error: 'Unknown error'}, {status: 400});
    }
}

