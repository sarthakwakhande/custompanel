import { db } from './db/pool.js'; import { hashPassword } from './auth/session.js';
const [, , command,email,username,password,confirmation]=process.argv;
if(command!=='owner:create'||!email||!username||!password||!confirmation)throw new Error('Usage: npm run owner:create -- <email> <username> <password> <password-confirmation>');
if(password!==confirmation)throw new Error('Passwords do not match');
const [owners]=await db.query<any[]>('SELECT users.id FROM users JOIN roles ON roles.id=users.role_id WHERE roles.name="owner" LIMIT 1');if(owners.length)throw new Error('An Owner already exists; refusing to create another bootstrap Owner.');
const [roles]=await db.query<any[]>('SELECT id FROM roles WHERE name="owner"');if(!roles[0])throw new Error('Roles are missing; run npm run db:migrate first.');await db.execute('INSERT INTO users(email,username,password_hash,role_id) VALUES(?,?,?,?)',[email.toLowerCase(),username,await hashPassword(password),roles[0].id]);await db.end();console.log('Owner account created.');
