export async function getReadiedStatus(db) {
  const clans = await db.clans.all();
  const readiedClans = clans.filter(c => c.value.readyPlayers.length > 0);
  const formattedReadyClans = readiedClans.map(c => {
    return {
      name: c.id,
      players: c.value.readyPlayers,
    };
  });
  return formattedReadyClans;
}
