import axios from 'axios'
// import qs from 'querystring'
import { Bus, UNAUTHORIZATION, ArrangeParams } from "./common";
axios.defaults.timeout = 60000

axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8';
axios.defaults.headers['Authorization'] = localStorage.getItem("Authorization") + '';
export const rootUrl = process.env.NODE_ENV == 'development' ? window.location.origin + '/api' : window.location.origin + '/bgapi';
axios.defaults.baseURL = rootUrl

axios.interceptors.response.use(function(res) {
    return res;
}, function(err) {
    if (parseInt(err.response.status) === 401) {
        Bus.$emit(UNAUTHORIZATION);
    }
    return Promise.reject(err);
})

export default {
    httpGet(url, params) {
        return new Promise((resolve, reject) => {
            axios.get(url, { params: params }).then(res => {
                resolve(res.data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    httpPost(url, params) {
        return new Promise((resolve, reject) => {
            axios.post(url, ArrangeParams(params)).then(res => {
                resolve(res.data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    httpPut(url, params) {
        return new Promise((resolve, reject) => {
            axios.put(url, ArrangeParams(params)).then(res => {
                if (res.data.code === 3) {
                    localStorage.clear()
                    window.location.reload()
                    return
                }
                resolve(res.data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    httpDelete(url, params) {
        return new Promise((resolve, reject) => {
            axios.delete(url, { params: params }).then(res => {
                resolve(res.data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    httpAuth(url, auth) {
        return new Promise((resolve, reject) => {
            axios.get(url, { auth: auth }).then(res => {
                resolve(res.data)
            }).catch(error => {
                reject(error)
            })
        })
    }
}