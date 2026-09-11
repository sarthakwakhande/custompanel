import crypto from 'node:crypto'; import { promisify } from 'node:util'; import { db } from '../db/pool.js';
const scrypt=promisify(crypto.scrypt);
export async function hashPassword(p:string) { const salt=crypto.randomBytes(16).toString('base64'); return `scrypt$${salt}$${(await scrypt(p,salt,64) as Buffer).toString('base64')}`; }
export async function verifyPassword(p:string, stored:string) { const [,salt,hash]=stored.split('$'); return crypto.timingSafeEqual(Buffer.from(hash,'base64'),await scrypt(p,salt,64) as Buffer); }
export async function createSession(userId:number) { const id=crypto.randomBytes(32).toString('hex'), csrf=crypto.randomBytes(32).toString('hex'); await db.execute('INSERT INTO sessions(id,user_id,csrf_token,expires_at) VALUES(?,?,?,DATE_ADD(NOW(),INTERVAL 12 HOUR))',[id,userId,csrf]); return {id,csrf}; }
export async function currentSession(id?:string) { if(!id)return null; const [r]=await db.query<any[]>('SELECT s.csrf_token,u.id,u.email,roles.name AS role FROM sessions s JOIN users u ON u.id=s.user_id JOIN roles ON roles.id=u.role_id WHERE s.id=? AND s.expires_at>NOW() AND u.suspended=0',[id]); return r[0]||null; }
