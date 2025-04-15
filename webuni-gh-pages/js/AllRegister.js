<script>
  const modal = document.getElementById("registerModal");
  const openBtn = document.getElementById("openModalBtn");
  const closeBtn = document.getElementById("closeModalBtn");

  openBtn.onclick = () => modal.style.display = "block";
  closeBtn.onclick = () => modal.style.display = "none";
  window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; }

  const form = document.getElementById('registrationForm');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const fullName = document.getElementById('name').value;
    const email = document.getElementById('emailll').value;
    const password = document.getElementById('passworddd').value;
    const role = document.getElementById('role').value;

    const user = { email, password, fullName };

    try {
      const response = await fetch(`http://localhost:8080/api/v1/users/register?role=${role}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });

      if (response.ok) {
        alert("Registration successful!");
        form.reset();
        modal.style.display = "none";
      } else {
        const errorData = await response.json();
        alert("Registration failed: " + (errorData.message || "Please try again."));
      }
    } catch (error) {
      console.error("Request failed:", error);
      alert("Network error. Please try again later.");
    }
  });
</script>
