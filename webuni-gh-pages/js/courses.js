document.addEventListener("DOMContentLoaded", () => {
    const courseList = document.getElementById("course-list");
    const courseFilters = document.getElementById("course-filters");

    const formatCategory = (str) => str ? str.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) : "General";

    const truncate = (str, n) => str?.length > n ? str.slice(0, n) + "..." : str;

    // Add filter for ALL only once
    const allFilterBtn = document.createElement("li");
    allFilterBtn.className = "control active";
    allFilterBtn.dataset.filter = "all";
    allFilterBtn.textContent = "All";
    courseFilters.appendChild(allFilterBtn);

    // Load categories from backend
    fetch("http://localhost:8080/api/v1/categories")
        .then(res => res.json())
        .then(categories => {
            categories.forEach(cat => {
                const li = document.createElement("li");
                li.className = "control";
                li.dataset.filter = cat.toLowerCase();  // class-safe
                li.textContent = formatCategory(cat);
                courseFilters.appendChild(li);
            });
        })
        .catch(err => console.error("Failed to load categories", err));

    courseFilters.addEventListener("click", (e) => {
        if (e.target.tagName === "LI") {
            document.querySelectorAll("#course-filters li").forEach(li => li.classList.remove("active"));
            e.target.classList.add("active");

            const category = e.target.dataset.filter;
            if (category === "all") {
                showAllCourses();
            } else {
                filterCoursesByCategory(category);
            }
        }
    });

    function showAllCourses() {
        loadCourses(); // No category filtering
    }

    function filterCoursesByCategory(category) {
        loadCourses(category.toUpperCase()); // Backend expects uppercase
    }

    function loadCourses(category = null) {
        const url = category
            ? `http://localhost:8080/api/v1/courses?category=${category}`
            : "http://localhost:8080/api/v1/courses";

        fetch(url)
            .then(res => res.json())
            .then(courses => {
                courseList.innerHTML = "";

                if (!Array.isArray(courses) || courses.length === 0) {
                    courseList.innerHTML = `<p class='text-center w-100'>No courses available.</p>`;
                    return;
                }

                courses.forEach((course, index) => {
                    const title = course.title || "Untitled Course";
                    const description = course.description || "No description available.";
                    const price = course.price ?? "Free";

                    const categoryKey = course.category?.toLowerCase() || "general";
                    const instructorName = course.instructor?.fullName || `Instructor #${course.instructorId || "N/A"}`;
                    const categoryFormatted = formatCategory(course.category || "General");

                    // Generate random course details for display enhancement
                    const durationHours = Math.floor(Math.random() * 40 + 10);
                    const rating = (Math.random() * 2 + 3).toFixed(1); // Rating between 3.0 and 5.0
                    const studentCount = Math.floor(Math.random() * 300 + 50);

                    const col = document.createElement("div");
                    col.className = `mix ${categoryKey} col-lg-3 col-md-4 col-sm-6`;

                    col.innerHTML = `
                        <div class="course-item">
                            <div class="course-header" style="background-color: #e74c3c; color: white; height: 120px; display: flex; flex-direction: column; justify-content: center; align-items: center; position: relative;">
                                <h3 class="centered-category">${categoryFormatted}</h3>
                                <div class="price-tag" style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.5); padding: 5px 10px; border-radius: 5px;">$${price}</div>
                            </div>
                            <div class="course-info">
                                <div class="course-text">
                                    <h5>${title}</h5>
                                    <p>${truncate(description, 60)}</p>
                                    <div class="course-meta">
                                        <span><i class="fa fa-clock-o"></i> ${durationHours} Hours</span>
                                        <span><i class="fa fa-star"></i> ${rating}</span>
                                    </div>
                                    <div class="students"><i class="fa fa-users"></i> ${studentCount} Students</div>
                                </div>
                                <div class="course-author">
                                    <div class="ca-info">
                                        <p>${instructorName}</p>
                                        <span class="instructor-role">Course Instructor</span>
                                    </div>
                                </div>
                                <div class="course-action">
                                    <button class="enroll-btn">Enroll Now</button>
                                    <button class="wishlist-btn"><i class="fa fa-heart"></i></button>
                                </div>
                            </div>
                        </div>
                    `;
                    courseList.appendChild(col);
                });

                // Initialize MixItUp filtering
                if (typeof mixitup !== "undefined") {
                    mixitup(".course-items-area", {
                        selectors: {
                            target: '.mix'
                        },
                        animation: {
                            duration: 300
                        }
                    });
                }
            })
            .catch(err => {
                console.error("Course fetch error:", err);
                courseList.innerHTML = `<p class='text-center w-100'>Error loading courses.</p>`;
            });
    }

    // Initial load
    loadCourses();
});