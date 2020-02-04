const core = require('@actions/core')
const nock = require('nock')
const postToSmee = require('../post-to-smee')

jest.mock('@actions/core')

describe('smee-action', () => {
  let data

  beforeEach(() => {
    nock('https://smee.io')
      .post(/.*/).reply(200, (match, body) => {
        data = { match, body }
      })
  })

  it('makes a POST request to smee.io using the repository\'s owner-name', async () => {
    await postToSmee()
    expect(data.match).toBe('/JasonEtco-in-a-coffee-shop')
    expect(data.body).toMatchSnapshot()
  })

  it('makes a POST request to smee.io using the `channel` input', async () => {
    jest.spyOn(core, 'getInput').mockReturnValueOnce('pizzadog')
    await postToSmee()
    expect(data.match).toBe('/pizzadog')
    expect(data.body).toMatchSnapshot()
  })

  it('throws if the POST fails', async () => {
    nock.cleanAll()
    nock('https://smee.io').post(/.*/).replyWithError(500)
    await expect(postToSmee()).rejects.toThrowErrorMatchingSnapshot()
  })
})
