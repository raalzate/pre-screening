import { NextResponse } from 'next/server';
import { jdScraper } from '@/lib/ia/jdScraper';
import { RateLimitError, UnauthorizedError } from '@/lib/ia/baseGenerator';
import { getServerSession } from 'next-auth';
// Import authOptions if needed or check session directly

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { url, text } = body;

        if (!url && !text) {
            return NextResponse.json({ error: 'Debes proporcionar una URL o texto de descripción.' }, { status: 400 });
        }

        if (url) {
            const result = await jdScraper.scrape(url);
            return NextResponse.json(result);
        }

        return NextResponse.json({ content: text });
    } catch (error: any) {
        console.error('Error in JD Extract:', error);

        if (error.message === "Esta oferta de empleo ya no está activa." ||
            error.message === "La oferta de empleo ya no está activa.") {
            return NextResponse.json({ error: error.message }, { status: 410 });
        }

        return NextResponse.json({ error: error.message || 'Error al procesar el Job Description' }, { status: 500 });
    }
}
