import App from "./App"
import ProfileButton from "./components/ProfileButton"
import "./tailwind.css"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { GlowWalletAdapter } from "@solana/wallet-adapter-glow"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider, WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare"
import { clusterApiUrl } from "@solana/web3.js"
import React, { FC, useMemo } from "react"
import ReactDOM from "react-dom"
import { Helmet, HelmetProvider } from "react-helmet-async"
import { BrowserRouter } from "react-router-dom"
import { Link } from "react-router-dom"

// Default styles that can be overridden by your app
//require('@solana/wallet-adapter-react-ui/styles.css');

const Wallet: FC = ({ children }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Mainnet

  const endpoint = useMemo(() => "https://api.devnet.solana.com", [network])

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
    <ConnectionProvider config={{ commitment: "finalized" }} endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="flex justify-between w-full dark:bg-black ">
            <div className="w-full">
              <div className="flex gap-2 px-2 pt-1 absolute right-0 z-20">
                <WalletMultiButton />
                <span className="hidden md:block">
                  <ProfileButton />
                </span>
              </div>
              <>{children}</>
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Wallet>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </Wallet>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
)
