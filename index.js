require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const fs = require("fs");
const API_KEY = process.env.API_KEY;
const CALENDAR_ID = process.env.CALENDAR_ID;
const url =
  `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?` +
  new URLSearchParams({
    key: API_KEY,
    singleEvents: true,
    orderBy: "startTime",
    timeMin: new Date().toISOString(),
  });

app.set("trust proxy", 1);
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(helmet());

app.get("/", async (req, res) => {
  const html = await fs.promises.readFile(__dirname + "/index.html", "utf-8");
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      let container = "";
      data.items.forEach((event) => {
        let tr = "<tr>";
        let tickets = "";

        if (isValidHttpUrl(event.description)) {
          tickets = `<a
                href="${event.description}"
                target="_blank"
                >Tickets</a
                >`;
        }

        const startDate = new Date(event.start.dateTime);

        tr =
          tr +
          `<td>${startDate.toLocaleDateString("en-gb")}</td><td>${event.summary}</td><td>${tickets}</td></tr>`;
        container += tr;
      });
      const result = html.replace("<!-- GIG_LIST -->", container);
      res.send(result);
    })
    .catch((error) => {
      console.error("Error loading calendar: ", error);
      res.status(500).send("Calendar fetch failed");
    });
});
app.use(express.static("."));

app.listen(3000);

function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}
