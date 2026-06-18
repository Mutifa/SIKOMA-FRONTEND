export function injectBackendStyles() {
  const base = import.meta.env.VITE_API_BASE_URL || ''
  const hrefs = [
    // `${base}/home-assets/lib/animate/animate.min.css`,
    `${base}/home-assets/lib/animate/animate.min.css`,
    `${base}/home-assets/lib/owlcarousel/assets/owl.carousel.min.css`,
    `${base}/home-assets/lib/lightbox/css/lightbox.min.css`,
    `${base}/home-assets/css/bootstrap.min.css`,
    `${base}/home-assets/css/style.css`,
  ]
  // Hanya menambahkan link stylesheet jika belum ada di head
  hrefs.forEach((href) => {
    if (!document.querySelector(`link[data-dynamic="${href}"]`)) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = href
      link.setAttribute('data-dynamic', href)
      document.head.appendChild(link)
    }
  })
}


