import { InbuiltCommand } from "../classes";

export default class Exit extends InbuiltCommand {
  declare usage: "exit CODE";
  invoke() {
    return { out: this.getVariable(this.args[0]), code: 0 };
  }
}
