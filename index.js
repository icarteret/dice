import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/roll", (req, res) => {
  const expression = req.query.expression || "1d20";
  const match = expression.match(/^(\d*)d(\d+)([+-]\d+)?$/);

  if (!match) {
    return res.status(400).json({ error: "Expression invalide" });
  }

  const [, diceCountStr, sidesStr, bonusStr] = match;
  const diceCount = parseInt(diceCountStr || "1", 10);
  const sides = parseInt(sidesStr, 10);
  const bonus = parseInt(bonusStr || "0", 10);

  if (sides <= 0 || diceCount <= 0) {
    return res.status(400).json({ error: "Paramètres invalides" });
  }

  const rolls = Array.from({ length: diceCount }, () =>
    Math.floor(Math.random() * sides) + 1
  );
  const total = rolls.reduce((a, b) => a + b, 0) + bonus;

  res.json({ expression, rolls, bonus, total });
});

app.get("/healthz", (req, res) => {
  res.status(200).send("OK");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API ready on port ${port}`);
});
