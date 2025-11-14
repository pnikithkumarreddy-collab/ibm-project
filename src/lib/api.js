import { GoogleGenAI } from "@google/genai"

const GEMINI_API_KEY = "AIzaSyDiUA0BNd74b5vc50lmpLIqoerJaV9R67k"
const googleAi = new GoogleGenAI({apiKey: GEMINI_API_KEY})

export async function getRecommendations(mood, location) {
  const prompt = `Based on the user's current mood: "${mood}" and their location (latitude: ${location.lat}, longitude: ${location.lng}), recommend nearby places that would help improve or match their emotional state.

For ${mood} mood, suggest appropriate places. Return the response as a JSON array with the following structure:
[
  {
    "name": "Place Name",
    "type": "Place Type",
    "description": "Why this place is recommended",
    "address": "Approximate address or area"
  }
]

Return only the JSON array, no additional text.`

  try {
    const response = await googleAi.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt
    })
    
    const text = response.text
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    // Fallback: return structured data from text
    return parseRecommendationsFromText(text, mood)
  } catch (error) {
    console.error("Error fetching recommendations:", error)
    return getFallbackRecommendations(mood)
  }
}

export async function getMusicRecommendations(mood) {
  const prompt = `Based on the user's current mood: "${mood}", recommend 5-8 songs that would help improve or match their emotional state. 

Return the response as a JSON array with the following structure:
[
  {
    "title": "Song Title",
    "artist": "Artist Name",
    "genre": "Music Genre",
    "reason": "Why this song is recommended for this mood"
  }
]

Return only the JSON array, no additional text.`

  try {
    const response = await googleAi.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt
    })
    
    const text = response.text
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    return getFallbackMusicRecommendations(mood)
  } catch (error) {
    console.error("Error fetching music recommendations:", error)
    return getFallbackMusicRecommendations(mood)
  }
}

function parseRecommendationsFromText(text, mood) {
  // Fallback parser if JSON extraction fails
  const lines = text.split('\n').filter(line => line.trim())
  const recommendations = []
  
  lines.forEach(line => {
    if (line.includes('-') || line.includes('•')) {
      const name = line.replace(/[-•]/g, '').trim()
      if (name) {
        recommendations.push({
          name,
          type: "General",
          description: `Recommended for ${mood} mood`,
          address: "Nearby location"
        })
      }
    }
  })
  
  return recommendations.length > 0 ? recommendations : getFallbackRecommendations(mood)
}

function getFallbackRecommendations(mood) {
  const moodLower = mood.toLowerCase()
  
  if (moodLower.includes('happy') || moodLower.includes('joy')) {
    return [
      { name: "Local Theatre", type: "Entertainment", description: "Perfect for enhancing your joyful mood", address: "Nearby entertainment district" },
      { name: "Popular Pub", type: "Social", description: "Great place to celebrate and socialize", address: "City center" },
      { name: "Party Club", type: "Entertainment", description: "Energetic atmosphere to keep the good vibes going", address: "Nightlife area" },
      { name: "Entertainment Zone", type: "Entertainment", description: "Various activities to enjoy your happy mood", address: "Downtown" }
    ]
  } else if (moodLower.includes('disturbed') || moodLower.includes('confused') || moodLower.includes('stressed')) {
    return [
      { name: "Peaceful Temple", type: "Spiritual", description: "Calm environment to find inner peace", address: "Religious district" },
      { name: "Meditation Center", type: "Wellness", description: "Professional guidance for stress relief", address: "Wellness area" },
      { name: "Quiet Park", type: "Nature", description: "Natural setting to clear your mind", address: "City park" },
      { name: "Lakeside Spot", type: "Nature", description: "Serene water view for relaxation", address: "Waterfront area" }
    ]
  } else if (moodLower.includes('sad') || moodLower.includes('low') || moodLower.includes('demotivated')) {
    return [
      { name: "Beautiful Park", type: "Nature", description: "Nature's beauty to lift your spirits", address: "City park" },
      { name: "Temple", type: "Spiritual", description: "Spiritual peace and positive energy", address: "Religious area" },
      { name: "Cozy Café", type: "Social", description: "Warm atmosphere and good company", address: "Café district" },
      { name: "Nature Trail", type: "Nature", description: "Fresh air and natural surroundings", address: "Outdoor area" }
    ]
  } else if (moodLower.includes('ill') || moodLower.includes('sick') || moodLower.includes('unwell')) {
    return [
      { name: "Nearby Hospital", type: "Medical", description: "Emergency medical care available", address: "Medical district" },
      { name: "Local Clinic", type: "Medical", description: "Quick medical consultation", address: "Healthcare area" },
      { name: "Pharmacy", type: "Medical", description: "Medications and health supplies", address: "Commercial area" },
      { name: "Urgent Care Center", type: "Medical", description: "Immediate medical attention", address: "Medical facility" }
    ]
  }
  
  return [
    { name: "Local Park", type: "General", description: "A peaceful place to reflect", address: "Nearby" }
  ]
}

function getFallbackMusicRecommendations(mood) {
  const moodLower = mood.toLowerCase()
  
  if (moodLower.includes('happy') || moodLower.includes('joy')) {
    return [
      { title: "Happy", artist: "Pharrell Williams", genre: "Pop", reason: "Upbeat and energetic" },
      { title: "Can't Stop the Feeling!", artist: "Justin Timberlake", genre: "Pop", reason: "Dance-worthy and joyful" },
      { title: "Good Vibrations", artist: "The Beach Boys", genre: "Pop Rock", reason: "Classic feel-good song" },
      { title: "Walking on Sunshine", artist: "Katrina & The Waves", genre: "Pop Rock", reason: "Energetic and uplifting" }
    ]
  } else if (moodLower.includes('disturbed') || moodLower.includes('confused') || moodLower.includes('stressed')) {
    return [
      { title: "Weightless", artist: "Marconi Union", genre: "Ambient", reason: "Scientifically proven to reduce anxiety" },
      { title: "Meditation Music", artist: "Various", genre: "Ambient", reason: "Calming and focus-enhancing" },
      { title: "Clair de Lune", artist: "Claude Debussy", genre: "Classical", reason: "Peaceful and soothing" },
      { title: "Gymnopédie No. 1", artist: "Erik Satie", genre: "Classical", reason: "Calming and meditative" }
    ]
  } else if (moodLower.includes('sad') || moodLower.includes('low') || moodLower.includes('demotivated')) {
    return [
      { title: "Here Comes the Sun", artist: "The Beatles", genre: "Rock", reason: "Uplifting and hopeful" },
      { title: "Three Little Birds", artist: "Bob Marley", genre: "Reggae", reason: "Positive and reassuring" },
      { title: "Don't Worry Be Happy", artist: "Bobby McFerrin", genre: "Jazz", reason: "Cheerful and light-hearted" },
      { title: "What a Wonderful World", artist: "Louis Armstrong", genre: "Jazz", reason: "Appreciative and uplifting" }
    ]
  }
  
  return [
    { title: "Peaceful Melody", artist: "Various", genre: "Ambient", reason: "General relaxation" }
  ]
}

