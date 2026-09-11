import type { Actor, Assignment, Decision } from '../types/domain.js';
import { OWNER_ONLY } from '../types/domain.js';

/** Explicit deny wins; manager resources require an assignment even if role allows. */
export function decide(actor: Actor, permission: string, roleRules: Record<string, Decision>, assignment?: Assignment): Decision {
 if (actor.role === 'owner') return 'allow';
 if (OWNER_ONLY.has(permission)) return 'deny';
 const values = [roleRules[permission], assignment?.permissions[permission]].filter(Boolean) as Decision[];
 if (values.includes('deny')) return 'deny';
 if (actor.role === 'manager' && !assignment) return 'deny';
 if (values.includes('approval_required')) return 'approval_required';
 return values.includes('allow') ? 'allow' : 'deny';
}
export function assertAssignment(actor: Actor, serverId: string, assignments: Assignment[]) {
 if (actor.role === 'owner' || actor.role === 'admin') return;
 if (!assignments.some(a => a.serverId === serverId)) throw Object.assign(new Error('Server is not assigned to this manager'), { statusCode: 403 });
}
