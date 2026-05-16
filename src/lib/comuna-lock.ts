const KEY = "sanadores.comuna";

export const getLockedComuna = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
};

export const setLockedComuna = (slug: string) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, slug);
  } catch {
    /* ignore */
  }
};