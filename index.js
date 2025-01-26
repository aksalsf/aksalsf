const axios = require("axios");
const fs = require("fs");
const md = require("markdown-it")({
  html: true, // Enable HTML tags in source
  breaks: false, // Convert '\n' in paragraphs into <br>
  linkify: true, // Autoconvert URL-like text to links
});

const TIMEZONE_OFFSET = 7;

(async () => {

  const { today, hour } = getCurrentTime();
  const greetings = generateGreetings(hour);
  const snake = `![github contribution grid snake animation](https://raw.githubusercontent.com/aksalsf/aksalsf/output/github-snake-dark.svg#gh-dark-mode-only)![github contribution grid snake animation](https://raw.githubusercontent.com/aksalsf/aksalsf/output/github-snake.svg#gh-light-mode-only)`;

  const text = `### ${greetings}
    Heya 👋 I'm Aksal. I'm a software engineer from 🇮🇩 Indonesia.

    My code is like a girl (perfect and beautiful), so, I'm always found that only me who can understand her. Wkwk, just kidding.

    Mostly I code in Javascript (React, Vue, TypeScript) and PHP (Laravel, CodeIgniter). A Windows fanboy until I met Linux 😆
    <p align="center">${snake}</p>
    ![Skills Metrics](/skills-metrics.svg)
    ![Habits Metrics](/habits-metrics.svg)
    ![Social Metrics](/social-metrics.svg)
    ![Achievement Metrics](/achievement-metrics.svg)
  `;

  const content = md.renderInline(text);
  generateFile(content);

  /* Timestamp */
  console.log(`⏳ Running at ${today} UTC +0${TIMEZONE_OFFSET}:00`);
})();

function getCurrentTime() {
  const today = new Date();
  today.setHours(today.getHours() + TIMEZONE_OFFSET);
  const hour = today.getHours();
  const minute = today.getMinutes();
  // check if the hour >= 24
  if (hour >= 24) {
    return Math.abs(24 - hour);
  }
  return {
    today,
    hour,
    minute
  };
}

function isWeekend(date = getCurrentTime().today) {
  return date.getDay() === 6 || date.getDay() === 0;
}

function generateGreetings(time) {
  const goodMorning = "Good morning, it is. 😸";
  const goodAfternoon = "Good afternoon 👋";
  const goodEvening = "Good evening 👋";
  const goodNight = "Nite nite 😴";
  const happyWeekend = "Happy weekend 🥰";

  if (isWeekend()) {
    return happyWeekend;
  }
  if (time >= 4 && time < 11) {
    return goodMorning;
  }
  if (time >= 11 && time < 16) {
    return goodAfternoon;
  }
  if (time >= 16 && time < 23) {
    return goodEvening;
  }
  return goodNight;
}

function generateFile(contents) {
  const targetFile = "README.md";
  fs.writeFile(targetFile, contents, function (err) {
    if (err) return console.log(`⛔ [FAILED]: ${err}`);
    console.log("✅ [SUCCESS]: README.md has been generated.");
  });
}
