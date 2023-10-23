# these aren't used for anything other than debug output within the CI workflow.

output "workspace_sid" {
  value = module.taskrouter.workspace_sid
  description = "Flex TR Workspace SID"
}

