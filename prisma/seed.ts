import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // Clean up existing data
  console.log("Cleaning up existing data...");
  await prisma.booking.deleteMany();
  await prisma.showTime.deleteMany();
  await prisma.theater.deleteMany();
  await prisma.user.deleteMany();
  console.log("Existing data cleaned up successfully.");

  // Create sample theaters
  console.log("Creating sample theaters...");
  const theaters = [
    {
      name: "IMAX Theater",
      location: "Downtown",
      city: "New York",
      address: "123 Main St",
      facilities: ["IMAX", "Dolby Atmos", "VIP Seating"],
      capacity: 300,
    },
    {
      name: "Cineplex Central",
      location: "Midtown",
      city: "Los Angeles",
      address: "456 Cinema Ave",
      facilities: ["4DX", "Dolby Surround", "Recliner Seats"],
      capacity: 250,
    },
    {
      name: "Metroplex Cinema",
      location: "South Side",
      city: "Chicago",
      address: "789 Movie Lane",
      facilities: ["RealD 3D", "Premium Sound", "Luxury Seats"],
      capacity: 200,
    },
  ];

  for (const theater of theaters) {
    try {
      const createdTheater = await prisma.theater.create({
        data: theater,
      });
      console.log(`Created theater: ${createdTheater.name}`);
    } catch (error) {
      console.error(`Error creating theater ${theater.name}:`, error);
    }
  }
  console.log("Sample theaters created successfully.");

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
