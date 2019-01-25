import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
	state:{
		index:'bank',
		showLoading:false,
	},
	actions:{
		index(val,index){
			val.commit('index',index)
		},
		show(ctx){
			//loading状态显示
			ctx.commit('show')
		},
	},
	mutations:{
		index(state,index){
			state.index=index
		},
		show(state){
			state.showLoading=!state.showLoading
		},
	}
})
