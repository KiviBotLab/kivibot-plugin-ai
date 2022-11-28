import { customAlphabet } from 'nanoid'
import axios from 'axios'

const nanoid = customAlphabet('0123456789abcdef', 4)

export async function fetchReply(text: string) {
  const api = 'https://ai-voice.api.xiaomi.net/aivs/v2.2/text'

  const params = {
    requestId: '',
    token: '',
    userId: `${nanoid(8)}-${nanoid()}-${nanoid()}-${nanoid()}-${nanoid(8)}`
  }

  const { data } = await axios.post(api, { requestText: text }, { params })

  return data?.directive ?? {}
}
