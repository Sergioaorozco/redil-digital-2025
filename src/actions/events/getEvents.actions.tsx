import { defineAction, ActionError } from "astro:actions";
import { GOOGLE_SHEET_API_KEY } from "astro:env/server";

const spreadsheetId = "1h8MK9ho99x2FpeSQSDQIeAxO07i4hjObJ8cZXNiUwRU"

export const getEvents = defineAction({
  handler: async () => {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/events!A2:D100?key=${GOOGLE_SHEET_API_KEY}`);

    const { values, error } = await response.json();
    if (error) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: error?.message || "Error al obtener los eventos"
      })
    }

    return values.map((event: any) => {
      const [title, description, dateStr, time = "9:00pm"] = event;

      const [day, month, year] = dateStr.split("/");
      const date = new Date(Number(year), Number(month) - 1, Number(day));

      return {
        title,
        description,
        date: date,
        time
      }
    })
  }
})
