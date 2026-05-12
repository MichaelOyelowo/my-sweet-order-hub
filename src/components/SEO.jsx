import { Helmet } from 'react-helmet-async'

const BASE_URL = 'https://sweethubs.netlify.app'
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`

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
  url,
  type = 'website',
  schema,
}) {
  const seo = {
    title:       title       ? `${title} | Jovlora` : DEFAULTS.title,
    description: description ?? DEFAULTS.description,
    image:       image       ?? DEFAULTS.image,
    url:         url         ? `${BASE_URL}${url}` : DEFAULTS.url,
  }

  return (
    <Helmet>
      {/* Primary */}
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <link rel="canonical"   href={seo.url} />

      {/* Open Graph */}
      <meta property="og:title"       content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image"       content={seo.image} />
      <meta property="og:url"         content={seo.url} />
      <meta property="og:type"        content={type} />

      {/* Twitter */}
      <meta name="twitter:title"       content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image"       content={seo.image} />

      {/* Page-specific structured data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  )
}