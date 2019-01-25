<template>
	<div class="members">
		<header>
			<el-breadcrumb separator="/" class='head'>
			  <el-breadcrumb-item :to="{ path: '/' }">用户管理</el-breadcrumb-item>
			  <el-breadcrumb-item><a href="javascript:;">会员管理</a></el-breadcrumb-item>
			</el-breadcrumb>
		</header>
		<div class="cont" @keyup.enter="search">
			<div class="searchMembers">
				<p>会员名称：</p>
				<el-input class='input' v-model="memberName" placeholder="请输入"></el-input>
				<p>所属代理人：</p>
				<el-input class='input' v-model="agent" placeholder="请输入"></el-input>
				<p>选择日期：</p>
				 <el-date-picker
			      v-model="date"
			      type="daterange"
			      align="right"
			      class='dateInput'
			      unlink-panels
			      range-separator="至"
			      start-placeholder="开始日期"
			      end-placeholder="结束日期"
			      @change='change'
			      :picker-options="pickerOptions">
			    </el-date-picker>
				<el-button type="primary" @click='search'>查询</el-button>
				<el-button @click='reset'>重置</el-button>
				<a href="javascript:;" class="down" @click='exportExcel'><el-button type="primary" class='getOut' >导出</el-button></a>
			</div>
			<div class="table">
				<el-table
				    ref="multipleTable"
				    :data="data"
				    id='out-table'
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
				      label="会员名称"
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
				      prop="nickName"
				      align="center"
				      label="微信昵称"
				      >
				    </el-table-column>
				    <el-table-column
				      prop="registrationTime"
				      align="center"
				      label="注册时间"
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
							width='140'
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
				      prop="receiveMoney"
				      label="已领红包金额（元）"
				      align="center"
							width='150'
				      >
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
			      :page-sizes="[8,10, 20, 30, 40,50,100]"
			      :page-size="size"
			      layout="total, prev, pager, next, jumper"
			      :total="total">
			    </el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
	import FileSaver from 'file-saver'
	import XLSX from 'xlsx'
	import axios from 'axios'
	import Qs from 'qs'
	import store from '@/store'
	import getUrl from '@/assets/js/getUrl.js';
	export default{
		name:'Members',
		data(){
			return{
				url:'',
				date:'',
				currentPage4:1,
				memberName:'',
				agent:'',
				data:[],
				total:0,
				size:8,
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
			exportExcel () {
		         /* generate workbook object from table */
		        //  var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'))
		        //  /* get binary string as output */
		        //  var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
		        //  try {
		        //      FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '会员列表.xlsx')
		        //  } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
						//  return wbout

						//导出会员列表
						$('.down').attr('href',this.url+'/platformManage/exportMembersList?startTime='+this.begin+'&endTime='+this.end+'&xm='+this.memberName+'&inviterXm='+this.agent)
						return false
		     },
			// exportMembersList(){
			// 	//导出会员列表
			// 	let data={
			// 		"startTime":this.begin, //开始时间（非必传）yyyy-mm-dd
			// 		"endTime":this.end, //结束时间（非必传）yyyy-mm-dd
			// 		"xm":this.memberName, //会员姓名（非必传）
			// 		"inviterXm":this.agent, //所属代理人姓名（非必传）
			// 	}
			// 	// axios.get(this.url+'/platformManage/exportMembersList',{headers:{'Content-Type':'application/octet-stream'}},{params:data}).then(res=>{
			// 	// 	console.log(res)
			// 	// })
			// 	axios({
			// 		headers:{'Content-Type':'application/octet-stream'},
			// 		method: 'get',
			// 		url: this.url+'/platformManage/exportMembersList',
			// 		params:Qs.stringify(data)
			// 	}).then(res=>{
			// 		console.log(res)
			// 	})
			// },
			reset(){
				//重置 
				let timer=null
				store.dispatch('index','')
				timer=setInterval(()=>{
					clearInterval(timer)
					store.dispatch('index','members')
				},50)
			},
			search(){
				//查询
				let data={
					"startTime":this.begin, //开始时间（非必传）yyyy-mm-dd
					"endTime":this.end, //结束时间（非必传）yyyy-mm-dd
					"xm":this.memberName, //会员姓名（非必传）
					"inviterXm":this.agent, //所属代理人姓名（非必传）
					"page": this.currentPage4, // 分页参数页码（非必传）
					"rows": this.size // 分页参数-页条数（非必传）
				}
				axios({
					headers:{'Content-Type':'application/x-www-form-urlencoded'},
					method: 'post',
					url: this.url+'/platformManage/getMembersList',
					data:Qs.stringify(data),
					timeout:10000
				}).then(res=>{
//					console.log(res.data.rows)
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
				//时间选择
				if(val){
					let begin=val[0]
					let end=val[1]
					let beginY=begin.getFullYear()
					let beginM=begin.getMonth()+1
					if(beginM<10){
						beginM='0'+beginM
					}
					let beginD=begin.getDate()
					if(beginD<10){
						beginD='0'+beginD
					}
					let endY=end.getFullYear()
					let endM=end.getMonth()+1
					if(endM<10){
						endM='0'+endM
					}
					let endD=end.getDate()
					if(endD<10){
						endD='0'+endD
					}
					this.begin=beginY+'-'+beginM+'-'+beginD
					this.end=endY+'-'+endM+'-'+endD
				}
				
			},
			getMembersList(){
				//获取会员列表
				let data={
					"page": this.currentPage4, // 分页参数页码（非必传）
					"rows": this.size
				}
				axios({
					headers:{'Content-Type':'application/x-www-form-urlencoded'},
					method: 'post',
					url: this.url+'/platformManage/getMembersList',
					data:Qs.stringify(data),
					timeout:10000
				}).then(res=>{
//					console.log(res.data.rows)
					this.data=res.data.rows;
					this.data.forEach((item,index)=>{
						this.data[index].date =index+1
					})
					this.total=res.data.total
				}).catch((error)=>{
						this.$message.error('请求错误!');
				});
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
			}
		},
		mounted(){
			let url=getUrl()
			this.url=url
			this.getMembersList()
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
		width:15vh;
		margin-right: 20px;
	}
	.dateInput{
		width: 25vh !important;
		margin-right: 20px !important;
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