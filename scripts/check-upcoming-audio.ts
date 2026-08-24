import { getTodaySong } from "../src/lib/daily-song";

async function main() {
  const start = new Date();
  const days = 14;
  const results = [];

  for (let i = 0; i < days; i++) {
    const date = new Date(start);
    date.setUTCDate(date.getUTCDate() + i);
    const song = getTodaySong(date);
    try {
      const response = await fetch(song.audioUrl, { method: "HEAD" });
      results.push({
        date: date.toISOString().slice(0, 10),
        status: response.status,
        ok: response.ok,
        title: song.displayName,
        url: song.audioUrl,
      });
    } catch (error) {
      results.push({
        date: date.toISOString().slice(0, 10),
        status: 0,
        ok: false,
        title: song.displayName,
        url: song.audioUrl,
        error: String(error),
      });
    }
  }

  for (const result of results) {
    console.log(`${result.ok ? "OK" : "FAIL"} ${result.status} ${result.date} ${result.title}`);
  }

  const failed = results.filter((result) => !result.ok);
  if (failed.length > 0) {
    console.error(`\n${failed.length} daily songs have unreachable audio`);
    process.exit(1);
  }
}

main();
