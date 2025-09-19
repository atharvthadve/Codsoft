// Example PDF Data
const pdfData = [
    { id: 1, title: "Prelims", normal: "prelims-normal.pdf" },
    { id: 2, title: "Solid State", normal: "solid-state-normal.pdf" },
    { id: 3, title: "Solutions", normal: "solutions-normal.pdf" },
    { id: 4, title: "Ionic Equilibria", normal: "ionic-equilibria-normal.pdf" },
    { id: 5, title: "Chemical Thermodynamics", normal: "chemical-thermodynamics-normal.pdf" },
    { id: 6, title: "Electrochemistry", normal: "electrochemistry-normal.pdf" },
    { id: 7, title: "Chemical Kinetics", normal: "chemical-kinetics-normal.pdf" },
];

// Function to populate the list
function populatePDFList() {
    const pdfList = document.getElementById("pdfList");

    pdfData.forEach(pdf => {
        const listItem = document.createElement("li");

        listItem.innerHTML = `
            <div class="subject">
                <span>${pdf.id}</span>
                <p>${pdf.title}</p>
            </div>
            <div>
                <a href="${pdf.normal}" class="normal" download>Normal</a>
            </div>
        `;

        pdfList.appendChild(listItem);
    });
}

// Search Functionality
document.getElementById("search").addEventListener("input", function () {
    const searchValue = this.value.toLowerCase();
    const items = document.querySelectorAll("#pdfList li");

    items.forEach(item => {
        const title = item.querySelector(".subject p").innerText.toLowerCase();
        item.style.display = title.includes(searchValue) ? "flex" : "none";
    });
});

// Populate the list on page load
populatePDFList();
