/**
 * A class for reading, writing, and deleting cookies.
 * // Example usage:
 * // CookieStorage
 * //   .write("key", "value", 1)
 * //   .read("key")
 * //   .delete("key")
 */
export class CookieStorage {
    /**
     * Reads the value of a cookie by its key.
     *
     * @param key - The name of the cookie to read.
     * @returns The value of the cookie if found, otherwise an empty string.
     */
    static read(key: string): any {
        return document.cookie.split('; ').reduce((r, v) => {
            const parts = v.split('=')
            return parts[0] === key ? decodeURIComponent(parts[1]) : r
        }, '')
    }
    /**
     * Writes a cookie with the specified key, value, and expiration days.
     *
     * @param key - The name of the cookie.
     * @param value - The value to be stored in the cookie.
     * @param days - The number of days until the cookie expires. Defaults to 1 day.
     * @param path - The path within the site for which the cookie is valid. Defaults to '/'.
     * @param _httpOnly - Indicates whether the cookie is HTTP only. Defaults to false.
     */
    static write(key: string, value: any, days: number = 1, path = '/', _httpOnly=false) {
        const expires = new Date(Date.now() + days * 864e5).toUTCString()
        document.cookie = key + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=' + path
    }
    /**
     * Deletes a cookie by setting its value to an empty string and its expiration date to a past date.
     *
     * @param key - The name of the cookie to delete.
     * @param path - The path of the cookie to delete. Defaults to '/'.
     */
    static delete(key: string, path: string = '/') {
        this.write(key, '', -1, path)
    }
    /**
     * Clears all cookies by setting their expiration date to a past date.
     * 
     * @param path - The path for which the cookies should be cleared. Defaults to '/'.
     */
    static clear(path: string = '/') {
        document.cookie.split('; ').forEach((x: any) => {
            const key = x.split('=')[0];
            this.write(key, '', -1, path)
        })
    }
}

export default CookieStorage;

