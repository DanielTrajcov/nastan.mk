import { useRouter } from 'next/navigation'
import React from 'react'

const LogoButton = () => {
    const router = useRouter();
  return (
    <>
            <p
          className="text-4xl font-semibold cursor-pointer logo"
          onClick={() => router.push("/")}
        >
          Настан<span className="text-accent font-semibold">.мк</span>
        </p>
    </>
  )
}

export default LogoButton