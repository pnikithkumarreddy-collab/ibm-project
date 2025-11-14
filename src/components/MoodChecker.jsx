import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Smile, Frown, Meh, Heart, AlertCircle, Sparkles } from "lucide-react"

const moods = [
  { 
    id: "happy", 
    label: "Happy", 
    icon: Smile, 
    gradient: "from-yellow-400 to-orange-500",
    bgColor: "bg-gradient-to-br from-yellow-50 to-orange-50",
    borderColor: "border-yellow-300 hover:border-yellow-400",
    iconColor: "text-yellow-600",
    description: "Feeling joyful and energetic"
  },
  { 
    id: "disturbed", 
    label: "Confused", 
    icon: AlertCircle, 
    gradient: "from-orange-400 to-red-500",
    bgColor: "bg-gradient-to-br from-orange-50 to-red-50",
    borderColor: "border-orange-300 hover:border-orange-400",
    iconColor: "text-orange-600",
    description: "Feeling stressed or uncertain"
  },
  { 
    id: "sad", 
    label: "Sad", 
    icon: Frown, 
    gradient: "from-blue-400 to-indigo-500",
    bgColor: "bg-gradient-to-br from-blue-50 to-indigo-50",
    borderColor: "border-blue-300 hover:border-blue-400",
    iconColor: "text-blue-600",
    description: "Feeling down or low energy"
  },
  { 
    id: "ill", 
    label: "Unwell", 
    icon: Heart, 
    gradient: "from-red-400 to-pink-500",
    bgColor: "bg-gradient-to-br from-red-50 to-pink-50",
    borderColor: "border-red-300 hover:border-red-400",
    iconColor: "text-red-600",
    description: "Feeling sick or tired"
  },
  { 
    id: "neutral", 
    label: "Neutral", 
    icon: Meh, 
    gradient: "from-gray-400 to-slate-500",
    bgColor: "bg-gradient-to-br from-gray-50 to-slate-50",
    borderColor: "border-gray-300 hover:border-gray-400",
    iconColor: "text-gray-600",
    description: "Feeling calm and balanced"
  },
]

export default function MoodChecker({ onMoodSelect }) {
  const [selectedMood, setSelectedMood] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleMoodSelect = async (mood) => {
    setSelectedMood(mood.id)
    setIsLoading(true)
    
    await new Promise(resolve => setTimeout(resolve, 400))
    
    setIsLoading(false)
    onMoodSelect(mood)
  }

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-xl border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="text-center space-y-4 pb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mx-auto mb-2">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          How are you feeling today?
        </CardTitle>
        <CardDescription className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
          Share your current mood and let us find the perfect places and music for you
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {moods.map((mood) => {
            const Icon = mood.icon
            const isSelected = selectedMood === mood.id
            
            return (
              <button
                key={mood.id}
                onClick={() => handleMoodSelect(mood)}
                disabled={isLoading}
                className={`
                  group relative p-6 rounded-2xl border-2 transition-all duration-300
                  ${isSelected 
                    ? `${mood.borderColor.split('hover:')[0]} shadow-2xl scale-105 ring-4 ring-${mood.iconColor.split('-')[1]}-200` 
                    : `border-slate-200 ${mood.borderColor} hover:shadow-xl hover:scale-102`
                  }
                  ${mood.bgColor}
                  disabled:opacity-50 disabled:cursor-not-allowed
                  focus:outline-none focus:ring-4 focus:ring-blue-200
                `}
              >
                <div className={`
                  absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300
                  bg-gradient-to-br ${mood.gradient}
                  ${isSelected ? 'opacity-20' : ''}
                `}></div>
                
                <div className="relative flex flex-col items-center gap-3">
                  <div className={`
                    p-4 rounded-xl transition-all duration-300
                    ${isSelected ? 'bg-white shadow-md scale-110' : 'bg-white/50 group-hover:bg-white group-hover:shadow-md'}
                  `}>
                    <Icon className={`
                      w-10 h-10 transition-all duration-300
                      ${mood.iconColor}
                      ${isSelected ? 'scale-110 animate-pulse' : 'group-hover:scale-110'}
                    `} />
                  </div>
                  
                  <div className="text-center space-y-1">
                    <h3 className={`
                      font-semibold text-lg transition-colors
                      ${isSelected ? mood.iconColor : 'text-slate-800'}
                    `}>
                      {mood.label}
                    </h3>
                    <p className="text-sm text-slate-600 leading-snug">
                      {mood.description}
                    </p>
                  </div>
                  
                  {isSelected && (
                    <Badge className={`
                      mt-2 bg-gradient-to-r ${mood.gradient} 
                      text-white border-0 shadow-md
                      animate-in fade-in zoom-in duration-300
                    `}>
                      ✓ Selected
                    </Badge>
                  )}
                </div>
              </button>
            )
          })}
        </div>
        
        {isLoading && (
          <div className="mt-8 text-center space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium">Analyzing your mood...</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}