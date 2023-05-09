// 指定长度和基数
export function getUuid(len: number, radix: number) {
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    let uuid = [],
        i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        let r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('');
}


//  转换文件大小
export const getFileSize = (size: any) => {
    let sizeCache = parseInt(size);
    let currentSize = "0B"
    if (sizeCache == 0) {
        currentSize = "0B";
    } else if (sizeCache < 1024) {
        currentSize = sizeCache + "B";
    } else if (sizeCache < 1048576) {
        currentSize = (sizeCache / 1024).toFixed(2) + "KB";
    } else if (sizeCache < 1073741824) {
        currentSize = (sizeCache / 1048576).toFixed(2) + "MB";
    } else {
        currentSize = (sizeCache / 1073741824).toFixed(2) + "GB";
    }
    return currentSize
}
