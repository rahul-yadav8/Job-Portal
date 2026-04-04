/**
 * A utility class for interacting with the browser's session storage.
 * Provides methods to read, write, delete, and clear items in session storage.
 */
export class SessionStorage {
    /**
     * Reads a value from the session storage by the given key.
     * 
     * @param key - The key of the item to retrieve from session storage.
     * @returns The parsed value from session storage if it exists and is valid JSON, 
     *          otherwise returns the raw value or null if the key does not exist.
     */
    static read(key: string): any {
        const value = sessionStorage.getItem(key) || null
        try {
            if (value)
                return JSON.parse(value)
            return value
        } catch (e) {
            return value;
        }
    }
    /**
     * Writes a value to the session storage under the specified key.
     * If the value is a string, it is stored directly.
     * Otherwise, the value is stringified to JSON before storing.
     *
     * @param key - The key under which the value will be stored.
     * @param value - The value to be stored. Can be of any type.
     */
    static write(key: string, value: any) {
        if (typeof value === "string") {
            sessionStorage.setItem(key, value)
        } else {
            sessionStorage.setItem(key, JSON.stringify(value))
        }
    }
    /**
     * Deletes an item from the session storage.
     *
     * @param key - The key of the item to be removed from the session storage.
     */
    static delete(key: string) {
        sessionStorage.removeItem(key);
    }
    /**
     * Clears all data stored in the session storage.
     */
    static clear() {
        sessionStorage.clear();
    }
}

export default SessionStorage;