
const { exec } = require("child_process");

export const run = (req, res) => {
  const dumpTask = exec(`node dist/distServer`);
};
