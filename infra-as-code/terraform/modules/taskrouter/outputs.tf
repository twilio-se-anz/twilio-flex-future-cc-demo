output "workspace_sid" {
  value       = twilio_taskrouter_workspaces_v1.flex.sid
  description = "Flex Task Assignment workspace SID"
}

output "chat_channel_sid" {
  value       = twilio_taskrouter_workspaces_task_channels_v1.chat.sid
  description = "Chat channel SID"
}

output "voice_channel_sid" {
  value       = twilio_taskrouter_workspaces_task_channels_v1.voice.sid
  description = "Voice channel SID"
}

output "workflow_sid_assign_to_anyone" {
  value       = twilio_taskrouter_workspaces_workflows_v1.assign_to_anyone.sid
  description = "Assign To Anyone workflow SID"
}
