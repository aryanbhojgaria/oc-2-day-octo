import { Router } from "express"
import { PrismaClient } from "@prisma/client"

const router = Router()
const prisma = new PrismaClient()

// ─── List Exams ───────────────────────────────────────────────────
router.get("/", async (_req, res) => {
    try {
        const exams = await prisma.exam.findMany({
            include: { seatingPlans: true },
            orderBy: { date: "asc" }
        })
        res.json(exams)
    } catch (error) {
        console.error("Error fetching exams:", error)
        res.status(500).json({ error: "Failed to fetch exams" })
    }
})

// ─── Get Single Exam ──────────────────────────────────────────────
router.get("/:id", async (req, res) => {
    try {
        const exam = await prisma.exam.findUnique({
            where: { id: req.params.id },
            include: { seatingPlans: true }
        })
        if (!exam) return res.status(404).json({ error: "Exam not found" })
        res.json(exam)
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch exam" })
    }
})

// ─── Generate Seating Plan (AI/Algorithm) ─────────────────────────
router.post("/:id/generate-seating", async (req, res) => {
    try {
        const { id } = req.params;
        const exam = await prisma.exam.findUnique({ where: { id } });

        if (!exam) return res.status(404).json({ error: "Exam not found" });

        // Let's get all enrolled students to sit for this exam
        const students = await prisma.student.findMany();

        // Let's define some hardcoded available rooms for simplicity, 
        // normally these would be pulled from a Rooms table.
        const availableRooms = [
            { name: "LH-1", capacity: 40 },
            { name: "LH-2", capacity: 30 },
            { name: "Auditorium", capacity: 100 }
        ];

        // Basic algorithm to distribute students into rooms
        let remainingStudents = [...students];
        const newPlans = [];

        // Pre-clear any existing seating plan for this exam to regenerate
        await prisma.seatingPlan.deleteMany({ where: { examId: id } });

        for (const room of availableRooms) {
            if (remainingStudents.length === 0) break;

            // Take up to room capacity
            const assignedStudents = remainingStudents.splice(0, room.capacity);

            // Create plan
            const plan = await prisma.seatingPlan.create({
                data: {
                    room: room.name,
                    totalSeats: room.capacity,
                    assigned: assignedStudents.length,
                    examId: id,
                    students: JSON.stringify(assignedStudents.map(s => ({
                        id: s.id,
                        externalId: s.externalId,
                        name: s.name,
                        department: s.department
                    })))
                }
            });
            newPlans.push(plan);
        }

        res.json({ message: "Seating plan generated successfully", plans: newPlans });

    } catch (error) {
        console.error("Error generating seating:", error);
        res.status(500).json({ error: "Failed to generate seating plan" })
    }
})

export default router
