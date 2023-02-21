export default class Utils {
    /**
     * 参数是否存在
     * @param param 任意参数
     */
    static isExist = <T>(param: T): param is NonNullable<T> => {
        return param !== undefined && param !== null
    }

    /**
     * 参数是否不存在
     * @param param 任意参数
     */
    static isNotExist = (param: any): boolean => {
        return param === undefined || param === null
    }

    /**
     * 是否是函数
     * @param param 任意参数
     */
    static isFunction = (param: any): param is Function => {
        return Object.prototype.toString.call(param) === '[object Function]'
    }

    /**
    * 空函数
    */
    static emptyFunc = () => { }

    /**
     * 随机id
     */
    static getUuid = () => {
        let s: string[] = [];
        const hexDigits = '0123456789abcdef';
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
        // @ts-ignore
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = '-';

        return s.join('').split('-').join('');
    }
}