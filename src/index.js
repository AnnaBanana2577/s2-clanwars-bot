import { config as loadEnvVars } from "dotenv";
import { QuickDB } from "quick.db";
import {
  Client,
  GatewayIntentBits,
  ActivityType,
  REST,
  Routes,
} from "discord.js";

import path from "path";
import url from "url";
import fs from "fs";

loadEnvVars();

export const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const database = new QuickDB();
const commandData = [];
const commandHandlers = new Map();

const db = {
  players: database.table("players"),
  clans: database.table("clans"),
};

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);
  client.user.setPresence({
    activities: [{ name: "Soldat 2", type: ActivityType.Competing }],
  });
  await loadCommands(path.resolve("src", "commands"));
  await registerCommands();
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = commandHandlers.get(interaction.commandName);
  if (!command) return;
  command({ interaction, db }).catch((e) => console.log(e));
});

client.login(process.env.BOT_TOKEN);

// --------------------------------------

async function loadCommands(dir) {
  const files = fs.readdirSync(dir);
  for await (const file of files) {
    const p = `${dir}/${file}`;
    if (fs.lstatSync(p).isDirectory()) await loadCommands(p);
    else {
      const module = await import(url.pathToFileURL(p));
      const command = module.data.toJSON();
      commandData.push(command);
      commandHandlers.set(command.name, module.execute);
    }
  }
}

async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);
  await rest.put(
    Routes.applicationGuildCommands(
      process.env.APPLICATION_ID,
      process.env.GUILD_ID
    ),
    { body: commandData }
  );
}
