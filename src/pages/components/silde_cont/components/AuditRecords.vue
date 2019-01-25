<template>
	<div class="notAudit">
		<div v-if="show=='auditRecords'">
		<header>
			<el-breadcrumb separator="/" class='head'>
			  <el-breadcrumb-item :to="{ path: '/' }">截图管理</el-breadcrumb-item>
			  <el-breadcrumb-item><a href="javascript:;">审核记录</a></el-breadcrumb-item>
			</el-breadcrumb>
		</header>
		<div class="cont">
			<div class="searchCupture">
				<p>选择日期：</p>
				 <el-date-picker
			      v-model="date"
			      type="daterange"
			      align="right"
			      value-format="yyyy-MM-dd"
			      @change='change'
			      class='dateInput'
			      unlink-panels
			      range-separator="至"
			      start-placeholder="开始日期"
			      end-placeholder="结束日期"
			      :picker-options="pickerOptions">
			    </el-date-picker>
				<p>短信截图状态：</p>
				<el-select class='input' v-model="msgState" filterable placeholder="请选择">
				    <el-option
				      v-for="item in msgStates"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				 </el-select>
				<p>卡片状态：</p>
				<el-select class='input' v-model="cardState" filterable placeholder="请选择">
				    <el-option
				      v-for="item in cardStates"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				 </el-select>
				 <p>申请银行：</p>
				<el-select class='input' v-model="bank" filterable placeholder="请选择">
				    <el-option
				      v-for="item in options"
				      :key="item.productName"
				      :label="item.productName"
				      :value="item.productId">
				    </el-option>
				 </el-select>
			</div>
			<div class="searchCupture">
				<p>关键字：</p>
				<el-input class='input' v-model="keyword" placeholder="请输入姓名/手机号"></el-input>
				<el-button type="primary" @click='search'>查询</el-button>
				<el-button @click='reset'>重置</el-button>
			</div>
			<div class="table">
				<el-table
				    ref="multipleTable"
				    :data="data"
				    max-height='64vh'
						border
				    tooltip-effect="dark"
				    style="width: 100%"
				    @selection-change="handleSelectionChange">
				    <!--<el-table-column
				      type="selection"
				      >
				    </el-table-column>-->
				    <el-table-column
				      label="序号"
				      align="center"
				      width='50'
				      >
				      <template slot-scope="scope">{{ scope.row.date }}</template>
				    </el-table-column>
				    <el-table-column
				      prop="xm"
				      label="姓名"
				      align="center"
				      >
				    </el-table-column>
				    <el-table-column
				      prop="mobile"
				      align="center"
				      label="手机号"
				      >
				    </el-table-column>
				    <el-table-column
				      prop="productName"
				      label="申请银行"
				      align="center"
				      >
				    </el-table-column>
				    <el-table-column
				      prop="state"
				      label="短信截图"
				      align="center"
				      >
				    </el-table-column>
				    <el-table-column
				      prop="cradstate"
				      label="卡片照片"
				      align="center"
				      >
				    </el-table-column>
				    <el-table-column
				      prop="receiveNum"
				      label="已领红包个数"
				      align="center"
				      >
				    </el-table-column>
				    <el-table-column
				      prop="receiveMoney"
				      label="已领红包金额"
				      align="center"
				      >
				    </el-table-column>
				    <el-table-column
				      label="操作"
				      align="center"
				      >
				      <template scope="scope">
				        <a href="javascript:;" @click="detail(scope.row.registrationId,scope.row.productId)">详情</a>
				    </template>
				    </el-table-column>
				  </el-table>
				  <div class="pages">
						<p></p>
						 <el-pagination
					      @size-change="handleSizeChange"
					      @current-change="handleCurrentChange"
					      :current-page="currentPage4"
								background
					      :page-sizes="[7,10, 20, 30, 40]"
					      :page-size="size"
					      layout="total,  prev, pager, next, jumper"
					      :total="total">
					    </el-pagination>
					</div>
			</div>
		</div>
		</div>
		<AuditRecordsDetail :productId='productId' @show='showRe' :registrationId='registrationId' v-if="show=='details'"/>
	</div>
</template>

<script>
	import axios from 'axios'
	import Qs from 'qs'
	import getUrl from '@/assets/js/getUrl.js';
	import store from '@/store'
	import AuditRecordsDetail from './AuditRecordsDetail'
	export default{
		name:'AuditRecords',
		components:{
			AuditRecordsDetail
		},
		data(){
			return{
				registrationId:'',
				productId:'',
				show:'auditRecords',
				msgState:'',
				msgStates:[
				{
		          value: '-1',
		          label: '审核失败'
		        },
				{
		          value: '0',
		          label: '未提交'
		        },
				{
		          value: '1',
		          label: '已提交'
		        },
				{
		          value: '2',
		          label: '审核通过'
		        },],
				cardState:'',
				cardStates:[
				{
		          value: '-1',
		          label: '审核失败'
		        },
				{
		          value: '0',
		          label: '未提交'
		        },
				{
		          value: '1',
		          label: '已提交'
		        },
				{
		          value: '2',
		          label: '审核通过'
		        },],
				size:7,
				currentPage4:1,
				data:[],
				url:'',
				total:0,
				role:'',
				roles:[{
		          value: '0',
		          label: '会员'
		        },{
		          value: '1',
		          label: '代理'
		        }],
				cuptureKind:'',
				cuptureKinds:[{
		          value: '0',
		          label: '银行短信截图'
		        },{
		          value: '1',
		          label: '卡片截图'
		        }],
				date:'',
				bank:'',
				options: [],
				bankName:'',
				keyword:'',
				tableData3: [],
				begin:'',
				end:'',
				pickerOptions: {
		          shortcuts: [{
		            text: '最近一周',
		            onClick(picker) {
		              const end = new Date();
		              const start = new Date();
		              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
		              picker.$emit('pick', [start, end]);
		            }
		          }, {
		            text: '最近一个月',
		            onClick(picker) {
		              const end = new Date();
		              const start = new Date();
		              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
		              picker.$emit('pick', [start, end]);
		            }
		          }, {
		            text: '最近三个月',
		            onClick(picker) {
		              const end = new Date();
		              const start = new Date();
		              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
		              picker.$emit('pick', [start, end]);
		            }
		          }]
		        },
			}
		},
		methods:{
			showRe(val){
				this.show=val
			},
			reset(){
				//重置 
				let timer=null
				store.dispatch('index','')
				timer=setInterval(()=>{
					clearInterval(timer)
					store.dispatch('index','auditRecords')
				},50)
			},
			search(){
				//查询
				let data={
						"smsState":this.msgState, //短信状态（非必传）
						"cardState":this.cardState, //卡片状态（非必传）
						"productId":this.bank, //产品id（非必传）
						"keyword":this.keyword, // 关键字（非必传）
						"startTime":this.begin, //开始时间（非必传）yyyy-mm-dd
						"endTime":this.end, //结束时间（非必传）yyyy-mm-dd
						"page": this.currentPage4, // 分页参数页码（非必传）
						"rows": this.size, // 分页参数-页条数（非必传）
				}
				axios({
					headers:{'Content-Type':'application/x-www-form-urlencoded'},
					method: 'post',
					url: this.url+'/platformManage/getHasAuditList',
					data:Qs.stringify(data),
					timeout:10000
				}).then(res=>{
					// console.log(res)
					this.data=res.data.rows;
					this.data.forEach((item,index)=>{
						//添加序号
						if(this.currentPage4>1){
							this.data[index].date =(this.currentPage4-1)*this.size+index+1
						}else{
							this.data[index].date =index+1
						}
						switch (item.imgState){
							case 0:this.data[index].state='未提交'
							break;
							case -1:this.data[index].state='审核失败'
							break;
							case 1:this.data[index].state='已提交'
							break;
							case 2:this.data[index].state='审核通过'
							break;
						}
						switch (item.cardState){
							case 0:this.data[index].states='未提交'
							break;
							case -1:this.data[index].states='审核失败'
							break;
							case 1:this.data[index].states='已提交'
							break;
							case 2:this.data[index].states='审核通过'
							break;
						}
					})
					this.total=res.data.total
					if(this.currentPage4-1>this.total/this.size){
						this.currentPage4=1
						this.sreach()
					}
				}).catch((error)=>{
						this.$message.error('请求错误!');
				});
			},
			change(val){
				let begin=val[0]
				let end=val[1]
				this.begin=begin
				this.end=end
//				console.log(begin,end)
			},
			handleSelectionChange(val){
				
			},
			detail(rId,pId){
				//查看详情
				this.productId=pId
				this.registrationId=rId
				this.show='details'
			},
			handleSizeChange(val){
				//选择每页数据条数
				this.size=val
				this.search()
			},
			handleCurrentChange(val){
				//当前页码
				this.currentPage4=val
				this.search()
			},
			getHasAuditList(){
				let data={
						"rows": this.size,
						"page": this.currentPage4
				}
				axios({
					headers:{'Content-Type':'application/x-www-form-urlencoded'},
					method: 'post',
					url: this.url+'/platformManage/getHasAuditList',
					data:Qs.stringify(data),
					timeout:10000
				}).then(res=>{
					// console.log(res)
					this.data=res.data.rows
					this.data.forEach((item,index)=>{
						this.data[index].date =index+1
						if(this.currentPage4>1){
							this.data[index].date =(this.currentPage4-1)*this.size+index+1
						}else{
							this.data[index].date =index+1
						}
						switch (item.smsState){
							case '0':this.data[index].state='未提交'
							break;
							case '-1':this.data[index].state='审核失败'
							break;
							case '1':this.data[index].state='已提交'
							break;
							case '2':this.data[index].state='审核通过'
							break;
						}
						switch (item.cardState){
							case '0':this.data[index].cradstate='未提交'
							break;
							case '-1':this.data[index].cradstate='审核失败'
							break;
							case '1':this.data[index].cradstate='已提交'
							break;
							case '2':this.data[index].cradstate='审核通过'
							break;
						}
					})
					this.total=res.data.total
				}).catch((error)=>{
						this.$message.error('请求错误!');
				});
			},
			getBank(){
				//银行列表
				axios({
					headers:{'Content-Type':'application/x-www-form-urlencoded'},
					method: 'post',
					url: this.url+'/platformManage/getProductList',
					timeout:10000
				}).then(res=>{
//					console.log(res.data.rows)
					this.options=res.data.rows
				}).catch((error)=>{
						this.$message.error('请求错误!');
				});
			}
		},
		mounted(){
			let url=getUrl()
			this.url=url
			this.getHasAuditList();
			this.getBank()
		}
	}
</script>

<style scoped>
	header{
		background: white;
		height: 6vh;
	}
	.head{
		line-height: 6vh;
		padding-left: 20px;
		border-left: 2px solid deepskyblue;
	}
	.cont{
		margin: 1.5vh 2vh 0 2vh;
		background: white;
		overflow: hidden;
	}
	.searchCupture{
		display: flex;
		padding-left: 20px;
		height: 7vh;
		align-items: center;
		line-height: 7vh;
		font-size: 14px;
	}
	.input{
		width: 17vh;
		margin-right: 20px;
	}
	.dateInput{
		width: 25vh;
		margin-right: 20px;
	}
	.getOut{
		margin-left: 8vh;
	}
	.table{
		
		padding:0 20px;
		/*overflow-y: scroll;
		height:72vh;*/
	}
	.table a{
		text-decoration: none;
		color: deepskyblue;
	}
	.pages{
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20px;
	}
</style>