<template>
	<div class="agent">
		<div v-if="show=='agent'">
		<header>
			<el-breadcrumb separator="/" class='head'>
			  <el-breadcrumb-item :to="{ path: '/' }">用户管理</el-breadcrumb-item>
			  <el-breadcrumb-item><a href="javascript:;">代理人管理</a></el-breadcrumb-item>
			</el-breadcrumb>
		</header>
		<div class="cont">
			<div class="searchMembers">
				
				<p>学校名称：</p>
				<el-input class='input' v-model="schoolName" placeholder="请输入"></el-input>
				<p>代理人名称：</p>
				<el-input class='input' v-model="agent" placeholder="请输入"></el-input>
				<p>选择日期：</p>
				 <el-date-picker
			      v-model="date"
			      type="daterange"
			      align="right"
			      class='dateInput'
			      unlink-panels
     			  value-format="yyyy-MM-dd"
			      @change='change'
			      range-separator="至"
			      start-placeholder="开始日期"
			      end-placeholder="结束日期"
			      :picker-options="pickerOptions">
			    </el-date-picker>
				<el-button type="primary" @click='search'>查询</el-button>
				<el-button @click='reset'>重置</el-button>
				<a href="javascript:;" class="down getOut" @click='exportExcel'><el-button type="primary" >导出</el-button></a>
			</div>
			<div class="table">
				<el-table
				    ref="multipleTable"
				    :data="data"
				    id='out-table'
				    max-height='72vh'
						border
				    @sort-change="sort"
				    tooltip-effect="dark"
				    :default-sort = "{prop: 'date', order: 'descending'}"
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
				      label="代理人"
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
				      prop="nickName"
				      align="center"
				      label="微信昵称"
				      >
				    </el-table-column>
				    <el-table-column
				      prop="changeLevelTime"
				      label="加入代理时间"
				      align="center"
							width='110'
				      >
				    </el-table-column>
				    <el-table-column
				      prop="membersNum"
				      label="会员数"
				      sortable='custom'
				      align="center"
				      >
				    </el-table-column>
				    <el-table-column
				      prop="integral"
				      label="积分"
				      sortable='custom'
							ref='sort-integral'
				      align="center"
				      >
				    </el-table-column>
				    <el-table-column
				      prop="bonus"
				      label="奖励金"
				      sortable='custom'
				      align="center"
				      >
				    </el-table-column>
				    <el-table-column
				      prop="uploadNum"
				      label="会员上传截图数"
				      sortable='custom'
				      align="center"
							width='150'
				      >
				    </el-table-column>
				    <el-table-column
				      prop="throughNum"
				      label="审核成功数"
				      sortable='custom'
				      align="center"
							width='120'
				      >
				    </el-table-column>
				    <el-table-column
				      align="center"
				      label="操作"
				      >
				      <template scope="scope">
				        <a href="javascript:;" @click="details(scope.row.registrationId)">详情</a>
				    </template>
				    </el-table-column>
				  </el-table>
			</div>
			<div class="pages">
				<p></p>
				 <el-pagination
			      @size-change="handleSizeChange"
						background
			      @current-change="handleCurrentChange"
			      :current-page="currentPage4"
			      :page-sizes="[8,10, 20, 30, 40,50,100]"
			      :page-size="size"
			      layout="total, prev, pager, next, jumper"
			      :total="total">
			    </el-pagination>
			</div>
		</div>
		</div>
		<AgentDetails v-if="show=='details'" :registrationId='registrationId' @show='showDetail'/>
	</div>
</template>

<script>
	import FileSaver from 'file-saver'
	import XLSX from 'xlsx'
	import axios from 'axios'
	import Qs from 'qs'
	import store from '@/store'
	import getUrl from '@/assets/js/getUrl.js';
	import AgentDetails from './AgentDetails';
	export default{
		name:'Agent',
		components:{
			AgentDetails
		},
		data(){
			return{
				sortField:'',
				sortWay:'',
				show:'agent',
				date:'',
				url:'',
				schoolName:'',
				agent:'',
				currentPage4:1,
				data:[],
				total:0,
				begin:'',
				end:'',
				size:8,
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
			exportExcel () {
		        //  /* generate workbook object from table */
		        //  var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'))
		        //  /* get binary string as output */
		        //  var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
		        //  try {
		        //      FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '代理人列表.xlsx')
		        //  } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
						//  return wbout
						
						$('.down').attr('href',this.url+'/platformManage/exportAgentList?startTime='+this.begin+'&endTime='+this.end+'&xm='+this.agent+'&schoolName='+this.schoolName+'&sortWay='+this.sortWay+'&sortField='+this.sortField)
						return false
		     },
			sort(column, prop, order){
				//排序
				this.sortField=column.prop
				// if(order){
					if(column.order=='ascending'){
						this.sortWay='asc'
					}else if(column.order=='descending'){
						this.sortWay='desc' 
					}
				// }
				this.search()
			},
			showDetail(val){
				this.show=val
			},
			details(id){
				this.registrationId=id
				this.show='details'
			},
			reset(){
				//重置 
				let timer=null
				store.dispatch('index','')
				timer=setInterval(()=>{
					clearInterval(timer)
					store.dispatch('index','agent')
				},50)
			},
			search(){
				//查询
				let data={
						"startTime":this.begin, //开始时间（非必传）yyyy-mm-dd
						"endTime":this.end, //结束时间（非必传）yyyy-mm-dd
						"xm":this.agent, //代理人姓名（非必传）
						"sortWay": this.sortWay,
						"schoolName":this.schoolName, //学校名称（非必传）
						"page": this.currentPage4, // 分页参数页码（非必传）
						"rows": this.size, // 分页参数-页条数（非必传）
						"sortField": this.sortField
				}
				axios({
					headers:{'Content-Type':'application/x-www-form-urlencoded'},
					method: 'post',
					url: this.url+'/platformManage/getAgentList',
					data:Qs.stringify(data),
					timeout:10000
				}).then(res=>{
					// console.log(res.data.rows)
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
			getAgentList(){
				let data={
					"page": this.currentPage4, // 分页参数页码（非必传）
					"rows": this.size,
				}
				axios({
					headers:{'Content-Type':'application/x-www-form-urlencoded'},
					method: 'post',
					url: this.url+'/platformManage/getAgentList',
					data:Qs.stringify(data),
					timeout:10000
				}).then(res=>{
//					console.log(res.data.rows)
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
			this.getAgentList();
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
		width: 15vh;
		margin-right: 20px;
	}
	.dateInput{
		width: 28vh;
		margin-right: 20px;
	}
	.getOut{
		margin-left: 5vh;
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