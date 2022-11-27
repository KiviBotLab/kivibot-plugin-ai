import test from 'ava'
import { fetchReply } from './index.js'

test('fetchReply', async t => {
  const { url, displayText } = await fetchReply('你好')

  console.log(displayText)

  t.true(url !== '' && displayText !== '')
})
