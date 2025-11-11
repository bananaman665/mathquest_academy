import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Trophy, Target, ShoppingBag, User, MoreHorizontal, Sparkles, Home, Award, TrendingUp, Calendar, Flame, BookOpen, Zap, Star } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { prisma } from '@/lib/prisma'
import BottomNav from '@/components/BottomNav'
import ProfileEditor from '@/components/ProfileEditor'

export default async function ProfilePage() {
  const user = await currentUser()

  if (!user) {
    redirect('/signin')
  }

  let dbUser = await prisma.user.findUnique({
    where: { id: user.id }
  })

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        id: user.id,
        currentLevel: 1,
        totalXP: 0,
      }
    })
  }

  // Calculate stats
  const levelsCompleted = dbUser.currentLevel - 1
  const lessonsCompleted = levelsCompleted * 10 // 10 questions per level
  const accuracy = levelsCompleted > 0 ? Math.floor(85 + Math.random() * 10) : 0 // Mock accuracy
  const rank = dbUser.totalXP > 1000 ? 'Gold' : dbUser.totalXP > 500 ? 'Silver' : 'Bronze'

  const achievements = [
    { id: 1, name: 'First Steps', description: 'Complete your first lesson', icon: Target, iconColor: 'text-purple-500', unlocked: levelsCompleted >= 1 },
    { id: 2, name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: Flame, iconColor: 'text-orange-500', unlocked: (dbUser.streak || 0) >= 7 },
    { id: 3, name: 'Math Master', description: 'Complete 10 lessons', icon: BookOpen, iconColor: 'text-blue-500', unlocked: levelsCompleted >= 10 },
    { id: 4, name: 'XP Hunter', description: 'Earn 1000 XP', icon: Zap, iconColor: 'text-yellow-500', unlocked: dbUser.totalXP >= 1000 },
    { id: 5, name: 'Perfect Score', description: 'Get 100% on a lesson', icon: Star, iconColor: 'text-amber-500', unlocked: levelsCompleted >= 5 },
    { id: 6, name: 'Dedicated Learner', description: 'Complete 25 lessons', icon: Trophy, iconColor: 'text-yellow-600', unlocked: levelsCompleted >= 25 },
  ]

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Sidebar - Hidden on mobile */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 fixed h-full flex-col">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-green-600">Mathly</span>
          </Link>
        </div>

        <nav className="flex-1 px-4">
          <Link href="/learn" className="flex items-center gap-4 px-4 py-3 mb-2 rounded-xl hover:bg-gray-100 text-gray-700 font-bold transition-all">
            <Home className="w-6 h-6" />
            <span>LEARN</span>
          </Link>

          <Link href="/leaderboards" className="flex items-center gap-4 px-4 py-3 mb-2 rounded-xl hover:bg-gray-100 text-gray-700 font-bold transition-all">
            <Trophy className="w-6 h-6" />
            <span>LEADERBOARDS</span>
          </Link>

          <Link href="/quests" className="flex items-center gap-4 px-4 py-3 mb-2 rounded-xl hover:bg-gray-100 text-gray-700 font-bold transition-all">
            <Target className="w-6 h-6" />
            <span>QUESTS</span>
          </Link>

          <Link href="/shop" className="flex items-center gap-4 px-4 py-3 mb-2 rounded-xl hover:bg-gray-100 text-gray-700 font-bold transition-all">
            <ShoppingBag className="w-6 h-6" />
            <span>SHOP</span>
          </Link>

          <Link href="/profile" className="flex items-center gap-4 px-4 py-3 mb-2 rounded-xl bg-blue-100 border-2 border-blue-300 text-blue-600 font-bold transition-all">
            <User className="w-6 h-6" />
            <span>PROFILE</span>
          </Link>

          <Link href="/dashboard" className="flex items-center gap-4 px-4 py-3 mb-2 rounded-xl hover:bg-gray-100 text-gray-700 font-bold transition-all">
            <MoreHorizontal className="w-6 h-6" />
            <span>MORE</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{user.firstName || 'Student'}</p>
              <p className="text-xs text-gray-500">Level {dbUser.currentLevel}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 w-full">
        <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 md:left-64 z-10 pt-safe-header">
          <div className="max-w-5xl mx-auto px-4 md:px-6 py-4">
            <h1 className="text-2xl font-black text-gray-900">Profile</h1>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 pb-24 md:pb-8 pt-32">
          {/* Profile Header */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 md:p-8 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                <User className="w-10 h-10 md:w-12 md:h-12 text-blue-600" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-black mb-2">{user.firstName || 'Student'} {user.lastName || ''}</h2>
                <p className="text-blue-100 mb-3">Level {dbUser.currentLevel} • {rank} Rank</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-4">
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-2 md:px-4 md:py-2 rounded-xl">
                    <p className="text-xs md:text-sm font-semibold">Total XP</p>
                    <p className="text-xl md:text-2xl font-black">{dbUser.totalXP}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-2 md:px-4 md:py-2 rounded-xl flex items-center gap-2">
                    <p className="text-xs md:text-sm font-semibold">Day Streak</p>
                    <div className="flex items-center gap-1">
                      <p className="text-xl md:text-2xl font-black">{dbUser.streak || 0}</p>
                      <Flame className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-2 md:px-4 md:py-2 rounded-xl">
                    <p className="text-xs md:text-sm font-semibold">Lessons</p>
                    <p className="text-xl md:text-2xl font-black">{lessonsCompleted}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">+12%</span>
              </div>
              <p className="text-sm text-gray-600 font-semibold mb-1">Accuracy</p>
              <p className="text-3xl font-black text-gray-900">{accuracy}%</p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600 font-semibold mb-1">Days Active</p>
              <p className="text-3xl font-black text-gray-900">{Math.max(dbUser.streak || 0, levelsCompleted)}</p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <Flame className="w-8 h-8 text-orange-600" />
              </div>
              <p className="text-sm text-gray-600 font-semibold mb-1">Best Streak</p>
              <p className="text-3xl font-black text-gray-900">{dbUser.streak || 0}</p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-sm text-gray-600 font-semibold mb-1">Achievements</p>
              <p className="text-3xl font-black text-gray-900">{achievements.filter(a => a.unlocked).length}/{achievements.length}</p>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-8 h-8 text-yellow-600" />
              <h2 className="text-2xl font-black text-gray-900">Achievements</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => {
                const AchievementIcon = achievement.icon
                
                return (
                  <div
                    key={achievement.id}
                    className={`border-2 rounded-2xl p-6 transition-all ${
                      achievement.unlocked
                        ? 'bg-white border-green-300 shadow-md'
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${achievement.unlocked ? 'bg-gradient-to-br from-gray-50 to-gray-100' : 'bg-gray-200'} border-2 ${achievement.unlocked ? 'border-gray-200' : 'border-gray-300'}`}>
                        <AchievementIcon className={`w-8 h-8 ${achievement.unlocked ? achievement.iconColor : 'text-gray-400'}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">{achievement.name}</h3>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        {achievement.unlocked && (
                          <span className="inline-block text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full mt-2">
                            ✓ Unlocked
                          </span>
                        )}
                        {!achievement.unlocked && (
                          <span className="inline-block text-xs font-bold text-gray-500 bg-gray-200 px-3 py-1 rounded-full mt-2">
                            🔒 Locked
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-black text-gray-900">Recent Activity</h2>
            </div>
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
              {levelsCompleted > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">Completed Level {dbUser.currentLevel - 1}</p>
                      <p className="text-sm text-gray-600">Earned {(dbUser.currentLevel - 1) * 10} XP</p>
                    </div>
                    <p className="text-sm text-gray-500">Today</p>
                  </div>

                  {levelsCompleted >= 2 && (
                    <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <Flame className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">Streak milestone reached</p>
                        <p className="text-sm text-gray-600">{dbUser.streak || 0} day streak</p>
                      </div>
                      <p className="text-sm text-gray-500">Yesterday</p>
                    </div>
                  )}

                  {levelsCompleted >= 3 && (
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">Achievement unlocked</p>
                        <p className="text-sm text-gray-600">First Steps</p>
                      </div>
                      <p className="text-sm text-gray-500">2 days ago</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No activity yet</p>
                  <Link
                    href="/learn"
                    className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl transition-all"
                  >
                    Start Learning
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Account Settings */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <User className="w-8 h-8 text-gray-700" />
              <h2 className="text-2xl font-black text-gray-900">Account Settings</h2>
            </div>
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
              <ProfileEditor 
                username={dbUser.username} 
                userId={user.id}
              />

              <div className="space-y-4 mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-2">
                  <div>
                    <p className="font-bold text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">{user.emailAddresses[0]?.emailAddress}</p>
                  </div>
                  <span className="text-sm text-gray-500 italic">Managed by Clerk</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-2">
                  <div>
                    <p className="font-bold text-gray-900">Notifications</p>
                    <p className="text-sm text-gray-600">Manage your notification preferences</p>
                  </div>
                  <span className="text-sm text-gray-500 italic">Coming soon</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="font-bold text-gray-900">Privacy</p>
                    <p className="text-sm text-gray-600">Control who can see your profile</p>
                  </div>
                  <span className="text-sm text-gray-500 italic">Coming soon</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Bottom Navigation for Mobile */}
      <BottomNav currentPage="profile" />
    </div>
  )
}
