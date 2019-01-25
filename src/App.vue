<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
	*{
		padding: 0;
		margin: 0 ;
		list-style: none;
		outline: none;
	}

	.el-table td, .el-table th{
		padding: 1.2vh 0 !important;
	}

	.silde_nav .el-menu-item{
		min-width: 0 !important;
		height: 5vh;
   		line-height: 5vh;
	}
	.el-message-box{
		width: 530px !important;
	}
	.el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed{
		border-right: none !important;
	}
	/* .el-message-box__content{
		text-align: center;
	} */
	.el-table td, .el-table th.is-leaf{
		border-bottom: 1px solid #CED0D5 !important
	}
	.el-menu-item-group__title{
		padding: 0;
	}
	.el-table thead th{
		background: #f5f7fa !important;
	}
	.home .el-menu-item.is-active{
		background: #D4E9FF
	}
	.home .el-submenu__title{
		font-size: 16px;
		height: 6vh;
    	line-height: 6vh;
	}
	.school .el-table__body td{
		height: 5.8vh;
	}
	.school .el-input__icon{
		line-height: 0px !important;
	}
	.bank .el-input__inner{
		height: 30px;
	}
	.bank .el-button{
		height: 30px;
		line-height: 0px;
	}
	.bank .logoPic{
		width: 8vh;
		height: 8vh;
	}
	.bank .cardPic{
		width: 8vh;
		height: 8vh;
	}

	.addBank .el-input{
		width: 20vh;
	}
	.addBank .el-textarea.is-disabled .el-textarea__inner{
		width: 80vh;
	}
	.school .el-input__inner{
		height: 30px;
	}
	.el-message-box__message p{
		width: 250px !important;
	}
	.school .el-button{
		height: 30px;
		line-height: 0px;
	}
	.members .el-table__body td{
		height: 8vh;
	}
	.members .el-input__inner{
		height: 30px;
	}
	
	.members .el-date-editor .el-range__icon{
		line-height: 0px !important;
	}
	.members .el-date-editor .el-range-separator{
		line-height: 21px;
	}
	.members .el-button{
		height: 30px;
		line-height: 0px;
	}
	
	.agent .el-input__inner{
		height: 30px;
	}
	.agent .el-date-editor .el-range__icon{
		line-height: 0px !important;
	}
	.agent .el-date-editor .el-range-separator{
		line-height: 21px;
	}
	.agent .el-button{
		height: 30px;
		line-height: 0px;
	}
	.agent .dateInput{
		width: 25vh !important;
		margin-right: 20px;
	}
	.agent .el-table__body td{
		height: 7.8vh ;
	}
	.agentDatail .el-table__body td{
		height: 5.5vh !important;
	}
	
	.agentApproval .el-input__inner{
		height: 30px;
	}
	.agentApproval .el-date-editor .el-range__icon{
		line-height: 0px !important;
	}
	.agentApproval .el-date-editor .el-range-separator{
		line-height: 21px;
	}
	.agentApproval .el-button{
		height: 30px;
		line-height: 0px;
	}
	.agentApproval .el-table__body td{
		height: 7.8vh !important;
	}
	.agentApproval .dateInput{
		width: 25vh !important;
		margin-right: 1vh;
	}


	.notAudit .el-input__inner{
		height: 30px;
	}
	.notAudit .el-date-editor .el-range__icon{
		line-height: 0px !important;
	}
	.notAudit .el-date-editor .el-range-separator{
		line-height: 21px;
	}
	.notAudit .el-button{
		height: 30px;
		line-height: 0px;
	}
	.notAudit .el-table__body td{
		height: 7.8vh !important;
	}
	.notAudit .dateInput{
		width: 25vh !important;
		margin-right: 20px;
	}

	.bigImg{
		width: 200%;
		max-height:800px
	}
	
	.auditRecords .el-input__inner{
		height: 30px;
	}
	.auditRecords .el-date-editor .el-range__icon{
		line-height: 0px !important;
	}
	.auditRecords .el-date-editor .el-range-separator{
		line-height: 21px;
	}
	.auditRecords .el-button{
		height: 30px;
		line-height: 0px;
	}
	.auditRecords .dateInput{
		width: 25vh;
		margin-right: 20px;
	}
	
	
	.chart1 .el-input__icon{
		line-height: 0;
	}
	.chart .el-input__icon{
		line-height: 0;
	}
	.chart2 .el-input__icon{
		line-height: 0;
	}
	.chart1 .el-tabs__active-bar{
		left: 2vh !important;
	}
	.chart .el-tabs__active-bar{
		left: 2vh !important;
		width:  8vh !important;
	}
	.chart1 .el-tabs__item{
		width: 15vh;
		text-align: center;
	}
	/* .chart2 .el-tabs__item{
		width: 15vh;
		text-align: center;
	} */
	.chart2 .el-tabs__active-bar{
		left: 0vh !important;
		width:  33% !important;
	}
	.chart1 .el-input__inner{
		color: #409EFF;
		width: 14vh !important;
	}
	.chart .el-input__inner{
		color: #409EFF;
		width: 14vh !important;
	}
	.chart1 .pages .el-input__inner{
		width: 10vh !important;
	}
	.chart2 .pages .el-input__inner{
		width: 10vh !important;
	}
	.index  .el-input__inner{
		color: #409EFF;
		width: 25vh;
		height: 3vh;
	}
	.index .el-date-editor .el-range-separator{
		line-height: 21px;
	}
	.index .el-date-editor .el-range__icon{
		line-height: 21px;
	}
	.index .el-button{
		height: 3vh;
		line-height: 0;
	}
	.chart1 .selectMounth .el-input__suffix{
		right: 9vh;
	}
	.chart .selectMounth .el-input__suffix{
		right: 9vh;
	}
	.index .el-tabs--top .el-tabs__item.is-top:nth-child(2){
		padding-left: 3vh;
		margin-right: 3vh;
	}
	.index .chart2 .el-tabs--top .el-tabs__item.is-top:nth-child(2){
		padding-left: 3vh;
		margin-right: 0vh;
	}
	.index .el-tabs{
		height: 45px;
	}
	.index .el-progress-bar__innerText{
		color: black;
	}

	.agent .el-steps--vertical{
		width: 20vh !important;
	}

	.capture .el-table__body td{
		height: 4.5vh !important;
	}


	.AgentStatistical .el-table td{
		height: 4vh;
	}
	.AgentStatistical .el-table th,.el-table td{
		padding: 0.6vh 0 !important
	}
</style>
