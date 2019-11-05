jest.mock('@actions/core')

const core = require('@actions/core')
const nock = require('nock')
const run = require('../entrypoint')

describe('smee-action', () => {
  let data

  beforeEach(() => {
    nock('https://api.github.com')
      .get(/\/repos\/.*\/.*/).reply(200, {
        id: 123
      })

    nock('https://smee.io')
      .post(/.*/).reply(200, (match, body) => {
        data = { match, body }
      })
  })

  it('makes a POST request to smee.io using the repository\'s id', async () => {
    await run()

    expect(data.match).toBe('/123')
    expect(data.body).toMatchSnapshot()
  })

  it('makes a POST request to smee.io using smeeChannel input', async () => {
    core.getInput = jest
      .fn()
      .mockReturnValueOnce('pizzadog')

    await run()

    expect(data.match).toBe('/pizzadog')
    expect(data.body).toMatchSnapshot()
  })

  it('exits with a failure if the POST fails', async () => {
    nock.cleanAll()
    nock('https://smee.io').post(/.*/).replyWithError(500)
    nock('https://api.github.com')
      .get(/\/repos\/.*\/.*/).reply(200, { id: 123 })

    await run()

    expect(core.setFailed).toHaveBeenCalled()
    expect(core.setFailed.mock.calls[0][0]).toMatchSnapshot()
  })
})
