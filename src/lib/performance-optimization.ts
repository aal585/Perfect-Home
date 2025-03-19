// Performance optimization utilities

// Debounce function to limit how often a function can be called
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function to limit the rate at which a function can fire
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Lazy loading images
export function lazyLoadImages() {
  if (typeof window !== "undefined" && "IntersectionObserver" in window) {
    const imgObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.getAttribute("data-src");
          if (src) {
            img.src = src;
            img.removeAttribute("data-src");
          }
          observer.unobserve(img);
        }
      });
    });

    const imgs = document.querySelectorAll("img[data-src]");
    imgs.forEach((img) => imgObserver.observe(img));
  }
}

// Preload critical resources
export function preloadCriticalResources(resources: string[]) {
  if (typeof window !== "undefined") {
    resources.forEach((resource) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = resource;
      link.as = resource.endsWith(".js")
        ? "script"
        : resource.endsWith(".css")
          ? "style"
          : resource.match(/\.(jpg|jpeg|png|gif|webp)$/i)
            ? "image"
            : "fetch";
      document.head.appendChild(link);
    });
  }
}

// Cache API responses
const apiCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function cachedFetch(url: string, options?: RequestInit) {
  const cacheKey = `${url}-${JSON.stringify(options)}`;
  const now = Date.now();

  // Check if we have a valid cached response
  const cachedResponse = apiCache.get(cacheKey);
  if (cachedResponse && now - cachedResponse.timestamp < CACHE_DURATION) {
    return cachedResponse.data;
  }

  // If not cached or expired, make the actual fetch request
  const response = await fetch(url, options);
  const data = await response.json();

  // Cache the new response
  apiCache.set(cacheKey, {
    data,
    timestamp: now,
  });

  return data;
}
