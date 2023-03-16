import { db, generalChannel } from "../index.js";
import { WebSocket } from "ws";
import { ButtonBuilder, EmbedBuilder } from "@discordjs/builders";
import { ActionRowBuilder, ButtonStyle, ComponentType } from "discord.js";
import uuid4 from "uuid4";

const servers = [
  {
    ip: "45.32.232.20",
    port: 2300,
    rconPort: 2500,
  },
];

export async function checkToStartClanWar() {
  const clans = await getReadiedClans();
  if (!clans) return;
}

//Func 1
async function getReadiedClans() {
  const clans = await db.clans.all();
  const readiedClans = clans.filter((c) => c.value.readyPlayers >= 3);
  if (readiedClans.length > 2) return false;
  else return readiedClans.slice(0, 1);
}

//Func 2
export async function getEmptyServer() {
  let ret = false;
  for await (const server of servers) {
    const isEmpty = await isServerEmpty(server);
    if (isEmpty) {
      ret = server;
      break;
    }
  }
  return ret;
}

//Func 3
async function startMatch(server, clans) {
  //unready players
  const team1 = [...clans[0].value.readyPlayers];
  const team2 = [...clans[1].value.readyPlayers];
  clans[0].value.readyPlayers = [];
  clans[1].value.reaadyPlayers = [];
  await db.clans.set(clans[0].id, clans[0].value);
  await db.clans.set(clans[1].id, clans[1].value);
  //setpassword
  const password = await setServerPassword(server);
  if (!password) return console.log(`Error setting servor password`);

  //send joining info
  const embed = new EmbedBuilder()
    .setTitle(`${clans[0].id} vs ${clans[1].id} Clan War Started!`)
    .setDescription(
      "The match is starting now, please get the server joining info from the button below"
    )
    .addFields(
      { name: `${clans[0].id}`, value: `${team1.join("\n")}` },
      { name: `${clans[1].id}`, value: `${team2.join("\n")}` }
    );

  const joinButtonId = uuid4();
  const joinButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Primary)
    .setLabel("Join Clan War")
    .setCustomId(`${joinButtonId}`);

  const collector = generalChannel.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 4 * 60 * 1000,
  });

  generalChannel.send({
    embeds: [embed],
    components: [new ActionRowBuilder().addComponents(joinButton)],
  });

  collector.on("collect", (i) => {
    if (i.customId !== joinButtonId) return;
    i.reply({
      content: `s2://${server.ip}:${server.port}\nPassword: ${password}`,
      ephemeral: true,
    });
  });
}

//-----------------------------------------

function setServerPassword(server) {
  return new Promise((res) => {
    const password = generatePassword(5);
    const ws = new WebSocket(`ws://${server.ip}:${server.rconPort}/rcon`);
    ws.on("open", () => ws.send(process.env.RCON_PASS));
    ws.on("message", (data) => {
      if (data.includes("verified"))
        return ws.send(`Set ServerPassword ${password}`);
      else if (data.includes("ServerPassword ="))
        return res(password) || ws.close();
    });
    ws.on("error", () => res(false) || ws.close());
    ws.on("close", () => res(false));
  });
}

function isServerEmpty(server) {
  return new Promise((res) => {
    const ws = new WebSocket(`ws://${server.ip}:${server.rconPort}/rcon`);

    ws.on("open", () => ws.send(process.env.RCON_PASS));
    ws.on("message", (data) => {
      if (data.includes("verified")) return ws.send("ListPlayers");
      else if (data.includes("SERVER EMPTY")) res(true) || ws.close();
      else if (data.includes("spawned")) res(false) || ws.close();
    });
    ws.on("close", () => res(false));
    ws.on("error", () => res(false) || ws.close());
  });
}

function generatePassword(length) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
