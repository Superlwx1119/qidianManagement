<template>
	<div class="school">
		<div v-if="show=='school'">
		<header>
			<el-breadcrumb separator="/" class='head'>
			  <el-breadcrumb-item :to="{ path: '/' }">基础信息</el-breadcrumb-item>
			  <el-breadcrumb-item><a href="javascript:;">校园管理</a></el-breadcrumb-item>
			</el-breadcrumb>
		</header>
		<div class="cont" @keyup.enter="sreach">
			<div class="searchCity">
				<p>省份选择：</p>
				<el-select class='input' @change='choseProvince' v-model="province" filterable placeholder="请选择">
				    <el-option
				      v-for="item in provinces"
				      :key="item"
				      :label="item"
				      :value="item">
				    </el-option>
				  </el-select>
				  <p>城市选择：</p>
				<el-select class='input' @change='choseCity' v-model="city" filterable placeholder="请选择">
				    <el-option
				      v-for="item in cities"
				      :key="item.name?item.name:item"
				      :label="item.name?item.name:item"
				      :value="item.name?item.name:item">
				    </el-option>
				  </el-select>
				<p>资质选择：</p>
				<el-select class='input' v-model="level" filterable placeholder="请选择">
				    <el-option
				      v-for="item in options"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>
				<p>校园名称：</p>
				<el-input class='input' v-model="schoolName" placeholder="请输入"></el-input>
				<el-button type="primary" @click='sreach'>查询</el-button>
				<el-button @click='reset'>重置</el-button>
			</div>
			<div class="operation">
				<el-button type="primary" @click='addSchool'>+ 新建</el-button>
				<!-- <label for="upload">导入<input id="upload" @change="uploadFile($event)" type="file"></label> -->
				<el-upload
					class="upload-demo"
					action="1"
					
					ref="upload"
					:show-file-list='false'
					:limit="1"
					:before-upload="beforeUpload"
					:file-list="fileList">
					<el-button size="small" type="primary">点击导入</el-button>
				</el-upload>
				<el-button @click='delMany'>批量删除</el-button>
				<a href="javascript:;" class="down" @click="download">下载导入模板</a>
			</div>
			<div class="clear">
				<span class="iconfont">&#xe71a;</span>
				<p>已选择<span>{{list.length}}</span>项</p>
				<a @click='clear'>清空</a>
			</div>
			<div class="table">
				<el-table
				    ref="multipleTable"
				    :data="data"
					border
				    max-height='65vh'
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
				      <template slot-scope="scope">{{scope.row.date}}</template>
				    </el-table-column>
				    <el-table-column
				      prop="province"
				      label="省份"
				      align="center"
					   width='100'
				      >
				    </el-table-column>
				    <el-table-column
				      prop="city"
				      align="center"
				      label="市"
					   width='100'
				      >
				    </el-table-column>
				    <el-table-column
				      prop="name"
				      align="center"
				      label="学校名称"
					   width='220'
				      >
				    </el-table-column>
				    <el-table-column
				      prop="qualification"
				      align="center"
				      label="资质"
					   width='80'
				      >
				    </el-table-column>
				    <el-table-column
				      prop="zipCode"
				      label="邮编"
				      align="center"
				      >
				    </el-table-column>
				    <el-table-column
				      prop="mobile"
				      label="招生办电话"
				      align="center"
				      >
				    </el-table-column>
				    <el-table-column
				      prop="note"
				      label="备注"
				      align="center"
					  show-overflow-tooltip
				      >
				    </el-table-column>
				    <el-table-column
				      prop="note"
				      align="center"
				      label="操作"
				      >
				      <template scope="scope">
				        <a href="javascript:;" @click="edit(scope.row.schoolId)">编辑</a>
				        <a href="javascript:;" @click="delSchool(scope.row.schoolId)">删除</a>
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
			      :page-sizes="[10, 20, 30, 40,50,100]"
			      :page-size="size"
			      layout="total, prev, pager, next, jumper"
			      :total="total">
			    </el-pagination>
			</div>
		</div>
		</div>
		<AddSchool v-if="show=='add'" @show='showAdd'/>
		<SchoolEidt :schoolId='schoolId' v-if="show=='edit'" @show='showAdd'/>
	</div>
</template>

<script>
	import axios from 'axios'
	import Qs from 'qs'
	import getUrl from '@/assets/js/getUrl.js';
	import AddSchool from './AddSchool'
	import SchoolEidt from './SchoolEidt'
	export default{
		name:'School',
		components:{
			AddSchool,SchoolEidt
		},
		data(){
			return{
				fileList:[],
				show:'school',
				schoolName:'',
				data:[],
				province:'',
				provinces:[],
				id:[],
				total:0,
				currentPage4:1,
				options: [{
			          value: '本科',
			          label: '本科'
			        }, {
			          value: '大专',
			          label: '大专'
			        }],
			    city:'',
			    cities:[],
			    level:'',
			    size:10,
			    list:[],
			    result:[],
			    delList:[],
					schoolId:'',
					files:{}
			}
		},
		methods:{
			download(){
				$('.down').attr('href',this.url+'/platformManage/schoolTemplateOut')
				return false
			},
			beforeUpload(file){
				this.files = file;
				const extension = file.name.split('.')[1] === 'xls'
				const extension2 = file.name.split('.')[1] === 'xlsx'
				if (!extension && !extension2) {
				this.$message.warning('上传模板只能是 xls、xlsx格式!')
				return
				}
				let fileFormData = new FormData();
				fileFormData.append('upfile', this.files);//filename是键，file是值，就是要传的文件，test.zip是要传的文件名
				let requestConfig = {
				headers: {
				'Content-Type': 'multipart/form-data'
				},
				}
				axios({
					headers:{'Content-Type': 'multipart/form-data'},
					method: 'post',
					url: this.url+'/platformManage/importSchool',
					data:fileFormData,
					timeout:10000
				}).then(res=>{
						// console.log(res)
						var a = res.data.errorDescribeRows.toString().split(",").join("");
						if(res.data.error_code==0){
							if(res.data.errorDescribeRows.length>0){
								this.$confirm('存在错误信息, 是否查看?', '提示', {
									confirmButtonText: '确定',
									cancelButtonText: '取消',
									type: 'warning'
								}).then(()=>{
									this.$message({
									message: '成功添加'+res.data.rows+'条数据!',
									type: 'success',
									})
									this.$alert(a, '提示', {
										confirmButtonText: '确定',
									});
								})
							}else{
								this.$message({
									message: '成功添加'+res.data.rows+'条数据!',
									type: 'success',
								})
							}
							this.sreach();
						}else{
							this.$message({
							message: res.data.error_message,
							})
						}
						
				}) 
			},
			edit(id){
				this.schoolId=id
				this.show='edit'
			},
			showAdd(val){
				this.show=val
				this.getSchoolList();
			},
			reset(){
				//重置
				this.province=''
				this.city=''
				this.level=''
				this.schoolName=''
				this.size=10
				this.currentPage4=1
				this.sreach()
			},
			sreach(){
				//查询
				let data={
					"province":this.province, //省（非必传）
					"city":this.city, //市（非必传）
					"qualification":this.level, //资质名称（非必传）
					"name":this.schoolName,
					'page':this.currentPage4,
					'rows':this.size
				}
				console.log(data)
				axios({
					headers:{'Content-Type':'application/x-www-form-urlencoded'},
					method: 'post',
					url: this.url+'/platformManage/getSchoolList',
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
							this.data[index].date =(this.currentPage4-1)*this.size+index+1
						}else{
							this.data[index].date =index+1
						}
					})
					
				}).catch((error)=>{
						this.$message.error('请求错误!');
				});
			},
			choseProvince(val){
				//选择省份
				this.city=''
				this.province=val
				axios.get('./static/mock/city.json')
				.then(res=>{
//					console.log(res.data)
					let data=res.data.filter(item=>{
						return item.name==val
					})
					if(data[0].city.length==1){
						this.cities=data[0].city[0].area
					}else{
						this.cities=data[0].city
					}
				})
			},
			choseCity(val){
				//选择城市
				if(val.indexOf('市')>0){
					this.city=val.substring(0,val.indexOf('市'))
				}else{
					this.city=val
				}
				
			},
			clear(){
				//清空选项
				this.$refs.multipleTable.clearSelection(this.list)
			},
			getSchoolList(){
				//学校列表
				let data={
					'page':this.currentPage4,
					'rows':this.size
				}
				axios({
					headers:{'Content-Type':'application/x-www-form-urlencoded'},
					method: 'post',
					url: this.url+'/platformManage/getSchoolList',
					data:Qs.stringify(data),
					timeout:10000
				}).then(res=>{
//					console.log(res.data.rows)
					this.data=res.data.rows
					this.total=res.data.total
					this.data.forEach((item,index)=>{
						if(this.currentPage4>1){
							this.data[index].date =this.currentPage4-1+index+1
						}else{
							this.data[index].date =index+1
						}
					})
					
				}).catch((error)=>{
						this.$message.error('请求错误!');
				});
			},
			delMany(){
				//批量删除
//				console.log(this.list)
				this.delList=[]
				this.list.forEach(item=>{
					this.delList.push(item.schoolId)
				})
				this.$confirm('此操作将永久删除这些记录, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	let data={
						"schoolIds":this.delList.toString()
					}
					axios({
						headers:{'Content-Type':'application/x-www-form-urlencoded'},
						method: 'post',
						url: this.url+'/platformManage/batchDelSchool',
						data:Qs.stringify(data),
						timeout:10000
					}).then(res=>{
//						console.log(res)
						if(res.data.error_code==0){
							this.getSchoolList();
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
			delSchool(id){
				//删除学校
				this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	let data={
						"schoolId":id, //学校id（必传）
					}
					axios({
						headers:{'Content-Type':'application/x-www-form-urlencoded'},
						method: 'post',
						url: this.url+'/platformManage/delSchool',
						data:Qs.stringify(data),
						timeout:10000
					}).then(res=>{
	//					console.log(res)
						this.getSchoolList()
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
			addSchool(){
				//新增学校
//				
				this.show='add'
			},
			handleSizeChange(val){
				//选择每页数据条数
				this.size=val
				this.sreach()
			},
			handleCurrentChange(val){
				//当前页码
				this.currentPage4=val
				this.sreach()
			},
			handleSelectionChange(val){
				//选择数据条数
//				console.log(val)
				this.list=val
			},
			getCitys(){
				//省市列表
				axios.get('./static/mock/city.json')
				.then(res=>{
//					console.log(res.data)
					res.data.forEach(item=>{
//						console.log(item.name)
						this.provinces.push(item.name)
					})
				})
//				var vm = this;
//				$.getScript('./static/mock/city.json',function(data,state){
//					var infoData = $.parseJSON(data);
//					infoData.forEach(item=>{
//						vm.provinces.push(item.name);
//					});
//				});
			}
		},
		created(){
			let url=getUrl()
			this.url=url
			this.getSchoolList()
			this.getCitys()
		},
		mounted(){
			console.log($('tr'))
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
	.upload-demo{
		margin: 0 10px;
	}
	#upload{
		display: none;
	}
	.searchCity{
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
	.operation{
		padding-left: 20px;
		display: flex;
		align-items: center;
		margin-bottom: 1vh;
	}
	.operation label{
		background-color: #409EFF;
    border-color: #409EFF;
    color: #fff;
		border: 1px solid #dcdfe6;
		border-radius: 4px;
		padding: 0 20px;
		cursor: pointer;
		height: 30px;
		font-size: 14px;
    line-height: 30px;
		display: inline-block;
	}
	.operation label:hover{
		background: #66b1ff;
    border-color: #66b1ff;
		border: 1px solid #dcdfe6;
	}
	.operation a{
		color: deepskyblue;
		display: inline-block;
		margin-left: 10px;
	}
	.clear{
		display: flex;
		align-items: center;
		margin:0 20px;
		font-size: 14px;
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
	.table{
		margin-top: 5px;
		padding:0 20px;
		/*overflow-y: scroll;
		height: 60vh;*/
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