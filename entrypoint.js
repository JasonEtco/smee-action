const { Toolkit } = require('actions-toolkit')
const fetch = require('node-fetch')

Toolkit.run(async tools => {
  // 1. Serialize payload object
  const payload = {
    ...tools.context.payload,
    smee: {
      action: tools.context.action,
      actor: tools.context.actor,
      event: tools.context.event,
      sha: tools.context.sha,
      ref: tools.context.ref,
      workflow: tools.context.workflow
    }
  }

  // 2. Serialize headers
  const headers = {
    'X-GitHub-Event': tools.context.event
  }
  // 3. Get channel from either the argument or `/${await tools.github.repos.get(tools.context.repo)}`
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/')
  const channel = process.env.SMEE_CHANNEL || // Use the provided secret
                  tools.arguments.channel || // Use the --channel argument
                  (await tools.github.repos.get({ owner, repo })).data.id // Use the repo's ID

  try {
    // 4. Make POST request
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
  } catch (err) {
    tools.exit.failure(err)
  }
})
