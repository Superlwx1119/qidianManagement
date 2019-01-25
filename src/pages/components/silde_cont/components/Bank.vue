<template>
	<div class="bank" >
		<div v-if="show=='bank'">
		<header>
			<el-breadcrumb separator="/" class='head'>
			  <el-breadcrumb-item :to="{ path: '/' }">基础信息</el-breadcrumb-item>
			  <el-breadcrumb-item><a href="javascript:;">引流银行</a></el-breadcrumb-item>
			</el-breadcrumb>
		</header>
		<div class="cont">
			<div class="searchBank" @keyup.enter='search'>
				<p>银行名称：</p>
				<el-input class='input' v-model="bankName"  placeholder="请输入"></el-input>
				<el-button type="primary" @click='search'>查询</el-button>
				<el-button @click='reset'>重置</el-button>
			</div>
			<div class="operation">
				<el-button type="primary" id='addBank' @click='addBank($event)'>+ 新建</el-button>
				<el-button @click='delMany'>批量删除</el-button>
			</div>
			<div class="clear">
				<span class="iconfont">&#xe71a;</span>
				<p>已选择<span>{{list.length}}</span>项</p>
				<a href="javascript:;" @click="clear">清空</a>
			</div>
			<div class="table">
				<el-table
				    ref="multipleTable"
					max-height='64vh'
				    :data="data"
					border
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
				      prop="productName"
				      label="银行名称"
				      align="center"
				      >
				    </el-table-column>
				    <el-table-column
				      prop="productUrl"
				      align="center"
				      label="银行logo"
				      >
				      <template scope="scope"> 
					  <img :src="url+'/attachManage/getAttach?attachid='+scope.row.logo" class="logoPic"/> 
					  </template>
				    </el-table-column>
				    <el-table-column
				      prop="cardName"
				      align="center"
				      label="信用卡名称"
				      >
				    </el-table-column>
				    <el-table-column
				      prop="productUrl"
				      align="center"
				      label="信用卡图片"
				      >
				      <template scope="scope"> 
					  <img :src="url+'/attachManage/getAttach?attachid='+scope.row.figure3" class='cardPic'/> 
					  </template>
				    </el-table-column>
				    <el-table-column
				      prop="introduce"
				      label="银行简介"
				      align="center"
				      >
				    </el-table-column>
				    <el-table-column
				      prop="productUrl"
				      label="银行链接"
				      align="center"
					  width='200'
				      >
					  <template scope="scope"> 
						  <input class="link" readonly type="text" v-model='scope.row.productUrl'>
					  </template>
				    </el-table-column>
				    <el-table-column
				      prop="address"
				      align="center"
				      label="操作"
				      >
				      <template scope="scope">
				        <!--v-if判断，如果当前行的角色权限是‘地区管理员’，就显示按钮，否则不显示-->
				        <a href="javascript:;" @click="detail(scope.row.productId)">详情</a>
				        <a href="javascript:;" @click="edits(scope.row.productId)">编辑</a>
				        <a href="javascript:;" @click="delate(scope.row.productId)">删除</a>
				    </template>
				    </el-table-column>
				  </el-table>
				  <div class="pages">
						<p></p>
						 <el-pagination
					      @size-change="handleSizeChange"
						  background
					      @current-change="handleCurrentChange"
					      :current-page="currentPage4"
					      :page-sizes="[5,10, 20, 30, 40,50,100]"
					      :page-size="size"
					      layout="total, prev, pager, next, jumper"
					      :total="total">
					    </el-pagination>
					</div>
			</div>
			</div>
			
		</div>
		<AddBank v-if="show=='add'" @show='showAdd'/>
		<BankDetails :productId='productId' v-if="show=='details'" @show='showAdd'/>
		<BankEdit :productId='productId' v-if="show=='edits'" @show='showAdd'/>
	</div>
</template>

<script>
	import axios from 'axios'
	import Qs from 'qs'
	import getUrl from '@/assets/js/getUrl.js';
	import store from '@/store'
	import AddBank from './AddBank'
	import BankDetails from './BankDetails'
	import BankEdit from './BankEdit'
	export default{
		name:'Bank',
		components:{
			AddBank,BankDetails,BankEdit
		},
		data(){
			return{
				url:'',
				bankName:'',
				data:[],
				list:[],
				cardPic:'',
				cardPics:[],
				index:'',
				show:'bank',
				delList:[],
				productId:'',
				currentPage4:1,
				size:5,
				total:0
			}
		},
		methods:{
			edits(id){
				//编辑页面
				this.productId=id
				this.show='edits'
			},
			detail(id){
				//查看银行详情
				this.productId=id
				this.show='details'
			},
			reset(){
				//重置
				this.bankName=''
				this.getProductList()
			},
			search(){
				//查询
				let data={
					"productName":this.bankName, //产品名称（非必传）
					"page": this.currentPage4, // 分页参数页码（非必传）
					"rows": this.size
				}
				console.log(data)
				axios({
					headers:{'Content-Type':'application/x-www-form-urlencoded'},
					method: 'post',
					url: this.url+'/platformManage/getProductList',
					data:Qs.stringify(data),
					timeout:10000
				}).then(res=>{
//					console.log(res.data.rows)
					this.data=res.data.rows
					this.total=res.data.total
					if(this.currentPage4-1>this.total/this.size){
						this.currentPage4=1
						this.sreach()
					}
					this.data.forEach((item,index)=>{
						if(this.currentPage4>1){
							this.data[index].date =(this.currentPage4-1)*5+index+1
						}else{
							this.data[index].date =index+1
						}
					})
					
				}).catch((error)=>{
						this.$message.error('请求错误!');
				});
				// if(this.bankName==''){
				// 	this.getProductList()
				// }
				// let data=this.data.filter(item=>{
				// 	return item.productName.indexOf(this.bankName)>=0
				// })
				// this.data=data
			},
			delMany(){
				//批量删除
				this.delList=[]
				this.list.forEach(item=>{
					this.delList.push(item.productId)
				})
				this.$confirm('此操作将永久删除这些记录, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	let data={
						"productIds":this.delList.toString()
					}
					axios({
						headers:{'Content-Type':'application/x-www-form-urlencoded'},
						method: 'post',
						url: this.url+'/platformManage/batchDelProduct',
						data:Qs.stringify(data),
						timeout:10000
					}).then(res=>{
//						console.log(res)
						if(res.data.error_code==0){
							this.getProductList();
							this.$alert('删除成功！', '提示', {
					          confirmButtonText: '确定',
					        });
						}
					}).catch((error)=>{
							this.$message.error('请求错误!');
					});
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除'
		          });          
		        });
			},
			delate(id){
				//删除银行
				this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	let data={
						"productId":id
					}
					axios({
						headers:{'Content-Type':'application/x-www-form-urlencoded'},
						method: 'post',
						url: this.url+'/platformManage/delProduct',
						data:Qs.stringify(data),
						timeout:10000
					}).then(res=>{
//						console.log(res)
						if(res.data.error_code==0){
							this.getProductList();
							this.$alert('删除成功！', '提示', {
					          confirmButtonText: '确定',
					        });
						}
					}).catch((error)=>{
								this.$message.error('请求错误!');
						});
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除'
		          });          
		        });
				
			},
			showAdd(val){
				this.show=val
				this.getProductList();
			},
			addBank(e){
				//新增银行
//				console.log(e.srcElement.id)
//				this.index=e.srcElement.id
//		    	store.dispatch('index',this.index)
				this.show='add'
			},
			clear(){
				this.$refs.multipleTable.clearSelection(this.list)
			},
			handleSelectionChange(val){
				//选择数据
				this.list=val
			},
			getProductList(){
				//获取银行列表
				let data={
					"productName":this.bankName,
					"rows": this.size
				}
				axios({
					headers:{'Content-Type':'application/x-www-form-urlencoded'},
					method: 'post',
					url: this.url+'/platformManage/getProductList',
					data:Qs.stringify(data),
					timeout:10000
				}).then(res=>{
//					console.log(res)
					this.data=res.data.rows
					this.total=res.data.total
					this.data.forEach((item,index)=>{
						//添加序号
						if(this.currentPage4>1){
							this.data[index].date =(this.currentPage4-1)*this.size+index+1
						}else{
							this.data[index].date =index+1
						}
					})
				}).catch((error)=>{
						this.$message.error('请求错误!');
				});
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
		},
		mounted(){
			let url=getUrl()
			this.url=url
			this.getProductList();
		}
	}
</script>

<style scoped>
	header{
		background: white;
		height: 6vh;
	}
	.link{
		border: none;
		outline: none;
		color: #606266;
		font-size: 14px;
		background: transparent
	}
	.head{
		line-height: 6vh;
		padding-left: 20px;
		border-left: 2px solid deepskyblue;
	}
	.cont{
		/* height: 84vh; */
		margin: 1.5vh 2vh 0 2vh;
		background: white;
		overflow: hidden;
	}
	.operation{
		padding-left: 20px;
		margin-bottom: 1vh;
	}
	.searchBank{
		display: flex;
		padding-left: 20px;
		height: 7vh;
		align-items: center;
		line-height: 7vh;
		font-size: 14px;
	}
	.input{
		width: 27vh;
		margin-right: 20px;
	}
	.clear{
		display: flex;
		align-items: center;
		margin:0 20px;
		height: 4vh;
		font-size: 14px;
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
	.table{
		margin-top: 5px;
		padding: 0 20px;
		/* overflow-y: scroll; */
		/*height: 60vh;*/
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