export type Role = 'owner' | 'admin' | 'manager';
export type Decision = 'allow' | 'deny' | 'approval_required';
export interface Actor { id: number; role: Role; email: string; }
export interface Assignment { serverId: string; permissions: Record<string, Decision>; }
export const OWNER_ONLY = new Set(['approval.review','settings.manage','api.configure','audit.view','role.manage','assignment.manage']);
export const PERMISSIONS = [
 'server.view','server.create','server.update','server.suspend','server.unsuspend','server.reinstall','server.transfer','server.delete',
 'console.view','console.command','console.start','console.stop','console.restart','console.kill',
 'files.view','files.read','files.write','files.upload','files.rename','files.move','files.delete','files.archive','files.extract','files.download',
 'backup.view','backup.create','backup.download','backup.restore','backup.delete',
 'database.view','database.create','database.update','database.rotate_password','database.delete',
 'startup.view','startup.update','resource.view','resource.update','schedule.view','schedule.create','schedule.update','schedule.delete','schedule.execute',
 'allocation.view','allocation.create','allocation.update','allocation.delete','user.view','user.create','user.update','user.suspend','user.unsuspend','user.delete',
 'node.view','node.create','node.update','node.delete','node.maintenance','audit.view','approval.review','assignment.manage','role.manage','settings.manage','api.configure'
] as const;
