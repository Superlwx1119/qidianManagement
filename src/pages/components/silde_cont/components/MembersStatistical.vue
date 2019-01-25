<template>
	<div class="index">
		<header>
			<el-breadcrumb separator="/" class='head'>
			  <el-breadcrumb-item :to="{ path: '/' }">数据统计</el-breadcrumb-item>
			  <el-breadcrumb-item><a href="javascript:;">会员统计</a></el-breadcrumb-item>
			</el-breadcrumb>
		</header>
		<div class="cont">
			<div class="data">
				<h2><p>会员总数</p><p class="number">{{data.memberCount}}</p></h2>
				<h2><p>会员办卡数</p><p class="number">{{data.cardCount}}</p></h2>
				<h2><p>本月新增会员数</p><p class="number">{{data.addMemberCount}}</p></h2>
				<h2><p>本月新增办卡数</p><p class="number">{{data.addCardCount}}</p></h2>
			</div>
			<div class="chart1">
				 <el-tabs v-model="activeName1" >
				    <el-tab-pane label="会员总数" name="first"></el-tab-pane>
				  </el-tabs>
				  <el-date-picker
				     class='selectMounth'
				      v-model="memberTime"
				      type="month"
				      @change='selectMounth'
				      value-format='yyyy-MM'
				      placeholder="选择月">
				    </el-date-picker>
				<div id="myChart" :style="{width: '100%', height: '33vh'}"></div>
			</div>
			<div class="chart1">
				 <el-tabs v-model="activeName1" >
				    <el-tab-pane label="会员办卡数" name="first"></el-tab-pane>
				  </el-tabs>
				  <el-date-picker
				     class='selectMounth'
				      v-model="cardTime"
				      type="month"
				      @change='selectMounth2'
				      value-format='yyyy-MM'
				      placeholder="选择月">
				    </el-date-picker>
				<div id="myChart2" :style="{width: '100%', height: '33vh'}"></div>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	import Qs from 'qs'
	import getUrl from '@/assets/js/getUrl.js';
	export default{
		name:'MembersStatistical',
		data(){
			return{
				activeName1:'first',
				url:'',
				data:{},
				memberTime:'',
				cardTime:'',
				days:[],
				days2:[],
				dd:[],
				dd2:[],
				year:'',
				mounth:'',
				year2:'',
				mounth2:'',
				num:[],
				memberList:[],
				membersNum:[],
				cardList:[],
				cardNum:[],
			}
		},
		methods:{
			selectMounth(val){
				//选择查询会员数时间
				if(val){
					this.memberTime=val
					let arr=val.split('-')
					this.year=Number(arr[0])
					this.mounth=Number(arr[1])
					this.getDaysOfMonth(Number(arr[0]),Number(arr[1]))
					this.getMemberStats()	
				}
			},
			selectMounth2(val){
				//选择查询办卡数时间
				if(val){
					this.cardTime=val
					let arr=val.split('-')
					this.year2=Number(arr[0])
					this.mounth2=Number(arr[1])
					this.getDaysOfMonth2(Number(arr[0]),Number(arr[1]))
					this.getMemberStats()
				}
			},
			getMemberStats(){
				let data={
					'memberTime':this.memberTime,
					'cardTime':this.cardTime
				}
				axios({
					headers:{'Content-Type':'application/x-www-form-urlencoded'},
					method: 'post',
					url: this.url+'/platformManage/getMemberStats',
					data:Qs.stringify(data),
					timeout:10000
				}).then(res=>{
//					console.log(res)
					this.data=res.data
					this.memberList=res.data.memberList
					this.cardList=res.data.cardList
					if(res.data.memberList.length==0){
						let zero=[]
						this.days.forEach(item=>{
							zero.push('0')
						})
						this.memberList=zero
					}
					if(res.data.cardList.length==0){
						let zero=[]
						this.days.forEach(item=>{
							zero.push('0')
						})
						this.cardList=zero
					}
					this.drawLine()
					this.drawLine2()
				}).catch((error)=>{
						this.$message.error('请求错误!');
				});
			},
			drawLine(){
		        // 基于准备好的dom，初始化echarts实例
		        let myChart = this.$echarts.init(document.getElementById('myChart'))
		        // 绘制图表
		        myChart.setOption({
		        	title:{
		        		text:this.year+'年'+this.mounth+"月会员数",
						left:'20px',
						textStyle:{//标题内容的样式
							fontStyle:'normal',//主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
							fontWeight:"normal",//可选normal(正常)，bold(加粗)，bolder(加粗)，lighter(变细)，100|200|300|400|500...
							fontSize:14//主题文字字体大小，默认为18px
						}
		        	},
		        	grid: {
				        top:'12%'
				    },
		            tooltip: {},
		            xAxis: {
		                data: this.dd
		            },
		            yAxis: {
//		            	data:[1000,2000,4000,6000,8000,10000,15000,20000]
		            },
		            series: [{
		                name: '会员总数',
		                type: 'line',
		                data: this.memberList,
		                color:'green'
		            }]
		        });
		    },
		    drawLine2(){
		        let myChart2 = this.$echarts.init(document.getElementById('myChart2'))
		        // 绘制办卡数图表
		        myChart2.setOption({
		        	title:{
		        		text:this.year2+'年'+this.mounth2+"月会员办卡数",
						left:'20px',
						textStyle:{//标题内容的样式
							fontStyle:'normal',//主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
							fontWeight:"normal",//可选normal(正常)，bold(加粗)，bolder(加粗)，lighter(变细)，100|200|300|400|500...
							fontSize:14//主题文字字体大小，默认为18px
						}
		        	},
		            tooltip: {},
		            xAxis: {
		                data: this.dd2
		            },
		            grid: {
				        top:'12%'
				    },
		            yAxis: {
//		            	data:[1000,2000,4000,6000,8000,10000,15000,20000]
		            },
		            series: [{
		                name: '会员办卡总数',
		                type: 'line',
		                data: this.cardList,
		                color:'green'
		            }]
		        });
		    },
		    getDaysOfMonth(year,month){
		    	//会员数当前月份天数
		    	this.dd=[]
		    	this.days=[]
		    	var date=new Date(year,month,0);
			    var days=date.getDate();
			    let f = (length) => Array.from({length}).map((v,k) => k);
			    this.days=f(days+1)
			    let arr=this.days.filter(item=>{
			    	item=item.toString()+"号"
			    	if(item!='0号'){
			    		this.dd.push(item)
			    	}
			    	
			    })
			    this.days=this.days.splice(1)
				this.drawLine();
		    },
		    getDaysOfMonth2(year,month){
		    	//办卡数当前月份天数
		    	this.dd2=[]
		    	this.days2=[]
		    	var date=new Date(year,month,0);
			    var days=date.getDate();
			    let f = (length) => Array.from({length}).map((v,k) => k);
			    this.days2=f(days+1)
			    let arr=this.days2.filter(item=>{
			    	item=item.toString()+"号"
			    	if(item!='0号'){
			    		this.dd2.push(item)
			    	}
			    	
			    })
			    this.days2=this.days2.splice(1)
				this.drawLine2()
		    },
		    getDays(){
		 	   //首先查询当前月份
			    let date=new Date()
				let dateY=date.getFullYear()
				let dateM=date.getMonth()+1
				this.year=dateY
				this.mounth=dateM
				this.year2=dateY
				this.mounth2=dateM
				if(dateM<10){
					dateM='0'+dateM
				}
				this.cardTime=dateY+'-'+dateM
				this.memberTime=dateY+'-'+dateM
		    }
		},
		mounted(){
			let url=getUrl()
			this.url=url
			this.getDays()
			this.getDaysOfMonth2(this.year,this.mounth);
			this.getDaysOfMonth(this.year,this.mounth);
			this.getMemberStats()
		}
	}
</script>

<style scoped>
	header{
		background: white;
		height: 6vh;
	}
	.selectMounth{
		position: absolute;
		top: 0.5vh;
		right: 5vh;
		z-index: 99;
	}
	.head{
		line-height: 6vh;
		padding-left: 20px;
		border-left: 2px solid deepskyblue;
	}
	.cont{
		height: 84vh;
		margin: 0.5vh 1vh 0 1vh;
		overflow: hidden;
	}
	.data{
		background: white;
		margin: 1vh;
		width: 98%;
		height: 8vh;
		font-size: 12px;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}
	.data h2{
		font-weight: normal;
	}
	.chart1{
		position: relative;
		background: white;
		margin: 1vh 1vh;
		width: 98%;
		height: 35vh;
	}
	.number{
		padding-top: 10px;
		text-align: center;
		font-weight: bold;
	}
</style>