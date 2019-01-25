<template>
	<div class="agent doAgent">
		<header>
			<el-breadcrumb separator="/" class='head'>
			  <el-breadcrumb-item :to="{ path: '/' }">截图管理</el-breadcrumb-item>
			  <el-breadcrumb-item ><a @click="close">待审核截图</a></el-breadcrumb-item>
			  <el-breadcrumb-item><a href="javascript:;">待审核截图详情</a></el-breadcrumb-item>
			</el-breadcrumb>
		</header>
		<div class="cont">
			<div class="first">
				<h2>基本信息</h2>
				<div>
					<p><b>姓名：<span>{{data.xm}}</span></b><b>手机号：<span>{{data.mobile}}</span></b><b>微信昵称：<span>{{data.nickName}}</span></b></p>
					<p><b>角色：<span>{{data.level|level}}</span></b><b>所属代理人：<span>{{data.inviterXm}}</span></b><b>代理人手机：<span>{{data.inviterMobile}}</span></b></p>
					<p><b>上传截图数：<span>{{data.uploadNum}}</span></b><b>已通过截图数：<span>{{data.throughNum}}</span></b><b>已领红包数：<span>{{data.receiveNum}}</span></b></p>
				</div>
			</div>
			<div class="second">
				<h2>上传资料</h2>
				<div>
				<p><b v-if="data.type==0">截图类型：<span>银行成功短信截图</span></b><b v-if="data.type==1">截图类型：<span>卡片照片</span></b></p>
				<div class="timeLine">
					<el-steps space='31vh' v-show="data.type==0" direction="vertical" :active="100">
					  <el-step :title="data.imgUpTime" ></el-step>
					  <el-step v-for='(item,index) of rows' :key="index" :title="item.updTime" ></el-step>
					</el-steps>
					<div class="records" v-show="data.type==0">
						<p class="msg" >
							<span>上传时间：{{data.imgUpTime}}</span>
							<img @click="openImg1" :src="data.img|img"/>
							<span class="audit"><el-button  type="primary" @click="pass">通过</el-button><el-button @click="refused">拒绝</el-button></span>
						</p>
						<p class="msg" :key="index" v-for='(item,index) of rows'>
							<span>上传时间：{{item.updTime}}</span>
							<img @click="openImg3(item.img)"  :src="item.img|img"/>
							<span>审批状态：{{item.imgState|state}}</span>
							<span>审批人：{{item.approver}}</span>
							<span>审批时间：{{item.approverTime}}</span>
							<span>备注：{{item.description}}</span>
						</p>
					</div>
					<el-steps space='31vh' v-show="data.type==1" direction="vertical" :active="100">
						<el-step :title="data.imgUpTime" ></el-step>
					  <el-step v-for='(item,index) of  rows' :key="index" :title="item.updTime" ></el-step>
					</el-steps>
					<div class="records" v-show="data.type==1">
						<p class="msg" >
							<span>上传时间：{{data.imgUpTime}}</span>
							<img @click="openImg2" :src="data.img|img"/>
							<span  class="audit"><el-button  type="primary" @click="pass">通过</el-button><el-button @click="refused">拒绝</el-button></span>
						</p>
						<p class="msg" :key="index" v-for='(item,index) of rows'>
							<span>上传时间：{{item.updTime}}</span>
							<img @click="openImg4(item.img)"  :src="item.img|img"/>
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
		name:'DoAudit',
		props:{
			applyId:String
		},
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
		data(){
			return{
				url:'',
				data:{},
				cardList:[],
				smsRows:[],
				currentPage4:1,
				size:10,
				total:0,
				rows:[],
				description:'',
				smsImg:'',
				cardImg:''
			}
		},
		methods:{
			openImg1(){
				//放大截图图片
				this.$alert("<img src="+ this.url+'/attachManage/getAttach?attachid='+this.data.img+" class='bigImg'>", '银行短信成功截图', {
					dangerouslyUseHTMLString: true
				});
			},
			openImg2(){
				//放大卡片图片
				this.$alert("<img src="+ this.url+'/attachManage/getAttach?attachid='+this.data.img+" class='bigImg'>", '卡片照片', {
					dangerouslyUseHTMLString: true
				});
			},
			openImg3(img){
				//放大记录里截图图片
				this.$alert("<img src="+ this.url+'/attachManage/getAttach?attachid='+img+" class='bigImg'>", '银行短信成功截图', {
					dangerouslyUseHTMLString: true
				});
			},
			openImg4(img){
				//放大记录里卡片图片
				this.$alert("<img src="+ this.url+'/attachManage/getAttach?attachid='+img+" class='bigImg'>", '卡片照片', {
					dangerouslyUseHTMLString: true
				});
			},
			pass(){
				//通过审核
				this.$confirm('此操作将该图片审核通过, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	let data={
						'applyId':this.applyId,
						"imgState":"2",
						'description':'无'
					}
					axios({
						headers:{'Content-Type':'application/x-www-form-urlencoded'},
						method: 'post',
						url: this.url+'/platformManage/subStayAudit',
						data:Qs.stringify(data)
					}).then(res=>{
						console.log(res)
						if(res.data.error_code==0){
			        		this.$alert('审核成功！', '提示', {
					          confirmButtonText: '确定',
					        });
					        this.close();
			        	}
					})
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除'
		          });          
		        });
				
			},
			refused(){
				//拒绝审核
				this.$prompt('拒绝理由/备注:', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				}).then(({ value }) => {
					if(!value){
						this.$alert('请填写拒绝理由!', '提示', {
							confirmButtonText: '确定',
						});
						return false
					}
					let data={
						'applyId':this.applyId,
						"imgState":"-1",
						'description':value//拒绝理由
					}
					axios({
						headers:{'Content-Type':'application/x-www-form-urlencoded'},
						method: 'post',
						url: this.url+'/platformManage/subStayAudit',
						data:Qs.stringify(data)
					}).then(res=>{
						console.log(res)
						if(res.data.error_code==0){
							this.$alert('拒绝成功！', '提示', {
					          confirmButtonText: '确定',
					        });
					        this.close();
						}
					})
					
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消输入'
					});       
				});
			},
			close(){
				this.$emit('show','notAudit')
			},
			getStayAuditInfo(){
				//代理人数据
				let data={
					'applyId':this.applyId,
				}
				axios({
					headers:{'Content-Type':'application/x-www-form-urlencoded'},
					method: 'post',
					url: this.url+'/platformManage/getStayAuditInfo',
					data:Qs.stringify(data)
				}).then(res=>{
					console.log(res)
					this.data=res.data.uploadapply_info
					this.rows=res.data.rows
					// $('.records').css('height',$('.records').height()/2+(res.data.rows)*$('.msg').height())
					// $('.el-steps--vertical').css('height',$('.records').height())
					$('.records').css('height',(res.data.rows)*$('.records').height()/2)
					$('.el-steps--vertical').css('height',$('.records').height()+(res.data.rows)*10+'px')
				})
			},
		},
		mounted(){
			let url=getUrl()
			this.url=url
			this.getStayAuditInfo();
		}
	}
</script>

<style scoped>
	.bigImg{
		height: 200px !important;
	}
	.audit {
		display: flex !important;
		justify-content: center;
		align-items: center;
		margin: 3vh 2vh;
	}
	header{
		background: white;
		height: 6vh;
	}
	.records{
		flex: 1;
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
	.first >div b{
		line-height: 4vh;
	}
	.first img{
		width: 27vh;
		height: 18vh;
	}
	.timeLine{
		display: flex;
		flex: 1;
		overflow-y: auto;
		height: 59vh;
		line-height: 2.5vh;
	}
	.msg{
		display: flex;
		width: 30vh;
		background: #EEEEEE;
		height: 30vh;
		margin-left: 2vh;
		margin-bottom: 10px;
		box-sizing: border-box;
		font-size: 14px;
		flex-direction: column;
	}
	.msg span{
		display: inline-block;
		margin-left: 1vh;
		color: black !important;
	}
	.msg img{
		cursor: pointer;
		margin:0 1vh;
		width: 20vh;
		height: 15vh;
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