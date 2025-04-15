document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("instructorSignupForm");
  const messageBox = document.getElementById("signupMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("emaill").value.trim();
    const password = document.getElementById("passwordd").value;
    const bio = document.getElementById("bio").value.trim();

    const instructorDTO = {
      fullName,
      email,
      password,
      bio,
      earnings: 0.0,
      role: "INSTRUCTOR"
    };

    try {
      const response = await fetch("http://localhost:8080/api/v1/instructors/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(instructorDTO)
      });

      const data = await response.json();

      if (response.ok) {
        messageBox.textContent = "🎉 Successfully registered as instructor!";
        messageBox.style.color = "lightgreen";
        form.reset();
      } else {
        messageBox.textContent = "❌ " + (data.message || "Registration failed");
        messageBox.style.color = "orange";
      }
    } catch (error) {
      messageBox.textContent = "⚠️ Network error. Try again later.";
      messageBox.style.color = "red";
    }
  });
});
