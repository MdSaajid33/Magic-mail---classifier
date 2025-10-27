import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { emails } = body

    return NextResponse.json({
      message: 'OpenAI classification would be implemented here',
      classifiedEmails: emails
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}