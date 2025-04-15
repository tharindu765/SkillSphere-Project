document.addEventListener("DOMContentLoaded", () => {
    const categoryList = document.getElementById("category-list");

    fetch("http://localhost:8080/api/v1/categories")
        .then(res => res.json())
        .then(categories => {
            categories.forEach((cat, index) => {
                const col = document.createElement("div");
                col.className = "col-lg-4 col-md-6";

                // Create dummy image fallback based on index or category
                const image = `img/categories/${(index % 6) + 1}.jpg`;

                col.innerHTML = `
                    <div class="categorie-item">
                        <div class="ci-thumb set-bg" style="background-image: url('${image}');"></div>
                        <div class="ci-text">
                            <h5>${formatCategory(cat)}</h5>
                            <p>Explore the best content in ${formatCategory(cat)} courses.</p>
                            <span>Explore Courses</span>
                        </div>
                    </div>
                `;
                categoryList.appendChild(col);
            });
        })
        .catch(err => {
            console.error("Failed to load categories:", err);
        });

    // Helper function to format ENUM string (e.g., WEB_DEVELOPMENT → Web Development)
    function formatCategory(enumValue) {
        return enumValue.replace(/_/g, ' ').toLowerCase()
                        .replace(/\b\w/g, c => c.toUpperCase());
    }
});
