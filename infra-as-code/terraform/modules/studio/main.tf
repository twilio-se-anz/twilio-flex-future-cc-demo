terraform {
  required_providers {
    twilio = {
      source  = "twilio/twilio"
      version = ">=0.4.0"
    }
  }
}

locals{
  params = {
    "WORKFLOW_SID_ASSIGN_TO_ANYONE" = var.workflow_sid_assign_to_anyone
    "SERVERLESS_DOMAIN" = var.serverless_domain
    "SERVERLESS_SID" = var.serverless_sid
    "SERVERLESS_ENV_SID" = var.serverless_env_sid
    "CHAT_CHANNEL_SID" = var.chat_channel_sid
    "VOICE_CHANNEL_SID" = var.voice_channel_sid
  }
}
