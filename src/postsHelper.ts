import { ShadowDriveVersion } from "@shadow-drive/sdk"
import { Keypair, PublicKey } from "@solana/web3.js"
import axios, { Axios, AxiosResponseHeaders } from "axios"
import bs58 from "bs58"
import sha256 from "crypto-js/sha256"
import nacl from "tweetnacl"

export const Config = {
  SHADOW_ACCOUNT: "29BkoRGwzTuLcHv5Vfs1nVexSPsbc2nJ7oceCK5J3NY6",
  BACKEND: "https://api.debuzz.io",
}
interface IResult {
  err?: string
  result: any
  status: number
}

export async function getPostsByAuthor(account: string): Promise<IResult> {
  try {
    const resp = await axios.post(`${Config.BACKEND}/get-posts-by-author`, {
      pubKey: account,
    })

    if (resp.status === 200) {
      return await resp.data
    } else {
      return { status: 500, result: [] }
    }
  } catch (e: any) {
    return { status: 500, result: [] }
  }
}

export async function getPfp(addresses: string[]): Promise<IResult> {
  try {
    const resp = await axios.post(`${Config.BACKEND}/get-pfp`, {
      addresses: addresses,
    })

    if (resp.status === 200) {
      return await resp.data
    } else {
      return { status: 500, result: [] }
    }
  } catch (e: any) {
    return { status: 500, result: [] }
  }
}
