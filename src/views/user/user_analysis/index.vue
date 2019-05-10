<template>
  <div class="user_analysis">
    <div class="user_analysis_content">
      <div class="user_analysis_pandect">
        <div class="analysis_title">总览</div>
        <div class="analysis_box">
          <div class="analysis_box_item">
            <span>{{userStatsData.total_users}}</span>
            <p>总用户数</p>
          </div>
          <div class="analysis_box_item">
            <span>{{userStatsData.active_users}}</span>
            <p>7天活跃用户</p>
          </div>
          <div class="analysis_box_item">
            <span>{{userStatsData.new_users}}</span>
            <p>今日新增</p>
          </div>
          <div class="analysis_box_item">
            <span>{{userStatsData.active_rate}}</span>
            <p>用户活跃率</p>
          </div>
        </div>
      </div>
    
      <div class="analysis_chart_item">
        <div class="analysis_chart_content">
          <div class="analysis_chart_title">
            <h4>新增用户</h4>
            <span>最近7天平均新增：20人</span>
          </div>
          <canvas id="addUser"></canvas>
        </div>  
      </div>
      <div class="analysis_chart_item">
        <div class="analysis_chart_content">
          <div class="analysis_chart_title">
            <h4>新增用户城市TOP10</h4>
          </div>
          <canvas id="userAddRank"></canvas>
        </div>
      </div>
      <div class="analysis_chart_item">
        <div class="analysis_chart_content">
          <div class="analysis_chart_title">
            <h4>活跃用户</h4>
            <span>最近7天平均活跃：12366人</span>
          </div>
          <canvas id="activeUser"></canvas>
        </div>
      </div>
      <div class="analysis_chart_item">
        <div class="analysis_chart_content">
          <div class="analysis_chart_title">
            <h4>活跃用户城市TOP10</h4>
          </div>
          <canvas id="activeUserRank"></canvas>
        </div>
      </div>
    </div>
    
    
  </div>
</template>

<script>
  import { GetUserStats } from '_utils/api'
  import F2 from '@antv/f2'
  export default {
    data() {
      return {
        userStatsData: {},
        addUserChart: null,
        userAddRankChart: null,
        activeUserchart: null,
        activeUserRankChart: null,
        addUserChartData: [{
            day: '10.2',
            value: 10
          }, {
            day: '10.3',
            value: 15
          }, {
            day: '10.4',
            value: 26
          }, {
            day: '10.5',
            value: 44
          }, {
            day: '10.6',
            value: 50
          }, {
            day: '10.7',
            value: 60
          }, {
            day: '10.8',
            value: 70
          }, {
            day: '10.9',
            value: 76
          }, {
            day: '10.10',
            value: 80
          }, {
            day: '10.11',
            value: 90
        }],
        userAddRankChartData:[{
            country: '湛江',
            population: 18203
          }, {
            country: '东莞',
            population: 23489
          }, {
            country: '上海',
            population: 29034
          }, {
            country: '广州',
            population: 104970
          }, {
            country: '深圳',
            population: 131744
        }],
        activeUserchartData:[{
            day: '10.2',
            value: 10
          }, {
            day: '10.3',
            value: 20
          }, {
            day: '10.4',
            value: 35
          }, {
            day: '10.5',
            value: 30
          }, {
            day: '10.6',
            value: 46
          }, {
            day: '10.7',
            value: 57
          }, {
            day: '10.8',
            value: 55
          }, {
            day: '10.9',
            value: 76
          }, {
            day: '10.10',
            value: 80
          }, {
            day: '10.11',
            value: 90
        }],
        activeUserRankChartData:[{
            country: '湛江',
            population: 18203
          }, {
            country: '东莞',
            population: 23489
          }, {
            country: '上海',
            population: 29034
          }, {
            country: '广州',
            population: 104970
          }, {
            country: '深圳',
            population: 131744
        }],
      }
    },
    mounted() {
      this.getUserStats()
      this.initChart();
    },
    methods: {
      async getUserStats() {
        try {
          let res = await GetUserStats()
          this.userStatsData = res
        } catch (e) {
          //
        }
      },
      initChart(){

        // addUserChart-新增用户
        this.addUserChart = new F2.Chart({
          id: 'addUser',
          width: 800,
          height: 300,
          pixelRatio: window.devicePixelRatio
        });
        this.addUserChart.source(this.addUserChartData, {
          value: {
            tickCount: 6,
            min: 0
          },
          day: {
            range: [0, 1]
          }
        });
        this.addUserChart.tooltip({
          showCrosshairs: true,
          showItemMarker: false,
          onShow: function onShow(ev) {
            var items = ev.items;
            items[0].name = null;
            items[0].value = '$ ' + items[0].value;
          }
        });
        this.addUserChart.axis('day', {
          label: function label(text, index, total) {
            var textCfg = {};
            if (index === 0) {
              textCfg.textAlign = 'left';
            } else if (index === total - 1) {
              textCfg.textAlign = 'right';
            }
            return textCfg;
          }
        });
        this.addUserChart.line().position('day*value');
        this.addUserChart.point().position('day*value').style({
          stroke: '#fff',
          lineWidth: 1
        });
        this.addUserChart.render();
        
        // userAddRankChart-新增用户城市TOP10
        let Global = F2.Global;
        this.userAddRankChart = new F2.Chart({
          id: 'userAddRank',
          width: 800,
          height: 300,
          pixelRatio: window.devicePixelRatio
        });
        this.userAddRankChart.source(this.userAddRankChartData, {
          population: {
            tickCount: 5
          }
        });
        this.userAddRankChart.coord({
          transposed: true
        });
        this.userAddRankChart.axis('country', {
          line: Global._defaultAxis.line,
          grid: null
        });
        this.userAddRankChart.axis('population', {
          line: null,
          grid: Global._defaultAxis.grid,
          label: function label(text, index, total) {
            var textCfg = {};
            if (index === 0) {
              textCfg.textAlign = 'left';
            } else if (index === total - 1) {
              textCfg.textAlign = 'right';
            }
            return textCfg;
          }
        });
        this.userAddRankChart.interval().position('country*population');
        this.userAddRankChart.render();
        
        // activeUserchart-活跃用户
         this.activeUserchart = new F2.Chart({
          id: 'activeUser',
          width: 800,
          height: 300,
          pixelRatio: window.devicePixelRatio
        });
        this.activeUserchart.source(this.activeUserchartData, {
          value: {
            tickCount: 5,
            min: 0
          },
          day: {
            range: [0, 1]
          }
        });
        this.activeUserchart.tooltip({
          showCrosshairs: true,
          showItemMarker: false,
          onShow: function onShow(ev) {
            var items = ev.items;
            items[0].name = null;
            items[0].value = '$ ' + items[0].value;
          }
        });
        this.activeUserchart.axis('day', {
          label: function label(text, index, total) {
            var textCfg = {};
            if (index === 0) {
              textCfg.textAlign = 'left';
            } else if (index === total - 1) {
              textCfg.textAlign = 'right';
            }
            return textCfg;
          }
        });
        this.activeUserchart.line().position('day*value');
        this.activeUserchart.point().position('day*value').style({
          stroke: '#fff',
          lineWidth: 1
        });
        this.activeUserchart.render();

        // activeUserRankChart-活跃用户城市TOP10
          this.activeUserRankChart = new F2.Chart({
          id: 'activeUserRank',
          width: 800,
          height: 300,
          pixelRatio: window.devicePixelRatio
        });
        this.activeUserRankChart.source(this.activeUserRankChartData, {
          population: {
            tickCount: 5
          }
        });
        this.activeUserRankChart.coord({
          transposed: true
        });
        this.activeUserRankChart.axis('country', {
          line: Global._defaultAxis.line,
          grid: null
        });
        this.activeUserRankChart.axis('population', {
          line: null,
          grid: Global._defaultAxis.grid,
          label: function label(text, index, total) {
            var textCfg = {};
            if (index === 0) {
              textCfg.textAlign = 'left';
            } else if (index === total - 1) {
              textCfg.textAlign = 'right';
            }
            return textCfg;
          }
        });
        this.activeUserRankChart.interval().position('country*population');
        this.activeUserRankChart.render();

      }
    }
  }
</script>

<style lang="less">
  .user_analysis {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    background: #EFEEF4;
    overflow: scroll;
    // .manage-identify-search {
    //   margin: 0 10px;
    //   margin-top: 10px;
    // }
    .user_analysis_content{
      display: flex;
      flex-direction: column; 
      overflow: scroll;    
      .user_analysis_pandect{
        padding: 20px;
        display: flex;
        flex-direction: column;
        background: #fff;
        margin-bottom: 20px;
        .analysis_title{
          margin-bottom: 20px;
        }
        .analysis_box{
          display: flex;
          flex-direction: row;
          justify-content: space-evenly;
          align-items: center;
          .analysis_box_item{
            display: flex;
            flex-direction: column;
            padding: 30px 40px;
            border: 1px solid #dddddd;
            span{
              margin-bottom: 10px;
              font-size: 20px;
            }
            p{
              font-size: 16px;
            }
          }
        }
      }
      .analysis_chart_item{
        background: #fff;
        margin-bottom: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 400px;
        .analysis_chart_content{
          width: 800px;
          display: flex;
          flex-direction: column;
          .analysis_chart_title{
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            span{
              font-size: 16px;
            }
          }
        }
        
      }
      
    }
  }
</style>
