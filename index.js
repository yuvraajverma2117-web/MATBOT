const axios = require("axios");
const math = require("mathjs");
const nerdamer = require("nerdamer/all");

require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/matbot-solve", async ({ command, ack, respond }) => {
  await ack();
  const originalQuestion = command.text.trim();
   
  if (originalQuestion.length === 0) {
    await respond("Bro ig quetsion was sucked by blackhole , didn't receive it 💀");
    return;
  }

  
let question = originalQuestion;
question = question.replace(/²/g, "^2");
question = question.replace(/³/g, "^3");


   question = question.replace(/(\d)([a-zA-Z])/g, "$1*$2");

   question = question.replace(/(\d)\(/g, "$1*(");
   question = question.replace(/([a-zA-Z])\(/g, "$1*(");
   question = question.replace(/\)\(/g, ")*(");
   question = question.replace(/\)(\d)/g, ")*$1");

  try {
  
    if (question.includes("=")) {

      const answer = nerdamer.solveEquations(question, "x");

    await respond(
        `Problem: ${originalQuestion}\nAnswer: x = ${answer}`
      );

    } else {

      // Otherwise just calculate it normally
      const answer = math.evaluate(question);

 await respond(
        `Problem: ${originalQuestion}\nAnswer: ${answer}`
      );
    }

  } catch (error) {
    console.log(error);

  await respond("Bruh, wut u wrote , i cant understand 😭");
  }
});

app.command("/matbot-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`Available Commands:
/matbot-solve - Check bot latency
/matbot-catfact - Get a cat fact`
  });
});

app.command("/matbot-catfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});

app.command("/matbot-joke", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({
      text:
`${response.data.setup}

${response.data.punchline}`
    });
  } catch (err) {
    await respond({ text: "Failed to fetch a joke." });
  }
});
(async () => {
  await app.start();

  console.log("⚡ MATBOT is running!");
})();