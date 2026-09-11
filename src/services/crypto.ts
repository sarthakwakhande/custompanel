import crypto from 'node:crypto';
const key = () => Buffer.from(process.env.ENCRYPTION_KEY || '', 'base64');
export function encrypt(value: string) { const iv=crypto.randomBytes(12), cipher=crypto.createCipheriv('aes-256-gcm', key(), iv); return Buffer.concat([iv,cipher.update(value,'utf8'),cipher.final(),cipher.getAuthTag()]).toString('base64'); }
export function decrypt(value: string) { const raw=Buffer.from(value,'base64'), iv=raw.subarray(0,12), tag=raw.subarray(raw.length-16), cipher=crypto.createDecipheriv('aes-256-gcm',key(),iv); cipher.setAuthTag(tag); return Buffer.concat([cipher.update(raw.subarray(12,-16)),cipher.final()]).toString('utf8'); }
