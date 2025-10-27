import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            MagicMail
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Classify your Gmail emails with AI-powered categorization. 
            Get instant insights into your inbox with smart email organization.
          </p>
          
          <div className="flex justify-center gap-4 mb-16">
            <Link 
              href="/auth"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
            <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors">
              Learn More
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Google Login</h3>
              <p className="text-gray-600">Securely connect your Gmail account with OAuth</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Fetch Emails</h3>
              <p className="text-gray-600">Retrieve your latest emails from Gmail API</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">AI Classification</h3>
              <p className="text-gray-600">Smart categorization using OpenAI GPT-4o</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}