import Vue from 'vue'
import http from './http'
import Exif from 'exif-js'
import { rootUrl } from '@/utils/http'
export const Bus = new Vue();
export const UNAUTHORIZATION = 'UNAUTHORIZATION';
export const Countries = ["中国", "阿尔巴尼亚", "阿尔及利亚", "阿富汗", "阿根廷", "阿鲁巴", "阿曼", "阿塞拜疆", "阿闻酋", "埃及", "埃塞俄比亚", "爱尔兰", "爱沙尼亚", "安道尔", "安哥拉", "安圭拉", "安提瓜和巴布达", "奥地利", "澳大利亚", "巴巴多斯", "巴布亚新几内亚", "巴哈马", "巴基斯坦", "巴拉圭", "巴勒斯坦", "巴林", "巴拿马", "巴西", "白俄罗斯", "百慕大", "保加利亚", "北马里亚纳", "贝劳", "贝宁", "比利时", "冰岛", "波多黎各", "波兰", "波斯尼亚和黑塞哥维那", "玻利维亚", "伯利兹", "博茨瓦纳", "不丹", "布基纳法索", "布隆迪", "布维岛", "朝鲜", "赤道几内亚", "丹麦", "德国", "东帝汶", "多哥", "多米尼加共和国", "多米尼克", "俄罗斯", "厄瓜多尔", "厄立特里亚", "法国", "法罗群岛", "法属波利尼西亚", "法属圭亚那", "法属南部领土", "梵蒂冈", "菲律宾", "斐济", "芬兰", "佛得角", "冈比亚", "刚果", "哥伦比亚", "哥斯达黎加", "格林纳达", "格陵兰", "格鲁吉亚", "古巴", "瓜德罗普", "关岛", "圭亚那", "哈萨克斯坦", "海地", "韩国", "荷兰", "荷属安的列斯", "赫德岛和麦克唐纳岛", "洪都拉斯", "基里巴斯", "吉布提", "吉尔吉斯斯坦", "几内亚", "几内亚比绍", "加拿大", "加纳", "加蓬", "柬埔寨", "捷克", "津巴布韦", "喀麦隆", "卡塔尔", "开曼群岛", "科科斯(基林)群岛", "科摩罗", "科特迪瓦", "科威特", "克罗地亚", "肯尼亚", "库克群岛", "拉脱维亚", "莱索托", "老挝", "黎巴嫩", "立陶宛", "利比里亚", "利比亚", "列支敦士登", "留尼汪", "卢森堡", "卢旺达", "罗马尼亚", "马达加斯加", "马尔代夫", "马尔维纳斯群岛", "马耳他", "马拉维", "马来西亚", "马里", "马绍尔群岛", "马斯顿", "马提尼克", "马约特", "毛里求斯", "毛里塔尼亚", "美国", "美属萨摩亚", "美属太平洋各群岛", "美属维尔京群岛", "蒙古", "蒙特塞拉特", "孟加拉国", "秘鲁", "密克罗尼西亚", "缅甸", "摩尔多瓦", "摩洛哥", "摩纳哥", "莫桑比克", "墨西哥", "纳米比亚", "南非", "南极洲", "南乔治亚岛和南桑德韦奇岛", "南斯拉夫", "瑙鲁", "尼泊尔", "尼加拉瓜", "尼日尔", "尼日利亚", "纽埃", "挪威", "诺福克岛", "皮特凯恩群岛", "葡萄牙", "日本", "瑞典", "瑞士", "萨尔瓦多", "塞拉利昂", "塞内加尔", "塞浦路斯", "塞舌尔", "沙竺阿拉伯", "圣诞岛", "圣多美和普林西比", "圣赫勒拿", "圣基茨和尼维斯", "圣卢西亚", "圣马力诺", "圣皮埃尔和密克隆", "圣文森特和格林纳丁斯", "斯里兰卡", "斯洛伐克", "斯洛文尼亚", "斯瓦尔巴群岛", "斯威士兰", "苏丹", "苏里南", "所罗门群岛", "索马里", "塔吉克斯坦", "泰国", "坦桑尼亚", "汤加", "特克斯科斯群岛", "特立尼达和多巴哥", "突尼斯", "图瓦卢", "土耳其", "土库曼斯坦", "托克劳", "瓦利斯和富图纳群岛", "瓦努阿图", "危地马拉", "委内瑞拉", "文莱", "乌干达", "乌克兰", "乌拉圭", "乌兹别克斯坦", "西班牙", "西撒哈拉", "西萨摩亚", "希腊", "新加坡", "新喀里多尼亚", "新西兰", "匈牙利", "叙利亚", "牙买加", "亚美尼亚", "也门", "伊拉克", "伊朗", "以色列", "意大利", "印度", "印度尼西亚", "英国", "英属维尔京群岛", "英属印度洋领土", "约旦", "越南", "赞比亚", "扎伊尔", "乍得", "直布罗陀", "智利", "中非", "中国澳门", "中国台湾", "中国香港"];

export function getFullDate(timestamp) {
    if (parseInt(timestamp) === 0) {
        return '-'
    } else {
        let date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = extra(date.getFullYear()) + '-';
        let M = extra(date.getMonth() + 1) + '-';
        let D = extra(date.getDate()) + ' ';
        let h = extra(date.getHours()) + ':';
        let m = extra(date.getMinutes()) + ':';
        let s = extra(date.getSeconds());
        return Y + M + D + h + m + s;
    }
}

//想解决什么问题过滤
export function getProblemState(val) {
    switch (parseInt(val)) {
        case 1:
            return '数据可视化';
        case 2:
            return '数据分析';
        case 3:
            return '机器替代人工';
        case 4:
            return '机器远程控制';
        case 5:
            return '智能预测预警';
        default:
            return '';
    }
}

//补位函数
function extra(x) {
    //如果传入数字小于10，数字前补一位0。
    if (x < 10) {
        return "0" + x;
    } else {
        return x;
    }
}

export function exitSpace(param) {
    return param.replace(/(^\s*)|(\s*$)/g, "")
}

export function setImageUrl(id) {
    let imageUrl = ''
    if (id) {
        imageUrl = rootUrl + '/bg/file?id=' + id
    }
    return imageUrl
}

/**
 * 整理给后端的参数，非空非零才加入新的对象
 * @param params
 * @returns {*}
 * @constructor
 */
export function ArrangeParams(params) {
    let newParams = {}
    Object.keys(params).forEach((item) => {
        if (params[item] && (params[item] + '').length) {
            newParams[item] = params[item]
        }
    })
    return newParams
}

/**
 * 格式化时间戳
 * @param date
 * @returns {number}
 */
export function parseDate(date) {
    return Date.parse(date) / 1000
}

export function ArrangeHttpMethod(method) {
    let httpMethod = http.httpGet
    switch (method) {
        case 'post':
            httpMethod = http.httpPost
            break
        case 'put':
            httpMethod = http.httpPut
            break
        case 'delete':
            httpMethod = http.httpDelete
            break
        default:
            httpMethod = http.httpGet
    }
    return httpMethod
}
/**
 * 获取图片信息
 * @param file
 * @returns {Promise<any>}
 */
export function imgPreview(file) {
    return new Promise((resolve) => {
        let Orientation
        Exif.getData(file, () => {
            Orientation = Exif.getTag(file, 'Orientation')
        })
        let reader = new FileReader()
        reader.onload = (e) => {
            let img = new Image()
            img.src = e.target.result
            img.onload = function() {
                let data = compress(img, Orientation)
                resolve(data)
            }
        }
        reader.readAsDataURL(file)
    })
}

function compress(img, Orientation) {
    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')
    let tCanvas = document.createElement('canvas')
    let tctx = tCanvas.getContext('2d')
        // let initSize = img.src.length
    let width = img.width
    let height = img.height
        // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
    let ratio
    if ((ratio = width * height / 4000000) > 1) {
        ratio = Math.sqrt(ratio)
        width /= ratio
        height /= ratio
    } else {
        ratio = 1
    }
    canvas.width = width
    canvas.height = height
        // 铺底色
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
        // 如果图片像素大于100万则使用瓦片绘制
    let count
    if ((count = width * height / 1000000) > 1) {
        count = ~~(Math.sqrt(count) + 1) // 计算要分成多少块瓦片
            // 计算每块瓦片的宽和高
        let nw = ~~(width / count)
        let nh = ~~(height / count)
        tCanvas.width = nw
        tCanvas.height = nh
        for (let i = 0; i < count; i++) {
            for (let j = 0; j < count; j++) {
                tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh)
                ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh)
            }
        }
    } else {
        ctx.drawImage(img, 0, 0, width, height)
    }
    // 修复ios上传图片的时候 被旋转的问题
    if (Orientation != '' && Orientation != 1) {
        switch (Orientation) {
            case 6: // 需要顺时针（向左）90度旋转
                rotateImg(img, 'left', canvas)
                break
            case 8: // 需要逆时针（向右）90度旋转
                rotateImg(img, 'right', canvas)
                break
            case 3: // 需要180度旋转
                rotateImg(img, 'right', canvas) // 转两次
                rotateImg(img, 'right', canvas)
                break
        }
    }
    // 进行最小压缩
    let ndata = canvas.toDataURL('image/jpeg', 0.1)
        // console.log('压缩前：' + initSize)
        // console.log('压缩后：' + ndata.length)
        // console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + '%')
    tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0
    return ndata
}

function rotateImg(img, direction, canvas) {
    // 最小与最大旋转方向，图片旋转4次后回到原方向
    const min_step = 0
    const max_step = 3
    if (img == null) return
        // img的高度和宽度不能在img元素隐藏后获取，否则会出错
    let height = img.height
    let width = img.width
    let step = 2
    if (step == null) {
        step = min_step
    }
    if (direction == 'right') {
        step++
        // 旋转到原位置，即超过最大值
        step > max_step && (step = min_step)
    } else {
        step--
        step < min_step && (step = max_step)
    }
    // 旋转角度以弧度值为参数
    let degree = step * 90 * Math.PI / 180
    let ctx = canvas.getContext('2d')
    switch (step) {
        case 0:
            canvas.width = width
            canvas.height = height
            ctx.drawImage(img, 0, 0)
            break
        case 1:
            canvas.width = height
            canvas.height = width
            ctx.rotate(degree)
            ctx.drawImage(img, 0, -height)
            break
        case 2:
            canvas.width = width
            canvas.height = height
            ctx.rotate(degree)
            ctx.drawImage(img, -width, -height)
            break
        case 3:
            canvas.width = height
            canvas.height = width
            ctx.rotate(degree)
            ctx.drawImage(img, -width, 0)
            break
    }
}