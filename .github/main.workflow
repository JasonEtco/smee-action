workflow "Smee!" {
  on = "push"
  resolves = ["smee"]
}

action "smee" {
  uses = "./"
  args = "--channel smee-action-testing"
}
