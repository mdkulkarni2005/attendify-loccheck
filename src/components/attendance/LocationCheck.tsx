
import React, { useState, useEffect } from 'react';
import { MapPin, AlertTriangle, Check, Navigation } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface LocationCheckProps {
  onLocationVerified: (isValid: boolean, distance?: number, locationData?: {
    latitude: number;
    longitude: number;
    accuracy: number;
    distance: number;
  }) => void;
  classLocation: {
    latitude: number;
    longitude: number;
    radius: number;
  };
  teacherLocation?: {
    latitude: number;
    longitude: number;
  };
  tolerance?: number; // Percentage tolerance (10-20%)
}

const LocationCheck: React.FC<LocationCheckProps> = ({ 
  onLocationVerified, 
  classLocation,
  teacherLocation,
  tolerance = 15 // Default 15% tolerance
}) => {
  const { toast } = useToast();
  const [status, setStatus] = useState<'checking' | 'success' | 'warning' | 'error' | 'proxy'>('checking');
  const [distance, setDistance] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{latitude: number; longitude: number; accuracy: number} | null>(null);
  const [showMap, setShowMap] = useState(false);

  // Calculate distance between two coordinates in meters
  const calculateDistance = (
    lat1: number, lon1: number, 
    lat2: number, lon2: number
  ): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  };

  const checkLocation = () => {
    setStatus('checking');
    setErrorMessage(null);

    if (!navigator.geolocation) {
      setStatus('error');
      setErrorMessage('Geolocation is not supported by your browser');
      onLocationVerified(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setUserLocation({ latitude, longitude, accuracy });
        
        // First check against the class location
        let distanceFromClass = calculateDistance(
          latitude, longitude,
          classLocation.latitude, classLocation.longitude
        );
        
        // If teacher location is available, use that instead
        if (teacherLocation) {
          const distanceFromTeacher = calculateDistance(
            latitude, longitude,
            teacherLocation.latitude, teacherLocation.longitude
          );
          
          // Use the teacher's location as the reference point
          distanceFromClass = distanceFromTeacher;
        }
        
        setDistance(distanceFromClass);
        
        // Calculate the effective radius with tolerance
        const effectiveRadius = classLocation.radius * (1 + (tolerance / 100));

        if (distanceFromClass <= effectiveRadius) {
          // Student is in class (with tolerance applied)
          setStatus('success');
          onLocationVerified(true, distanceFromClass, {
            latitude,
            longitude,
            accuracy,
            distance: distanceFromClass
          });
          toast({
            title: "Location Verified",
            description: "You are in the correct location for this class.",
          });
        } else if (distanceFromClass <= 100) {
          // Student is on campus but not in class - flag as proxy attempt
          setStatus('proxy');
          onLocationVerified(false, distanceFromClass, {
            latitude,
            longitude,
            accuracy,
            distance: distanceFromClass
          });
          toast({
            variant: "destructive",
            title: "Proxy Attendance Detected",
            description: "You appear to be on campus but not in the classroom.",
          });
        } else {
          // Student is not on campus
          setStatus('error');
          onLocationVerified(false, distanceFromClass, {
            latitude,
            longitude,
            accuracy,
            distance: distanceFromClass
          });
          toast({
            variant: "destructive",
            title: "Location Error",
            description: "You are not in the valid location for this class.",
          });
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        
        setStatus('error');
        setErrorMessage(getLocationErrorMessage(error));
        onLocationVerified(false);
        
        toast({
          variant: "destructive",
          title: "Location Error",
          description: "Unable to get your location. Please enable location services.",
        });
      },
      { 
        enableHighAccuracy: true, 
        timeout: 10000, 
        maximumAge: 0 
      }
    );
  };

  const getLocationErrorMessage = (error: GeolocationPositionError): string => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return "Location permission denied. Please enable location services.";
      case error.POSITION_UNAVAILABLE:
        return "Location information is unavailable.";
      case error.TIMEOUT:
        return "The request to get your location timed out.";
      default:
        return "An unknown error occurred while trying to get your location.";
    }
  };

  // Automatic check when component mounts
  useEffect(() => {
    checkLocation();
  }, []);
  
  // Load Google Maps API script
  useEffect(() => {
    if (showMap && !window.google?.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBNLrJhOMz6idD05pzfn5lhA-TAw-mAZCU&libraries=places`;
      script.async = true;
      document.head.appendChild(script);
      
      script.onload = () => {
        initMap();
      };
      
      return () => {
        document.head.removeChild(script);
      };
    } else if (showMap && window.google?.maps) {
      initMap();
    }
  }, [showMap, userLocation, classLocation]);
  
  const initMap = () => {
    if (!userLocation || !window.google?.maps) return;
    
    const mapElement = document.getElementById('location-map');
    if (!mapElement) return;
    
    const map = new window.google.maps.Map(mapElement, {
      center: { lat: classLocation.latitude, lng: classLocation.longitude },
      zoom: 17,
    });
    
    // Add a marker for the class location
    new window.google.maps.Marker({
      position: { lat: classLocation.latitude, lng: classLocation.longitude },
      map,
      title: "Class Location",
      icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
      }
    });
    
    // Add a circle for the class radius
    new window.google.maps.Circle({
      strokeColor: "#4285F4",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#4285F4",
      fillOpacity: 0.1,
      map,
      center: { lat: classLocation.latitude, lng: classLocation.longitude },
      radius: classLocation.radius
    });
    
    // Add a circle for the tolerance radius
    new window.google.maps.Circle({
      strokeColor: "#34A853",
      strokeOpacity: 0.4,
      strokeWeight: 1,
      fillColor: "#34A853",
      fillOpacity: 0.05,
      map,
      center: { lat: classLocation.latitude, lng: classLocation.longitude },
      radius: classLocation.radius * (1 + (tolerance / 100))
    });
    
    // Add a marker for the user location
    new window.google.maps.Marker({
      position: { lat: userLocation.latitude, lng: userLocation.longitude },
      map,
      title: "Your Location",
      icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
      }
    });
    
    // Add accuracy circle for user location
    new window.google.maps.Circle({
      strokeColor: "#EA4335",
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillColor: "#EA4335",
      fillOpacity: 0.1,
      map,
      center: { lat: userLocation.latitude, lng: userLocation.longitude },
      radius: userLocation.accuracy
    });
    
    // If teacher location is available, add a marker
    if (teacherLocation) {
      new window.google.maps.Marker({
        position: { lat: teacherLocation.latitude, lng: teacherLocation.longitude },
        map,
        title: "Teacher Location",
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
        }
      });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <MapPin className="mr-2 h-5 w-5" />
          Location Verification
        </CardTitle>
        <CardDescription>
          Your location will be verified for accurate attendance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === 'checking' && (
          <div className="flex items-center justify-center p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {status === 'success' && (
          <Alert variant="default" className="bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-500" />
            <AlertTitle className="text-green-800">Location Verified</AlertTitle>
            <AlertDescription className="text-green-700">
              You are in the correct location for this class.
              {distance !== null && (
                <span className="block text-sm mt-1">
                  (You are approximately {Math.round(distance)} meters from the class center)
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {status === 'warning' && (
          <Alert variant="default" className="bg-yellow-50 border-yellow-200">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <AlertTitle className="text-yellow-800">Warning</AlertTitle>
            <AlertDescription className="text-yellow-700">
              You appear to be on campus but not in the classroom.
              {distance !== null && (
                <span className="block text-sm mt-1">
                  (You are approximately {Math.round(distance)} meters from the class center)
                </span>
              )}
              Your attendance may be marked as absent.
            </AlertDescription>
          </Alert>
        )}
        
        {status === 'proxy' && (
          <Alert variant="default" className="bg-orange-50 border-orange-200">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <AlertTitle className="text-orange-800">Proxy Attendance Attempt</AlertTitle>
            <AlertDescription className="text-orange-700">
              You appear to be near the classroom but not inside.
              {distance !== null && (
                <span className="block text-sm mt-1">
                  (You are approximately {Math.round(distance)} meters from the class center)
                </span>
              )}
              Your attendance has been flagged as a proxy attempt and will be reviewed.
            </AlertDescription>
          </Alert>
        )}

        {status === 'error' && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Location Error</AlertTitle>
            <AlertDescription>
              {errorMessage || "You are not in the valid location for this class."}
              {distance !== null && (
                <span className="block text-sm mt-1">
                  (You are approximately {Math.round(distance)} meters from the class center)
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}
        
        {showMap && (
          <div className="mt-4">
            <div id="location-map" className="h-60 rounded-md border" />
            <p className="text-xs text-muted-foreground mt-1">
              <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-1"></span> Class Location
              <span className="inline-block w-3 h-3 rounded-full bg-red-500 ml-3 mr-1"></span> Your Location
              {teacherLocation && (
                <><span className="inline-block w-3 h-3 rounded-full bg-green-500 ml-3 mr-1"></span> Teacher Location</>
              )}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={checkLocation}
            disabled={status === 'checking'}
          >
            Check Location Again
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => setShowMap(!showMap)}
          >
            <Navigation className="mr-2 h-4 w-4" />
            {showMap ? "Hide Map" : "Show Map"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationCheck;
