const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

// Your SP108E controller IP
const CONTROLLER_IP = "192.168.10.167";

// List of commands
const commands = {
  on: "/win&T=1",
  off: "/win&T=0",

  // Solid colors
  red: "/win&R=255&G=0&B=0",
  green: "/win&R=0&G=255&B=0",
  blue: "/win&R=0&G=0&B=255",
  white: "/win&R=255&G=255&B=255",
  yellow: "/win&R=255&G=255&B=0",
  purple: "/win&R=128&G=0&B=128",
  cyan: "/win&R=0&G=255&B=255",

  // Patterns using FX codes (from WLED-like FX list)
  rainbow: "/win&FX=37",
  rainbowCycle: "/win&FX=38",
  colorWipe: "/win&FX=3",
  theaterChase: "/win&FX=5",
  glitter: "/win&FX=44",
  scan: "/win&FX=14",
  twinkle: "/win&FX=51",
  flash: "/win&FX=65",
  fade: "/win&FX=99",
  fire: "/win&FX=72",
  runningLights: "/win&FX=12",
  chaseWhite: "/win&FX=6",
  chaseRainbow: "/win&FX=9",
  strobe: "/win&FX=68",
};

app.get("/led/:mode", async (req, res) => {
  const mode = req.params.mode.toLowerCase();

  if (!commands[mode]) {
    return res.status(400).send(
      `Invalid mode.\nAvailable modes:\n${Object.keys(commands).join(", ")}`
    );
  }

  const url = `http://${CONTROLLER_IP}${commands[mode]}`;

  try {
    await axios.get(url);
    res.send(`LED pattern set to "${mode}"`);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Failed to communicate with SP108E");
  }
});

app.listen(port, () => {
  console.log(`SP108E LED controller server running at http://localhost:${port}`);
});
