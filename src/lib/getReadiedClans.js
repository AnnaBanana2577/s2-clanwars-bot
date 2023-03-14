export async function getReadiedClans(db) {
  const clans = await db.clans.all();
  const readiedClans = clans.filter(c => c.value.readyPlayers >= 3);
  return readiedClans;
}
