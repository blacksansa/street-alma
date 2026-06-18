// ⚠️ AUTENTICAÇÃO HARDCODED — apenas para demo/protótipo.
// Em produção, troque por Supabase Auth ou outro provedor real.
export const HARDCODED_USER = 'magno';
export const HARDCODED_PASS = '123';

export function setAuthCookie() {
  // cookie simples válido por 7 dias
  const dias = 7;
  const expira = new Date();
  expira.setDate(expira.getDate() + dias);
  document.cookie = `sa_auth=ok; expires=${expira.toUTCString()}; path=/; SameSite=Lax`;
}

export function clearAuthCookie() {
  document.cookie = 'sa_auth=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
}
