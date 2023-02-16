export default class Utils {
    /**
     * @param param 任意参数
     * @return 参数是否存在
     */
    static isExist = <T>(param: T): param is NonNullable<T> => {
        return param !== undefined && param !== null
    }
}