require("dotenv").config()

const API_CONFIG = {
  host: "active-jobs-db.p.rapidapi.com",
  key: process.env.RAPID_API_KEY,
  baseURL: "https://active-jobs-db.p.rapidapi.com",
}

// Updated mock data with working company logos
const mockJobs = [
  {
    id: 1,
    title: "ServiceNow Developer Intern",
    company: "ITnow Inc",
    location: "Bengaluru",
    lpa: "3 LPA",
    tags: ["Java", "JavaScript"],
    logo: "https://www.servicenow.com/content/dam/servicenow-assets/images/meganav/servicenow-header-logo.svg",
    postedDays: "Posted 3 days ago",
    expired: "Expires in 2 days",
    applied: false,
  },
  {
    id: 2,
    title: "Associate Database Administrator",
    company: "Ahana Systems",
    location: "Mumbai, Bengaluru",
    lpa: "2.40 LPA",
    tags: ["SQL", "Oracle", "Python"],
    logo: "https://cdn-icons-png.flaticon.com/512/2906/2906274.png",
    postedDays: "Posted 4 days ago",
    expired: "Expires in 3 days",
    applied: false,
  },
  {
    id: 3,
    title: "Trainee Tester & Functional Analyst",
    company: "Infanion",
    location: "Bangalore",
    lpa: "3.50 LPA",
    tags: ["Core Java", "Manual Testing", "Automation"],
    logo: "https://cdn-icons-png.flaticon.com/512/1688/1688400.png",
    postedDays: "Posted 4 days ago",
    expired: "Expires in 3 days",
    applied: false,
  },
  {
    id: 4,
    title: "SDET Intern",
    company: "Townhall",
    location: "Hyderabad",
    lpa: "4 LPA",
    tags: ["Selenium", "Core Java", "Manual Testing"],
    logo: "https://cdn-icons-png.flaticon.com/512/2721/2721264.png",
    postedDays: "Posted 5 days ago",
    expired: "Expires in 4 days",
    applied: false,
  },
  {
    id: 5,
    title: "Fullstack Developer",
    company: "Kristal Ball Smart Solutions",
    location: "Bangalore",
    lpa: "1.80 LPA",
    tags: ["Core Java", "Adv Java", "Manual Testing"],
    logo: "https://cdn-icons-png.flaticon.com/512/6062/6062646.png",
    postedDays: "Posted 5 days ago",
    expired: "Expires in 4 days",
    applied: false,
  },
]

async function fetchJobs() {
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}/active-at-7d?title_filter=%22Software%22Developer%22&location_filter=%22India%22`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Host": API_CONFIG.host,
          "X-RapidAPI-Key": API_CONFIG.key,
        },
      },
    )

    const data = await response.json()

    // Transform API data to match our format with better default logos
    const formattedJobs = data.map((job) => ({
      id: job.id || Math.random().toString(36).substr(2, 9),
      title: job.title || "Position Available",
      company: job.company || "Company Name",
      location: job.location || "Remote",
      lpa: job.salary_range || "Competitive",
      tags: job.skills || ["Not Specified"],
      logo: `https://cdn-icons-png.flaticon.com/512/2910/2910791.png`, // Default tech company logo
      postedDays: `Posted ${job.posted_at ? new Date(job.posted_at).toLocaleDateString() : "Recently"}`,
      expired: job.expires_at ? `Expires ${new Date(job.expires_at).toLocaleDateString()}` : "Open",
      applied: false,
    }))

    displayJobs(formattedJobs)
  } catch (error) {
    console.error("Error fetching jobs:", error)
    // Fallback to mock data if API fails
    displayJobs(mockJobs)
  }
}

function displayJobs(jobs) {
  const jobsContainer = document.getElementById("jobsContainer")
  jobsContainer.innerHTML = "" // Clear existing content

  jobs.forEach((job) => {
    // Create a logo URL with a fallback
    const logoUrl = job.logo || job.company_logo || 'https://via.placeholder.com/100x60?text=Logo';
    
    const jobCard = document.createElement('div');
    jobCard.className = 'job-card';
    
    jobCard.innerHTML = `
            <div class="company-logo-container">
                <img src="${logoUrl}" 
                     alt="${job.company || job.company_name}" 
                     class="company-logo loading"
                     onerror="this.onerror=null; this.src='https://via.placeholder.com/100x60?text=${encodeURIComponent(job.company || job.company_name)}'; this.classList.remove('loading');">
            </div>
            <div class="job-info">
                <h3>${job.title}</h3>
                <p class="company-name">${job.company || job.company_name}</p>
                <p class="location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${job.location}
                </p>
                <div class="tags">
                    ${(job.tags || job.skills || []).map((tag) => `<span class="tag">${tag}</span>`).join("")}
                </div>
            </div>
            <div class="job-meta">
                <div class="lpa">${job.lpa || job.salary || ""}</div>
                <div class="posted-time">${job.postedDays || `Posted ${job.posted_date || 'recently'}`}</div>
                <div class="not-applied">
                    <i class="far fa-circle"></i>
                    Not Applied
                </div>
                <button class="check-details" onclick="checkDetails(${job.id})">View Details</button>
            </div>
        `;
    
    // Add image load event listener
    const logoImg = jobCard.querySelector('.company-logo');
    logoImg.addEventListener('load', function() {
      this.classList.remove('loading');
    });
    
    jobsContainer.appendChild(jobCard);
  })
  
  // Add this code to ensure all existing images are properly handled
  document.addEventListener('DOMContentLoaded', function() {
    const allLogos = document.querySelectorAll('.company-logo');
    allLogos.forEach(logo => {
      if (logo.complete) {
        logo.classList.remove('loading');
      } else {
        logo.classList.add('loading');
      }
    });
  });
}

function checkDetails(jobId) {
  window.location.href = `/job-details?id="${jobId}"`
}

function logout() {
  window.location.href = "/"
}

// Add Font Awesome for icons
document.head.innerHTML +=
  '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">'

// Call fetchJobs when the jobs page loads
document.addEventListener("DOMContentLoaded", fetchJobs)
