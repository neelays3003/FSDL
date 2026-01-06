document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const error = document.getElementById("error");

    if (username === "admin" && password === "1234") {
        alert("Login successful!");
        error.textContent = "";
    } else {
        error.textContent = "Invalid username or password";
    }
});
