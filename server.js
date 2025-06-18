const express = require("express");
const { sp108e } = require("sp108e"); // local modified lib if needed

const client = new sp108e({ host: "192.168.10.167", port: 8189 });
const app = express();

app.get("/on", async (req, res) => {
  await client.on();
  res.send("LED ON");
});

app.get("/off", async (req, res) => {
  await client.off();
  res.send("LED OFF");
});

app.get("/color/:hex", async (req, res) => {
  await client.setColor(req.params.hex);
  res.send(`Color set to ${req.params.hex}`);
});

app.get("/brightness/:level", async (req, res) => {
  const level = parseInt(req.params.level);
  await client.setBrightness(level);
  res.send(`Brightness set to ${level}`);
});

app.get("/pattern/:id", async (req, res) => {
  try {
    const patternId = parseInt(req.params.id);
    if (patternId < 1 || patternId > 180) {
      return res.status(400).send("Invalid pattern ID. Use 1-180.");
    }
    await client.setDreamMode(patternId);
    res.send(`Pattern set to ${patternId}`);
  } catch (err) {
    console.error("Error setting pattern:", err);
    res.status(500).send("Failed to set pattern");
  }
});

app.get("/speed/:value", async (req, res) => {
  try {
    const speed = parseInt(req.params.value);
    if (isNaN(speed) || speed < 0 || speed > 255) {
      return res.status(400).send("Speed must be between 0 and 255");
    }
    await client.setAnimationSpeed(speed);
    res.send(`Animation speed set to ${speed}`);
  } catch (err) {
    console.error("Error setting speed:", err);
    res.status(500).send("Failed to set animation speed");
  }
});


app.get("/rainbow", async (req, res) => {
  await client.setDreamMode(1); // Rainbow pattern
  res.send("Rainbow pattern activated");
});

app.get("/next", async (req, res) => {
  const status = await client.getStatus();
  let next = status.animationMode + 1;
  if (next > 180) next = 1;
  await client.setDreamMode(next);
  res.send(`Next pattern: ${next}`);
});

app.get("/previous", async (req, res) => {
  const status = await client.getStatus();
  let prev = status.animationMode - 1;
  if (prev < 1) prev = 180;
  await client.setDreamMode(prev);
  res.send(`Previous pattern: ${prev}`);
});

app.listen(3000, () => console.log("Bridge running on port 3000"));
