import { InbuiltCommand } from "../classes";
import { ExitCodes } from "../constants";
import { CommandHandler } from "../handleCommand";
import { findInPath } from "../util";

export default class Which extends InbuiltCommand {
  public usage = "command name";
  public async invoke() {
    const [commandName] = this.args;
    if (!commandName) return { out: "", code: ExitCodes.ERROR };

    if (commandName in CommandHandler.inbuiltCommands)
      return { out: `${commandName}: shell builtin\n`, code: ExitCodes.SUCCESS };

    return findInPath(commandName)
      .then(result => {
        if (result) return { out: `${result}\n`, code: ExitCodes.SUCCESS };
        return { out: `${commandName} not found\n`, code: ExitCodes.COMMAND_NOT_FOUND };
      })
      .catch(err => ({ out: `${err  }\n`, code: ExitCodes.ERROR }));
  }
}
