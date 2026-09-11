import { db } from './db/pool.js'; import { hashPassword } from './auth/session.js';
if(process.argv[2]!=='owner:create'||!process.argv[3]||!process.argv[4]) throw new Error('Usage: npm run owner:create -- <email> <password>');
const [roles]=await db.query<any[]>('SELECT id FROM roles WHERE name="owner"'); await db.execute('INSERT INTO users(email,username,password_hash,role_id) VALUES(?,?,?,?)',[process.argv[3],process.argv[3].split('@')[0],await hashPassword(process.argv[4]),roles[0].id]); await db.end(); console.log('Owner created');
