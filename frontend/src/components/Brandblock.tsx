type BrandBlockProps = {
  variant?: 'light' | 'dark'
}

export default function BrandBlock({ variant = 'light' }: BrandBlockProps) {
  return (
    <div className={`brand-block brand-block--${variant}`}>
      <img src="/favicon.svg" alt="" className="brand-block__mark" />
      <span className="brand-block__name">GéoEmploi</span>
    </div>
  )
}