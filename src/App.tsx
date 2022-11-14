import Home from "./pages/layout/Home"
import LayoutMain from "./pages/layout/LayoutMain"
import ProfileHome from "./pages/layout/LayoutProfile"
import YourProfile from "./pages/profile/YourProfile"
import React from "react"
import { Helmet } from "react-helmet-async"
import { Navigate, Route, Routes } from "react-router-dom"

export interface IIFile {
  account: string
  file: string
  ext?: string
  size?: string
  modified?: string
}

const App: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Buzz - decentralized chat on debuzz.io</title>
        <meta name="description" content="decentralized Buzz" />
        <meta name="theme-color" content="#E6E6FA" />
      </Helmet>
      <Routes>
        <Route
          path="/profile/*"
          element={
            <LayoutMain>
              <ProfileHome>
                <div>empty route</div>
              </ProfileHome>
            </LayoutMain>
          }
        />
        <Route
          path="/profile/home"
          element={
            <LayoutMain>
              <ProfileHome>
                <YourProfile />
              </ProfileHome>
            </LayoutMain>
          }
        />
        <Route
          path="/"
          element={
            <LayoutMain>
              <Home />
            </LayoutMain>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />/
      </Routes>
    </>
  )
}

export default App
