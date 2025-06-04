async function fetchFiles() {
    const response = await fetch('/files');
    const files = await response.json();
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = "";

    files.forEach(file => {
        fileList.innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                ${file}
                <div>
                    <a href="/download/${file}" class="btn btn-sm btn-success">Download</a>
                    <button onclick="deleteFile('${file}')" class="btn btn-sm btn-danger">Șterge</button>
                </div>
            </li>`;
    });
}
document.getElementById("memoryBtn").addEventListener("click", async function () {
    const response = await fetch('/memory');
    const memoryData = await response.json();

    document.getElementById("fileList").style.display = "none";
    document.getElementById("chartCanvas").style.display = "block";
    document.getElementById("chartCanvas").style.width = "300px";
    document.getElementById("chartCanvas").style.height = "300px";

    const ctx = document.getElementById("chartCanvas").getContext("2d");
    new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Memorie utilizată", "Memorie disponibilă"],
            datasets: [{
                data: [memoryData.used, memoryData.free],
                backgroundColor: ["#ff6384", "#36a2eb"]
            }]
        }
    });
});


document.getElementById("fileTypesBtn").addEventListener("click", async function () {
    const response = await fetch('/filetypes');
    const fileTypeData = await response.json();

    document.getElementById("fileList").style.display = "none";
    document.getElementById("chartCanvas").style.display = "block";
    document.getElementById("chartCanvas").style.width = "300px";
    document.getElementById("chartCanvas").style.height = "300px";

    const ctx = document.getElementById("chartCanvas").getContext("2d");
    new Chart(ctx, {
        type: "pie",
        data: {
            labels: Object.keys(fileTypeData),
            datasets: [{
                data: Object.values(fileTypeData),
                backgroundColor: ["#ffcd56", "#4bc0c0", "#9966ff", "#ff9f40"]
            }]
        }
    });
});
setInterval(fetchFiles, 10000);

fetchFiles();

