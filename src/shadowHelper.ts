import { ShadowDriveVersion } from "@shadow-drive/sdk"
import axios from "axios"

export const Config = {
  SHADOW_ACCOUNT: "29BkoRGwzTuLcHv5Vfs1nVexSPsbc2nJ7oceCK5J3NY6",
  SDRIVEAPI: "https://sdrive.svenanders.no",
}
interface IResult {
  err?: string
  data: any
  status: number
}
interface IIFile {
  account: string
  file: string
  ext?: string
}
export type Video = {
  account: string
  date: number
  description: string
  key: string
  title: string
  _id: string
}

export interface IStorageAccountInfo {
  identifier: string
  account_counter_seed: number
  creation_epoch: number
  creation_time: number
  current_usage: number
  delete_request_epoch: number
  immutable: Boolean
  last_fee_epoch: number
  owner1: string
  publicKey: any
  reserved_bytes: number
  storage_account: string
  to_be_deleted: Boolean
  version: ShadowDriveVersion
}

export interface IHeaders {
  "content-length"?: string
  "content-type"?: string
  "last-modified"?: string
}
export interface TransformedHeaders {
  contentType: string
  contentLength: string
  lastModified: string
  sizeText?: string
  size: number
}

export interface IFileKeys {
  keys: string[]
}
export interface IContent {
  hash: string
  pubKey: string
  content: string
  date: string
}

export async function getContent(): Promise<IContent[]> {
  try {
    const resp = await axios.post(`${Config.SDRIVEAPI}/get-content`, {})
    if (resp.status === 200) {
      return await resp.data.result
    } else {
      return []
    }
  } catch (e: any) {
    return []
  }
}
export async function storeContent(
  account: string,
  message: string,
  sig: string,
  content: string,
  hash: string
): Promise<boolean> {
  try {
    const resp = await axios.post(`${Config.SDRIVEAPI}/store-content`, {
      sig: sig,
      pubKey: account,
      message: message,
      content: content,
      hash: hash,
    })
    if (resp.status === 200) {
      return await resp.data
    } else {
      return false
    }
  } catch (e: any) {
    return false
  }
}
export async function verifySig(account: string, message: string, sig: string): Promise<boolean> {
  try {
    const resp = await axios.post(`${Config.SDRIVEAPI}/verify-sig`, {
      sig: sig,
      pubKey: account,
      message: message,
    })
    if (resp.status === 200) {
      return await resp.data
    } else {
      return false
    }
  } catch (e: any) {
    return false
  }
}
