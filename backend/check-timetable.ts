import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function check() {
    const all = await prisma.timetable.findMany();
    console.log("ALL ROLES IN DB:");
    console.log(Array.from(new Set(all.map(t => t.role))));

    const teachers = await prisma.timetable.findMany({ where: { role: "teacher" } });
    console.log(`\nFound ${teachers.length} teacher rows.`);
    console.log(teachers);
}

check().finally(() => prisma.$disconnect());
