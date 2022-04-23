const md = require("markdown-it")({
  html: true, // Enable HTML tags in source
  breaks: true, // Convert '\n' in paragraphs into <br>
  linkify: true, // Autoconvert URL-like text to links
});
const fs = require("fs");

const locale = "id-ID";
const timezone = "Asia/Jakarta";

(() => {

  const greetings = generateGreetings(getCurrentTime());
  const introduction = "I am a developer. I solve problems, but sometimes I also create them.";
  const advise = generateAdvise(getCurrentTime());

  const text = `### ${greetings}. Hello, I'm Aksal.
    ${introduction}
    Nice to meet you!
    Note: ${advise}
  `;

  const result = md.render(text);

  fs.writeFile("README.md", result, function (err) {
    if (err) return console.log(err);
    console.log(`${result} > README.md`);
  });
})();

function getCurrentTime() {
  const currentTime = new Date()
    .getHours()
    .toLocaleString(locale, { timezone });
  return currentTime;
}

function generateGreetings(time) {
  const goodMorning = "Good morning";
  const goodAfternoon = "Good afternoon";
  const goodEvening = "Good evening";
  const goodNight = "Good night";

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

function generateAdvise(time) {
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
  return "Time to sleep! Have a nice dream!";
}