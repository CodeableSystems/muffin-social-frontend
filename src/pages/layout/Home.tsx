import { buttonStyle } from "../../components/styles"
import { getContent, IContent, storeContent, verifySig } from "../../shadowHelper"
import { ShdwDrive, StorageAccountInfo } from "@shadow-drive/sdk"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import md5 from "md5-hash"
import React, { useCallback, useEffect, useState } from "react"
import { useShadowDrive } from "react-shadow-drive"
import { SyncLoader } from "react-spinners"

export default function Home() {
  const { connection } = useConnection()
  const { ready, refreshStorageAccounts, getStorageAccountFiles } = useShadowDrive()
  const wallet = useWallet()
  const { publicKey, signMessage, connected } = wallet
  const [sigFormat, setSigFormat] = useState("byteArray")

  const [drivesLoading, setDriveLoading] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [signedIn, setIsSignedIn] = useState<boolean>(false)
  const [selectedAccountKey, setSelectedAccountKey] = useState<PublicKey>()
  const [storageAccounts, setStorageAccounts] = useState<StorageAccountInfo[] | []>([])
  const [selectedStorageAccount, setSelectedStorageAccount] = useState<StorageAccountInfo>()
  const [drive, setDrive] = useState<ShdwDrive>()
  const [isSigning, setIsSigning] = useState(false)
  const [message, setMessage] = useState("signed message")
  const [signature, setSignature] = useState<number[]>([])
  const [shownSignature, setShownSignature] = useState("")
  const [error, setError] = useState("")
  const [content, setContent] = useState("")
  const [tweets, setTweets] = useState<IContent[]>([])

  const postContent = useCallback(
    async (event) => {
      event.preventDefault()
      if (!publicKey) return
      setLoading(true)
      let result = await verifySig(publicKey.toBase58(), "signed message", JSON.stringify(signature))
      if (result) {
        let hash = md5(content)
        await storeContent(publicKey.toBase58(), "signed message", JSON.stringify(signature), content, hash)
        await refreshFeed()
      }
    },
    [publicKey, signature, content]
  )
  const refreshFeed = async () => {
    setLoading(true)
    console.log("getting content")
    let tweetsResult = await getContent()
    setTweets(tweetsResult.reverse())
    setLoading(false)
  }
  const refreshAccounts = async () => {
    if (!publicKey) return
    if (!drive) return
  }

  useEffect(() => {
    ;(async () => {
      await refreshFeed()
    })()
  }, [])
  const clearError = () => setError("")

  const signMessageHandler = async () => {
    if (!message) return
    try {
      const encodedMessage = new TextEncoder().encode(message)
      setIsSigning(true)
      const sigArr = await signMessage!(encodedMessage)
      const sig = Buffer.from(sigArr).toJSON().data
      if (sig) {
        setSignature(sig)
        clearError()
        setIsSignedIn(true)
      }
    } catch (err: any) {
      setError(err?.message)
    } finally {
      setIsSigning(false)
    }
  }
  return (
    <div className="md:px-0 relative lg:max-w-lg border-gray-200 dark:border-gray-800 border-r">
      {signedIn && (
        <SyncLoader className="absolute top-6 left-2 z-10 h-16" color={"green"} loading={loading} size={10} />
      )}
      <section className="flex flex-col gap-4 align-center w-full h-full pl-4 border-b border-gray-200 dark:border-gray-800">
        {!connected && <div className="pt-10">Connect your wallet to post</div>}
        {connected && !signedIn && (
          <div className={`absolute right-1 lg:right-0 top-12 lg:top-1 z-10 ${signedIn ? "h-0" : "h-[50px]"}`}>
            <input
              type="button"
              className={`${buttonStyle} ${
                isSigning ? "border-none bg-white hover:bg-white hover:text-normal no-underline" : ""
              }`}
              disabled={!message || isSigning}
              onClick={signMessageHandler}
              value={isSigning ? "Signing in" : "Sign in"}
            />{" "}
          </div>
        )}
        <form className="">
          <div className="mt-1 ml-2 font-bold">Home</div>
          <div className={`w-3/3 lg:max-w-lg relative pt-1 ${signedIn ? "h-0" : "h-[110px]"}`}>
            <textarea
              disabled={!signedIn}
              value={content}
              placeholder="What's up?"
              onChange={(e) => setContent(e.target.value)}
              className={`w-full h-[100px]
               px-2 rounded resize-none bg-white disabled:bg-white 
               disabled:text-black px-2 py-2
               dark:bg-black dark:disabled:bg-black pl-2 text-lg dark:text-white ${
                 signedIn ? "border my-2 border-gray-100" : ""
               }`}
            ></textarea>
            {signedIn && (
              <div className="float-right pr-1">
                <button
                  className={`${buttonStyle} rounded-3xl mb-2`}
                  onClick={async (e) => {
                    await postContent(e)
                    setContent("")
                  }}
                >
                  Post
                </button>
              </div>
            )}
          </div>
        </form>
      </section>

      <div className="sticky top-0 h-full">
        {tweets &&
          tweets?.map((tweet) => {
            return (
              <div className="border-b border-gray-200 dark:border-gray-800 mt-2 px-4 py-1" key={tweet.hash}>
                <div className="grid grid-cols-[50px,1fr] py-2">
                  <div className="bg-black-500 rounded-[50%]">
                    <img src="/face.png" className="w-[40px]" />
                  </div>
                  <div>
                    <p>
                      <span className="font-normal text-sm dark:text-white">@username</span>
                      <span className="font-normal text-sm dark:text-white-400 pl-2">
                        {tweet?.pubKey.slice(0, 4)}..
                        {tweet?.pubKey.slice(tweet?.pubKey.length - 4, tweet?.pubKey.length)}
                      </span>
                    </p>
                    <div className="font-normal text-lg dark:text-white">{tweet?.content}</div>
                  </div>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
