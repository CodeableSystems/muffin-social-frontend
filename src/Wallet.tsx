import ProfileButton from "./components/ProfileButton"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { GlowWalletAdapter } from "@solana/wallet-adapter-glow"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider, WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare"
import { clusterApiUrl } from "@solana/web3.js"
import React, { FC, useMemo } from "react"
import { Link } from "react-router-dom"

// Default styles that can be overridden by your app
//require('@solana/wallet-adapter-react-ui/styles.css');

export const Wallet: FC = ({ children }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Mainnet

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network])

  const wallets = useMemo(
    () => [
      /**
       * Select the wallets you wish to support, by instantiating wallet adapters here.
       *
       * Common adapters can be found in the npm package `@solana/wallet-adapter-wallets`.
       * That package supports tree shaking and lazy loading -- only the wallets you import
       * will be compiled into your application, and only the dependencies of wallets that
       * your users connect to will be loaded.
       */
      new SolflareWalletAdapter(),
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
    ],
    []
  )

  return (
    <ConnectionProvider endpoint={"https://ssc-dao.genesysgo.net"}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="flex justify-between w-full mt-2 bg-tahiti-200">
            <Link to="/">
              <h1 id="logo" className="text-4xl cursor-pointer">
                SDRIVE
              </h1>
              <img src="/logo.png" className="hidden w-[150px]" />
            </Link>
            <div className="flex gap-2">
              <WalletMultiButton />
              <ProfileButton />
            </div>
          </div>
          <div>{children}</div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
