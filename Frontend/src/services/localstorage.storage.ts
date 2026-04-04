/**
 * A utility class for interacting with the browser's local storage.
 * Provides methods to read, write, delete, and clear key-value pairs in local storage.
 */
export class LocalStorage {

    /**
     * Reads a value from the local storage by the given key.
     * 
     * @param {string} key - The key of the item to retrieve from local storage.
     * @returns {any} The parsed value from local storage if it exists and is valid JSON, 
     *                otherwise returns the raw value or null if the key does not exist.
     */
    static read(key: string): any {
        const value = localStorage.getItem(key) || null
        try {
            if (value)
                return JSON.parse(value)
            return value
        } catch (e) {
            return value;
        }
    }
    /**
     * Writes a value to the local storage under the specified key.
     * If the value is a string, it is stored directly.
     * Otherwise, the value is serialized to a JSON string before storing.
     *
     * @param key - The key under which the value will be stored.
     * @param value - The value to be stored. Can be of any type.
     */
    static write(key: string, value: any) {
        if (typeof value === "string") {
            localStorage.setItem(key, value)
        } else {
            localStorage.setItem(key, JSON.stringify(value))
        }
    }
    /**
     * Deletes an item from the local storage.
     *
     * @param key - The key of the item to be removed from local storage.
     */
    static delete(key: string) {
        localStorage.removeItem(key);
    }
    /**
     * Clears all key-value pairs from the local storage.
     */
    static clear() {
        localStorage.clear();
    }
}

export default LocalStorage;