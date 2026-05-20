const ALLOWED_TAGS = new Set([
  'a',
  'b',
  'br',
  'div',
  'em',
  'i',
  'li',
  'ol',
  'p',
  'span',
  'strong',
  'u',
  'ul',
])

const ALLOWED_ATTRS = {
  a: new Set(['href', 'title', 'target', 'rel']),
  div: new Set(['class']),
  p: new Set(['class']),
  span: new Set(['class']),
}

const isSafeUrl = (value = '') => {
  const trimmed = value.trim().toLowerCase()
  return (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('#')
  )
}

export const sanitizeHtml = (html = '') => {
  if (!html || typeof window === 'undefined' || !window.DOMParser) {
    return ''
  }

  const parser = new window.DOMParser()
  const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html')

  const cleanNode = (node) => {
    Array.from(node.children).forEach((child) => {
      const tagName = child.tagName.toLowerCase()

      if (!ALLOWED_TAGS.has(tagName)) {
        child.replaceWith(...Array.from(child.childNodes))
        cleanNode(node)
        return
      }

      Array.from(child.attributes).forEach((attr) => {
        const name = attr.name.toLowerCase()
        const allowedForTag = ALLOWED_ATTRS[tagName]

        if (!allowedForTag?.has(name) || name.startsWith('on')) {
          child.removeAttribute(attr.name)
          return
        }

        if (name === 'href' && !isSafeUrl(attr.value)) {
          child.removeAttribute(attr.name)
        }
      })

      if (tagName === 'a' && child.getAttribute('target') === '_blank') {
        child.setAttribute('rel', 'noopener noreferrer')
      }

      cleanNode(child)
    })
  }

  cleanNode(doc.body)

  return doc.body.firstElementChild?.innerHTML || ''
}
