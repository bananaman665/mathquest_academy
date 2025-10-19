export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white rounded-3xl p-12 shadow-2xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          ✅ App is Working!
        </h1>
        <p className="text-xl text-gray-600">
          If you can see this, Next.js and Vercel are working fine.
        </p>
        <p className="text-lg text-gray-500 mt-4">
          The issue is likely with Prisma/Database connection.
        </p>
      </div>
    </div>
  )
}
