const fs = require("fs");
const md = require("markdown-it")({
  html: true, // Enable HTML tags in source
  breaks: true, // Convert '\n' in paragraphs into <br>
  linkify: true, // Autoconvert URL-like text to links
});

const TIMEZONE_OFFSET = 7;

(() => {

  const [now, minute] = getCurrentTime();
  const greetings = generateGreetings(now);
  const tip = getTips(now);
  const snake = `![github contribution grid snake animation](https://raw.githubusercontent.com/aksalsf/aksalsf/output/github-contribution-grid-snake-dark.svg#gh-dark-mode-only)![github contribution grid snake animation](https://raw.githubusercontent.com/aksalsf/aksalsf/output/github-contribution-grid-snake.svg#gh-light-mode-only)`;

  const text = `### ${greetings}
    Hi there 👋 I'm Aksal. I'm a software engineer from 🇮🇩 Indonesia working to solve problems, but sometimes also create them.

    My code is like a girl (perfect and beautiful) so I'm always found that only me who can understand her. Wkwk, just kidding.

    Mostly I code in Javascript (React, Vue) and PHP (Laravel, CodeIgniter). I'm also a big fan of Windows until I met Linux 😆.

    Nice to meet you!

    ${snake}

    💡 Tip: ${tip}
  `;

  const content = md.renderInline(text);
  generateFile(content);

  /* Timestamp */
  console.log(`⏳ Running at ${now.toString().padStart(2, "0")}:${minute} GMT+7`);
})();

function getCurrentTime() {
  const now = new Date();
  now.setHours(now.getHours() + TIMEZONE_OFFSET);
  const hour = now.getHours();
  const minute = now.getMinutes();
  // check if now >= 24
  if (hour >= 24) {
    return Math.abs(24 - hour);
  }
  return [hour, minute];
}

function generateGreetings(time) {
  const goodMorning = "Good morning, it is. 😸";
  const goodAfternoon = "Good afternoon 👋";
  const goodEvening = "Good evening 👋";
  const goodNight = "Nite nite 😴";

  if (time >= 4 && time < 12) {
    return goodMorning;
  }
  if (time >= 12 && time < 16) {
    return goodAfternoon;
  }
  if (time >= 16 && time < 18) {
    return goodEvening;
  }
  return goodNight;
}

function getTips(time) {
  if (time >= 4 && time < 8) {
    return "Even though the morning air is good, but it is better to not open your windows.";
  }
  if (time >= 8 && time < 12) {
    return "Have a good day!";
  }
  if (time >= 12 && time < 13) {
    return "I know you are a great programmer, but please don't eat lunch alone.";
  }
  if (time >= 13 && time < 18) {
    return "Great. Now, please write your code and make sure only you know what the hell is this.";
  }
  if (time >= 18 && time < 20) {
    return "Time to home!";
  }
  if (time >= 20 && time < 23) {
    return "Take a good book to bed with you—books do not snore.";
  }
  return "Have a nice dream!";
}

function generateFile(contents) {
  const targetFile = "README.md";
  fs.writeFile(targetFile, contents, function (err) {
    if (err) return console.log(`⛔ [FAILED]: ${err}`);
    console.log("✅ [SUCCESS]: README.md has been generated.");
  });
}
