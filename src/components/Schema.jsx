import { useMemo, useEffect } from 'react';
import { SITE_URL, SITE_NAME, SHARE_IMAGE, canonicalFor, metaForPath } from '../seo/site';

// Per-route head management (title, description, canonical, social tags) for client-side navigation.
// All JSON-LD is written into the static HTML at build time (see vite.config.js), so none is rendered here.

const setMeta = (attr, key, content) => {
  if (content == null) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const setCanonical = (href) => {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

const Schema = ({ type = 'Page', path = '/', data = {} }) => {
  const isPost = type === 'BlogPosting' && data.title;

  const head = useMemo(() => {
    if (isPost) {
      return {
        title: `${data.title} | ${SITE_NAME}`,
        description: data.description,
        canonical: `${SITE_URL}/blog/${data.slug}`,
        image: data.image || SHARE_IMAGE,
        ogType: 'article',
      };
    }
    const meta = metaForPath(path);
    return {
      title: meta.title,
      description: meta.description,
      canonical: canonicalFor(path),
      image: SHARE_IMAGE,
      ogType: 'website',
    };
  }, [isPost, data.title, data.description, data.slug, data.image, path]);

  useEffect(() => {
    document.title = head.title;
    setCanonical(head.canonical);
    setMeta('name', 'title', head.title);
    setMeta('name', 'description', head.description);
    setMeta('property', 'og:type', head.ogType);
    setMeta('property', 'og:url', head.canonical);
    setMeta('property', 'og:title', head.title);
    setMeta('property', 'og:description', head.description);
    setMeta('property', 'og:image', head.image);
    setMeta('property', 'og:image:secure_url', head.image);
    setMeta('name', 'twitter:url', head.canonical);
    setMeta('name', 'twitter:title', head.title);
    setMeta('name', 'twitter:description', head.description);
    setMeta('name', 'twitter:image', head.image);
  }, [head]);

  // BlogPosting and business JSON-LD are written into the static HTML at build time.
  return null;
};

export default Schema;
