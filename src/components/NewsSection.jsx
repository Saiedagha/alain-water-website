import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { NEWS_POSTS, UI } from '../data/alainContent'

export default function NewsSection() {
  const { lang } = useLanguage()
  const ui = UI[lang] || UI.en

  return (
    <section className="bg-white py-14 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-3xl font-black text-slate-900">{ui.news}</h3>
            <p className="mt-1 text-slate-500">{ui.newsSub}</p>
          </div>
          <Link to="/news" className="text-sm font-semibold text-alain-blue hover:underline">
            {ui.viewAll}
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {NEWS_POSTS.map((post) => (
            <article key={post.id} className="group rounded-[20px] bg-white p-0 shadow-sm ring-1 ring-slate-100">
              <Link to={post.href} className="block overflow-hidden rounded-t-[20px] bg-slate-100">
                <img
                  src={post.image}
                  alt={post.title.en}
                  className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </Link>
              <div className="px-4 pb-4 pt-3">
                {post.date && (
                  <p className="text-xs font-medium text-slate-400">{post.date}</p>
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
                  className="mt-3 inline-block text-sm font-semibold text-alain-blue hover:underline"
                >
                  {ui.readMore}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
