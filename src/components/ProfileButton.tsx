import Layout from "../Layout"
import React from "react"
import { Link } from "react-router-dom"

function ProfileButton() {
  return (
    <span className="hidden md:block">
      <div className="bg-black-500 rounded-[50%]">
        <img src="/face.png" className="w-[50px]" />
      </div>
    </span>
  )
}
export default ProfileButton
