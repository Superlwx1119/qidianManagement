<template>
	<div class="agent agentDatail">
		<header>
			<el-breadcrumb separator="/" class='head'>
			  <el-breadcrumb-item :to="{ path: '/' }">用户管理</el-breadcrumb-item>
			  <el-breadcrumb-item ><a @click="close">代理人管理</a></el-breadcrumb-item>
			  <el-breadcrumb-item><a href="javascript:;">代理人详情</a></el-breadcrumb-item>
			</el-breadcrumb>
		</header>
		<div class="cont">
			<div class="first">
				<h2>代理人基本信息</h2>
				<div>
					<p><b>代理人姓名：<span>{{data.xm}}</span></b><b>手机号：<span>{{data.mobile}}</span></b><b>微信昵称：<span>{{data.nickName}}</span></b></p>
					<p><b>学校名称：<span>{{data.schoolName}}</span></b><b>所属代理人：<span>{{data.inviterXm}}</span></b><b>代理人手机：<span>{{data.inviterMobile}}</span></b></p>
					<p><b>办卡数：<span>{{data.cardNum}}</span></b><b>上传截图数：<span>{{data.uploadNum}}</span></b><b>已通过截图数：<span>{{data.throughNum}}</span></b></p>
					<p><b>已领红包数：<span>{{data.receiveNum}}</span></b><b>已领红包金额：<span>{{data.receiveMoney}}</span></b><b></b></p>
					<p class="idCard"><em>身份证正面照：</em><img @click="openImg1" :src="data.idCardPositive|img"/><em>身份证反面照：</em><img @click="openImg2" :src="data.idCardPeverse|img"/><em></em><em></em></p>
				</div>
			</div>
			<div class="first">
				<h2>代理数据</h2>
				<div>
				<p><b>会员数：<span>{{data.membersNum}}</span></b><b>积分：<span>{{data.integral}}</span></b><b>奖励金：<span>{{data.bonus}}</span></b></p>
					<p><b>会员办卡数：<span>{{data.membersCardNum}}</span></b><b>会员上传截图数：<span>{{data.membersUploadNum}}</span></b><b>审核成功数：<span>{{data.membersThroughNum}}</span></b></p>
					</div>
			</div>
			<div class="first">
				<h2>会员列表</h2>
				<el-table
				    ref="multipleTable"
					max-height='28vh'
				    :data="list"
				    tooltip-effect="dark"
				    style="width: 100%"
				    >
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
				      label="会员姓名"
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
				      prop="cardNum"
				      align="center"
				      label="办卡数"
				      >
				    </el-table-column>
				    <el-table-column
				      prop="uploadNum"
				      align="center"
				      label="上传截图数"
				      >
				    </el-table-column>
				    <el-table-column
				      prop="throughNum"
				      label="审核成功数"
				      align="center"
				      >
				    </el-table-column>
				    <el-table-column
				      prop="bonusNum"
				      label="代理人领奖励金数"
				      align="center"
				      >
				    </el-table-column>
				    <el-table-column
				      prop="bonusMoney"
				      align="center"
				      label="代理人领奖励金额"
				      show-overflow-tooltip>
				    </el-table-column>
				  </el-table>
				  <div class="pages">
				<p></p>
				 <el-pagination
			      @size-change="handleSizeChange"
			      @current-change="handleCurrentChange"
			      :current-page="currentPage4"
			      :page-sizes="[4,10, 20, 30, 40,50,100]"
			      :page-size="size"
			      layout="total,  prev, pager, next, jumper"
			      :total="total">
			    </el-pagination>
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
		name:'AgentDetails',
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
				size:4,
				total:0
			}
		},
		methods:{
			close(){
				this.$emit('show','agent')
			},
			openImg1(){
				//放大身份证正面
				this.$alert("<img src="+ this.url+'/attachManage/getAttach?attachid='+this.data.idCardPositive+" class='bigImg'>", '身份证正面照片', {
					dangerouslyUseHTMLString: true
				});
			},
			openImg2(){
				//放大身份证反面
				this.$alert("<img src="+ this.url+'/attachManage/getAttach?attachid='+this.data.idCardPeverse+" class='bigImg'>", '身份证反面照片', {
					dangerouslyUseHTMLString: true
				});
			},
			getAgentInfo(){
				//代理人数据
				let data={
					'registrationId':this.registrationId
				}
				axios({
					headers:{'Content-Type':'application/x-www-form-urlencoded'},
					method: 'post',
					url: this.url+'/platformManage/getAgentInfo',
					data:Qs.stringify(data),
					timeout:10000
				}).then(res=>{
//					console.log(res)
					this.data=res.data.registration_info
				}).catch((error)=>{
						this.$message.error('请求错误!');
				});
			},
			getAgentMembersList(){
				//代理人会员列表
				let data={
					'registrationId':this.registrationId
				}
				axios({
					headers:{'Content-Type':'application/x-www-form-urlencoded'},
					method: 'post',
					url: this.url+'/platformManage/getAgentMembersList',
					data:Qs.stringify(data),
					timeout:10000
				}).then(res=>{
//					console.log(res)
					this.list=res.data.rows
					this.total=res.data.total
					this.list.forEach((item,index)=>{
						//添加序号
						if(this.currentPage4>1){
							this.list[index].date =(this.currentPage4-1)*this.size+index+1
						}else{
							this.list[index].date =index+1
						}
					})
				}).catch((error)=>{
						this.$message.error('请求错误!');
				});
			},
			handleSizeChange(){
				
			},
			handleCurrentChange(){
				
			}
		},
		mounted(){
			let url=getUrl()
			this.url=url
			this.getAgentInfo();
			this.getAgentMembersList()
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
		cursor: pointer;
	}
	.idCard p{
		line-height: 20vh;
	}
	.idCard em{
		
		font-style: normal;
		font-size: 14px;
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
	.first >div p{
		display: flex;
		line-height: 2.5vh;
	}
	.first >div p b{
		display: inline-block;	
		flex: 1;
		font-size: 14px;
		line-height: 26px;
		font-weight: normal;
	}
	.first span{
		color: gray;
	}
	.first h2{
		font-size: 18px;
		padding: 1vh 0;
	}
</style>