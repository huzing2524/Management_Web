import Vue from 'vue'
import App from './App'
import router from './router'
import Exif from 'exif-js'
Vue.use(Exif)
    // import './index.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import lodash from 'lodash'
import VueLazyload from 'vue-lazyload'
Vue.prototype.$_ = lodash;
Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.use(VueLazyload, {})
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')