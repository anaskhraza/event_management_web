import { exec } from "child_process";

export const run = () => {
  const dumpTask = exec(`npm run open-server`);
};
