export const ROLES = ['admin', 'tecnico', 'cliente'];

export const ROLE_LABELS = {
  admin: 'Administrador',
  tecnico: 'Técnico',
  cliente: 'Cliente',
};

export function getUserRole(user) {
  return user?.user_metadata?.role || 'admin';
}
