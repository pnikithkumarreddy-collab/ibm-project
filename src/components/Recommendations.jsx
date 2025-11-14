import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { MapPin, ExternalLink, RefreshCw, Navigation, AlertCircle, Sparkles } from "lucide-react"
import { getRecommendations, getMusicRecommendations } from "@/lib/api"
import { getCurrentLocation, getLocationName } from "@/lib/geolocation"
import MusicRecommendations from "./MusicRecommendations"

export default function Recommendations({ mood, onReset }) {
  const [location, setLocation] = useState(null)
  const [locationName, setLocationName] = useState("")
  const [places, setPlaces] = useState([])
  const [music, setMusic] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadRecommendations()
  }, [mood])

  const loadRecommendations = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const userLocation = await getCurrentLocation()
      setLocation(userLocation)

      const name = await getLocationName(userLocation.lat, userLocation.lng)
      setLocationName(name)

      const [placeRecommendations, musicRecommendations] = await Promise.all([
        getRecommendations(mood.label, userLocation),
        getMusicRecommendations(mood.label)
      ])

      setPlaces(placeRecommendations)
      setMusic(musicRecommendations)
    } catch (err) {
      console.error("Error loading recommendations:", err)
      setError(err.message || "Failed to load recommendations. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const openInMaps = (place) => {
    const query = encodeURIComponent(`${place.name} ${locationName}`)
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-6xl mx-auto shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="relative">
            <Spinner className="w-12 h-12 text-blue-600" />
            <div className="absolute inset-0 w-12 h-12 border-4 border-purple-200 rounded-full animate-ping"></div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-lg font-medium text-slate-700">Finding perfect places for you...</p>
            <p className="text-sm text-slate-500">Analyzing your mood and nearby locations</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-6xl mx-auto shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center py-16 space-y-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold text-slate-800">Oops! Something went wrong</p>
            <p className="text-red-600 max-w-md">{error}</p>
          </div>
          <Button onClick={loadRecommendations} size="lg" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
        <CardHeader className="relative">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-xl shadow-md">
              <Navigation className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Your Current Location</CardTitle>
              <CardDescription className="text-slate-600 mt-1">
                We've detected your location to find nearby places
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="bg-white rounded-lg p-4 shadow-sm space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
              <p className="font-medium text-slate-800">{locationName}</p>
            </div>
            <p className="text-sm text-slate-500 pl-6">
              Coordinates: {location?.lat.toFixed(4)}, {location?.lng.toFixed(4)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-md">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">
                Places for Your <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{mood.label}</span> Mood
              </CardTitle>
              <CardDescription className="text-base mt-1">
                Curated locations to match or improve your emotional state
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {places.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                <MapPin className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-600">No places found nearby. Try a different mood!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {places.map((place, index) => (
                <Card 
                  key={index} 
                  className="border-2 border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 group"
                >
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-2">
                        <CardTitle className="text-lg leading-tight group-hover:text-purple-600 transition-colors">
                          {place.name}
                        </CardTitle>
                        <Badge 
                          variant="secondary" 
                          className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0"
                        >
                          <Sparkles className="w-3 h-3 mr-1" />
                          {place.type}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {place.description}
                    </p>
                    {place.address && (
                      <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg">
                        <MapPin className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {place.address}
                        </p>
                      </div>
                    )}
                    <Button
                      size="sm"
                      onClick={() => openInMaps(place)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2 shadow-md"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open in Google Maps
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <MusicRecommendations mood={mood.label} music={music} />

      <div className="flex justify-center pt-4">
        <Button 
          onClick={onReset} 
          variant="outline" 
          size="lg"
          className="gap-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border-2 hover:border-purple-300 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <RefreshCw className="w-5 h-5" />
          Check Mood Again
        </Button>
      </div>
    </div>
  )
}