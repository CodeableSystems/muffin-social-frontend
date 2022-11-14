import { Wallet } from "./Wallet"
import { IStats } from "./pages/Dashboard"
import { sdriveStats } from "./shadowHelper"
import React, { useEffect, useState } from "react"
import { Toaster } from "react-hot-toast"
import { Link } from "react-router-dom"

const Layout: React.FC = ({ children }) => {
  return (
    <div className="h-screen/header grid grid-rows-[1fr,0]">
      <div className="w-full md:mx-auto grow">{children}</div>
    </div>
  )
}

export default Layout
