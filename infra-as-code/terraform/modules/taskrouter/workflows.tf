resource "twilio_taskrouter_workspaces_workflows_v1" "assign_to_anyone" {
  workspace_sid = twilio_taskrouter_workspaces_v1.flex.sid
  friendly_name = "Assign to Anyone"
  configuration = templatefile("../../taskrouter/assign_to_anyone.json", local.params)
}

locals {
  params = {
    "QUEUE_SID_EVERYONE" = twilio_taskrouter_workspaces_task_queues_v1.everyone.sid
  }
}
