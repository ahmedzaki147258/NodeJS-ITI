async function fetchLeaves() {
    const empId = document.getElementById("empId").value.trim();
    const status = document.getElementById("status").value;
    const leavesDiv = document.getElementById("leaves");
    const messageDiv = document.getElementById("message");
    leavesDiv.innerHTML = "";

    if (!empId) {
        messageDiv.innerHTML = "<p class='error'>Employee ID is required!</p>";
        return;
    }

    let url = `http://127.0.0.1:3000/leaves?empId=${empId}`;
    if (status) url += `&status=${status}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        if(data.data.length === 0) {
            messageDiv.innerHTML = "<p class='error'>No leaves found!</p>";
            return;
        }

        messageDiv.innerHTML = "";
        data.data.forEach(leave => {
            const leaveCard = document.createElement("div");
            leaveCard.className = "leave-card";
            leaveCard.innerHTML = `
                <p><strong>UserName:</strong> ${leave.empId.username}</p>
                <p><strong>Type:</strong> ${leave.type}</p>
                <p><strong>Duration:</strong> ${leave.duration} days</p>
                <p><strong>Status:</strong> ${leave.status}</p>
            `;
            leavesDiv.appendChild(leaveCard);
        });
    } catch (error) {
        messageDiv.innerHTML = `<p class='error'>Error: ${error.message}</p>`;
    }
}