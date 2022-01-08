import { assert } from 'chai'
import { fetchCBBIIndicator } from './utils'

describe('crypto-coffee-telegram-bot', () => {
  it('fetch CBBI JSON', async () => {
    const result = await fetchCBBIIndicator()
    assert.isNotNull(result)
  })
})
