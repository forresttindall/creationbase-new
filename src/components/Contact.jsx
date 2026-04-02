import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const BLACK = '#000000';
const GRAY1 = '#676767';
const WHITE = '#FFFFFF';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setStatus('error');
      return;
    }

    try {
      const resp = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            from_name: name,
            reply_to: email,
            message,
          },
        }),
      });

      if (!resp.ok) throw new Error('Email failed');
      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-header-theme="light"
      style={{ background: WHITE, color: BLACK, minHeight: '100vh' }}
    >
      <section style={{ padding: 'var(--spacing-xxl) var(--spacing-md) var(--spacing-xl)', borderBottom: '1px solid #000' }}>
        <div className="container" style={{ maxWidth: 1200 }}>
          <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--spacing-md)' }}>
            <h1 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0 }}>
              CONTACT
            </h1>
            <div className="small-text" style={{ color: GRAY1 }}>
              INDEX (08)
            </div>
          </div>
          <div style={{ height: 1, background: '#000', marginTop: 'var(--spacing-sm)' }} />
          <div className="small-text" style={{ marginTop: 'var(--spacing-md)', maxWidth: 680, opacity: 0.85, textTransform: 'none' }}>
            For project inquiries, collaborations, or availability. Typical response within 1–2 business days.
          </div>
        </div>
      </section>

      <section style={{ padding: 'var(--spacing-xl) var(--spacing-md) var(--spacing-xxl)' }}>
        <div className="container" style={{ maxWidth: 1200 }}>
          <div className="contact-grid">
            <div>
              <div className="small-text" style={{ color: GRAY1, letterSpacing: 2 }}>
                CONTACT
              </div>
              <div style={{ marginTop: 'var(--spacing-md)' }}>
                <div className="small-text" style={{ textTransform: 'none' }}>
                  Email
                </div>
                <div className="small-text" style={{ marginTop: 6 }}>
                  <a href="mailto:forrest.tindall@gmail.com">forrest.tindall@gmail.com</a>
                </div>
              </div>
            </div>

            <div>
              <form onSubmit={submit} className="contact-form">
                <input
                  className="newsletter-input"
                  type="text"
                  value={name}
                  onChange={(ev) => setName(ev.target.value)}
                  placeholder="Name"
                  required
                />
                <input
                  className="newsletter-input"
                  type="email"
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  placeholder="Email"
                  required
                />
                <textarea
                  className="newsletter-input contact-textarea"
                  value={message}
                  onChange={(ev) => setMessage(ev.target.value)}
                  placeholder="Message"
                  required
                />
                <div className="contact-actions">
                  <button
                    type="submit"
                    className="newsletter-button"
                    disabled={status === 'loading'}
                    style={{
                      cursor: status === 'loading' ? 'default' : 'pointer',
                      opacity: status === 'loading' ? 0.6 : 1,
                    }}
                  >
                    {status === 'loading' ? '...' : 'Send'}
                  </button>

                  {status === 'success' && (
                    <div className="small-text" style={{ opacity: 0.85, textTransform: 'none' }}>
                      Sent.
                    </div>
                  )}
                  {status === 'error' && (
                    <div className="small-text" style={{ opacity: 0.85, textTransform: 'none' }}>
                      Error. Check EmailJS config and try again.
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Contact;
