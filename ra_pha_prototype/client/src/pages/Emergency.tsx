import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, AlertTriangle, Phone, Plus, Trash2, MapPin, Clock, Star } from "lucide-react";
import { toast } from "sonner";

export default function Emergency() {
  const [showAddContact, setShowAddContact] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactRelationship, setContactRelationship] = useState("");
  const [sosActive, setSOSActive] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const { data: contacts, refetch: refetchContacts } = trpc.emergency.getEmergencyContacts.useQuery();
  const { data: activeAlert } = trpc.emergency.getActiveSOSAlert.useQuery();
  const addContactMutation = trpc.emergency.addEmergencyContact.useMutation();
  const deleteContactMutation = trpc.emergency.deleteEmergencyContact.useMutation();
  const triggerSOSMutation = trpc.emergency.triggerSOS.useMutation();
  const resolveSOSMutation = trpc.emergency.resolveSOSAlert.useMutation();

  useEffect(() => {
    if (activeAlert) {
      setSOSActive(true);
    }
  }, [activeAlert]);

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactPhone) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await addContactMutation.mutateAsync({
        name: contactName,
        phone: contactPhone,
        relationship: contactRelationship,
      });
      toast.success("Emergency contact added");
      setContactName("");
      setContactPhone("");
      setContactRelationship("");
      setShowAddContact(false);
      refetchContacts();
    } catch (error) {
      toast.error("Failed to add emergency contact");
    }
  };

  const handleDeleteContact = async (id: number) => {
    try {
      await deleteContactMutation.mutateAsync({ id });
      toast.success("Emergency contact deleted");
      refetchContacts();
    } catch (error) {
      toast.error("Failed to delete emergency contact");
    }
  };

  const handleTriggerSOS = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await triggerSOSMutation.mutateAsync({
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
            description: "User triggered SOS alert",
          });
          toast.success("SOS alert triggered! Emergency services have been notified");
          setSOSActive(true);
        } catch (error: any) {
          toast.error(error.message || "Failed to trigger SOS");
        }
      },
      (error) => {
        toast.error("Failed to get location. Please enable location services.");
      }
    );
  };

  const handleResolveSOS = async () => {
    if (!activeAlert) return;
    try {
      await resolveSOSMutation.mutateAsync({ id: activeAlert.id });
      toast.success("SOS alert resolved");
      setSOSActive(false);
    } catch (error) {
      toast.error("Failed to resolve SOS alert");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* SOS Button Section */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            Emergency & SOS
          </h1>

          {/* Large SOS Button */}
          <Card className={`border-2 ${sosActive ? "border-red-500 bg-red-50" : "border-gray-200"}`}>
            <CardContent className="pt-8 pb-8 text-center">
              <div className="space-y-4">
                {sosActive && (
                  <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-4">
                    <p className="text-red-800 font-semibold">🚨 SOS Alert Active</p>
                    <p className="text-red-700 text-sm mt-1">
                      Your location has been shared with emergency services
                    </p>
                  </div>
                )}

                <button
                  onClick={handleTriggerSOS}
                  disabled={sosActive || triggerSOSMutation.isPending}
                  className={`w-full py-8 px-6 rounded-lg font-bold text-white text-2xl transition-all transform hover:scale-105 ${
                    sosActive
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 active:scale-95"
                  }`}
                >
                  {triggerSOSMutation.isPending ? "Triggering SOS..." : sosActive ? "SOS Active" : "🚨 TRIGGER SOS"}
                </button>

                {sosActive && (
                  <Button
                    onClick={handleResolveSOS}
                    variant="outline"
                    className="w-full text-red-600 border-red-300 hover:bg-red-50"
                    disabled={resolveSOSMutation.isPending}
                  >
                    {resolveSOSMutation.isPending ? "Resolving..." : "Resolve SOS Alert"}
                  </Button>
                )}

                <p className="text-gray-600 text-sm">
                  Press the button above in case of emergency. Your location will be shared with emergency services.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Emergency Contacts</CardTitle>
                <CardDescription>People to notify in case of emergency</CardDescription>
              </div>
              <Button onClick={() => setShowAddContact(!showAddContact)} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Contact
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {showAddContact && (
              <form onSubmit={handleAddContact} className="bg-gray-50 p-4 rounded-lg space-y-3 border border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Contact name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91-9876543210"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship
                  </label>
                  <input
                    type="text"
                    value={contactRelationship}
                    onChange={(e) => setContactRelationship(e.target.value)}
                    placeholder="e.g., Mother, Doctor, Friend"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={addContactMutation.isPending}>
                    {addContactMutation.isPending ? "Adding..." : "Add Contact"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowAddContact(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {contacts && contacts.length > 0 ? (
              <div className="space-y-2">
                {contacts.map((contact: any) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{contact.name}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {contact.phone}
                      </p>
                      {contact.relationship && (
                        <p className="text-xs text-gray-500">{contact.relationship}</p>
                      )}
                    </div>
                    <Button
                      onClick={() => handleDeleteContact(contact.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      disabled={deleteContactMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <AlertCircle className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                <p>No emergency contacts added yet</p>
                <p className="text-sm text-gray-400 mt-1">Add at least one contact for emergencies</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Emergency Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">When to use SOS</p>
                <p className="text-sm text-gray-600">Use the SOS button only in genuine emergencies. It will alert emergency services and your emergency contacts.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Keep contacts updated</p>
                <p className="text-sm text-gray-600">Make sure your emergency contacts are always up-to-date with correct phone numbers.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Location sharing</p>
                <p className="text-sm text-gray-600">Enable location services to allow emergency responders to find you quickly.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
