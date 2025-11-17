import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  href?: string
  className?: string
}

export default function Logo({ 
  size = 'md', 
  showText = true, 
  href = '/dashboard',
  className = ''
}: LogoProps) {
  const sizes = {
    sm: { image: 32, text: 'text-lg' },
    md: { image: 40, text: 'text-2xl' },
    lg: { image: 56, text: 'text-3xl' }
  }

  const { image, text } = sizes[size]

  const content = (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative" style={{ width: image, height: image }}>
        <Image
          src="/logo.png"
          alt="Mathly Logo"
          width={image}
          height={image}
          className="object-contain"
          priority
        />
      </div>
      {showText && (
        <span className={`${text} font-black text-green-600`}>
          Mathly
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="hover:opacity-80 transition-opacity">
        {content}
      </Link>
    )
  }

  return content
}
