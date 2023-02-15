export default class Utils {
    /**
     * @param param 任意参数
     * @return 参数是否存在
     */
    static isExist = (param: any) => {
        return param !== undefined && param !== null
    }
}