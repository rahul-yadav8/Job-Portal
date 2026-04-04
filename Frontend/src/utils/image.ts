/**
 * @author Ramachandran Gunasekeran
 * @email ramachandrangunasekeran@gmail.com
 * @create date 2019-11-13 16:00:14
 * @modify date 2019-11-13 16:00:14
 * @desc [description]
 */

export const getFileType = (file: File) => file.type;

export const fileLimitCheck = (file: File, maxSizeInMb: number) => {
    return new Promise((resolve, reject) => {
        const isType = file.size / 1024 / 1024 <= maxSizeInMb;
        if (!isType) {
            reject('Image must smaller than 5MB!');
        }
        resolve(true);
    });
};


export const toBase64 = (file: File) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
});
