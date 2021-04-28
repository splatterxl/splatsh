// https://tldp.org/LDP/abs/html/exitcodes.html
export enum ExitCodes {
  SUCCESS = 0,
  /* Catchall for general errors */
  ERROR = 1,
  /* Misuse of shell builtins  */
  BUILTIN_MISUSE = 2,
  /* Command invoked cannot execute */
  CANNOT_EXECUTE = 126,
  /* "command not found" */
  COMMAND_NOT_FOUND = 127,
  /* Invalid argument to exit */
  INVALID_EXIT_ARG = 128,
  /* Script terminated by Control-C */
  CTLR_C = 130,

  /* Own codes idk might wanna change some later */
  UNKNOWN_ERROR = 200
}
