<template>
	<div class="silde_nav">
	    <el-menu
				:default-openeds="['2','3','4','5']"
	      default-active="2-1"
				
	      class="el-menu-vertical-demo"
	      >
	      <!-- <el-menu-item index="1" id='index' @click='select_item($event)'>
	        <i class="iconfont">&#xe663;</i>
	        <span slot="title">首页</span>
	      </el-menu-item> -->
	      <el-submenu index="2" >
	        <template slot="title">
	          <i class="iconfont">&#xe663;</i>
	          <span>基础信息</span>
	        </template>
	        <el-menu-item-group>
	          <el-menu-item index="2-1" id='bank' @click='select_Item($event)'>引流银行</el-menu-item>
	          <el-menu-item index="2-2" id='school' @click='select_Item($event)'>校园管理</el-menu-item>
	        </el-menu-item-group>
	      </el-submenu>
	      <el-submenu index="3">
	        <template slot="title">
	          <i class="iconfont">&#xe663;</i>
	          <span>用户管理</span>
	        </template>
	        <el-menu-item-group>
	          <el-menu-item index="3-1" id='members' @click='select_item($event)'>会员管理</el-menu-item>
	          <el-menu-item index="3-2" id='agent' @click='select_Item($event)'>代理人管理</el-menu-item>
	          <el-menu-item index="3-3" id='agentApproval' @click='select_Item($event)'>代理人审批</el-menu-item>
	        </el-menu-item-group>
	      </el-submenu>
	      <el-submenu index="4">
	        <template slot="title">
	          <i class="iconfont">&#xe663;</i>
	          <span>截图管理</span>
	        </template>
	        <el-menu-item-group>
	          <el-menu-item index="4-1" id='notAudit' @click='select_Item($event)'>待审核截图</el-menu-item>
	          <el-menu-item index="4-2" id='auditRecords' @click='select_Item($event)'>审核记录</el-menu-item>
	        </el-menu-item-group>
	      </el-submenu>
	      <el-submenu index="5">
	        <template slot="title">
	          <i class="iconfont">&#xe663;</i>
	          <span>数据统计</span>
	        </template>
	        <el-menu-item-group>
	          <el-menu-item index="5-1" id='membersStatical' @click='select_item($event)'>会员统计</el-menu-item>
	          <el-menu-item index="5-2" id='agentStatical' @click='select_item($event)'>代理人统计</el-menu-item>
	          <el-menu-item index="5-3" id='captureStatical' @click='select_item($event)'>截图统计</el-menu-item>
	        </el-menu-item-group>
	      </el-submenu>
	      
	    </el-menu>
	</div>
</template>

<script>
	import store from '@/store'
	export default{
		name:'Silde_nav',
		data(){
			return{
				index:'',
			}
		},
		methods:{
		    select_item(e){
		    	//选择子菜单
		    	this.index=e.$el.id
		    	store.dispatch('index',this.index)
		    },
		    select_Item(e){
		    	let timer=null
		    	if(this.$store.state.index==e.$el.id){
		    		this.index=e.$el.id
		    		store.dispatch('index','')
		    		timer=setInterval(()=>{
		    			clearInterval(timer)
		    			store.dispatch('index',this.index)
		    		},50)
		    	}else{
		    		this.index=e.$el.id
		    		store.dispatch('index',this.index)
		    	}
		    }
		}
	}
</script>

<style scoped>
	.el-menu-vertical-demo{
		height: 92vh;
	}
	.el-menu-item{
		min-width: 0 !important;
	}
	.iconfont{
		font-size: 24px;
	}
</style>