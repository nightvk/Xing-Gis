
/**
 * @desc 地图计算辅助工具类
 */
export default abstract class AuxiliaryUtils {
    /**
     * @desc 将经纬度转化为度数
     */
    static transformLonLat = (type: 'lon' | 'lat', value: number) => {
        let degree = parseInt(value.toString());
        let min = parseInt(((Number(value) - degree) * 60).toString());
        let sec = parseInt(((Number(value) - degree) * 3600 - min * 60).toString())
        let direction = '';
        if (type === 'lon') {
            direction = degree < 0 ? 'W' : 'E';
        } else {
            direction = degree < 0 ? 'S' : 'N';
        }
        return `${Math.abs(degree)}°${Math.abs(min) < 10 ? '0' + min : Math.abs(min)}′${Math.abs(sec) < 10 ? '0' + sec : Math.abs(sec)}″ ${direction} `;
    }

}