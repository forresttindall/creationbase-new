import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight } from '@phosphor-icons/react';
import { blogPosts } from '../blog/posts';

const BLACK = '#000000';
const GRAY1 = '#676767';
const GRAY2 = '#353535';
const WHITE = '#FFFFFF';

const Blog = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const route = useMemo(() => {
    const pathname = location.pathname || '/blog';
    const isList = pathname === '/blog' || pathname === '/blog/';
    const slug = !isList && pathname.startsWith('/blog/') ? decodeURIComponent(pathname.slice('/blog/'.length)) : null;
    return { isList, slug };
  }, [location.pathname]);

  const post = useMemo(() => {
    if (!route.slug) return null;
    return blogPosts.find((p) => p.slug === route.slug) || null;
  }, [route.slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ background: WHITE, color: BLACK, minHeight: '100vh' }}
    >
      <section style={{ padding: 'var(--spacing-xxl) var(--spacing-md) var(--spacing-xl)', borderBottom: '1px solid #000' }}>
        <div className="container" style={{ maxWidth: 1200 }}>
          <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--spacing-md)' }}>
            <h1 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0 }}>BLOG</h1>
            <div className="small-text" style={{ color: GRAY1 }}>INDEX (06.2)</div>
          </div>
          <div style={{ height: 1, background: '#000', marginTop: 'var(--spacing-sm)' }} />
          <div className="small-text" style={{ marginTop: 'var(--spacing-md)', maxWidth: 680, opacity: 0.85 }}>
            Writing, ideas, notes. Short essays and working thoughts.
          </div>
        </div>
      </section>

      <section style={{ padding: 'var(--spacing-xl) var(--spacing-md) var(--spacing-xxl)' }}>
        <div className="container" style={{ maxWidth: 1200 }}>
          {route.isList ? (
            <div style={{ display: 'grid', gap: 0, borderTop: `1px solid ${BLACK}` }}>
              {blogPosts.map((p, idx) => (
                <motion.button
                  key={p.slug}
                  onClick={() => navigate(`/blog/${p.slug}`)}
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.04)' }}
                  whileTap={{ backgroundColor: 'rgba(0,0,0,0.06)' }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: 'var(--spacing-md) var(--spacing-sm)',
                    borderBottom: `1px solid ${BLACK}`,
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(52px, 72px) minmax(0, 1fr) auto', gap: 'var(--spacing-md)', alignItems: 'baseline' }}>
                    <div className="small-text" style={{ color: GRAY1, whiteSpace: 'nowrap' }}>
                      {idx < 9 ? `0${idx + 1}` : idx + 1}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 0.95, fontSize: 'clamp(18px, 4vw, 28px)' }}>
                        {p.title}
                      </div>
                      <div className="small-text" style={{ marginTop: 8, color: GRAY1, maxWidth: 760 }}>
                        {Array.isArray(p.body) && p.body[0] ? `${p.body[0].slice(0, 140)}${p.body[0].length > 140 ? '…' : ''}` : ''}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--spacing-md)', justifySelf: 'end' }}>
                      <div className="small-text" style={{ color: GRAY1, whiteSpace: 'nowrap' }}>{p.date}</div>
                      <div className="small-text" style={{ color: BLACK, whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        [READ]
                        <ArrowUpRight size={16} weight="thin" aria-hidden="true" focusable="false" />
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          ) : post ? (
            <div style={{ maxWidth: 860 }}>
              <button
                onClick={() => navigate('/blog')}
                className="small-text"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: GRAY1 }}
              >
                [BACK]
              </button>

              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 6vw, 56px)', lineHeight: 0.92, letterSpacing: '-0.04em', textTransform: 'uppercase', margin: 'var(--spacing-md) 0 var(--spacing-sm)' }}>
                {post.title}
              </h2>
              <div className="small-text" style={{ color: GRAY1, marginBottom: 'var(--spacing-lg)' }}>BLOG ENTRY / {post.date}</div>

              <div style={{ borderTop: `1px solid ${GRAY2}`, paddingTop: 'var(--spacing-lg)' }}>
                {post.body.map((paragraph, idx) => (
                  <p key={idx} style={{ fontFamily: 'var(--font-mono)', fontSize: 14, lineHeight: 1.9, margin: '0 0 var(--spacing-md)' }}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ maxWidth: 860 }}>
              <button
                onClick={() => navigate('/blog')}
                className="small-text"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: GRAY1 }}
              >
                [BACK]
              </button>
              <div style={{ marginTop: 'var(--spacing-md)', borderTop: `1px solid ${BLACK}`, paddingTop: 'var(--spacing-md)' }}>
                <div style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '-0.04em', fontSize: 'clamp(18px, 4vw, 28px)' }}>
                  Not Found
                </div>
                <div className="small-text" style={{ marginTop: 8, color: GRAY1 }}>
                  That entry doesn’t exist yet.
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
};

export default Blog;
