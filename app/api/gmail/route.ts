import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { google } from 'googleapis'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const maxResults = parseInt(searchParams.get('maxResults') || '15')

    // Creating OAuth2 client with user's access token
    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({
      access_token: session.accessToken as string
    })

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

    // Fetch real emails from Gmail
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: maxResults,
    })

    const messages = response.data.messages || []
    const emails = []

    // Get full email details for each message
    for (const message of messages) {
      if (message.id) {
        try {
          const emailDetail = await gmail.users.messages.get({
            userId: 'me',
            id: message.id,
          })

          const headers = emailDetail.data.payload?.headers || []
          const subject = headers.find(header => header.name === 'Subject')?.value || 'No Subject'
          const from = headers.find(header => header.name === 'From')?.value || 'Unknown Sender'
          const date = headers.find(header => header.name === 'Date')?.value || new Date().toISOString()

          emails.push({
            id: message.id,
            subject: subject,
            from: from,
            snippet: emailDetail.data.snippet || '',
            date: date,
          })
        } catch (emailError) {
          console.error('Error fetching email details:', emailError)
        }
      }
    }

    return NextResponse.json({
      emails: emails,
      total: emails.length
    })
    
  } catch (error) {
    console.error('Gmail API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch emails from Gmail API. Please make sure you granted Gmail permissions.' },
      { status: 500 }
    )
  }
}