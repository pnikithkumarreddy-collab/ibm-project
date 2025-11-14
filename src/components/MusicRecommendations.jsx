import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Music, ExternalLink, Play } from "lucide-react"

export default function MusicRecommendations({ mood, music }) {

  const searchOnSpotify = (title, artist) => {
    const query = encodeURIComponent(`${title} ${artist}`)
    const url = `https://open.spotify.com/search/${query}`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const searchOnYouTube = (title, artist) => {
    const query = encodeURIComponent(`${title} ${artist}`)
    const url = `https://www.youtube.com/results?search_query=${query}`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  if (!music || music.length === 0) {
    return null
  }

  return (
    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-200 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-200 rounded-full blur-3xl opacity-20"></div>
      
      <CardHeader className="relative space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-md">
            <Music className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">
              Music for Your <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{mood}</span> Mood
            </CardTitle>
            <CardDescription className="text-base mt-1">
              Perfect soundtrack for your journey and destination
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {music.map((song, index) => (
            <Card 
              key={index} 
              className="border-2 border-slate-200 hover:border-green-300 hover:shadow-lg transition-all duration-300 group bg-white"
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                      <Play className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-white rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-3">
                    <div>
                      <h4 className="font-semibold text-base leading-tight text-slate-800 line-clamp-1 group-hover:text-green-600 transition-colors">
                        {song.title}
                      </h4>
                      <p className="text-sm text-slate-600 truncate mt-1">
                        {song.artist}
                      </p>
                    </div>
                    
                    <Badge 
                      variant="outline" 
                      className="bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200 text-xs"
                    >
                      {song.genre}
                    </Badge>
                    
                    {song.reason && (
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {song.reason}
                      </p>
                    )}
                    
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => searchOnSpotify(song.title, song.artist)}
                        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-2 bg-[#1DB954] hover:bg-[#1ed760] text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                        aria-label={`Search ${song.title} on Spotify`}
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                        </svg>
                        Spotify
                      </button>
                      <button
                        onClick={() => searchOnYouTube(song.title, song.artist)}
                        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-2 bg-[#FF0000] hover:bg-[#cc0000] text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                        aria-label={`Search ${song.title} on YouTube`}
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        YouTube
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}