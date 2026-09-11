import { z } from 'zod';
const placeholder = /replace_me|replace-with|base64-encoded|panel\.example\.com|change-me/i;
const schema=z.object({
 NODE_ENV:z.enum(['development','test','production']).default('production'), HOST:z.string().default('127.0.0.1'), PORT:z.coerce.number().int().min(1).max(65535).default(7799),
 DATABASE_URL:z.string().url().refine(v=>v.startsWith('mysql://'), 'must use mysql://'), SESSION_SECRET:z.string().min(32),
 ENCRYPTION_KEY:z.string().transform(v=>Buffer.from(v,'base64')).refine(v=>v.length===32,'must decode to exactly 32 bytes'),
 PTERODACTYL_URL:z.string().url().refine(v=>new URL(v).protocol==='https:','must use HTTPS'), PTERODACTYL_APPLICATION_KEY:z.string().min(12), PTERODACTYL_CLIENT_KEY:z.string().min(12)
});
export type Config=z.infer<typeof schema>;
export function loadConfig():Config { const values=schema.parse(process.env); if(values.NODE_ENV==='production') for(const [key,value] of Object.entries(process.env)) if(/SECRET|KEY|PTERODACTYL_URL/.test(key)&&placeholder.test(value||'')) throw new Error(`Invalid production configuration: ${key} still contains a placeholder`); return values; }
