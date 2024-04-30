document.getElementById("checkPassword").addEventListener("click", function() {
    const passwordInput = document.getElementById("password").value;
    if (passwordInput.trim() === "") {
        document.getElementById("result").textContent = "Please enter a password.";
        return;
    }

    checkPassword(passwordInput)
        .then(result => {
            if (result) {
                document.getElementById("result").textContent = "This password has been compromised. Please choose a different one.";
            } else {
                document.getElementById("result").textContent = "This password has not been compromised. You can use it!";
            }
        })
        .catch(error => {
            console.error("An error occurred:", error);
            document.getElementById("result").textContent = "An error occurred while checking the password. Please try again later.";
        });
});

async function checkPassword(password) {
    const hash = await sha1(password);
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5);
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const data = await response.text();
    const regex = new RegExp(`^${suffix}:`, 'm');
    return regex.test(data);
}

async function sha1(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex.toUpperCase();
}
