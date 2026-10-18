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

app.command("/matbot-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Yooo, also check other commands\nLatensee: ${latency}ms` });
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

  await respond("Bruh, wut u wrote , i cant understand 😭, or maybe i am not currently able to do");
  }
});

app.command("/matbot-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`Available Commands:
/matbot-solve - Solve a math problem (use ^ for powers, e.g., 2^3 and for multiplication, e.g., 2*3, you can solve equations, parentheses and basic calculations and arithmetic)
/matbot-catfact - Get a cat fact
/matbot-joke - Get a random joke
/matbot-help - Show this help message
/matbot-ping - Check the bot's latency
/matbot-random - Get a random motivational sentence
/matbot-ideas - Get a random idea
/matbot-ascii - Get a random ASCII art
/matbot-facts - Get a random useless fact`
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

app.command("/matbot-random", async ({ command, ack, respond }) => {
  await ack();
  
  const sentences = [
    "bruh, dont expect motivational quotes from me",
    "i am a human, i am not a bot",
    "i am a bot, i am not a human",
    "i am a bot, i am not a bot",
    "bruh, just sleep, although i wont solve ur problems",
    "bro, work hard though , sry, u wont succeed, jk",
    "bro, u wil succeed",
    "succeed in another life :)",
    "bro, dont get angry",
    "bro , idk ur problem but just chill, i am not a therapist",
    "here is the only advice i can give u, just chill and relax, dont get angry, dont get sad, just be happy",
  ];
  
  const randomIndex = Math.floor(Math.random() * sentences.length);
  const randomSentence = sentences[randomIndex];  

  await respond({ text: randomSentence });
});

app.command("/matbot-ideas", async ({ command, ack, respond }) => {
  await ack();

   try {
    const response = await axios.get("https://bored-api.appbrewery.com/random");
    await respond({ text: `Idea:\n${response.data.activity}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a idea." });
  }
});

app.command("/matbot-ascii", async ({ command, ack, respond }) => {

  await ack();
  const sentences = [
">----(^_^)----<",
">----(o_o)----<",
" >----(>_<)----<",
" >----(T_T)----<",
" >----(¬_¬)----<",
" >----(O_O)----<",
" >----(^_^;)----<",
" >----(¬_¬;)----<",
" >----(>_<;)----<",
" >----(T_T;)----<",
" >----(O_O;)----<",
" >----(^_^;)----<",
" >----(¬_¬;)----<",
" >----(>_<;)----<",
" >----(T_T;)----<",
" >----(O_O;)----<",
"(+_+)",
"^-^",
"(-_-)zzz",
"(=_=)",
"<'(o.o)'>",
"(o_^)",
"(-'.'-)",
"@('_')@",
  ];
  
  const randomIndex = Math.floor(Math.random() * sentences.length);
  const randomSentence = sentences[randomIndex];  

  await respond({ text: randomSentence });
});


app.command("/matbot-facts", async ({ command, ack, respond }) => {
  await ack();

   try {
    const response = await axios.get("https://uselessfacts.jsph.pl/api/v2/facts/random?language=en");
    await respond({ text: ` *Useless Fact:* ${response.data.text}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a fact." });
  }
});