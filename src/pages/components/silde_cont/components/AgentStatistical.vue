<template>
	<div class="index AgentStatistical">
		<header>
			<el-breadcrumb separator="/" class='head'>
			  <el-breadcrumb-item :to="{ path: '/' }">数据统计</el-breadcrumb-item>
			  <el-breadcrumb-item><a href="javascript:;">代理人统计</a></el-breadcrumb-item>
			</el-breadcrumb>
		</header>
		<div class="cont">
			<div class="data">
				<h2><p>代理人总数</p><p class="number">{{data.proxyCount}}</p></h2>
				<h2><p>本月新增代理人数</p><p class="number">{{data.addProxyCount}}</p></h2>
				<h2><p>覆盖大学所数</p><p class="number">{{data.schoolCount}}</p></h2>
				<h2><p>覆盖城市座数</p><p class="number">{{data.cityCount}}</p></h2>
			</div>
			<div class="chart1">
				 <el-tabs v-model="activeName1" >
				    <el-tab-pane label="会员总数" name="one"></el-tab-pane>
				  </el-tabs>
				  <div class='selectMounth'>
					  月份筛选 
					  <el-date-picker
					      v-model="memberTime"
					      type="month"
					      @change='selectMounth'
					      value-format='yyyy-MM'
					      placeholder="选择月">
					    </el-date-picker>
				  </div>
				<div id="myChart" :style="{width: '100%', height: '31vh'}"></div>
			</div>
			<div class="chart1 hei">
				<el-tabs v-model="activeName2" @tab-click="handleClick">
				    <el-tab-pane label="城市分布" name="first"></el-tab-pane>
				    <el-tab-pane label="学校分布" name="second"></el-tab-pane>
				</el-tabs>
				<el-select v-model="city" @change='choseCity' class='selectMounth2' filterable placeholder="请选择">
					<el-option value='全国'></el-option>
				    <el-option
				      v-for="item in provinces"
				      :key="item"
				      :label="item"
				      :value="item">
				    </el-option>
				  </el-select>
				<div >
				 	<div v-if="activeName2=='first'" class="">
						 <el-table
					    :data="cities"
						@sort-change="sort"
					    max-height='33vh'
					    style="width: 100%"
					    :default-sort = "{prop: 'date', order: 'descending'}"
					    >
					    <el-table-column
					      prop="city"
					      label="城市"
					      width="180">
					    </el-table-column>
					    <el-table-column
					      prop="number"
					      :sort-method="sort"
					      label="用户数"
					      sortable='custom'
					      width="180">
					    </el-table-column>
					    <el-table-column
					      label="比例"
					      show-overflow-tooltip>
					      <template scope="scope">
					          <el-progress :text-inside="true" :stroke-width="18" :percentage="data.schoolCount==0?0:Number((scope.row.number*100/data.proxyCount).toFixed(2))" status="success"></el-progress>
					      </template>
					    </el-table-column>
					  </el-table>
					</div>
					<div v-if="activeName2=='second'" class="">
						<el-table
						@sort-change="sort"
					    :data="schoolNum"
					    max-height='33vh'
					    style="width: 100%"
					    :default-sort = "{prop: 'date', order: 'descending'}"
					    >
					    <el-table-column
					      prop="school"
					      label="学校名称"
					      width="220">
					    </el-table-column>
					    <el-table-column
					      prop="number"
					      label="用户数"
					      sortable='custom'
					      width="180">
					    </el-table-column>
					    <el-table-column
					      label="比例"
					      show-overflow-tooltip>
					      <template scope="scope">
					          <el-progress :text-inside="true" :stroke-width="18" :percentage="data.schoolCount==0?0:Number((scope.row.number*100/data.proxyCount).toFixed(2))" status="success"></el-progress>
					      </template>
					    </el-table-column>
					  </el-table>
					</div>
					<div class="pages">
							<p></p>
							 <el-pagination
						      @size-change="handleSizeChange"
						      @current-change="handleCurrentChange"
							  background
						      :current-page="currentPage4"
						      :page-sizes="[5,10, 20, 30, 40,50,100]"
						      :page-size="size"
						      layout="total, prev, pager, next, jumper"
						      :total="total">
						    </el-pagination>
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
	export default{
		name:'AgentStatistical',
		data(){
			return{
				tableData:[],
				activeName2:'first',
				activeName1:'one',
				url:'',
				data:{},
				size:5,
				memberTime:'',
				city:'全国',
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
				schoolNum:[],
				cities:[],
				cityNum:[],
				currentPage4:1,
		        provinces:[],
		        total:0,
				arr:[],
				sortField:'',
				sortWay:''
			}
		},
		methods:{
			sort(column, prop, order){
				//排序
				if(column.prop){
					this.sortField=column.prop
				}else{
					this.sortField=''
				}
				
				if(column.order){
					if(column.order=='ascending'){
						this.sortWay='asc'
					}else if(column.order=='descending'){
						this.sortWay='desc' 
					}
				}else{
					this.sortWay='' 
				}
				if(this.activeName2=='first'){
					this.getCityStats()
				}
				if(this.activeName2=='second'){
					this.getSchoolStats()
				}
			},
			handleSizeChange(val){
				//选择每页数据条数
				if(this.activeName2=='first'){
					this.size=val
					this.getCityStats()
				}else{
					this.size=val
					this.getSchoolStats()
				}
			},
			handleCurrentChange(val){
				//当前页码
				if(this.activeName2=='first'){
					this.currentPage4=val
					this.getCityStats()
				}else{
					this.currentPage4=val
					this.getSchoolStats()
				}
			},
			choseCity(val){
				this.city=val
				if(this.activeName2=='first'){
					this.getCityStats()
				}else{
					this.getSchoolStats()
				}
			},
			getCitys(){
				//省市列表
				axios.get('./static/mock/city.json')
				.then(res=>{
//					console.log(res.data)
					res.data.forEach(item=>{
//						console.log(item.name)
						this.provinces.push(item.name)
					})
				})
			},
			handleClick(val){
				if(val.name=='first'){
					this.size=5
					this.currentPage4=1
					this.getCityStats()
				}else{
					this.size=5
					this.currentPage4=1
					this.getSchoolStats()
				}
			},
			selectMounth(val){
				//选择查询会员数时间
				if(val){
					this.memberTime=val
					let arr=val.split('-')
					this.year=Number(arr[0])
					this.mounth=Number(arr[1])
					this.getMemberStats()
					this.getDaysOfMonth(Number(arr[0]),Number(arr[1]))
				}
			},
			getMemberStats(){
				let data={
					"proxyTime":this.memberTime, //代理人月份筛选（必传） 
					'city':this.city,
					
				}
				axios({
					headers:{'Content-Type':'application/x-www-form-urlencoded'},
					method: 'post',
					url: this.url+'/platformManage/getProxyStats',
					data:Qs.stringify(data),
					timeout:10000
				}).then(res=>{
					console.log(res)
					this.data=res.data;
					this.tableData=res.data.cityList;
					this.num=res.data.proxyList
					if(res.data.proxyList.length==0){
						let zero=[]
						this.days.forEach(item=>{
							zero.push('0')
						})
						this.num=zero
					}
					this.drawLine()
				}).catch((error)=>{
						this.$message.error('请求错误!');
				});
			},
			getCityStats(){
				//城市分布
				let data={
					'city':this.city,
					'page':this.currentPage4,
					'rows':this.size,
					"sortField":this.sortField,
					"sortWay":this.sortWay
				}
				console.log(data)
				axios({
					headers:{'Content-Type':'application/x-www-form-urlencoded'},
					method: 'post',
					url: this.url+'/platformManage/getCityStats',
					data:Qs.stringify(data),
					timeout:10000
				}).then(res=>{
					console.log(res)
					this.cities=res.data.cityList;
					this.total=res.data.total
					if(this.currentPage4-1>this.total/this.size){
						this.currentPage4=1
						this.sreach()
					}
				}).catch((error)=>{
						this.$message.error('请求错误!');
				});
			},
			getSchoolStats(){
				//学校分布
				let data={
					'city':this.city,
					'page':this.currentPage4,
					'rows':this.size,
					"sortField":this.sortField,
					"sortWay":this.sortWay
				}
				console.log(data)
				axios({
					headers:{'Content-Type':'application/x-www-form-urlencoded'},
					method: 'post',
					url: this.url+'/platformManage/getSchoolStats',
					data:Qs.stringify(data),
					timeout:10000
				}).then(res=>{
//					console.log(res)
					this.schoolNum=res.data.schoolList;
					this.total=res.data.total
					if(this.currentPage4-1>this.total/this.size){
						this.currentPage4=1
						this.sreach()
					}
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
		        		text:this.year+'年'+this.mounth+"月代理人总数",
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
		                name: '代理人总数',
		                type: 'line',
		                data: this.num,
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
			this.getCityStats()
			this.getMemberStats()
			this.getDaysOfMonth(this.year,this.mounth);
			this.getCitys()
		}
	}
</script>

<style scoped>
	header{
		background: white;
		height: 6vh;
	}
	.canvan{
		padding: 0 2vh;
		height: 40vh;
		overflow-y: auto;
	}
	.selectMounth{
		position: absolute;
		top: .5vh;
		right: 5vh;
		z-index: 99;
	}
	.selectMounth2{
		position: absolute;
		top: .5vh;
		right: 13vh;
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
		height: 32vh;
	}
	.chart2{
		position: relative;
		background: white;
		margin: 0 1vh;
		width: 98%;
		height: 41vh;
	}
	.number{
		padding-top: 10px;
		text-align: center;
		font-weight: bold;
	}
	.pages{
		position: absolute;
		background: white;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-around;
		/*padding: 0 2vh;*/
	}
</style>