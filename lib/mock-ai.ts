/**
 * Simulated AI Engine for Hackathon Prototypes
 * Realistic frontend typing intervals and contextual responses without API keys.
 */

// Simulated typing delay utility
export const simulateTyping = (text: string, onUpdate: (current: string) => void): Promise<void> => {
    return new Promise((resolve) => {
        let i = 0
        const typeChar = () => {
            onUpdate(text.substring(0, i))
            if (i < text.length) {
                i++
                // Randomize typing speed for realism (20ms - 60ms)
                setTimeout(typeChar, Math.floor(Math.random() * 40) + 20)
            } else {
                resolve()
            }
        }
        typeChar()
    })
}

// 1. OctoBot: Universal Contextual Assistant Responses
export const getOctobotResponse = async (message: string, contextRole: string): Promise<string> => {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 600))

    const lowerMsg = message.toLowerCase()

    // Generic Greetings
    if (lowerMsg.match(/\b(hi|hello|hey)\b/)) {
        return `Hello there! I'm OctoBot 🐙. I'm here to help you navigate your ${contextRole} portal.`
    }

    // Student Context
    if (contextRole.toLowerCase() === 'student') {
        if (lowerMsg.includes('marks') || lowerMsg.includes('grades') || lowerMsg.includes('score')) {
            return "Based on your latest records, you're currently securing an A+ in DBMS, but your Computer Networks grade (68/100) needs attention. I recommend reviewing your Module 4 notes."
        }
        if (lowerMsg.includes('timetable') || lowerMsg.includes('class') || lowerMsg.includes('schedule')) {
            return "You have 'Mathematics III' today at 9:00 AM in Room 301, followed by a 'Data Structures Lab' at 11:15 AM."
        }
        if (lowerMsg.includes('hostel') || lowerMsg.includes('mess') || lowerMsg.includes('food')) {
            return "Today's lunch at the Aryabhata Hostel Mess is Rajma Chawal with Mix Veg. Dinner will be served at 7:30 PM."
        }
    }

    // Admin Context
    if (contextRole.toLowerCase() === 'admin') {
        if (lowerMsg.includes('request') || lowerMsg.includes('pending') || lowerMsg.includes('approve')) {
            return "You currently have 3 pending requests, including an urgent leave request from Arjun Mehta and an event approval for the 'Tech Club'. You can manage these in the Requests tab."
        }
        if (lowerMsg.includes('student') || lowerMsg.includes('enrollment')) {
            return "Total enrollment stands at 3,240 students across 8 departments. The Computer Science department has seen a 12% increase this semester."
        }
    }

    // Parent Context
    if (contextRole.toLowerCase() === 'parent') {
        if (lowerMsg.includes('fee') || lowerMsg.includes('pay') || lowerMsg.includes('due')) {
            return "Currently, there is a pending Tuition Fee of Rs. 75,000 due on March 15th, and a Hostel Fee of Rs. 45,000 due on April 10th."
        }
        if (lowerMsg.includes('performance') || lowerMsg.includes('attendance')) {
            return "Your ward Arjun's attendance is excellent at 87%. His academic performance is strong with a current CGPA of 8.4."
        }
    }

    // Default fallback
    return `I'm your intelligent campus assistant. You can ask me about your schedules, pending tasks, relevant data points, or general platform help!`
}

// 2. AI Magic Writer: Expand short shorthand into formal announcements
export const triggerMagicWriter = async (shorthand: string): Promise<string> => {
    await new Promise(r => setTimeout(r, 1200)) // "Thinking" delay

    const lowerMsg = shorthand.toLowerCase()

    if (lowerMsg.includes('sport') || lowerMsg.includes('game')) {
        return "Attention all students and faculty. We are thrilled to announce that the Annual Sports Week will commence next week. All students are encouraged to participate and register for their respective events through the Club Portal. Let the games begin!"
    }
    if (lowerMsg.includes('holiday') || lowerMsg.includes('leave') || lowerMsg.includes('close')) {
        return "Please be informed that the campus will remain closed tomorrow in observance of the upcoming public holiday. All regular classes and academic activities stand suspended. The campus will resume normal operations the following day."
    }
    if (lowerMsg.includes('exam') || lowerMsg.includes('test')) {
        return "Important Reminder: The mid-semester examinations are scheduled to begin shortly. The detailed timetable and seating arrangements will be published on your respective portals by tomorrow evening. We wish all students the very best!"
    }

    // Generic expansion
    return `Official Notification:\n\nRegarding the recent update involving '${shorthand}', we would like to inform the campus community that immediate action may be required. Please refer to your department head or the administration office for further details and comprehensive guidelines.`
}

// 3. Smart Grade Predictor
export const calculateAIPrediction = (attendance: number, cgpa: number): { predictedScore: string, tip: string } => {
    // Simple heuristic prediction for demo stability
    let predictedScore = "A"
    let tip = ""

    if (attendance >= 85 && cgpa >= 8.5) {
        predictedScore = "A+"
        tip = "You're on track for distinction! Keep up the excellent work in your core assignments."
    } else if (attendance >= 75 && cgpa >= 7.0) {
        predictedScore = "B+"
        tip = "Solid performance. Pushing your assignment scores up by 5% will comfortably secure an A grade."
    } else {
        return { predictedScore: "9.5/10", tip: "You are excelling. Just maintain your current momentum." }
    }

    return { predictedScore, tip }
}

export function generateCareerPath(department: string, cgpa: number): { title: string; summary: string; skills: string[] } {
    if (department.toLowerCase().includes("computer") || department.toLowerCase().includes("it")) {
        if (cgpa > 8) {
            return {
                title: "AI / Machine Learning Engineer",
                summary: "Based on your strong academic performance (CGPA > 8.0) in Computer Science, you show high aptitude for complex algorithmic roles. Consider exploring AI startups or data analytics roles.",
                skills: ["Python", "TensorFlow", "Data Structures"]
            }
        }
        return {
            title: "Full Stack Developer",
            summary: "Your profile indicates a solid foundation for software engineering. Focus on building practical projects to showcase your abilities.",
            skills: ["React", "Node.js", "System Design"]
        }
    }

    return {
        title: "Technical Consultant",
        summary: "Your engineering background paired with a consistent academic record makes you a strong candidate for technical consulting or product management.",
        skills: ["Problem Solving", "Agile", "Business Analysis"]
    }
}

export function generateParentDigest(studentName: string, attendance: number, cgpa: number): string {
    let summary = `Quick AI Summary for ${studentName}'s Week:\n\n`

    if (attendance > 85) {
        summary += "• 🟢 Attendance is excellent! They are consistently showing up to lectures.\n"
    } else {
        summary += "• 🔴 Attendance is dipping below the 85% requirement. You may want to check in.\n"
    }

    if (cgpa > 8) {
        summary += `• 🌟 Academic standing is strong with a running CGPA of ${cgpa}.\n`
    } else {
        summary += `• ⚠️ Academics are stable at ${cgpa}, but there is room for specific focus in upcoming internals.\n`
    }

    summary += "• 📅 Upcoming action: Mid-semester examinations are scheduled in 10 days. Remind them to check the portal!"

    return summary
}
