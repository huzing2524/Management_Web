import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
let router = new Router({
    mode: 'history',
    routes: [{
            path: '/login',
            name: 'login',
            component: () =>
                import ('_views/login')
        },
        {
            path: '/rights',
            name: 'rights',
            component: () =>
                import ('_views/rights')
        },
        {
            path: '/',
            name: 'Index',
            component: () =>
                import ('_views/index'),
            redirect: '/user',
            children: [{
                    path: '/user',
                    name: '用户管理',
                    component: () =>
                        import ('_views/user'),
                    redirect: '/user/list',
                    meta: {
                        needLogin: true
                    },
                    children: [{
                            path: 'list',
                            name: '用户列表',
                            component: () =>
                                import ('_views/user/user_list'),
                            meta: {
                                needLogin: true
                            }
                        },
                        {
                            path: 'identify',
                            name: '用户认证',
                            component: () =>
                                import ('_views/user/user_identify'),
                            meta: {
                                needLogin: true
                            }
                        },
                        {
                            path: 'analysis',
                            name: '用户统计分析',
                            component: () =>
                                import ('_views/user/user_analysis'),
                            meta: {
                                needLogin: true
                            }
                        },
                        {
                            path: 'dsd',
                            name: 'DSD记录',
                            component: () =>
                                import ('_views/user/user_dsd'),
                            meta: {
                                needLogin: true
                            }
                        },
                        {
                            path: 'feedback',
                            name: '用户反馈',
                            component: () =>
                                import ('_views/user/user_feedback'),
                            meta: {
                                needLogin: true
                            }
                        },
                    ]
                },
                {
                    path: '/enterprise',
                    name: '企业管理',
                    component: () =>
                        import ('_views/enterprise'),
                    redirect: '/enterprise/make',
                    meta: {
                        needLogin: true
                    },
                    children: [{
                            path: 'list',
                            name: '企业列表',
                            component: () =>
                                import ('_views/enterprise/enterprise_list')
                        },
                        {
                            path: 'make',
                            name: '企业制造管理',
                            component: () =>
                                import ('_views/enterprise/enterprise_make')
                        },
                        {
                            path: 'analysis',
                            name: '企业统计分析',
                            component: () =>
                                import ('_views/enterprise/analysis')
                        },
                        {
                            path: 'apply',
                            name: '企业申请列表',
                            component: () =>
                                import ('_views/enterprise/apply')
                        },
                        {
                            path: 'manage',
                            name: '管理员',
                            component: () =>
                                import ('_views/enterprise/enterprise_list/manage')
                        },
                    ]
                },
                {
                    path: '/application',
                    name: '轻应用管理',
                    component: () =>
                        import ('_views/application'),
                    redirect: '/application/list',
                    meta: {
                        needLogin: true
                    },
                    children: [{
                            path: 'list',
                            name: '轻应用列表',
                            component: () =>
                                import ('_views/application/application_list')
                        },
                        {
                            path: 'database',
                            name: '小D数据库',
                            component: () =>
                                import ('_views/application/database')
                        },
                        {
                            path: 'learning',
                            name: '小D学习任务',
                            component: () =>
                                import ('_views/application/learning')
                        },
                        {
                            path: 'use',
                            name: '智能制造使用情况',
                            component: () =>
                                import ('_views/application/use')
                        },
                        {
                            path: 'industry',
                            name: '行业＋审核',
                            component: () =>
                                import ('_views/application/industry')
                        },
                        {
                            path: 'test',
                            name: '企业智能化测试',
                            component: () =>
                                import ('_views/application/test')
                        },
                        {
                            path: 'friends',
                            name: '邀请好友列表',
                            component: () =>
                                import ('_views/application/friends')
                        },
                        {
                            path: 'qiye',
                            name: '邀请企业列表',
                            component: () =>
                                import ('_views/application/qiye')
                        },
                        {
                            path: 'banner',
                            name: '首页Banner',
                            component: () =>
                                import ('_views/application/banner')
                        },
                    ]
                },
            ]
        },
        // {
        //   path: '/manage',
        //   component: () => import('../components/ManageAll'),
        //   children: [
        //     {
        //       path: 'identify',
        //       component: () => import('../components/ManageIdentify')
        //     },
        //     {
        //       path: 'enterprise',
        //       component: () => import('../components/ManageEnterprise')
        //     },
        //     {
        //       path: 'predication',
        //       component: () => import('../components/ManagePredication')
        //     },
        //     {
        //       path: '',
        //       redirect: 'identify'
        //     },
        //   ]
        // },
        // {
        //   path: '/recognition',
        //   name: 'recognition',
        //   component: () => import('../components/Recognition')
        // },
    ]
})

router.beforeEach((to, from, next) => {

    if (to.name === null) {
        next({
            path: '/'
        })
    }

    if ((to.matched.some(res => res.meta.needLogin))) {
        if (localStorage.getItem('Authorization')) {
            next()
        } else {
            // 没登录则跳转到登录界面
            next({
                path: '/login?url=' + to.fullPath
            })
        }
    } else {
        next()
    }
    // if (!localStorage.getItem('USERNAME') || !localStorage.getItem('PASSWORD')) {
    //   next({
    //     path: '/login?url=' + to.fullPath
    //   });
    // } else {
    //   next();
    // }
})

export default router;