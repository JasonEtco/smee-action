const core = require('@actions/core')
const { Toolkit } = require('actions-toolkit')
const fetch = require('node-fetch')

Toolkit.run(async tools => {
  // Serialize payload object
  const payload = {
    ...tools.context.payload,
    'smee-action': {
      action: tools.context.action,
      actor: tools.context.actor,
      event: tools.context.event,
      sha: tools.context.sha,
      ref: tools.context.ref,
      workflow: tools.context.workflow
    }
  }

  // Serialize headers
  const headers = {
    'X-GitHub-Event': tools.context.event,
    // Used to prevent duplication
    'X-GitHub-Delivery': process.env.GITHUB_RUN_ID
  }
  // Get the channel id
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/')
  const channel = core.getInput('channel') || // Use the provided secret
                  (await tools.github.repos.get({ owner, repo })).data.id // Use the repo's ID

  try {
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

    tools.log.success(`Done! Check it out at ${url}.`)
    tools.log.info('Remember that Smee only shows payloads received while your browser tab is open!')
    core.setOutput('url', url)
  } catch (err) {
    core.setFailed(err)
  }
})
