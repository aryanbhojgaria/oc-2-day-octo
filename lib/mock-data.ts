// ========== STUDENTS ==========
export const students = [
  {
    id: "STU001",
    name: "Arjun Mehta",
    email: "arjun.mehta@octocampus.edu",
    department: "Computer Science",
    year: 3,
    hostel: true,
    attendance: 87,
    cgpa: 8.4,
    photo: "/avatars/student1.jpg",
  },
  {
    id: "STU002",
    name: "Priya Sharma",
    email: "priya.sharma@octocampus.edu",
    department: "Electronics",
    year: 2,
    hostel: false,
    attendance: 92,
    cgpa: 9.1,
    photo: "/avatars/student2.jpg",
  },
  {
    id: "STU003",
    name: "Rohan Gupta",
    email: "rohan.gupta@octocampus.edu",
    department: "Mechanical",
    year: 4,
    hostel: true,
    attendance: 78,
    cgpa: 7.6,
    photo: "/avatars/student3.jpg",
  },
  {
    id: "STU004",
    name: "Ananya Iyer",
    email: "ananya.iyer@octocampus.edu",
    department: "Computer Science",
    year: 1,
    hostel: true,
    attendance: 95,
    cgpa: 9.3,
    photo: "/avatars/student4.jpg",
  },
]

// ========== TEACHERS ==========
export const teachers = [
  {
    id: "TCH001",
    name: "Dr. Kavitha Nair",
    email: "kavitha.nair@octocampus.edu",
    department: "Computer Science",
    subject: "Data Structures",
    experience: 12,
  },
  {
    id: "TCH002",
    name: "Prof. Rajesh Kumar",
    email: "rajesh.kumar@octocampus.edu",
    department: "Electronics",
    subject: "Digital Circuits",
    experience: 18,
  },
  {
    id: "TCH003",
    name: "Dr. Sunita Patel",
    email: "sunita.patel@octocampus.edu",
    department: "Mechanical",
    subject: "Thermodynamics",
    experience: 9,
  },
]

// ========== TIMETABLE ==========
export const timetable = [
  { day: "Monday", role: "student", slots: [{ subject: "Data Structures", room: "CS-101" }, { subject: "Operating Systems", room: "CS-102" }, { subject: "Break", room: "" }, { subject: "DBMS Lab", room: "Lab-3" }, { subject: "Elective", room: "LH-4" }] },
  { day: "Tuesday", role: "student", slots: [{ subject: "Mathematics III", room: "LH-1" }, { subject: "Computer Networks", room: "CS-201" }, { subject: "Break", room: "" }, { subject: "OS Lab", room: "Lab-2" }, { subject: "Library", room: "Lib-1" }] },
  { day: "Wednesday", role: "student", slots: [{ subject: "DBMS", room: "CS-105" }, { subject: "Data Structures", room: "CS-101" }, { subject: "Break", room: "" }, { subject: "Elective", room: "LH-4" }, { subject: "Sports", room: "Ground" }] },
  { day: "Thursday", role: "student", slots: [{ subject: "Computer Networks", room: "CS-201" }, { subject: "Mathematics III", room: "LH-1" }, { subject: "Break", room: "" }, { subject: "CN Lab", room: "Lab-1" }, { subject: "Seminar", room: "Audi" }] },
  { day: "Friday", role: "student", slots: [{ subject: "Data Structures", room: "CS-101" }, { subject: "DBMS", room: "CS-105" }, { subject: "Break", room: "" }, { subject: "Project Work", room: "Lab-4" }, { subject: "Mentoring", room: "R-402" }] },
  { day: "Monday", role: "teacher", slots: [{ subject: "Data Structures", room: "CS-101" }, { subject: "Data Structures", room: "CS-102" }, { subject: "Break", room: "" }, { subject: "Lab Supervision", room: "Lab-3" }, { subject: "Free", room: "" }] },
  { day: "Tuesday", role: "teacher", slots: [{ subject: "Free", room: "" }, { subject: "Data Structures", room: "CS-201" }, { subject: "Break", room: "" }, { subject: "Lab Supervision", room: "Lab-2" }, { subject: "Free", room: "" }] },
  { day: "Wednesday", role: "teacher", slots: [{ subject: "Data Structures", room: "CS-105" }, { subject: "Free", room: "" }, { subject: "Break", room: "" }, { subject: "Free", room: "" }, { subject: "Free", room: "" }] },
  { day: "Thursday", role: "teacher", slots: [{ subject: "Data Structures", room: "CS-201" }, { subject: "Free", room: "" }, { subject: "Break", room: "" }, { subject: "Lab Supervision", room: "Lab-1" }, { subject: "Free", room: "" }] },
  { day: "Friday", role: "teacher", slots: [{ subject: "Data Structures", room: "CS-101" }, { subject: "Free", room: "" }, { subject: "Break", room: "" }, { subject: "Project Guidance", room: "Lab-4" }, { subject: "Free", room: "" }] },
]

// ========== MARKS ==========
export const marks = [
  { subject: "Data Structures", internal1: 42, internal2: 45, assignment: 18, total: 82, grade: "A" },
  { subject: "Operating Systems", internal1: 38, internal2: 40, assignment: 17, total: 75, grade: "A-" },
  { subject: "DBMS", internal1: 44, internal2: 46, assignment: 19, total: 88, grade: "A+" },
  { subject: "Computer Networks", internal1: 35, internal2: 37, assignment: 15, total: 68, grade: "B+" },
  { subject: "Mathematics III", internal1: 40, internal2: 42, assignment: 16, total: 78, grade: "A" },
]

// ========== ATTENDANCE RECORDS ==========
export const attendanceRecords = [
  { date: "2026-02-20", subject: "Data Structures", status: "present" },
  { date: "2026-02-20", subject: "Operating Systems", status: "present" },
  { date: "2026-02-20", subject: "DBMS Lab", status: "present" },
  { date: "2026-02-21", subject: "Mathematics III", status: "absent" },
  { date: "2026-02-21", subject: "Computer Networks", status: "present" },
  { date: "2026-02-22", subject: "DBMS", status: "present" },
  { date: "2026-02-22", subject: "Data Structures", status: "present" },
  { date: "2026-02-23", subject: "Computer Networks", status: "present" },
  { date: "2026-02-23", subject: "Mathematics III", status: "present" },
  { date: "2026-02-24", subject: "Data Structures", status: "present" },
  { date: "2026-02-24", subject: "DBMS", status: "present" },
]

// ========== 15-DAY HISTORICAL ATTENDANCE ==========
export const past15Days = Array.from({ length: 15 }, (_, i) => {
  const d = new Date()
  d.setDate(d.getDate() - (15 - i))
  return d.toISOString().split('T')[0]
})

export const studentHistoricalAttendance: Record<string, boolean[]> = {
  "STU001": [true, true, false, true, true, true, true, false, true, true, true, true, true, true, true],
  "STU002": [true, true, true, true, true, true, false, true, true, true, true, true, false, true, true],
  "STU003": [false, true, true, false, true, true, true, true, false, true, true, true, true, true, false],
  "STU004": [true, true, true, true, true, true, true, true, true, true, true, false, true, true, true],
}

// ========== ANNOUNCEMENTS ==========
export const announcements = [
  {
    id: "ANN001",
    title: "Mid-Semester Examinations",
    content: "Mid-semester exams will commence from March 15th. Detailed schedule will be released next week.",
    author: "Academic Office",
    date: "2026-02-24",
    priority: "high",
  },
  {
    id: "ANN002",
    title: "Annual Tech Fest Registration",
    content: "TechnoVerse 2026 registrations are now open. Register through the club portal before March 1st.",
    author: "Tech Club",
    date: "2026-02-22",
    priority: "medium",
  },
  {
    id: "ANN003",
    title: "Library Extended Hours",
    content: "The central library will remain open until 11 PM during exam week.",
    author: "Library Committee",
    date: "2026-02-20",
    priority: "low",
  },
  {
    id: "ANN004",
    title: "Campus Placement Drive",
    content: "Infosys and TCS placement drives scheduled for March 25th and 28th respectively.",
    author: "Placement Cell",
    date: "2026-02-19",
    priority: "high",
  },
  {
    id: "ANN005",
    title: "Hostel Fee Deadline",
    content: "Hostel fee for the next semester must be paid before April 10th to avoid late charges.",
    author: "Hostel Administration",
    date: "2026-02-18",
    priority: "medium",
  },
]

// ========== EVENTS ==========
export const events = [
  {
    id: "EVT001",
    title: "TechnoVerse 2026",
    club: "Tech",
    date: "2026-03-10",
    description: "Annual technical festival with coding contests, hackathons, and workshops.",
    status: "upcoming",
    registrations: 245,
  },
  {
    id: "EVT002",
    title: "Rhythm Night",
    club: "Music",
    date: "2026-03-05",
    description: "Live music performance featuring student bands and solo artists.",
    status: "upcoming",
    registrations: 180,
  },
  {
    id: "EVT003",
    title: "Startup Pitch Day",
    club: "Entrepreneurship",
    date: "2026-03-15",
    description: "Student startups present their ideas to a panel of industry mentors.",
    status: "upcoming",
    registrations: 60,
  },
  {
    id: "EVT004",
    title: "Inter-College Cricket",
    club: "Sports",
    date: "2026-02-15",
    description: "Annual inter-college cricket tournament finals.",
    status: "past",
    registrations: 120,
  },
  {
    id: "EVT005",
    title: "Poetry Slam",
    club: "Literature",
    date: "2026-02-10",
    description: "Open mic poetry slam with special guest judges from the literary world.",
    status: "past",
    registrations: 75,
  },
  {
    id: "EVT006",
    title: "Cultural Night",
    club: "Culture",
    date: "2026-03-20",
    description: "A grand celebration of art, dance, drama, and cultural performances.",
    status: "upcoming",
    registrations: 300,
  },
]

// ========== REQUESTS ==========
export const requests = [
  {
    id: "REQ001",
    type: "Leave Request",
    from: "Arjun Mehta (STU001)",
    date: "2026-02-24",
    reason: "Family function in hometown",
    status: "pending",
  },
  {
    id: "REQ002",
    type: "Event Approval",
    from: "Tech Club",
    date: "2026-02-23",
    reason: "Permission to conduct hackathon in Seminar Hall on March 10",
    status: "pending",
  },
  {
    id: "REQ003",
    type: "Budget Request",
    from: "Sports Club",
    date: "2026-02-22",
    reason: "Equipment purchase for upcoming inter-college tournament",
    status: "approved",
  },
  {
    id: "REQ004",
    type: "Facility Booking",
    from: "Music Club",
    date: "2026-02-21",
    reason: "Auditorium booking for Rhythm Night rehearsal",
    status: "pending",
  },
]

// ========== MESS MENU ==========
export const messMenu = [
  { day: "Monday", breakfast: "Idli, Sambar, Chutney", lunch: "Rice, Dal, Paneer Butter Masala", dinner: "Chapati, Mixed Veg, Raita" },
  { day: "Tuesday", breakfast: "Poha, Boiled Eggs, Tea", lunch: "Rice, Rajma, Aloo Gobi", dinner: "Paratha, Chole, Salad" },
  { day: "Wednesday", breakfast: "Dosa, Coconut Chutney", lunch: "Rice, Sambar, Cabbage Fry", dinner: "Chapati, Dal Makhani, Pulao" },
  { day: "Thursday", breakfast: "Upma, Vada, Coffee", lunch: "Biryani, Raita, Boiled Egg", dinner: "Roti, Palak Paneer, Rice" },
  { day: "Friday", breakfast: "Paratha, Curd, Pickle", lunch: "Rice, Fish Curry, Beans Poriyal", dinner: "Chapati, Egg Curry, Salad" },
  { day: "Saturday", breakfast: "Puri, Bhaji, Banana", lunch: "Lemon Rice, Papad, Curd", dinner: "Fried Rice, Gobi Manchurian" },
  { day: "Sunday", breakfast: "Chole Bhature, Lassi", lunch: "Special Biryani, Ice Cream", dinner: "Chapati, Kadai Paneer, Kheer" },
]

// ========== MESS MENU EXTENDED ==========
export const messMenuExtended = [
  { day: "Monday", breakfast: "Idli, Sambar, Chutney", lunch: "Rice, Dal, Paneer Butter Masala", snacks: "Samosa, Tea", dinner: "Chapati, Mixed Veg, Raita" },
  { day: "Tuesday", breakfast: "Poha, Boiled Eggs, Tea", lunch: "Rice, Rajma, Aloo Gobi", snacks: "Bread Pakora, Coffee", dinner: "Paratha, Chole, Salad" },
  { day: "Wednesday", breakfast: "Dosa, Coconut Chutney", lunch: "Rice, Sambar, Cabbage Fry", snacks: "Vada Pav, Juice", dinner: "Chapati, Dal Makhani, Pulao" },
  { day: "Thursday", breakfast: "Upma, Vada, Coffee", lunch: "Biryani, Raita, Boiled Egg", snacks: "Cutlet, Tea", dinner: "Roti, Palak Paneer, Rice" },
  { day: "Friday", breakfast: "Paratha, Curd, Pickle", lunch: "Rice, Fish Curry, Beans Poriyal", snacks: "Pani Puri, Lassi", dinner: "Chapati, Egg Curry, Salad" },
  { day: "Saturday", breakfast: "Puri, Bhaji, Banana", lunch: "Lemon Rice, Papad, Curd", snacks: "Maggi, Milkshake", dinner: "Fried Rice, Gobi Manchurian" },
  { day: "Sunday", breakfast: "Chole Bhature, Lassi", lunch: "Special Biryani, Ice Cream", snacks: "Pizza Slice, Cold Drink", dinner: "Chapati, Kadai Paneer, Kheer" },
]

// ========== WARDEN NOTICES ==========
export const wardenNotices = [
  { id: "WN001", title: "Hostel Curfew Timings", content: "All students must return to hostel by 10 PM on weekdays and 11 PM on weekends.", date: "2026-02-25" },
  { id: "WN002", title: "Room Inspection", content: "Room inspection scheduled for March 1st. Keep rooms clean and organized.", date: "2026-02-23" },
  { id: "WN003", title: "Water Supply", content: "Water supply will be interrupted on Feb 28th between 10 AM - 2 PM due to maintenance.", date: "2026-02-22" },
]

// ========== FEE DATA ==========
export const fees = [
  { id: "FEE001", type: "Tuition Fee", amount: 75000, dueDate: "2026-03-15", status: "pending" },
  { id: "FEE002", type: "Hostel Fee", amount: 45000, dueDate: "2026-04-10", status: "pending" },
  { id: "FEE003", type: "Exam Fee", amount: 5000, dueDate: "2026-03-01", status: "paid" },
  { id: "FEE004", type: "Library Fee", amount: 2000, dueDate: "2026-02-28", status: "paid" },
]

// ========== CLUBS ==========
export const clubs = [
  { id: "CLB001", name: "Tech", accent: "#dc2626", members: 120, description: "Innovation, coding, and all things technology." },
  { id: "CLB002", name: "Culture", accent: "#b91c1c", members: 95, description: "Celebrating art, dance, drama, and heritage." },
  { id: "CLB003", name: "Sports", accent: "#ef4444", members: 150, description: "Fostering sportsmanship and athletic excellence." },
  { id: "CLB004", name: "Music", accent: "#991b1b", members: 80, description: "Melodies, rhythms, and musical expression." },
  { id: "CLB005", name: "Literature", accent: "#e11d48", members: 60, description: "Words, stories, and the power of expression." },
  { id: "CLB006", name: "Entrepreneurship", accent: "#9f1239", members: 70, description: "Building ideas into reality." },
]

// ========== NOTIFICATIONS ==========
export const notifications = [
  { id: "NTF001", title: "New Announcement", message: "Mid-semester exam schedule released", time: "5 min ago", read: false },
  { id: "NTF002", title: "Event Update", message: "TechnoVerse registration deadline extended", time: "1 hour ago", read: false },
  { id: "NTF003", title: "Fee Reminder", message: "Library fee payment due tomorrow", time: "3 hours ago", read: true },
  { id: "NTF004", title: "Attendance Alert", message: "Your attendance in CN dropped below 80%", time: "Yesterday", read: true },
]

// ========== STATS ==========
export const adminStats = {
  totalStudents: 2450,
  totalTeachers: 185,
  totalDepartments: 12,
  activeClubs: 6,
  pendingRequests: 3,
  upcomingEvents: 4,
}

// ========== ANALYTICS ==========
export const enrollmentTrend = [
  { month: "Sep", students: 2180 },
  { month: "Oct", students: 2220 },
  { month: "Nov", students: 2290 },
  { month: "Dec", students: 2310 },
  { month: "Jan", students: 2380 },
  { month: "Feb", students: 2450 },
]

export const departmentDistribution = [
  { department: "CSE", students: 480 },
  { department: "ECE", students: 360 },
  { department: "Mech", students: 310 },
  { department: "Civil", students: 250 },
  { department: "EEE", students: 220 },
  { department: "IT", students: 200 },
  { department: "Chem", students: 180 },
  { department: "Bio", students: 150 },
]

export const attendanceTrend = [
  { week: "W1", percentage: 82 },
  { week: "W2", percentage: 78 },
  { week: "W3", percentage: 85 },
  { week: "W4", percentage: 88 },
  { week: "W5", percentage: 84 },
  { week: "W6", percentage: 90 },
  { week: "W7", percentage: 87 },
  { week: "W8", percentage: 91 },
]

export const studentTimetable = [
  { day: "Monday", slots: [{ subject: "Data Structures", room: "CS-101" }, { subject: "Operating Systems", room: "CS-102" }, { subject: "Break", room: "" }, { subject: "DBMS Lab", room: "Lab-3" }, { subject: "Elective", room: "LH-4" }] },
  { day: "Tuesday", slots: [{ subject: "Mathematics III", room: "LH-1" }, { subject: "Computer Networks", room: "CS-201" }, { subject: "Break", room: "" }, { subject: "OS Lab", room: "Lab-2" }, { subject: "Library", room: "Lib-1" }] },
  { day: "Wednesday", slots: [{ subject: "DBMS", room: "CS-105" }, { subject: "Data Structures", room: "CS-101" }, { subject: "Break", room: "" }, { subject: "Elective", room: "LH-4" }, { subject: "Sports", room: "Ground" }] },
  { day: "Thursday", slots: [{ subject: "Computer Networks", room: "CS-201" }, { subject: "Mathematics III", room: "LH-1" }, { subject: "Break", room: "" }, { subject: "CN Lab", room: "Lab-1" }, { subject: "Seminar", room: "Auditorium" }] },
  { day: "Friday", slots: [{ subject: "Data Structures", room: "CS-101" }, { subject: "DBMS", room: "CS-105" }, { subject: "Break", room: "" }, { subject: "Project Work", room: "Lab-4" }, { subject: "Mentoring", room: "Room-402" }] },
]
