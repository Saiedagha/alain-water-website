import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { NEWS_POSTS, UI } from '../data/alainContent'

export default function NewsSection() {
  const { lang } = useLanguage()
  const ui = UI[lang] || UI.en

  return (
    <section className="py-14 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h3 className="text-3xl font-black text-slate-900">{ui.news}</h3>
            <p className="text-slate-500 mt-1">{ui.newsSub}</p>
          </div>
          <Link to="/news" className="text-alain-blue font-semibold text-sm hover:underline">
            {ui.viewAll}
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {NEWS_POSTS.map((post) => (
            <article key={post.id} className="group">
              <Link to={post.href} className="block overflow-hidden bg-slate-100">
                <img
                  src={post.image}
                  alt={post.title.en}
                  className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </Link>
              {post.date && (
                <p className="mt-3 text-xs font-medium text-slate-400">{post.date}</p>
              )}
              <h5 className="mt-2 text-lg font-bold leading-snug text-slate-900 line-clamp-2">
                <Link to={post.href} className="hover:text-alain-blue">
                  {post.title[lang] || post.title.en}
                </Link>
              </h5>
              <p className="mt-2 text-sm text-slate-500 leading-6 line-clamp-3">
                {post.excerpt[lang] || post.excerpt.en}
              </p>
              <Link
                to={post.href}
                className="inline-block mt-3 text-sm font-semibold text-alain-blue hover:underline"
              >
                {ui.readMore}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
