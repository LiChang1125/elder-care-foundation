export const staticHosting = import.meta.env?.MODE === 'pages';
const base = import.meta.env?.BASE_URL || '/';
export function siteUrl(value, prefix = base) {
 if (!value?.startsWith('/') || value.startsWith('//') || (prefix !== '/' && value.startsWith(prefix))) return value;
 const match = value.match(/^([^?#]*)(.*)$/);
 const routes = ['/', '/about', '/our-work', '/impact', '/events', '/news', '/get-involved', '/contact'];
 const route = match[1];
 return prefix + route.slice(1) + (prefix !== '/' && routes.includes(route) && route !== '/' ? '/' : '') + match[2];
}
export function sitePath(pathname, prefix = base) {
 const local = prefix !== '/' && pathname.startsWith(prefix) ? '/' + pathname.slice(prefix.length) : pathname;
 return local.replace(/\/+$/, '') || '/';
}
