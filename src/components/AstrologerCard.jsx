export default function AstrologerCard({ a }) {
  const specialization = Array.isArray(a.specialization) ? a.specialization : [];

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-purple-800 bg-[#0d0026] p-4 transition hover:shadow-md hover:shadow-purple-700">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={a.profile_image_url || '/default-astro.png'}
            alt={a.name || 'Astrologer'}
            className="h-16 w-16 rounded-full border-2 border-yellow-500 object-cover"
          />
          {a.is_online && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-black bg-green-400" />
          )}
        </div>
        <div>
          <h3 className="font-bold text-white">{a.name || 'Astrologer'}</h3>
          {a.hindi_name && <p className="text-sm text-yellow-400">{a.hindi_name}</p>}
          <p className="text-xs text-gray-400">{specialization.join(' | ')}</p>
        </div>
      </div>
      <div className="flex justify-between text-sm text-gray-300">
        <span>Rating {a.rating || 0} | {a.total_reviews || 0} reviews</span>
        <span>{a.experience_years || 0} Yrs</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="font-semibold text-yellow-400">Rs. {a.price_per_min || 0}/Min</span>
        {a.flat_deal && <span className="text-xs text-green-400">{a.flat_deal}</span>}
      </div>
      <div className="mt-2 flex gap-2">
        <a
          href={`https://wa.me/${a.phone}?text=Hi%20I%20want%20to%20chat%20with%20you`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-full bg-purple-700 py-1.5 text-sm font-medium text-white hover:bg-purple-600 text-center transition"
        >
          CHAT
        </a>
        <a
          href={`https://wa.me/${a.phone}?text=Hi%20I%20want%20to%20call%20you`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-full bg-yellow-600 py-1.5 text-sm font-medium text-white hover:bg-yellow-500 text-center transition"
        >
          CALL
        </a>
      </div>
    </div>
  );
}
