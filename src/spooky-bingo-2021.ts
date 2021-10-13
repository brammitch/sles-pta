import fs from "fs";
import path from "path";
import csv from "fast-csv";
import pickRandom from "pick-random";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface CsvData {
  student_first_name: string;
  student_last_name: string;
  email: string;
  one_ticket: string;
  ten_ticket: string;
  twenty_ticket: string;
  total_tickets: string;
}

interface FormattedCsvData {
  student_name: string;
  email: string;
  tickets: number;
}

const data: FormattedCsvData[] = [];
const entries: string[] = [];

fs.createReadStream(path.resolve(__dirname, "assets", "raffle-test.csv"))
  .pipe(csv.parse({ headers: true }))
  .on("error", (error) => console.error(error))
  .on("data", (row: CsvData) =>
    data.push({
      student_name: `${row.student_first_name} ${row.student_last_name}`,
      email: row.email,
      tickets: parseInt(row.total_tickets),
    })
  )
  .on("end", () => {
    data.forEach((d) => {
      // add one entry per student for each ticket purchased
      for (let i = 1; i <= d.tickets; i++) {
        entries.push(`${d.student_name} ${d.email}`);
      }
    });

    const winners = pickRandom(entries, { count: 7 });
    console.log("winners", winners);
  });
