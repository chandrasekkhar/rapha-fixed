import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Phone, Star, Clock, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function RealTimeServices() {
  const { user } = useAuth();
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Location error:", error);
          // Default to Delhi coordinates for demo
          setLatitude(28.6139);
          setLongitude(77.209);
          toast.info("Using default location (Delhi)");
        }
      );
    }
  }, []);

  // Hospital Search
  const { data: hospitals, isLoading: hospitalsLoading } = trpc.realtime.searchHospitals.useQuery(
    latitude && longitude
      ? { latitude, longitude, radiusKm: 5 }
      : { latitude: 0, longitude: 0 },
    { enabled: !!latitude && !!longitude }
  );

  // Pharmacy Search
  const { data: pharmacies, isLoading: pharmaciesLoading } = trpc.realtime.searchPharmacies.useQuery(
    latitude && longitude
      ? { latitude, longitude, radiusKm: 5 }
      : { latitude: 0, longitude: 0 },
    { enabled: !!latitude && !!longitude }
  );

  // Ambulance Booking
  const bookAmbulanceMutation = trpc.realtime.bookAmbulance.useMutation({
    onSuccess: (data) => {
      toast.success(`Ambulance booked! Driver: ${data.driverName}, ETA: ${data.eta} mins`);
    },
    onError: (error) => {
      toast.error("Failed to book ambulance");
    },
  });

  const handleBookAmbulance = async () => {
    if (!latitude || !longitude || !user) return;

    setLoading(true);
    try {
      await bookAmbulanceMutation.mutateAsync({
        pickupLatitude: latitude,
        pickupLongitude: longitude,
        emergencyType: "medical",
        patientPhone: user.email || "+91-9999999999",
      });
    } catch (error) {
      console.error("Error booking ambulance:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Real-Time Health Services</h1>
          <p className="text-slate-600">Find nearby hospitals, pharmacies, and emergency services</p>
        </div>

        {/* Location Info */}
        {latitude && longitude && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-blue-900">
                <MapPin className="w-5 h-5" />
                <span>
                  Current Location: {latitude.toFixed(4)}, {longitude.toFixed(4)}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Emergency Ambulance Button */}
        <Card className="mb-6 bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Emergency Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleBookAmbulance}
              disabled={loading || bookAmbulanceMutation.isPending}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-bold"
            >
              {loading || bookAmbulanceMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Booking Ambulance...
                </>
              ) : (
                "🚑 Book Ambulance Now"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Hospitals and Pharmacies Tabs */}
        <Tabs defaultValue="hospitals" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="hospitals">Hospitals</TabsTrigger>
            <TabsTrigger value="pharmacies">Pharmacies</TabsTrigger>
          </TabsList>

          {/* Hospitals Tab */}
          <TabsContent value="hospitals" className="space-y-4">
            {hospitalsLoading ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  <p>Finding nearby hospitals...</p>
                </CardContent>
              </Card>
            ) : hospitals && hospitals.length > 0 ? (
              hospitals.map((hospital) => (
                <Card key={hospital.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{hospital.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="w-4 h-4" />
                          {hospital.distance.toFixed(1)} km away
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-600" />
                        <span className="font-semibold text-yellow-900">{hospital.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-slate-600">{hospital.address}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-500" />
                        <a href={`tel:${hospital.phone}`} className="text-blue-600 hover:underline text-sm">
                          {hospital.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-600">{hospital.hours}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <p className="text-sm font-semibold text-slate-700 mb-2">Specializations:</p>
                      <div className="flex flex-wrap gap-2">
                        {hospital.specializations.map((spec) => (
                          <span key={spec} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1"
                        onClick={() => window.open(`tel:${hospital.phone}`)}
                      >
                        Call
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          window.open(
                            `https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`
                          )
                        }
                      >
                        Directions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-slate-600">
                  No hospitals found nearby
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Pharmacies Tab */}
          <TabsContent value="pharmacies" className="space-y-4">
            {pharmaciesLoading ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  <p>Finding nearby pharmacies...</p>
                </CardContent>
              </Card>
            ) : pharmacies && pharmacies.length > 0 ? (
              pharmacies.map((pharmacy) => (
                <Card key={pharmacy.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{pharmacy.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="w-4 h-4" />
                          {pharmacy.distance.toFixed(1)} km away
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-600" />
                        <span className="font-semibold text-yellow-900">{pharmacy.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-slate-600">{pharmacy.address}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-500" />
                        <a href={`tel:${pharmacy.phone}`} className="text-blue-600 hover:underline text-sm">
                          {pharmacy.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-600">{pharmacy.hours}</span>
                      </div>
                    </div>

                    {pharmacy.deliveryAvailable && (
                      <div className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded w-fit">
                        ✓ Delivery Available
                      </div>
                    )}

                    <div className="pt-3 flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1"
                        onClick={() => window.open(`tel:${pharmacy.phone}`)}
                      >
                        Call
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          window.open(
                            `https://www.google.com/maps/dir/?api=1&destination=${pharmacy.latitude},${pharmacy.longitude}`
                          )
                        }
                      >
                        Directions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-slate-600">
                  No pharmacies found nearby
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
