const core = require('@actions/core')
const { GitHub, context } = require('@actions/github')
const token = process.env.GITHUB_TOKEN
const octokit = new GitHub(token)
const fetch = require('node-fetch')
const hash = require('object-hash')

async function run () {
  try {
    // Serialize payload object
    const payload = {
      ...context.payload,
      'smee-action': {
        action: context.action,
        actor: context.actor,
        event: context.eventName,
        sha: context.sha,
        ref: context.ref,
        workflow: context.workflow
      }
    }
    const smeeChannel = core.getInput('smeeChannel')

    core.debug(`Payload: ${JSON.stringify(payload)}`)

    // Serialize headers
    const headers = {
      'X-GitHub-Event': context.eventName,
      // Generate a hash of the contents of the payload to prevent duplication
      'X-GitHub-Delivery': hash(payload)
    }

    core.debug(`Headers: ${JSON.stringify(headers)}`)

    const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/')
    const repoId = (await octokit.repos.get({ owner, repo })).data.id
    const channel = smeeChannel || repoId // Prefer smeeChannel input, fall back to repository ID

    // Send the data to Smee
    const url = `https://smee.io/${channel}`
    await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      }
    })

    core.info(`Done! Check it out at ${url}.`)
    core.info('Remember that Smee only shows payloads received while your browser tab is open!')
  } catch (error) {
    core.setFailed(error.message)
  }
}

module.exports = run

/* istanbul ignore next */
if (require.main === module) {
  run()
}
