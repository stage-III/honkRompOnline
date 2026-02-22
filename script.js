const API_KEY = "AIzaSyA5BT-4B2IICqKA8mwG5eyajHu4S2ACICY";
const CALENDAR_ID =
  "220abdded995df9844ade3dce297295f6d13b13b67a4d6cd2f1c8da267922757@group.calendar.google.com";

const url =
  `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?` +
  new URLSearchParams({
    key: API_KEY,
    singleEvents: true,
    orderBy: "startTime",
    timeMin: new Date().toISOString(),
  });

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    const container = document.getElementById("gigList");

    data.items.forEach((event) => {
      const li = document.createElement("li");
      let tickets = "";

      if (event.description != null) {
        tickets = `&bigstar; <a
            href="${event.description}"
            >Tickets</a
          >`;
      }

      const startDate = new Date(event.start.dateTime);

      li.innerHTML = `${startDate.getFullDate()} &bigstar; ${event.summary} ${tickets}`;

      container.appendChild(li);
    });
  })
  .catch((error) => console.error("Error loading calendar: ", error));
