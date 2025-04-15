document.addEventListener('DOMContentLoaded', function () {
    const searchForm = document.querySelector('.course-search-form');
    const courseList = document.getElementById('courseList'); // Use courseList for results

    if (!searchForm || !courseList) {
        console.error("Required DOM elements not found.");
        return;
    }

    console.log('DOM fully loaded and parsed.');

    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const courseNameInput = document.querySelector('input[placeholder="Course"]');
        const categoryInput = document.querySelector('input[placeholder="Category"]');

        const courseName = courseNameInput ? courseNameInput.value.trim() : '';
        const category = categoryInput ? categoryInput.value.trim().toUpperCase() : '';

        // Prepare query parameters
        const params = new URLSearchParams();
        if (courseName) params.append('courseName', courseName);
        if (category) params.append('category', category);

        const apiUrl = `http://localhost:8080/api/v1/courses/search?${params.toString()}`;

        console.log(`Fetching courses with URL: ${apiUrl}`);

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    console.error('Failed to fetch courses:', response.status, response.statusText);
                    throw new Error('Failed to fetch courses');
                }
                return response.json();
            })
            .then(data => {
                console.log('Fetched courses:', data);
                courseList.innerHTML = ''; // Clear existing courses

                if (!Array.isArray(data) || data.length === 0) {
                    console.warn('No courses found.');
                    courseList.innerHTML = '<p>No courses found.</p>';
                    return;
                }

                data.forEach(course => {
                    console.log(`Processing course: ${course.title}, ID: ${course.id}`);

                    if (!course.instructorId) {
                        console.warn('Course missing instructorId:', course);
                        return;
                    }

                    // Fetch instructor data
                    console.log(`Fetching instructor with ID: ${course.instructorId}`);
                    fetch(`http://localhost:8080/api/v1/instructors/${course.instructorId}`)
                        .then(res => {
                            if (!res.ok) {
                                console.error(`Failed to fetch instructor with ID: ${course.instructorId}`, res.status, res.statusText);
                                throw new Error(`Failed to fetch instructor with ID: ${course.instructorId}`);
                            }
                            return res.json();
                        })
                        .then(instructor => {
                            console.log('Fetched instructor:', instructor);

                            if (!instructor || !instructor.fullName) {
                                console.warn('Instructor data missing fullName for course:', course);
                            }

                            // Handle potential issues with the instructor name
                            const instructorName = instructor && instructor.fullName ? instructor.fullName : 'Unknown Instructor';
                            const instructorImageUrl = instructor && instructor.imageUrl ? instructor.imageUrl : '/default-instructor.jpg';

                            // Create course item element
                            const courseItem = document.createElement('div');
                            courseItem.className = `mix col-lg-3 col-md-4 col-sm-6 ${course.category.toLowerCase()}`;

                            courseItem.innerHTML = `
                                <div class="course-item">
                                    <div class="course-thumb set-bg" data-setbg="${course.imageUrl || '/default-course.jpg'}">
                                        <div class="price">Price: $${course.price}</div>
                                    </div>
                                    <div class="course-info">
                                        <div class="course-text">
                                            <h5>${course.title}</h5>
                                            <p>${course.description}</p>
                                            <div class="students">${Math.floor(Math.random() * 300 + 50)} Students</div>
                                        </div>
                                        <div class="course-author">
                                            <div class="ca-pic set-bg" data-setbg="${instructorImageUrl}"></div>
                                            <p>${instructorName}, <span>Instructor</span></p>
                                        </div>
                                    </div>
                                </div>
                            `;

                            // Append to course list
                            console.log('Appending course item to the list');
                            courseList.appendChild(courseItem);
                        })
                        .catch(error => {
                            console.error('Error fetching instructor:', error);

                            const courseItem = document.createElement('div');
                            courseItem.className = `mix col-lg-3 col-md-4 col-sm-6 ${course.category.toLowerCase()}`;

                            courseItem.innerHTML = `
                                <div class="course-item">
                                    <div class="course-thumb set-bg" data-setbg="${course.imageUrl || '/default-course.jpg'}">
                                        <div class="price">Price: $${course.price}</div>
                                    </div>
                                    <div class="course-info">
                                        <div class="course-text">
                                            <h5>${course.title}</h5>
                                            <p>${course.description}</p>
                                            <div class="students">${Math.floor(Math.random() * 300 + 50)} Students</div>
                                        </div>
                                        <div class="course-author">
                                            <div class="ca-pic set-bg" data-setbg="/default-instructor.jpg"></div>
                                            <p>Unknown Instructor, <span>Instructor</span></p>
                                        </div>
                                    </div>
                                </div>
                            `;

                            // Append to course list
                            console.log('Appending course item with fallback instructor to the list');
                            courseList.appendChild(courseItem);
                        });
                });
            })
            .catch(error => {
                console.error('Error fetching courses:', error);
                courseList.innerHTML = '<p class="text-danger">Error loading courses.</p>';
            });
    });
});
