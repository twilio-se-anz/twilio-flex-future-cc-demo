variable "chat_channel_sid" {
  type        = string
  description = "SID of the chat task channel"
  validation {
    condition     = length(var.chat_channel_sid) > 2 && substr(var.chat_channel_sid, 0, 2) == "TC"
    error_message = "chat_channel_sid expected to start with \"TC\"."
  }
}

variable "voice_channel_sid" {
  type        = string
  description = "SID of voice task channel"
  validation {
    condition     = length(var.voice_channel_sid) > 2 && substr(var.voice_channel_sid, 0, 2) == "TC"
    error_message = "voice_channel_sid expected to start with \"TC\"."
  }
}

variable "serverless_domain" {
  type        = string
  description = "serverless domain for flex plugin"
  validation {
    condition     = length(var.serverless_domain) > 26 && substr(var.serverless_domain, 0, 26) == "serverless-future-cc-demo-"
    error_message = "serverless_domain expected to start with \"serverless-future-cc-demo-\"."
  }
}

variable "serverless_sid" {
  type        = string
  description = "serverless sid"
  validation {
    condition     = length(var.serverless_sid) > 2 && substr(var.serverless_sid, 0, 2) == "ZS"
    error_message = "serverless_sid expected to start with \"ZS\"."
  }
}

variable "serverless_env_sid" {
  type        = string
  description = "serverless env sid"
  validation {
    condition     = length(var.serverless_env_sid) > 2 && substr(var.serverless_env_sid, 0, 2) == "ZE"
    error_message = "serverless_env_sid expected to start with \"ZE\"."
  }
}

variable "workflow_sid_assign_to_anyone" {
  type        = string
  description = "SID of the Assign To Anyone workflow"
  validation {
    condition     = length(var.workflow_sid_assign_to_anyone) > 2 && substr(var.workflow_sid_assign_to_anyone, 0, 2) == "WW"
    error_message = "workflow_sid_assign_to_anyone expected to start with \"WW\"."
  }
}
