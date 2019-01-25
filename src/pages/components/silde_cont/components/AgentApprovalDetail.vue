<template>
	<div class="agent doAgent">
		<header>
			<el-breadcrumb separator="/" class='head'>
			  <el-breadcrumb-item :to="{ path: '/' }">用户管理</el-breadcrumb-item>
			  <el-breadcrumb-item ><a @click="close">代理人审批</a></el-breadcrumb-item>
			  <el-breadcrumb-item><a href="javascript:;">代理人审批详情</a></el-breadcrumb-item>
			</el-breadcrumb>
		</header>
		<div class="cont">
			<div class="first">
				<h2>基本信息</h2>
				<div>
					<p><b>申请人姓名：<span>{{data.xm}}</span></b><b>手机号：<span>{{data.mobile}}</span></b><b>微信昵称：<span>{{data.nickName}}</span></b></p>
					<p><b>所属代理人：<span>{{data.inviterXm}}</span></b><b>代理人手机：<span>{{data.inviterMobile}}</span></b><b>上传截图数：<span>{{data.uploadNum}}</span></b></p>
					<p><b>已通过截图数：<span>{{data.throughNum}}</span></b><b>已领红包数：<span>{{data.receiveNum}}</span></b><b>已领红包金额：<span>{{data.receiveMoney}}</span></b></p>
					
				</div>
			</div>
			<div class="first">
				<h2>申请资料</h2>
				<div>
				<p><b>申请时间：<span>{{data.subTime}}</span></b><b>学校名称：<span>{{data.schoolName}}</span></b><b></b></p>
				<p class="idCard"><em>身份证正面照：</em><img @click="openImg1" :src="data.idCardPositive|img"/><em>身份证反面照：</em><img @click="openImg2" :src="data.idCardPeverse|img"/><em></em><em></em></p>
				</div>
			</div>
			<div class="btn">
				<el-button type="primary" @click="subAgentAudit('2')">通过</el-button>
				<el-button @click="subAgentAudit('-1')">拒绝</el-button>
				<el-button @click='close'>取消</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	import Qs from 'qs'
	import getUrl from '@/assets/js/getUrl.js';
	import store from '@/store'
	export default{
		name:'AgentApprovalDetail',
		filters:{
			img(val){
				let url=getUrl()
				return url+'/attachManage/getAttach?attachid='+val
			}
		},
		props:{
			registrationId:String
		},
		data(){
			return{
				url:'',
				data:{},
				list:[],
				currentPage4:1,
				size:10,
				total:0
			}
		},
		methods:{
			openImg1(){
				//放大身份证正面照
				this.$alert("<img src="+ this.url+'/attachManage/getAttach?attachid='+this.data.idCardPositive+" width=200% height=200%>", '身份证正面照', {
					dangerouslyUseHTMLString: true
				});
			},
			openImg2(){
				//放大身份证反面照
				this.$alert("<img src="+ this.url+'/attachManage/getAttach?attachid='+this.data.idCardPeverse+" width=200% height=200%>", '身份证反面照', {
					dangerouslyUseHTMLString: true
				});
			},
			close(){
				this.$emit('show','agentApproval')
			},
			getAgentAuditInfo(){
				//代理人数据
				let data={
					'registrationId':this.registrationId
				}
				axios({
					headers:{'Content-Type':'application/x-www-form-urlencoded'},
					method: 'post',
					url: this.url+'/platformManage/getAgentAuditInfo',
					data:Qs.stringify(data),
					timeout:10000
				}).then(res=>{
//					console.log(res)
					this.data=res.data.registration_info
				}).catch((error)=>{
						this.$message.error('请求错误!');
				});
			},
			subAgentAudit(state){
				//提交审核
				let data={
					"registrationId":this.registrationId, //申请人id（必传）
					"state":state //审核状态 2 审核通过 -1审核失败（必传）
				}
				if(state==-1){
					this.$prompt('拒绝理由/备注:', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					}).then(({value})=>{
						if(!value){
							this.$alert('请填写拒绝理由!', '提示', {
								confirmButtonText: '确定',
							});
							return false
						}
						let data={
							"registrationId":this.registrationId, //申请人id（必传）
							"state":-1, //审核状态 2 审核通过 -1审核失败（必传）
							"approverDescription":value
						}
						axios({
							headers:{'Content-Type':'application/x-www-form-urlencoded'},
							method: 'post',
							url: this.url+'/platformManage/subAgentAudit',
							data:Qs.stringify(data),
							timeout:10000
						}).then(res=>{
		//					console.log(res)
							if(res.data.error_code==0&&state=='2'){
									this.$alert('审核通过！', '提示', {
									confirmButtonText: '确定',
									});
									this.close();
							}else if(res.data.error_code==0&&state=='-1'){
								this.$alert('审核拒绝！', '提示', {
									confirmButtonText: '确定',
									});
									this.close();
							}
						}).catch((error)=>{
								this.$message.error('请求错误!');
						});
					})
				}else{
					this.$confirm('此操作后该会员将成为代理人, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(()=>{
						axios({
							headers:{'Content-Type':'application/x-www-form-urlencoded'},
							method: 'post',
							url: this.url+'/platformManage/subAgentAudit',
							data:Qs.stringify(data),
							timeout:10000
						}).then(res=>{
		//					console.log(res)
							if(res.data.error_code==0&&state=='2'){
									this.$alert('审核通过！', '提示', {
									confirmButtonText: '确定',
									});
									this.close();
							}else if(res.data.error_code==0&&state=='-1'){
								this.$alert('审核拒绝！', '提示', {
									confirmButtonText: '确定',
									});
									this.close();
							}
						}).catch((error)=>{
								this.$message.error('请求错误!');
						});
					})
					
				}
				
			}
		},
		mounted(){
			let url=getUrl()
			this.url=url
			this.getAgentAuditInfo();
//			this.getAgentMembersList()
		}
	}
</script>

<style scoped>
	header{
		background: white;
		height: 6vh;
	}
	.pages{
		display: flex;
		align-items: center;
		justify-content: space-between;
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
	.idCard{
		margin-top: 1vh;
		flex:1;
	}
	.idCard img{
		margin-right: 11%;
	}
	.idCard p{
		line-height: 20vh;
	}
	.idCard em{
		font-style: normal;
		font-size: 14px;
		/* width: 15vh !important; */
	}
	.first{
		border-bottom: 1px solid #EEEEEE;
		padding-bottom: .5vh;
		margin:0 2vh;
	}
	.first >div{
		width: 100%;
		margin: .5vh 0;
	}
	.first img{
		width: 27vh;
		height: 18vh;
		cursor: pointer
	}
	.first >div p{
		display: flex;
		line-height: 3.5vh;
	}
	.first >div p b{
		display: inline-block;	
		flex: 1;
		font-size: 16px;
		font-weight: normal;
	}
	.first span{
		color: gray;
	}
	.first h2{
		font-size: 18px;
		padding: 1vh 0;
	}
	.btn{
		text-align: center;
		margin-top: 4vh;
	}
	.btn button{
		margin: 0 20px;
		width: 10vh;
		height: 4vh;
	}
</style>