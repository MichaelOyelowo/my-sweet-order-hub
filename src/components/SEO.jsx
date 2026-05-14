import { Helmet } from 'react-helmet-async'

const BASE_URL = 'https://sweethubs.netlify.app'
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`

const DEFAULTS = {
  title:       'Jovlora — Fresh Snacks & Baked Goods Delivered in Ile-Ife',
  description: 'Order fresh puff puff, chin-chin, cakes, meat pie and more. Handcrafted daily and delivered to your door in under 30 minutes. Ile-Ife, Osun State, Nigeria.',
  image:       DEFAULT_IMAGE,
  url:         BASE_URL,
}

export default function SEO({
  title,
  description,
  image,
  url, // Expected as "/about" or "/games" etc.
  type = 'website',
  schema,
}) {
  const seo = {
    // If title is provided, it adds " | Jovlora". If not, it uses the master default.
    title:       title ? `${title} | Jovlora` : DEFAULTS.title,
    description: description || DEFAULTS.description,
    image:       image || DEFAULTS.image,
    // Ensures no double slashes and points to the correct page
    url:         url ? `${BASE_URL}${url.startsWith('/') ? url : `/${url}`}` : DEFAULTS.url,
  }

  return (
    <Helmet prioritizeSeoTags>
      {/* ── Standard Tags ── */}
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <link rel="canonical" href={seo.url} />

      {/* ── Open Graph (WhatsApp, Facebook) ── */}
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Jovlora" />

      {/* ── Twitter ── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />

      {/* ── Structured Data (Schema) ── */}
      {/* 
          JSON.stringify works for both a single object {} 
          and an array of objects [{}, {}]. 
          This handles your dual LocalBusiness + Breadcrumb schema on Home.
      */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  )
}