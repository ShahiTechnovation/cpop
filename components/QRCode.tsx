"use client"

import { useEffect, useRef } from "react"
import QRCodeStyling from "qr-code-styling"

interface QRCodeProps {
  data: string
  size?: number
  className?: string
}

export function QRCode({ data, size = 200, className }: QRCodeProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const qrCode = new QRCodeStyling({
      width: size,
      height: size,
      type: "svg",
      data: data,
      dotsOptions: {
        color: "#FFFFFF",
        type: "rounded",
      },
      cornersSquareOptions: {
        color: "#00f3ff",
        type: "extra-rounded",
      },
      cornersDotOptions: {
        color: "#9d00ff",
        type: "dot",
      },
      backgroundOptions: {
        color: "transparent",
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 0,
      },
    })

    ref.current.innerHTML = ""
    qrCode.append(ref.current)
  }, [data, size])

  return <div ref={ref} className={className} />
}
