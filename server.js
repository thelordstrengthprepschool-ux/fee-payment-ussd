const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));

app.post("/ussd", (req, res) => {
    const { text, phoneNumber } = req.body;
    let response = "";

    // Main Menu
    if (text === "") {
        response = `CON Welcome to FeePay
1. Pay Fees
2. Check Payment
3. Contact School`;
    }

    // Pay Fees - Step 1
    else if (text === "1") {
        response = "CON Enter Student ID:";
    }

    // Pay Fees Flow
    else if (text.startsWith("1*")) {
        const parts = text.split("*");

        // Step 2: Enter Amount
        if (parts.length === 2) {
            response = "CON Enter Amount (GHS):";
        }

        // Step 3: Confirm Payment
        else if (parts.length === 3) {
            response = `CON Confirm Payment
Student ID: ${parts[1]}
Amount: GHS ${parts[2]}
1. Confirm
2. Cancel`;
        }

        // Step 4: Final Action
        else if (parts.length === 4) {
            if (parts[3] === "1") {
                // Here you would connect to Mobile Money API (Hubtel, etc.)

                response = "END Payment request sent. You will receive a prompt to approve the payment.";
            } else {
                response = "END Payment cancelled.";
            }
        }
    }

    // Check Payment (placeholder)
    else if (text === "2") {
        response = "END Payment records feature coming soon.";
    }

    // Contact School
    else if (text === "3") {
        response = "END Contact us at 024XXXXXXX or email school@example.com";
    }

    // Invalid input
    else {
        response = "END Invalid option. Try again.";
    }

    res.set("Content-Type: text/plain");
    res.send(response);
});

// IMPORTANT: Use Render's dynamic port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`USSD app running on port ${PORT}`);
});
