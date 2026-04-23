# Crafterkite Project Rules

## Core Principles
- Always prioritize clean architecture and scalability.
- Multi-tenancy is non-negotiable — every data operation must be scoped to `org_id`.
- Code must be TypeScript strict mode with proper types.
- Use shadcn/ui components whenever possible for consistency.
- All forms must use React Hook Form + Zod.

## Design & Typography (Strict Rules)
- **Main Font**: **Plus Jakarta Sans** (Google Font)
- Font weights to use: 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold)
- Headings and body text must use `font-sans` with Plus Jakarta Sans as primary
- Fallback stack: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- Maintain excellent readability and modern SaaS feel

## Tech Decisions (Never Deviate)
- IDs: CUID2
- Auth: JWT + refresh token rotation
- File uploads: Uppy + S3 presigned URLs
- Rich text: TipTap 2
- Queue: BullMQ + Redis
- AI: OpenAI GPT-4o with streaming
- Styling: Tailwind + shadcn/ui only

## UI/UX Rules
- Dark mode by default
- Professional, calm, creative aesthetic
- Primary font: **Plus Jakarta Sans**
- Excellent mobile responsiveness
- Loading skeletons + beautiful empty states
- Toast notifications for feedback

## Security & Best Practices
- Never trust client input
- Rate limiting on all endpoints
- Proper error handling

When making changes, always follow these rules unless explicitly told otherwise.