if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const PORT = process.env.PORT || 5001;
const Discord = require("discord.js");
const client = new Discord.Client();

const express = require("express");
const mongoose = require("mongoose");
const { Weight } = require("./weightModel");
const app = express();

mongoose.connect(
  process.env.MONGODB_URI,
  { useUnifiedTopology: true, useNewUrlParser: true },
  () => {
    console.log("DB connected...");
  }
);

const prefix = "bamzi";

client.on("message", async (message) => {
  // Only non bot users
  if (message.author.bot) return;

  const modMessage = message.content.toLowerCase();
  const args = modMessage.split(" ");
  // first letter is prefix
  if (args[0] != prefix) return;

  console.log(args);

  if (args[1] === "ping") {
    const timeTaken = Date.now() - message.createdTimestamp;
    message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
  }

  if (args[1] === "weight") {
    if (args.length != 3) {
      const timeTaken = Date.now() - message.createdTimestamp;
      message.reply(
        `Recheck the command again plems. Latency: ${timeTaken}ms.`
      );
      return;
    }
    try {
      const name = message.author.username;
      const weight = Number(args[2]);
      const newWeight = new Weight({
        name,
        weight,
      });
      const saveWeight = await newWeight.save();
      const timeTaken = Date.now() - message.createdTimestamp;
      message.reply(
        `Hmmm! Stored successfully. Storing ID: ${saveWeight._id} Latency: ${timeTaken}ms.`
      );
    } catch (err) {
      console.log(err);
      const timeTaken = Date.now() - message.createdTimestamp;
      message.reply(`Something is wrong with me. Latency: ${timeTaken}ms.`);
    }
  }

  if (args[1] === "delete") {
    if (args.length != 3) {
      const timeTaken = Date.now() - message.createdTimestamp;
      message.reply(
        `Recheck the command again plems. Latency: ${timeTaken}ms.`
      );
      return;
    }
    try {
      const name = message.author.username;
      const user_id = args[2];

      const info = await Weight.findById(user_id);

      if (info.name != name) {
        const timeTaken = Date.now() - message.createdTimestamp;
        message.reply(
          `No access to delete this entry. Latency: ${timeTaken}ms.`
        );
        return;
      }
      const deleteInfo = await Weight.deleteOne({ _id: user_id });
      // console.log(deleteInfo);

      const timeTaken = Date.now() - message.createdTimestamp;
      message.reply(`Hmmm! Deleted successfully. Latency: ${timeTaken}ms.`);
    } catch (err) {
      console.log(err);
      const timeTaken = Date.now() - message.createdTimestamp;
      message.reply(`Something is wrong with me. Latency: ${timeTaken}ms.`);
    }
  }

  if (args[1] === "show") {
    try {
      const name = message.author.username;

      const timeTaken = Date.now() - message.createdTimestamp;
      message.reply(
        `Go here ${process.env.URI}/${name} !. Latency: ${timeTaken}ms.`
      );
    } catch (err) {
      console.log(err);
      const timeTaken = Date.now() - message.createdTimestamp;
      message.reply(`Something is wrong with me. Latency: ${timeTaken}ms.`);
    }
  }
});

client.login(process.env.BOT_TOKEN);

app.get("/:id", async (req, res) => {
  const info = await Weight.find({ name: req.params.id });
  res.json(info);
});

app.listen(PORT, (err) => {
  console.log(`Listening at http://localhost:${PORT}`);
});
