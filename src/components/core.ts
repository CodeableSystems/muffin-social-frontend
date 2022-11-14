import idl from "../idls/identity.json"
import * as anchor from "@project-serum/anchor"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { AnchorWallet } from "@solana/wallet-adapter-react"
import { Connection, GetProgramAccountsFilter, PublicKey } from "@solana/web3.js"

export function getAnchorEnvironment(wallet: AnchorWallet, connection: Connection, programId: PublicKey) {
  const devconnection = new Connection("https://api.devnet.solana.com", {
    commitment: "finalized",
  })
  const provider = new anchor.AnchorProvider(devconnection, wallet, {})
  anchor.setProvider(provider)
  //@ts-ignore
  const programClient = new anchor.Program(idl, programId)
  return [programClient, provider]
}

export async function getTokenAccounts(wallet: string, solanaConnection: Connection) {
  const rpcEndpoint = "https://chaotic-green-spree.solana-mainnet.discover.quiknode.pro/"
  const connection = new Connection(rpcEndpoint)

  const filters: GetProgramAccountsFilter[] = [
    {
      dataSize: 165,
    },
    {
      memcmp: {
        offset: 32,
        bytes: wallet,
      },
    },
  ]

  const accounts = await connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, { filters: filters })
  let result = accounts
    .map((account, i) => {
      const parsedAccountInfo: any = account.account.data
      const mintAddress: string = parsedAccountInfo["parsed"]["info"]["mint"]
      const tokenBalance: number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"]
      if (tokenBalance == 1) {
        return mintAddress
      }
    })
    .filter((value) => value)
  return result
}
