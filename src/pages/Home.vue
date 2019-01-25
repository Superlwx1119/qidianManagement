<template>
	<div class="home"  v-loading="$store.state.showLoading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)" v-cloak>
		<header>
			<div class="logo"><img src="../../static/images/logo.jpg"/><span>校园起点运营管理后台</span></div>
			<div class="user"><span class="headImg"><img src="../../static/images/touxiang.png"/></span><span>{{data.username}}</span><span id="iconfont" class="iconfont"><a href="javascript:;" class="out" @click="logOut"><img src="../../static/images/power.png" alt=""></a></span></div>
		</header>
		<div class="cont">
			<el-row>
				<el-col :span='3'><Silde_nav   /></el-col>
				<el-col :span="21"><Silde_cont class='cont'  /></el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
	import Silde_nav from './components/Silde_nav'
	import axios from 'axios'
	import Silde_cont from './components/silde_cont/Silde_cont'
	import getUrl from '@/assets/js/getUrl.js';
	export default{
		name:'Home',
		components:{
			Silde_nav,Silde_cont
		},
		data(){
			return{
				index:'',
				url:'',
				data:{},
				out:''
			}
		},
		methods:{
			logOut(){
				//退出登录
				this.$confirm('是否退出当前用户?', '提示', {
		          confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  center: true,
		          type: 'warning'
		        }).then(()=>{
					window.location.href='https://fy.csgxcf.com/Campus2019/login.jsp?goto=4'
					
				}).catch(()=>{
					 this.$message({
						type: 'info',
						message: '取消操作'
					}); 
				})
				
				return false
			},
			getAdminInfo(){
				//获取用户信息
				axios({
					headers:{'Content-Type':'application/x-www-form-urlencoded'},
					method: 'post',
					url: this.url+'/platformManage/getAdminInfo',
					timeout:10000
				}).then(res=>{
//					console.log(res.data.admin_info)
					this.data=res.data.admin_info
				}).catch((error)=>{
						this.$message.error('请求错误!');
				});
			}
		},
		mounted(){
			let url=getUrl()
			this.url=url
			this.getAdminInfo();
		}
	}
</script>

<style scoped>
	header{
		height: 8vh;
		background: #00182e;
		color: white;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 50px;
	}
	.iconfont img{
		display: block;
		margin-left: 3vh;
		width: 3vh;
		cursor: pointer;
		height: 3vh;
	}
	.logo{
		display: flex;
		align-items: center;
	}
	.logo img{
		height: 40px;
		margin-right: 15px;
		width: 40px;
	}
	.headImg{
		display: block;
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background: white;
	}
	.headImg img{
		width: 30px;
		height: 30px;
	}
	.user{
		
		display: flex;
		width: 20vh;
		align-items: center;
		justify-content: space-around;
	}
	.cont{
		background: #f0f2f5;
	}
</style>