import React from "react"
import { Link, NavLink, useLocation } from "react-router-dom"

export default function ProfileHome({ children }: { children: any }) {
  return (
    <div className="ml-4 lg:ml-0 lg:container lg:container-auto my-6">
      <nav className="hidden">
        <ul className="flex flex-wrap flex-row gap-6 border-b">
          <li>
            <NavLink to="/profile/home" className={({ isActive }) => (isActive ? "underline" : undefined)}>
              Your profile
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile/posts" className={({ isActive }) => (isActive ? "underline" : undefined)}>
              Your posts
            </NavLink>
          </li>
          <li className="hidden">
            <NavLink to="/profile/drives" className={({ isActive }) => (isActive ? "underline" : undefined)}>
              Your drives
            </NavLink>
          </li>
          <li className="hidden">
            <NavLink to="/profile/yourwebsites" className={({ isActive }) => (isActive ? "underline" : undefined)}>
              Your websites
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="mt-4">{children}</div>
    </div>
  )
}
