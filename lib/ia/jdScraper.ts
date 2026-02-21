import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ScrapedJD {
    title: string;
    content: string;
    sourceUrl: string;
}

export class JDScraper {
    private static userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ];

    private static getRandomUserAgent() {
        return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
    }

    async scrape(url: string): Promise<ScrapedJD> {
        try {
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': JDScraper.getRandomUserAgent(),
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9,es;q=0.8',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                },
                timeout: 10000,
                validateStatus: (status) => (status >= 200 && status < 300) || status === 410
            });

            const $ = cheerio.load(response.data);

            // Verificar si el job está inactivo (específico para Teamtailor y otros comunes)
            const inactiveText = $('body').text().toLowerCase();
            const isInactive = inactiveText.includes('la oferta de empleo ya no está activa') ||
                inactiveText.includes('job is no longer active') ||
                inactiveText.includes('trabajo ya ha sido asignado');

            if (isInactive && response.status === 410) {
                // Si está inactivo y es 410, es una confirmación de que no hay JD
                throw new Error("Esta oferta de empleo ya no está activa.");
            }

            // Eliminar elementos ruidosos
            $('script, style, nav, footer, header, noscript, iframe, .sidebar, .ads, #disqus_thread').remove();

            const title = $('title').text().trim() || 'Job Description';

            // Capturar el cuerpo del texto de manera inteligente
            // Priorizar contenedores comunes de JD
            const selectors = [
                'article',
                '[class*="job-description"]',
                '[id*="job-description"]',
                '.description',
                'main',
                'body'
            ];

            let rawContent = '';
            for (const selector of selectors) {
                const el = $(selector);
                if (el.length > 0) {
                    rawContent = el.text().trim();
                    if (rawContent.length > 200) break; // Si encontramos algo sustancial, paramos
                }
            }

            // Limpieza básica de espacios en blanco
            const cleanContent = rawContent
                .replace(/\n\s*\n/g, '\n\n')
                .replace(/[ \t]+/g, ' ')
                .trim();

            if (cleanContent.length < 50) {
                if (isInactive) {
                    throw new Error("La oferta de empleo ya no está activa.");
                }
                throw new Error("No se pudo extraer contenido suficiente de la URL.");
            }

            return {
                title,
                content: cleanContent,
                sourceUrl: url
            };
        } catch (error: any) {
            console.error('Error scraping JD:', error.message);
            // Si es un error personalizado nuestro, lo propagamos tal cual
            if (error.message === "Esta oferta de empleo ya no está activa." ||
                error.message === "La oferta de empleo ya no está activa." ||
                error.message === "No se pudo extraer contenido suficiente de la URL.") {
                throw error;
            }
            throw new Error(`Error al acceder a la URL: ${error.message}`);
        }
    }
}

export const jdScraper = new JDScraper();
