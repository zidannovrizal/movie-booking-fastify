import { PrismaClient, BookingStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // Clean up existing data
  console.log("Cleaning up existing data...");
  await prisma.booking.deleteMany();
  await prisma.theater.deleteMany();
  await prisma.user.deleteMany();
  console.log("Existing data cleaned up successfully.");

  // Create theaters
  const theaters = [
    // Indonesia Theaters
    {
      id: "1",
      name: "CGV Grand Indonesia",
      location: "Grand Indonesia Mall",
      city: "Jakarta",
      country: "Indonesia",
      address: "Jl. M.H. Thamrin No.1, Kebon Melati, Jakarta Pusat",
      facilities: ["IMAX", "Dolby Atmos", "VIP Lounge", "Parking"],
      capacity: 300,
      showTimes: ["10:00", "13:00", "16:00", "19:00", "22:00"],
      regularPriceWeekday: 8,
      regularPriceWeekend: 12,
      vipPriceWeekday: 15,
      vipPriceWeekend: 20,
    },
    {
      id: "2",
      name: "XXI Plaza Indonesia",
      location: "Plaza Indonesia",
      city: "Jakarta",
      country: "Indonesia",
      address: "Jl. M.H. Thamrin Kav. 28-30, Gondangdia, Jakarta Pusat",
      facilities: ["4DX", "Dolby Surround", "Cafe"],
      capacity: 250,
      showTimes: ["11:00", "14:00", "17:00", "20:00"],
      regularPriceWeekday: 7,
      regularPriceWeekend: 10,
      vipPriceWeekday: 13,
      vipPriceWeekend: 18,
    },
    // USA Theaters
    {
      id: "3",
      name: "AMC Empire 25",
      location: "Times Square",
      city: "New York",
      country: "United States",
      address: "234 W 42nd St, New York, NY 10036",
      facilities: ["IMAX", "Dolby Cinema", "RealD 3D", "Recliners"],
      capacity: 400,
      showTimes: ["11:00", "14:30", "18:00", "21:30", "23:59"],
      regularPriceWeekday: 16,
      regularPriceWeekend: 20,
      vipPriceWeekday: 25,
      vipPriceWeekend: 30,
    },
    {
      id: "4",
      name: "TCL Chinese Theatre",
      location: "Hollywood Boulevard",
      city: "Los Angeles",
      country: "United States",
      address: "6925 Hollywood Blvd, Hollywood, CA 90028",
      facilities: ["IMAX Laser", "VIP Experience", "Historic Venue"],
      capacity: 932,
      showTimes: ["10:00", "13:30", "17:00", "20:30", "23:00"],
      regularPriceWeekday: 18,
      regularPriceWeekend: 22,
      vipPriceWeekday: 28,
      vipPriceWeekend: 35,
    },
    // UK Theaters
    {
      id: "5",
      name: "Odeon Luxe Leicester Square",
      location: "Leicester Square",
      city: "London",
      country: "United Kingdom",
      address: "24-26 Leicester Square, London WC2H 7JY",
      facilities: ["IMAX", "Dolby Cinema", "Luxury Recliners", "Royal Box"],
      capacity: 800,
      showTimes: ["12:00", "15:30", "19:00", "22:30"],
      regularPriceWeekday: 15,
      regularPriceWeekend: 19,
      vipPriceWeekday: 25,
      vipPriceWeekend: 32,
    },
    // Japan Theaters
    {
      id: "6",
      name: "TOHO Cinemas Shinjuku",
      location: "Shinjuku",
      city: "Tokyo",
      country: "Japan",
      address: "1 Chome-19-1 Kabukicho, Shinjuku City, Tokyo 160-0021",
      facilities: ["IMAX", "MX4D", "Premium Seats", "Couples Seats"],
      capacity: 350,
      showTimes: ["09:00", "12:30", "16:00", "19:30", "23:00"],
      regularPriceWeekday: 12,
      regularPriceWeekend: 15,
      vipPriceWeekday: 20,
      vipPriceWeekend: 25,
    },
    // South Korea Theaters
    {
      id: "7",
      name: "CGV Yongsan I'Park Mall",
      location: "Yongsan I'Park Mall",
      city: "Seoul",
      country: "South Korea",
      address: "55 Hangang-daero 23-gil, Yongsan-gu, Seoul",
      facilities: ["4DX", "SCREENX", "Gold Class", "Sweet Box"],
      capacity: 450,
      showTimes: ["10:30", "14:00", "17:30", "21:00", "23:30"],
      regularPriceWeekday: 11,
      regularPriceWeekend: 14,
      vipPriceWeekday: 18,
      vipPriceWeekend: 23,
    },
    // Australia Theaters
    {
      id: "8",
      name: "Event Cinemas George Street",
      location: "George Street",
      city: "Sydney",
      country: "Australia",
      address: "505-525 George St, Sydney NSW 2000",
      facilities: ["VMAX", "Gold Class", "4DX", "Dolby Atmos"],
      capacity: 500,
      showTimes: ["10:00", "13:30", "17:00", "20:30", "23:00"],
      regularPriceWeekday: 14,
      regularPriceWeekend: 18,
      vipPriceWeekday: 22,
      vipPriceWeekend: 28,
    },
    // Singapore Theaters
    {
      id: "9",
      name: "Shaw Theatres Lido IMAX",
      location: "Shaw House",
      city: "Singapore",
      country: "Singapore",
      address: "350 Orchard Road, Shaw House Level 5 & 6",
      facilities: ["IMAX", "Lumiere", "Dreamers", "Premium Seats"],
      capacity: 350,
      showTimes: ["11:30", "15:00", "18:30", "22:00"],
      regularPriceWeekday: 13,
      regularPriceWeekend: 16,
      vipPriceWeekday: 20,
      vipPriceWeekend: 25,
    },
    // UAE Theaters
    {
      id: "10",
      name: "Reel Cinemas The Dubai Mall",
      location: "The Dubai Mall",
      city: "Dubai",
      country: "United Arab Emirates",
      address: "The Dubai Mall, Financial Center Road",
      facilities: ["Platinum Suites", "Dine-in Cinema", "MX4D", "IMAX"],
      capacity: 600,
      showTimes: ["12:00", "15:30", "19:00", "22:30", "01:00"],
      regularPriceWeekday: 15,
      regularPriceWeekend: 20,
      vipPriceWeekday: 35,
      vipPriceWeekend: 45,
    },
  ];

  for (const theater of theaters) {
    await prisma.theater.upsert({
      where: { id: theater.id },
      update: theater,
      create: theater,
    });
  }

  // Create test users
  const users = [
    {
      email: "guest@gmail.com",
      password: "guest",
      name: "guest",
      phoneNumber: "+1234567890",
    },
  ];

  for (const userData of users) {
    await prisma.user.create({
      data: userData,
    });
  }

  // Create some test bookings
  const bookings = [
    {
      userId: (await prisma.user.findFirst())?.id as string,
      theaterId: "1",
      tmdbMovieId: 1233069,
      showDate: new Date("2024-03-15"),
      showTime: "13:00",
      isVIP: true,
      seats: ["A1", "A2"],
      totalPrice: 40, // 2 VIP seats on weekend
      status: BookingStatus.CONFIRMED,
    },
    {
      userId: (await prisma.user.findFirst())?.id as string,
      theaterId: "3",
      tmdbMovieId: 1011985,
      showDate: new Date("2024-03-20"),
      showTime: "19:00",
      isVIP: false,
      seats: ["F5", "F6", "F7"],
      totalPrice: 60, // 3 regular seats on weekend
      status: BookingStatus.PENDING,
    },
  ];

  for (const bookingData of bookings) {
    await prisma.booking.create({
      data: bookingData,
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
