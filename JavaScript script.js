// Function to check if a password has been compromised using the Have I Been Pwned API
async function checkPassword(password) {
    // Calculate the SHA-1 hash of the password
    const hash = await sha1(password);
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5);
    
    // Query the Have I Been Pwned API to check if the hash prefix exists in the database of compromised passwords
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const data = await response.text();
    const regex = new RegExp(`^${suffix}:`, 'm');
    
    // Return the result based on whether the hash suffix is found in the API response
    return regex.test(data);
}

// Function to calculate the SHA-1 hash of a string
async function sha1(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex.toUpperCase();
}

// Example usage:
const password = "examplePassword123";
checkPassword(password)
    .then(result => {
        if (result) {
            console.log("This password has been compromised. Please choose a different one.");
        } else {
            console.log("This password has not been compromised. You can use it!");
        }
    })
    .catch(error => console.error("An error occurred:", error));
