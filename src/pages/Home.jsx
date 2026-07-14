import { useEffect, useState } from 'react'
import Hero from '../components/Hero'
import CategoryCircles from '../components/CategoryCircles'
import Bestsellers from '../components/Bestsellers'
import BrandStory from '../components/BrandStory'
import NewsSection from '../components/NewsSection'
import ConnectWithUs from '../components/ConnectWithUs'
import SeoMeta from '../components/SeoMeta'

function ScrollTopButton() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!show) return null

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-5 end-5 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow hover:text-alain-blue"
      aria-label="Back to top"
    >
      ˄
    </button>
  )
}

export default function Home() {
  return (
    <>
      <SeoMeta
        title="Al Ain Water"
        description="UAE's favorite water brand — bottled water, functional water, premium range and special offers with free home delivery."
        path="/"
      />
      <Hero />
      <CategoryCircles />
      <Bestsellers />
      <BrandStory />
      <NewsSection />
      <ConnectWithUs />
      <ScrollTopButton />
    </>
  )
}
