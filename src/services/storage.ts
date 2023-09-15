import { NFTStorage } from 'nft.storage'

import { transcriptionSchema } from '~/libs/zod'

if (!process.env.NEXT_PUBLIC_NFT_STORAGE) {
  throw new Error('env.NEXT_PUBLIC_NFT_STORAGE')
}

export const storage = new NFTStorage({
  token: process.env.NEXT_PUBLIC_NFT_STORAGE
})

export const getAudio = async (cid: string) => {
  return await fetch(`https://nftstorage.link/ipfs/${cid}/audio.mp3`)
}

export const getTranscription = async (cid: string) => {
  const res = await fetch(
    `https://nftstorage.link/ipfs/${cid}/transcription.json`
  )

  return transcriptionSchema.parse(await res.json())
}
