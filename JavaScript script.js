const form = document.getElementById("passwordForm");
const resultDiv = document.getElementById("result");

form.addEventListener("submit", async function(event) {
    event.preventDefault();
    const passwordInput = document.getElementById("passwordInput").value;
    const hash = await sha1(passwordInput);
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5);
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const data = await response.text();
    const regex = new RegExp(`^${suffix}:`, 'm');
    if (regex.test(data)) {
        resultDiv.textContent = "This password has been compromised. Please choose a different one.";
    } else {
        resultDiv.textContent = "This password has not been compromised. You can use it!";
    }
});

async function sha1(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex.toUpperCase();
}
