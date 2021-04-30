import { InbuiltCommand } from "../classes";

export default class Exit extends InbuiltCommand {
  public usage = "exit CODE";
  public invoke(): never {
    if (this.args[0] && !isNaN(+this.args[0])) process.exit(+this.args[0]);
    else process.exit(0);
  }
}
