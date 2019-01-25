<template>
	<div class="agentApproval">
		<div v-if="show=='agentApproval'">
		<header>
			<el-breadcrumb separator="/" class='head'>
			  <el-breadcrumb-item :to="{ path: '/' }">用户管理</el-breadcrumb-item>
			  <el-breadcrumb-item><a href="javascript:;">代理人审批</a></el-breadcrumb-item>
			</el-breadcrumb>
		</header>
		<div class="cont">
			<div class="searchMembers">
				
				<p>学校名称：</p>
				<el-input class='input' v-model="schoolName" placeholder="请输入"></el-input>
				<p>代理人名称：</p>
				<el-input class='input' v-model="agent" placeholder="请输入"></el-input>
				<p>所属代理人：</p>
				<el-input class='input' v-model="inviterXm" placeholder="请输入"></el-input>
				<p>选择日期：</p>
				 <el-date-picker
			      v-model="date"
			      type="daterange"
			      align="right"
			      class='dateInput'
			      unlink-panels
			      @change='change'
			      value-format="yyyy-MM-dd"
			      range-separator="至"
			      start-placeholder="开始日期"
			      end-placeholder="结束日期"
			      :picker-options="pickerOptions">
			    </el-date-picker>
				<el-button type="primary" @click='search'>查询</el-button>
				<el-button @click='reset'>重置</el-button>
				<!--<el-button type="primary" class='getOut'>导出</el-button>-->
			</div>
			<div class="table">
				<el-table
				    ref="multipleTable"
				    :data="data"
						border
				    max-height='72vh'
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
				      label="申请人姓名"
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
				      prop="schoolName"
				      align="center"
				      label="学校名称"
				      >
				    </el-table-column>
				    <el-table-column
				      prop="registrationTime"
				      align="center"
				      label="申请代理时间"
				      >
				    </el-table-column>
				    <el-table-column
				      prop="inviterXm"
				      label="所属代理人"
				      align="center"
				      >
				    </el-table-column>
				    <el-table-column
				      prop="inviterMobile"
				      label="代理人手机号"
				      align="center"
				      >
				    </el-table-column>
				    <el-table-column
				      prop="cardNum"
				      label="办卡数"
				      align="center"
				      >
				    </el-table-column>
				    <el-table-column
				      prop="uploadNum"
				      label="上传截图数"
				      align="center"
				      >
				    </el-table-column>
				    <el-table-column
				      prop="receiveNum"
				      label="已领红包数"
				      align="center"
				      >
				    </el-table-column>
				    <el-table-column
				      label="操作"
				      align="center"
				      >
				      <template scope="scope">
				        <a href="javascript:;" @click="approval(scope.row.registrationId)">审核</a>
				    </template>
				    </el-table-column>
				  </el-table>
			</div>
			<div class="pages">
				<p></p>
				 <el-pagination
			      @size-change="handleSizeChange"
			      @current-change="handleCurrentChange"
						background
			      :current-page="currentPage4"
			      :page-sizes="[8,10, 20, 30, 40]"
			      :page-size="size"
			      layout="total, prev, pager, next, jumper"
			      :total="total">
			    </el-pagination>
			</div>
		</div>
		</div>
		<AgentApprovalDetail :registrationId='registrationId' v-if="show=='approval'" @show='showapproval'/>
	</div>
</template>

<script>
	import store from '@/store'
	import axios from 'axios'
	import Qs from 'qs'
	import getUrl from '@/assets/js/getUrl.js';
	import AgentApprovalDetail from './AgentApprovalDetail';
	export default{
		name:'AgentApproval',
		components:{
			AgentApprovalDetail
		},
		data(){
			return{
				show:'agentApproval',
				date:'',
				currentPage4:1,
				data:[],
				url:'',
				total:0,
				inviterXm:'',
				size:8,
				schoolName:'',
				agent:'',
				tableData3: [],
				begin:'',
				end:'',
				registrationId:'',
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
			showapproval(val){
				this.show=val
				this.getAgentAuditList();
			},
			reset(){
				//重置 
				let timer=null
				store.dispatch('index','')
				timer=setInterval(()=>{
					clearInterval(timer)
					store.dispatch('index','agentApproval')
				},50)
			},
			approval(id){
				//审批
				this.registrationId=id
				this.show='approval'
			},
			search(){
				//查询
				let data={
						"inviterXm":this.inviterXm, //所属代理人姓名（非必传）
						"startTime":this.begin, //开始时间（非必传）yyyy-mm-dd
						"endTime":this.end, //结束时间（非必传）yyyy-mm-dd
						"xm":this.agent, //代理人姓名（非必传）
						"schoolName":this.schoolName, //学校名称（非必传）
						"page": this.currentPage4, // 分页参数页码（非必传）
						"rows": this.size, // 分页参数-页条数（非必传）
				}
				axios({
					headers:{'Content-Type':'application/x-www-form-urlencoded'},
					method: 'post',
					url: this.url+'/platformManage/getAgentAuditList',
					data:Qs.stringify(data),
					timeout:10000
				}).then(res=>{
//					console.log(res)
					this.data=res.data.rows;
					this.data.forEach((item,index)=>{
						//添加序号
						if(this.currentPage4>1){
							this.data[index].date =(this.currentPage4-1)*this.size+index+1
						}else{
							this.data[index].date =index+1
						}
					})
					this.total=res.data.total
					if(this.currentPage4-1>this.total/this.size){
						this.currentPage4=1
						this.search()
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
			},
			handleSelectionChange(){
				
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
			getAgentAuditList(){
				let data={
					"page": this.currentPage4, // 分页参数页码（非必传）
					"rows": this.size,
				}
				axios({
					headers:{'Content-Type':'application/x-www-form-urlencoded'},
					method: 'post',
					url: this.url+'/platformManage/getAgentAuditList',
					data:Qs.stringify(data),
					timeout:10000
				}).then(res=>{
//					console.log(res)
					this.data=res.data.rows
					this.data.forEach((item,index)=>{
						this.data[index].date =index+1
					})
					this.total=res.data.total
				}).catch((error)=>{
						this.$message.error('请求错误!');
				});
			}
		},
		mounted(){
			let url=getUrl()
			this.url=url
			this.getAgentAuditList();
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
	.searchMembers{
		display: flex;
		padding-left: 20px;
		height: 7vh;
		align-items: center;
		line-height: 7vh;
		font-size: 14px;
	}
	.input{
		width: 13vh;
		margin-right: 1vh;
	}
	.dateInput{
		width: 25vh;
		margin-right: 1vh;
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