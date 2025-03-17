const express = require("express")
const fs = require("fs")
const path = require("path")
const fetch = require("node-fetch")
require("dotenv").config()

const app = express()
const port = process.env.PORT || 3001

// Add this near the top of server.js with other constants
const API_CONFIG = {
  host: "active-jobs-db.p.rapidapi.com",
  key: process.env.RAPID_API_KEY || "your-api-key-placeholder",
  baseURL: "https://active-jobs-db.p.rapidapi.com",
}

// Create mock jobs data to use as fallback when API key is not available
const MOCK_JOBS = [
  {
    id: "1",
    title: "Frontend Developer",
    company_name: "Google",
    company_logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2048px-Google_%22G%22_Logo.svg.png",
    location: "Mountain View, CA",
    salary: "$120,000 - $150,000",
    description: "We are looking for a skilled Frontend Developer to join our team at Google.",
    posted_date: "2023-05-15",
    skills: ["JavaScript", "React", "HTML/CSS", "TypeScript"],
    requirements: [
      "5+ years of experience with frontend technologies",
      "Strong understanding of React and state management",
      "Experience with responsive design and cross-browser compatibility"
    ]
  },
  {
    id: "2",
    title: "Backend Engineer",
    company_name: "Microsoft",
    company_logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png",
    location: "Redmond, WA",
    salary: "$130,000 - $160,000",
    description: "Join our backend team to build scalable solutions for Microsoft products.",
    posted_date: "2023-05-12",
    skills: ["Python", "Node.js", "AWS", "Databases"],
    requirements: [
      "4+ years of backend development experience",
      "Experience with cloud services (AWS, Azure)",
      "Knowledge of database systems and optimization"
    ]
  },
  {
    id: "3",
    title: "Full Stack Developer",
    company_name: "Amazon",
    company_logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png",
    location: "Seattle, WA",
    salary: "$140,000 - $170,000",
    description: "We're seeking a Full Stack Developer to help build innovative solutions at Amazon.",
    posted_date: "2023-05-10",
    skills: ["JavaScript", "Node.js", "React", "MongoDB"],
    requirements: [
      "6+ years of full stack development experience",
      "Strong understanding of frontend and backend technologies",
      "Experience with e-commerce applications is a plus"
    ]
  },
  {
    id: "4",
    title: "DevOps Engineer",
    company_name: "IBM",
    company_logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/2560px-IBM_logo.svg.png",
    location: "Austin, TX",
    salary: "$125,000 - $155,000",
    description: "Join our DevOps team to improve deployment pipelines and infrastructure.",
    posted_date: "2023-05-08",
    skills: ["Docker", "Kubernetes", "CI/CD", "AWS"],
    requirements: [
      "3+ years of DevOps experience",
      "Experience with containerization and orchestration",
      "Knowledge of infrastructure as code (Terraform, CloudFormation)"
    ]
  }
]

app.use(express.json())
app.use(express.static("."))
app.use("/img", express.static(path.join(__dirname, "img")))

// Read users from JSON file
function readUsers() {
  try {
    const data = fs.readFileSync("users.json")
    return JSON.parse(data)
  } catch (error) {
    return { users: [] }
  }
}

// Write users to JSON file
function writeUsers(users) {
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2))
}

// Serve the main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})

// Serve the signup page
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "signup.html"))
})

// Serve the jobs page
app.get("/jobs", (req, res) => {
  res.sendFile(path.join(__dirname, "jobs.html"))
})

// Signup endpoint
app.post("/api/signup", (req, res) => {
  const userData = req.body
  const users = readUsers()

  // Check if email already exists
  if (users.users.find((user) => user.email === userData.email)) {
    return res.status(400).json({ error: "Email already exists" })
  }

  users.users.push(userData)
  writeUsers(users)
  res.json({ message: "Signup successful" })
})

// Login endpoint
app.post("/api/login", (req, res) => {
  const { email, password } = req.body
  const users = readUsers()

  console.log("Login attempt:", { email, password }) // Debug log
  console.log("Available users:", users) // Debug log

  const user = users.users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

  if (user) {
    console.log("Login successful for:", user.email) // Debug log
    res.json({ message: "Login successful" })
  } else {
    console.log("Login failed: Invalid credentials") // Debug log
    res.status(401).json({ error: "Invalid email or password" })
  }
})

// Get user profile
app.get("/api/profile", (req, res) => {
  const users = readUsers()
  // In a real app, you'd use session/token to identify the user
  const user = users.users[0] // For demo, returning first user
  res.json(user)
})

// Update user profile
app.post("/api/profile", (req, res) => {
  const users = readUsers()
  const userData = req.body

  // In a real app, you'd use session/token to identify the user
  users.users[0] = { ...users.users[0], ...userData }

  writeUsers(users)
  res.json({ message: "Profile updated successfully" })
})

// Add profile page route
app.get("/profile", (req, res) => {
  res.sendFile(path.join(__dirname, "profile.html"))
})

// Add this new endpoint
app.get("/job-details", (req, res) => {
  res.sendFile(path.join(__dirname, "job-details.html"))
})

// Mock jobs data
const mockJobs = [
  {
    id: 1,
    title: 'Senior Software Developer',
    company_name: 'Google',
    location: 'Bangalore, India',
    salary: '20-30 LPA',
    skills: ['React', 'Node.js', 'MongoDB'],
    posted_date: '2 days ago',
    company_logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    description: 'We are looking for a Senior Software Developer to join our dynamic team. The ideal candidate will have strong experience in full-stack development and a passion for building scalable applications.',
    requirements: [
      'Bachelor\'s degree in Computer Science or related field',
      '5+ years of experience in software development',
      'Strong proficiency in React and Node.js',
      'Experience with cloud platforms (preferably GCP)',
      'Excellent problem-solving skills'
    ]
  },
  {
    id: 2,
    title: 'Frontend Developer',
    company_name: 'Microsoft',
    location: 'Mumbai, India',
    salary: '12-18 LPA',
    skills: ['JavaScript', 'React', 'CSS'],
    posted_date: '1 day ago',
    company_logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
    description: 'Join our team as a Frontend Developer and help build the next generation of web applications. You will be responsible for implementing visual elements and user interactions.',
    requirements: [
      'Strong proficiency in JavaScript and modern frameworks',
      'Experience with responsive design and CSS',
      'Knowledge of web performance optimization',
      'Good understanding of browser rendering behavior'
    ]
  },
  {
    id: 3,
    title: 'Full Stack Developer',
    company_name: 'Amazon',
    location: 'Hyderabad, India',
    salary: '18-25 LPA',
    skills: ['Java', 'Spring Boot', 'AWS'],
    posted_date: '3 days ago',
    company_logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    description: 'We are seeking a Full Stack Developer to join our e-commerce platform team. You will be working on both frontend and backend development of our services.',
    requirements: [
      'Strong Java development skills',
      'Experience with Spring Boot and microservices',
      'Knowledge of AWS services',
      'Understanding of distributed systems'
    ]
  },
  {
    id: 4,
    title: 'DevOps Engineer',
    company_name: 'IBM',
    location: 'Pune, India',
    salary: '15-22 LPA',
    skills: ['Docker', 'Kubernetes', 'Jenkins'],
    posted_date: '4 days ago',
    company_logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg',
    description: 'Looking for a DevOps Engineer to help automate our deployment processes and maintain our cloud infrastructure. You will work closely with development teams to implement CI/CD pipelines.',
    requirements: [
      'Experience with containerization and orchestration',
      'Strong knowledge of CI/CD practices',
      'Familiarity with cloud platforms',
      'Scripting and automation skills'
    ]
  }
];

// API endpoint to get jobs
app.get("/api/jobs", async (req, res) => {
  const titleFilter = req.query.title || "";
  const locationFilter = req.query.location || "";

  try {
    // If no API key is provided, return mock data
    if (!process.env.RAPID_API_KEY || process.env.RAPID_API_KEY === "your-api-key-placeholder") {
      console.log("Using mock jobs data as API key is not available");
      const filteredJobs = MOCK_JOBS.filter(job => {
        return (
          job.title.toLowerCase().includes(titleFilter.toLowerCase()) &&
          job.location.toLowerCase().includes(locationFilter.toLowerCase())
        );
      });
      return res.json(filteredJobs);
    }

    const formattedTitleFilter = titleFilter ? `%22${encodeURIComponent(titleFilter)}%22` : '%22Software%22Developer%22';
    const formattedLocationFilter = locationFilter ? `%22${encodeURIComponent(locationFilter)}%22` : '%22India%22';

    const response = await fetch(
      `${API_CONFIG.baseURL}/active-at-7d?title_filter=${formattedTitleFilter}&location_filter=${formattedLocationFilter}`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Host": API_CONFIG.host,
          "X-RapidAPI-Key": API_CONFIG.key,
        },
      },
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    // Return mock data in case of error
    const filteredJobs = MOCK_JOBS.filter(job => {
      return (
        job.title.toLowerCase().includes(titleFilter.toLowerCase()) &&
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    });
    res.json(filteredJobs);
  }
});

// API endpoint to get a specific job by ID
app.get("/api/jobs/:id", async (req, res) => {
  const jobId = req.params.id;

  try {
    // If no API key is provided, return mock data
    if (!process.env.RAPID_API_KEY || process.env.RAPID_API_KEY === "your-api-key-placeholder") {
      console.log("Using mock jobs data as API key is not available");
      const job = MOCK_JOBS.find(job => job.id === jobId);
      if (job) {
        return res.json(job);
      } else {
        return res.status(404).json({ error: "Job not found" });
      }
    }

    // Try to get from mock data first
    const mockJob = mockJobs.find(job => job.id === parseInt(jobId.replace(/"/g, "")));
    if (mockJob) {
      return res.json(mockJob);
    }

    // If not in mock data, try API
    const response = await fetch(`${API_CONFIG.baseURL}/job-by-id?id=${jobId}`, {
      method: "GET",
      headers: {
        "X-RapidAPI-Host": API_CONFIG.host,
        "X-RapidAPI-Key": API_CONFIG.key,
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      res.json(data);
    } else {
      res.status(404).json({ error: "Job not found" });
    }
  } catch (error) {
    console.error("Error fetching job details:", error);
    // Return mock data in case of error
    const job = MOCK_JOBS.find(job => job.id === jobId);
    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ error: "Job not found" });
    }
  }
}); 

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
