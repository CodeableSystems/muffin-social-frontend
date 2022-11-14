import { getAnchorEnvironment, getTokenAccounts } from "../../components/core"
import { ProfileIcon, UploadIcon } from "../../components/icons"
import idl from "../../idls/identity.json"
import { getPostsByAuthor, getPfp } from "../../postsHelper"
import { performReverseLookup } from "@bonfida/spl-name-service"
import * as anchor from "@project-serum/anchor"
import { AnchorWallet, useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Connection, PublicKey } from "@solana/web3.js"
import React, { useCallback, useEffect, useState } from "react"

const selectFile = (contentType: string, multiple: boolean): Promise<File[]> => {
  return new Promise((resolve) => {
    let input = document.createElement("input")
    input.type = "file"
    input.multiple = multiple
    input.accept = contentType

    input.onchange = (_) => {
      let files = Array.from(input.files!)
      resolve(files)
    }

    input.click()
  })
}

type Profile = any;
type Post = any;

export default function YourProfile() {
  const { connection } = useConnection()
  const wallet = useWallet()
  const { sendTransaction } = wallet
  const anchorWallet = useAnchorWallet()
  const [client, setClient] = useState<any>()
  const [provider, setProvider] = useState<any>()
  const [username, setUsername] = useState<string>("")
  const [hasUsername, setHasUsername] = useState<boolean>(false)
  const [checked, setChecked] = useState<boolean>(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [pfps, setPfps] = useState([])
  const [tokens, setTokens] = useState<any[]>([])
  const [file, setFile] = useState<File>()
  const [profile, setProfile] = useState<Profile>()

  useEffect(() => {
    if (!wallet) return
    ;(async () => {
      if (anchorWallet) {
        const programId = new anchor.web3.PublicKey(idl["metadata"]["address"])
        const [programClient, provider] = getAnchorEnvironment(anchorWallet, connection, programId)
        setClient(programClient)
        setProvider(provider)

        //@ts-ignore
        let result = await programClient.account.username.all([
          {
            memcmp: {
              offset: 40, // Discriminator.
              bytes: anchorWallet.publicKey.toBase58(),
            },
          },
        ])
        if (result.length) {
          setHasUsername(true)
          setUsername(result[0].account.name)
        }
        setChecked(true)
        const posts = await getPostsByAuthor(anchorWallet.publicKey.toBase58())
        if (posts.status == 200) setPosts(posts.result)
        const tokens = await getTokenAccounts(anchorWallet.publicKey.toBase58(), connection)
        setTokens(tokens)
      }
    })()
  }, [anchorWallet])

  useEffect(() => {
    let mypfps: any = []
    const fetchData = async () => {
      let nfts = await getPfp(tokens)
      //@ts-ignore
      setPfps(nfts)
    }
    fetchData().catch(console.error)
  }, [tokens])

  if (!wallet.connected) {
    return <div>Connect your wallet to continue</div>
  }

  return (
    <div className="">
      <div className="grid grid-cols-[100px,1fr]">
        <div>
          {profile?.image && <img src={profile?.image} />}
          {!profile?.image && <ProfileIcon />}
        </div>
        <div>
          {checked && hasUsername && (
            <h2>
              <span className="font-bold">{username}</span>
            </h2>
          )}
          {checked && hasUsername && <span className="font-bold">{posts.length} posts</span>}
        </div>
      </div>

      <div className="table">
        <div className="table-row-group">
          {posts &&
            posts.map((post) => (
              <div key={post.hash} className="table-row">
                <div className="table-cell">
                  <div className=" my-2 border px-2 py-2">{post.content}</div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="font-bold my-2">Choose a Solana NFT for your PFP</div>

      <div className="flex flex-row flex-wrap gap-4">
        {pfps.map(({ token, image, name }) => {
          if (!image) return
          return (
            <div key={token}>
              <img className="hex cover w-16 h-16" src={image} alt={name} title={name} />
            </div>
          )
        })}
      </div>

      <div className="font-bold my-2">Or upload your own profile picture</div>

      {!file && (
        <label
          htmlFor="files"
          className={`mx-auto w-full file-upload`}
          tabIndex={0}
          onClick={async (e) => {
            e.preventDefault()
            const f: File[] = await selectFile("*", false)
            console.log(f[0])
            setFile(f[0])
            //if (files && setFiles) setFiles([...files, ...f])
          }}
        >
          <input type="file" hidden name="files" />
          <i className="pointer-events-none">
            <UploadIcon />
          </i>
          <span className="mt-2 text-base leading-normal pointer-events-none">Select File</span>
        </label>
      )}
      <div>{file && <img className="rounded-[50%] w-20" src={URL.createObjectURL(file)} />}</div>
    </div>
  )
}
