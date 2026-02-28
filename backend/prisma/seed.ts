import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
    console.log("🌱 Seeding database...")

    // ─── USERS ───────────────────────────────────────────────────────
    const userSeed = [
        { email: "admin@oc-2-day.edu", password: "admin@2026", role: "ADMIN" as const },
        { email: "teacher@oc-2-day.edu", password: "teach@2026", role: "TEACHER" as const },
        { email: "student@oc-2-day.edu", password: "stud@2026", role: "STUDENT" as const },
        { email: "parent@oc-2-day.edu", password: "parent@2026", role: "PARENT" as const },
        { email: "club@oc-2-day.edu", password: "club@2026", role: "CLUB" as const },
        // Individual student emails
        { email: "arjun.mehta@octocampus.edu", password: "stud@2026", role: "STUDENT" as const },
        { email: "priya.sharma@octocampus.edu", password: "stud@2026", role: "STUDENT" as const },
        { email: "rohan.gupta@octocampus.edu", password: "stud@2026", role: "STUDENT" as const },
        { email: "ananya.iyer@octocampus.edu", password: "stud@2026", role: "STUDENT" as const },
        // Individual teacher emails
        { email: "kavitha.nair@octocampus.edu", password: "teach@2026", role: "TEACHER" as const },
        { email: "rajesh.kumar@octocampus.edu", password: "teach@2026", role: "TEACHER" as const },
        { email: "sunita.patel@octocampus.edu", password: "teach@2026", role: "TEACHER" as const },
        { email: "vikram.rathore@octocampus.edu", password: "teach@2026", role: "TEACHER" as const },
        { email: "shreya.ghosh@octocampus.edu", password: "teach@2026", role: "TEACHER" as const },
        { email: "amit.desai@octocampus.edu", password: "teach@2026", role: "TEACHER" as const },
        // Hackathon extra student emails
        { email: "neha.verma@octocampus.edu", password: "stud@2026", role: "STUDENT" as const },
        { email: "rahul.singh@octocampus.edu", password: "stud@2026", role: "STUDENT" as const },
        { email: "kavya.nair@octocampus.edu", password: "stud@2026", role: "STUDENT" as const },
        { email: "aditya.rao@octocampus.edu", password: "stud@2026", role: "STUDENT" as const },
        { email: "sneha.patil@octocampus.edu", password: "stud@2026", role: "STUDENT" as const },
    ]

    const createdUsers: Record<string, string> = {}
    for (const u of userSeed) {
        const passwordHash = await bcrypt.hash(u.password, 10)
        const user = await prisma.user.upsert({
            where: { email: u.email },
            update: {},
            create: { email: u.email, passwordHash, role: u.role },
        })
        createdUsers[u.email] = user.id
    }
    console.log("✅ Users seeded")

    // ─── STUDENTS ────────────────────────────────────────────────────
    const studentsData = [
        { externalId: "STU001", name: "Arjun Mehta", email: "arjun.mehta@octocampus.edu", department: "Computer Science", year: 3, hostel: true, attendance: 87, cgpa: 8.4, photo: "/avatars/student1.jpg" },
        { externalId: "STU002", name: "Priya Sharma", email: "priya.sharma@octocampus.edu", department: "Electronics", year: 2, hostel: false, attendance: 92, cgpa: 9.1, photo: "/avatars/student2.jpg" },
        { externalId: "STU003", name: "Rohan Gupta", email: "rohan.gupta@octocampus.edu", department: "Mechanical", year: 4, hostel: true, attendance: 78, cgpa: 7.6, photo: "/avatars/student3.jpg" },
        { externalId: "STU004", name: "Ananya Iyer", email: "ananya.iyer@octocampus.edu", department: "Computer Science", year: 1, hostel: true, attendance: 95, cgpa: 9.3, photo: "/avatars/student4.jpg" },
        { externalId: "STU005", name: "Neha Verma", email: "neha.verma@octocampus.edu", department: "Information Technology", year: 3, hostel: false, attendance: 88, cgpa: 8.7, photo: "/avatars/student1.jpg" },
        { externalId: "STU006", name: "Rahul Singh", email: "rahul.singh@octocampus.edu", department: "Mechanical", year: 2, hostel: true, attendance: 76, cgpa: 7.2, photo: "/avatars/student2.jpg" },
        { externalId: "STU007", name: "Kavya Nair", email: "kavya.nair@octocampus.edu", department: "Electronics", year: 4, hostel: true, attendance: 98, cgpa: 9.6, photo: "/avatars/student3.jpg" },
        { externalId: "STU008", name: "Aditya Rao", email: "aditya.rao@octocampus.edu", department: "Civil Engineering", year: 1, hostel: false, attendance: 82, cgpa: 8.1, photo: "/avatars/student4.jpg" },
        { externalId: "STU009", name: "Sneha Patil", email: "sneha.patil@octocampus.edu", department: "Computer Science", year: 3, hostel: true, attendance: 91, cgpa: 8.9, photo: "/avatars/student1.jpg" },
    ]

    const createdStudents: Record<string, string> = {} // externalId -> prisma id
    for (const s of studentsData) {
        const userId = createdUsers[s.email]
        const student = await prisma.student.upsert({
            where: { externalId: s.externalId },
            update: {},
            create: {
                externalId: s.externalId,
                name: s.name,
                department: s.department,
                year: s.year,
                hostel: s.hostel,
                attendance: s.attendance,
                cgpa: s.cgpa,
                photo: s.photo,
                userId,
            },
        })
        createdStudents[s.externalId] = student.id
    }
    console.log("✅ Students seeded")

    // ─── TEACHERS ────────────────────────────────────────────────────
    const teachersData = [
        { externalId: "TCH001", name: "Dr. Kavitha Nair", email: "kavitha.nair@octocampus.edu", department: "Computer Science", subject: "Data Structures", experience: 12 },
        { externalId: "TCH002", name: "Prof. Rajesh Kumar", email: "rajesh.kumar@octocampus.edu", department: "Electronics", subject: "Digital Circuits", experience: 18 },
        { externalId: "TCH003", name: "Dr. Sunita Patel", email: "sunita.patel@octocampus.edu", department: "Mechanical", subject: "Thermodynamics", experience: 9 },
        { externalId: "TCH004", name: "Prof. Vikram Rathore", email: "vikram.rathore@octocampus.edu", department: "Civil Engineering", subject: "Structural Analysis", experience: 15 },
        { externalId: "TCH005", name: "Dr. Shreya Ghosh", email: "shreya.ghosh@octocampus.edu", department: "Information Technology", subject: "Web Technologies", experience: 8 },
        { externalId: "TCH006", name: "Dr. Amit Desai", email: "amit.desai@octocampus.edu", department: "Computer Science", subject: "Artificial Intelligence", experience: 14 },
    ]

    for (const t of teachersData) {
        const userId = createdUsers[t.email]
        await prisma.teacher.upsert({
            where: { externalId: t.externalId },
            update: {},
            create: {
                externalId: t.externalId,
                name: t.name,
                department: t.department,
                subject: t.subject,
                experience: t.experience,
                userId,
            },
        })
    }
    console.log("✅ Teachers seeded")

    // ─── ANNOUNCEMENTS ───────────────────────────────────────────────
    const announcementsData = [
        { externalId: "ANN001", title: "Mid-Semester Examinations", content: "Mid-semester exams will commence from March 15th. Detailed schedule will be released next week.", author: "Academic Office", date: "2026-02-24", priority: "high" as const },
        { externalId: "ANN002", title: "Annual Tech Fest Registration", content: "TechnoVerse 2026 registrations are now open. Register through the club portal before March 1st.", author: "Tech Club", date: "2026-02-22", priority: "medium" as const },
        { externalId: "ANN003", title: "Library Extended Hours", content: "The central library will remain open until 11 PM during exam week.", author: "Library Committee", date: "2026-02-20", priority: "low" as const },
        { externalId: "ANN004", title: "Campus Placement Drive", content: "Infosys and TCS placement drives scheduled for March 25th and 28th respectively.", author: "Placement Cell", date: "2026-02-19", priority: "high" as const },
        { externalId: "ANN005", title: "Hostel Fee Deadline", content: "Hostel fee for the next semester must be paid before April 10th to avoid late charges.", author: "Hostel Administration", date: "2026-02-18", priority: "medium" as const },
        { externalId: "ANN006", title: "Hackathon Guidelines Published", content: "The official rulebook and problem statements for the upcoming OctoHack are now live on the portal.", author: "Innovation Council", date: "2026-03-01", priority: "high" as const },
        { externalId: "ANN007", title: "Maintenance: Network Outage", content: "Scheduled network maintenance will cause internet downtime in the Aryabhata block from 2 AM to 4 AM on Sunday.", author: "IT Department", date: "2026-03-02", priority: "low" as const },
        { externalId: "ANN008", title: "Guest Lecture: AI in 2026", content: "Join us for an exclusive talk by Dr. Andrew Ng on the future of generative AI in software engineering.", author: "Computer Science Dept", date: "2026-03-05", priority: "medium" as const },
        { externalId: "ANN009", title: "Blood Donation Drive", content: "NSS is organizing a blood donation camp in the main auditorium this Thursday. All healthy students are encouraged to participate.", author: "NSS Club", date: "2026-03-08", priority: "medium" as const },
        { externalId: "ANN010", title: "Strict Anti-Ragging Policy Reminder", content: "A reminder that the campus maintains a zero-tolerance policy against ragging. Any violations will result in immediate suspension.", author: "Disciplinary Committee", date: "2026-03-10", priority: "high" as const },
    ]
    for (const a of announcementsData) {
        await prisma.announcement.upsert({ where: { externalId: a.externalId }, update: {}, create: a })
    }
    console.log("✅ Announcements seeded")

    // ─── EVENTS ──────────────────────────────────────────────────────
    const eventsData = [
        { externalId: "EVT001", title: "TechnoVerse 2026", club: "Tech", date: "2026-03-10", description: "Annual technical festival with coding contests, hackathons, and workshops.", status: "upcoming" as const, registrations: 245 },
        { externalId: "EVT002", title: "Rhythm Night", club: "Music", date: "2026-03-05", description: "Live music performance featuring student bands and solo artists.", status: "upcoming" as const, registrations: 180 },
        { externalId: "EVT003", title: "Startup Pitch Day", club: "Entrepreneurship", date: "2026-03-15", description: "Student startups present their ideas to a panel of industry mentors.", status: "upcoming" as const, registrations: 60 },
        { externalId: "EVT004", title: "Inter-College Cricket", club: "Sports", date: "2026-02-15", description: "Annual inter-college cricket tournament finals.", status: "past" as const, registrations: 120 },
        { externalId: "EVT005", title: "Poetry Slam", club: "Literature", date: "2026-02-10", description: "Open mic poetry slam with special guest judges from the literary world.", status: "past" as const, registrations: 75 },
        { externalId: "EVT006", title: "Cultural Night", club: "Culture", date: "2026-03-20", description: "A grand celebration of art, dance, drama, and cultural performances.", status: "upcoming" as const, registrations: 300 },
        { externalId: "EVT007", title: "OctoHack 2026", club: "Tech", date: "2026-04-05", description: "48-hour national level hackathon expecting 500+ participants.", status: "upcoming" as const, registrations: 412 },
        { externalId: "EVT008", title: "Annual Sports Meet", club: "Sports", date: "2026-03-25", description: "Track and field events, relay races, and marathon.", status: "upcoming" as const, registrations: 250 },
        { externalId: "EVT009", title: "Drama Auditions", club: "Culture", date: "2026-02-05", description: "Auditions for the annual theater production 'Macbeth'.", status: "past" as const, registrations: 85 },
        { externalId: "EVT010", title: "Investor Mixer", club: "Entrepreneurship", date: "2026-04-12", description: "Networking session with angel investors for student founders.", status: "upcoming" as const, registrations: 110 },
    ]
    for (const e of eventsData) {
        await prisma.event.upsert({ where: { externalId: e.externalId }, update: {}, create: e })
    }
    console.log("✅ Events seeded")

    // ─── REQUESTS ────────────────────────────────────────────────────
    const requestsData = [
        { externalId: "REQ001", type: "Leave Request", fromName: "Arjun Mehta (STU001)", date: "2026-02-24", reason: "Family function in hometown", status: "pending" as const },
        { externalId: "REQ002", type: "Event Approval", fromName: "Tech Club", date: "2026-02-23", reason: "Permission to conduct hackathon in Seminar Hall on March 10", status: "pending" as const },
        { externalId: "REQ003", type: "Budget Request", fromName: "Sports Club", date: "2026-02-22", reason: "Equipment purchase for upcoming inter-college tournament", status: "approved" as const },
        { externalId: "REQ004", type: "Facility Booking", fromName: "Music Club", date: "2026-02-21", reason: "Auditorium booking for Rhythm Night rehearsal", status: "pending" as const },
        { externalId: "REQ005", type: "Club Registration", fromName: "Photography Club", date: "2026-02-25", reason: "Creating a new photography and media club on campus", status: "pending" as const },
        { externalId: "REQ006", type: "Leave Request", fromName: "Priya Sharma (STU002)", date: "2026-02-26", reason: "Medical leave due to viral fever", status: "approved" as const },
        { externalId: "REQ007", type: "Facility Booking", fromName: "Literature Club", date: "2026-02-27", reason: "Booking the library reading room for poetry slam", status: "rejected" as const },
        { externalId: "REQ008", type: "Budget Request", fromName: "Tech Club", date: "2026-02-28", reason: "Server hosting costs for OctoHack 2026", status: "pending" as const },
    ]
    for (const r of requestsData) {
        await prisma.request.upsert({ where: { externalId: r.externalId }, update: {}, create: r })
    }
    console.log("✅ Requests seeded")

    // ─── FEES ────────────────────────────────────────────────────────
    // Assign fees to the default student user
    const studentUserId = createdUsers["student@oc-2-day.edu"]
    const feesData = [
        { externalId: "FEE001", type: "Tuition Fee", amount: 75000, dueDate: "2026-03-15", status: "pending" as const },
        { externalId: "FEE002", type: "Hostel Fee", amount: 45000, dueDate: "2026-04-10", status: "pending" as const },
        { externalId: "FEE003", type: "Exam Fee", amount: 5000, dueDate: "2026-03-01", status: "paid" as const },
        { externalId: "FEE004", type: "Library Fee", amount: 2000, dueDate: "2026-02-28", status: "paid" as const },
        { externalId: "FEE005", type: "Mess Fee", amount: 18000, dueDate: "2026-03-20", status: "pending" as const },
        { externalId: "FEE006", type: "Lab Equipment Fee", amount: 3500, dueDate: "2026-04-15", status: "pending" as const },
        { externalId: "FEE007", type: "Sports Subscription", amount: 1500, dueDate: "2026-02-10", status: "paid" as const },
        { externalId: "FEE008", type: "Alumni Association", amount: 1000, dueDate: "2026-05-01", status: "pending" as const },
    ]
    for (const f of feesData) {
        await prisma.fee.upsert({
            where: { externalId: f.externalId },
            update: {},
            create: { ...f, userId: studentUserId },
        })
    }
    console.log("✅ Fees seeded")

    // ─── MARKS ───────────────────────────────────────────────────────
    // Assign marks to default student (STU001)
    const stu001Id = createdStudents["STU001"]
    const marksData = [
        { subject: "Data Structures", internal1: 42, internal2: 45, assignment: 18, total: 82, grade: "A" },
        { subject: "Operating Systems", internal1: 38, internal2: 40, assignment: 17, total: 75, grade: "A-" },
        { subject: "DBMS", internal1: 44, internal2: 46, assignment: 19, total: 88, grade: "A+" },
        { subject: "Computer Networks", internal1: 35, internal2: 37, assignment: 15, total: 68, grade: "B+" },
        { subject: "Mathematics III", internal1: 40, internal2: 42, assignment: 16, total: 78, grade: "A" },
    ]
    // Delete existing marks for this student and re-seed (cleaner approach)
    await prisma.mark.deleteMany({ where: { studentId: stu001Id } })
    await prisma.mark.createMany({
        data: marksData.map((m) => ({ ...m, studentId: stu001Id })),
    })
    console.log("✅ Marks seeded")

    // ─── ATTENDANCE RECORDS ──────────────────────────────────────────
    const attendanceData = [
        { date: "2026-02-20", subject: "Data Structures", status: "present" as const },
        { date: "2026-02-20", subject: "Operating Systems", status: "present" as const },
        { date: "2026-02-20", subject: "DBMS Lab", status: "present" as const },
        { date: "2026-02-21", subject: "Mathematics III", status: "absent" as const },
        { date: "2026-02-21", subject: "Computer Networks", status: "present" as const },
        { date: "2026-02-22", subject: "DBMS", status: "present" as const },
        { date: "2026-02-22", subject: "Data Structures", status: "present" as const },
        { date: "2026-02-23", subject: "Computer Networks", status: "present" as const },
        { date: "2026-02-23", subject: "Mathematics III", status: "present" as const },
        { date: "2026-02-24", subject: "Data Structures", status: "present" as const },
        { date: "2026-02-24", subject: "DBMS", status: "present" as const },
        { date: "2026-02-24", subject: "Mathematics III", status: "present" as const },
        { date: "2026-02-25", subject: "Data Structures", status: "present" as const },
        { date: "2026-02-25", subject: "DBMS", status: "absent" as const },
        { date: "2026-02-25", subject: "Computer Networks", status: "present" as const },
        { date: "2026-02-26", subject: "Mathematics III", status: "present" as const },
        { date: "2026-02-26", subject: "Data Structures", status: "present" as const },
    ]
    await prisma.attendanceRecord.deleteMany({ where: { studentId: stu001Id } })
    await prisma.attendanceRecord.createMany({
        data: attendanceData.map((a) => ({ ...a, studentId: stu001Id })),
    })
    console.log("✅ Attendance records seeded")

    // ─── CLUBS ───────────────────────────────────────────────────────
    const clubsData = [
        { externalId: "CLB001", name: "Tech", accent: "#dc2626", members: 120, description: "Innovation, coding, and all things technology." },
        { externalId: "CLB002", name: "Culture", accent: "#b91c1c", members: 95, description: "Celebrating art, dance, drama, and heritage." },
        { externalId: "CLB003", name: "Sports", accent: "#ef4444", members: 150, description: "Fostering sportsmanship and athletic excellence." },
        { externalId: "CLB004", name: "Music", accent: "#991b1b", members: 80, description: "Melodies, rhythms, and musical expression." },
        { externalId: "CLB005", name: "Literature", accent: "#e11d48", members: 60, description: "Words, stories, and the power of expression." },
        { externalId: "CLB006", name: "Entrepreneurship", accent: "#9f1239", members: 70, description: "Building ideas into reality." },
    ]
    for (const c of clubsData) {
        await prisma.club.upsert({ where: { externalId: c.externalId }, update: {}, create: c })
    }
    console.log("✅ Clubs seeded")

    // ─── NOTIFICATIONS ───────────────────────────────────────────────
    const adminUserId = createdUsers["admin@oc-2-day.edu"]
    const notificationsData = [
        { externalId: "NTF001", title: "New Announcement", message: "Mid-semester exam schedule released", time: "5 min ago", read: false },
        { externalId: "NTF002", title: "Event Update", message: "TechnoVerse registration deadline extended", time: "1 hour ago", read: false },
        { externalId: "NTF003", title: "Fee Reminder", message: "Library fee payment due tomorrow", time: "3 hours ago", read: true },
        { externalId: "NTF004", title: "Attendance Alert", message: "Your attendance in CN dropped below 80%", time: "Yesterday", read: true },
        { externalId: "NTF005", title: "Request Approved", message: "Your budget request for Sports Club was approved", time: "2 hours ago", read: false },
        { externalId: "NTF006", title: "Mark Updated", message: "New marks uploaded for Data Structures", time: "4 hours ago", read: false },
        { externalId: "NTF007", title: "System Alert", message: "Portal maintenance scheduled for tonight at 2 AM", time: "1 day ago", read: true },
        { externalId: "NTF008", title: "New Message", message: "Dr. Kavitha Nair sent you a message regarding your assignment", time: "2 days ago", read: true },
    ]
    for (const n of notificationsData) {
        await prisma.notification.upsert({
            where: { externalId: n.externalId },
            update: {},
            create: { ...n, userId: adminUserId },
        })
    }
    console.log("✅ Notifications seeded")

    // ─── TIMETABLE ───────────────────────────────────────────────────
    const timetableData = [
        { role: "student", day: "Monday", slots: [{ subject: "Data Structures", room: "CS-101" }, { subject: "Operating Systems", room: "CS-102" }, { subject: "Break", room: "" }, { subject: "DBMS Lab", room: "Lab-3" }, { subject: "Elective", room: "LH-4" }] },
        { role: "student", day: "Tuesday", slots: [{ subject: "Mathematics III", room: "LH-1" }, { subject: "Computer Networks", room: "CS-201" }, { subject: "Break", room: "" }, { subject: "OS Lab", room: "Lab-2" }, { subject: "Library", room: "Lib-1" }] },
        { role: "student", day: "Wednesday", slots: [{ subject: "DBMS", room: "CS-105" }, { subject: "Data Structures", room: "CS-101" }, { subject: "Break", room: "" }, { subject: "Elective", room: "LH-4" }, { subject: "Sports", room: "Ground" }] },
        { role: "student", day: "Thursday", slots: [{ subject: "Computer Networks", room: "CS-201" }, { subject: "Mathematics III", room: "LH-1" }, { subject: "Break", room: "" }, { subject: "CN Lab", room: "Lab-1" }, { subject: "Seminar", room: "Auditorium" }] },
        { role: "student", day: "Friday", slots: [{ subject: "Data Structures", room: "CS-101" }, { subject: "DBMS", room: "CS-105" }, { subject: "Break", room: "" }, { subject: "Project Work", room: "Lab-4" }, { subject: "Mentoring", room: "Room-402" }] },
        { role: "teacher", day: "Monday", slots: [{ subject: "Data Structures", room: "CS-101" }, { subject: "Data Structures", room: "CS-102" }, { subject: "Break", room: "" }, { subject: "Lab Supervision", room: "Lab-3" }, { subject: "Free", room: "" }] },
        { role: "teacher", day: "Tuesday", slots: [{ subject: "Free", room: "" }, { subject: "Data Structures", room: "CS-201" }, { subject: "Break", room: "" }, { subject: "Lab Supervision", room: "Lab-2" }, { subject: "Free", room: "" }] },
        { role: "teacher", day: "Wednesday", slots: [{ subject: "Data Structures", room: "CS-105" }, { subject: "Free", room: "" }, { subject: "Break", room: "" }, { subject: "Free", room: "" }, { subject: "Free", room: "" }] },
        { role: "teacher", day: "Thursday", slots: [{ subject: "Data Structures", room: "CS-201" }, { subject: "Free", room: "" }, { subject: "Break", room: "" }, { subject: "Lab Supervision", room: "Lab-1" }, { subject: "Free", room: "" }] },
        { role: "teacher", day: "Friday", slots: [{ subject: "Data Structures", room: "CS-101" }, { subject: "Free", room: "" }, { subject: "Break", room: "" }, { subject: "Project Guidance", room: "Lab-4" }, { subject: "Free", room: "" }] },
    ]
    for (const t of timetableData) {
        await prisma.timetable.upsert({
            where: { role_day: { role: t.role, day: t.day } },
            update: { slots: JSON.stringify(t.slots) },
            create: { role: t.role, day: t.day, slots: JSON.stringify(t.slots) },
        })
    }
    console.log("✅ Timetable seeded")

    console.log("\n🎉 Database seeded successfully!")
    console.log("\n📋 Demo Login Credentials:")
    console.log("  Admin:   admin@oc-2-day.edu   / admin@2026")
    console.log("  Teacher: teacher@oc-2-day.edu / teach@2026")
    console.log("  Student: student@oc-2-day.edu / stud@2026")
    console.log("  Parent:  parent@oc-2-day.edu  / parent@2026")
    console.log("  Club:    club@oc-2-day.edu    / club@2026")
}

main()
    .then(async () => { await prisma.$disconnect() })
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
