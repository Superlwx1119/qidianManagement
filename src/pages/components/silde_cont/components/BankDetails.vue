<template>
	<div class="addBank">
		<header>
			<el-breadcrumb separator="/" class='head'>
			  <el-breadcrumb-item :to="{ path: '/' }">基础信息</el-breadcrumb-item>
			  <el-breadcrumb-item ><a @click="close">引流银行</a></el-breadcrumb-item>
			  <el-breadcrumb-item><a href="javascript:;">银行详情</a></el-breadcrumb-item>
			</el-breadcrumb>
		</header>
		<div class="cont">
			<div class="first">
				<h2>基本信息</h2>
				<div class="box">
					<p>银行名称：</p>
					<el-input v-model="data.productName" class='inputs'  disabled></el-input>
					<p>信用卡名称：</p>
					<el-input v-model="data.cardName" class='inputs'  disabled></el-input>
					<p>银行链接：</p>
					<el-input v-model="data.productUrl"  disabled ></el-input>
				</div>
				<div  class="box">
					<p>银行简介：</p>
					<el-input v-model="data.introduce" class='inputs'  disabled></el-input>
					<p>银行logo：</p>
					<label for="logo"><img id="logoImg" :src="url+'/attachManage/getAttach?attachid='+data.logo"/><input @change="changeIMg1($event)" id="logo" disabled type="file" accept="image/*" /></label>
				</div>
				<div class="box">
					<p>信用卡图片：</p>
					<label class='inputs' for="card"><img id="cardImg" :src="url+'/attachManage/getAttach?attachid='+data.background"/><input @change="changeIMg2($event)" id="card" disabled type="file" accept="image/*" /></label>
					<p>短信示例图：</p>
					<label class='inputs' for="msg"><img id="MsgImg" :src="url+'/attachManage/getAttach?attachid='+data.figure2"/><input @change="changeIMg3($event)" id="msg" disabled type="file" accept="image/*" /></label>
					<p>卡片示例图：</p>
					<label  for="cardEg"><img id="cardImgEg" :src="url+'/attachManage/getAttach?attachid='+data.figure3"/><input disabled @change="changeIMg4($event)" id="cardEg" type="file" accept="image/*" /></label>
				</div>
			</div>
			<div class="second">
				<h2>注意事项</h2>
				<div class="box">
					<p>注意事项：</p>
					<el-input
					  type="textarea"
					  :rows="3"
					  class='textarea'
					  disabled
					  placeholder="请输入内容"
					  v-model="data.attention">
					</el-input>
				</div>
					<h2>办卡流程</h2>				
				<div class="box">
					<p>办卡流程：</p>
					<el-input
					  type="textarea"
					  class='textarea'
					  :rows="3"
					  disabled
					  placeholder="请输入内容"
					  v-model="data.process">
					</el-input>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import getUrl from '@/assets/js/getUrl.js';
	import axios from 'axios'
	import Qs from 'qs'
	export default{
		name:'BankDetails',
		props:{
			productId:String
		},
		data(){
			return{
				url:'',
				show:true,
				process:'',
				attention:'',
				introduce:'',
				bankLink:'',
				cardName:'',
				bankName:'',
				eventOjb1:{},
				eventOjb3:{},
				eventOjb4:{},
				eventOjb2:{},
				data:{}
			}
		},
		methods:{
			close(){
				this.$emit('show','bank')
			},
			getBankDetail(){
				let data={
					"productId":this.productId
				}
				axios({
					headers:{'Content-Type':'application/x-www-form-urlencoded'},
					method: 'post',
					url: this.url+'/platformManage/getProductInfo',
					data:Qs.stringify(data),
					timeout:10000
				}).then(res=>{
//					console.log(res.data.product_info)
					this.data=res.data.product_info
				}).catch((error)=>{
						this.$message.error('请求错误!');
				});
			}
		},
		mounted(){
			let url=getUrl()
			this.url=url
			this.getBankDetail()
//			console.log(this.$store.state.index)
		}
	}
</script>

<style scoped>
	header{
		background: white;
		height: 6vh;
	}
	.textarea{
		width: 80vh;
		max-height: 10vh;
	}
	.head{
		line-height: 6vh;
		padding-left: 20px;
		border-left: 2px solid deepskyblue;
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
	#logoImg{
		width: 8vh;
		height: 8vh;
	}
	.box{
		display: flex;
		width: 100%;
		padding-left: 20px;
		
		margin: 1vh 0;
	}
	.box p{
		font-size: 14px;
		line-height: 30px;
		margin: 0 10px;
	}
	.box label{
		width: 19vh;
		height: 17vh;
	}
	.box label img{
		border: 1px solid #e7e7e7;
		border-radius: 50%;
		background: white;
	}
	.inputs{
		margin-right: 9vh;
	}
	#cardImg{
		width: 20vh;
		height: 17vh;
		border-radius: 0;
	}
	#cardImgEg{
		width: 20vh;
		height: 17vh;
		border-radius: 0;
	}
	#MsgImg{
		width: 20vh;
		height: 17vh;
		border-radius: 0;
	}
	.box input{
		margin-right: 5vh;
	}
	.box input[type='file']{
		visibility: hidden;
	}
	.input {
		width: 40vh;
	}
	.btn{
		text-align: center;
		
	}
	.first{
		border-bottom: 1px solid #E9E9E9;
	}
	.btn button{
		margin: 0 20px;
	}
</style>