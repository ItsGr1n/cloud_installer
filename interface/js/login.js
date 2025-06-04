document.getElementById("localServer").addEventListener("change", function() {
    const serverFields = document.getElementById("serverFields");
    serverFields.style.display = this.checked ? "none" : "block";

    if (this.checked) {
        window.location.href = "index.html";
    }
});

async function login() {
    const localServer = document.getElementById("localServer").checked;
    
    if (localServer) {
        window.location.href = "index.html";
    } else {
        const serverIP = document.getElementById("serverIP").value;
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (!serverIP || !username || !password) {
            alert("Completează toate câmpurile!");
            return;
        }

        fetch('/connect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ serverIP, username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = "index.html";
            } else {
                alert("Conectare eșuată!");
            }
        });
    }
}