<template>
	<div class="addBank">
		<header>
			<el-breadcrumb separator="/" class='head'>
			  <el-breadcrumb-item :to="{ path: '/' }">基础信息</el-breadcrumb-item>
			  <el-breadcrumb-item ><a @click="close">引流银行</a></el-breadcrumb-item>
			  <el-breadcrumb-item><a href="javascript:;">新增银行</a></el-breadcrumb-item>
			</el-breadcrumb>
		</header>
		<div class="cont">
			<div class="first">
				<h2>基本信息</h2>
				<div class="box">
					<p>银行名称：</p>
					<el-input v-model="bankName" class='inputs' placeholder="请输入内容"></el-input>
					<p>信用卡名称：</p>
					<el-input v-model="cardName" class='inputs' placeholder="请输入内容"></el-input>
					<p>银行链接：</p>
					<el-input v-model="bankLink" class='inputs' placeholder="请输入内容"></el-input>
				</div>
				<div  class="box">
					<p>银行简介：</p>
					<el-input v-model="introduce" class='inputs' placeholder="请输入内容"></el-input>
					<p>银行logo：</p>
					<label for="logo" ><img id="logoImg" src="../../../../../static/images/tianjiatupian.png"/><input @change="changeIMg1($event)" id="logo" type="file" accept="image/*" /></label>
				</div>
				<div class="box">
					<p>信用卡图片：</p>
					<label class='inputs' for="card"><img id="cardImg" src="../../../../../static/images/tianjiatupian_1.png"/><input @change="changeIMg2($event)" id="card" type="file" accept="image/*" /></label>
					<p>短信示例图：</p>
					<label class='inputs' for="msg"><img id="MsgImg" src="../../../../../static/images/tianjiatupian_1.png"/><input @change="changeIMg3($event)" id="msg" type="file" accept="image/*" /></label>
					<p>卡片示例图：</p>
					<label for="cardEg"><img id="cardImgEg" src="../../../../../static/images/tianjiatupian_1.png"/><input @change="changeIMg4($event)" id="cardEg" type="file" accept="image/*" /></label>
				</div>
				<!--<div class="box">
					<p>短信示例图：</p>
					<label for="msg"><img id="MsgImg" src="../../../../../static/images/logo.jpg"/><input @change="changeIMg3($event)" id="msg" type="file" accept="image/*" /></label>
				</div>
				<div class="box">
					<p>卡片示例图：</p>
					<label for="cardEg"><img id="cardImgEg" src="../../../../../static/images/logo.jpg"/><input @change="changeIMg4($event)" id="cardEg" type="file" accept="image/*" /></label>
				</div>-->
			</div>
			<div class="second">
				<h2>注意事项</h2>
				<div class="box">
					<p>注意事项：</p>
					<el-input
					  type="textarea"
					  :rows="2"
					  class='textarea'
					  placeholder="请输入内容"
					  v-model="attention">
					</el-input>
				</div>
					<h2>办卡流程</h2>				
				<div class="box">
					<p>办卡流程：</p>
					<el-input
					  type="textarea"
					  :rows="2"
					  class='textarea'
					  placeholder="请输入内容"
					  v-model="process">
					</el-input>
				</div>
			</div>
			<div class="btn">
				<el-button type="primary" @click='add'>确定</el-button>
				<el-button @click='close'>取消</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import getUrl from '@/assets/js/getUrl.js';
	export default{
		name:'AddBank',
		data(){
			return{
				url:'',
				show:'add',
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
			}
		},
		methods:{
			close(){
				this.$emit('show','bank')
			},
			changeIMg1(e){
				let reads= new FileReader();
		        let f=document.getElementById('logo').files[0];
		        reads.readAsDataURL(f);
		        reads.onload=function (e) {
		            document.getElementById('logoImg').src=this.result;
		        };
		        this.eventOjb1=e
			},
			changeIMg2(e){
				let reads= new FileReader();
		        let f=document.getElementById('card').files[0];
		        reads.readAsDataURL(f);
		        reads.onload=function (e) {
		            document.getElementById('cardImg').src=this.result;
		        };
		        this.eventOjb2=e
			},
			changeIMg3(e){
				let reads= new FileReader();
		        let f=document.getElementById('msg').files[0];
		        reads.readAsDataURL(f);
		        reads.onload=function (e) {
		            document.getElementById('MsgImg').src=this.result;
		        };
		        this.eventOjb3=e
			},
			changeIMg4(e){
				let reads= new FileReader();
		        let f=document.getElementById('cardEg').files[0];
		        reads.readAsDataURL(f);
		        reads.onload=function (e) {
		            document.getElementById('cardImgEg').src=this.result;
		        };
		        this.eventOjb4=e
			},
			add(){
				var formData = new FormData(); 
					if(this.eventOjb1.target&&this.eventOjb2.target&&this.eventOjb3.target&&this.eventOjb4.target&&this.bankName!=''&&this.cardName!=''&&this.introduce!=''&&this.bankLink!=''&&this.process!=''&&this.attention!=''){
						formData.append('logo', this.eventOjb1.target.files[0]);
					    formData.append('background', this.eventOjb2.target.files[0]);
					    formData.append('productName', this.bankName);
					    formData.append('cardName',this.cardName);
					    formData.append('introduce',this.introduce);
					    formData.append('productUrl',this.bankLink);
					    formData.append('process',this.process);
					    formData.append('attention',this.attention);
					    formData.append('figure2',this.eventOjb3.target.files[0]);
					    formData.append('figure3',this.eventOjb4.target.files[0]);
						$.ajax({
					        url: this.url+'/platformManage/addProduct',//这里是后台接口需要换掉
					        type: 'POST',
					        dataType: 'json',
					        cache: false,
					        data: formData,
					        processData: false,
					        contentType: false,
					        success:(res)=>{   
					        	// console.log(res)
					        	if(res.error_code==0){
					        		this.$alert('添加成功！', '提示', {
							          confirmButtonText: '确定',
							        });
							        this.close();
					        	}
					        }
					      })
					}else{
						this.$alert('请填写完整信息！', '提示', {
				          confirmButtonText: '确定',
				        });
					}
				      
			}
		},
		mounted(){
			let url=getUrl()
			this.url=url
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
		border-radius: 50%;
		background: white;
		width: 10vh;
		height: 10vh;
		border: 1px solid #e7e7e7;
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