import { json } from '@sveltejs/kit';

export async function GET({ fetch, request }) {
    return json({ name: '이씨' });
}

export async function POST({ fetch, request }) {
    return json({ name: '박씨' });
}
