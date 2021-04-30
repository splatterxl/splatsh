import { format } from "util";
import { InbuiltCommand } from "../classes";
import { ExitCodes } from "../constants";

export default class Printf extends InbuiltCommand {
  public usage = "printf <FORMAT> [ARGUMENTS...]";
  public invoke() {
    const formatSr = this.args.shift() ?? "";
    return { out: format(formatSr, ...this.args), code: ExitCodes.SUCCESS };
  }
}
