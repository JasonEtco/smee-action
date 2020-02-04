const path = require('path')
Object.assign(process.env, {
  GITHUB_REPOSITORY: 'JasonEtco/in-a-coffee-shop',
  GITHUB_EVENT_PATH: path.join(__dirname, 'fixtures', 'event.json'),
  GITHUB_WORKSPACE: path.join(__dirname, 'fixtures'),
  GITHUB_WORKFLOW: 'GITHUB_WORKFLOW',
  GITHUB_ACTION: 'GITHUB_ACTION',
  GITHUB_ACTOR: 'GITHUB_ACTOR',
  GITHUB_EVENT_NAME: 'GITHUB_EVENT_NAME',
  GITHUB_SHA: 'GITHUB_SHA',
  GITHUB_REF: 'GITHUB_REF',
  GITHUB_RUN_ID: 'GITHUB_RUN_ID'
})
