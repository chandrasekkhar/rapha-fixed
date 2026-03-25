import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";
import { z } from "zod";
import { notifyOwner } from "../_core/notification";

export const emergencyRouter = router({
  // Emergency Contacts
  addEmergencyContact: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      phone: z.string().min(10),
      relationship: z.string().optional(),
      isPrimary: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const contact = await db.createEmergencyContact({
          userId: ctx.user.id,
          name: input.name,
          phone: input.phone,
          relationship: input.relationship,
          isPrimary: input.isPrimary ? 1 : 0,
        });
        return { success: true, contact };
      } catch (error) {
        console.error("Error adding emergency contact:", error);
        throw new Error("Failed to add emergency contact");
      }
    }),

  getEmergencyContacts: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        const contacts = await db.getUserEmergencyContacts(ctx.user.id);
        return contacts || [];
      } catch (error) {
        console.error("Error fetching emergency contacts:", error);
        return [];
      }
    }),

  updateEmergencyContact: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      phone: z.string().optional(),
      relationship: z.string().optional(),
      isPrimary: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const updateData: any = {};
        if (input.name) updateData.name = input.name;
        if (input.phone) updateData.phone = input.phone;
        if (input.relationship) updateData.relationship = input.relationship;
        if (input.isPrimary !== undefined) updateData.isPrimary = input.isPrimary ? 1 : 0;

        const contact = await db.updateEmergencyContact(input.id, updateData);
        return { success: true, contact };
      } catch (error) {
        console.error("Error updating emergency contact:", error);
        throw new Error("Failed to update emergency contact");
      }
    }),

  deleteEmergencyContact: protectedProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        await db.deleteEmergencyContact(input.id);
        return { success: true };
      } catch (error) {
        console.error("Error deleting emergency contact:", error);
        throw new Error("Failed to delete emergency contact");
      }
    }),

  // SOS Alerts
  triggerSOS: protectedProcedure
    .input(z.object({
      latitude: z.string().optional(),
      longitude: z.string().optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if there's already an active SOS alert
        const activeAlert = await db.getActiveSOSAlert(ctx.user.id);
        if (activeAlert) {
          throw new Error("You already have an active SOS alert");
        }

        // Create new SOS alert
        const alert = await db.createSOSAlert({
          userId: ctx.user.id,
          latitude: input.latitude,
          longitude: input.longitude,
          description: input.description,
          status: "active",
          contactedEmergencyServices: 0,
        });

        // Notify owner about the SOS alert
        await notifyOwner({
          title: "🚨 SOS Alert Triggered",
          content: `User ${ctx.user.name} (${ctx.user.email}) has triggered an SOS alert at location: ${input.latitude}, ${input.longitude}. Description: ${input.description || "No description provided"}`,
        });

        return { success: true, alert };
      } catch (error) {
        console.error("Error triggering SOS:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to trigger SOS";
        throw new Error(errorMessage);
      }
    }),

  getSOSAlerts: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        const alerts = await db.getUserSOSAlerts(ctx.user.id);
        return alerts || [];
      } catch (error) {
        console.error("Error fetching SOS alerts:", error);
        return [];
      }
    }),

  getActiveSOSAlert: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        const alert = await db.getActiveSOSAlert(ctx.user.id);
        return alert || { id: 0, userId: ctx.user.id, status: "inactive", createdAt: new Date() };
      } catch (error) {
        console.error("Error fetching active SOS alert:", error);
        return { id: 0, userId: ctx.user.id, status: "inactive", createdAt: new Date() };
      }
    }),

  resolveSOSAlert: protectedProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const alert = await db.updateSOSAlertStatus(input.id, "resolved");
        return { success: true, alert };
      } catch (error) {
        console.error("Error resolving SOS alert:", error);
        throw new Error("Failed to resolve SOS alert");
      }
    }),

  // Nearby Medical Shops (using mock data for now)
  getNearbyMedicalShops: protectedProcedure
    .input(z.object({
      latitude: z.string().optional(),
      longitude: z.string().optional(),
      radius: z.number().optional().default(5), // in km
    }))
    .query(async ({ ctx, input }) => {
      try {
        // Mock data for nearby medical shops
        const mockShops: any[] = [
          {
            id: 1,
            name: "Apollo Pharmacy",
            address: "123 Main Street, Downtown",
            phone: "+91-9876543210",
            distance: 0.5,
            rating: 4.8,
            isOpen: true,
            hours: "9:00 AM - 10:00 PM",
            services: ["Medicines", "Consultation", "Home Delivery"],
          },
          {
            id: 2,
            name: "Medplus Pharmacy",
            address: "456 Park Avenue, Midtown",
            phone: "+91-9876543211",
            distance: 1.2,
            rating: 4.6,
            isOpen: true,
            hours: "8:00 AM - 11:00 PM",
            services: ["Medicines", "Lab Tests", "Vaccination"],
          },
          {
            id: 3,
            name: "Netmeds Store",
            address: "789 Oak Road, Uptown",
            phone: "+91-9876543212",
            distance: 2.1,
            rating: 4.7,
            isOpen: false,
            hours: "10:00 AM - 9:00 PM",
            services: ["Medicines", "Health Products", "Consultation"],
          },
          {
            id: 4,
            name: "CVS Pharmacy",
            address: "321 Elm Street, Westside",
            phone: "+91-9876543213",
            distance: 3.5,
            rating: 4.5,
            isOpen: true,
            hours: "24/7",
            services: ["Medicines", "Emergency Service"],
          },
          {
            id: 5,
            name: "Walgreens Health",
            address: "654 Pine Lane, Eastside",
            phone: "+91-9876543214",
            distance: 4.8,
            rating: 4.4,
            isOpen: true,
            hours: "7:00 AM - 10:00 PM",
            services: ["Medicines", "Health Checkup", "Vaccination"],
          },
        ];

        // Filter by radius
        const filtered = mockShops.filter(shop => shop.distance <= input.radius);
        
        // Sort by distance
        filtered.sort((a, b) => a.distance - b.distance);

        return filtered || [];
      } catch (error) {
        console.error("Error fetching nearby medical shops:", error);
        return [];
      }
    }),

  getShopDetails: protectedProcedure
    .input(z.object({
      shopId: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      try {
        // Mock shop details
        const mockShops: Record<number, any> = {
          1: {
            id: 1,
            name: "Apollo Pharmacy",
            address: "123 Main Street, Downtown",
            phone: "+91-9876543210",
            email: "apollo@pharmacy.com",
            website: "www.apollopharmacy.com",
            distance: 0.5,
            rating: 4.8,
            reviews: 245,
            isOpen: true,
            hours: "9:00 AM - 10:00 PM",
            services: ["Medicines", "Consultation", "Home Delivery", "Vaccination"],
            latitude: "28.6139",
            longitude: "77.2090",
            image: "https://via.placeholder.com/300x200?text=Apollo+Pharmacy",
          },
          2: {
            id: 2,
            name: "Medplus Pharmacy",
            address: "456 Park Avenue, Midtown",
            phone: "+91-9876543211",
            email: "medplus@pharmacy.com",
            website: "www.medplus.com",
            distance: 1.2,
            rating: 4.6,
            reviews: 189,
            isOpen: true,
            hours: "8:00 AM - 11:00 PM",
            services: ["Medicines", "Lab Tests", "Vaccination", "Home Delivery"],
            latitude: "28.6200",
            longitude: "77.2150",
            image: "https://via.placeholder.com/300x200?text=Medplus+Pharmacy",
          },
        };

        return mockShops[input.shopId] || { id: 0, name: "Shop Not Found", address: "", phone: "", email: "", website: "", distance: 0, rating: 0, reviews: 0, isOpen: false, hours: "", services: [], latitude: "", longitude: "", image: "" };
      } catch (error) {
        console.error("Error fetching shop details:", error);
        return { id: 0, name: "Shop Not Found", address: "", phone: "", email: "", website: "", distance: 0, rating: 0, reviews: 0, isOpen: false, hours: "", services: [], latitude: "", longitude: "", image: "" };
      }
    }),
});
