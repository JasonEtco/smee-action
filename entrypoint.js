const { Toolkit } = require('actions-toolkit')
const tools = new Toolkit()

// 1. Serialize payload object
// 2. Serialize headers
// 3. Get channel from either the argument or `/${await tools.github.repos.get(tools.context.repo)}`
// 4. Make POST request
// 5. Log stuff

console.log(tools.arguments)
