document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("loginForm");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const user = { email, password };

        try {
            const response = await fetch("http://localhost:8080/api/v1/auth/authenticate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            });

            const result = await response.json();

            if (response.ok) {
                alert("Login Successful!");

                const token = result.data.token;
                const role = result.data.role;

                localStorage.setItem("token", token);
                localStorage.setItem("role", role);
                localStorage.setItem("userId", result.data.id);

                if (role === "STUDENT") {
                    window.location.href = "studentDashbord.html";
                } else if (role === "INSTRUCTOR") {
                    window.location.href = "insturtorDashbord.html";
                } else if (role === "ADMIN") {
                    window.location.href = "adminDashboard.html";
                } else {
                    alert("Unknown role. Cannot redirect.");
                }

                form.reset();
            } else {
                alert(`Login Failed: ${result.message}`);
            }
        } catch (error) {
            alert("An error occurred while logging in. Please try again.");
            console.error(error);
        }
    });
});
