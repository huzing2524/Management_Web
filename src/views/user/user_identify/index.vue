<template>
  <div id="manage-identify">
    <div class="manage-identify-search" @keyup.enter="searchBtnClick()">
      <el-form :inline="true" :model="formData">
        <el-form-item label="手机号">
          <el-input v-model="formData.id" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="formData.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="formData.name" placeholder="姓名"></el-input>
        </el-form-item>

        <el-form-item label="国家或地区">
          <el-select v-model="formData.country" placeholder="国家或地区" clearable>
            <el-option v-for="(country,index) in countries" :label="country" :value="index" :key="index"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="提交时间">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-date-picker type="date" placeholder="开始日期" v-model="formData.start"></el-date-picker>
            </el-col>
            <el-col :span="12">
              <el-date-picker type="date" placeholder="结束日期" v-model="formData.end"></el-date-picker>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="认证状态" style="margin-right: 50px;">
          <el-select v-model="formData.identifyState" placeholder="选择认证状态" clearable>
            <el-option
              v-for="item in stateList"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchBtnClick()">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="manage-identify-table">
      <el-table :data="tableData" height="100%" v-loading="loading" style="width: 100%;height: 100%" stripe>
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column label="用户名">
          <template slot-scope="scope">
            <el-button type="text" size="small">{{scope.row.username}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="country" label="国家或地区"></el-table-column>
        <el-table-column label="证件1">
          <template slot-scope="scope">
            <img :src="scope.row.image1" style="width: 100%;height: 100%"
                 @click="clickImg = scope.row.image1;dialogFormVisible = true">
          </template>
        </el-table-column>
        <el-table-column label="证件2">
          <template slot-scope="scope">
            <img :src="scope.row.image2" style="width: 100%;height: 100%"
                 @click="clickImg = scope.row.image2;dialogFormVisible = true">
          </template>
        </el-table-column>
        <el-table-column label="证件3">
          <template slot-scope="scope">
            <img v-if="scope.row.type !== 'passport'" :src="scope.row.image3" style="width: 100%;height: 100%"
                 @click="clickImg = scope.row.image3;dialogFormVisible = true">
          </template>
        </el-table-column>
        <el-table-column prop="time" label="提交时间">
          <template slot-scope="scope">
            {{scope.row.time | getFullDate}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!--0未认证 1认证中 2认证未通过 3认证通过-->
            <template v-if="parseInt(scope.row.state) === 2">
              <div style="color:red">{{scope.row.msg?scope.row.msg:'认证未通过'}}</div>
            </template>
            <template v-else-if="parseInt(scope.row.state) === 3">
              <div>认证通过</div>
            </template>
            <template v-else>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-button @click="passClick(scope.$index,scope.row)" type="primary" size="small">通过</el-button>
                </el-col>
                <el-col :span="12">
                  <el-button @click="notPassClick(scope.$index,scope.row)" type="danger" size="small">未通过</el-button>
                </el-col>
              </el-row>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="manage-identify-page">
      <el-pagination
        :small="true"
        :background="false"
        :page-size="row"
        :total="total"
        :current-page.sync="page"
        @current-change="handleCurrentChange"
        layout="prev, pager, next,total,jumper"
      >
      </el-pagination>
    </div>
    <el-dialog :visible.sync="dialogFormVisible">
      <img :src="clickImg" alt="" style="width:100%">
    </el-dialog>
  </div>
</template>

<script>
  import { postBgauth, GetBglist } from '_utils/api'
  import { getFullDate, Countries, ArrangeParams } from '_utils/common'

  export default {
    name: "manage-identify",
    data() {
      return {
        countries: Countries,
        formData: {
          id: '',
          username: '',
          name: '',
          country: '',
          start: '',
          end: '',
        },
        //phone,username
        tableData: [],
        loading: false,
        row: 10,
        total: 0,
        page: 1,
        dialogFormVisible: false,
        clickImg: '',
        stateList:[
          {
            key:'1',
            value:'未认证'
          },
          {
            key:'2',
            value:'认证未通过'
          },
          {
            key:'3',
            value:'认证通过'
          },
        ],
        identifyState:'',
      }
    },
    filters: {
      getFullDate(val) {
        return getFullDate(val)
      }
    },
    methods: {
      initData() {
        this.page = 1
        this.getBglist()
      },
      searchBtnClick() {
        this.page = 1
        this.getBglist()
      },
      passClick(index, row) {
        let id = row.id
        let state = '3'
        let msg = ''
        postBgauth({id, state, msg}).then((res) => {
          if (parseInt(res.res) === 0) {
            row.state = '3'
            this.$message({type: 'success', message: "操作完成!",})
          } else {
            this.$message({type: 'error', message: res.errmsg})
          }
        }).catch(() => {
          this.$message({type: 'error', message: '操作失败',})
        })
      },
      inputValidator(val) {
        if (val.length > 10) {
          return '已超出字数'
        }
        return true
      },
      notPassClick(index, row) {
        this.$prompt('', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '输入未通过的理由，10字以内',
          inputValidator: this.inputValidator,
        }).then(({value}) => {
          let id = row.id
          let state = '2'
          let msg = value
          postBgauth({id, state, msg}).then((res) => {
            if (parseInt(res.res) === 0) {
              row.state = '2'
              this.$message({type: 'success', message: "操作完成!",})
            } else {
              this.$message({type: 'error', message: res.data.errmsg,})
            }
          }).catch(() => {
            this.$message({type: 'error', message: '操作失败',})
          })
        }).catch(() => {
        })
      },
      handleCurrentChange() {
        this.getBglist()
      },
      async getBglist() {
        this.loading = true
        let params = {
          id: this.formData.id,
          username: this.formData.username,
          name: this.formData.name,
          country: this.countries[this.formData.country],
          start: this.formData.start ? (new Date(this.formData.start).getTime() / 1000) + '' : '',
          end: this.formData.end ? (new Date(this.formData.end).getTime() / 1000) + '' : '',
          state: this.formData.identifyState,
          page: this.page,
          row: this.row
        }
        try {
          let res = await GetBglist(ArrangeParams(params))
          this.loading = false
          this.total = res.total
          res.data.forEach((item) => {
            item.image1 = item.image1
            item.image2 = item.image2
            item.image3 = item.image3
          })
          this.tableData = res.data
        } catch (e) {
          this.loading = false
        }
      },
    },
    mounted() {
      this.initData()
    }
  }
</script>

<style lang="less">
  @rem: 46.875rem;

  #manage-identify {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .manage-identify-search {
    margin: 0 10px;
    margin-top: 10px;
  }

  .manage-identify-table {
    flex: 1;
    margin-bottom: 50px;
    .el-table__body-wrapper {
      overflow: scroll;
    }
  }

  .el-table th > .cell {
    font-weight: bold;
    color: #333;
  }

  .el-table td > .cell {
    color: #333;
  }

  .el-table--border::after, .el-table--group::after, .el-table::before,
  .el-table__fixed-right::before, .el-table__fixed::before {
    background: transparent !important;
  }

  .manage-identify-page {
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

</style>
