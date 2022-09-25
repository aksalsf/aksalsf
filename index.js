const axios = require("axios");
const fs = require("fs");
const md = require("markdown-it")({
  html: true, // Enable HTML tags in source
  breaks: false, // Convert '\n' in paragraphs into <br>
  linkify: true, // Autoconvert URL-like text to links
});
const { parse } = require("rss-to-json");

const MEDIUM_RSS_URL = "https://medium.com/feed/@aksalsf";
const TIMEZONE_OFFSET = 7;
const ANIME_API_URL = "https://animechan.vercel.app/api/random";
const PROGRAMMER_API_URL = "https://programming-quotes-api.herokuapp.com/Quotes/random";

(async () => {

  const { today, hour } = getCurrentTime();
  const greetings = generateGreetings(hour);
  const { quote, author } = await getQuotes(hour);
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
    ### Hey there, down here 👋 Want to read something cool?
    ${mediumPosts}
    <p align="center">${snake}</p>
    ![Skills Metrics](/skills-metrics.svg)
    ![Habits Metrics](/habits-metrics.svg)
    ![Social Metrics](/social-metrics.svg)
    ![Achievement Metrics](/achievement-metrics.svg)
    *"${quote}"* <br>
    — ${author}
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

async function getQuotes(time) {
  if (isWeekend()) {
    if (time >= 4 && time < 23) {
      return await axios
        .get(ANIME_API_URL)
        .then(response => ({
          quote: response.data.quote,
          author: `${response.data.character} (${response.data.anime})`
        }))
    }
    return {
      quote: "Cheers, mate. No work, just chill. Cool, yeh!",
      author: "Aksal"
    };
  }
  if (time >= 4 && time < 8) {
    return {
      quote: "Even though the morning air is good, it is better to not open your Windows.",
      author: "Aksal"
    };
  }
  if (time >= 8 && time < 11) {
    return {
      quote: "Wanna advice? Don't start your day with any meeting. Start with code!",
      author: "Aksal"
    };
  }
  if (time >= 11 && time < 13) {
    return {
      quote: "A good programmer always collaborating, even when having lunch!",
      author: "Aksal"
    };
  }
  if (time >= 13 && time < 18) {
    return await axios
        .get(PROGRAMMER_API_URL)
        .then(response => ({
          quote: response.data.en,
          author: response.data.author
        }));
  }
  if (time >= 18 && time < 20) {
    return {
      quote: "Time to home!",
      author: "Aksal"
    };
  }
  if (time >= 20 && time < 23) {
    return {
      quote: "Take a good book to bed with you—books do not snore.",
      author: "Aksal"
    };
  }
  return {
    quote: "Have a nice dream!",
    author: "Aksal"
  };
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
