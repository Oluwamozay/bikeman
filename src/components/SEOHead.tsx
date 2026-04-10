import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEOHead = ({ title, description, image, url, type = "website" }: SEOHeadProps) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper to set/create meta tags
    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", type);
    if (image) setMeta("property", "og:image", image);
    if (url) setMeta("property", "og:url", url);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    if (image) setMeta("name", "twitter:image", image);

    // JSON-LD structured data
    let script = document.querySelector('script[data-seo-jsonld]') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo-jsonld", "true");
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": type === "product" ? "Product" : "WebPage",
      name: title,
      description,
      ...(image && { image }),
      ...(url && { url }),
    });

    return () => {
      // Cleanup JSON-LD on unmount
      script?.remove();
    };
  }, [title, description, image, url, type]);

  return null;
};

export default SEOHead;
