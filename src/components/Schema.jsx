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
        "description": "Creationbase is a Strategic Creation Consultancy — a Boise-based studio that runs a Digital Value Creation Plan (DVCP): scorecard, opportunity map, and roadmap before shipping branding, website, and social channels from one strategic seat so every deliverable compounds into measurable growth.",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Strategic Creation Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "DVCP Strategy",
                "description": "Scorecard, opportunity map, and execution roadmap — the strategic blueprint that aligns brand, website, and social around the same growth metrics."
              }
            },
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
                "description": "Fast, conversion-structured websites scored on pipeline impact, not vanity traffic — designed, built, and measured from the same strategic seat as your brand."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Social Content Strategy",
                "description": "Editorial calendars, creative direction, and production grounded in the positioning work so every post pulls pipeline, not just likes."
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
        "serviceType": data.name || "Strategic Creation, DVCP, Branding, Website, and Social Content Strategy",
        "provider": {
          "@type": "Organization",
          "name": "Creationbase",
          "url": "https://creationbase.io"
        },
        "description": data.description || "Creationbase — Strategic Creation Consultancy. Boise-based studio running a DVCP: scorecard, opportunity map, roadmap, then branding, website, and social from one strategic seat for measurable growth."
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
      document.title = 'Creationbase — Strategic Creation Consultancy · Branding, Website, Social, Scorecard-Driven Growth';
      
      const defaults = [
        { name: 'description', content: 'Creationbase is a Strategic Creation Consultancy — a Boise-based studio that runs a Digital Value Creation Plan (DVCP): scorecard, opportunity map, and roadmap before shipping branding, website, and social channels from the same strategic seat so every deliverable compounds into measurable growth.' },
        { property: 'og:title', content: 'Creationbase — Strategic Creation Consultancy' },
        { property: 'og:description', content: 'A Boise strategic creation studio that runs a DVCP (scorecard → opportunity map → roadmap) before shipping branding, website, and social from one seat so all deliverables compound into measurable growth.' },
        { property: 'og:image', content: 'https://www.creationbase.io/images/socialshare.jpg?v=3' },
        { property: 'og:image:secure_url', content: 'https://www.creationbase.io/images/socialshare.jpg?v=3' },
        { property: 'og:url', content: 'https://www.creationbase.io/' },
        { name: 'twitter:title', content: 'Creationbase — Strategic Creation Consultancy' },
        { name: 'twitter:description', content: 'A Boise strategic creation studio that runs a DVCP (scorecard → opportunity map → roadmap) before shipping branding, website, and social from one seat so all deliverables compound into measurable growth.' },
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
