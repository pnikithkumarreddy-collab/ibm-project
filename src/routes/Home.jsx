import { useState } from "react"
import MoodChecker from "@/components/MoodChecker"
import Recommendations from "@/components/Recommendations"
import { Sparkles, MapPin, Music } from "lucide-react"

export default function Home() {
  const [selectedMood, setSelectedMood] = useState(null)

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood)
    setTimeout(() => {
      const recommendationsElement = document.getElementById("recommendations")
      if (recommendationsElement) {
        recommendationsElement.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }, 150)
  }

  const handleReset = () => {
    setSelectedMood(null)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <header className="text-center space-y-6 mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-4 animate-in zoom-in duration-500">
            <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
          
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              Emotion-Based
              <br className="md:hidden" /> Discovery
            </h1>
            <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed px-4">
              Discover personalized places and music that resonate with your current mood and emotional state
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-slate-200">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-slate-700">Nearby Places</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-slate-200">
              <Music className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-slate-700">Music Picks</span>
            </div>
          </div>
        </header>

        {!selectedMood && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: '400ms' }}>
            <MoodChecker onMoodSelect={handleMoodSelect} />
          </div>
        )}

        {selectedMood && (
          <div id="recommendations" className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <Recommendations mood={selectedMood} onReset={handleReset} />
          </div>
        )}
      </div>

    </div>
  )
}