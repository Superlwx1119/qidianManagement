<template>
	<div class="agent">
		<header>
			<el-breadcrumb separator="/" class='head'>
			  <el-breadcrumb-item :to="{ path: '/' }">截图管理</el-breadcrumb-item>
			  <el-breadcrumb-item ><a @click="close">审核记录</a></el-breadcrumb-item>
			  <el-breadcrumb-item><a href="javascript:;">审核记录详情</a></el-breadcrumb-item>
			</el-breadcrumb>
		</header>
		<div class="cont">
			<div class="first">
				<h2>基本信息</h2>
				<div>
					<p><b>姓名：<span>{{data.xm}}</span></b><b>手机号：<span>{{data.mobile}}</span></b><b>微信昵称：<span>{{data.nickName}}</span></b></p>
					<p><b>角色：<span>{{data.level|level}}</span></b><b>所属代理人：<span>{{data.inviterXm}}</span></b><b>代理人手机：<span>{{data.inviterMobile}}</span></b></p>
					<p><b>办卡数：<span>{{data.cardNum}}</span></b><b>上传截图数：<span>{{data.uploadNum}}</span></b><b>已通过截图数：<span>{{data.throughNum}}</span></b></p>
					<p><b>已领红包数：<span>{{data.receiveNum}}</span></b><b>已领红包金额：<span>{{data.receiveMoney}}</span></b><b></b></p>
				</div>
			</div>
			<div class="second">
				<h2>上传资料</h2>
				<div>
				<p><b>截图类型：<span>银行成功短信截图</span></b><b>截图类型：<span>卡片照片</span></b></p>
				<div class="timeLine">
					<el-steps space='31vh' direction="vertical" :active="100">
					  <el-step v-for='(item,index) of smsRows' :key="index" :title="item.approverTime" ></el-step>
					</el-steps>
					<div class="records">
						<p class="msg" v-for='(item,index) of smsRows' :key="index">
							<span>上传时间：{{item.updTime}}</span>
							<img @click="openImg1(item.img)" :src="item.img|img"/>
							<span>审批状态：{{item.imgState|state}}</span>
							<span>审批人：{{item.approver}}</span>
							<span>审批时间：{{item.approverTime}}</span>
							<span>备注：{{item.description}}</span>
						</p>
					</div>
					<el-steps space='31vh' direction="vertical" :active="100">
					  <el-step v-for='(item,index) of cardList' :key="index" :title="item.approverTime" ></el-step>
					</el-steps>
					<div class="records">
						<p class="msg" :key="index" v-for='(item,index) of cardList'>
							<span>上传时间：{{item.updTime}}</span>
							<img @click="openImg2(item.img)" :src="item.img|img"/>
							<span>审批状态：{{item.imgState|state}}</span>
							<span>审批人：{{item.approver}}</span>
							<span>审批时间：{{item.approverTime}}</span>
							<span>备注：{{item.description}}</span>
						</p>
					</div>
				</div>
				</div>
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
		name:'AuditRecordsDetail',
		filters:{
			img(val){
				let url=getUrl()
				return url+'/attachManage/getAttach?attachid='+val
			},
			level(val){
				switch (val){
					case 0:return '会员'
					break;
					case 1:return '代理人'
					break;
				}
			},
			state(val){
				switch (val){
					case 0:return '未提交'
					break;
					case -1:return '审核失败'
					break;
					case 1:return '已提交'
					break;
					case 2:return '审核通过'
					break;
				}
			}
		},
		props:{
			registrationId:String,
			productId:String
		},
		data(){
			return{
				url:'',
				data:{},
				cardList:[],
				smsRows:[],
				currentPage4:1,
				size:10,
				total:0
			}
		},
		methods:{
			openImg1(img){
				//放大截图图片
				this.$alert("<img src="+ this.url+'/attachManage/getAttach?attachid='+img+" class='bigImg'>", '银行短信成功截图', {
					dangerouslyUseHTMLString: true
				});
			},
			openImg2(img){
				//放大卡片图片
				this.$alert("<img src="+ this.url+'/attachManage/getAttach?attachid='+img+" class='bigImg'>", '卡片照片', {
					dangerouslyUseHTMLString: true
				});
			},
			close(){
				this.$emit('show','auditRecords')
			},
			getHasAuditInfo(){
				//代理人数据
				let data={
					'registrationId':this.registrationId,
					'productId':this.productId
				}
				axios({
					headers:{'Content-Type':'application/x-www-form-urlencoded'},
					method: 'post',
					url: this.url+'/platformManage/getHasAuditInfo',
					data:Qs.stringify(data),
					timeout:10000
				}).then(res=>{
					// console.log(res)
					this.data=res.data.uploadapply_info
					this.smsRows=res.data.smsRows
					this.cardList=res.data.cardRows
					$('.records').css('height',Math.max(res.data.cardRows.length,res.data.smsRows.length)*$('.records').height()/2)
					$('.el-steps--vertical').css('height',$('.records').height()+Math.max(res.data.cardRows.length,res.data.smsRows.length)*10+'px')
				}).catch((error)=>{
						this.$message.error('请求错误!');
				});
			},
		},

		mounted(){
			let url=getUrl()
			this.url=url
			this.getHasAuditInfo();
			
		}
	}
</script>

<style scoped>
	header{
		background: white;
		height: 6vh;
	}
	.records{
		flex: 1;
		height: 100%;
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
	.idCard p{
		line-height: 20vh;
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
	}
	.timeLine{
		display: flex;
		overflow-y: auto;
		flex: 1;
		height: 60vh;
		line-height: 2.5vh;
	}
	.msg{
		display: flex;
		width: 30vh;
		background: #EEEEEE;
		height: 30vh;
		margin-left: 2vh;
		margin-bottom: 10px;
		font-size: 14px;
		flex-direction: column;
	}
	.msg span{
		display: inline-block;
		margin-left: 1vh;
		color: black !important;
	}
	.msg img{
		margin: 0 1vh;
		width: 20vh;
		height: 15vh;
		cursor: pointer;
	}
	.first >div p{
		display: flex;
		line-height: 2.5vh;
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
	
	
	.second{
		border-bottom: 1px solid #EEEEEE;
		padding-bottom: .5vh;
		margin:0 2vh;
		height: 68vh;
		overflow-y: auto;
	}
	.second >div{
		width: 100%;
		margin: .5vh 0;
	}
	.second img{
		width: 27vh;
		height: 18vh;
	}
	.second >div p{
		display: flex;
		line-height: 2.5vh;
	}
	.second >div p b{
		display: inline-block;	
		flex: 1;
		font-size: 16px;
		font-weight: normal;
	}
	.second span{
		color: gray;
	}
	.second h2{
		font-size: 18px;
		padding: 1vh 0;
	}
</style>