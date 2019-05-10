<template>
  <div class="application_use">
    <div class="application_use_search">
      <el-form :inline="true" :model="searchData">
        <el-form-item label="创建人名称">
          <el-input v-model="searchData.name" placeholder="创建人名称"></el-input>
        </el-form-item>
        <el-form-item label="创建人手机号">
          <el-input v-model="searchData.id" placeholder="创建人手机号"></el-input>
        </el-form-item>
        <el-form-item label="所属公司">
          <el-input v-model="searchData.company" placeholder="所属公司"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchBtnClick()">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="application_use_table">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="市场部" name="first">
          <el-table :data="marketList" v-loading="loading" height="100%" style="width: 100%;height: 100%" stripe>
            <el-table-column
              header-align="center"
              align="center"
              prop="rn"
              label="序号">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="client"
              label="订单客户">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="creator"
              label="创建人">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="product"
              label="出售产品">
              <template slot-scope="scope">
                <el-col :span="24" v-for="(productItem,index) in scope.row.product" :key="index">
                  <el-button type="text" size="small">{{productItem.product_name}}:{{productItem.product_count}}{{productItem.product_unit}}</el-button>
                </el-col>
              </template> 
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="sales"
              label="合计金额">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="company"
              label="所属公司">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="time"
              label="创建时间">
              <template slot-scope="scope">
                <p>{{getFullDate(scope.row.time)}}</p>
              </template>
            </el-table-column>
          </el-table>                      
        </el-tab-pane>
        <el-tab-pane label="财务部" name="second">
          <el-table :data="financeList" v-loading="loading" height="100%" style="width: 100%;height: 100%" stripe>
            <el-table-column
              header-align="center"
              align="center"
              prop="rn"
              label="序号">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="input_output"
              label="收支">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="category"
              label="类别">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="sales"
              label="金额">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="creator"
              label="创建人">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="use_time"
              label="使用时间">
              <template slot-scope="scope">
                <p>{{getFullDate(scope.row.use_time)}}</p>
              </template>
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="company"
              label="所属公司">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="create_time"
              label="创建时间">
              <template slot-scope="scope">
                <p>{{getFullDate(scope.row.create_time)}}</p>
              </template>
            </el-table-column>
          </el-table> 
        </el-tab-pane>
        <el-tab-pane label="生产部" name="third">
          <el-table :data="productsList" v-loading="loading" height="100%" style="width: 100%;height: 100%" stripe>
            <el-table-column
              header-align="center"
              align="center"
              prop="rn"
              label="序号">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="product"
              label="生产产品">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="num"
              label="数量">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="start_time"
              label="开工时间">
              <template slot-scope="scope">
                <p>{{getFullDate(scope.row.start_time)}}</p>
              </template>
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="finished_time"
              label="完成时间">
              <template slot-scope="scope">
                <p>{{getFullDate(scope.row.finished_time)}}</p>
              </template>
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="recorder"
              label="记录人">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="company"
              label="所属公司">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="create_time"
              label="创建时间">
              <template slot-scope="scope">
                <p>{{getFullDate(scope.row.create_time)}}</p>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="采购部" name="fourth">
          <el-table :data="materialList" v-loading="loading" height="100%" style="width: 100%;height: 100%" stripe>
            <el-table-column
              header-align="center"
              align="center"
              prop="rn"
              label="序号">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="product"
              label="采购产品">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="num"
              label="数量">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="price"
              label="单价">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="sales"
              label="总价">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="putin_time"
              label="入库时间">
              <template slot-scope="scope">
                <p>{{getFullDate(scope.row.putin_time)}}</p>
              </template>
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="buy_time"
              label="采购时间">
              <template slot-scope="scope">
                <p>{{getFullDate(scope.row.buy_time)}}</p>
              </template>
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="buyer"
              label="采购人">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="company"
              label="所属公司">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="create_time"
              label="创建时间">
              <template slot-scope="scope">
                <p>{{getFullDate(scope.row.create_time)}}</p>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="仓库部" name="fifth">
          <el-table :data="storeList" v-loading="loading" height="100%" style="width: 100%;height: 100%" stripe>
             <el-table-column
              header-align="center"
              align="center"
              prop="rn"
              label="序号">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="name_number"
              label="名称和数量">
              <template slot-scope="scope">
                <el-col :span="24" v-for="(item,index) in scope.row.name_number" :key="index">
                  <el-button type="text" size="small">{{item.name}}:{{item.number}}</el-button>
                </el-col>
              </template> 
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="category"
              label="产品/物料">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="inout"
              label="出库/入库">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="time"
              label="时间">
              <template slot-scope="scope">
                <p>{{getFullDate(scope.row.time)}}</p>
              </template>
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="recorder"
              label="记录人">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="company"
              label="所属公司">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="create_time"
              label="创建时间">
              <template slot-scope="scope">
                <p>{{getFullDate(scope.row.create_time)}}</p>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="application_list_pagination">
      <el-pagination
        :background="false"
        :page-size="row"
        :total="total"
        :current-page.sync="page"
        @current-change="handleCurrentChange"
        layout="prev, pager, next,total,jumper"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getFullDate } from '_utils/common'
import {MarketList,FinanceList,MaterialList,ProductsList,StoreList} from '@/utils/api'
export default {
  data () {
    return {
      getFullDate,
      activeName: 'first',
      row: 10,
      page: 1,
      total: 0,
      searchData: {
        id:'',
        name:'',
        company:''
      },
      loading:false,
      marketList:[],
      financeList:[],
      materialList:[],
      productsList:[],
      storeList:[],
      index: '0',
    }
  },
  mounted(){
    this.initData()
  },
  methods: {
    initData(){
      
      this.handleClick({index:'0'})
    },
    searchBtnClick(){ 
      this.page = 1;   
      this.handleClick({index: this.index});
    },
    handleClick(tab){
      let searchData = this.searchData;
      let params = {
        id: searchData.id,
        name: searchData.name,
        company: searchData.company,
        row: this.row,
        page: this.page
      };
      this.index = tab.index || '0';
      let indexs = this.index || tab.index;
      this.loading = true;
      if(indexs==='0'){
        MarketList(params,'get').then((res) => {
          this.loading = false;
          this.marketList = res.data
          this.total = res.total[0]
        }).catch(() => {
          this.loading = false;
          this.$message.error('获取数据失败')
        })
      }
      if(indexs==='1'){
        FinanceList(params,'get').then((res) => {
          this.loading = false;
          this.financeList = res.data
          this.total = res.total[0]
        }).catch(() => {
          this.loading = false;
          this.$message.error('获取数据失败')
        })
      }
      if(indexs==='2'){
        MaterialList(params,'get').then((res) => {
          this.loading = false;
          this.materialList = res.data
          this.total = res.total[0]
        }).catch(() => {
          this.loading = false;
          this.$message.error('获取数据失败')
        })
      }
      if(indexs==='3'){
        ProductsList(params,'get').then((res) => {
          this.loading = false;
          this.productsList = res.data
          this.total = res.total
        }).catch(() => {
          this.loading = false;
          this.$message.error('获取数据失败')
        })
      }
      if(indexs==='4'){
        StoreList(params,'get').then((res) => {
          this.loading = false;
          this.storeList = res.data
          this.total = res.total
        }).catch(() => {
          this.loading = false;
          this.$message.error('获取数据失败')
        })
      }
    },
    handleCurrentChange(){  
      this.handleClick({index: this.index});
    }
  }
}
</script>

<style lang="less">
.application_use{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: scroll;
    .application_use_search{
      display: flex;
      flex-direction: row;
      margin: 20px;
      form{
        width: 100%;
        .el-form-item{
          display: inline-block;
          margin-right: 10px;
          vertical-align: top;
        }
      
      }
    }
    .application_use_table{
      flex: 1;
      display: flex;
      flex-direction: column;
      .el-tabs{
        flex: 1;
        display: flex;
        flex-direction: column;
        .el-table__body-wrapper{
           height: 100%!important;
        }
      }
    }

  }
  .application_list_pagination{
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  } 
  .el-tabs__nav-scroll{
    padding-left: 20px;
  }
  .el-tabs__header{
    margin: 0;
  }
</style>
