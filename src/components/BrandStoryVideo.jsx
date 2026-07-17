const VIDEO_SRC = 'https://alainwater.com/cdn/shop/videos/c/vp/25e807e0d9e4466688bd64287a6b8827/25e807e0d9e4466688bd64287a6b8827.HD-1080p-7.2Mbps-26702428.mp4?v=0'
const VIDEO_POSTER = 'https://alainwater.com/cdn/shop/files/preview_images/25e807e0d9e4466688bd64287a6b8827.thumbnail.0000000000_1280x.jpg?v=1712150337'

export default function BrandStoryVideo() {
  return (
    <section className="bg-white pb-10 pt-0 md:pb-14">
      <div className="mx-auto w-full max-w-[1280px] px-0 sm:px-4 md:px-6 lg:px-8">
        <div className="video-section--container video-aspect--16-9 overflow-hidden bg-black shadow-[0_18px_60px_rgba(15,23,42,0.14)]">
          <video
            className="block h-full w-full object-cover"
            playsInline
            autoPlay
            loop
            muted
            preload="metadata"
            poster={VIDEO_POSTER}
            aria-label="Al Ain Water brand video"
          >
            <source src={VIDEO_SRC} type="video/mp4" />
            <img src={VIDEO_POSTER} alt="Al Ain Water brand video poster" />
          </video>
        </div>
      </div>
    </section>
  )
}