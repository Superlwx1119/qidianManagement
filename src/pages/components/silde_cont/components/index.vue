<template>
	<div class="index">
		<div class="cont">
			<h2><p>总用户数</p><p class="number">{{data.registrationNum}}</p></h2>
			<h2><p>总办卡数</p><p class="number">{{data.cardNum}}</p></h2>
			<h2><p>总上传截图</p><p class="number">{{data.uploadNum}}</p></h2>
			<h2><p>总发放红包金额</p><p class="number">{{data.receiveMoney}}</p></h2>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	import Qs from 'qs'
	import getUrl from '@/assets/js/getUrl.js';
	export default{
		name:'Index',
		data(){
			return{
				url:'',
				data:{}
			}
		},
		methods:{
			getHome(){
				axios({
					headers:{'Content-Type':'application/x-www-form-urlencoded'},
					method: 'post',
					url: this.url+'/platformManage/getHomeDataOne',
					timeout:10000
				}).then(res=>{
//					console.log(res.data.home_data)
					this.data=res.data.home_data
				}).catch((error)=>{
						this.$message.error('请求错误!');
				});
			}
		},
		mounted(){
			let url=getUrl()
			this.url=url
			this.getHome()
		}
	}
</script>

<style scoped>
	.cont{
		background: white;
		margin: 15px;
		width: 98%;
		height: 150px;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}
	.cont h2{
		font-weight: normal;
	}
	.number{
		padding-top: 10px;
		text-align: center;
		font-weight: bold;
	}
</style>