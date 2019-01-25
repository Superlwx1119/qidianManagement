<template>
	<div>
		<index v-if="this.$store.state.index=='index'"/>
		<Bank v-if="this.$store.state.index=='bank'"/>
		<School v-if="this.$store.state.index=='school'"/>
		<Members v-if="this.$store.state.index=='members'"/>
		<Agent v-if="this.$store.state.index=='agent'"/>
		<AgentApproval v-if="this.$store.state.index=='agentApproval'"/>
		<NotAudit v-if="this.$store.state.index=='notAudit'"/>
		<AuditRecords v-if="this.$store.state.index=='auditRecords'"/>
		<MembersStatistical v-if="this.$store.state.index=='membersStatical'"/>
		<AgentStatistical v-if="this.$store.state.index=='agentStatical'"/>
		<CaptureStatistics v-if="this.$store.state.index=='captureStatical'"/>
	</div>
</template>

<script>
	import index from './components/index'
	import Bank from './components/Bank'
	import School from './components/School'
	import Members from './components/Members'
	import Agent from './components/Agent'
	import AgentApproval from './components/AgentApproval'
	import NotAudit from './components/NotAudit'
	import AuditRecords from './components/AuditRecords'
	import MembersStatistical from './components/MembersStatistical'
	import AgentStatistical from './components/AgentStatistical'
	import CaptureStatistics from './components/CaptureStatistics'
	export default{
		name:'Silde_cont',
		components:{
			index,Bank,School,Members,Agent,AgentApproval,NotAudit,AuditRecords,MembersStatistical,AgentStatistical,CaptureStatistics
		},
		props:{
		},
		mounted(){
//			console.log(this.$store.state.index)
		}
	}
</script>

<style scoped>
</style>