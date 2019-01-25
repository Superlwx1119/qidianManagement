<template>
	<div class="school" @keyup.enter="add">
		<header>
			<el-breadcrumb separator="/" class='head'>
			  <el-breadcrumb-item :to="{ path: '/' }">基础信息</el-breadcrumb-item>
			  <el-breadcrumb-item ><a @click="close">校园管理</a></el-breadcrumb-item>
			  <el-breadcrumb-item><a href="javascript:;">编辑学校</a></el-breadcrumb-item>
			</el-breadcrumb>
		</header>
		<div class="cont" >
			<div >
				<h2>学校信息</h2>
				<div class='box'>
					<p><span class="red">*</span>省份选择：</p>
					<el-select class='input' @change='choseProvince' v-model="province" filterable placeholder="请选择">
					    <el-option
					      v-for="item in provinces"
					      :key="item"
					      :label="item"
					      :value="item">
					    </el-option>
					  </el-select>
					  <p><span class="red">*</span>城市选择：</p>
					<el-select class='input' @change='choseCity' v-model="city" filterable placeholder="请选择">
					    <el-option
					      v-for="item in cities"
					      :key="item.name?item.name:item"
					      :label="item.name?item.name:item"
					      :value="item.name?item.name:item">
					    </el-option>
					  </el-select>
					<p><span class="red">*</span>校园名称：</p>
					<el-input class='input' v-model="schoolName" placeholder="请输入"></el-input>
				</div>
				<div class="box">
					<p>&nbsp;邮编：</p>
					<el-input class='input' v-model="zipCode" placeholder="请输入"></el-input>
					<p>&nbsp;招生办电话：</p>
					<el-input class='input' v-model="mobile" placeholder="请输入"></el-input>
					<p>&nbsp;资质选择：</p>
					<el-select class='input' v-model="level" filterable placeholder="请选择">
					    <el-option
					      v-for="item in options"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
				</div>
				<div  class="box">
					<p>&nbsp;简介：</p>
					<el-input
					  type="textarea"
					  :autosize="{ minRows: 2, maxRows: 4}"
					  placeholder="请输入内容"
					  class='txt'
					  v-model="introduce">
					</el-input>
				</div>
				<div class="btn">
					<el-button type="primary" @click='add'>确定</el-button>
					<el-button @click='close'>取消</el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	import Qs from 'qs'
	import getUrl from '@/assets/js/getUrl.js';
	export default{
		name:'SchoolEidt',
		props:{
			schoolId:String
		},
		data(){
			return{
				url:'',
				show:'edit',
				city:'',
				cities:[],
				province:'',
				provinces:[],
				schoolName:'',
				zipCode:'',
				introduce:'',
				mobile:'',
				level:'',
				options: [{
		          value: '本科',
		          label: '本科'
		        }, {
		          value: '大专',
		          label: '大专'
		        }],
			    
			}
		},
		methods:{
			close(){
				this.$emit('show','school')
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
				this.city=val
			},
			add(){
				if(this.province==''||this.city==''||this.schoolName==''){
					this.$alert('请填写必填信息！', '提示', {
			          confirmButtonText: '确定',
			        });
			        return
				}
				this.$confirm('此操作将修改该条记录, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	let data={
						"schoolId":this.schoolId,
						"introduce":this.introduce, //介绍（必传）
						"province":this.province, //省（必传）
						"city":this.city, //市（必传）
						"qualification":this.level, //资本（必传）
						"name":this.schoolName, //学校（必传）
						"mobile":this.mobile, //手机号（必传）
						"zipCode":this.zipCode, //邮政编码（必传）
					}
					axios({
						headers:{'Content-Type':'application/x-www-form-urlencoded'},
						method: 'post',
						url: this.url+'/platformManage/editSchool',
						data:Qs.stringify(data),
						timeout:10000
					}).then(res=>{
//						console.log(res)
						if(res.data.error_code==0){
			        		this.$alert('修改成功！', '提示', {
					          confirmButtonText: '确定',
					        });
					        this.close();
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
			getCitys(){
				axios.get('./static/mock/city.json')
				.then(res=>{
//					console.log(res.data)
					res.data.forEach(item=>{
						this.provinces.push(item.name)
					})
				})
			},
			getSchoolInfo(){
				//学校详情
				let data={
					"schoolId":this.schoolId
				}
				axios({
					headers:{'Content-Type':'application/x-www-form-urlencoded'},
					method: 'post',
					url: this.url+'/platformManage/getSchoolInfo',
					data:Qs.stringify(data),
					timeout:10000
				}).then(res=>{
//					console.log(res.data.school_info)
					this.province=res.data.school_info.province
					this.city=res.data.school_info.city
					this.schoolName=res.data.school_info.name
					this.zipCode=res.data.school_info.zipCode
					this.mobile=res.data.school_info.mobile
					this.level=res.data.school_info.qualification
					this.introduce=res.data.school_info.introduce
					this.choseProvince(this.province)
					this.choseCity(res.data.school_info.city)
				}).catch((error)=>{
						this.$message.error('请求错误!');
				});
			}
		},
		mounted(){
			let url=getUrl()
			this.url=url
			this.getCitys();
			this.getSchoolInfo()
		}
	}
</script>

<style scoped>
	.red{
		color: red;
	}
	header{
		background: white;
		height: 6vh;
	}
	.head{
		line-height: 6vh;
		padding-left: 20px;
		border-left: 2px solid deepskyblue;
	}
	.txt{
		width: 100vh;
	}
	.cont{
		height: 84vh;
		margin: 1.5vh 2vh 0 2vh;
		background: white;
		overflow: hidden;
	}
	.cont h2{
		font-size: 18px;
		padding: 1vh 20px;
	}
	.input {
		width: 21.5vh;
		margin-right: 2vh;
	}
	.box p{
		margin: 0 1vh;
		width: 14vh;
	}
	.box{
		display: flex;
		
		width: 100%;
		align-items: center;
		padding-left: 20px;
		margin: 1vh 0;
	}
	.btn{
		text-align: center;
		margin-top: 4vh;
	}
	.btn button{
		margin: 0 20px;
	}
</style>