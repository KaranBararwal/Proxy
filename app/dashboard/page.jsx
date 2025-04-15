import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="p-8 text-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold">Welcome, {session?.user?.name}</h1>
      <p>Your email: {session?.user?.email}</p>
    </div>
  )
}