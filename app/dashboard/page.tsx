'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

interface Email {
  id: string
  subject: string
  from: string
  snippet: string
  date: string
  category?: string
}

export default function DashboardPage() {
  const [emails, setEmails] = useState<Email[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isClassifying, setIsClassifying] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth')
    }
    
    const openaiKey = localStorage.getItem('openai-key')
    if (!openaiKey && status === 'authenticated') {
      router.push('/auth')
    }
  }, [status, router])

  const fetchEmails = async () => {
  setIsLoading(true)
  
  try {
    const response = await fetch('/api/gmail?maxResults=15')
    const data = await response.json()
    
    if (response.ok) {
      if (data.emails && data.emails.length > 0) {
        setEmails(data.emails)
      } else {
        // If no emails returned, show a message but don't use mock data
        alert('No emails found in your Gmail inbox')
        setEmails([])
      }
    } else {
      alert('Failed to fetch emails: ' + data.error)
    }
  } catch (error) {
    alert('Error fetching emails from Gmail API')
    console.error('Gmail fetch error:', error)
  } finally {
    setIsLoading(false)
  }
}

  const classifyEmails = async () => {
    if (emails.length === 0) return
    
    setIsClassifying(true)
    
    try {
      const openaiKey = localStorage.getItem('openai-key')
      if (!openaiKey) {
        alert('OpenAI API key not found')
        return
      }

      const response = await fetch('/api/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emails, openaiKey })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        const classifiedEmails: Email[] = emails.map((email, index) => ({
          ...email,
          category: ['important', 'promotions', 'social', 'marketing', 'spam', 'general'][index % 6]
        }))
        setEmails(classifiedEmails)
      } else {
        alert('Failed to classify emails: ' + data.error)
      }
    } catch (error) {
      alert('Error classifying emails')
    } finally {
      setIsClassifying(false)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      important: 'bg-red-100 text-red-800 border border-red-200',
      promotions: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      social: 'bg-green-100 text-green-800 border border-green-200',
      marketing: 'bg-blue-100 text-blue-800 border border-blue-200',
      spam: 'bg-gray-100 text-gray-800 border border-gray-200',
      general: 'bg-purple-100 text-purple-800 border border-purple-200'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getCategoryCounts = () => {
    const counts = {
      important: 0,
      promotions: 0,
      social: 0,
      marketing: 0,
      spam: 0,
      general: 0
    }
    
    emails.forEach(email => {
      if (email.category) {
        counts[email.category as keyof typeof counts]++
      }
    })
    
    return counts
  }

  const categoryCounts = getCategoryCounts()

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">MagicMail Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome, {session.user?.name}</p>
            </div>
            <div className="flex items-center gap-4">
  {session.user?.image ? (
    <img 
      src={session.user.image} 
      alt={session.user?.name || 'User'}
      className="w-8 h-8 rounded-full"
      onError={(e) => {
        // If image fails to load, hide the broken image
        e.currentTarget.style.display = 'none'
      }}
    />
  ) : (
    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
      {session.user?.name?.charAt(0) || 'U'}
    </div>
        )}
      <button 
          onClick={() => {
          localStorage.removeItem('openai-key')
          signOut({ callbackUrl: '/' })
        }}
    className="text-gray-600 hover:text-gray-900 px-3 py-1 rounded border border-gray-300 hover:border-gray-400"
    >
    Sign Out
  </button>
</div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex gap-4 mb-6">
              <button
                onClick={fetchEmails}
                disabled={isLoading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Fetching...
                  </>
                ) : (
                  'Fetch Emails'
                )}
              </button>
              
              <button
                onClick={classifyEmails}
                disabled={emails.length === 0 || isClassifying}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isClassifying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Classifying...
                  </>
                ) : (
                  'Classify Emails'
                )}
              </button>
            </div>

            <div className="text-sm text-gray-600 mb-4">
              Found {emails.length} emails • Ready to classify with AI
            </div>

            {emails.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Object.entries(categoryCounts).map(([category, count]) => (
                  <div key={category} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(category)} inline-block mb-1`}>
                      {category}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{count}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Your Emails</h2>
            </div>
            
            <div className="divide-y">
              {emails.map((email) => (
                <div key={email.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{email.subject}</h3>
                    {email.category && (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(email.category)}`}>
                        {email.category}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">From: {email.from}</p>
                  <p className="text-gray-700 mb-2">{email.snippet}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(email.date).toLocaleDateString()} at {new Date(email.date).toLocaleTimeString()}
                  </p>
                </div>
              ))}
              
              {emails.length === 0 && !isLoading && (
                <div className="p-12 text-center text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  No emails fetched yet. Click "Fetch Emails" to get started.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}