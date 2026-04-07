import React from 'react'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import api from '../lib/api.js'
import Spinner from '../components/Spinner.jsx'

export default function Template({ title, active, children }) {
  const [website, setWebsite] = React.useState(null)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (title) document.title = title
  }, [title])

  React.useEffect(() => {
    let mounted = true
    setLoading(true)
  api.get('/home')
      .then(res => { if (mounted) { setWebsite(res.data.website || res.data.data?.website || res.data.data)} })
      .catch(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  return (
    <div>
      <Spinner show={loading} />
      <Navbar active={active} website={website} />
      <main>
        {children}
      </main>
      <Footer website={website} />
    </div>
  )
}


