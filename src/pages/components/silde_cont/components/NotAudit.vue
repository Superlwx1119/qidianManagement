<template>
	<div class="notAudit">
		<div v-if="show=='notAudit'">
		<header>
			<el-breadcrumb separator="/" class='head'>
			  <el-breadcrumb-item :to="{ path: '/' }">截图管理</el-breadcrumb-item>
			  <el-breadcrumb-item><a href="javascript:;">待审核截图</a></el-breadcrumb-item>
			</el-breadcrumb>
		</header>
		<div class="cont" @keyup.enter="search">
			<div class="searchCupture">
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
				<p>角色：</p>
				<el-select class='input' v-model="role" filterable placeholder="请选择">
				    <el-option
				      v-for="item in roles"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				 </el-select>
				<p>上传截图类型：</p>
				<el-select class='input' v-model="cuptureKind" filterable placeholder="请选择">
				    <el-option
				      v-for="item in cuptureKinds"
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
				<el-button type="primary" @click="aduitMany(2)">批量审批通过</el-button>
				<el-button @click="aduitMany(-1)">批量审批拒绝</el-button>
			</div>
			<div class="table">
				<div class="clear">
					<span class="iconfont">&#xe71a;</span>
					<p>已选择<span>{{list.length}}</span>项</p>
					<a href="javascript:;" @click="clear">清空</a>
				</div>
				<el-table
				    ref="multipleTable"
						border
						class="tables"
				    :data="data"
				    max-height='64vh'
				    tooltip-effect="dark"
				    style="width: 100%"
				    @selection-change="handleSelectionChange">
				    <el-table-column
				      type="selection"
				      >
				    </el-table-column>
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
				      prop="nickName"
				      align="center"
				      label="微信昵称"
				      >
				    </el-table-column>
				    <el-table-column
				      prop="role"
				      align="center"
				      label="角色"
				      >
				    </el-table-column>
				    <el-table-column
				      prop="productName"
				      label="申请银行"
				      align="center"
				      >
				    </el-table-column>
				    <el-table-column
				      prop="typeImg"
				      label="上传截图类型"
				      align="center"
				      >
				    </el-table-column>
				    <el-table-column
				      prop="imgUpTime"
				      label="上传时间"
				      align="center"
				      >
				    </el-table-column>
				    <el-table-column
				      prop="state"
				      label="审核状态"
				      align="center"
				      >
				    </el-table-column>
				    <el-table-column
				      prop="money"
				      label="操作"
				      align="center"
				      >
				      <template scope="scope">
				        <a href="javascript:;" @click="aduit(scope.row.applyId)">审核</a>
				      </template>
				    </el-table-column>
				  </el-table>
				  <div class="pages">
						<p></p>
						 <el-pagination
					      @size-change="handleSizeChange"
					      @current-change="handleCurrentChange"
								background
					      :current-page="currentPage4"
					      :page-sizes="[7,10, 20, 30, 40,50,100]"
					      :page-size="size"
					      layout="total, prev, pager, next, jumper"
					      :total="total">
					    </el-pagination>
					</div>
			</div>
		</div>
		</div>
		<DoAudit v-if="show=='doAudit'" :applyId='applyId' @show='showDo'/>
	</div>
</template>

<script>
	import axios from 'axios'
	import Qs from 'qs'
	import getUrl from '@/assets/js/getUrl.js';
	import store from '@/store'
	import DoAudit from './DoAudit'
	export default{
		name:'NotAudit',
		components:{
			DoAudit
		},
		data(){
			return{
				applyId:'',
				show:'notAudit',
				list:[],
				delList:[],
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
		          label: '代理人'
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
			showDo(val){
				this.show=val
				this.getStayAuditList()
			},
			aduit(id){
				this.applyId=id
				this.show='doAudit'
			},
			asd(){
				console.log(222)
			},
			aduitMany(state){
				//批量审核
//				console.log(this.list)
				this.delList=[]
				this.list.forEach(item=>{
					this.delList.push(item.applyId)
				})
				if(this.delList.length==0){
					this.$alert('请选择要审核的截图!', '提示', {
						confirmButtonText: '确定',
					});
					return false
				}
				if(state==2){
					this.$confirm('此操作将批量审核通过这些记录, 是否继续?', '提示', {
		          confirmButtonText: '通过',
							cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	let data={
								'applyIds':this.delList.toString(),
								"imgState":"2",
								'description':'无'
							}
							axios({
								headers:{'Content-Type':'application/x-www-form-urlencoded'},
								method: 'post',
								url: this.url+'/platformManage/batchSubStayAudit',
								data:Qs.stringify(data),
								timeout:10000
							}).then(res=>{
		//						console.log(res)
								if(res.data.error_code==0){
									this.getStayAuditList();
									this.$alert('审核通过！', '提示', {
												confirmButtonText: '确定',
											});
								}else{
											this.$alert(res.data.error_message, '提示', {
														confirmButtonText: '确定',
													});
										}
							}).catch((error)=>{
									this.$message.error('请求错误!');
							});
							}).catch(()=>{
								this.$message({
										type: 'info',
										message: '取消操作!'
									});
							})
				}else{
						this.$confirm('此操作将批量审核拒绝这些记录, 是否继续?', '提示', {
		          confirmButtonText: '拒绝',
							cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	this.$prompt('拒绝理由/备注:', '提示', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								}).then(({ value }) => {
									console.log(value)
									if(!value){
										this.$alert('请填写拒绝理由!', '提示', {
											confirmButtonText: '确定',
										});
										return false
									}
									let data={
										'applyIds':this.delList.toString(),
										"imgState":"-1",
										'description':value//拒绝理由
									}
									axios({
										headers:{'Content-Type':'application/x-www-form-urlencoded'},
										method: 'post',
										url: this.url+'/platformManage/batchSubStayAudit',
										data:Qs.stringify(data)
									}).then(res=>{
										// console.log(res)
										if(res.data.error_code==0){
											this.getStayAuditList();
											this.$alert('拒绝成功！', '提示', {
														confirmButtonText: '确定',
													});
										}else{
											this.$alert(res.data.error_message, '提示', {
														confirmButtonText: '确定',
													});
										}
									})
								}).catch(() => {
									this.$message({
										type: 'info',
										message: '取消输入'
									});       
								});
							}).catch(()=>{
								this.$message({
										type: 'info',
										message: '取消操作!'
									});
							})
				}
			},
			clear(){
				this.$refs.multipleTable.clearSelection(this.list)
			},
			reset(){
				//重置 
				let timer=null
				store.dispatch('index','')
				timer=setInterval(()=>{
					clearInterval(timer)
					store.dispatch('index','notAudit')
				},50)
			},
			search(){
				//查询
				let data={
						"productId":this.bank, //产品id（非必传）
						"level":this.role, //会员等级 0 ：会员 1：代理人（非必传）
						"type":this.cuptureKind, //上传类别 0 ：短信截图 1 ：卡片截图（非必传）
						"keyword":this.keyword, // 关键字（非必传）
						"startTime":this.begin, //开始时间（非必传）yyyy-mm-dd
						"endTime":this.end, //结束时间（非必传）yyyy-mm-dd
						"page": this.currentPage4, // 分页参数页码（非必传）
						"rows": this.size, // 分页参数-页条数（非必传）
				}
				axios({
					headers:{'Content-Type':'application/x-www-form-urlencoded'},
					method: 'post',
					url: this.url+'/platformManage/getStayAuditList',
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
						if(item.level==1){
							this.data[index].role ='代理人'
						}else{
							this.data[index].role='会员'
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
						switch (item.type){
							case 0:this.data[index].typeImg='短信截图'
							break;
							case 1:this.data[index].typeImg='卡片照片'
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
			},
			handleSelectionChange(val){
				//选择数据
				this.list=val
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
			getStayAuditList(){
				let data={
					"page": this.currentPage4, // 分页参数页码（非必传）
					"rows": this.size,
				}
				axios({
					headers:{'Content-Type':'application/x-www-form-urlencoded'},
					method: 'post',
					url: this.url+'/platformManage/getStayAuditList',
					data:Qs.stringify(data)
				}).then(res=>{
//					console.log(res)
					this.data=res.data.rows
					this.data.forEach((item,index)=>{
						this.data[index].date =index+1
						if(item.level==1){
							this.data[index].role ='代理人'
						}else{
							this.data[index].role='会员'
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
						switch (item.type){
							case 0:this.data[index].typeImg='短信截图'
							break;
							case 1:this.data[index].typeImg='卡片照片'
							break;
						}
					})
					this.total=res.data.total
				})
			},
			getBank(){
				//银行列表
				axios({
					headers:{'Content-Type':'application/x-www-form-urlencoded'},
					method: 'post',
					url: this.url+'/platformManage/getProductList',
				}).then(res=>{
//					console.log(res.data.rows)
					this.options=res.data.rows
				})
			}
		},
		mounted(){
			let url=getUrl()
			this.url=url
			this.getStayAuditList();
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
		width: 18vh;
		margin-right: 20px;
	}
	.dateInput{
		width: 25vh;
		margin-right: 20px;
	}
	.getOut{
		margin-left: 8vh;
	}
	.tables{
		margin-top: 5px
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
	.clear{
		display: flex;
		align-items: center;
		margin:0 20px;
		height: 4vh;
		background: lightcyan;
		border: 1px solid lightskyblue;
		border-radius: 5px;
	}
	.clear p>span{
		color: lightskyblue;
	}
	.clear .iconfont{
		margin: 0 5px;
		text-indent: 5px;
		font-weight: bold;
		color: cornflowerblue;
	}
	.clear a{
		display: inline-block;
		padding-left: 10px;
		text-decoration: none;
		color: lightskyblue;
	}
</style>