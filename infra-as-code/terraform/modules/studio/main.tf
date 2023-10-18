terraform {
  required_providers {
    twilio = {
      source  = "twilio/twilio"
      version = ">=0.4.0"
    }
  }
}

resource "twilio_studio_flows_v2" "chat" {
  friendly_name = "Chat Flow"
  status        = "published"
  definition    = templatefile("../../studio/chat-flow.json", local.params)
}

resource "twilio_studio_flows_v2" "messaging" {
  friendly_name = "Messaging Flow"
  status        = "published"
  definition    = templatefile("../../studio/messaging-flow.json", local.params)
}

locals {
  params = {
    "WORKFLOW_SID_ASSIGN_TO_ANYONE" = var.workflow_sid_assign_to_anyone
    "SERVERLESS_DOMAIN"             = var.serverless_domain
    "SERVERLESS_SID"                = var.serverless_sid
    "SERVERLESS_ENV_SID"            = var.serverless_env_sid
    "CHAT_CHANNEL_SID"              = var.chat_channel_sid
  }
}
