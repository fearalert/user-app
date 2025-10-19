import Cookies from 'js-cookie';

const COOKIE_OPTIONS = {
  expires: 7,
  secure: true,
  sameSite: 'none' as const,
};

export const read = (key: string): string | undefined => {
  try {
    return Cookies.get(key);
  } catch (err: unknown) {
    console.error(`Failed to read cookie "${key}":`, err);
    return undefined;
  }
};

export const write = (key: string, value: string): void => {
  try {
    Cookies.set(key, value, COOKIE_OPTIONS);
  } catch (err: unknown) {
    console.error(`Failed to write cookie "${key}":`, err);
  }
};

export const remove = (key: string): void => {
  try {
    Cookies.remove(key, COOKIE_OPTIONS);
  } catch (err: unknown) {
    console.error(`Failed to remove cookie "${key}":`, err);
  }
};
