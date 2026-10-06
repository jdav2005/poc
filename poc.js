const output = document.getElementById("output");

fetch(
  "https://portfolio.stonehagefleming.com/LOSSPI-external/2.0/authn/renew",
  {
    method: "GET",
    credentials: "include"
  }
)
.then(async response => {
  const body = await response.text();

  output.textContent =
    "Origin: " + location.origin +
    "\nStatus: " + response.status +
    "\n\nResponse:\n" + body;
})
.catch(error => {
  output.textContent =
    "Origin: " + location.origin +
    "\n\nRequest failed:\n" + error;
});
