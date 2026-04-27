// controllers/ussdController.js

const Payment = require("../models/Payment");
const Student = require("../models/Student");
const generateRef = require("../utils/generateRef");

exports.handleUSSD = async (req, res) => {
  const { sessionId, serviceCode, phoneNumber, text } = req.body;

  let response = "";

  try {
    // MAIN MENU
    if (text === "") {
      response = `CON Welcome to School Fee Payment
1. Pay Fees
2. Check Balance
3. Payment History`;
    }

    // PAY FEES
    else if (text === "1") {
      response = "CON Enter Student ID";
    }

    else if (text.startsWith("1*")) {
      const parts = text.split("*");

      // Step 2: Student ID entered
      if (parts.length === 2) {
        response = `CON Select Term
1. Term 1
2. Term 2
3. Term 3`;
      }

      // Step 3: Term selected
      else if (parts.length === 3) {
        response = "CON Enter Amount";
      }

      // Step 4: Amount entered
      else if (parts.length === 4) {
        const studentId = parts[1];
        const term = parts[2];
        const amount = parts[3];

        response = `CON Confirm Payment
Student ID: ${studentId}
Term: ${term}
Amount: ${amount}
1. Confirm
2. Cancel`;
      }

      // Step 5: Confirm Payment
      else if (parts.length === 5) {
        const studentId = parts[1];
        const term = parts[2];
        const amount = parts[3];
        const choice = parts[4];

        if (choice === "1") {
          const ref = generateRef();

          await Payment.create({
            studentId,
            phoneNumber,
            term,
            amount,
            reference: ref,
            status: "Paid",
          });

          response = `END Payment Successful
Ref: ${ref}
Amount: ${amount}`;
        } else {
          response = "END Payment Cancelled";
        }
      }
    }

    // CHECK BALANCE
    else if (text === "2") {
      response = "CON Enter Student ID";
    }

    else if (text.startsWith("2*")) {
      const parts = text.split("*");
      const studentId = parts[1];

      const student = await Student.findOne({ studentId });

      if (student) {
        response = `END Outstanding Balance: ${student.balance}`;
      } else {
        response = "END Student not found";
      }
    }

    // PAYMENT HISTORY
    else if (text === "3") {
      response = "CON Enter Student ID";
    }

    else if (text.startsWith("3*")) {
      const parts = text.split("*");
      const studentId = parts[1];

      const payments = await Payment.find({ studentId }).limit(3);

      if (payments.length === 0) {
        response = "END No payment history found";
      } else {
        let history = "Recent Payments:\n";

        payments.forEach((pay) => {
          history += `${pay.amount} - ${pay.status}\n`;
        });

        response = `END ${history}`;
      }
    }

    else {
      response = "END Invalid Choice";
    }

    res.set("Content-Type: text/plain");
    res.send(response);

  } catch (error) {
    console.error(error);
    res.send("END System Error. Try again later.");
  }
};
