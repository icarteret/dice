const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/roll", (req, res) => {
  let expression = req.query.expression || "1d20";

  const match = expression.match(/^(\d+)d(\d+)(\+(\d+))?$/);
  if (!match) {
    return res.status(400).json({ error: "Format invalide. Exemple: 1d20 ou 2d6+3" });
  }

  const [, diceCount, diceSides, , bonusStr] = match;
  const count = parseInt(diceCount);
  const sides = parseInt(diceSides);
  const bonus = parseInt(bonusStr || "0");

  const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
  const total = rolls.reduce((a, b) => a + b, 0) + bonus;

  res.json({ expression, rolls, bonus, total });
});

app.listen(PORT, () => {
  console.log(`API Dice en ligne sur le port ${PORT}`);
});
