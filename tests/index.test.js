const { Toolkit } = require('actions-toolkit')
const { Signale } = require('signale')
const nock = require('nock')

describe('smee-action', () => {
  let func, tools, data

  beforeEach(() => {
    Toolkit.run = jest.fn(fn => { func = fn })
    require('../entrypoint')

    const logger = new Signale({ disabled: true })
    logger.info = jest.fn()
    logger.success = jest.fn()

    nock('https://api.github.com')
      .get(/\/repos\/.*\/.*/).reply(200, { id: 123 })

    tools = new Toolkit({ logger })
    tools.exit.failure = jest.fn()

    nock('https://smee.io')
      .post(/.*/).reply(200, (match, body) => {
        data = { match, body }
      })
  })

  it('makes a POST request to smee.io using the repository\'s id', async () => {
    await func(tools)
    expect(data.match).toBe('/123')
    expect(data.body).toMatchSnapshot()
  })

  it('makes a POST request to smee.io using SMEE_CHANNEL env var', async () => {
    process.env.SMEE_CHANNEL = 'pizzadog'
    await func(tools)
    expect(data.match).toBe('/pizzadog')
    expect(data.body).toMatchSnapshot()
    delete process.env.SMEE_CHANNEL
  })

  it('makes a POST request to smee.io using --channel argument', async () => {
    tools.arguments.channel = 'arg-im-a-pirate'
    await func(tools)
    expect(data.match).toBe('/arg-im-a-pirate')
    expect(data.body).toMatchSnapshot()
  })

  it('exits with a failure if the POST fails', async () => {
    nock.cleanAll()
    nock('https://smee.io').post(/.*/).replyWithError(500)
    nock('https://api.github.com')
      .get(/\/repos\/.*\/.*/).reply(200, { id: 123 })

    await func(tools)
    expect(tools.exit.failure).toHaveBeenCalled()
    expect(tools.exit.failure.mock.calls[0][0]).toMatchSnapshot()
  })
})
