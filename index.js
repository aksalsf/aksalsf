const fs = require("fs");
const md = require("markdown-it")({
  html: true, // Enable HTML tags in source
  breaks: false, // Convert '\n' in paragraphs into <br>
  linkify: true, // Autoconvert URL-like text to links
});
const { parse } = require("rss-to-json");

const MEDIUM_RSS_URL = "https://medium.com/feed/@aksalsf";
const TIMEZONE_OFFSET = 7;

(async () => {

  const [hour, minute] = getCurrentTime();
  const greetings = generateGreetings(hour);
  const tip = getTips(hour);
  const snake = `![github contribution grid snake animation](https://raw.githubusercontent.com/aksalsf/aksalsf/output/github-contribution-grid-snake-dark.svg#gh-dark-mode-only)![github contribution grid snake animation](https://raw.githubusercontent.com/aksalsf/aksalsf/output/github-contribution-grid-snake.svg#gh-light-mode-only)`;

  const mediumPosts = await fetchMyMediumPosts(MEDIUM_RSS_URL)
      .then(response => response.items
          .slice(0, 6)
          ?.map(post => (`- [${post?.title}](${post.link})`))
          .join("\n")
      );

  const text = `### ${greetings}
    Heya 👋 I'm Aksal. I'm a software engineer from 🇮🇩 Indonesia.

    My code is like a girl (perfect and beautiful), so, I'm always found that only me who can understand her. Wkwk, just kidding.

    Mostly I code in Javascript (React, Vue, TypeScript) and PHP (Laravel, CodeIgniter). A Windows fanboy until I met Linux 😆
    ### I'm also writing some stories on Medium
    ${mediumPosts}
    <p align="center">${snake}</p>
    ![Skills Metrics](/skills-metrics.svg)
    ![Habits Metrics](/habits-metrics.svg)
    ![Social Metrics](/social-metrics.svg)
    ![Achievement Metrics](/achievement-metrics.svg)
    *"${tip}"*
  `;

  const content = md.renderInline(text);
  generateFile(content);

  /* Timestamp */
  console.log(`⏳ Running at ${hour.toString().padStart(2, "0")}:${minute} GMT+7`);
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
  return [hour, minute];
}

function isWeekend(date = new Date()) {
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
  if (time >= 4 && time < 12) {
    return goodMorning;
  }
  if (time >= 12 && time < 16) {
    return goodAfternoon;
  }
  if (time >= 16 && time < 23) {
    return goodEvening;
  }
  return goodNight;
}

function getTips(time) {
  if (isWeekend()) {
    return "Cheers, mate. No work, just chill. Cool, yeh!";
  }
  if (time >= 4 && time < 8) {
    return "Even though the morning air is good, it is better to not open your Windows.";
  }
  if (time >= 8 && time < 12) {
    return "Wanna advice? Don't start your day with any meeting. Start with code!";
  }
  if (time >= 12 && time < 13) {
    return "A good programmer always collaborating, even when having lunch!";
  }
  if (time >= 13 && time < 18) {
    return "Don't be too fond of keeping bugs, Buddy. Release it~";
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

async function fetchMyMediumPosts(rssUrl) {
  return await parse(rssUrl).then(rss => rss)
}
