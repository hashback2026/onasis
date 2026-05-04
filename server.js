const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const API_URL = "https://pay.onasis.tech/api/stk";
const API_KEY = "YOUR_API_KEY";

// Single STK
app.post("/send", async (req, res) => {
  try {
    const { phone, amount, reference, account_ref, description } = req.body;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        phone,
        amount,
        reference,
        account_ref,
        description
      })
    });

    const data = await response.json();
    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bulk STK
app.post("/bulk", async (req, res) => {
  try {
    const { numbers, amount, reference } = req.body;

    let results = [];

    for (let i = 0; i < numbers.length; i++) {
      const phone = numbers[i].trim();
      if (!phone) continue;

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
          },
          body: JSON.stringify({
            phone,
            amount,
            reference: `${reference}-${Date.now()}-${i}`,
            account_ref: "BulkPay",
            description: "Bulk STK Payment"
          })
        });

        const data = await response.json();

        results.push({ phone, success: true, response: data });

      } catch (err) {
        results.push({ phone, success: false, error: err.message });
      }
    }

    res.json(results);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
