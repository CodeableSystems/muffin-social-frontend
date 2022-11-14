import Layout from "../../Layout"
import { getAnchorEnvironment } from "../../components/core"
import { FavoritesIcon, HomeIcon, ProfileIcon, SubscribeIcon } from "../../components/icons"
import idl from "../../idls/identity.json"
import * as anchor from "@project-serum/anchor"
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react"
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const LayoutHome: React.FC = ({ children }) => {
  const { connection } = useConnection()
  const wallet = useWallet()
  const { sendTransaction } = wallet
  const anchorWallet = useAnchorWallet()
  const [client, setClient] = useState<any>()
  const [provider, setProvider] = useState<any>()
  const [username, setUsername] = useState<string>("")
  const [hasUsername, setHasUsername] = useState<boolean>(false)
  const [checked, setChecked] = useState<boolean>(false)

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
          console.log(result[0])
          console.log(result[0].account.author.toBase58())
          setHasUsername(true)
          setUsername(result[0].account.name)
        }
        setChecked(true)
      }
    })()
  }, [anchorWallet])

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-[14rem,auto] max-w-screen mb-12 md:container md:container-auto">
        <section className="gap-10 text-xs">
          <div
            className="bg-white dark:bg-black
                            md:bg-none z-10 border bottom-0 
                            fixed flex  
                            w-full h-12 justify-around
                            border-r border-gray-200 dark:border-gray-800
                            border-t-0 
                            items-center md:items-start
                            md:px-4 
                            md:w-[14rem] md:pt-8 md:top-0 md:h-auto md:flex-col md:justify-start"
          >
            <div
              title="Buzz - decentralized chat on debuzz.io"
              role="link"
              aria-label="home button"
              className="hover:text-blue-800 active:text-red-800"
            >
              <Link to={"/"} className="flex flex-row gap-4">
                <HomeIcon width={24} height={24} />
                <span className="text-lg hidden md:block">Home</span>
              </Link>
            </div>
            <div title="Subscriptions" className="hover:text-blue-800 active:text-red-800 md:mt-6">
              <Link to={"/"} className="flex flex-row gap-4">
                <SubscribeIcon width={24} height={24} />
                <span className="text-lg hidden md:block">Bookmarks</span>
              </Link>
            </div>
            <div title="Favorites" className="hover:text-blue-800 active:text-red-800 md:mt-6">
              <Link to={"/"} className="flex flex-row gap-4">
                <FavoritesIcon width={24} height={24} />
                <span className="text-lg hidden md:block">Favorites</span>
              </Link>
            </div>
            <div title="Profile" className="md:bottom-10 md:absolute hover:text-blue-900 active:text-red-800 md:mt-6">
              {hasUsername && (
                <Link to={"/profile/home"} className="flex flex-row gap-4">
                  <ProfileIcon width={24} height={24} className="mt-1" />
                  <span className="text-lg hidden md:block"> @{username}</span>
                </Link>
              )}
              {!hasUsername && checked && (
                <Link to={"/profile/home"} className="flex flex-row gap-4">
                  <ProfileIcon width={24} height={24} className="mt-1" />
                  <span className="text-lg hidden md:block"> Create a profile</span>
                </Link>
              )}
            </div>
          </div>
        </section>

        <section className="">{children}</section>
      </div>
    </Layout>
  )
}
export default LayoutHome
