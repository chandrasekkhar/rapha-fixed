import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stethoscope, Plus, Calendar, MapPin, Star } from "lucide-react";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";

export default function Doctors() {
  const { data: appointments, isLoading } = trpc.appointments.getAppointments.useQuery();
  const createAppointmentMutation = trpc.appointments.createAppointment.useMutation();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    doctorName: "",
    specialty: "",
    appointmentTime: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAppointmentMutation.mutateAsync({
        doctorName: formData.doctorName,
        specialty: formData.specialty,
        appointmentTime: formData.appointmentTime ? new Date(formData.appointmentTime) : null,
        notes: formData.notes,
      });
      setFormData({
        doctorName: "",
        specialty: "",
        appointmentTime: "",
        notes: "",
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error creating appointment:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const scheduledAppointments = appointments?.filter(a => a.status === "scheduled") || [];
  const completedAppointments = appointments?.filter(a => a.status === "completed") || [];

  // Mock doctors list
  const availableDoctors = [
    { id: 1, name: "Dr. Rajesh Kumar", specialty: "Cardiology", rating: 4.8, experience: "15 years" },
    { id: 2, name: "Dr. Priya Singh", specialty: "Endocrinology", rating: 4.9, experience: "12 years" },
    { id: 3, name: "Dr. Amit Patel", specialty: "General Medicine", rating: 4.7, experience: "10 years" },
    { id: 4, name: "Dr. Neha Sharma", specialty: "Nutrition", rating: 4.6, experience: "8 years" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Stethoscope className="w-8 h-8 text-blue-600" />
              Telemedicine Consultations
            </h1>
            <p className="text-gray-600 mt-2">One-click access to healthcare professionals</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Book Consultation
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="border-indigo-200 bg-indigo-50">
            <CardHeader>
              <CardTitle>Book a Consultation</CardTitle>
              <CardDescription>Schedule a telemedicine appointment with a healthcare professional</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Doctor
                  </label>
                  <select
                    name="doctorName"
                    value={formData.doctorName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Choose a doctor...</option>
                    {availableDoctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.name}>
                        {doctor.name} - {doctor.specialty}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialty
                  </label>
                  <input
                    type="text"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    placeholder="e.g., Cardiology, General Medicine"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Appointment Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="appointmentTime"
                    value={formData.appointmentTime}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes / Symptoms
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Describe your symptoms or reason for consultation..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  ></textarea>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={createAppointmentMutation.isPending}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    {createAppointmentMutation.isPending ? "Booking..." : "Book Consultation"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Available Doctors */}
        <Card>
          <CardHeader>
            <CardTitle>Available Healthcare Professionals</CardTitle>
            <CardDescription>Expert doctors ready to help you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableDoctors.map((doctor) => (
                <div key={doctor.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
                      <p className="text-sm text-gray-600">{doctor.specialty}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium text-gray-900">{doctor.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">Experience: {doctor.experience}</p>
                  <Button
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        doctorName: doctor.name,
                        specialty: doctor.specialty,
                      }));
                      setShowForm(true);
                    }}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-sm"
                  >
                    Book Consultation
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Scheduled Appointments */}
        {scheduledAppointments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Appointments
              </CardTitle>
              <CardDescription>Your scheduled consultations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {scheduledAppointments.map((appointment) => (
                <div key={appointment.id} className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{appointment.doctorName}</h4>
                      <p className="text-sm text-gray-600">{appointment.specialty}</p>
                    </div>
                    <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                      Scheduled
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Calendar className="w-4 h-4" />
                    {appointment.appointmentTime ? new Date(appointment.appointmentTime).toLocaleString() : "TBD"}
                  </div>
                  {appointment.notes && (
                    <p className="text-sm text-gray-700 bg-white rounded p-2 mt-2">
                      <span className="font-medium">Notes:</span> {appointment.notes}
                    </p>
                  )}
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                      Join Consultation
                    </Button>
                    <Button size="sm" variant="outline">
                      Reschedule
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Completed Appointments */}
        {completedAppointments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Past Consultations</CardTitle>
              <CardDescription>Your consultation history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {completedAppointments.map((appointment) => (
                <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 opacity-75">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{appointment.doctorName}</h4>
                      <p className="text-sm text-gray-600">{appointment.specialty}</p>
                    </div>
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Completed
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {appointment.appointmentTime ? new Date(appointment.appointmentTime).toLocaleString() : "TBD"}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* No Appointments */}
        {!isLoading && appointments?.length === 0 && (
          <Card>
            <CardContent className="text-center py-12 text-gray-500">
              <Stethoscope className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No appointments scheduled</p>
              <p className="text-sm mt-2">Book a consultation with a healthcare professional</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
