// Netlify Function: proxies GET/POST to Google Apps Script.
// Runs server-to-server on Netlify's infrastructure, so browser CORS/CORP
// restrictions (which blocked direct calls to script.google.com) don't apply here.

const SHEETS_URL = "https://script.google.com/macros/s/AKfycbyJ2n49i6FT-0TWNliONyZK7bOQb3oF7aVerD-p0aTnV9XNYiLOLksymA29vOIYo53O/exec";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: CORS_HEADERS, body: "" };
  }

  try {
    if (event.httpMethod === "GET") {
      const resp = await fetch(SHEETS_URL);
      const text = await resp.text();
      return {
        statusCode: 200,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        body: text,
      };
    }

    if (event.httpMethod === "POST") {
      await fetch(SHEETS_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: event.body,
      });
      return {
        statusCode: 200,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        body: JSON.stringify({ ok: true }),
      };
    }

    return { statusCode: 405, headers: CORS_HEADERS, body: "Method not allowed" };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      body: JSON.stringify({ error: e.message }),
    };
  }
};
