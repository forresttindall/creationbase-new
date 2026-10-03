import { useMemo, useEffect } from 'react';

const Schema = ({ type = 'Organization', data = {} }) => {
  const schemaData = useMemo(() => {
    const base = {
      "@context": "https://schema.org",
      "@type": type,
      "name": "Creationbase",
      "url": "https://creationbase.io",
      "logo": "https://creationbase.io/logo.png",
      "sameAs": [
        "https://instagram.com/creationbase.io",
        "https://www.linkedin.com/company/creationbaseio/"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "email": "forrest@creationbase.io"
      }
    };

    if (type === 'Organization' || type === 'LocalBusiness') {
      return {
        ...base,
        "@type": "ProfessionalService",
        "description": "Creationbase is a Boise-based creative studio building brands, websites, and commercial photography for brave companies — identity systems, fast conversion-focused websites, and imagery that make you impossible to ignore.",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Brand, Web & Photo Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Branding & Identity",
                "description": "Positioning-driven visual systems, logo, type, and color that turn memory of your company into a repeatable competitive edge."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Website Design & Development",
                "description": "Fast, conversion-structured websites designed and built hand-in-hand with your brand, so the site looks as good as it performs."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Commercial Photography",
                "description": "Product, brand, and portrait photography art-directed to your identity — imagery built for web, print, and paid social."
              }
            }
          ]
        },
        "priceRange": "$$$"
      };
    }

    if (type === 'Service') {
      return {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": data.name || "Branding, Website Design & Development, and Commercial Photography",
        "provider": {
          "@type": "Organization",
          "name": "Creationbase",
          "url": "https://creationbase.io"
        },
        "description": data.description || "Creationbase — brand + web + photo for brave companies. A Boise-based studio building brands, websites, and commercial photography."
      };
    }

    if (type === 'BlogPosting') {
      return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": data.title,
        "datePublished": data.date,
        "author": {
          "@type": "Organization",
          "name": "Creationbase"
        },
        "image": data.image,
        "description": data.description,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://creationbase.io/blog/${data.slug}`
        }
      };
    }

    return base;
  }, [type, data]);

  useEffect(() => {
    if (type === 'BlogPosting' && data.title) {
      // Update Title
      document.title = `${data.title} | Creationbase`;
      
      // Update Meta Tags
      const metaUpdates = [
        { name: 'description', content: data.description },
        { property: 'og:title', content: data.title },
        { property: 'og:description', content: data.description },
        { property: 'og:image', content: data.image },
        { property: 'og:image:secure_url', content: data.image },
        { property: 'og:url', content: `https://creationbase.io/blog/${data.slug}` },
        { name: 'twitter:title', content: data.title },
        { name: 'twitter:description', content: data.description },
        { name: 'twitter:image', content: data.image }
      ];

      metaUpdates.forEach(update => {
        let el = update.name 
          ? document.querySelector(`meta[name="${update.name}"]`)
          : document.querySelector(`meta[property="${update.property}"]`);
        
        if (el) {
          el.setAttribute('content', update.content);
        } else {
          const newMeta = document.createElement('meta');
          if (update.name) newMeta.setAttribute('name', update.name);
          if (update.property) newMeta.setAttribute('property', update.property);
          newMeta.setAttribute('content', update.content);
          document.head.appendChild(newMeta);
        }
      });
    } else if (type === 'Organization' || type === 'LocalBusiness') {
      document.title = 'Creationbase — Brand + Web + Photo for Brave Companies';
      
      const defaults = [
        { name: 'description', content: 'Creationbase is a Boise-based creative studio building brands, websites, and commercial photography for brave companies — identity systems, fast conversion-focused websites, and imagery that make you impossible to ignore.' },
        { property: 'og:title', content: 'Creationbase — Brand + Web + Photo for Brave Companies' },
        { property: 'og:description', content: 'A Boise creative studio building brands, websites, and commercial photography for brave companies.' },
        { property: 'og:image', content: 'https://www.creationbase.io/images/socialshare.jpg?v=3' },
        { property: 'og:image:secure_url', content: 'https://www.creationbase.io/images/socialshare.jpg?v=3' },
        { property: 'og:url', content: 'https://www.creationbase.io/' },
        { name: 'twitter:title', content: 'Creationbase — Brand + Web + Photo for Brave Companies' },
        { name: 'twitter:description', content: 'A Boise creative studio building brands, websites, and commercial photography for brave companies.' },
        { name: 'twitter:image', content: 'https://www.creationbase.io/images/socialshare.jpg?v=3' }
      ];

      defaults.forEach(update => {
        let el = update.name 
          ? document.querySelector(`meta[name="${update.name}"]`)
          : document.querySelector(`meta[property="${update.property}"]`);
        if (el) el.setAttribute('content', update.content);
      });
    }
  }, [type, data]);

  return (
    <script type="application/ld+json">
      {JSON.stringify(schemaData)}
    </script>
  );
};

export default Schema;
