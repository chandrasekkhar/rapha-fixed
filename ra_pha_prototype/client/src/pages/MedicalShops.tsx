import { useState } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, Star, Pill, Navigation } from "lucide-react";
import { toast } from "sonner";

export default function MedicalShops() {
  const [radius, setRadius] = useState(5);
  const [selectedShop, setSelectedShop] = useState<any>(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const { data: shops, isLoading, refetch } = trpc.emergency.getNearbyMedicalShops.useQuery({
    latitude,
    longitude,
    radius,
  });

  const { data: shopDetails } = trpc.emergency.getShopDetails.useQuery(
    { shopId: selectedShop?.id || 0 },
    { enabled: !!selectedShop }
  );

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toString());
        setLongitude(position.coords.longitude.toString());
        toast.success("Location detected! Finding nearby pharmacies...");
      },
      (error) => {
        toast.error("Failed to get location. Please enable location services.");
      }
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Pill className="w-8 h-8 text-indigo-600" />
            Nearby Medical Shops & Pharmacies
          </h1>
          <p className="text-gray-600 mt-2">Find pharmacies and medical shops near you</p>
        </div>

        {/* Search Section */}
        <Card>
          <CardHeader>
            <CardTitle>Search Nearby Pharmacies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Radius (km)
                </label>
                <select
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={1}>1 km</option>
                  <option value={2}>2 km</option>
                  <option value={5}>5 km</option>
                  <option value={10}>10 km</option>
                  <option value={15}>15 km</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={handleGetLocation}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  Use My Location
                </Button>
              </div>

              {latitude && longitude && (
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-600" />
                  Location set
                </div>
              )}
            </div>

            {!latitude && !longitude && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-900 text-sm">
                  Click "Use My Location" to find pharmacies near you, or enter your location manually.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Shops List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Shops List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">
              {shops && shops.length > 0 ? `${shops.length} Pharmacies Found` : "Pharmacies"}
            </h2>

            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading pharmacies...</div>
            ) : shops && shops.length > 0 ? (
              <div className="space-y-3">
                {shops.map((shop: any) => (
                  <Card
                    key={shop.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedShop?.id === shop.id ? "ring-2 ring-indigo-600" : ""
                    }`}
                    onClick={() => setSelectedShop(shop)}
                  >
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900">{shop.name}</h3>
                            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                              <MapPin className="w-4 h-4" />
                              {shop.address}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span className="font-semibold text-gray-900">{shop.rating}</span>
                            </div>
                            <p className="text-xs text-gray-500">{shop.distance} km away</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Phone className="w-4 h-4" />
                            {shop.phone}
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Clock className="w-4 h-4" />
                            {shop.isOpen ? (
                              <span className="text-green-600 font-semibold">Open</span>
                            ) : (
                              <span className="text-red-600 font-semibold">Closed</span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {shop.services.slice(0, 2).map((service: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded"
                            >
                              {service}
                            </span>
                          ))}
                          {shop.services.length > 2 && (
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              +{shop.services.length - 2} more
                            </span>
                          )}
                        </div>

                        <Button
                          className="w-full mt-2"
                          onClick={() => setSelectedShop(shop)}
                          variant={selectedShop?.id === shop.id ? "default" : "outline"}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-8 pb-8 text-center">
                  <Pill className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No pharmacies found</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {latitude && longitude
                      ? "Try increasing the search radius"
                      : "Click 'Use My Location' to find nearby pharmacies"}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Shop Details */}
          <div>
            {selectedShop && shopDetails ? (
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="text-lg">{shopDetails.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <img
                      src={shopDetails.image}
                      alt={shopDetails.name}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold">Rating</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-bold text-gray-900">{shopDetails.rating}</span>
                        </div>
                        <span className="text-sm text-gray-600">({shopDetails.reviews} reviews)</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold">Address</p>
                      <p className="text-sm text-gray-900 mt-1 flex items-start gap-2">
                        <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-indigo-600" />
                        {shopDetails.address}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold">Contact</p>
                      <p className="text-sm text-gray-900 mt-1 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-indigo-600" />
                        <a href={`tel:${shopDetails.phone}`} className="text-indigo-600 hover:underline">
                          {shopDetails.phone}
                        </a>
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold">Hours</p>
                      <p className="text-sm text-gray-900 mt-1 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-indigo-600" />
                        {shopDetails.hours}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold mb-2">Services</p>
                      <div className="flex flex-wrap gap-1">
                        {shopDetails.services.map((service: string, idx: number) => (
                          <span
                            key={idx}
                            className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                      <Button
                        className="w-full"
                        onClick={() => {
                          window.open(
                            `https://maps.google.com/?q=${shopDetails.latitude},${shopDetails.longitude}`,
                            "_blank"
                          );
                        }}
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Get Directions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-8 pb-8 text-center">
                  <Pill className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">Select a pharmacy to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
