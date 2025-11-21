
import { Readability } from '@mozilla/readability';
import { parseHTML } from 'linkedom';
import { NodeHtmlMarkdown } from 'node-html-markdown';

/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		const targetUrl = url.searchParams.get('url');

		if (!targetUrl) {
			return new Response('Missing url query parameter', { status: 400 });
		}

		try {
			const response = await fetch(targetUrl, {
				headers: {
					'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
				}
			});

			if (!response.ok) {
				return new Response(`Failed to fetch URL: ${response.status} ${response.statusText}`, { status: 502 });
			}

			const html = await response.text();
			const { document } = parseHTML(html);

			const reader = new Readability(document);
			const article = reader.parse();

			if (!article || !article.content) {
				return new Response('Failed to parse article', { status: 500 });
			}

			const markdown = NodeHtmlMarkdown.translate(article.content);

			return new Response(markdown, {
				headers: {
					'Content-Type': 'text/markdown; charset=utf-8',
				},
			});
		} catch (error) {
			return new Response(`Error processing request: ${error instanceof Error ? error.message : String(error)}`, { status: 500 });
		}
	},
} satisfies ExportedHandler<Env>;
