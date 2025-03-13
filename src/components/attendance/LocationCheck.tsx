
import React, { useState, useEffect } from 'react';
import { MapPin, AlertTriangle, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface LocationCheckProps {
  onLocationVerified: (isValid: boolean, distance?: number) => void;
  classLocation: {
    latitude: number;
    longitude: number;
    radius: number;
  };
}

const LocationCheck: React.FC<LocationCheckProps> = ({ 
  onLocationVerified, 
  classLocation 
}) => {
  const { toast } = useToast();
  const [status, setStatus] = useState<'checking' | 'success' | 'warning' | 'error'>('checking');
  const [distance, setDistance] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        const { latitude, longitude } = position.coords;
        const distanceFromClass = calculateDistance(
          latitude, longitude,
          classLocation.latitude, classLocation.longitude
        );
        
        setDistance(distanceFromClass);

        if (distanceFromClass <= classLocation.radius) {
          // Student is in class
          setStatus('success');
          onLocationVerified(true);
          toast({
            title: "Location Verified",
            description: "You are in the correct location for this class.",
          });
        } else if (distanceFromClass <= 1000) {
          // Student is on campus but not in class
          setStatus('warning');
          onLocationVerified(false, distanceFromClass);
          toast({
            variant: "destructive",
            title: "Location Warning",
            description: "You appear to be on campus but not in the classroom.",
          });
        } else {
          // Student is not on campus
          setStatus('error');
          onLocationVerified(false, distanceFromClass);
          toast({
            variant: "destructive",
            title: "Location Error",
            description: "You are not on campus. Attendance cannot be marked.",
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
            <AlertTitle className="text-yellow-800">Proxy Attendance Warning</AlertTitle>
            <AlertDescription className="text-yellow-700">
              You appear to be on campus but not in the classroom.
              {distance !== null && (
                <span className="block text-sm mt-1">
                  (You are approximately {Math.round(distance)} meters from the class center)
                </span>
              )}
              Your attendance may be marked as a proxy attempt.
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

        <Button 
          variant="outline" 
          className="w-full" 
          onClick={checkLocation}
          disabled={status === 'checking'}
        >
          Check Location Again
        </Button>
      </CardContent>
    </Card>
  );
};

export default LocationCheck;
