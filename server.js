// This is your test secret API key.
const stripe = require("stripe")("sk_test_51S4c3LCnw8RT6Jxam1mVZ3vpIc1sXaLvT0on7hECHrZQjcz7k2zyt0bqGH0bIV01ZYYhQzrpKInheeS1c3Jjs3RT00JxGj582H", {
  apiVersion: "2025-08-27.basil",
});
const express = require("express");
const app = express();
app.use(express.static("public"));

const YOUR_DOMAIN = "http://localhost:4242";

app.post("/create-checkout-session", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    ui_mode: "custom",
    line_items: [
      {
        // Provide the exact Price ID (e.g. price_1234) of the product you want to sell
        price: "{{PRICE_ID}}",
        quantity: 1,
      },
    ],
    mode: "payment",
    return_url: `${YOUR_DOMAIN}/complete.html?session_id={CHECKOUT_SESSION_ID}`,
    automatic_tax: {enabled: true},
  });

  res.send({ clientSecret: session.client_secret });
});

app.get("/session-status", async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id, {expand: ["payment_intent"]});

   res.send({
    status: session.status,
    payment_status: session.payment_status,
    payment_intent_id: session.payment_intent.id,
    payment_intent_status: session.payment_intent.status
  });
});

app.listen(4242, () => console.log("Running on port 4242"));