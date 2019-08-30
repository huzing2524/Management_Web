<template>
  <div class="application_use">
    <div class="application_use_search">
      <el-form :inline="true" :model="searchData">
        <el-form-item label="创建人名称">
          <el-input v-model="searchData.name" placeholder="创建人名称"></el-input>
        </el-form-item>
        <el-form-item label="创建人手机号">
          <el-input v-model="searchData.phone" placeholder="创建人手机号"></el-input>
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
        <el-tab-pane label="订单" name="first">
          <el-table :data="orderList" v-loading="loading" style="width: 100%;height: 100%" stripe>
            <el-table-column
              header-align="center"
              align="center"
              prop="id"
              label="订单单号">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="style"
              label="自建/推送">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="state"
              label="状态">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="plan_arrival_time"
              label="期望送达时间">
              <template slot-scope="scope">
                <p>{{getFullDate(scope.row.plan_arrival_time)}}</p>
              </template>
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="actual_arrival_time"
              label="实际送达时间">
              <template slot-scope="scope">
                <p>{{getFullDate(scope.row.actual_arrival_time)}}</p>
              </template>
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="client"
              label="客户">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="products"
              label="出售产品">
              <template slot-scope="scope">
                <el-col :span="24" v-for="(productItem,index) in scope.row.products" :key="index">
                  <el-button type="text" size="small">{{productItem.name}}:{{productItem.count}}x{{productItem.price}}</el-button>
                </el-col>
              </template> 
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="money"
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
              prop="creator"
              label="创建人">
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
        <el-tab-pane label="生产任务单" name="second">
          <el-table :data="productList" v-loading="loading" height="100%" style="width: 100%;height: 100%" stripe>
            <el-table-column
              header-align="center"
              align="center"
              prop="id"
              label="生产任务单号">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="state"
              label="生产任务状态">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="product"
              label="生产任务产品">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="count"
              label="数量">
              <template slot-scope="scope">
                <span>{{scope.row.count}}{{scope.row.unit}}</span>
              </template> 
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="processes"
              label="所需工序">
              <template slot-scope="scope">
                <el-col :span="24" v-for="(processesItem,index) in scope.row.processes" :key="index">
                  <el-button type="text" size="small">{{processesItem.step}}、{{processesItem.name}}</el-button>
                </el-col>
              </template> 
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="materials"
              label="所需物料">
              <template slot-scope="scope">
                <el-col :span="24" v-for="(materialItem,index) in scope.row.materials" :key="index">
                  <el-button type="text" size="small">{{materialItem.name}}:{{materialItem.count}}{{materialItem.unit}}</el-button>
                </el-col>
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
              prop="time"
              label="创建时间">
              <template slot-scope="scope">
                <p>{{getFullDate(scope.row.time)}}</p>
              </template>
            </el-table-column>
          </el-table>                      
        </el-tab-pane>
        <el-tab-pane label="采购单" name="third">
          <el-table :data="purchaseList" v-loading="loading" height="100%" style="width: 100%;height: 100%" stripe>
            <el-table-column
              header-align="center"
              align="center"
              prop="id"
              label="采购单单号">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="state"
              label="采购单状态">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="supplier"
              label="供应商">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="products"
              label="采购单产品">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="count_price"
              label="数量 x 单价">
              <template slot-scope="scope">
                <el-col :span="24" v-for="(item,index) in scope.row.count_price" :key="index">
                  <el-button type="text" size="small">{{item.count}}x{{item.price}}</el-button>
                </el-col>
              </template>
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="money"
              label="总价">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="expect_arrival_time"
              label="期望送达时间">
              <template slot-scope="scope">
                <p>{{getFullDate(scope.row.expect_arrival_time)}}</p>
              </template>
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="arrival_time"
              label="实际送达时间">
              <template slot-scope="scope">
                <p>{{getFullDate(scope.row.arrival_time)}}</p>
              </template>
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="approval"
              label="审批人">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="approval_time"
              label="审批时间">
              <template slot-scope="scope">
                <p>{{getFullDate(scope.row.approval_time)}}</p>
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
              prop="time"
              label="创建时间">
              <template slot-scope="scope">
                <p>{{getFullDate(scope.row.time)}}</p>
              </template>
            </el-table-column>
          </el-table> 
        </el-tab-pane>
        <el-tab-pane label="发货单" name="fourth">
          <el-table :data="invoiceList" v-loading="loading" height="100%" style="width: 100%;height: 100%" stripe>
            <el-table-column
              header-align="center"
              align="center"
              prop="id"
              label="发货单号">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="state"
              label="发货状态">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="predict_deliver_time"
              label="预计发货时间">
              <template slot-scope="scope">
                <p>{{getFullDate(scope.row.predict_deliver_time)}}</p>
              </template>
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="actual_deliver_time"
              label="实际发货时间">
              <template slot-scope="scope">
                <p>{{getFullDate(scope.row.actual_deliver_time)}}</p>
              </template>
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="client"
              label="客户">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="products"
              label="出货产品">
              <template slot-scope="scope">
                <el-col :span="24" v-for="(productItem,index) in scope.row.products" :key="index">
                  <el-button type="text" size="small">{{productItem.name}}:{{productItem.count}}{{productItem.unit}}x{{productItem.price}}</el-button>
                </el-col>
              </template> 
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="money"
              label="合计金额">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="deliver_person"
              label="发货人">
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
        <el-tab-pane label="领料单" name="fifth">
          <el-table :data="pickingList" v-loading="loading" height="100%" style="width: 100%;height: 100%" stripe>
            <el-table-column
              header-align="center"
              align="center"
              prop="id"
              label="领料单号">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="state"
              label="领料状态">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="picking_time"
              label="领料时间">
              <template slot-scope="scope">
                <p>{{getFullDate(scope.row.picking_time)}}</p>
              </template>
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
              prop="product_id"
              label="生产单号">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="materials"
              label="领取物料">
              <template slot-scope="scope">
                <el-col :span="24" v-for="(materialItem,index) in scope.row.materials" :key="index">
                  <el-button type="text" size="small">{{materialItem.name}}:{{materialItem.count}}{{materialItem.unit}}</el-button>
                </el-col>
              </template> 
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="send_person"
              label="发料人">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="receive_person"
              label="领料人">
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
        <el-tab-pane label="完工入库单" name="sixth">
          <el-table :data="storageList" v-loading="loading" height="100%" style="width: 100%;height: 100%" stripe>
             <el-table-column
              header-align="center"
              align="center"
              prop="id"
              label="入库单号">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="state"
              label="入库状态">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="completed_time"
              label="入库时间">
              <template slot-scope="scope">
                <p>{{getFullDate(scope.row.completed_time)}}</p>
              </template>
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="product"
              label="入库产品">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="target_count"
              label="计划生产">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="complete_count"
              label="实际生产">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="product_id"
              label="生产单号">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="send_person"
              label="交接人">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="receive_person"
              label="接收人">
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
        <el-tab-pane label="盘点审批单" name="seventh">
          <el-table :data="checkList" v-loading="loading" height="100%" style="width: 100%;height: 100%" stripe>
             <el-table-column
              header-align="center"
              align="center"
              prop="id"
              label="盘点单号">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="state"
              label="盘点状态">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="style"
              label="产品/物料">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="name"
              label="名称">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="check"
              label="盘点结果">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="check_person"
              label="盘点人">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="check_time"
              label="盘点时间">
              <template slot-scope="scope">
                <p>{{getFullDate(scope.row.check_time)}}</p>
              </template>
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="approval_person"
              label="审批人">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="approval_time"
              label="审批时间">
              <template slot-scope="scope">
                <p>{{getFullDate(scope.row.approval_time)}}</p>
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
              prop="time"
              label="创建时间">
              <template slot-scope="scope">
                <p>{{getFullDate(scope.row.time)}}</p>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="临时申购单" name="eighth">
          <el-table :data="temporaryPurchaseList" v-loading="loading" height="100%" style="width: 100%;height: 100%" stripe>
             <el-table-column
              header-align="center"
              align="center"
              prop="id"
              label="申购单号">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="state"
              label="申购状态">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="materials"
              label="申购物料">
              <template slot-scope="scope">
                <el-col :span="24" v-for="(materialItem,index) in scope.row.materials" :key="index">
                  <el-button type="text" size="small">{{materialItem.name}}:{{materialItem.count}}{{materialItem.unit}}</el-button>
                </el-col>
              </template> 
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="money"
              label="合计金额">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="creator"
              label="申购人">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="reason"
              label="申购原因">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="create_time"
              label="申购时间">
              <template slot-scope="scope">
                <p>{{getFullDate(scope.row.create_time)}}</p>
              </template>
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="approval"
              label="审批人">
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              prop="approval_time"
              label="审批时间">
              <template slot-scope="scope">
                <p>{{getFullDate(scope.row.approval_time)}}</p>
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
              prop="time"
              label="创建时间">
              <template slot-scope="scope">
                <p>{{getFullDate(scope.row.time)}}</p>
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
import {OrderList,ProductList,PurchaseList,InvoiceList,PickingList,StorageList,CheckList,TemporaryPurchaseList} from '@/utils/api'
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
      orderList:[],
      productList:[],
      purchaseList:[],
      invoiceList:[],
      pickingList:[],
      storageList:[],
      checkList:[],
      temporaryPurchaseList:[],
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
        phone: searchData.phone,
        name: searchData.name,
        company: searchData.company,
        row: this.row,
        page: this.page
      };
      this.index = tab.index || '0';
      let indexs = this.index || tab.index;
      this.loading = true;
      if(indexs==='0'){
        OrderList(params,'get').then((res) => { 
          this.loading = false;
          this.orderList = res.data
          this.total = res.total
        }).catch(() => {
          this.loading = false;
          this.$message.error('获取数据失败')
        })
      }
      if(indexs==='1'){
        ProductList(params,'get').then((res) => {
          this.loading = false;
          this.productList = res.data
          this.total = res.total
        }).catch(() => {
          this.loading = false;
          this.$message.error('获取数据失败')
        })
      }
      if(indexs==='2'){
        PurchaseList(params,'get').then((res) => {
          this.loading = false;
          this.purchaseList = res.data
          this.total = res.total
        }).catch(() => {
          this.loading = false;
          this.$message.error('获取数据失败')
        })
      }
      if(indexs==='3'){
        InvoiceList(params,'get').then((res) => {
          this.loading = false;
          this.invoiceList = res.data
          this.total = res.total
        }).catch(() => {
          this.loading = false;
          this.$message.error('获取数据失败')
        })
      }
      if(indexs==='4'){
        PickingList(params,'get').then((res) => {
          this.loading = false;
          this.pickingList = res.data
          this.total = res.total
        }).catch(() => {
          this.loading = false;
          this.$message.error('获取数据失败')
        })
      }
      if(indexs==='5'){
        StorageList(params,'get').then((res) => {
          this.loading = false;
          this.storageList = res.data
          this.total = res.total
        }).catch(() => {
          this.loading = false;
          this.$message.error('获取数据失败')
        })
      }
      if(indexs==='6'){
        CheckList(params,'get').then((res) => {
          this.loading = false;
          this.checkList = res.data
          this.total = res.total
        }).catch(() => {
          this.loading = false;
          this.$message.error('获取数据失败')
        })
      }
      if(indexs==='7'){
        TemporaryPurchaseList(params,'get').then((res) => {
          this.loading = false;
          this.temporaryPurchaseList = res.data
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
        overflow: scroll;
        .el-table__body-wrapper{
           height: 100%!important;
        }
        .el-tabs__content{
          height: 100%;
          flex: 1;
          overflow: scroll;
        }
      }
    }

  }
  .el-button--text{
    color: #606266;
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
