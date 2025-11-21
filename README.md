# Readability Worker

A Cloudflare Worker that converts a web page to Markdown.

## Usage

### Development

```bash
pnpm install
pnpm run dev
```

### Deployment

```bash
pnpm run deploy
```

### API

**GET** `/?url=<target_url>`

#### Example

```bash
curl "http://localhost:8787/?url=https://example.com"
```
