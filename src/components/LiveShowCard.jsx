export default function LiveShowCard({ show }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-purple-900 bg-[#12003a]">
      {show.is_live && (
        <span className="absolute left-2 top-2 rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">
          LIVE
        </span>
      )}
      <img
        src={show.thumbnail_url || show.astrologers?.profile_image_url || '/default-astro.png'}
        alt={show.title || 'Live show'}
        className="h-36 w-full object-cover"
      />
      <div className="p-3">
        <p className="truncate text-sm font-semibold text-white">{show.astrologers?.name || 'Astrologer'}</p>
        <p className="truncate text-xs text-gray-400">{show.topic || show.title}</p>
        <button className="mt-2 w-full rounded-full bg-pink-600 py-1.5 text-xs font-bold text-white hover:bg-pink-500">
          WATCH NOW
        </button>
      </div>
    </div>
  );
}
