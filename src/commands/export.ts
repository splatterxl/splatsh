import { InbuiltCommand } from "../classes";
import { ExitCodes } from "../constants";

export default class Which extends InbuiltCommand {
  declare usage: "KEY=VALUE";
  async invoke() {
    if (!this.args.length)
      return {
        out:
          Object.entries(process.env)
            .map(([key, value]) => `${key}=${value}`)
            .join("\n") + "\n",
        code: ExitCodes.SUCCESS
      };

    const [key, value] = this.args[0].split("=");
    if (!key || !value) return { out: "", code: ExitCodes.ERROR };

    process.env[key] = value;
    return { out: "", code: ExitCodes.SUCCESS };
  }
}
