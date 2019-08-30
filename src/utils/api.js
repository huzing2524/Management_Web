/**
 * Created by zfy on 2017/7/21.
 */
import http from './http'
import axios from 'axios'
import { ArrangeHttpMethod } from './common'

let rootUrl = process.env.NODE_ENV == 'development' ? window.location.origin + '/api' : window.location.origin + '/bgapi'

// axios.interceptors.request.use(function(config) {
//     config.headers['Authorization'] = '123'
//     return config
// },function(err){
//     return Promise.reject(err)
// })


export function setDefaultHeader(key, value) {
    axios.defaults.headers[key] = value
}

export function setImageUrl(id) {
    let imageUrl = ''
    if (id) {
        imageUrl = rootUrl + '/bg/file?id=' + id
    }
    return imageUrl
}


//后台登录
export const getBglogin = (auth) => {
    return http.httpAuth('/bg/login', auth)
}

//获取后台列表
export function GetBglist(params) {
    return http.httpGet('/bg/list', params)
}

export function postBgauth(params) {
    return http.httpPost('/bg/auth', params)
}

/**
 * 后台企业列表
 * @param params
 * @returns {*}
 */
export const GetFacsList = async(params) => {
    return http.httpGet('bg/facs/list', params)
}
export const GetFacNamesList = async(params) => {
    return http.httpGet('/bg/facs/names', params)
}
export function postFacsModify(params) {
    return http.httpPost('/facs/modify', params)
}

export function postFacsNew(params) {
    return http.httpPost('/facs/new', params)
}

export function postFacsDel(params) {
    return http.httpPost('/facs/del', params)
}

export function getActivityRecognition(params) {
    return http.httpGet('/activity/recognition/image/list', params)
}

/**
 * 用户列表
 * @param params
 * @returns {Promise<*>}
 * @constructor
 */
export const GetUserList = async(params) => {
        return http.httpGet('/bg/user/list', params)
    }
    /**
     * 用户统计信息
     * @param params
     * @returns {Promise<*>}
     * @constructor
     */
export const GetUserStats = async(params) => {
        return http.httpGet('/bg/user/stats', params)
    }
    /**
     * dsd记录查询
     * @param params
     * @returns {Promise<*>}
     * @constructor
     */
export const GetDsdList = async(params) => {
    return http.httpGet('/bg/dsd/list', params)
}
export const GrantDsd = async(params) => {
        return http.httpPost('/bg/dsd/grant', params)
    }
    /**
     * 反馈记录查询
     * @param params
     * @returns {Promise<*>}
     * @constructor
     */
export const GetFeedbackList = async(params) => {
        return http.httpGet('/bg/feedback/list', params)
    }
    /**
     * 用户反馈回复
     * @param params
     * @returns {Promise<*>}
     * @constructor
     */
export function FeedbackResp(params, methods, path) {
    return ArrangeHttpMethod(methods)('/bg/feedback/resp' + (path || ''), params)
}
/**
 * 企业申请列表
 * @param params
 * @returns {Promise<*>}
 * @constructor
 */
export const GetExamineList = async(params) => {
        return http.httpGet('/bg/examine/list', params)
    }
    /**
     * 企业申请确认
     * @param params
     * @param id
     * @returns {Promise<*>}
     * @constructor
     */
export const ToExamine = async(params, id) => {
        return http.httpPost(`/bg/examine/${id}`, params)
    }
    /**
     * 获取应用列表
     * @param params
     * @returns {Promise<*>}
     * @constructor
     */
export const GetApps = async(params) => {
    return http.httpGet('/bg/apps', params)
}
export function ApplicationApps(params, methods, path) {
    return ArrangeHttpMethod(methods)('/bg/apps' + (path || ''), params)
}
/**
 * 修改应用状态,隐藏/显示
 * @param params
 * @returns {Promise<*>}
 * @constructor
 */
export function ApplicationAppsState(params, methods, path) {
    return ArrangeHttpMethod(methods)('/bg/apps/state' + (path || ''), params)
}
/**
 * xd图片
 * @param params
 * @returns {Promise<*>}
 * @constructor
 */
export function LearningXdImages(params, methods, path) {
    return ArrangeHttpMethod(methods)('/bg/xd/images/tag' + (path || ''), params)
}
/**
 * xd学习任务
 * @param params
 * @returns {Promise<*>}
 * @constructor
 */
export function LearningXdTasks(params, methods, path) {
    return ArrangeHttpMethod(methods)('/bg/xd/tasks' + (path || ''), params)
}
/**
 * 关键词
 * @param params
 * @returns {Promise<*>}
 * @constructor
 */
export function LearningXdKeyword(params, methods, path) {
    return ArrangeHttpMethod(methods)('/bg/xd/images/tag/keyword' + (path || ''), params)
}
/**
 * 智能制造市场部
 * @param params
 * @returns {Promise<*>}
 * @constructor
 */
export function MarketList(params, methods, path) {
    return ArrangeHttpMethod(methods)('/bg/manufacturing/market/list' + (path || ''), params)
}
/**
 * 智能制造财务部
 * @param params
 * @returns {Promise<*>}
 * @constructor
 */
export function FinanceList(params, methods, path) {
    return ArrangeHttpMethod(methods)('/bg/manufacturing/finance/list' + (path || ''), params)
}
/**
 * 智能制造采购部
 * @param params
 * @returns {Promise<*>}
 * @constructor
 */
export function MaterialList(params, methods, path) {
    return ArrangeHttpMethod(methods)('/bg/manufacturing/material/list' + (path || ''), params)
}
/**
 * 生产部制造数据显示
 * @param params
 * @returns {Promise<*>}
 * @constructor
 */
export function ProductsList(params, methods, path) {
    return ArrangeHttpMethod(methods)('/bg/manufacturing/products/list' + (path || ''), params)
}
/**
 * 仓库部制造数据显示
 * @param params
 * @returns {Promise<*>}
 * @constructor
 */
export function StoreList(params, methods, path) {
    return ArrangeHttpMethod(methods)('/bg/manufacturing/store/list' + (path || ''), params)
}

// --------------------------------------------

/**
 * 智能制造使用情况-订单
 * @param params
 * @returns {Promise<*>}
 * @constructor
 */
export function OrderList(params, methods, path) {
    return ArrangeHttpMethod(methods)('/bg/manufacturing/order/list' + (path || ''), params)
}

/**
 * 智能制造使用情况-生产任务单
 * @param params
 * @returns {Promise<*>}
 * @constructor
 */
export function ProductList(params, methods, path) {
    return ArrangeHttpMethod(methods)('/bg/manufacturing/product/list' + (path || ''), params)
}

/**
 * 智能制造使用情况-采购单
 * @param params
 * @returns {Promise<*>}
 * @constructor
 */
export function PurchaseList(params, methods, path) {
    return ArrangeHttpMethod(methods)('/bg/manufacturing/purchase/list' + (path || ''), params)
}

/**
 * 智能制造使用情况-发货单
 * @param params
 * @returns {Promise<*>}
 * @constructor
 */
export function InvoiceList(params, methods, path) {
    return ArrangeHttpMethod(methods)('/bg/manufacturing/invoice/list' + (path || ''), params)
}

/**
 * 智能制造使用情况-领料单
 * @param params
 * @returns {Promise<*>}
 * @constructor
 */
export function PickingList(params, methods, path) {
    return ArrangeHttpMethod(methods)('/bg/manufacturing/picking/list' + (path || ''), params)
}

/**
 * 智能制造使用情况-完工入库单
 * @param params
 * @returns {Promise<*>}
 * @constructor
 */
export function StorageList(params, methods, path) {
    return ArrangeHttpMethod(methods)('/bg/manufacturing/completed_storage/list' + (path || ''), params)
}

/**
 * 智能制造使用情况-盘点审批单
 * @param params
 * @returns {Promise<*>}
 * @constructor
 */
export function CheckList(params, methods, path) {
    return ArrangeHttpMethod(methods)('/bg/manufacturing/storage_check/list' + (path || ''), params)
}

/**
 * 智能制造使用情况-临时申购单
 * @param params
 * @returns {Promise<*>}
 * @constructor
 */
export function TemporaryPurchaseList(params, methods, path) {
    return ArrangeHttpMethod(methods)('/bg/manufacturing/temporary_purchase/list' + (path || ''), params)
}

// ------------------------------------------
/**
 * 新增企业信息
 * @param params
 * @returns {Promise<*>}
 * @constructor
 */
export function FacsNew(params, methods, path) {
    return ArrangeHttpMethod(methods)('/bg/facs/new' + (path || ''), params)
}

/**
 * 修改企业信息
 * @param params
 * @returns {Promise<*>}
 * @constructor
 */
export function FacsModify(params, methods, path) {
    return ArrangeHttpMethod(methods)('/bg/facs/modify' + (path || ''), params)
}

/**
 * 权限展示列表
 * @param params
 * @returns {Promise<*>}
 * @constructor
 */
export function RightsList(params, methods, path) {
    return ArrangeHttpMethod(methods)('/bg/rights/list' + (path || ''), params)
}

/**
 * 新增管理员
 * @param params
 * @returns {Promise<*>}
 * @constructor
 */
export function RightsNew(params, methods, path) {
    return ArrangeHttpMethod(methods)('/bg/rights/new' + (path || ''), params)
}

/**
 * 删除管理员
 * @param params
 * @returns {Promise<*>}
 * @constructor
 */
export function RightsDel(params, methods, path) {
    return ArrangeHttpMethod(methods)('/bg/rights/del' + (path || ''), params)
}

/**
 * 修改管理员密码
 * @param params
 * @returns {Promise<*>}
 * @constructor
 */
export function RightsPassword(params, methods, path) {
    return ArrangeHttpMethod(methods)('/bg/rights/password' + (path || ''), params)
}

/**
 * 修改管理员名字
 * @param params
 * @returns {Promise<*>}
 * @constructor
 */
export function RightsName(params, methods, path) {
    return ArrangeHttpMethod(methods)('/bg/rights/name' + (path || ''), params)
}

/**
 * 管理员列表
 * @param params
 * @returns {Promise<*>}
 * @constructor
 */
export function FacsAdmins(params, methods, path) {
    return ArrangeHttpMethod(methods)('/bg/facs/admins' + (path || ''), params)
}

/**
 * 删除普通管理员
 * @param params
 * @returns {Promise<*>}
 * @constructor
 */
export function FacsAdminsDel(params, methods, path) {
    return ArrangeHttpMethod(methods)('/bg/facs/admins/del' + (path || ''), params)
}

/**
 * 获取行业+申请列表
 * @param params
 * @returns {Promise<*>}
 * @constructor
 */
export function IndustryExamine(params, methods, path) {
    return ArrangeHttpMethod(methods)('/bg/industry_plus/examine' + (path || ''), params)
}

/**
 * 获取企业智能化测试列表
 * @param params
 * @returns {Promise<*>}
 * @constructor
 */
export function IndustryTest(params, methods, path) {
    return ArrangeHttpMethod(methods)('/bg/industry_plus/test' + (path || ''), params)
}

//v3.4.0
/**
 * 获取邀请企业列表
 * @param params
 * @returns {Promise<*>}
 * @constructor
 */
export function InviteFactory(params, methods, path) {
    return ArrangeHttpMethod(methods)('/bg/invite/factory/list' + (path || ''), params)
}

/**
 * 获取邀请好友列表
 * @param params
 * @returns {Promise<*>}
 * @constructor
 */
export function InviteFriend(params, methods, path) {
    return ArrangeHttpMethod(methods)('/bg/invite/friend/list' + (path || ''), params)
}

/**
 * 获取邀请好友列表
 * @param params
 * @returns {Promise<*>}
 * @constructor
 */
export function BannerOptions(params, methods, path) {
    return ArrangeHttpMethod(methods)('/bg/banner' + (path || ''), params)
}