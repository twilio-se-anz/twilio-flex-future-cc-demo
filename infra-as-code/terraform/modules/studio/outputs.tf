output "chat_flow_sid" {
  value       = twilio_studio_flows_v2.chat.sid
  description = "Chat Flow SID"
}

output "messaging_flow_sid" {
  value       = twilio_studio_flows_v2.messaging.sid
  description = "Messaging Flow SID"
}
