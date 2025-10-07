const KEY = "founder_session";
export const getToken = () => (typeof window !== "undefined" ? sessionStorage.getItem(KEY) : null);
export const setToken = (t: string) => sessionStorage.setItem(KEY, t);
export const clearToken = () => sessionStorage.removeItem(KEY);
export const isAuthed = () => !!getToken();
