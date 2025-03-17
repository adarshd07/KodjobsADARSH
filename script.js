// Function to validate password
function validatePassword(password) {
    const minLength = 6
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const hasNumber = /\d/.test(password)
  
    return password.length >= minLength && hasSpecial && hasNumber
  }
  
  // Function to calculate age
  function calculateAge(dob) {
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
  
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
  
    return age
  }
  
  // Add this function to toggle between forms
  function toggleForms() {
    const loginForm = document.getElementById("loginForm")
    const signupForm = document.getElementById("signupForm")
    loginForm.classList.toggle("hidden")
    signupForm.classList.toggle("hidden")
  }
  
  // Signup function
  async function signup(event) {
    event.preventDefault()
  
    const username = document.getElementById("signupUsername").value
    const password = document.getElementById("signupPassword").value
    const email = document.getElementById("signupEmail").value
    const dob = document.getElementById("dob").value
  
    if (!username || !password || !email || !dob) {
      alert("Please fill in all fields")
      return
    }
  
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email, dob }),
      })
  
      const data = await response.json()
  
      if (response.ok) {
        alert("Signup successful! Please login.")
        toggleForms()
      } else {
        alert(data.error || "Signup failed")
      }
    } catch (error) {
      console.error("Signup error:", error)
      alert("Signup failed. Please try again.")
    }
  }
  
  // Login function
  async function login(event) {
    event.preventDefault()
  
    const email = document.getElementById("loginEmail").value
    const password = document.getElementById("loginPassword").value
  
    if (!email || !password) {
      alert("Please enter both email and password")
      return
    }
  
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
  
      const data = await response.json()
  
      if (response.ok) {
        console.log("Login successful")
        window.location.href = "/jobs"
      } else {
        alert(data.error || "Invalid email or password")
      }
    } catch (error) {
      console.error("Login error:", error)
      alert("Login failed. Please try again.")
    }
  }
  
  // Toggle between sign in and sign up forms
  const sign_in_btn = document.querySelector("#sign-in-btn")
  const sign_up_btn = document.querySelector("#sign-up-btn")
  const container = document.querySelector(".container")
  
  sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode")
  })
  
  sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode")
  })
  
  async function fetchJobDetails(jobId) {
    try {
        const response = await fetch(`/api/jobs/${jobId}`);
        const jobData = await response.json();

        if (response.ok) {
            document.getElementById('jobDescription').innerText = jobData.description;
            document.getElementById('requiredSkills').innerText = jobData.skills.join(', ');
            document.getElementById('additionalInfo').innerText = jobData.additionalInfo;
            document.getElementById('postedDate').innerText = jobData.postedDate;
            document.getElementById('expiresDate').innerText = jobData.expiresDate;
        } else {
            console.error('Error fetching job details:', jobData.error);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
  }

  // Call this function with the job ID
  const jobId = new URLSearchParams(window.location.search).get('id');
  fetchJobDetails(jobId);
  
  