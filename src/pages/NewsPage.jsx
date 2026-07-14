import { Link } from 'react-router-dom'
import SeoMeta from '../components/SeoMeta'
import { useLanguage } from '../context/LanguageContext'
import { NEWS_POSTS, UI } from '../data/alainContent'

export default function NewsPage() {
  const { lang } = useLanguage()
  const ui = UI[lang] || UI.en

  return (
    <>
      <SeoMeta title={`${ui.news} – Al Ain Water`} path="/news" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <nav className="text-sm text-slate-500 mb-6">
          <Link to="/" className="hover:text-alain-blue">
            {ui.home}
          </Link>
          <span className="mx-2">/</span>
          <span>{ui.news}</span>
        </nav>
        <h1 className="text-3xl font-black mb-2">{ui.news}</h1>
        <p className="text-slate-500 mb-10">{ui.newsSub}</p>
        <div className="grid md:grid-cols-3 gap-6">
          {NEWS_POSTS.map((post) => (
            <article key={post.id} className="group">
              <div className="overflow-hidden rounded-xl bg-slate-100">
                <img
                  src={post.image}
                  alt={post.title.en}
                  className="w-full h-48 object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <h2 className="mt-4 text-lg font-bold leading-snug">{post.title[lang] || post.title.en}</h2>
              <p className="mt-2 text-sm text-slate-500 leading-6">{post.excerpt[lang] || post.excerpt.en}</p>
            </article>
          ))}
        </div>
      </div>
    </>
  )
}
