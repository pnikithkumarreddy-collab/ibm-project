/**
 * Get the user's current geographic location using the browser's Geolocation API
 * @returns {Promise<{lat: number, lng: number}>} User's latitude and longitude
 * @throws {Error} If geolocation is not supported or user denies permission
 */
export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser. Please use a modern browser."))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (error) => {
        let errorMessage = "Unable to retrieve your location."
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location permissions in your browser settings."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable. Please check your device settings."
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again."
            break
          default:
            errorMessage = "An unknown error occurred while getting your location."
        }
        
        reject(new Error(errorMessage))
      },
      {
        enableHighAccuracy: true,
        timeout: 15000, // Increased from 10s to 15s for better reliability
        maximumAge: 60000, // Cache position for 1 minute to reduce API calls
      }
    )
  })
}

/**
 * Get a human-readable location name from coordinates using OpenStreetMap Nominatim API
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<string>} Human-readable location name or coordinates as fallback
 */
export async function getLocationName(lat, lng) {
  try {
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      throw new Error("Invalid coordinates provided")
    }
    
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      throw new Error("Coordinates out of valid range")
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'EmotionBasedLocationApp/1.0',
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(8000)
      }
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.address) {
      const parts = []
      
      // Prioritize useful location info
      if (data.address.neighbourhood || data.address.suburb) {
        parts.push(data.address.neighbourhood || data.address.suburb)
      }
      if (data.address.city || data.address.town || data.address.village) {
        parts.push(data.address.city || data.address.town || data.address.village)
      }
      if (data.address.state) {
        parts.push(data.address.state)
      }
      if (data.address.country) {
        parts.push(data.address.country)
      }
      
      if (parts.length > 0) {
        return parts.join(", ")
      }
    }
    
    // Fallback to display_name if address parsing fails
    return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    
  } catch (error) {
    console.error("Error fetching location name:", error)
    
    // Return coordinates as fallback
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
  }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - First latitude
 * @param {number} lng1 - First longitude
 * @param {number} lat2 - Second latitude
 * @param {number} lng2 - Second longitude
 * @returns {number} Distance in kilometers
 */
export function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c
  
  return Math.round(distance * 10) / 10 // Round to 1 decimal place
}

/**
 * Convert degrees to radians
 * @param {number} degrees
 * @returns {number} Radians
 */
function toRadians(degrees) {
  return degrees * (Math.PI / 180)
}