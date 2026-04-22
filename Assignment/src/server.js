const { createApp } = require("./app");

const port = Number(process.env.PORT || 4000);
const app = createApp();

app.listen(port, () => {
  process.stdout.write(`Secure financial API listening on ${port}\n`);
});
