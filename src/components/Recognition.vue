<template>
    <div id="recognition">
        <div class="recognition-header">
            <div class="recognition-header-left">
                <img src="../assets/images/dsd_icon.png">
                <div class="recognition-heade-description">
                    <div class="recognition-header-title">大数点图片识别</div>
                    <div class="recognition-header-detail">由大数点AI提供技术支持</div>
                </div>
            </div>
            <div class="recognition-header-right">
                <div v-if="count > 0">
                    还有{{count}}张图片等待识别
                </div>
                <div v-else>
                    正在努力获取图片数据...
                </div>
            </div>
        </div>
        <div class="recognition-carousel" @click.capture.stop="">
            <el-carousel
                        ref="carousel"
                        v-loading="loading"
                         indicator-position="none"
                         arrow="never"
                         trigger="hover"
                         @change="changeListItem"
                        :autoplay="autoplay"
                        :interval="5000">

                <el-carousel-item v-for="(item,index) in list" :key="index" name="index">
                    <img v-show="item.status === 'unrecognize' || item.status === 'recoginizing'" v-lazy="item.image" :postion="index">
                    <img v-show="item.status === 'recognized'" :src="item.show_res_image" :postion="index">
                    <div v-if="item.status === 'recoginizing'" class="line"></div>
                </el-carousel-item>
            </el-carousel>
        </div>
        <audio style="display: none" ref="audio" controls preload src="/水滴滑落声.mp3"  type="audio/mpeg"></audio>
    </div>


</template>

<script>
    import * as api from '../utils/api'

    export default {
        name: "recognition",
        data(){
            return {
                loading:false,
                count:null,
                list:[],
                autoplay:false,
                updateTimer:null,
            }
        },
        methods:{
            initData(){
                this.loading = true;
                api.getActivityRecognition().then((res) => {
                    this.loading = false;
                    res.data.list.forEach((item) => {
                        item.isActive = false;
                        item.isInit = false;
                        item.status = 'unrecognize';

                        item.image = api.setImageUrl(item.image);
                        item.res_image = api.setImageUrl(item.res_image);
                    });
                    this.list = res.data.list;
                    this.count = res.data.list.length;
                }).catch(() => {
                })
                this.$Lazyload.$on('loaded',(img) => {
                    let index = img.el.getAttribute("postion")
                    let item = this.list[index];
                    item.isInit = true;
                    // item.show_res_image = item.res_image;
                    this.toShowResultImage(item,index);
                });
            },
            changeListItem(index){
                if(this.count >= 0){
                    let item = this.list[index];
                    item.isActive = true;
                    item.show_res_image = item.res_image;
                    this.toShowResultImage(item,index);
                }
            },
            toShowResultImage(item){
                if(item.isActive && item.isInit && item.status === 'unrecognize'){
                    item.status = 'recoginizing';
                    setTimeout(() => {//识别中
                        item.status = 'recognized';
                        this.count--;
                        // this.$refs.audio.play();
                        setTimeout(() => {
                            if(this.count <= 0){
                                this.startUpdateTimer();
                            } else {
                                this.$refs.carousel.next();
                            }
                        },5000)
                    },5000);
                }
            },
            startUpdateTimer(){
                this.getRecognitionImage();
                this.updateTimer = setInterval(() => {
                    this.getRecognitionImage();
                },5000);
            },
            getRecognitionImage(){
                this.loading = true;
                api.getActivityRecognition().then((res) => {
                    this.loading = false;
                    res.data.list.forEach((item) => {
                        item.isActive = false;
                        item.isInit = false;
                        item.status = 'unrecognize';

                        item.image = api.setImageUrl(item.image);
                        item.res_image = api.setImageUrl(item.res_image);
                    });
                    let lastIndex = this.list.length;
                    this.list = this.list.concat(res.data.list);
                    this.count = res.data.list.length;
                    if(this.count > 0){
                        this.updateTimer&&clearInterval(this.updateTimer);
                        setTimeout(() => {
                            this.$refs.carousel.setActiveItem(lastIndex);
                        },1000);
                    }
                }).catch(() => {
                })
            },
        },
        mounted(){
            this.initData();
        },
        beforeDestroy () {
            this.updateTimer&&clearInterval(this.updateTimer);
        }
    }
</script>

<style lang="less">
    @rem:85.375rem;

    #recognition{
        width: 100%;
        height: 100%;
        background: #fff;

        display: flex;
        flex-direction: column;
    }
    .recognition-header{
        display: flex;
        justify-content: space-between;
        .recognition-header-left{
            margin-top: 20px;
            margin-left: 40px;
            display: flex;
            align-items: center;
            img{
                width: 80px;
                height: 80px;
                margin-right: 12px;
                border-radius: 15px;
            }
            .recognition-heade-description{
                display: flex;
                flex-direction: column;
                justify-content: center;
                .recognition-header-title{
                    color: #000000;
                    font-size: 24px;
                }
                .recognition-header-detail{
                    color: #7F8393;
                    font-size: 20px;
                }
            }
        }

        .recognition-header-right{
            margin-top: 32px;
            margin-right: 41px;
            color: #333333;
            font-size: 24px;
        }
    }

    .recognition-carousel{
        margin-top: 88px;
        flex:1;

        .el-carousel{
            height: 100%;
            .el-carousel__container{
                height: 80%;
            }
            .el-carousel__item{
                background: transparent;
                display: flex;
                justify-content: center;
                align-items: center;
                .el-carousel__mask{
                    background: #fff;
                    opacity: 0.5;
                }
                img {
                    /*cover，contain，fill*/
                    /*background: #E5E5E5;*/
                    object-fit: contain;
                    max-width: 100%;
                    max-height: 100%;
                }
            }
            /*.el-carousel__item:nth-child(2n) {*/
                /*background-color: #99a9bf;*/
            /*}*/

            /*.el-carousel__item:nth-child(2n+1) {*/
                /*background-color: #d3dce6;*/
            /*}*/
        }
    }

    .line{
        position: absolute;
        top: 0%;
        left: 5%;
        height: 3px;
        width: 90%;
        background:linear-gradient(90deg,rgba(255,255,255,0.1) 0%,rgba(255,255,255,1) 50%,rgba(255,255,255,0.1) 100%);
        z-index: 2;
        animation: myScan 2s linear infinite ;
    }
    @keyframes  myScan{
        from { top: 5%; }
        to { top: 95%; }
    }


</style>
