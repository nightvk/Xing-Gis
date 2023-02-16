export default class Utils {
    /**
     * 参数是否存在
     * @param param 任意参数
     */
    static isExist = <T>(param: T): param is NonNullable<T> => {
        return param !== undefined && param !== null
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
}