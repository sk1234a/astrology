const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const STORAGE_BUCKET = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'images';

const headers = (extra = {}) => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
  }

  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    ...extra,
  };
};

const tableUrl = (table, query = '') => {
  const suffix = query ? `?${query}` : '';
  return `${SUPABASE_URL}/rest/v1/${table}${suffix}`;
};

const storagePublicUrl = (path) =>
  `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${path}`;

const request = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: headers(options.headers || {}),
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || data?.hint || data?.details || 'Supabase request failed');
  }

  return { data };
};

const toBoolean = (value) => value === true || value === 'true' || value === 'on';
const toNumber = (value, fallback = 0) => (value === '' || value == null ? fallback : Number(value));
const splitCsv = (value) =>
  Array.isArray(value)
    ? value
    : String(value || '')
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);

const formDataToObject = (body) => {
  if (!(body instanceof FormData)) return { data: body || {}, file: null };

  const data = {};
  let file = null;

  body.forEach((value, key) => {
    if (value instanceof File) {
      file = value.size ? value : null;
    } else {
      data[key] = value;
    }
  });

  return { data, file };
};

const uploadImage = async (file, folder) => {
  if (!file) return '';

  const extension = file.name.split('.').pop() || 'jpg';
  const safeName = `${folder}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

  await request(`${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${safeName}`, {
    method: 'POST',
    headers: headers({
      'Content-Type': file.type || 'application/octet-stream',
      'x-upsert': 'true',
    }),
    body: file,
  });

  return storagePublicUrl(safeName);
};

const normalizeAstrologer = async (body) => {
  const { data, file } = formDataToObject(body);
  const imageUrl = file ? await uploadImage(file, 'astrologers') : data.profile_image_url;

  return {
    name: data.name,
    hindi_name: data.hindi_name || null,
    specialization: splitCsv(data.specialization),
    languages: splitCsv(data.languages),
    experience_years: toNumber(data.experience_years),
    rating: toNumber(data.rating),
    total_reviews: toNumber(data.total_reviews),
    price_per_min: toNumber(data.price_per_min),
    original_price_per_min: data.original_price_per_min ? toNumber(data.original_price_per_min) : null,
    phone: data.phone || null,
    profile_image_url: imageUrl || null,
    is_online: toBoolean(data.is_online),
    is_active: toBoolean(data.is_active),
    bio: data.bio || null,
    flat_deal: data.flat_deal || null,
  };
};

const normalizeBanner = async (body) => {
  const { data, file } = formDataToObject(body);
  const imageUrl = file ? await uploadImage(file, 'banners') : data.image_url;

  return {
    title: data.title || null,
    image_url: imageUrl,
    link_url: data.link_url || null,
    display_order: toNumber(data.display_order),
    is_active: data.is_active == null ? true : toBoolean(data.is_active),
    banner_type: data.banner_type || 'main',
  };
};

const normalizeLiveShow = (body) => ({
  astrologer_id: body.astrologer_id || null,
  title: body.title,
  topic: body.topic || null,
  is_live: toBoolean(body.is_live),
  scheduled_at: body.scheduled_at || null,
  stream_url: body.stream_url || null,
  thumbnail_url: body.thumbnail_url || null,
});

const normalizeService = (body) => ({
  name: body.name,
  hindi_name: body.hindi_name || null,
  icon_name: body.icon_name || null,
  description: body.description || null,
  is_active: body.is_active == null ? true : toBoolean(body.is_active),
  display_order: toNumber(body.display_order),
});

const normalizeContactQuery = (body) => ({
  name: body.name,
  phone: body.phone || null,
  email: body.email || null,
  message: body.message || null,
  status: body.status || 'pending',
});

const parsePath = (path) => {
  const [pathname, rawQuery = ''] = path.split('?');
  const parts = pathname.split('/').filter(Boolean);
  const search = new URLSearchParams(rawQuery);
  return { pathname, parts, search };
};

const api = {
  async get(path) {
    const { pathname, parts, search } = parsePath(path);

    if (pathname === '/astrologers') {
      const query = new URLSearchParams({
        select: '*',
        order: 'is_online.desc,rating.desc,total_reviews.desc',
      });
      if (search.get('active') === 'true') query.set('is_active', 'eq.true');
      return request(tableUrl('astrologers', query));
    }

    if (pathname === '/banners' || pathname === '/banners/admin/all') {
      const query = new URLSearchParams({ select: '*', order: 'display_order.asc,created_at.desc' });
      if (pathname === '/banners') query.set('is_active', 'eq.true');
      return request(tableUrl('banners', query));
    }

    if (pathname === '/live-shows') {
      const query = new URLSearchParams({
        select: '*,astrologers(*)',
        order: 'is_live.desc,scheduled_at.asc,created_at.desc',
      });
      return request(tableUrl('live_shows', query));
    }

    if (pathname === '/services' || pathname === '/services/admin/all') {
      const query = new URLSearchParams({ select: '*', order: 'display_order.asc,name.asc' });
      if (pathname === '/services') query.set('is_active', 'eq.true');
      return request(tableUrl('services', query));
    }

    if (pathname === '/contact-queries') {
      const query = new URLSearchParams({ select: '*', order: 'created_at.desc' });
      return request(tableUrl('contact_queries', query));
    }

    throw new Error(`Unknown GET endpoint: ${path}`);
  },

  async post(path, body) {
    if (path === '/auth/login') {
      const query = new URLSearchParams({ select: '*', email: `eq.${body.email}`, limit: '1' });
      const { data } = await request(tableUrl('admins', query), { headers: headers() });
      const admin = data?.[0];
      const envEmail = import.meta.env.VITE_ADMIN_EMAIL;
      const envPassword = import.meta.env.VITE_ADMIN_PASSWORD;
      const envMatch = envEmail && envPassword && body.email === envEmail && body.password === envPassword;
      const tableMatch = admin && body.password === admin.password_hash;

      if (!envMatch && !tableMatch) throw new Error('Invalid credentials');

      return {
        data: {
          token: 'supabase-frontend-admin',
          admin: admin || { email: body.email, name: 'Admin' },
        },
      };
    }

    const insert = async (table, payload) => request(tableUrl(table), {
      method: 'POST',
      headers: headers({ 'Content-Type': 'application/json', Prefer: 'return=representation' }),
      body: JSON.stringify(payload),
    });

    if (path === '/astrologers') return insert('astrologers', await normalizeAstrologer(body));
    if (path === '/banners') return insert('banners', await normalizeBanner(body));
    if (path === '/live-shows') return insert('live_shows', normalizeLiveShow(body));
    if (path === '/services') return insert('services', normalizeService(body));
    if (path === '/contact-queries') return insert('contact_queries', normalizeContactQuery(body));

    throw new Error(`Unknown POST endpoint: ${path}`);
  },

  async put(path, body) {
    return this.patch(path, body);
  },

  async patch(path, body) {
    const { parts } = parsePath(path);
    let table = parts[0]?.replace('-', '_');
    let id = parts[1];
    let payload = body;

    if (parts[0] === 'live-shows') table = 'live_shows';
    if (parts[0] === 'contact-queries') table = 'contact_queries';
    if (parts[0] === 'astrologers' && parts[2] === 'status') payload = { is_active: toBoolean(body.is_active) };
    if (parts[0] === 'astrologers' && parts.length === 2) payload = await normalizeAstrologer(body);
    if (parts[0] === 'banners' && parts.length === 2) payload = await normalizeBanner(body);
    if (parts[0] === 'live-shows' && parts.length === 2) payload = { ...body, is_live: toBoolean(body.is_live) };
    if (parts[0] === 'services' && parts.length === 2) payload = normalizeService(body);
    if (parts[0] === 'contact-queries' && parts.length === 2) payload = body;

    return request(tableUrl(table, `id=eq.${id}`), {
      method: 'PATCH',
      headers: headers({ 'Content-Type': 'application/json', Prefer: 'return=representation' }),
      body: JSON.stringify(payload),
    });
  },

  async delete(path) {
    const { parts } = parsePath(path);
    const table = parts[0] === 'live-shows'
      ? 'live_shows'
      : parts[0] === 'contact-queries'
        ? 'contact_queries'
        : parts[0];

    return request(tableUrl(table, `id=eq.${parts[1]}`), {
      method: 'DELETE',
      headers: headers({ Prefer: 'return=minimal' }),
    });
  },
};

export default api;
