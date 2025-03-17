let userSkills = []

// Load user profile data
async function loadProfile() {
  try {
    const response = await fetch("/api/profile")
    const userData = await response.json()

    // Update profile fields
    document.getElementById("userName").textContent = userData.username
    document.getElementById("userEmail").textContent = userData.email
    document.getElementById("schoolName").value = userData.schoolName || ""
    document.getElementById("highSchool").value = userData.highSchool || ""
    document.getElementById("undergradDegree").value = userData.undergradDegree || ""
    document.getElementById("pgDegree").value = userData.pgDegree || ""
    document.getElementById("workRole").value = userData.workRole || ""

    // Load skills
    userSkills = userData.skills || []
    renderSkills()
  } catch (error) {
    console.error("Error loading profile:", error)
  }
}

function renderSkills() {
  const container = document.getElementById("skillsContainer")
  container.innerHTML = userSkills
    .map(
      (skill) => `
        <div class="skill-tag">
            ${skill}
            <button onclick="removeSkill('${skill}')">&times;</button>
        </div>
    `,
    )
    .join("")
}

function addSkill() {
  const input = document.getElementById("skillInput")
  const skill = input.value.trim()

  if (skill && !userSkills.includes(skill)) {
    userSkills.push(skill)
    renderSkills()
    input.value = ""
  }
}

function removeSkill(skill) {
  userSkills = userSkills.filter((s) => s !== skill)
  renderSkills()
}

// Handle form submission
document.getElementById("profileForm").addEventListener("submit", async (e) => {
  e.preventDefault()

  const formData = {
    schoolName: document.getElementById("schoolName").value,
    highSchool: document.getElementById("highSchool").value,
    undergradDegree: document.getElementById("undergradDegree").value,
    pgDegree: document.getElementById("pgDegree").value,
    workRole: document.getElementById("workRole").value,
    skills: userSkills,
  }

  try {
    const response = await fetch("/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })

    if (response.ok) {
      alert("Profile updated successfully!")
    } else {
      alert("Failed to update profile")
    }
  } catch (error) {
    console.error("Error updating profile:", error)
    alert("Error updating profile")
  }
})

// Load profile when page loads
document.addEventListener("DOMContentLoaded", loadProfile)

