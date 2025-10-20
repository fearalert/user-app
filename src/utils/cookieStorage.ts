/** @format */
import Cookies from 'js-cookie';

const COOKIE_OPTIONS = {
  expires: 7,
  secure: true,
  sameSite: 'None' as const,
};

/**
 * Read a cookie safely with default value
 */
export const read = <T = any>(key: string, defaultValue: T): T => {
  try {
    const value = Cookies.get(key);
    if (!value) return defaultValue;

    // Check if value is JSON (array/object)
    const firstChar = value[0];
    if (firstChar === '{' || firstChar === '[') {
      try {
        return JSON.parse(value) as T;
      } catch (err) {
        console.warn(`Failed to parse cookie "${key}" as JSON`, err);
        return defaultValue;
      }
    }

    // Return primitive string/number value
    return value as unknown as T;
  } catch (err) {
    console.error(`Failed to read cookie "${key}":`, err);
    return defaultValue;
  }
};

/**
 * Write a cookie
 */
export const write = (key: string, value: any): void => {
  try {
    const storedValue =
      typeof value === 'string' ? value : JSON.stringify(value);
    Cookies.set(key, storedValue, COOKIE_OPTIONS);
  } catch (err) {
    console.error(`Failed to write cookie "${key}":`, err);
  }
};

/**
 * Remove a cookie
 */
export const remove = (key: string): void => {
  try {
    Cookies.remove(key, COOKIE_OPTIONS);
  } catch (err) {
    console.error(`Failed to remove cookie "${key}":`, err);
  }
};
