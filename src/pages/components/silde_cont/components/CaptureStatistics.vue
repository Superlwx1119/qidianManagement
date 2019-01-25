<template>
	<div class="index capture">
		<header>
			<el-breadcrumb separator="/" class='head'>
			  <el-breadcrumb-item :to="{ path: '/' }">数据统计</el-breadcrumb-item>
			  <el-breadcrumb-item><a href="javascript:;">截图数统计</a></el-breadcrumb-item>
			</el-breadcrumb>
		</header>
		<div class="cont">
			<div class="data">
				<h2><p>截图总数</p><p class="number">{{data.captureCount}}</p></h2>
				<h2><p>审核成功数</p><p class="number">{{data.checkCount}}</p></h2>
				<h2><p>本月新增截图数</p><p class="number">{{data.addCaptureCount}}</p></h2>
				<h2><p>本月审核成功数</p><p class="number">{{data.addCheckCount}}</p></h2>
			</div>
			<div class="chart">
				 <el-tabs v-model="activeName1" >
				    <el-tab-pane label="截图总数" name="one"></el-tab-pane>
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
			<div class="chart2">
				<el-tabs  v-model="activeName2" @tab-click="handleClick">
				    <el-tab-pane label="总数据" name="first"></el-tab-pane>
				    <el-tab-pane label="银行短信成功截图数" name="second"></el-tab-pane>
				    <el-tab-pane label="卡片照片数" name="third"></el-tab-pane>
				</el-tabs>
				<div class='selectMounth2'>
					 <el-date-picker
				      v-model="time"
				      type="daterange"
				      align="right"
				      unlink-panels
				      @change='change'
				      range-separator="-"
				      value-format="yyyy-MM-dd"
				      start-placeholder="开始日期"
				      end-placeholder="结束日期"
				      :picker-options="pickerOptions">
				    </el-date-picker>
						<a href="javascript:;" class="down" @click='exportExcel'><el-button type="primary" class='getOut' >导出</el-button></a>
				</div>
				<div >
				 	<div v-if="activeName2=='first'" class="">
						 <el-table
					    :data="tableData"
					    max-height='33vh'
					    id='out-table'
					    style="width: 100%"
					    >
					    <el-table-column
					   	  prop="date"
					      label="序号"
					      width="50">
					    </el-table-column>
					    <el-table-column
					      prop="time"
					      align="center"
					      label="日期"
					      >
					    </el-table-column>
					    <el-table-column
					      prop="sum"
					      align="center"
					      label="上传截图数"
					      >
					    </el-table-column>
					    <el-table-column
					      prop="message"
					      label="银行短信成功截图数"
					      align="center"
								width='200'
					      >
					    </el-table-column>
					    <el-table-column
					      prop="card"
					      align="center"
					      label="卡片照片数"
					      >
					    </el-table-column>
					    <el-table-column
					      prop="pass"
					      align="center"
					      label="审核通过数"
					      >
					    </el-table-column>
					    <el-table-column
					      prop="decline"
					      align="center"
					      label="审核拒绝数"
					      width="180">
					    </el-table-column>
					    <el-table-column
					      prop="red"
					      label="已领红包数"
					      align="center"
					      >
					    </el-table-column>
					    <el-table-column
					      prop="money"
					      label="已领红包金额"
					      align="center"
					      >
					    </el-table-column>
					  </el-table>
					</div>
					<div v-if="activeName2=='second'" class="">
						<el-table
					    :data="tableData"
					    max-height='33vh'
					    id='out-table'
					    style="width: 100%"
					    >
					    <el-table-column
					   	  prop="date"
					      label="序号"
					      width="50">
					    </el-table-column>
					    <el-table-column
					      prop="time"
					      align="center"
					      label="日期"
					      >
					    </el-table-column>
					    <el-table-column
					      prop="sum"
					      label="银行短信成功截图数"
					      align="center"
					      >
					    </el-table-column>
					    <el-table-column
					      prop="pass"
					      align="center"
					      label="审核通过数"
					      >
					    </el-table-column>
					    <el-table-column
					      prop="decline"
					      align="center"
					      label="审核拒绝数"
					      width="180">
					    </el-table-column>
					    <el-table-column
					      prop="red"
					      label="已领红包数"
					      align="center"
					      >
					    </el-table-column>
					    <el-table-column
					      prop="money"
					      label="已领红包金额"
					      align="center"
					      >
					    </el-table-column>
					  </el-table>
					</div>
					<div v-if="activeName2=='third'" class="">
						<el-table
					    :data="tableData"
					    id='out-table'
					    max-height='33vh'
					    style="width: 100%"
					    >
					    <el-table-column
					   	  prop="date"
					      label="序号"
					      width="50">
					    </el-table-column>
					    <el-table-column
					      prop="time"
					      align="center"
					      label="日期"
					      >
					    </el-table-column>
					    <el-table-column
					      prop="sum"
					      align="center"
					      label="卡片照片数"
					      >
					    </el-table-column>
					    <el-table-column
					      prop="pass"
					      align="center"
					      label="审核通过数"
					      >
					    </el-table-column>
					    <el-table-column
					      prop="decline"
					      align="center"
					      label="审核拒绝数"
					      width="180">
					    </el-table-column>
					    <el-table-column
					      prop="red"
					      label="已领红包数"
					      align="center"
					      >
					    </el-table-column>
					    <el-table-column
					      prop="money"
					      label="已领红包金额"
					      align="center"
					      >
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
						      layout="total,  prev, pager, next, jumper"
						      :total="total">
						    </el-pagination>
						</div>
				</div>
				
			</div>
		</div>
	</div>
</template>

<script>
	import FileSaver from 'file-saver'
	import XLSX from 'xlsx'
	import axios from 'axios'
	import Qs from 'qs'
	import getUrl from '@/assets/js/getUrl.js';
	export default{
		name:'CaptureStatistics',
		data(){
			return{
				total:0,
				size:5,
				begin:'',
				end:'',
				time:'',
				currentPage4:1,
				pickerOptions: {
		          shortcuts: [{
		            text: '最近一周',
		            onClick(picker) {
		              const end = new Date();
		              const start = new Date();
		              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
		              picker.$emit('pick', [start, end]);
		            }
		          }, {
		            text: '最近一个月',
		            onClick(picker) {
		              const end = new Date();
		              const start = new Date();
		              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
		              picker.$emit('pick', [start, end]);
		            }
		          }, {
		            text: '最近三个月',
		            onClick(picker) {
		              const end = new Date();
		              const start = new Date();
		              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
		              picker.$emit('pick', [start, end]);
		            }
		          }]
		        },
				tableData:[],
				activeName2:'first',
				activeName1:'one',
				url:'',
				data:{},
				memberTime:'',
				days:[],
				dd:[],
				year:'',
				mounth:'',
				num:[],
				memberList:[],
				membersNum:[],
			}
		},
		methods:{
			exportExcel () {
				 let name=''
				 switch (this.activeName2){
					case 'first':
					$('.down').attr('href',this.url+'/platformManage/exportUploadStats?startTime='+this.begin+'&endTime='+this.end)
					return false
				 	break;
				 	case 'second':$('.down').attr('href',this.url+'/platformManage/exportUploadMessageStats?startTime='+this.begin+'&endTime='+this.end)
					return false
				 	break;
				 	case 'third':$('.down').attr('href',this.url+'/platformManage/exportUploadCardStats?startTime='+this.begin+'&endTime='+this.end)
					return false
				 	break;
				 }
		        //  /* generate workbook object from table */
		        //  var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'))
		        //  /* get binary string as output */
		        //  var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
		        //  try {
		        //      FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), name+'.xlsx')
		        //  } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
		        //  return wbout
		    },
			handleSizeChange(val){
				//选择每页数据条数
				this.size=val
				if(this.activeName2=='first'){
					this.getUploadStats()
				}else if(this.activeName2=='second'){
					this.getUploadCardStats()
				}else{
					this.getUploadMessageStats()
				}
			},
			handleCurrentChange(val){
				//当前页码
				this.currentPage4=val
				if(this.activeName2=='first'){
					this.getUploadStats()
				}else if(this.activeName2=='second'){
					this.getUploadCardStats()
				}else{
					this.getUploadMessageStats()
				}
			},
			change(val){
				//改变月份查询
				if(val){
					let begin=val[0]
					let end=val[1]
					this.begin=begin
					this.end=end
					if(this.activeName2=='first'){
						this.getUploadStats()
					}else if(this.activeName2=='second'){
						this.getUploadMessageStats()
					}else{
						this.getUploadCardStats()
					}
				}else{
					this.begin=''
					this.end=''
					if(this.activeName2=='first'){
						this.getUploadStats()
					}else if(this.activeName2=='second'){
						this.getUploadMessageStats()
					}else{
						this.getUploadCardStats()
					}
				}
				
			},
			handleClick(tab){
				//切换标签查询
				if(this.activeName2=='first'){
					this.size=5
					this.currentPage4=1
					this.getUploadStats()
				}else if(this.activeName2=='second'){
					this.size=5
					this.currentPage4=1
					this.getUploadMessageStats()
				}else{
					this.size=5
					this.currentPage4=1
					this.getUploadCardStats()
				}
			},
			selectMounth(val){
				//选择查询会员数时间
				if(val){
					this.memberTime=val
					let arr=val.split('-')
					this.year=Number(arr[0])
					this.mounth=Number(arr[1])
					this.getDaysOfMonth(Number(arr[0]),Number(arr[1]))
					this.getCaptureStats()
				}
			},
			getCaptureStats(){
				//截图统计
				let data={
					'captureTime':this.memberTime
				}
				axios({
					headers:{'Content-Type':'application/x-www-form-urlencoded'},
					method: 'post',
					url: this.url+'/platformManage/getCaptureStats',
					data:Qs.stringify(data),
					timeout:10000
				}).then(res=>{
//					console.log(res)
					this.data=res.data
					this.num=res.data.captureList
					if(res.data.captureList.length==0){
						let zero=[]
						this.days.forEach(item=>{
							zero.push('0')
						})
						this.num=zero
					}
					this.drawLine();
				}).catch((error)=>{
						this.$message.error('请求错误!');
				});
			},
			getUploadStats(){
				//截图总数据
				let data={
						"startTime":this.begin, //开始日期（必传） 
						"endTime":this.end, // 结束日期（必传） 
						"page": this.currentPage4, // 分页参数页码（非必传）
						"rows": this.size,
				}
				axios({
					headers:{'Content-Type':'application/x-www-form-urlencoded'},
					method: 'post',
					url: this.url+'/platformManage/getUploadStats',
					data:Qs.stringify(data),
					timeout:10000
				}).then(res=>{
					// console.log(res)
					this.tableData=res.data.captureSumList
					this.tableData.forEach((item,index)=>{
						if(this.currentPage4>1){
							this.tableData[index].date =(this.currentPage4-1)*this.size+index+1
						}else{
							this.tableData[index].date =index+1
						}
					})
					this.total=res.data.total
					if(this.currentPage4-1>this.total/this.size){
						this.currentPage4=1
						this.getUploadStats()
					}
				}).catch((error)=>{
						this.$message.error('请求错误!');
				});
			},
			getUploadCardStats(){
				//卡片统计
				let data={
						"startTime":this.begin, //开始日期（必传） 
						"endTime":this.end, // 结束日期（必传）
						"page": this.currentPage4, // 分页参数页码（非必传）
						"rows": this.size, 
				}
				console.log(data)
				axios({
					headers:{'Content-Type':'application/x-www-form-urlencoded'},
					method: 'post',
					url: this.url+'/platformManage/getUploadCardStats',
					data:Qs.stringify(data),
					timeout:10000
				}).then(res=>{
					// console.log(res)
					this.tableData=res.data.captureCardList
					this.tableData.forEach((item,index)=>{
						if(this.currentPage4>1){
							this.tableData[index].date =(this.currentPage4-1)*this.size+index+1
						}else{
							this.tableData[index].date =index+1
						}
					})
					this.total=res.data.total
					if(this.currentPage4-1>this.total/this.size){
						this.currentPage4=1
						this.getUploadCardStats()
					}
				}).catch((error)=>{
						this.$message.error('请求错误!');
				});
			},
			getUploadMessageStats(){
				//银行截图统计
				let data={
						"startTime":this.begin, //开始日期（必传） 
						"endTime":this.end, // 结束日期（必传） 
						"page": this.currentPage4, // 分页参数页码（非必传）
						"rows": this.size,
				}
				// console.log(data)
				axios({
					headers:{'Content-Type':'application/x-www-form-urlencoded'},
					method: 'post',
					url: this.url+'/platformManage/getUploadMessageStats',
					data:Qs.stringify(data),
					timeout:10000
				}).then(res=>{
					// console.log(res)
					this.tableData=res.data.captureMessageList
					this.tableData.forEach((item,index)=>{
						if(this.currentPage4>1){
							this.tableData[index].date =(this.currentPage4-1)*this.size+index+1
						}else{
							this.tableData[index].date =index+1
						}
					})
					this.total=res.data.total
					if(this.currentPage4-1>this.total/this.size){
						this.currentPage4=1
						this.getUploadMessageStats()
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
		        		text:this.year+'年'+this.mounth+"月截图总数",
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
		                name: '截图总数',
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
			this.getCaptureStats()
			this.getDaysOfMonth(this.year,this.mounth);
			this.getUploadStats()
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
		display: flex;
		align-items: center;
		position: absolute;
		top: .5vh;
		right: 13vh;
		z-index: 99;
	}
	.selectMounth2 button{
	margin-left: 2vh;}
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
	.chart{
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