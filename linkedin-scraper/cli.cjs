#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/commander/lib/error.js
var require_error = __commonJS({
  "node_modules/commander/lib/error.js"(exports2) {
    var CommanderError2 = class extends Error {
      /**
       * Constructs the CommanderError class
       * @param {number} exitCode suggested exit code which could be used with process.exit
       * @param {string} code an id string representing the error
       * @param {string} message human-readable description of the error
       */
      constructor(exitCode, code, message) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.code = code;
        this.exitCode = exitCode;
        this.nestedError = void 0;
      }
    };
    var InvalidArgumentError2 = class extends CommanderError2 {
      /**
       * Constructs the InvalidArgumentError class
       * @param {string} [message] explanation of why argument is invalid
       */
      constructor(message) {
        super(1, "commander.invalidArgument", message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
      }
    };
    exports2.CommanderError = CommanderError2;
    exports2.InvalidArgumentError = InvalidArgumentError2;
  }
});

// node_modules/commander/lib/argument.js
var require_argument = __commonJS({
  "node_modules/commander/lib/argument.js"(exports2) {
    var { InvalidArgumentError: InvalidArgumentError2 } = require_error();
    var Argument2 = class {
      /**
       * Initialize a new command argument with the given name and description.
       * The default is that the argument is required, and you can explicitly
       * indicate this with <> around the name. Put [] around the name for an optional argument.
       *
       * @param {string} name
       * @param {string} [description]
       */
      constructor(name, description) {
        this.description = description || "";
        this.variadic = false;
        this.parseArg = void 0;
        this.defaultValue = void 0;
        this.defaultValueDescription = void 0;
        this.argChoices = void 0;
        switch (name[0]) {
          case "<":
            this.required = true;
            this._name = name.slice(1, -1);
            break;
          case "[":
            this.required = false;
            this._name = name.slice(1, -1);
            break;
          default:
            this.required = true;
            this._name = name;
            break;
        }
        if (this._name.length > 3 && this._name.slice(-3) === "...") {
          this.variadic = true;
          this._name = this._name.slice(0, -3);
        }
      }
      /**
       * Return argument name.
       *
       * @return {string}
       */
      name() {
        return this._name;
      }
      /**
       * @package
       */
      _concatValue(value, previous) {
        if (previous === this.defaultValue || !Array.isArray(previous)) {
          return [value];
        }
        return previous.concat(value);
      }
      /**
       * Set the default value, and optionally supply the description to be displayed in the help.
       *
       * @param {*} value
       * @param {string} [description]
       * @return {Argument}
       */
      default(value, description) {
        this.defaultValue = value;
        this.defaultValueDescription = description;
        return this;
      }
      /**
       * Set the custom handler for processing CLI command arguments into argument values.
       *
       * @param {Function} [fn]
       * @return {Argument}
       */
      argParser(fn) {
        this.parseArg = fn;
        return this;
      }
      /**
       * Only allow argument value to be one of choices.
       *
       * @param {string[]} values
       * @return {Argument}
       */
      choices(values) {
        this.argChoices = values.slice();
        this.parseArg = (arg, previous) => {
          if (!this.argChoices.includes(arg)) {
            throw new InvalidArgumentError2(
              `Allowed choices are ${this.argChoices.join(", ")}.`
            );
          }
          if (this.variadic) {
            return this._concatValue(arg, previous);
          }
          return arg;
        };
        return this;
      }
      /**
       * Make argument required.
       *
       * @returns {Argument}
       */
      argRequired() {
        this.required = true;
        return this;
      }
      /**
       * Make argument optional.
       *
       * @returns {Argument}
       */
      argOptional() {
        this.required = false;
        return this;
      }
    };
    function humanReadableArgName(arg) {
      const nameOutput = arg.name() + (arg.variadic === true ? "..." : "");
      return arg.required ? "<" + nameOutput + ">" : "[" + nameOutput + "]";
    }
    exports2.Argument = Argument2;
    exports2.humanReadableArgName = humanReadableArgName;
  }
});

// node_modules/commander/lib/help.js
var require_help = __commonJS({
  "node_modules/commander/lib/help.js"(exports2) {
    var { humanReadableArgName } = require_argument();
    var Help2 = class {
      constructor() {
        this.helpWidth = void 0;
        this.sortSubcommands = false;
        this.sortOptions = false;
        this.showGlobalOptions = false;
      }
      /**
       * Get an array of the visible subcommands. Includes a placeholder for the implicit help command, if there is one.
       *
       * @param {Command} cmd
       * @returns {Command[]}
       */
      visibleCommands(cmd) {
        const visibleCommands = cmd.commands.filter((cmd2) => !cmd2._hidden);
        const helpCommand = cmd._getHelpCommand();
        if (helpCommand && !helpCommand._hidden) {
          visibleCommands.push(helpCommand);
        }
        if (this.sortSubcommands) {
          visibleCommands.sort((a, b) => {
            return a.name().localeCompare(b.name());
          });
        }
        return visibleCommands;
      }
      /**
       * Compare options for sort.
       *
       * @param {Option} a
       * @param {Option} b
       * @returns {number}
       */
      compareOptions(a, b) {
        const getSortKey = (option) => {
          return option.short ? option.short.replace(/^-/, "") : option.long.replace(/^--/, "");
        };
        return getSortKey(a).localeCompare(getSortKey(b));
      }
      /**
       * Get an array of the visible options. Includes a placeholder for the implicit help option, if there is one.
       *
       * @param {Command} cmd
       * @returns {Option[]}
       */
      visibleOptions(cmd) {
        const visibleOptions = cmd.options.filter((option) => !option.hidden);
        const helpOption = cmd._getHelpOption();
        if (helpOption && !helpOption.hidden) {
          const removeShort = helpOption.short && cmd._findOption(helpOption.short);
          const removeLong = helpOption.long && cmd._findOption(helpOption.long);
          if (!removeShort && !removeLong) {
            visibleOptions.push(helpOption);
          } else if (helpOption.long && !removeLong) {
            visibleOptions.push(
              cmd.createOption(helpOption.long, helpOption.description)
            );
          } else if (helpOption.short && !removeShort) {
            visibleOptions.push(
              cmd.createOption(helpOption.short, helpOption.description)
            );
          }
        }
        if (this.sortOptions) {
          visibleOptions.sort(this.compareOptions);
        }
        return visibleOptions;
      }
      /**
       * Get an array of the visible global options. (Not including help.)
       *
       * @param {Command} cmd
       * @returns {Option[]}
       */
      visibleGlobalOptions(cmd) {
        if (!this.showGlobalOptions)
          return [];
        const globalOptions = [];
        for (let ancestorCmd = cmd.parent; ancestorCmd; ancestorCmd = ancestorCmd.parent) {
          const visibleOptions = ancestorCmd.options.filter(
            (option) => !option.hidden
          );
          globalOptions.push(...visibleOptions);
        }
        if (this.sortOptions) {
          globalOptions.sort(this.compareOptions);
        }
        return globalOptions;
      }
      /**
       * Get an array of the arguments if any have a description.
       *
       * @param {Command} cmd
       * @returns {Argument[]}
       */
      visibleArguments(cmd) {
        if (cmd._argsDescription) {
          cmd.registeredArguments.forEach((argument) => {
            argument.description = argument.description || cmd._argsDescription[argument.name()] || "";
          });
        }
        if (cmd.registeredArguments.find((argument) => argument.description)) {
          return cmd.registeredArguments;
        }
        return [];
      }
      /**
       * Get the command term to show in the list of subcommands.
       *
       * @param {Command} cmd
       * @returns {string}
       */
      subcommandTerm(cmd) {
        const args = cmd.registeredArguments.map((arg) => humanReadableArgName(arg)).join(" ");
        return cmd._name + (cmd._aliases[0] ? "|" + cmd._aliases[0] : "") + (cmd.options.length ? " [options]" : "") + // simplistic check for non-help option
        (args ? " " + args : "");
      }
      /**
       * Get the option term to show in the list of options.
       *
       * @param {Option} option
       * @returns {string}
       */
      optionTerm(option) {
        return option.flags;
      }
      /**
       * Get the argument term to show in the list of arguments.
       *
       * @param {Argument} argument
       * @returns {string}
       */
      argumentTerm(argument) {
        return argument.name();
      }
      /**
       * Get the longest command term length.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {number}
       */
      longestSubcommandTermLength(cmd, helper) {
        return helper.visibleCommands(cmd).reduce((max, command) => {
          return Math.max(max, helper.subcommandTerm(command).length);
        }, 0);
      }
      /**
       * Get the longest option term length.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {number}
       */
      longestOptionTermLength(cmd, helper) {
        return helper.visibleOptions(cmd).reduce((max, option) => {
          return Math.max(max, helper.optionTerm(option).length);
        }, 0);
      }
      /**
       * Get the longest global option term length.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {number}
       */
      longestGlobalOptionTermLength(cmd, helper) {
        return helper.visibleGlobalOptions(cmd).reduce((max, option) => {
          return Math.max(max, helper.optionTerm(option).length);
        }, 0);
      }
      /**
       * Get the longest argument term length.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {number}
       */
      longestArgumentTermLength(cmd, helper) {
        return helper.visibleArguments(cmd).reduce((max, argument) => {
          return Math.max(max, helper.argumentTerm(argument).length);
        }, 0);
      }
      /**
       * Get the command usage to be displayed at the top of the built-in help.
       *
       * @param {Command} cmd
       * @returns {string}
       */
      commandUsage(cmd) {
        let cmdName = cmd._name;
        if (cmd._aliases[0]) {
          cmdName = cmdName + "|" + cmd._aliases[0];
        }
        let ancestorCmdNames = "";
        for (let ancestorCmd = cmd.parent; ancestorCmd; ancestorCmd = ancestorCmd.parent) {
          ancestorCmdNames = ancestorCmd.name() + " " + ancestorCmdNames;
        }
        return ancestorCmdNames + cmdName + " " + cmd.usage();
      }
      /**
       * Get the description for the command.
       *
       * @param {Command} cmd
       * @returns {string}
       */
      commandDescription(cmd) {
        return cmd.description();
      }
      /**
       * Get the subcommand summary to show in the list of subcommands.
       * (Fallback to description for backwards compatibility.)
       *
       * @param {Command} cmd
       * @returns {string}
       */
      subcommandDescription(cmd) {
        return cmd.summary() || cmd.description();
      }
      /**
       * Get the option description to show in the list of options.
       *
       * @param {Option} option
       * @return {string}
       */
      optionDescription(option) {
        const extraInfo = [];
        if (option.argChoices) {
          extraInfo.push(
            // use stringify to match the display of the default value
            `choices: ${option.argChoices.map((choice) => JSON.stringify(choice)).join(", ")}`
          );
        }
        if (option.defaultValue !== void 0) {
          const showDefault = option.required || option.optional || option.isBoolean() && typeof option.defaultValue === "boolean";
          if (showDefault) {
            extraInfo.push(
              `default: ${option.defaultValueDescription || JSON.stringify(option.defaultValue)}`
            );
          }
        }
        if (option.presetArg !== void 0 && option.optional) {
          extraInfo.push(`preset: ${JSON.stringify(option.presetArg)}`);
        }
        if (option.envVar !== void 0) {
          extraInfo.push(`env: ${option.envVar}`);
        }
        if (extraInfo.length > 0) {
          return `${option.description} (${extraInfo.join(", ")})`;
        }
        return option.description;
      }
      /**
       * Get the argument description to show in the list of arguments.
       *
       * @param {Argument} argument
       * @return {string}
       */
      argumentDescription(argument) {
        const extraInfo = [];
        if (argument.argChoices) {
          extraInfo.push(
            // use stringify to match the display of the default value
            `choices: ${argument.argChoices.map((choice) => JSON.stringify(choice)).join(", ")}`
          );
        }
        if (argument.defaultValue !== void 0) {
          extraInfo.push(
            `default: ${argument.defaultValueDescription || JSON.stringify(argument.defaultValue)}`
          );
        }
        if (extraInfo.length > 0) {
          const extraDescripton = `(${extraInfo.join(", ")})`;
          if (argument.description) {
            return `${argument.description} ${extraDescripton}`;
          }
          return extraDescripton;
        }
        return argument.description;
      }
      /**
       * Generate the built-in help text.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {string}
       */
      formatHelp(cmd, helper) {
        const termWidth = helper.padWidth(cmd, helper);
        const helpWidth = helper.helpWidth || 80;
        const itemIndentWidth = 2;
        const itemSeparatorWidth = 2;
        function formatItem(term, description) {
          if (description) {
            const fullText = `${term.padEnd(termWidth + itemSeparatorWidth)}${description}`;
            return helper.wrap(
              fullText,
              helpWidth - itemIndentWidth,
              termWidth + itemSeparatorWidth
            );
          }
          return term;
        }
        function formatList(textArray) {
          return textArray.join("\n").replace(/^/gm, " ".repeat(itemIndentWidth));
        }
        let output = [`Usage: ${helper.commandUsage(cmd)}`, ""];
        const commandDescription = helper.commandDescription(cmd);
        if (commandDescription.length > 0) {
          output = output.concat([
            helper.wrap(commandDescription, helpWidth, 0),
            ""
          ]);
        }
        const argumentList = helper.visibleArguments(cmd).map((argument) => {
          return formatItem(
            helper.argumentTerm(argument),
            helper.argumentDescription(argument)
          );
        });
        if (argumentList.length > 0) {
          output = output.concat(["Arguments:", formatList(argumentList), ""]);
        }
        const optionList = helper.visibleOptions(cmd).map((option) => {
          return formatItem(
            helper.optionTerm(option),
            helper.optionDescription(option)
          );
        });
        if (optionList.length > 0) {
          output = output.concat(["Options:", formatList(optionList), ""]);
        }
        if (this.showGlobalOptions) {
          const globalOptionList = helper.visibleGlobalOptions(cmd).map((option) => {
            return formatItem(
              helper.optionTerm(option),
              helper.optionDescription(option)
            );
          });
          if (globalOptionList.length > 0) {
            output = output.concat([
              "Global Options:",
              formatList(globalOptionList),
              ""
            ]);
          }
        }
        const commandList = helper.visibleCommands(cmd).map((cmd2) => {
          return formatItem(
            helper.subcommandTerm(cmd2),
            helper.subcommandDescription(cmd2)
          );
        });
        if (commandList.length > 0) {
          output = output.concat(["Commands:", formatList(commandList), ""]);
        }
        return output.join("\n");
      }
      /**
       * Calculate the pad width from the maximum term length.
       *
       * @param {Command} cmd
       * @param {Help} helper
       * @returns {number}
       */
      padWidth(cmd, helper) {
        return Math.max(
          helper.longestOptionTermLength(cmd, helper),
          helper.longestGlobalOptionTermLength(cmd, helper),
          helper.longestSubcommandTermLength(cmd, helper),
          helper.longestArgumentTermLength(cmd, helper)
        );
      }
      /**
       * Wrap the given string to width characters per line, with lines after the first indented.
       * Do not wrap if insufficient room for wrapping (minColumnWidth), or string is manually formatted.
       *
       * @param {string} str
       * @param {number} width
       * @param {number} indent
       * @param {number} [minColumnWidth=40]
       * @return {string}
       *
       */
      wrap(str, width, indent, minColumnWidth = 40) {
        const indents = " \\f\\t\\v\xA0\u1680\u2000-\u200A\u202F\u205F\u3000\uFEFF";
        const manualIndent = new RegExp(`[\\n][${indents}]+`);
        if (str.match(manualIndent))
          return str;
        const columnWidth = width - indent;
        if (columnWidth < minColumnWidth)
          return str;
        const leadingStr = str.slice(0, indent);
        const columnText = str.slice(indent).replace("\r\n", "\n");
        const indentString = " ".repeat(indent);
        const zeroWidthSpace = "\u200B";
        const breaks = `\\s${zeroWidthSpace}`;
        const regex = new RegExp(
          `
|.{1,${columnWidth - 1}}([${breaks}]|$)|[^${breaks}]+?([${breaks}]|$)`,
          "g"
        );
        const lines = columnText.match(regex) || [];
        return leadingStr + lines.map((line, i) => {
          if (line === "\n")
            return "";
          return (i > 0 ? indentString : "") + line.trimEnd();
        }).join("\n");
      }
    };
    exports2.Help = Help2;
  }
});

// node_modules/commander/lib/option.js
var require_option = __commonJS({
  "node_modules/commander/lib/option.js"(exports2) {
    var { InvalidArgumentError: InvalidArgumentError2 } = require_error();
    var Option2 = class {
      /**
       * Initialize a new `Option` with the given `flags` and `description`.
       *
       * @param {string} flags
       * @param {string} [description]
       */
      constructor(flags, description) {
        this.flags = flags;
        this.description = description || "";
        this.required = flags.includes("<");
        this.optional = flags.includes("[");
        this.variadic = /\w\.\.\.[>\]]$/.test(flags);
        this.mandatory = false;
        const optionFlags = splitOptionFlags(flags);
        this.short = optionFlags.shortFlag;
        this.long = optionFlags.longFlag;
        this.negate = false;
        if (this.long) {
          this.negate = this.long.startsWith("--no-");
        }
        this.defaultValue = void 0;
        this.defaultValueDescription = void 0;
        this.presetArg = void 0;
        this.envVar = void 0;
        this.parseArg = void 0;
        this.hidden = false;
        this.argChoices = void 0;
        this.conflictsWith = [];
        this.implied = void 0;
      }
      /**
       * Set the default value, and optionally supply the description to be displayed in the help.
       *
       * @param {*} value
       * @param {string} [description]
       * @return {Option}
       */
      default(value, description) {
        this.defaultValue = value;
        this.defaultValueDescription = description;
        return this;
      }
      /**
       * Preset to use when option used without option-argument, especially optional but also boolean and negated.
       * The custom processing (parseArg) is called.
       *
       * @example
       * new Option('--color').default('GREYSCALE').preset('RGB');
       * new Option('--donate [amount]').preset('20').argParser(parseFloat);
       *
       * @param {*} arg
       * @return {Option}
       */
      preset(arg) {
        this.presetArg = arg;
        return this;
      }
      /**
       * Add option name(s) that conflict with this option.
       * An error will be displayed if conflicting options are found during parsing.
       *
       * @example
       * new Option('--rgb').conflicts('cmyk');
       * new Option('--js').conflicts(['ts', 'jsx']);
       *
       * @param {(string | string[])} names
       * @return {Option}
       */
      conflicts(names) {
        this.conflictsWith = this.conflictsWith.concat(names);
        return this;
      }
      /**
       * Specify implied option values for when this option is set and the implied options are not.
       *
       * The custom processing (parseArg) is not called on the implied values.
       *
       * @example
       * program
       *   .addOption(new Option('--log', 'write logging information to file'))
       *   .addOption(new Option('--trace', 'log extra details').implies({ log: 'trace.txt' }));
       *
       * @param {object} impliedOptionValues
       * @return {Option}
       */
      implies(impliedOptionValues) {
        let newImplied = impliedOptionValues;
        if (typeof impliedOptionValues === "string") {
          newImplied = { [impliedOptionValues]: true };
        }
        this.implied = Object.assign(this.implied || {}, newImplied);
        return this;
      }
      /**
       * Set environment variable to check for option value.
       *
       * An environment variable is only used if when processed the current option value is
       * undefined, or the source of the current value is 'default' or 'config' or 'env'.
       *
       * @param {string} name
       * @return {Option}
       */
      env(name) {
        this.envVar = name;
        return this;
      }
      /**
       * Set the custom handler for processing CLI option arguments into option values.
       *
       * @param {Function} [fn]
       * @return {Option}
       */
      argParser(fn) {
        this.parseArg = fn;
        return this;
      }
      /**
       * Whether the option is mandatory and must have a value after parsing.
       *
       * @param {boolean} [mandatory=true]
       * @return {Option}
       */
      makeOptionMandatory(mandatory = true) {
        this.mandatory = !!mandatory;
        return this;
      }
      /**
       * Hide option in help.
       *
       * @param {boolean} [hide=true]
       * @return {Option}
       */
      hideHelp(hide = true) {
        this.hidden = !!hide;
        return this;
      }
      /**
       * @package
       */
      _concatValue(value, previous) {
        if (previous === this.defaultValue || !Array.isArray(previous)) {
          return [value];
        }
        return previous.concat(value);
      }
      /**
       * Only allow option value to be one of choices.
       *
       * @param {string[]} values
       * @return {Option}
       */
      choices(values) {
        this.argChoices = values.slice();
        this.parseArg = (arg, previous) => {
          if (!this.argChoices.includes(arg)) {
            throw new InvalidArgumentError2(
              `Allowed choices are ${this.argChoices.join(", ")}.`
            );
          }
          if (this.variadic) {
            return this._concatValue(arg, previous);
          }
          return arg;
        };
        return this;
      }
      /**
       * Return option name.
       *
       * @return {string}
       */
      name() {
        if (this.long) {
          return this.long.replace(/^--/, "");
        }
        return this.short.replace(/^-/, "");
      }
      /**
       * Return option name, in a camelcase format that can be used
       * as a object attribute key.
       *
       * @return {string}
       */
      attributeName() {
        return camelcase(this.name().replace(/^no-/, ""));
      }
      /**
       * Check if `arg` matches the short or long flag.
       *
       * @param {string} arg
       * @return {boolean}
       * @package
       */
      is(arg) {
        return this.short === arg || this.long === arg;
      }
      /**
       * Return whether a boolean option.
       *
       * Options are one of boolean, negated, required argument, or optional argument.
       *
       * @return {boolean}
       * @package
       */
      isBoolean() {
        return !this.required && !this.optional && !this.negate;
      }
    };
    var DualOptions = class {
      /**
       * @param {Option[]} options
       */
      constructor(options) {
        this.positiveOptions = /* @__PURE__ */ new Map();
        this.negativeOptions = /* @__PURE__ */ new Map();
        this.dualOptions = /* @__PURE__ */ new Set();
        options.forEach((option) => {
          if (option.negate) {
            this.negativeOptions.set(option.attributeName(), option);
          } else {
            this.positiveOptions.set(option.attributeName(), option);
          }
        });
        this.negativeOptions.forEach((value, key) => {
          if (this.positiveOptions.has(key)) {
            this.dualOptions.add(key);
          }
        });
      }
      /**
       * Did the value come from the option, and not from possible matching dual option?
       *
       * @param {*} value
       * @param {Option} option
       * @returns {boolean}
       */
      valueFromOption(value, option) {
        const optionKey = option.attributeName();
        if (!this.dualOptions.has(optionKey))
          return true;
        const preset = this.negativeOptions.get(optionKey).presetArg;
        const negativeValue = preset !== void 0 ? preset : false;
        return option.negate === (negativeValue === value);
      }
    };
    function camelcase(str) {
      return str.split("-").reduce((str2, word) => {
        return str2 + word[0].toUpperCase() + word.slice(1);
      });
    }
    function splitOptionFlags(flags) {
      let shortFlag;
      let longFlag;
      const flagParts = flags.split(/[ |,]+/);
      if (flagParts.length > 1 && !/^[[<]/.test(flagParts[1]))
        shortFlag = flagParts.shift();
      longFlag = flagParts.shift();
      if (!shortFlag && /^-[^-]$/.test(longFlag)) {
        shortFlag = longFlag;
        longFlag = void 0;
      }
      return { shortFlag, longFlag };
    }
    exports2.Option = Option2;
    exports2.DualOptions = DualOptions;
  }
});

// node_modules/commander/lib/suggestSimilar.js
var require_suggestSimilar = __commonJS({
  "node_modules/commander/lib/suggestSimilar.js"(exports2) {
    var maxDistance = 3;
    function editDistance(a, b) {
      if (Math.abs(a.length - b.length) > maxDistance)
        return Math.max(a.length, b.length);
      const d = [];
      for (let i = 0; i <= a.length; i++) {
        d[i] = [i];
      }
      for (let j = 0; j <= b.length; j++) {
        d[0][j] = j;
      }
      for (let j = 1; j <= b.length; j++) {
        for (let i = 1; i <= a.length; i++) {
          let cost = 1;
          if (a[i - 1] === b[j - 1]) {
            cost = 0;
          } else {
            cost = 1;
          }
          d[i][j] = Math.min(
            d[i - 1][j] + 1,
            // deletion
            d[i][j - 1] + 1,
            // insertion
            d[i - 1][j - 1] + cost
            // substitution
          );
          if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
            d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
          }
        }
      }
      return d[a.length][b.length];
    }
    function suggestSimilar(word, candidates) {
      if (!candidates || candidates.length === 0)
        return "";
      candidates = Array.from(new Set(candidates));
      const searchingOptions = word.startsWith("--");
      if (searchingOptions) {
        word = word.slice(2);
        candidates = candidates.map((candidate) => candidate.slice(2));
      }
      let similar = [];
      let bestDistance = maxDistance;
      const minSimilarity = 0.4;
      candidates.forEach((candidate) => {
        if (candidate.length <= 1)
          return;
        const distance = editDistance(word, candidate);
        const length = Math.max(word.length, candidate.length);
        const similarity = (length - distance) / length;
        if (similarity > minSimilarity) {
          if (distance < bestDistance) {
            bestDistance = distance;
            similar = [candidate];
          } else if (distance === bestDistance) {
            similar.push(candidate);
          }
        }
      });
      similar.sort((a, b) => a.localeCompare(b));
      if (searchingOptions) {
        similar = similar.map((candidate) => `--${candidate}`);
      }
      if (similar.length > 1) {
        return `
(Did you mean one of ${similar.join(", ")}?)`;
      }
      if (similar.length === 1) {
        return `
(Did you mean ${similar[0]}?)`;
      }
      return "";
    }
    exports2.suggestSimilar = suggestSimilar;
  }
});

// node_modules/commander/lib/command.js
var require_command = __commonJS({
  "node_modules/commander/lib/command.js"(exports2) {
    var EventEmitter2 = require("node:events").EventEmitter;
    var childProcess = require("node:child_process");
    var path = require("node:path");
    var fs = require("node:fs");
    var process2 = require("node:process");
    var { Argument: Argument2, humanReadableArgName } = require_argument();
    var { CommanderError: CommanderError2 } = require_error();
    var { Help: Help2 } = require_help();
    var { Option: Option2, DualOptions } = require_option();
    var { suggestSimilar } = require_suggestSimilar();
    var Command2 = class _Command extends EventEmitter2 {
      /**
       * Initialize a new `Command`.
       *
       * @param {string} [name]
       */
      constructor(name) {
        super();
        this.commands = [];
        this.options = [];
        this.parent = null;
        this._allowUnknownOption = false;
        this._allowExcessArguments = true;
        this.registeredArguments = [];
        this._args = this.registeredArguments;
        this.args = [];
        this.rawArgs = [];
        this.processedArgs = [];
        this._scriptPath = null;
        this._name = name || "";
        this._optionValues = {};
        this._optionValueSources = {};
        this._storeOptionsAsProperties = false;
        this._actionHandler = null;
        this._executableHandler = false;
        this._executableFile = null;
        this._executableDir = null;
        this._defaultCommandName = null;
        this._exitCallback = null;
        this._aliases = [];
        this._combineFlagAndOptionalValue = true;
        this._description = "";
        this._summary = "";
        this._argsDescription = void 0;
        this._enablePositionalOptions = false;
        this._passThroughOptions = false;
        this._lifeCycleHooks = {};
        this._showHelpAfterError = false;
        this._showSuggestionAfterError = true;
        this._outputConfiguration = {
          writeOut: (str) => process2.stdout.write(str),
          writeErr: (str) => process2.stderr.write(str),
          getOutHelpWidth: () => process2.stdout.isTTY ? process2.stdout.columns : void 0,
          getErrHelpWidth: () => process2.stderr.isTTY ? process2.stderr.columns : void 0,
          outputError: (str, write) => write(str)
        };
        this._hidden = false;
        this._helpOption = void 0;
        this._addImplicitHelpCommand = void 0;
        this._helpCommand = void 0;
        this._helpConfiguration = {};
      }
      /**
       * Copy settings that are useful to have in common across root command and subcommands.
       *
       * (Used internally when adding a command using `.command()` so subcommands inherit parent settings.)
       *
       * @param {Command} sourceCommand
       * @return {Command} `this` command for chaining
       */
      copyInheritedSettings(sourceCommand) {
        this._outputConfiguration = sourceCommand._outputConfiguration;
        this._helpOption = sourceCommand._helpOption;
        this._helpCommand = sourceCommand._helpCommand;
        this._helpConfiguration = sourceCommand._helpConfiguration;
        this._exitCallback = sourceCommand._exitCallback;
        this._storeOptionsAsProperties = sourceCommand._storeOptionsAsProperties;
        this._combineFlagAndOptionalValue = sourceCommand._combineFlagAndOptionalValue;
        this._allowExcessArguments = sourceCommand._allowExcessArguments;
        this._enablePositionalOptions = sourceCommand._enablePositionalOptions;
        this._showHelpAfterError = sourceCommand._showHelpAfterError;
        this._showSuggestionAfterError = sourceCommand._showSuggestionAfterError;
        return this;
      }
      /**
       * @returns {Command[]}
       * @private
       */
      _getCommandAndAncestors() {
        const result = [];
        for (let command = this; command; command = command.parent) {
          result.push(command);
        }
        return result;
      }
      /**
       * Define a command.
       *
       * There are two styles of command: pay attention to where to put the description.
       *
       * @example
       * // Command implemented using action handler (description is supplied separately to `.command`)
       * program
       *   .command('clone <source> [destination]')
       *   .description('clone a repository into a newly created directory')
       *   .action((source, destination) => {
       *     console.log('clone command called');
       *   });
       *
       * // Command implemented using separate executable file (description is second parameter to `.command`)
       * program
       *   .command('start <service>', 'start named service')
       *   .command('stop [service]', 'stop named service, or all if no name supplied');
       *
       * @param {string} nameAndArgs - command name and arguments, args are `<required>` or `[optional]` and last may also be `variadic...`
       * @param {(object | string)} [actionOptsOrExecDesc] - configuration options (for action), or description (for executable)
       * @param {object} [execOpts] - configuration options (for executable)
       * @return {Command} returns new command for action handler, or `this` for executable command
       */
      command(nameAndArgs, actionOptsOrExecDesc, execOpts) {
        let desc = actionOptsOrExecDesc;
        let opts = execOpts;
        if (typeof desc === "object" && desc !== null) {
          opts = desc;
          desc = null;
        }
        opts = opts || {};
        const [, name, args] = nameAndArgs.match(/([^ ]+) *(.*)/);
        const cmd = this.createCommand(name);
        if (desc) {
          cmd.description(desc);
          cmd._executableHandler = true;
        }
        if (opts.isDefault)
          this._defaultCommandName = cmd._name;
        cmd._hidden = !!(opts.noHelp || opts.hidden);
        cmd._executableFile = opts.executableFile || null;
        if (args)
          cmd.arguments(args);
        this._registerCommand(cmd);
        cmd.parent = this;
        cmd.copyInheritedSettings(this);
        if (desc)
          return this;
        return cmd;
      }
      /**
       * Factory routine to create a new unattached command.
       *
       * See .command() for creating an attached subcommand, which uses this routine to
       * create the command. You can override createCommand to customise subcommands.
       *
       * @param {string} [name]
       * @return {Command} new command
       */
      createCommand(name) {
        return new _Command(name);
      }
      /**
       * You can customise the help with a subclass of Help by overriding createHelp,
       * or by overriding Help properties using configureHelp().
       *
       * @return {Help}
       */
      createHelp() {
        return Object.assign(new Help2(), this.configureHelp());
      }
      /**
       * You can customise the help by overriding Help properties using configureHelp(),
       * or with a subclass of Help by overriding createHelp().
       *
       * @param {object} [configuration] - configuration options
       * @return {(Command | object)} `this` command for chaining, or stored configuration
       */
      configureHelp(configuration) {
        if (configuration === void 0)
          return this._helpConfiguration;
        this._helpConfiguration = configuration;
        return this;
      }
      /**
       * The default output goes to stdout and stderr. You can customise this for special
       * applications. You can also customise the display of errors by overriding outputError.
       *
       * The configuration properties are all functions:
       *
       *     // functions to change where being written, stdout and stderr
       *     writeOut(str)
       *     writeErr(str)
       *     // matching functions to specify width for wrapping help
       *     getOutHelpWidth()
       *     getErrHelpWidth()
       *     // functions based on what is being written out
       *     outputError(str, write) // used for displaying errors, and not used for displaying help
       *
       * @param {object} [configuration] - configuration options
       * @return {(Command | object)} `this` command for chaining, or stored configuration
       */
      configureOutput(configuration) {
        if (configuration === void 0)
          return this._outputConfiguration;
        Object.assign(this._outputConfiguration, configuration);
        return this;
      }
      /**
       * Display the help or a custom message after an error occurs.
       *
       * @param {(boolean|string)} [displayHelp]
       * @return {Command} `this` command for chaining
       */
      showHelpAfterError(displayHelp = true) {
        if (typeof displayHelp !== "string")
          displayHelp = !!displayHelp;
        this._showHelpAfterError = displayHelp;
        return this;
      }
      /**
       * Display suggestion of similar commands for unknown commands, or options for unknown options.
       *
       * @param {boolean} [displaySuggestion]
       * @return {Command} `this` command for chaining
       */
      showSuggestionAfterError(displaySuggestion = true) {
        this._showSuggestionAfterError = !!displaySuggestion;
        return this;
      }
      /**
       * Add a prepared subcommand.
       *
       * See .command() for creating an attached subcommand which inherits settings from its parent.
       *
       * @param {Command} cmd - new subcommand
       * @param {object} [opts] - configuration options
       * @return {Command} `this` command for chaining
       */
      addCommand(cmd, opts) {
        if (!cmd._name) {
          throw new Error(`Command passed to .addCommand() must have a name
- specify the name in Command constructor or using .name()`);
        }
        opts = opts || {};
        if (opts.isDefault)
          this._defaultCommandName = cmd._name;
        if (opts.noHelp || opts.hidden)
          cmd._hidden = true;
        this._registerCommand(cmd);
        cmd.parent = this;
        cmd._checkForBrokenPassThrough();
        return this;
      }
      /**
       * Factory routine to create a new unattached argument.
       *
       * See .argument() for creating an attached argument, which uses this routine to
       * create the argument. You can override createArgument to return a custom argument.
       *
       * @param {string} name
       * @param {string} [description]
       * @return {Argument} new argument
       */
      createArgument(name, description) {
        return new Argument2(name, description);
      }
      /**
       * Define argument syntax for command.
       *
       * The default is that the argument is required, and you can explicitly
       * indicate this with <> around the name. Put [] around the name for an optional argument.
       *
       * @example
       * program.argument('<input-file>');
       * program.argument('[output-file]');
       *
       * @param {string} name
       * @param {string} [description]
       * @param {(Function|*)} [fn] - custom argument processing function
       * @param {*} [defaultValue]
       * @return {Command} `this` command for chaining
       */
      argument(name, description, fn, defaultValue) {
        const argument = this.createArgument(name, description);
        if (typeof fn === "function") {
          argument.default(defaultValue).argParser(fn);
        } else {
          argument.default(fn);
        }
        this.addArgument(argument);
        return this;
      }
      /**
       * Define argument syntax for command, adding multiple at once (without descriptions).
       *
       * See also .argument().
       *
       * @example
       * program.arguments('<cmd> [env]');
       *
       * @param {string} names
       * @return {Command} `this` command for chaining
       */
      arguments(names) {
        names.trim().split(/ +/).forEach((detail) => {
          this.argument(detail);
        });
        return this;
      }
      /**
       * Define argument syntax for command, adding a prepared argument.
       *
       * @param {Argument} argument
       * @return {Command} `this` command for chaining
       */
      addArgument(argument) {
        const previousArgument = this.registeredArguments.slice(-1)[0];
        if (previousArgument && previousArgument.variadic) {
          throw new Error(
            `only the last argument can be variadic '${previousArgument.name()}'`
          );
        }
        if (argument.required && argument.defaultValue !== void 0 && argument.parseArg === void 0) {
          throw new Error(
            `a default value for a required argument is never used: '${argument.name()}'`
          );
        }
        this.registeredArguments.push(argument);
        return this;
      }
      /**
       * Customise or override default help command. By default a help command is automatically added if your command has subcommands.
       *
       * @example
       *    program.helpCommand('help [cmd]');
       *    program.helpCommand('help [cmd]', 'show help');
       *    program.helpCommand(false); // suppress default help command
       *    program.helpCommand(true); // add help command even if no subcommands
       *
       * @param {string|boolean} enableOrNameAndArgs - enable with custom name and/or arguments, or boolean to override whether added
       * @param {string} [description] - custom description
       * @return {Command} `this` command for chaining
       */
      helpCommand(enableOrNameAndArgs, description) {
        if (typeof enableOrNameAndArgs === "boolean") {
          this._addImplicitHelpCommand = enableOrNameAndArgs;
          return this;
        }
        enableOrNameAndArgs = enableOrNameAndArgs ?? "help [command]";
        const [, helpName, helpArgs] = enableOrNameAndArgs.match(/([^ ]+) *(.*)/);
        const helpDescription = description ?? "display help for command";
        const helpCommand = this.createCommand(helpName);
        helpCommand.helpOption(false);
        if (helpArgs)
          helpCommand.arguments(helpArgs);
        if (helpDescription)
          helpCommand.description(helpDescription);
        this._addImplicitHelpCommand = true;
        this._helpCommand = helpCommand;
        return this;
      }
      /**
       * Add prepared custom help command.
       *
       * @param {(Command|string|boolean)} helpCommand - custom help command, or deprecated enableOrNameAndArgs as for `.helpCommand()`
       * @param {string} [deprecatedDescription] - deprecated custom description used with custom name only
       * @return {Command} `this` command for chaining
       */
      addHelpCommand(helpCommand, deprecatedDescription) {
        if (typeof helpCommand !== "object") {
          this.helpCommand(helpCommand, deprecatedDescription);
          return this;
        }
        this._addImplicitHelpCommand = true;
        this._helpCommand = helpCommand;
        return this;
      }
      /**
       * Lazy create help command.
       *
       * @return {(Command|null)}
       * @package
       */
      _getHelpCommand() {
        const hasImplicitHelpCommand = this._addImplicitHelpCommand ?? (this.commands.length && !this._actionHandler && !this._findCommand("help"));
        if (hasImplicitHelpCommand) {
          if (this._helpCommand === void 0) {
            this.helpCommand(void 0, void 0);
          }
          return this._helpCommand;
        }
        return null;
      }
      /**
       * Add hook for life cycle event.
       *
       * @param {string} event
       * @param {Function} listener
       * @return {Command} `this` command for chaining
       */
      hook(event, listener) {
        const allowedValues = ["preSubcommand", "preAction", "postAction"];
        if (!allowedValues.includes(event)) {
          throw new Error(`Unexpected value for event passed to hook : '${event}'.
Expecting one of '${allowedValues.join("', '")}'`);
        }
        if (this._lifeCycleHooks[event]) {
          this._lifeCycleHooks[event].push(listener);
        } else {
          this._lifeCycleHooks[event] = [listener];
        }
        return this;
      }
      /**
       * Register callback to use as replacement for calling process.exit.
       *
       * @param {Function} [fn] optional callback which will be passed a CommanderError, defaults to throwing
       * @return {Command} `this` command for chaining
       */
      exitOverride(fn) {
        if (fn) {
          this._exitCallback = fn;
        } else {
          this._exitCallback = (err) => {
            if (err.code !== "commander.executeSubCommandAsync") {
              throw err;
            } else {
            }
          };
        }
        return this;
      }
      /**
       * Call process.exit, and _exitCallback if defined.
       *
       * @param {number} exitCode exit code for using with process.exit
       * @param {string} code an id string representing the error
       * @param {string} message human-readable description of the error
       * @return never
       * @private
       */
      _exit(exitCode, code, message) {
        if (this._exitCallback) {
          this._exitCallback(new CommanderError2(exitCode, code, message));
        }
        process2.exit(exitCode);
      }
      /**
       * Register callback `fn` for the command.
       *
       * @example
       * program
       *   .command('serve')
       *   .description('start service')
       *   .action(function() {
       *      // do work here
       *   });
       *
       * @param {Function} fn
       * @return {Command} `this` command for chaining
       */
      action(fn) {
        const listener = (args) => {
          const expectedArgsCount = this.registeredArguments.length;
          const actionArgs = args.slice(0, expectedArgsCount);
          if (this._storeOptionsAsProperties) {
            actionArgs[expectedArgsCount] = this;
          } else {
            actionArgs[expectedArgsCount] = this.opts();
          }
          actionArgs.push(this);
          return fn.apply(this, actionArgs);
        };
        this._actionHandler = listener;
        return this;
      }
      /**
       * Factory routine to create a new unattached option.
       *
       * See .option() for creating an attached option, which uses this routine to
       * create the option. You can override createOption to return a custom option.
       *
       * @param {string} flags
       * @param {string} [description]
       * @return {Option} new option
       */
      createOption(flags, description) {
        return new Option2(flags, description);
      }
      /**
       * Wrap parseArgs to catch 'commander.invalidArgument'.
       *
       * @param {(Option | Argument)} target
       * @param {string} value
       * @param {*} previous
       * @param {string} invalidArgumentMessage
       * @private
       */
      _callParseArg(target, value, previous, invalidArgumentMessage) {
        try {
          return target.parseArg(value, previous);
        } catch (err) {
          if (err.code === "commander.invalidArgument") {
            const message = `${invalidArgumentMessage} ${err.message}`;
            this.error(message, { exitCode: err.exitCode, code: err.code });
          }
          throw err;
        }
      }
      /**
       * Check for option flag conflicts.
       * Register option if no conflicts found, or throw on conflict.
       *
       * @param {Option} option
       * @private
       */
      _registerOption(option) {
        const matchingOption = option.short && this._findOption(option.short) || option.long && this._findOption(option.long);
        if (matchingOption) {
          const matchingFlag = option.long && this._findOption(option.long) ? option.long : option.short;
          throw new Error(`Cannot add option '${option.flags}'${this._name && ` to command '${this._name}'`} due to conflicting flag '${matchingFlag}'
-  already used by option '${matchingOption.flags}'`);
        }
        this.options.push(option);
      }
      /**
       * Check for command name and alias conflicts with existing commands.
       * Register command if no conflicts found, or throw on conflict.
       *
       * @param {Command} command
       * @private
       */
      _registerCommand(command) {
        const knownBy = (cmd) => {
          return [cmd.name()].concat(cmd.aliases());
        };
        const alreadyUsed = knownBy(command).find(
          (name) => this._findCommand(name)
        );
        if (alreadyUsed) {
          const existingCmd = knownBy(this._findCommand(alreadyUsed)).join("|");
          const newCmd = knownBy(command).join("|");
          throw new Error(
            `cannot add command '${newCmd}' as already have command '${existingCmd}'`
          );
        }
        this.commands.push(command);
      }
      /**
       * Add an option.
       *
       * @param {Option} option
       * @return {Command} `this` command for chaining
       */
      addOption(option) {
        this._registerOption(option);
        const oname = option.name();
        const name = option.attributeName();
        if (option.negate) {
          const positiveLongFlag = option.long.replace(/^--no-/, "--");
          if (!this._findOption(positiveLongFlag)) {
            this.setOptionValueWithSource(
              name,
              option.defaultValue === void 0 ? true : option.defaultValue,
              "default"
            );
          }
        } else if (option.defaultValue !== void 0) {
          this.setOptionValueWithSource(name, option.defaultValue, "default");
        }
        const handleOptionValue = (val, invalidValueMessage, valueSource) => {
          if (val == null && option.presetArg !== void 0) {
            val = option.presetArg;
          }
          const oldValue = this.getOptionValue(name);
          if (val !== null && option.parseArg) {
            val = this._callParseArg(option, val, oldValue, invalidValueMessage);
          } else if (val !== null && option.variadic) {
            val = option._concatValue(val, oldValue);
          }
          if (val == null) {
            if (option.negate) {
              val = false;
            } else if (option.isBoolean() || option.optional) {
              val = true;
            } else {
              val = "";
            }
          }
          this.setOptionValueWithSource(name, val, valueSource);
        };
        this.on("option:" + oname, (val) => {
          const invalidValueMessage = `error: option '${option.flags}' argument '${val}' is invalid.`;
          handleOptionValue(val, invalidValueMessage, "cli");
        });
        if (option.envVar) {
          this.on("optionEnv:" + oname, (val) => {
            const invalidValueMessage = `error: option '${option.flags}' value '${val}' from env '${option.envVar}' is invalid.`;
            handleOptionValue(val, invalidValueMessage, "env");
          });
        }
        return this;
      }
      /**
       * Internal implementation shared by .option() and .requiredOption()
       *
       * @return {Command} `this` command for chaining
       * @private
       */
      _optionEx(config, flags, description, fn, defaultValue) {
        if (typeof flags === "object" && flags instanceof Option2) {
          throw new Error(
            "To add an Option object use addOption() instead of option() or requiredOption()"
          );
        }
        const option = this.createOption(flags, description);
        option.makeOptionMandatory(!!config.mandatory);
        if (typeof fn === "function") {
          option.default(defaultValue).argParser(fn);
        } else if (fn instanceof RegExp) {
          const regex = fn;
          fn = (val, def) => {
            const m = regex.exec(val);
            return m ? m[0] : def;
          };
          option.default(defaultValue).argParser(fn);
        } else {
          option.default(fn);
        }
        return this.addOption(option);
      }
      /**
       * Define option with `flags`, `description`, and optional argument parsing function or `defaultValue` or both.
       *
       * The `flags` string contains the short and/or long flags, separated by comma, a pipe or space. A required
       * option-argument is indicated by `<>` and an optional option-argument by `[]`.
       *
       * See the README for more details, and see also addOption() and requiredOption().
       *
       * @example
       * program
       *     .option('-p, --pepper', 'add pepper')
       *     .option('-p, --pizza-type <TYPE>', 'type of pizza') // required option-argument
       *     .option('-c, --cheese [CHEESE]', 'add extra cheese', 'mozzarella') // optional option-argument with default
       *     .option('-t, --tip <VALUE>', 'add tip to purchase cost', parseFloat) // custom parse function
       *
       * @param {string} flags
       * @param {string} [description]
       * @param {(Function|*)} [parseArg] - custom option processing function or default value
       * @param {*} [defaultValue]
       * @return {Command} `this` command for chaining
       */
      option(flags, description, parseArg, defaultValue) {
        return this._optionEx({}, flags, description, parseArg, defaultValue);
      }
      /**
       * Add a required option which must have a value after parsing. This usually means
       * the option must be specified on the command line. (Otherwise the same as .option().)
       *
       * The `flags` string contains the short and/or long flags, separated by comma, a pipe or space.
       *
       * @param {string} flags
       * @param {string} [description]
       * @param {(Function|*)} [parseArg] - custom option processing function or default value
       * @param {*} [defaultValue]
       * @return {Command} `this` command for chaining
       */
      requiredOption(flags, description, parseArg, defaultValue) {
        return this._optionEx(
          { mandatory: true },
          flags,
          description,
          parseArg,
          defaultValue
        );
      }
      /**
       * Alter parsing of short flags with optional values.
       *
       * @example
       * // for `.option('-f,--flag [value]'):
       * program.combineFlagAndOptionalValue(true);  // `-f80` is treated like `--flag=80`, this is the default behaviour
       * program.combineFlagAndOptionalValue(false) // `-fb` is treated like `-f -b`
       *
       * @param {boolean} [combine] - if `true` or omitted, an optional value can be specified directly after the flag.
       * @return {Command} `this` command for chaining
       */
      combineFlagAndOptionalValue(combine = true) {
        this._combineFlagAndOptionalValue = !!combine;
        return this;
      }
      /**
       * Allow unknown options on the command line.
       *
       * @param {boolean} [allowUnknown] - if `true` or omitted, no error will be thrown for unknown options.
       * @return {Command} `this` command for chaining
       */
      allowUnknownOption(allowUnknown = true) {
        this._allowUnknownOption = !!allowUnknown;
        return this;
      }
      /**
       * Allow excess command-arguments on the command line. Pass false to make excess arguments an error.
       *
       * @param {boolean} [allowExcess] - if `true` or omitted, no error will be thrown for excess arguments.
       * @return {Command} `this` command for chaining
       */
      allowExcessArguments(allowExcess = true) {
        this._allowExcessArguments = !!allowExcess;
        return this;
      }
      /**
       * Enable positional options. Positional means global options are specified before subcommands which lets
       * subcommands reuse the same option names, and also enables subcommands to turn on passThroughOptions.
       * The default behaviour is non-positional and global options may appear anywhere on the command line.
       *
       * @param {boolean} [positional]
       * @return {Command} `this` command for chaining
       */
      enablePositionalOptions(positional = true) {
        this._enablePositionalOptions = !!positional;
        return this;
      }
      /**
       * Pass through options that come after command-arguments rather than treat them as command-options,
       * so actual command-options come before command-arguments. Turning this on for a subcommand requires
       * positional options to have been enabled on the program (parent commands).
       * The default behaviour is non-positional and options may appear before or after command-arguments.
       *
       * @param {boolean} [passThrough] for unknown options.
       * @return {Command} `this` command for chaining
       */
      passThroughOptions(passThrough = true) {
        this._passThroughOptions = !!passThrough;
        this._checkForBrokenPassThrough();
        return this;
      }
      /**
       * @private
       */
      _checkForBrokenPassThrough() {
        if (this.parent && this._passThroughOptions && !this.parent._enablePositionalOptions) {
          throw new Error(
            `passThroughOptions cannot be used for '${this._name}' without turning on enablePositionalOptions for parent command(s)`
          );
        }
      }
      /**
       * Whether to store option values as properties on command object,
       * or store separately (specify false). In both cases the option values can be accessed using .opts().
       *
       * @param {boolean} [storeAsProperties=true]
       * @return {Command} `this` command for chaining
       */
      storeOptionsAsProperties(storeAsProperties = true) {
        if (this.options.length) {
          throw new Error("call .storeOptionsAsProperties() before adding options");
        }
        if (Object.keys(this._optionValues).length) {
          throw new Error(
            "call .storeOptionsAsProperties() before setting option values"
          );
        }
        this._storeOptionsAsProperties = !!storeAsProperties;
        return this;
      }
      /**
       * Retrieve option value.
       *
       * @param {string} key
       * @return {object} value
       */
      getOptionValue(key) {
        if (this._storeOptionsAsProperties) {
          return this[key];
        }
        return this._optionValues[key];
      }
      /**
       * Store option value.
       *
       * @param {string} key
       * @param {object} value
       * @return {Command} `this` command for chaining
       */
      setOptionValue(key, value) {
        return this.setOptionValueWithSource(key, value, void 0);
      }
      /**
       * Store option value and where the value came from.
       *
       * @param {string} key
       * @param {object} value
       * @param {string} source - expected values are default/config/env/cli/implied
       * @return {Command} `this` command for chaining
       */
      setOptionValueWithSource(key, value, source) {
        if (this._storeOptionsAsProperties) {
          this[key] = value;
        } else {
          this._optionValues[key] = value;
        }
        this._optionValueSources[key] = source;
        return this;
      }
      /**
       * Get source of option value.
       * Expected values are default | config | env | cli | implied
       *
       * @param {string} key
       * @return {string}
       */
      getOptionValueSource(key) {
        return this._optionValueSources[key];
      }
      /**
       * Get source of option value. See also .optsWithGlobals().
       * Expected values are default | config | env | cli | implied
       *
       * @param {string} key
       * @return {string}
       */
      getOptionValueSourceWithGlobals(key) {
        let source;
        this._getCommandAndAncestors().forEach((cmd) => {
          if (cmd.getOptionValueSource(key) !== void 0) {
            source = cmd.getOptionValueSource(key);
          }
        });
        return source;
      }
      /**
       * Get user arguments from implied or explicit arguments.
       * Side-effects: set _scriptPath if args included script. Used for default program name, and subcommand searches.
       *
       * @private
       */
      _prepareUserArgs(argv, parseOptions) {
        if (argv !== void 0 && !Array.isArray(argv)) {
          throw new Error("first parameter to parse must be array or undefined");
        }
        parseOptions = parseOptions || {};
        if (argv === void 0 && parseOptions.from === void 0) {
          if (process2.versions?.electron) {
            parseOptions.from = "electron";
          }
          const execArgv = process2.execArgv ?? [];
          if (execArgv.includes("-e") || execArgv.includes("--eval") || execArgv.includes("-p") || execArgv.includes("--print")) {
            parseOptions.from = "eval";
          }
        }
        if (argv === void 0) {
          argv = process2.argv;
        }
        this.rawArgs = argv.slice();
        let userArgs;
        switch (parseOptions.from) {
          case void 0:
          case "node":
            this._scriptPath = argv[1];
            userArgs = argv.slice(2);
            break;
          case "electron":
            if (process2.defaultApp) {
              this._scriptPath = argv[1];
              userArgs = argv.slice(2);
            } else {
              userArgs = argv.slice(1);
            }
            break;
          case "user":
            userArgs = argv.slice(0);
            break;
          case "eval":
            userArgs = argv.slice(1);
            break;
          default:
            throw new Error(
              `unexpected parse option { from: '${parseOptions.from}' }`
            );
        }
        if (!this._name && this._scriptPath)
          this.nameFromFilename(this._scriptPath);
        this._name = this._name || "program";
        return userArgs;
      }
      /**
       * Parse `argv`, setting options and invoking commands when defined.
       *
       * Use parseAsync instead of parse if any of your action handlers are async.
       *
       * Call with no parameters to parse `process.argv`. Detects Electron and special node options like `node --eval`. Easy mode!
       *
       * Or call with an array of strings to parse, and optionally where the user arguments start by specifying where the arguments are `from`:
       * - `'node'`: default, `argv[0]` is the application and `argv[1]` is the script being run, with user arguments after that
       * - `'electron'`: `argv[0]` is the application and `argv[1]` varies depending on whether the electron application is packaged
       * - `'user'`: just user arguments
       *
       * @example
       * program.parse(); // parse process.argv and auto-detect electron and special node flags
       * program.parse(process.argv); // assume argv[0] is app and argv[1] is script
       * program.parse(my-args, { from: 'user' }); // just user supplied arguments, nothing special about argv[0]
       *
       * @param {string[]} [argv] - optional, defaults to process.argv
       * @param {object} [parseOptions] - optionally specify style of options with from: node/user/electron
       * @param {string} [parseOptions.from] - where the args are from: 'node', 'user', 'electron'
       * @return {Command} `this` command for chaining
       */
      parse(argv, parseOptions) {
        const userArgs = this._prepareUserArgs(argv, parseOptions);
        this._parseCommand([], userArgs);
        return this;
      }
      /**
       * Parse `argv`, setting options and invoking commands when defined.
       *
       * Call with no parameters to parse `process.argv`. Detects Electron and special node options like `node --eval`. Easy mode!
       *
       * Or call with an array of strings to parse, and optionally where the user arguments start by specifying where the arguments are `from`:
       * - `'node'`: default, `argv[0]` is the application and `argv[1]` is the script being run, with user arguments after that
       * - `'electron'`: `argv[0]` is the application and `argv[1]` varies depending on whether the electron application is packaged
       * - `'user'`: just user arguments
       *
       * @example
       * await program.parseAsync(); // parse process.argv and auto-detect electron and special node flags
       * await program.parseAsync(process.argv); // assume argv[0] is app and argv[1] is script
       * await program.parseAsync(my-args, { from: 'user' }); // just user supplied arguments, nothing special about argv[0]
       *
       * @param {string[]} [argv]
       * @param {object} [parseOptions]
       * @param {string} parseOptions.from - where the args are from: 'node', 'user', 'electron'
       * @return {Promise}
       */
      async parseAsync(argv, parseOptions) {
        const userArgs = this._prepareUserArgs(argv, parseOptions);
        await this._parseCommand([], userArgs);
        return this;
      }
      /**
       * Execute a sub-command executable.
       *
       * @private
       */
      _executeSubCommand(subcommand, args) {
        args = args.slice();
        let launchWithNode = false;
        const sourceExt = [".js", ".ts", ".tsx", ".mjs", ".cjs"];
        function findFile(baseDir, baseName) {
          const localBin = path.resolve(baseDir, baseName);
          if (fs.existsSync(localBin))
            return localBin;
          if (sourceExt.includes(path.extname(baseName)))
            return void 0;
          const foundExt = sourceExt.find(
            (ext) => fs.existsSync(`${localBin}${ext}`)
          );
          if (foundExt)
            return `${localBin}${foundExt}`;
          return void 0;
        }
        this._checkForMissingMandatoryOptions();
        this._checkForConflictingOptions();
        let executableFile = subcommand._executableFile || `${this._name}-${subcommand._name}`;
        let executableDir = this._executableDir || "";
        if (this._scriptPath) {
          let resolvedScriptPath;
          try {
            resolvedScriptPath = fs.realpathSync(this._scriptPath);
          } catch (err) {
            resolvedScriptPath = this._scriptPath;
          }
          executableDir = path.resolve(
            path.dirname(resolvedScriptPath),
            executableDir
          );
        }
        if (executableDir) {
          let localFile = findFile(executableDir, executableFile);
          if (!localFile && !subcommand._executableFile && this._scriptPath) {
            const legacyName = path.basename(
              this._scriptPath,
              path.extname(this._scriptPath)
            );
            if (legacyName !== this._name) {
              localFile = findFile(
                executableDir,
                `${legacyName}-${subcommand._name}`
              );
            }
          }
          executableFile = localFile || executableFile;
        }
        launchWithNode = sourceExt.includes(path.extname(executableFile));
        let proc;
        if (process2.platform !== "win32") {
          if (launchWithNode) {
            args.unshift(executableFile);
            args = incrementNodeInspectorPort(process2.execArgv).concat(args);
            proc = childProcess.spawn(process2.argv[0], args, { stdio: "inherit" });
          } else {
            proc = childProcess.spawn(executableFile, args, { stdio: "inherit" });
          }
        } else {
          args.unshift(executableFile);
          args = incrementNodeInspectorPort(process2.execArgv).concat(args);
          proc = childProcess.spawn(process2.execPath, args, { stdio: "inherit" });
        }
        if (!proc.killed) {
          const signals = ["SIGUSR1", "SIGUSR2", "SIGTERM", "SIGINT", "SIGHUP"];
          signals.forEach((signal) => {
            process2.on(signal, () => {
              if (proc.killed === false && proc.exitCode === null) {
                proc.kill(signal);
              }
            });
          });
        }
        const exitCallback = this._exitCallback;
        proc.on("close", (code) => {
          code = code ?? 1;
          if (!exitCallback) {
            process2.exit(code);
          } else {
            exitCallback(
              new CommanderError2(
                code,
                "commander.executeSubCommandAsync",
                "(close)"
              )
            );
          }
        });
        proc.on("error", (err) => {
          if (err.code === "ENOENT") {
            const executableDirMessage = executableDir ? `searched for local subcommand relative to directory '${executableDir}'` : "no directory for search for local subcommand, use .executableDir() to supply a custom directory";
            const executableMissing = `'${executableFile}' does not exist
 - if '${subcommand._name}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead
 - if the default executable name is not suitable, use the executableFile option to supply a custom name or path
 - ${executableDirMessage}`;
            throw new Error(executableMissing);
          } else if (err.code === "EACCES") {
            throw new Error(`'${executableFile}' not executable`);
          }
          if (!exitCallback) {
            process2.exit(1);
          } else {
            const wrappedError = new CommanderError2(
              1,
              "commander.executeSubCommandAsync",
              "(error)"
            );
            wrappedError.nestedError = err;
            exitCallback(wrappedError);
          }
        });
        this.runningCommand = proc;
      }
      /**
       * @private
       */
      _dispatchSubcommand(commandName, operands, unknown) {
        const subCommand = this._findCommand(commandName);
        if (!subCommand)
          this.help({ error: true });
        let promiseChain;
        promiseChain = this._chainOrCallSubCommandHook(
          promiseChain,
          subCommand,
          "preSubcommand"
        );
        promiseChain = this._chainOrCall(promiseChain, () => {
          if (subCommand._executableHandler) {
            this._executeSubCommand(subCommand, operands.concat(unknown));
          } else {
            return subCommand._parseCommand(operands, unknown);
          }
        });
        return promiseChain;
      }
      /**
       * Invoke help directly if possible, or dispatch if necessary.
       * e.g. help foo
       *
       * @private
       */
      _dispatchHelpCommand(subcommandName) {
        if (!subcommandName) {
          this.help();
        }
        const subCommand = this._findCommand(subcommandName);
        if (subCommand && !subCommand._executableHandler) {
          subCommand.help();
        }
        return this._dispatchSubcommand(
          subcommandName,
          [],
          [this._getHelpOption()?.long ?? this._getHelpOption()?.short ?? "--help"]
        );
      }
      /**
       * Check this.args against expected this.registeredArguments.
       *
       * @private
       */
      _checkNumberOfArguments() {
        this.registeredArguments.forEach((arg, i) => {
          if (arg.required && this.args[i] == null) {
            this.missingArgument(arg.name());
          }
        });
        if (this.registeredArguments.length > 0 && this.registeredArguments[this.registeredArguments.length - 1].variadic) {
          return;
        }
        if (this.args.length > this.registeredArguments.length) {
          this._excessArguments(this.args);
        }
      }
      /**
       * Process this.args using this.registeredArguments and save as this.processedArgs!
       *
       * @private
       */
      _processArguments() {
        const myParseArg = (argument, value, previous) => {
          let parsedValue = value;
          if (value !== null && argument.parseArg) {
            const invalidValueMessage = `error: command-argument value '${value}' is invalid for argument '${argument.name()}'.`;
            parsedValue = this._callParseArg(
              argument,
              value,
              previous,
              invalidValueMessage
            );
          }
          return parsedValue;
        };
        this._checkNumberOfArguments();
        const processedArgs = [];
        this.registeredArguments.forEach((declaredArg, index) => {
          let value = declaredArg.defaultValue;
          if (declaredArg.variadic) {
            if (index < this.args.length) {
              value = this.args.slice(index);
              if (declaredArg.parseArg) {
                value = value.reduce((processed, v) => {
                  return myParseArg(declaredArg, v, processed);
                }, declaredArg.defaultValue);
              }
            } else if (value === void 0) {
              value = [];
            }
          } else if (index < this.args.length) {
            value = this.args[index];
            if (declaredArg.parseArg) {
              value = myParseArg(declaredArg, value, declaredArg.defaultValue);
            }
          }
          processedArgs[index] = value;
        });
        this.processedArgs = processedArgs;
      }
      /**
       * Once we have a promise we chain, but call synchronously until then.
       *
       * @param {(Promise|undefined)} promise
       * @param {Function} fn
       * @return {(Promise|undefined)}
       * @private
       */
      _chainOrCall(promise, fn) {
        if (promise && promise.then && typeof promise.then === "function") {
          return promise.then(() => fn());
        }
        return fn();
      }
      /**
       *
       * @param {(Promise|undefined)} promise
       * @param {string} event
       * @return {(Promise|undefined)}
       * @private
       */
      _chainOrCallHooks(promise, event) {
        let result = promise;
        const hooks = [];
        this._getCommandAndAncestors().reverse().filter((cmd) => cmd._lifeCycleHooks[event] !== void 0).forEach((hookedCommand) => {
          hookedCommand._lifeCycleHooks[event].forEach((callback) => {
            hooks.push({ hookedCommand, callback });
          });
        });
        if (event === "postAction") {
          hooks.reverse();
        }
        hooks.forEach((hookDetail) => {
          result = this._chainOrCall(result, () => {
            return hookDetail.callback(hookDetail.hookedCommand, this);
          });
        });
        return result;
      }
      /**
       *
       * @param {(Promise|undefined)} promise
       * @param {Command} subCommand
       * @param {string} event
       * @return {(Promise|undefined)}
       * @private
       */
      _chainOrCallSubCommandHook(promise, subCommand, event) {
        let result = promise;
        if (this._lifeCycleHooks[event] !== void 0) {
          this._lifeCycleHooks[event].forEach((hook) => {
            result = this._chainOrCall(result, () => {
              return hook(this, subCommand);
            });
          });
        }
        return result;
      }
      /**
       * Process arguments in context of this command.
       * Returns action result, in case it is a promise.
       *
       * @private
       */
      _parseCommand(operands, unknown) {
        const parsed = this.parseOptions(unknown);
        this._parseOptionsEnv();
        this._parseOptionsImplied();
        operands = operands.concat(parsed.operands);
        unknown = parsed.unknown;
        this.args = operands.concat(unknown);
        if (operands && this._findCommand(operands[0])) {
          return this._dispatchSubcommand(operands[0], operands.slice(1), unknown);
        }
        if (this._getHelpCommand() && operands[0] === this._getHelpCommand().name()) {
          return this._dispatchHelpCommand(operands[1]);
        }
        if (this._defaultCommandName) {
          this._outputHelpIfRequested(unknown);
          return this._dispatchSubcommand(
            this._defaultCommandName,
            operands,
            unknown
          );
        }
        if (this.commands.length && this.args.length === 0 && !this._actionHandler && !this._defaultCommandName) {
          this.help({ error: true });
        }
        this._outputHelpIfRequested(parsed.unknown);
        this._checkForMissingMandatoryOptions();
        this._checkForConflictingOptions();
        const checkForUnknownOptions = () => {
          if (parsed.unknown.length > 0) {
            this.unknownOption(parsed.unknown[0]);
          }
        };
        const commandEvent = `command:${this.name()}`;
        if (this._actionHandler) {
          checkForUnknownOptions();
          this._processArguments();
          let promiseChain;
          promiseChain = this._chainOrCallHooks(promiseChain, "preAction");
          promiseChain = this._chainOrCall(
            promiseChain,
            () => this._actionHandler(this.processedArgs)
          );
          if (this.parent) {
            promiseChain = this._chainOrCall(promiseChain, () => {
              this.parent.emit(commandEvent, operands, unknown);
            });
          }
          promiseChain = this._chainOrCallHooks(promiseChain, "postAction");
          return promiseChain;
        }
        if (this.parent && this.parent.listenerCount(commandEvent)) {
          checkForUnknownOptions();
          this._processArguments();
          this.parent.emit(commandEvent, operands, unknown);
        } else if (operands.length) {
          if (this._findCommand("*")) {
            return this._dispatchSubcommand("*", operands, unknown);
          }
          if (this.listenerCount("command:*")) {
            this.emit("command:*", operands, unknown);
          } else if (this.commands.length) {
            this.unknownCommand();
          } else {
            checkForUnknownOptions();
            this._processArguments();
          }
        } else if (this.commands.length) {
          checkForUnknownOptions();
          this.help({ error: true });
        } else {
          checkForUnknownOptions();
          this._processArguments();
        }
      }
      /**
       * Find matching command.
       *
       * @private
       * @return {Command | undefined}
       */
      _findCommand(name) {
        if (!name)
          return void 0;
        return this.commands.find(
          (cmd) => cmd._name === name || cmd._aliases.includes(name)
        );
      }
      /**
       * Return an option matching `arg` if any.
       *
       * @param {string} arg
       * @return {Option}
       * @package
       */
      _findOption(arg) {
        return this.options.find((option) => option.is(arg));
      }
      /**
       * Display an error message if a mandatory option does not have a value.
       * Called after checking for help flags in leaf subcommand.
       *
       * @private
       */
      _checkForMissingMandatoryOptions() {
        this._getCommandAndAncestors().forEach((cmd) => {
          cmd.options.forEach((anOption) => {
            if (anOption.mandatory && cmd.getOptionValue(anOption.attributeName()) === void 0) {
              cmd.missingMandatoryOptionValue(anOption);
            }
          });
        });
      }
      /**
       * Display an error message if conflicting options are used together in this.
       *
       * @private
       */
      _checkForConflictingLocalOptions() {
        const definedNonDefaultOptions = this.options.filter((option) => {
          const optionKey = option.attributeName();
          if (this.getOptionValue(optionKey) === void 0) {
            return false;
          }
          return this.getOptionValueSource(optionKey) !== "default";
        });
        const optionsWithConflicting = definedNonDefaultOptions.filter(
          (option) => option.conflictsWith.length > 0
        );
        optionsWithConflicting.forEach((option) => {
          const conflictingAndDefined = definedNonDefaultOptions.find(
            (defined) => option.conflictsWith.includes(defined.attributeName())
          );
          if (conflictingAndDefined) {
            this._conflictingOption(option, conflictingAndDefined);
          }
        });
      }
      /**
       * Display an error message if conflicting options are used together.
       * Called after checking for help flags in leaf subcommand.
       *
       * @private
       */
      _checkForConflictingOptions() {
        this._getCommandAndAncestors().forEach((cmd) => {
          cmd._checkForConflictingLocalOptions();
        });
      }
      /**
       * Parse options from `argv` removing known options,
       * and return argv split into operands and unknown arguments.
       *
       * Examples:
       *
       *     argv => operands, unknown
       *     --known kkk op => [op], []
       *     op --known kkk => [op], []
       *     sub --unknown uuu op => [sub], [--unknown uuu op]
       *     sub -- --unknown uuu op => [sub --unknown uuu op], []
       *
       * @param {string[]} argv
       * @return {{operands: string[], unknown: string[]}}
       */
      parseOptions(argv) {
        const operands = [];
        const unknown = [];
        let dest = operands;
        const args = argv.slice();
        function maybeOption(arg) {
          return arg.length > 1 && arg[0] === "-";
        }
        let activeVariadicOption = null;
        while (args.length) {
          const arg = args.shift();
          if (arg === "--") {
            if (dest === unknown)
              dest.push(arg);
            dest.push(...args);
            break;
          }
          if (activeVariadicOption && !maybeOption(arg)) {
            this.emit(`option:${activeVariadicOption.name()}`, arg);
            continue;
          }
          activeVariadicOption = null;
          if (maybeOption(arg)) {
            const option = this._findOption(arg);
            if (option) {
              if (option.required) {
                const value = args.shift();
                if (value === void 0)
                  this.optionMissingArgument(option);
                this.emit(`option:${option.name()}`, value);
              } else if (option.optional) {
                let value = null;
                if (args.length > 0 && !maybeOption(args[0])) {
                  value = args.shift();
                }
                this.emit(`option:${option.name()}`, value);
              } else {
                this.emit(`option:${option.name()}`);
              }
              activeVariadicOption = option.variadic ? option : null;
              continue;
            }
          }
          if (arg.length > 2 && arg[0] === "-" && arg[1] !== "-") {
            const option = this._findOption(`-${arg[1]}`);
            if (option) {
              if (option.required || option.optional && this._combineFlagAndOptionalValue) {
                this.emit(`option:${option.name()}`, arg.slice(2));
              } else {
                this.emit(`option:${option.name()}`);
                args.unshift(`-${arg.slice(2)}`);
              }
              continue;
            }
          }
          if (/^--[^=]+=/.test(arg)) {
            const index = arg.indexOf("=");
            const option = this._findOption(arg.slice(0, index));
            if (option && (option.required || option.optional)) {
              this.emit(`option:${option.name()}`, arg.slice(index + 1));
              continue;
            }
          }
          if (maybeOption(arg)) {
            dest = unknown;
          }
          if ((this._enablePositionalOptions || this._passThroughOptions) && operands.length === 0 && unknown.length === 0) {
            if (this._findCommand(arg)) {
              operands.push(arg);
              if (args.length > 0)
                unknown.push(...args);
              break;
            } else if (this._getHelpCommand() && arg === this._getHelpCommand().name()) {
              operands.push(arg);
              if (args.length > 0)
                operands.push(...args);
              break;
            } else if (this._defaultCommandName) {
              unknown.push(arg);
              if (args.length > 0)
                unknown.push(...args);
              break;
            }
          }
          if (this._passThroughOptions) {
            dest.push(arg);
            if (args.length > 0)
              dest.push(...args);
            break;
          }
          dest.push(arg);
        }
        return { operands, unknown };
      }
      /**
       * Return an object containing local option values as key-value pairs.
       *
       * @return {object}
       */
      opts() {
        if (this._storeOptionsAsProperties) {
          const result = {};
          const len = this.options.length;
          for (let i = 0; i < len; i++) {
            const key = this.options[i].attributeName();
            result[key] = key === this._versionOptionName ? this._version : this[key];
          }
          return result;
        }
        return this._optionValues;
      }
      /**
       * Return an object containing merged local and global option values as key-value pairs.
       *
       * @return {object}
       */
      optsWithGlobals() {
        return this._getCommandAndAncestors().reduce(
          (combinedOptions, cmd) => Object.assign(combinedOptions, cmd.opts()),
          {}
        );
      }
      /**
       * Display error message and exit (or call exitOverride).
       *
       * @param {string} message
       * @param {object} [errorOptions]
       * @param {string} [errorOptions.code] - an id string representing the error
       * @param {number} [errorOptions.exitCode] - used with process.exit
       */
      error(message, errorOptions) {
        this._outputConfiguration.outputError(
          `${message}
`,
          this._outputConfiguration.writeErr
        );
        if (typeof this._showHelpAfterError === "string") {
          this._outputConfiguration.writeErr(`${this._showHelpAfterError}
`);
        } else if (this._showHelpAfterError) {
          this._outputConfiguration.writeErr("\n");
          this.outputHelp({ error: true });
        }
        const config = errorOptions || {};
        const exitCode = config.exitCode || 1;
        const code = config.code || "commander.error";
        this._exit(exitCode, code, message);
      }
      /**
       * Apply any option related environment variables, if option does
       * not have a value from cli or client code.
       *
       * @private
       */
      _parseOptionsEnv() {
        this.options.forEach((option) => {
          if (option.envVar && option.envVar in process2.env) {
            const optionKey = option.attributeName();
            if (this.getOptionValue(optionKey) === void 0 || ["default", "config", "env"].includes(
              this.getOptionValueSource(optionKey)
            )) {
              if (option.required || option.optional) {
                this.emit(`optionEnv:${option.name()}`, process2.env[option.envVar]);
              } else {
                this.emit(`optionEnv:${option.name()}`);
              }
            }
          }
        });
      }
      /**
       * Apply any implied option values, if option is undefined or default value.
       *
       * @private
       */
      _parseOptionsImplied() {
        const dualHelper = new DualOptions(this.options);
        const hasCustomOptionValue = (optionKey) => {
          return this.getOptionValue(optionKey) !== void 0 && !["default", "implied"].includes(this.getOptionValueSource(optionKey));
        };
        this.options.filter(
          (option) => option.implied !== void 0 && hasCustomOptionValue(option.attributeName()) && dualHelper.valueFromOption(
            this.getOptionValue(option.attributeName()),
            option
          )
        ).forEach((option) => {
          Object.keys(option.implied).filter((impliedKey) => !hasCustomOptionValue(impliedKey)).forEach((impliedKey) => {
            this.setOptionValueWithSource(
              impliedKey,
              option.implied[impliedKey],
              "implied"
            );
          });
        });
      }
      /**
       * Argument `name` is missing.
       *
       * @param {string} name
       * @private
       */
      missingArgument(name) {
        const message = `error: missing required argument '${name}'`;
        this.error(message, { code: "commander.missingArgument" });
      }
      /**
       * `Option` is missing an argument.
       *
       * @param {Option} option
       * @private
       */
      optionMissingArgument(option) {
        const message = `error: option '${option.flags}' argument missing`;
        this.error(message, { code: "commander.optionMissingArgument" });
      }
      /**
       * `Option` does not have a value, and is a mandatory option.
       *
       * @param {Option} option
       * @private
       */
      missingMandatoryOptionValue(option) {
        const message = `error: required option '${option.flags}' not specified`;
        this.error(message, { code: "commander.missingMandatoryOptionValue" });
      }
      /**
       * `Option` conflicts with another option.
       *
       * @param {Option} option
       * @param {Option} conflictingOption
       * @private
       */
      _conflictingOption(option, conflictingOption) {
        const findBestOptionFromValue = (option2) => {
          const optionKey = option2.attributeName();
          const optionValue = this.getOptionValue(optionKey);
          const negativeOption = this.options.find(
            (target) => target.negate && optionKey === target.attributeName()
          );
          const positiveOption = this.options.find(
            (target) => !target.negate && optionKey === target.attributeName()
          );
          if (negativeOption && (negativeOption.presetArg === void 0 && optionValue === false || negativeOption.presetArg !== void 0 && optionValue === negativeOption.presetArg)) {
            return negativeOption;
          }
          return positiveOption || option2;
        };
        const getErrorMessage = (option2) => {
          const bestOption = findBestOptionFromValue(option2);
          const optionKey = bestOption.attributeName();
          const source = this.getOptionValueSource(optionKey);
          if (source === "env") {
            return `environment variable '${bestOption.envVar}'`;
          }
          return `option '${bestOption.flags}'`;
        };
        const message = `error: ${getErrorMessage(option)} cannot be used with ${getErrorMessage(conflictingOption)}`;
        this.error(message, { code: "commander.conflictingOption" });
      }
      /**
       * Unknown option `flag`.
       *
       * @param {string} flag
       * @private
       */
      unknownOption(flag) {
        if (this._allowUnknownOption)
          return;
        let suggestion = "";
        if (flag.startsWith("--") && this._showSuggestionAfterError) {
          let candidateFlags = [];
          let command = this;
          do {
            const moreFlags = command.createHelp().visibleOptions(command).filter((option) => option.long).map((option) => option.long);
            candidateFlags = candidateFlags.concat(moreFlags);
            command = command.parent;
          } while (command && !command._enablePositionalOptions);
          suggestion = suggestSimilar(flag, candidateFlags);
        }
        const message = `error: unknown option '${flag}'${suggestion}`;
        this.error(message, { code: "commander.unknownOption" });
      }
      /**
       * Excess arguments, more than expected.
       *
       * @param {string[]} receivedArgs
       * @private
       */
      _excessArguments(receivedArgs) {
        if (this._allowExcessArguments)
          return;
        const expected = this.registeredArguments.length;
        const s = expected === 1 ? "" : "s";
        const forSubcommand = this.parent ? ` for '${this.name()}'` : "";
        const message = `error: too many arguments${forSubcommand}. Expected ${expected} argument${s} but got ${receivedArgs.length}.`;
        this.error(message, { code: "commander.excessArguments" });
      }
      /**
       * Unknown command.
       *
       * @private
       */
      unknownCommand() {
        const unknownName = this.args[0];
        let suggestion = "";
        if (this._showSuggestionAfterError) {
          const candidateNames = [];
          this.createHelp().visibleCommands(this).forEach((command) => {
            candidateNames.push(command.name());
            if (command.alias())
              candidateNames.push(command.alias());
          });
          suggestion = suggestSimilar(unknownName, candidateNames);
        }
        const message = `error: unknown command '${unknownName}'${suggestion}`;
        this.error(message, { code: "commander.unknownCommand" });
      }
      /**
       * Get or set the program version.
       *
       * This method auto-registers the "-V, --version" option which will print the version number.
       *
       * You can optionally supply the flags and description to override the defaults.
       *
       * @param {string} [str]
       * @param {string} [flags]
       * @param {string} [description]
       * @return {(this | string | undefined)} `this` command for chaining, or version string if no arguments
       */
      version(str, flags, description) {
        if (str === void 0)
          return this._version;
        this._version = str;
        flags = flags || "-V, --version";
        description = description || "output the version number";
        const versionOption = this.createOption(flags, description);
        this._versionOptionName = versionOption.attributeName();
        this._registerOption(versionOption);
        this.on("option:" + versionOption.name(), () => {
          this._outputConfiguration.writeOut(`${str}
`);
          this._exit(0, "commander.version", str);
        });
        return this;
      }
      /**
       * Set the description.
       *
       * @param {string} [str]
       * @param {object} [argsDescription]
       * @return {(string|Command)}
       */
      description(str, argsDescription) {
        if (str === void 0 && argsDescription === void 0)
          return this._description;
        this._description = str;
        if (argsDescription) {
          this._argsDescription = argsDescription;
        }
        return this;
      }
      /**
       * Set the summary. Used when listed as subcommand of parent.
       *
       * @param {string} [str]
       * @return {(string|Command)}
       */
      summary(str) {
        if (str === void 0)
          return this._summary;
        this._summary = str;
        return this;
      }
      /**
       * Set an alias for the command.
       *
       * You may call more than once to add multiple aliases. Only the first alias is shown in the auto-generated help.
       *
       * @param {string} [alias]
       * @return {(string|Command)}
       */
      alias(alias) {
        if (alias === void 0)
          return this._aliases[0];
        let command = this;
        if (this.commands.length !== 0 && this.commands[this.commands.length - 1]._executableHandler) {
          command = this.commands[this.commands.length - 1];
        }
        if (alias === command._name)
          throw new Error("Command alias can't be the same as its name");
        const matchingCommand = this.parent?._findCommand(alias);
        if (matchingCommand) {
          const existingCmd = [matchingCommand.name()].concat(matchingCommand.aliases()).join("|");
          throw new Error(
            `cannot add alias '${alias}' to command '${this.name()}' as already have command '${existingCmd}'`
          );
        }
        command._aliases.push(alias);
        return this;
      }
      /**
       * Set aliases for the command.
       *
       * Only the first alias is shown in the auto-generated help.
       *
       * @param {string[]} [aliases]
       * @return {(string[]|Command)}
       */
      aliases(aliases) {
        if (aliases === void 0)
          return this._aliases;
        aliases.forEach((alias) => this.alias(alias));
        return this;
      }
      /**
       * Set / get the command usage `str`.
       *
       * @param {string} [str]
       * @return {(string|Command)}
       */
      usage(str) {
        if (str === void 0) {
          if (this._usage)
            return this._usage;
          const args = this.registeredArguments.map((arg) => {
            return humanReadableArgName(arg);
          });
          return [].concat(
            this.options.length || this._helpOption !== null ? "[options]" : [],
            this.commands.length ? "[command]" : [],
            this.registeredArguments.length ? args : []
          ).join(" ");
        }
        this._usage = str;
        return this;
      }
      /**
       * Get or set the name of the command.
       *
       * @param {string} [str]
       * @return {(string|Command)}
       */
      name(str) {
        if (str === void 0)
          return this._name;
        this._name = str;
        return this;
      }
      /**
       * Set the name of the command from script filename, such as process.argv[1],
       * or require.main.filename, or __filename.
       *
       * (Used internally and public although not documented in README.)
       *
       * @example
       * program.nameFromFilename(require.main.filename);
       *
       * @param {string} filename
       * @return {Command}
       */
      nameFromFilename(filename) {
        this._name = path.basename(filename, path.extname(filename));
        return this;
      }
      /**
       * Get or set the directory for searching for executable subcommands of this command.
       *
       * @example
       * program.executableDir(__dirname);
       * // or
       * program.executableDir('subcommands');
       *
       * @param {string} [path]
       * @return {(string|null|Command)}
       */
      executableDir(path2) {
        if (path2 === void 0)
          return this._executableDir;
        this._executableDir = path2;
        return this;
      }
      /**
       * Return program help documentation.
       *
       * @param {{ error: boolean }} [contextOptions] - pass {error:true} to wrap for stderr instead of stdout
       * @return {string}
       */
      helpInformation(contextOptions) {
        const helper = this.createHelp();
        if (helper.helpWidth === void 0) {
          helper.helpWidth = contextOptions && contextOptions.error ? this._outputConfiguration.getErrHelpWidth() : this._outputConfiguration.getOutHelpWidth();
        }
        return helper.formatHelp(this, helper);
      }
      /**
       * @private
       */
      _getHelpContext(contextOptions) {
        contextOptions = contextOptions || {};
        const context = { error: !!contextOptions.error };
        let write;
        if (context.error) {
          write = (arg) => this._outputConfiguration.writeErr(arg);
        } else {
          write = (arg) => this._outputConfiguration.writeOut(arg);
        }
        context.write = contextOptions.write || write;
        context.command = this;
        return context;
      }
      /**
       * Output help information for this command.
       *
       * Outputs built-in help, and custom text added using `.addHelpText()`.
       *
       * @param {{ error: boolean } | Function} [contextOptions] - pass {error:true} to write to stderr instead of stdout
       */
      outputHelp(contextOptions) {
        let deprecatedCallback;
        if (typeof contextOptions === "function") {
          deprecatedCallback = contextOptions;
          contextOptions = void 0;
        }
        const context = this._getHelpContext(contextOptions);
        this._getCommandAndAncestors().reverse().forEach((command) => command.emit("beforeAllHelp", context));
        this.emit("beforeHelp", context);
        let helpInformation = this.helpInformation(context);
        if (deprecatedCallback) {
          helpInformation = deprecatedCallback(helpInformation);
          if (typeof helpInformation !== "string" && !Buffer.isBuffer(helpInformation)) {
            throw new Error("outputHelp callback must return a string or a Buffer");
          }
        }
        context.write(helpInformation);
        if (this._getHelpOption()?.long) {
          this.emit(this._getHelpOption().long);
        }
        this.emit("afterHelp", context);
        this._getCommandAndAncestors().forEach(
          (command) => command.emit("afterAllHelp", context)
        );
      }
      /**
       * You can pass in flags and a description to customise the built-in help option.
       * Pass in false to disable the built-in help option.
       *
       * @example
       * program.helpOption('-?, --help' 'show help'); // customise
       * program.helpOption(false); // disable
       *
       * @param {(string | boolean)} flags
       * @param {string} [description]
       * @return {Command} `this` command for chaining
       */
      helpOption(flags, description) {
        if (typeof flags === "boolean") {
          if (flags) {
            this._helpOption = this._helpOption ?? void 0;
          } else {
            this._helpOption = null;
          }
          return this;
        }
        flags = flags ?? "-h, --help";
        description = description ?? "display help for command";
        this._helpOption = this.createOption(flags, description);
        return this;
      }
      /**
       * Lazy create help option.
       * Returns null if has been disabled with .helpOption(false).
       *
       * @returns {(Option | null)} the help option
       * @package
       */
      _getHelpOption() {
        if (this._helpOption === void 0) {
          this.helpOption(void 0, void 0);
        }
        return this._helpOption;
      }
      /**
       * Supply your own option to use for the built-in help option.
       * This is an alternative to using helpOption() to customise the flags and description etc.
       *
       * @param {Option} option
       * @return {Command} `this` command for chaining
       */
      addHelpOption(option) {
        this._helpOption = option;
        return this;
      }
      /**
       * Output help information and exit.
       *
       * Outputs built-in help, and custom text added using `.addHelpText()`.
       *
       * @param {{ error: boolean }} [contextOptions] - pass {error:true} to write to stderr instead of stdout
       */
      help(contextOptions) {
        this.outputHelp(contextOptions);
        let exitCode = process2.exitCode || 0;
        if (exitCode === 0 && contextOptions && typeof contextOptions !== "function" && contextOptions.error) {
          exitCode = 1;
        }
        this._exit(exitCode, "commander.help", "(outputHelp)");
      }
      /**
       * Add additional text to be displayed with the built-in help.
       *
       * Position is 'before' or 'after' to affect just this command,
       * and 'beforeAll' or 'afterAll' to affect this command and all its subcommands.
       *
       * @param {string} position - before or after built-in help
       * @param {(string | Function)} text - string to add, or a function returning a string
       * @return {Command} `this` command for chaining
       */
      addHelpText(position, text) {
        const allowedValues = ["beforeAll", "before", "after", "afterAll"];
        if (!allowedValues.includes(position)) {
          throw new Error(`Unexpected value for position to addHelpText.
Expecting one of '${allowedValues.join("', '")}'`);
        }
        const helpEvent = `${position}Help`;
        this.on(helpEvent, (context) => {
          let helpStr;
          if (typeof text === "function") {
            helpStr = text({ error: context.error, command: context.command });
          } else {
            helpStr = text;
          }
          if (helpStr) {
            context.write(`${helpStr}
`);
          }
        });
        return this;
      }
      /**
       * Output help information if help flags specified
       *
       * @param {Array} args - array of options to search for help flags
       * @private
       */
      _outputHelpIfRequested(args) {
        const helpOption = this._getHelpOption();
        const helpRequested = helpOption && args.find((arg) => helpOption.is(arg));
        if (helpRequested) {
          this.outputHelp();
          this._exit(0, "commander.helpDisplayed", "(outputHelp)");
        }
      }
    };
    function incrementNodeInspectorPort(args) {
      return args.map((arg) => {
        if (!arg.startsWith("--inspect")) {
          return arg;
        }
        let debugOption;
        let debugHost = "127.0.0.1";
        let debugPort = "9229";
        let match;
        if ((match = arg.match(/^(--inspect(-brk)?)$/)) !== null) {
          debugOption = match[1];
        } else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+)$/)) !== null) {
          debugOption = match[1];
          if (/^\d+$/.test(match[3])) {
            debugPort = match[3];
          } else {
            debugHost = match[3];
          }
        } else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/)) !== null) {
          debugOption = match[1];
          debugHost = match[3];
          debugPort = match[4];
        }
        if (debugOption && debugPort !== "0") {
          return `${debugOption}=${debugHost}:${parseInt(debugPort) + 1}`;
        }
        return arg;
      });
    }
    exports2.Command = Command2;
  }
});

// node_modules/commander/index.js
var require_commander = __commonJS({
  "node_modules/commander/index.js"(exports2) {
    var { Argument: Argument2 } = require_argument();
    var { Command: Command2 } = require_command();
    var { CommanderError: CommanderError2, InvalidArgumentError: InvalidArgumentError2 } = require_error();
    var { Help: Help2 } = require_help();
    var { Option: Option2 } = require_option();
    exports2.program = new Command2();
    exports2.createCommand = (name) => new Command2(name);
    exports2.createOption = (flags, description) => new Option2(flags, description);
    exports2.createArgument = (name, description) => new Argument2(name, description);
    exports2.Command = Command2;
    exports2.Option = Option2;
    exports2.Argument = Argument2;
    exports2.Help = Help2;
    exports2.CommanderError = CommanderError2;
    exports2.InvalidArgumentError = InvalidArgumentError2;
    exports2.InvalidOptionArgumentError = InvalidArgumentError2;
  }
});

// node_modules/pino-std-serializers/lib/err-helpers.js
var require_err_helpers = __commonJS({
  "node_modules/pino-std-serializers/lib/err-helpers.js"(exports2, module2) {
    "use strict";
    var isErrorLike = (err) => {
      return err && typeof err.message === "string";
    };
    var getErrorCause = (err) => {
      if (!err)
        return;
      const cause = err.cause;
      if (typeof cause === "function") {
        const causeResult = err.cause();
        return isErrorLike(causeResult) ? causeResult : void 0;
      } else {
        return isErrorLike(cause) ? cause : void 0;
      }
    };
    var _stackWithCauses = (err, seen) => {
      if (!isErrorLike(err))
        return "";
      const stack = err.stack || "";
      if (seen.has(err)) {
        return stack + "\ncauses have become circular...";
      }
      const cause = getErrorCause(err);
      if (cause) {
        seen.add(err);
        return stack + "\ncaused by: " + _stackWithCauses(cause, seen);
      } else {
        return stack;
      }
    };
    var stackWithCauses = (err) => _stackWithCauses(err, /* @__PURE__ */ new Set());
    var _messageWithCauses = (err, seen, skip) => {
      if (!isErrorLike(err))
        return "";
      const message = skip ? "" : err.message || "";
      if (seen.has(err)) {
        return message + ": ...";
      }
      const cause = getErrorCause(err);
      if (cause) {
        seen.add(err);
        const skipIfVErrorStyleCause = typeof err.cause === "function";
        return message + (skipIfVErrorStyleCause ? "" : ": ") + _messageWithCauses(cause, seen, skipIfVErrorStyleCause);
      } else {
        return message;
      }
    };
    var messageWithCauses = (err) => _messageWithCauses(err, /* @__PURE__ */ new Set());
    module2.exports = {
      isErrorLike,
      getErrorCause,
      stackWithCauses,
      messageWithCauses
    };
  }
});

// node_modules/pino-std-serializers/lib/err-proto.js
var require_err_proto = __commonJS({
  "node_modules/pino-std-serializers/lib/err-proto.js"(exports2, module2) {
    "use strict";
    var seen = Symbol("circular-ref-tag");
    var rawSymbol = Symbol("pino-raw-err-ref");
    var pinoErrProto = Object.create({}, {
      type: {
        enumerable: true,
        writable: true,
        value: void 0
      },
      message: {
        enumerable: true,
        writable: true,
        value: void 0
      },
      stack: {
        enumerable: true,
        writable: true,
        value: void 0
      },
      aggregateErrors: {
        enumerable: true,
        writable: true,
        value: void 0
      },
      raw: {
        enumerable: false,
        get: function() {
          return this[rawSymbol];
        },
        set: function(val) {
          this[rawSymbol] = val;
        }
      }
    });
    Object.defineProperty(pinoErrProto, rawSymbol, {
      writable: true,
      value: {}
    });
    module2.exports = {
      pinoErrProto,
      pinoErrorSymbols: {
        seen,
        rawSymbol
      }
    };
  }
});

// node_modules/pino-std-serializers/lib/err.js
var require_err = __commonJS({
  "node_modules/pino-std-serializers/lib/err.js"(exports2, module2) {
    "use strict";
    module2.exports = errSerializer;
    var { messageWithCauses, stackWithCauses, isErrorLike } = require_err_helpers();
    var { pinoErrProto, pinoErrorSymbols } = require_err_proto();
    var { seen } = pinoErrorSymbols;
    var { toString } = Object.prototype;
    function errSerializer(err) {
      if (!isErrorLike(err)) {
        return err;
      }
      err[seen] = void 0;
      const _err = Object.create(pinoErrProto);
      _err.type = toString.call(err.constructor) === "[object Function]" ? err.constructor.name : err.name;
      _err.message = messageWithCauses(err);
      _err.stack = stackWithCauses(err);
      if (Array.isArray(err.errors)) {
        _err.aggregateErrors = err.errors.map((err2) => errSerializer(err2));
      }
      for (const key in err) {
        if (_err[key] === void 0) {
          const val = err[key];
          if (isErrorLike(val)) {
            if (key !== "cause" && !Object.prototype.hasOwnProperty.call(val, seen)) {
              _err[key] = errSerializer(val);
            }
          } else {
            _err[key] = val;
          }
        }
      }
      delete err[seen];
      _err.raw = err;
      return _err;
    }
  }
});

// node_modules/pino-std-serializers/lib/err-with-cause.js
var require_err_with_cause = __commonJS({
  "node_modules/pino-std-serializers/lib/err-with-cause.js"(exports2, module2) {
    "use strict";
    module2.exports = errWithCauseSerializer;
    var { isErrorLike } = require_err_helpers();
    var { pinoErrProto, pinoErrorSymbols } = require_err_proto();
    var { seen } = pinoErrorSymbols;
    var { toString } = Object.prototype;
    function errWithCauseSerializer(err) {
      if (!isErrorLike(err)) {
        return err;
      }
      err[seen] = void 0;
      const _err = Object.create(pinoErrProto);
      _err.type = toString.call(err.constructor) === "[object Function]" ? err.constructor.name : err.name;
      _err.message = err.message;
      _err.stack = err.stack;
      if (Array.isArray(err.errors)) {
        _err.aggregateErrors = err.errors.map((err2) => errWithCauseSerializer(err2));
      }
      if (isErrorLike(err.cause) && !Object.prototype.hasOwnProperty.call(err.cause, seen)) {
        _err.cause = errWithCauseSerializer(err.cause);
      }
      for (const key in err) {
        if (_err[key] === void 0) {
          const val = err[key];
          if (isErrorLike(val)) {
            if (!Object.prototype.hasOwnProperty.call(val, seen)) {
              _err[key] = errWithCauseSerializer(val);
            }
          } else {
            _err[key] = val;
          }
        }
      }
      delete err[seen];
      _err.raw = err;
      return _err;
    }
  }
});

// node_modules/pino-std-serializers/lib/req.js
var require_req = __commonJS({
  "node_modules/pino-std-serializers/lib/req.js"(exports2, module2) {
    "use strict";
    module2.exports = {
      mapHttpRequest,
      reqSerializer
    };
    var rawSymbol = Symbol("pino-raw-req-ref");
    var pinoReqProto = Object.create({}, {
      id: {
        enumerable: true,
        writable: true,
        value: ""
      },
      method: {
        enumerable: true,
        writable: true,
        value: ""
      },
      url: {
        enumerable: true,
        writable: true,
        value: ""
      },
      query: {
        enumerable: true,
        writable: true,
        value: ""
      },
      params: {
        enumerable: true,
        writable: true,
        value: ""
      },
      headers: {
        enumerable: true,
        writable: true,
        value: {}
      },
      remoteAddress: {
        enumerable: true,
        writable: true,
        value: ""
      },
      remotePort: {
        enumerable: true,
        writable: true,
        value: ""
      },
      raw: {
        enumerable: false,
        get: function() {
          return this[rawSymbol];
        },
        set: function(val) {
          this[rawSymbol] = val;
        }
      }
    });
    Object.defineProperty(pinoReqProto, rawSymbol, {
      writable: true,
      value: {}
    });
    function reqSerializer(req) {
      const connection = req.info || req.socket;
      const _req = Object.create(pinoReqProto);
      _req.id = typeof req.id === "function" ? req.id() : req.id || (req.info ? req.info.id : void 0);
      _req.method = req.method;
      if (req.originalUrl) {
        _req.url = req.originalUrl;
      } else {
        const path = req.path;
        _req.url = typeof path === "string" ? path : req.url ? req.url.path || req.url : void 0;
      }
      if (req.query) {
        _req.query = req.query;
      }
      if (req.params) {
        _req.params = req.params;
      }
      _req.headers = req.headers;
      _req.remoteAddress = connection && connection.remoteAddress;
      _req.remotePort = connection && connection.remotePort;
      _req.raw = req.raw || req;
      return _req;
    }
    function mapHttpRequest(req) {
      return {
        req: reqSerializer(req)
      };
    }
  }
});

// node_modules/pino-std-serializers/lib/res.js
var require_res = __commonJS({
  "node_modules/pino-std-serializers/lib/res.js"(exports2, module2) {
    "use strict";
    module2.exports = {
      mapHttpResponse,
      resSerializer
    };
    var rawSymbol = Symbol("pino-raw-res-ref");
    var pinoResProto = Object.create({}, {
      statusCode: {
        enumerable: true,
        writable: true,
        value: 0
      },
      headers: {
        enumerable: true,
        writable: true,
        value: ""
      },
      raw: {
        enumerable: false,
        get: function() {
          return this[rawSymbol];
        },
        set: function(val) {
          this[rawSymbol] = val;
        }
      }
    });
    Object.defineProperty(pinoResProto, rawSymbol, {
      writable: true,
      value: {}
    });
    function resSerializer(res) {
      const _res = Object.create(pinoResProto);
      _res.statusCode = res.headersSent ? res.statusCode : null;
      _res.headers = res.getHeaders ? res.getHeaders() : res._headers;
      _res.raw = res;
      return _res;
    }
    function mapHttpResponse(res) {
      return {
        res: resSerializer(res)
      };
    }
  }
});

// node_modules/pino-std-serializers/index.js
var require_pino_std_serializers = __commonJS({
  "node_modules/pino-std-serializers/index.js"(exports2, module2) {
    "use strict";
    var errSerializer = require_err();
    var errWithCauseSerializer = require_err_with_cause();
    var reqSerializers = require_req();
    var resSerializers = require_res();
    module2.exports = {
      err: errSerializer,
      errWithCause: errWithCauseSerializer,
      mapHttpRequest: reqSerializers.mapHttpRequest,
      mapHttpResponse: resSerializers.mapHttpResponse,
      req: reqSerializers.reqSerializer,
      res: resSerializers.resSerializer,
      wrapErrorSerializer: function wrapErrorSerializer(customSerializer) {
        if (customSerializer === errSerializer)
          return customSerializer;
        return function wrapErrSerializer(err) {
          return customSerializer(errSerializer(err));
        };
      },
      wrapRequestSerializer: function wrapRequestSerializer(customSerializer) {
        if (customSerializer === reqSerializers.reqSerializer)
          return customSerializer;
        return function wrappedReqSerializer(req) {
          return customSerializer(reqSerializers.reqSerializer(req));
        };
      },
      wrapResponseSerializer: function wrapResponseSerializer(customSerializer) {
        if (customSerializer === resSerializers.resSerializer)
          return customSerializer;
        return function wrappedResSerializer(res) {
          return customSerializer(resSerializers.resSerializer(res));
        };
      }
    };
  }
});

// node_modules/pino/lib/caller.js
var require_caller = __commonJS({
  "node_modules/pino/lib/caller.js"(exports2, module2) {
    "use strict";
    function noOpPrepareStackTrace(_, stack) {
      return stack;
    }
    module2.exports = function getCallers() {
      const originalPrepare = Error.prepareStackTrace;
      Error.prepareStackTrace = noOpPrepareStackTrace;
      const stack = new Error().stack;
      Error.prepareStackTrace = originalPrepare;
      if (!Array.isArray(stack)) {
        return void 0;
      }
      const entries = stack.slice(2);
      const fileNames = [];
      for (const entry of entries) {
        if (!entry) {
          continue;
        }
        fileNames.push(entry.getFileName());
      }
      return fileNames;
    };
  }
});

// node_modules/fast-redact/lib/validator.js
var require_validator = __commonJS({
  "node_modules/fast-redact/lib/validator.js"(exports2, module2) {
    "use strict";
    module2.exports = validator;
    function validator(opts = {}) {
      const {
        ERR_PATHS_MUST_BE_STRINGS = () => "fast-redact - Paths must be (non-empty) strings",
        ERR_INVALID_PATH = (s) => `fast-redact \u2013 Invalid path (${s})`
      } = opts;
      return function validate({ paths }) {
        paths.forEach((s) => {
          if (typeof s !== "string") {
            throw Error(ERR_PATHS_MUST_BE_STRINGS());
          }
          try {
            if (/〇/.test(s))
              throw Error();
            const expr = (s[0] === "[" ? "" : ".") + s.replace(/^\*/, "\u3007").replace(/\.\*/g, ".\u3007").replace(/\[\*\]/g, "[\u3007]");
            if (/\n|\r|;/.test(expr))
              throw Error();
            if (/\/\*/.test(expr))
              throw Error();
            Function(`
            'use strict'
            const o = new Proxy({}, { get: () => o, set: () => { throw Error() } });
            const \u3007 = null;
            o${expr}
            if ([o${expr}].length !== 1) throw Error()`)();
          } catch (e) {
            throw Error(ERR_INVALID_PATH(s));
          }
        });
      };
    }
  }
});

// node_modules/fast-redact/lib/rx.js
var require_rx = __commonJS({
  "node_modules/fast-redact/lib/rx.js"(exports2, module2) {
    "use strict";
    module2.exports = /[^.[\]]+|\[((?:.)*?)\]/g;
  }
});

// node_modules/fast-redact/lib/parse.js
var require_parse = __commonJS({
  "node_modules/fast-redact/lib/parse.js"(exports2, module2) {
    "use strict";
    var rx = require_rx();
    module2.exports = parse;
    function parse({ paths }) {
      const wildcards = [];
      var wcLen = 0;
      const secret = paths.reduce(function(o, strPath, ix) {
        var path = strPath.match(rx).map((p) => p.replace(/'|"|`/g, ""));
        const leadingBracket = strPath[0] === "[";
        path = path.map((p) => {
          if (p[0] === "[")
            return p.substr(1, p.length - 2);
          else
            return p;
        });
        const star = path.indexOf("*");
        if (star > -1) {
          const before = path.slice(0, star);
          const beforeStr = before.join(".");
          const after = path.slice(star + 1, path.length);
          const nested = after.length > 0;
          wcLen++;
          wildcards.push({
            before,
            beforeStr,
            after,
            nested
          });
        } else {
          o[strPath] = {
            path,
            val: void 0,
            precensored: false,
            circle: "",
            escPath: JSON.stringify(strPath),
            leadingBracket
          };
        }
        return o;
      }, {});
      return { wildcards, wcLen, secret };
    }
  }
});

// node_modules/fast-redact/lib/redactor.js
var require_redactor = __commonJS({
  "node_modules/fast-redact/lib/redactor.js"(exports2, module2) {
    "use strict";
    var rx = require_rx();
    module2.exports = redactor;
    function redactor({ secret, serialize, wcLen, strict, isCensorFct, censorFctTakesPath }, state) {
      const redact = Function("o", `
    if (typeof o !== 'object' || o == null) {
      ${strictImpl(strict, serialize)}
    }
    const { censor, secret } = this
    const originalSecret = {}
    const secretKeys = Object.keys(secret)
    for (var i = 0; i < secretKeys.length; i++) {
      originalSecret[secretKeys[i]] = secret[secretKeys[i]]
    }

    ${redactTmpl(secret, isCensorFct, censorFctTakesPath)}
    this.compileRestore()
    ${dynamicRedactTmpl(wcLen > 0, isCensorFct, censorFctTakesPath)}
    this.secret = originalSecret
    ${resultTmpl(serialize)}
  `).bind(state);
      redact.state = state;
      if (serialize === false) {
        redact.restore = (o) => state.restore(o);
      }
      return redact;
    }
    function redactTmpl(secret, isCensorFct, censorFctTakesPath) {
      return Object.keys(secret).map((path) => {
        const { escPath, leadingBracket, path: arrPath } = secret[path];
        const skip = leadingBracket ? 1 : 0;
        const delim = leadingBracket ? "" : ".";
        const hops = [];
        var match;
        while ((match = rx.exec(path)) !== null) {
          const [, ix] = match;
          const { index, input } = match;
          if (index > skip)
            hops.push(input.substring(0, index - (ix ? 0 : 1)));
        }
        var existence = hops.map((p) => `o${delim}${p}`).join(" && ");
        if (existence.length === 0)
          existence += `o${delim}${path} != null`;
        else
          existence += ` && o${delim}${path} != null`;
        const circularDetection = `
      switch (true) {
        ${hops.reverse().map((p) => `
          case o${delim}${p} === censor:
            secret[${escPath}].circle = ${JSON.stringify(p)}
            break
        `).join("\n")}
      }
    `;
        const censorArgs = censorFctTakesPath ? `val, ${JSON.stringify(arrPath)}` : `val`;
        return `
      if (${existence}) {
        const val = o${delim}${path}
        if (val === censor) {
          secret[${escPath}].precensored = true
        } else {
          secret[${escPath}].val = val
          o${delim}${path} = ${isCensorFct ? `censor(${censorArgs})` : "censor"}
          ${circularDetection}
        }
      }
    `;
      }).join("\n");
    }
    function dynamicRedactTmpl(hasWildcards, isCensorFct, censorFctTakesPath) {
      return hasWildcards === true ? `
    {
      const { wildcards, wcLen, groupRedact, nestedRedact } = this
      for (var i = 0; i < wcLen; i++) {
        const { before, beforeStr, after, nested } = wildcards[i]
        if (nested === true) {
          secret[beforeStr] = secret[beforeStr] || []
          nestedRedact(secret[beforeStr], o, before, after, censor, ${isCensorFct}, ${censorFctTakesPath})
        } else secret[beforeStr] = groupRedact(o, before, censor, ${isCensorFct}, ${censorFctTakesPath})
      }
    }
  ` : "";
    }
    function resultTmpl(serialize) {
      return serialize === false ? `return o` : `
    var s = this.serialize(o)
    this.restore(o)
    return s
  `;
    }
    function strictImpl(strict, serialize) {
      return strict === true ? `throw Error('fast-redact: primitives cannot be redacted')` : serialize === false ? `return o` : `return this.serialize(o)`;
    }
  }
});

// node_modules/fast-redact/lib/modifiers.js
var require_modifiers = __commonJS({
  "node_modules/fast-redact/lib/modifiers.js"(exports2, module2) {
    "use strict";
    module2.exports = {
      groupRedact,
      groupRestore,
      nestedRedact,
      nestedRestore
    };
    function groupRestore({ keys, values, target }) {
      if (target == null || typeof target === "string")
        return;
      const length = keys.length;
      for (var i = 0; i < length; i++) {
        const k = keys[i];
        target[k] = values[i];
      }
    }
    function groupRedact(o, path, censor, isCensorFct, censorFctTakesPath) {
      const target = get(o, path);
      if (target == null || typeof target === "string")
        return { keys: null, values: null, target, flat: true };
      const keys = Object.keys(target);
      const keysLength = keys.length;
      const pathLength = path.length;
      const pathWithKey = censorFctTakesPath ? [...path] : void 0;
      const values = new Array(keysLength);
      for (var i = 0; i < keysLength; i++) {
        const key = keys[i];
        values[i] = target[key];
        if (censorFctTakesPath) {
          pathWithKey[pathLength] = key;
          target[key] = censor(target[key], pathWithKey);
        } else if (isCensorFct) {
          target[key] = censor(target[key]);
        } else {
          target[key] = censor;
        }
      }
      return { keys, values, target, flat: true };
    }
    function nestedRestore(instructions) {
      for (let i = 0; i < instructions.length; i++) {
        const { target, path, value } = instructions[i];
        let current = target;
        for (let i2 = path.length - 1; i2 > 0; i2--) {
          current = current[path[i2]];
        }
        current[path[0]] = value;
      }
    }
    function nestedRedact(store, o, path, ns, censor, isCensorFct, censorFctTakesPath) {
      const target = get(o, path);
      if (target == null)
        return;
      const keys = Object.keys(target);
      const keysLength = keys.length;
      for (var i = 0; i < keysLength; i++) {
        const key = keys[i];
        specialSet(store, target, key, path, ns, censor, isCensorFct, censorFctTakesPath);
      }
      return store;
    }
    function has(obj, prop) {
      return obj !== void 0 && obj !== null ? "hasOwn" in Object ? Object.hasOwn(obj, prop) : Object.prototype.hasOwnProperty.call(obj, prop) : false;
    }
    function specialSet(store, o, k, path, afterPath, censor, isCensorFct, censorFctTakesPath) {
      const afterPathLen = afterPath.length;
      const lastPathIndex = afterPathLen - 1;
      const originalKey = k;
      var i = -1;
      var n;
      var nv;
      var ov;
      var oov = null;
      var wc = null;
      var kIsWc;
      var wcov;
      var consecutive = false;
      var level = 0;
      var depth = 0;
      var redactPathCurrent = tree();
      ov = n = o[k];
      if (typeof n !== "object")
        return;
      while (n != null && ++i < afterPathLen) {
        depth += 1;
        k = afterPath[i];
        oov = ov;
        if (k !== "*" && !wc && !(typeof n === "object" && k in n)) {
          break;
        }
        if (k === "*") {
          if (wc === "*") {
            consecutive = true;
          }
          wc = k;
          if (i !== lastPathIndex) {
            continue;
          }
        }
        if (wc) {
          const wcKeys = Object.keys(n);
          for (var j = 0; j < wcKeys.length; j++) {
            const wck = wcKeys[j];
            wcov = n[wck];
            kIsWc = k === "*";
            if (consecutive) {
              redactPathCurrent = node(redactPathCurrent, wck, depth);
              level = i;
              ov = iterateNthLevel(wcov, level - 1, k, path, afterPath, censor, isCensorFct, censorFctTakesPath, originalKey, n, nv, ov, kIsWc, wck, i, lastPathIndex, redactPathCurrent, store, o[originalKey], depth + 1);
            } else {
              if (kIsWc || typeof wcov === "object" && wcov !== null && k in wcov) {
                if (kIsWc) {
                  ov = wcov;
                } else {
                  ov = wcov[k];
                }
                nv = i !== lastPathIndex ? ov : isCensorFct ? censorFctTakesPath ? censor(ov, [...path, originalKey, ...afterPath]) : censor(ov) : censor;
                if (kIsWc) {
                  const rv = restoreInstr(node(redactPathCurrent, wck, depth), ov, o[originalKey]);
                  store.push(rv);
                  n[wck] = nv;
                } else {
                  if (wcov[k] === nv) {
                  } else if (nv === void 0 && censor !== void 0 || has(wcov, k) && nv === ov) {
                    redactPathCurrent = node(redactPathCurrent, wck, depth);
                  } else {
                    redactPathCurrent = node(redactPathCurrent, wck, depth);
                    const rv = restoreInstr(node(redactPathCurrent, k, depth + 1), ov, o[originalKey]);
                    store.push(rv);
                    wcov[k] = nv;
                  }
                }
              }
            }
          }
          wc = null;
        } else {
          ov = n[k];
          redactPathCurrent = node(redactPathCurrent, k, depth);
          nv = i !== lastPathIndex ? ov : isCensorFct ? censorFctTakesPath ? censor(ov, [...path, originalKey, ...afterPath]) : censor(ov) : censor;
          if (has(n, k) && nv === ov || nv === void 0 && censor !== void 0) {
          } else {
            const rv = restoreInstr(redactPathCurrent, ov, o[originalKey]);
            store.push(rv);
            n[k] = nv;
          }
          n = n[k];
        }
        if (typeof n !== "object")
          break;
        if (ov === oov || typeof ov === "undefined") {
        }
      }
    }
    function get(o, p) {
      var i = -1;
      var l = p.length;
      var n = o;
      while (n != null && ++i < l) {
        n = n[p[i]];
      }
      return n;
    }
    function iterateNthLevel(wcov, level, k, path, afterPath, censor, isCensorFct, censorFctTakesPath, originalKey, n, nv, ov, kIsWc, wck, i, lastPathIndex, redactPathCurrent, store, parent, depth) {
      if (level === 0) {
        if (kIsWc || typeof wcov === "object" && wcov !== null && k in wcov) {
          if (kIsWc) {
            ov = wcov;
          } else {
            ov = wcov[k];
          }
          nv = i !== lastPathIndex ? ov : isCensorFct ? censorFctTakesPath ? censor(ov, [...path, originalKey, ...afterPath]) : censor(ov) : censor;
          if (kIsWc) {
            const rv = restoreInstr(redactPathCurrent, ov, parent);
            store.push(rv);
            n[wck] = nv;
          } else {
            if (wcov[k] === nv) {
            } else if (nv === void 0 && censor !== void 0 || has(wcov, k) && nv === ov) {
            } else {
              const rv = restoreInstr(node(redactPathCurrent, k, depth + 1), ov, parent);
              store.push(rv);
              wcov[k] = nv;
            }
          }
        }
      }
      for (const key in wcov) {
        if (typeof wcov[key] === "object") {
          redactPathCurrent = node(redactPathCurrent, key, depth);
          iterateNthLevel(wcov[key], level - 1, k, path, afterPath, censor, isCensorFct, censorFctTakesPath, originalKey, n, nv, ov, kIsWc, wck, i, lastPathIndex, redactPathCurrent, store, parent, depth + 1);
        }
      }
    }
    function tree() {
      return { parent: null, key: null, children: [], depth: 0 };
    }
    function node(parent, key, depth) {
      if (parent.depth === depth) {
        return node(parent.parent, key, depth);
      }
      var child = {
        parent,
        key,
        depth,
        children: []
      };
      parent.children.push(child);
      return child;
    }
    function restoreInstr(node2, value, target) {
      let current = node2;
      const path = [];
      do {
        path.push(current.key);
        current = current.parent;
      } while (current.parent != null);
      return { path, value, target };
    }
  }
});

// node_modules/fast-redact/lib/restorer.js
var require_restorer = __commonJS({
  "node_modules/fast-redact/lib/restorer.js"(exports2, module2) {
    "use strict";
    var { groupRestore, nestedRestore } = require_modifiers();
    module2.exports = restorer;
    function restorer() {
      return function compileRestore() {
        if (this.restore) {
          this.restore.state.secret = this.secret;
          return;
        }
        const { secret, wcLen } = this;
        const paths = Object.keys(secret);
        const resetters = resetTmpl(secret, paths);
        const hasWildcards = wcLen > 0;
        const state = hasWildcards ? { secret, groupRestore, nestedRestore } : { secret };
        this.restore = Function(
          "o",
          restoreTmpl(resetters, paths, hasWildcards)
        ).bind(state);
        this.restore.state = state;
      };
    }
    function resetTmpl(secret, paths) {
      return paths.map((path) => {
        const { circle, escPath, leadingBracket } = secret[path];
        const delim = leadingBracket ? "" : ".";
        const reset = circle ? `o.${circle} = secret[${escPath}].val` : `o${delim}${path} = secret[${escPath}].val`;
        const clear = `secret[${escPath}].val = undefined`;
        return `
      if (secret[${escPath}].val !== undefined) {
        try { ${reset} } catch (e) {}
        ${clear}
      }
    `;
      }).join("");
    }
    function restoreTmpl(resetters, paths, hasWildcards) {
      const dynamicReset = hasWildcards === true ? `
    const keys = Object.keys(secret)
    const len = keys.length
    for (var i = len - 1; i >= ${paths.length}; i--) {
      const k = keys[i]
      const o = secret[k]
      if (o) {
        if (o.flat === true) this.groupRestore(o)
        else this.nestedRestore(o)
        secret[k] = null
      }
    }
  ` : "";
      return `
    const secret = this.secret
    ${dynamicReset}
    ${resetters}
    return o
  `;
    }
  }
});

// node_modules/fast-redact/lib/state.js
var require_state = __commonJS({
  "node_modules/fast-redact/lib/state.js"(exports2, module2) {
    "use strict";
    module2.exports = state;
    function state(o) {
      const {
        secret,
        censor,
        compileRestore,
        serialize,
        groupRedact,
        nestedRedact,
        wildcards,
        wcLen
      } = o;
      const builder = [{ secret, censor, compileRestore }];
      if (serialize !== false)
        builder.push({ serialize });
      if (wcLen > 0)
        builder.push({ groupRedact, nestedRedact, wildcards, wcLen });
      return Object.assign(...builder);
    }
  }
});

// node_modules/fast-redact/index.js
var require_fast_redact = __commonJS({
  "node_modules/fast-redact/index.js"(exports2, module2) {
    "use strict";
    var validator = require_validator();
    var parse = require_parse();
    var redactor = require_redactor();
    var restorer = require_restorer();
    var { groupRedact, nestedRedact } = require_modifiers();
    var state = require_state();
    var rx = require_rx();
    var validate = validator();
    var noop = (o) => o;
    noop.restore = noop;
    var DEFAULT_CENSOR = "[REDACTED]";
    fastRedact.rx = rx;
    fastRedact.validator = validator;
    module2.exports = fastRedact;
    function fastRedact(opts = {}) {
      const paths = Array.from(new Set(opts.paths || []));
      const serialize = "serialize" in opts ? opts.serialize === false ? opts.serialize : typeof opts.serialize === "function" ? opts.serialize : JSON.stringify : JSON.stringify;
      const remove = opts.remove;
      if (remove === true && serialize !== JSON.stringify) {
        throw Error("fast-redact \u2013 remove option may only be set when serializer is JSON.stringify");
      }
      const censor = remove === true ? void 0 : "censor" in opts ? opts.censor : DEFAULT_CENSOR;
      const isCensorFct = typeof censor === "function";
      const censorFctTakesPath = isCensorFct && censor.length > 1;
      if (paths.length === 0)
        return serialize || noop;
      validate({ paths, serialize, censor });
      const { wildcards, wcLen, secret } = parse({ paths, censor });
      const compileRestore = restorer();
      const strict = "strict" in opts ? opts.strict : true;
      return redactor({ secret, wcLen, serialize, strict, isCensorFct, censorFctTakesPath }, state({
        secret,
        censor,
        compileRestore,
        serialize,
        groupRedact,
        nestedRedact,
        wildcards,
        wcLen
      }));
    }
  }
});

// node_modules/pino/lib/symbols.js
var require_symbols = __commonJS({
  "node_modules/pino/lib/symbols.js"(exports2, module2) {
    "use strict";
    var setLevelSym = Symbol("pino.setLevel");
    var getLevelSym = Symbol("pino.getLevel");
    var levelValSym = Symbol("pino.levelVal");
    var levelCompSym = Symbol("pino.levelComp");
    var useLevelLabelsSym = Symbol("pino.useLevelLabels");
    var useOnlyCustomLevelsSym = Symbol("pino.useOnlyCustomLevels");
    var mixinSym = Symbol("pino.mixin");
    var lsCacheSym = Symbol("pino.lsCache");
    var chindingsSym = Symbol("pino.chindings");
    var asJsonSym = Symbol("pino.asJson");
    var writeSym = Symbol("pino.write");
    var redactFmtSym = Symbol("pino.redactFmt");
    var timeSym = Symbol("pino.time");
    var timeSliceIndexSym = Symbol("pino.timeSliceIndex");
    var streamSym = Symbol("pino.stream");
    var stringifySym = Symbol("pino.stringify");
    var stringifySafeSym = Symbol("pino.stringifySafe");
    var stringifiersSym = Symbol("pino.stringifiers");
    var endSym = Symbol("pino.end");
    var formatOptsSym = Symbol("pino.formatOpts");
    var messageKeySym = Symbol("pino.messageKey");
    var errorKeySym = Symbol("pino.errorKey");
    var nestedKeySym = Symbol("pino.nestedKey");
    var nestedKeyStrSym = Symbol("pino.nestedKeyStr");
    var mixinMergeStrategySym = Symbol("pino.mixinMergeStrategy");
    var msgPrefixSym = Symbol("pino.msgPrefix");
    var wildcardFirstSym = Symbol("pino.wildcardFirst");
    var serializersSym = Symbol.for("pino.serializers");
    var formattersSym = Symbol.for("pino.formatters");
    var hooksSym = Symbol.for("pino.hooks");
    var needsMetadataGsym = Symbol.for("pino.metadata");
    module2.exports = {
      setLevelSym,
      getLevelSym,
      levelValSym,
      levelCompSym,
      useLevelLabelsSym,
      mixinSym,
      lsCacheSym,
      chindingsSym,
      asJsonSym,
      writeSym,
      serializersSym,
      redactFmtSym,
      timeSym,
      timeSliceIndexSym,
      streamSym,
      stringifySym,
      stringifySafeSym,
      stringifiersSym,
      endSym,
      formatOptsSym,
      messageKeySym,
      errorKeySym,
      nestedKeySym,
      wildcardFirstSym,
      needsMetadataGsym,
      useOnlyCustomLevelsSym,
      formattersSym,
      hooksSym,
      nestedKeyStrSym,
      mixinMergeStrategySym,
      msgPrefixSym
    };
  }
});

// node_modules/pino/lib/redaction.js
var require_redaction = __commonJS({
  "node_modules/pino/lib/redaction.js"(exports2, module2) {
    "use strict";
    var fastRedact = require_fast_redact();
    var { redactFmtSym, wildcardFirstSym } = require_symbols();
    var { rx, validator } = fastRedact;
    var validate = validator({
      ERR_PATHS_MUST_BE_STRINGS: () => "pino \u2013 redacted paths must be strings",
      ERR_INVALID_PATH: (s) => `pino \u2013 redact paths array contains an invalid path (${s})`
    });
    var CENSOR = "[Redacted]";
    var strict = false;
    function redaction(opts, serialize) {
      const { paths, censor } = handle(opts);
      const shape = paths.reduce((o, str) => {
        rx.lastIndex = 0;
        const first = rx.exec(str);
        const next = rx.exec(str);
        let ns = first[1] !== void 0 ? first[1].replace(/^(?:"|'|`)(.*)(?:"|'|`)$/, "$1") : first[0];
        if (ns === "*") {
          ns = wildcardFirstSym;
        }
        if (next === null) {
          o[ns] = null;
          return o;
        }
        if (o[ns] === null) {
          return o;
        }
        const { index } = next;
        const nextPath = `${str.substr(index, str.length - 1)}`;
        o[ns] = o[ns] || [];
        if (ns !== wildcardFirstSym && o[ns].length === 0) {
          o[ns].push(...o[wildcardFirstSym] || []);
        }
        if (ns === wildcardFirstSym) {
          Object.keys(o).forEach(function(k) {
            if (o[k]) {
              o[k].push(nextPath);
            }
          });
        }
        o[ns].push(nextPath);
        return o;
      }, {});
      const result = {
        [redactFmtSym]: fastRedact({ paths, censor, serialize, strict })
      };
      const topCensor = (...args) => {
        return typeof censor === "function" ? serialize(censor(...args)) : serialize(censor);
      };
      return [...Object.keys(shape), ...Object.getOwnPropertySymbols(shape)].reduce((o, k) => {
        if (shape[k] === null) {
          o[k] = (value) => topCensor(value, [k]);
        } else {
          const wrappedCensor = typeof censor === "function" ? (value, path) => {
            return censor(value, [k, ...path]);
          } : censor;
          o[k] = fastRedact({
            paths: shape[k],
            censor: wrappedCensor,
            serialize,
            strict
          });
        }
        return o;
      }, result);
    }
    function handle(opts) {
      if (Array.isArray(opts)) {
        opts = { paths: opts, censor: CENSOR };
        validate(opts);
        return opts;
      }
      let { paths, censor = CENSOR, remove } = opts;
      if (Array.isArray(paths) === false) {
        throw Error("pino \u2013 redact must contain an array of strings");
      }
      if (remove === true)
        censor = void 0;
      validate({ paths, censor });
      return { paths, censor };
    }
    module2.exports = redaction;
  }
});

// node_modules/pino/lib/time.js
var require_time = __commonJS({
  "node_modules/pino/lib/time.js"(exports2, module2) {
    "use strict";
    var nullTime = () => "";
    var epochTime = () => `,"time":${Date.now()}`;
    var unixTime = () => `,"time":${Math.round(Date.now() / 1e3)}`;
    var isoTime = () => `,"time":"${new Date(Date.now()).toISOString()}"`;
    module2.exports = { nullTime, epochTime, unixTime, isoTime };
  }
});

// node_modules/quick-format-unescaped/index.js
var require_quick_format_unescaped = __commonJS({
  "node_modules/quick-format-unescaped/index.js"(exports2, module2) {
    "use strict";
    function tryStringify(o) {
      try {
        return JSON.stringify(o);
      } catch (e) {
        return '"[Circular]"';
      }
    }
    module2.exports = format;
    function format(f, args, opts) {
      var ss = opts && opts.stringify || tryStringify;
      var offset = 1;
      if (typeof f === "object" && f !== null) {
        var len = args.length + offset;
        if (len === 1)
          return f;
        var objects = new Array(len);
        objects[0] = ss(f);
        for (var index = 1; index < len; index++) {
          objects[index] = ss(args[index]);
        }
        return objects.join(" ");
      }
      if (typeof f !== "string") {
        return f;
      }
      var argLen = args.length;
      if (argLen === 0)
        return f;
      var str = "";
      var a = 1 - offset;
      var lastPos = -1;
      var flen = f && f.length || 0;
      for (var i = 0; i < flen; ) {
        if (f.charCodeAt(i) === 37 && i + 1 < flen) {
          lastPos = lastPos > -1 ? lastPos : 0;
          switch (f.charCodeAt(i + 1)) {
            case 100:
            case 102:
              if (a >= argLen)
                break;
              if (args[a] == null)
                break;
              if (lastPos < i)
                str += f.slice(lastPos, i);
              str += Number(args[a]);
              lastPos = i + 2;
              i++;
              break;
            case 105:
              if (a >= argLen)
                break;
              if (args[a] == null)
                break;
              if (lastPos < i)
                str += f.slice(lastPos, i);
              str += Math.floor(Number(args[a]));
              lastPos = i + 2;
              i++;
              break;
            case 79:
            case 111:
            case 106:
              if (a >= argLen)
                break;
              if (args[a] === void 0)
                break;
              if (lastPos < i)
                str += f.slice(lastPos, i);
              var type = typeof args[a];
              if (type === "string") {
                str += "'" + args[a] + "'";
                lastPos = i + 2;
                i++;
                break;
              }
              if (type === "function") {
                str += args[a].name || "<anonymous>";
                lastPos = i + 2;
                i++;
                break;
              }
              str += ss(args[a]);
              lastPos = i + 2;
              i++;
              break;
            case 115:
              if (a >= argLen)
                break;
              if (lastPos < i)
                str += f.slice(lastPos, i);
              str += String(args[a]);
              lastPos = i + 2;
              i++;
              break;
            case 37:
              if (lastPos < i)
                str += f.slice(lastPos, i);
              str += "%";
              lastPos = i + 2;
              i++;
              a--;
              break;
          }
          ++a;
        }
        ++i;
      }
      if (lastPos === -1)
        return f;
      else if (lastPos < flen) {
        str += f.slice(lastPos);
      }
      return str;
    }
  }
});

// node_modules/atomic-sleep/index.js
var require_atomic_sleep = __commonJS({
  "node_modules/atomic-sleep/index.js"(exports2, module2) {
    "use strict";
    if (typeof SharedArrayBuffer !== "undefined" && typeof Atomics !== "undefined") {
      let sleep = function(ms) {
        const valid = ms > 0 && ms < Infinity;
        if (valid === false) {
          if (typeof ms !== "number" && typeof ms !== "bigint") {
            throw TypeError("sleep: ms must be a number");
          }
          throw RangeError("sleep: ms must be a number that is greater than 0 but less than Infinity");
        }
        Atomics.wait(nil, 0, 0, Number(ms));
      };
      const nil = new Int32Array(new SharedArrayBuffer(4));
      module2.exports = sleep;
    } else {
      let sleep = function(ms) {
        const valid = ms > 0 && ms < Infinity;
        if (valid === false) {
          if (typeof ms !== "number" && typeof ms !== "bigint") {
            throw TypeError("sleep: ms must be a number");
          }
          throw RangeError("sleep: ms must be a number that is greater than 0 but less than Infinity");
        }
        const target = Date.now() + Number(ms);
        while (target > Date.now()) {
        }
      };
      module2.exports = sleep;
    }
  }
});

// node_modules/sonic-boom/index.js
var require_sonic_boom = __commonJS({
  "node_modules/sonic-boom/index.js"(exports2, module2) {
    "use strict";
    var fs = require("fs");
    var EventEmitter2 = require("events");
    var inherits = require("util").inherits;
    var path = require("path");
    var sleep = require_atomic_sleep();
    var BUSY_WRITE_TIMEOUT = 100;
    var kEmptyBuffer = Buffer.allocUnsafe(0);
    var MAX_WRITE = 16 * 1024;
    var kContentModeBuffer = "buffer";
    var kContentModeUtf8 = "utf8";
    function openFile(file, sonic) {
      sonic._opening = true;
      sonic._writing = true;
      sonic._asyncDrainScheduled = false;
      function fileOpened(err, fd) {
        if (err) {
          sonic._reopening = false;
          sonic._writing = false;
          sonic._opening = false;
          if (sonic.sync) {
            process.nextTick(() => {
              if (sonic.listenerCount("error") > 0) {
                sonic.emit("error", err);
              }
            });
          } else {
            sonic.emit("error", err);
          }
          return;
        }
        const reopening = sonic._reopening;
        sonic.fd = fd;
        sonic.file = file;
        sonic._reopening = false;
        sonic._opening = false;
        sonic._writing = false;
        if (sonic.sync) {
          process.nextTick(() => sonic.emit("ready"));
        } else {
          sonic.emit("ready");
        }
        if (sonic.destroyed) {
          return;
        }
        if (!sonic._writing && sonic._len > sonic.minLength || sonic._flushPending) {
          sonic._actualWrite();
        } else if (reopening) {
          process.nextTick(() => sonic.emit("drain"));
        }
      }
      const flags = sonic.append ? "a" : "w";
      const mode = sonic.mode;
      if (sonic.sync) {
        try {
          if (sonic.mkdir)
            fs.mkdirSync(path.dirname(file), { recursive: true });
          const fd = fs.openSync(file, flags, mode);
          fileOpened(null, fd);
        } catch (err) {
          fileOpened(err);
          throw err;
        }
      } else if (sonic.mkdir) {
        fs.mkdir(path.dirname(file), { recursive: true }, (err) => {
          if (err)
            return fileOpened(err);
          fs.open(file, flags, mode, fileOpened);
        });
      } else {
        fs.open(file, flags, mode, fileOpened);
      }
    }
    function SonicBoom(opts) {
      if (!(this instanceof SonicBoom)) {
        return new SonicBoom(opts);
      }
      let { fd, dest, minLength, maxLength, maxWrite, sync, append = true, mkdir: mkdir3, retryEAGAIN, fsync, contentMode, mode } = opts || {};
      fd = fd || dest;
      this._len = 0;
      this.fd = -1;
      this._bufs = [];
      this._lens = [];
      this._writing = false;
      this._ending = false;
      this._reopening = false;
      this._asyncDrainScheduled = false;
      this._flushPending = false;
      this._hwm = Math.max(minLength || 0, 16387);
      this.file = null;
      this.destroyed = false;
      this.minLength = minLength || 0;
      this.maxLength = maxLength || 0;
      this.maxWrite = maxWrite || MAX_WRITE;
      this.sync = sync || false;
      this.writable = true;
      this._fsync = fsync || false;
      this.append = append || false;
      this.mode = mode;
      this.retryEAGAIN = retryEAGAIN || (() => true);
      this.mkdir = mkdir3 || false;
      let fsWriteSync;
      let fsWrite;
      if (contentMode === kContentModeBuffer) {
        this._writingBuf = kEmptyBuffer;
        this.write = writeBuffer;
        this.flush = flushBuffer;
        this.flushSync = flushBufferSync;
        this._actualWrite = actualWriteBuffer;
        fsWriteSync = () => fs.writeSync(this.fd, this._writingBuf);
        fsWrite = () => fs.write(this.fd, this._writingBuf, this.release);
      } else if (contentMode === void 0 || contentMode === kContentModeUtf8) {
        this._writingBuf = "";
        this.write = write;
        this.flush = flush;
        this.flushSync = flushSync;
        this._actualWrite = actualWrite;
        fsWriteSync = () => fs.writeSync(this.fd, this._writingBuf, "utf8");
        fsWrite = () => fs.write(this.fd, this._writingBuf, "utf8", this.release);
      } else {
        throw new Error(`SonicBoom supports "${kContentModeUtf8}" and "${kContentModeBuffer}", but passed ${contentMode}`);
      }
      if (typeof fd === "number") {
        this.fd = fd;
        process.nextTick(() => this.emit("ready"));
      } else if (typeof fd === "string") {
        openFile(fd, this);
      } else {
        throw new Error("SonicBoom supports only file descriptors and files");
      }
      if (this.minLength >= this.maxWrite) {
        throw new Error(`minLength should be smaller than maxWrite (${this.maxWrite})`);
      }
      this.release = (err, n) => {
        if (err) {
          if ((err.code === "EAGAIN" || err.code === "EBUSY") && this.retryEAGAIN(err, this._writingBuf.length, this._len - this._writingBuf.length)) {
            if (this.sync) {
              try {
                sleep(BUSY_WRITE_TIMEOUT);
                this.release(void 0, 0);
              } catch (err2) {
                this.release(err2);
              }
            } else {
              setTimeout(fsWrite, BUSY_WRITE_TIMEOUT);
            }
          } else {
            this._writing = false;
            this.emit("error", err);
          }
          return;
        }
        this.emit("write", n);
        const releasedBufObj = releaseWritingBuf(this._writingBuf, this._len, n);
        this._len = releasedBufObj.len;
        this._writingBuf = releasedBufObj.writingBuf;
        if (this._writingBuf.length) {
          if (!this.sync) {
            fsWrite();
            return;
          }
          try {
            do {
              const n2 = fsWriteSync();
              const releasedBufObj2 = releaseWritingBuf(this._writingBuf, this._len, n2);
              this._len = releasedBufObj2.len;
              this._writingBuf = releasedBufObj2.writingBuf;
            } while (this._writingBuf.length);
          } catch (err2) {
            this.release(err2);
            return;
          }
        }
        if (this._fsync) {
          fs.fsyncSync(this.fd);
        }
        const len = this._len;
        if (this._reopening) {
          this._writing = false;
          this._reopening = false;
          this.reopen();
        } else if (len > this.minLength) {
          this._actualWrite();
        } else if (this._ending) {
          if (len > 0) {
            this._actualWrite();
          } else {
            this._writing = false;
            actualClose(this);
          }
        } else {
          this._writing = false;
          if (this.sync) {
            if (!this._asyncDrainScheduled) {
              this._asyncDrainScheduled = true;
              process.nextTick(emitDrain, this);
            }
          } else {
            this.emit("drain");
          }
        }
      };
      this.on("newListener", function(name) {
        if (name === "drain") {
          this._asyncDrainScheduled = false;
        }
      });
    }
    function releaseWritingBuf(writingBuf, len, n) {
      if (typeof writingBuf === "string" && Buffer.byteLength(writingBuf) !== n) {
        n = Buffer.from(writingBuf).subarray(0, n).toString().length;
      }
      len = Math.max(len - n, 0);
      writingBuf = writingBuf.slice(n);
      return { writingBuf, len };
    }
    function emitDrain(sonic) {
      const hasListeners = sonic.listenerCount("drain") > 0;
      if (!hasListeners)
        return;
      sonic._asyncDrainScheduled = false;
      sonic.emit("drain");
    }
    inherits(SonicBoom, EventEmitter2);
    function mergeBuf(bufs, len) {
      if (bufs.length === 0) {
        return kEmptyBuffer;
      }
      if (bufs.length === 1) {
        return bufs[0];
      }
      return Buffer.concat(bufs, len);
    }
    function write(data) {
      if (this.destroyed) {
        throw new Error("SonicBoom destroyed");
      }
      const len = this._len + data.length;
      const bufs = this._bufs;
      if (this.maxLength && len > this.maxLength) {
        this.emit("drop", data);
        return this._len < this._hwm;
      }
      if (bufs.length === 0 || bufs[bufs.length - 1].length + data.length > this.maxWrite) {
        bufs.push("" + data);
      } else {
        bufs[bufs.length - 1] += data;
      }
      this._len = len;
      if (!this._writing && this._len >= this.minLength) {
        this._actualWrite();
      }
      return this._len < this._hwm;
    }
    function writeBuffer(data) {
      if (this.destroyed) {
        throw new Error("SonicBoom destroyed");
      }
      const len = this._len + data.length;
      const bufs = this._bufs;
      const lens = this._lens;
      if (this.maxLength && len > this.maxLength) {
        this.emit("drop", data);
        return this._len < this._hwm;
      }
      if (bufs.length === 0 || lens[lens.length - 1] + data.length > this.maxWrite) {
        bufs.push([data]);
        lens.push(data.length);
      } else {
        bufs[bufs.length - 1].push(data);
        lens[lens.length - 1] += data.length;
      }
      this._len = len;
      if (!this._writing && this._len >= this.minLength) {
        this._actualWrite();
      }
      return this._len < this._hwm;
    }
    function callFlushCallbackOnDrain(cb) {
      this._flushPending = true;
      const onDrain = () => {
        if (!this._fsync) {
          fs.fsync(this.fd, (err) => {
            this._flushPending = false;
            cb(err);
          });
        } else {
          this._flushPending = false;
          cb();
        }
        this.off("error", onError);
      };
      const onError = (err) => {
        this._flushPending = false;
        cb(err);
        this.off("drain", onDrain);
      };
      this.once("drain", onDrain);
      this.once("error", onError);
    }
    function flush(cb) {
      if (cb != null && typeof cb !== "function") {
        throw new Error("flush cb must be a function");
      }
      if (this.destroyed) {
        const error = new Error("SonicBoom destroyed");
        if (cb) {
          cb(error);
          return;
        }
        throw error;
      }
      if (this.minLength <= 0) {
        cb?.();
        return;
      }
      if (cb) {
        callFlushCallbackOnDrain.call(this, cb);
      }
      if (this._writing) {
        return;
      }
      if (this._bufs.length === 0) {
        this._bufs.push("");
      }
      this._actualWrite();
    }
    function flushBuffer(cb) {
      if (cb != null && typeof cb !== "function") {
        throw new Error("flush cb must be a function");
      }
      if (this.destroyed) {
        const error = new Error("SonicBoom destroyed");
        if (cb) {
          cb(error);
          return;
        }
        throw error;
      }
      if (this.minLength <= 0) {
        cb?.();
        return;
      }
      if (cb) {
        callFlushCallbackOnDrain.call(this, cb);
      }
      if (this._writing) {
        return;
      }
      if (this._bufs.length === 0) {
        this._bufs.push([]);
        this._lens.push(0);
      }
      this._actualWrite();
    }
    SonicBoom.prototype.reopen = function(file) {
      if (this.destroyed) {
        throw new Error("SonicBoom destroyed");
      }
      if (this._opening) {
        this.once("ready", () => {
          this.reopen(file);
        });
        return;
      }
      if (this._ending) {
        return;
      }
      if (!this.file) {
        throw new Error("Unable to reopen a file descriptor, you must pass a file to SonicBoom");
      }
      if (file) {
        this.file = file;
      }
      this._reopening = true;
      if (this._writing) {
        return;
      }
      const fd = this.fd;
      this.once("ready", () => {
        if (fd !== this.fd) {
          fs.close(fd, (err) => {
            if (err) {
              return this.emit("error", err);
            }
          });
        }
      });
      openFile(this.file, this);
    };
    SonicBoom.prototype.end = function() {
      if (this.destroyed) {
        throw new Error("SonicBoom destroyed");
      }
      if (this._opening) {
        this.once("ready", () => {
          this.end();
        });
        return;
      }
      if (this._ending) {
        return;
      }
      this._ending = true;
      if (this._writing) {
        return;
      }
      if (this._len > 0 && this.fd >= 0) {
        this._actualWrite();
      } else {
        actualClose(this);
      }
    };
    function flushSync() {
      if (this.destroyed) {
        throw new Error("SonicBoom destroyed");
      }
      if (this.fd < 0) {
        throw new Error("sonic boom is not ready yet");
      }
      if (!this._writing && this._writingBuf.length > 0) {
        this._bufs.unshift(this._writingBuf);
        this._writingBuf = "";
      }
      let buf = "";
      while (this._bufs.length || buf) {
        if (buf.length <= 0) {
          buf = this._bufs[0];
        }
        try {
          const n = fs.writeSync(this.fd, buf, "utf8");
          const releasedBufObj = releaseWritingBuf(buf, this._len, n);
          buf = releasedBufObj.writingBuf;
          this._len = releasedBufObj.len;
          if (buf.length <= 0) {
            this._bufs.shift();
          }
        } catch (err) {
          const shouldRetry = err.code === "EAGAIN" || err.code === "EBUSY";
          if (shouldRetry && !this.retryEAGAIN(err, buf.length, this._len - buf.length)) {
            throw err;
          }
          sleep(BUSY_WRITE_TIMEOUT);
        }
      }
      try {
        fs.fsyncSync(this.fd);
      } catch {
      }
    }
    function flushBufferSync() {
      if (this.destroyed) {
        throw new Error("SonicBoom destroyed");
      }
      if (this.fd < 0) {
        throw new Error("sonic boom is not ready yet");
      }
      if (!this._writing && this._writingBuf.length > 0) {
        this._bufs.unshift([this._writingBuf]);
        this._writingBuf = kEmptyBuffer;
      }
      let buf = kEmptyBuffer;
      while (this._bufs.length || buf.length) {
        if (buf.length <= 0) {
          buf = mergeBuf(this._bufs[0], this._lens[0]);
        }
        try {
          const n = fs.writeSync(this.fd, buf);
          buf = buf.subarray(n);
          this._len = Math.max(this._len - n, 0);
          if (buf.length <= 0) {
            this._bufs.shift();
            this._lens.shift();
          }
        } catch (err) {
          const shouldRetry = err.code === "EAGAIN" || err.code === "EBUSY";
          if (shouldRetry && !this.retryEAGAIN(err, buf.length, this._len - buf.length)) {
            throw err;
          }
          sleep(BUSY_WRITE_TIMEOUT);
        }
      }
    }
    SonicBoom.prototype.destroy = function() {
      if (this.destroyed) {
        return;
      }
      actualClose(this);
    };
    function actualWrite() {
      const release = this.release;
      this._writing = true;
      this._writingBuf = this._writingBuf || this._bufs.shift() || "";
      if (this.sync) {
        try {
          const written = fs.writeSync(this.fd, this._writingBuf, "utf8");
          release(null, written);
        } catch (err) {
          release(err);
        }
      } else {
        fs.write(this.fd, this._writingBuf, "utf8", release);
      }
    }
    function actualWriteBuffer() {
      const release = this.release;
      this._writing = true;
      this._writingBuf = this._writingBuf.length ? this._writingBuf : mergeBuf(this._bufs.shift(), this._lens.shift());
      if (this.sync) {
        try {
          const written = fs.writeSync(this.fd, this._writingBuf);
          release(null, written);
        } catch (err) {
          release(err);
        }
      } else {
        fs.write(this.fd, this._writingBuf, release);
      }
    }
    function actualClose(sonic) {
      if (sonic.fd === -1) {
        sonic.once("ready", actualClose.bind(null, sonic));
        return;
      }
      sonic.destroyed = true;
      sonic._bufs = [];
      sonic._lens = [];
      fs.fsync(sonic.fd, closeWrapped);
      function closeWrapped() {
        if (sonic.fd !== 1 && sonic.fd !== 2) {
          fs.close(sonic.fd, done);
        } else {
          done();
        }
      }
      function done(err) {
        if (err) {
          sonic.emit("error", err);
          return;
        }
        if (sonic._ending && !sonic._writing) {
          sonic.emit("finish");
        }
        sonic.emit("close");
      }
    }
    SonicBoom.SonicBoom = SonicBoom;
    SonicBoom.default = SonicBoom;
    module2.exports = SonicBoom;
  }
});

// node_modules/on-exit-leak-free/index.js
var require_on_exit_leak_free = __commonJS({
  "node_modules/on-exit-leak-free/index.js"(exports2, module2) {
    "use strict";
    var refs = {
      exit: [],
      beforeExit: []
    };
    var functions = {
      exit: onExit,
      beforeExit: onBeforeExit
    };
    var registry;
    function ensureRegistry() {
      if (registry === void 0) {
        registry = new FinalizationRegistry(clear);
      }
    }
    function install(event) {
      if (refs[event].length > 0) {
        return;
      }
      process.on(event, functions[event]);
    }
    function uninstall(event) {
      if (refs[event].length > 0) {
        return;
      }
      process.removeListener(event, functions[event]);
      if (refs.exit.length === 0 && refs.beforeExit.length === 0) {
        registry = void 0;
      }
    }
    function onExit() {
      callRefs("exit");
    }
    function onBeforeExit() {
      callRefs("beforeExit");
    }
    function callRefs(event) {
      for (const ref of refs[event]) {
        const obj = ref.deref();
        const fn = ref.fn;
        if (obj !== void 0) {
          fn(obj, event);
        }
      }
      refs[event] = [];
    }
    function clear(ref) {
      for (const event of ["exit", "beforeExit"]) {
        const index = refs[event].indexOf(ref);
        refs[event].splice(index, index + 1);
        uninstall(event);
      }
    }
    function _register(event, obj, fn) {
      if (obj === void 0) {
        throw new Error("the object can't be undefined");
      }
      install(event);
      const ref = new WeakRef(obj);
      ref.fn = fn;
      ensureRegistry();
      registry.register(obj, ref);
      refs[event].push(ref);
    }
    function register(obj, fn) {
      _register("exit", obj, fn);
    }
    function registerBeforeExit(obj, fn) {
      _register("beforeExit", obj, fn);
    }
    function unregister(obj) {
      if (registry === void 0) {
        return;
      }
      registry.unregister(obj);
      for (const event of ["exit", "beforeExit"]) {
        refs[event] = refs[event].filter((ref) => {
          const _obj = ref.deref();
          return _obj && _obj !== obj;
        });
        uninstall(event);
      }
    }
    module2.exports = {
      register,
      registerBeforeExit,
      unregister
    };
  }
});

// node_modules/thread-stream/package.json
var require_package = __commonJS({
  "node_modules/thread-stream/package.json"(exports2, module2) {
    module2.exports = {
      name: "thread-stream",
      version: "2.7.0",
      description: "A streaming way to send data to a Node.js Worker Thread",
      main: "index.js",
      types: "index.d.ts",
      dependencies: {
        "real-require": "^0.2.0"
      },
      devDependencies: {
        "@types/node": "^20.1.0",
        "@types/tap": "^15.0.0",
        "@yao-pkg/pkg": "^5.11.5",
        desm: "^1.3.0",
        fastbench: "^1.0.1",
        husky: "^9.0.6",
        "pino-elasticsearch": "^8.0.0",
        "sonic-boom": "^3.0.0",
        standard: "^17.0.0",
        tap: "^16.2.0",
        "ts-node": "^10.8.0",
        typescript: "^5.3.2",
        "why-is-node-running": "^2.2.2"
      },
      scripts: {
        test: 'standard && npm run transpile && tap "test/**/*.test.*js" && tap --ts test/*.test.*ts',
        "test:ci": "standard && npm run transpile && npm run test:ci:js && npm run test:ci:ts",
        "test:ci:js": 'tap --no-check-coverage --timeout=120 --coverage-report=lcovonly "test/**/*.test.*js"',
        "test:ci:ts": 'tap --ts --no-check-coverage --coverage-report=lcovonly "test/**/*.test.*ts"',
        "test:yarn": 'npm run transpile && tap "test/**/*.test.js" --no-check-coverage',
        transpile: "sh ./test/ts/transpile.sh",
        prepare: "husky install"
      },
      standard: {
        ignore: [
          "test/ts/**/*"
        ]
      },
      repository: {
        type: "git",
        url: "git+https://github.com/mcollina/thread-stream.git"
      },
      keywords: [
        "worker",
        "thread",
        "threads",
        "stream"
      ],
      author: "Matteo Collina <hello@matteocollina.com>",
      license: "MIT",
      bugs: {
        url: "https://github.com/mcollina/thread-stream/issues"
      },
      homepage: "https://github.com/mcollina/thread-stream#readme"
    };
  }
});

// node_modules/thread-stream/lib/wait.js
var require_wait = __commonJS({
  "node_modules/thread-stream/lib/wait.js"(exports2, module2) {
    "use strict";
    var MAX_TIMEOUT = 1e3;
    function wait(state, index, expected, timeout, done) {
      const max = Date.now() + timeout;
      let current = Atomics.load(state, index);
      if (current === expected) {
        done(null, "ok");
        return;
      }
      let prior = current;
      const check = (backoff) => {
        if (Date.now() > max) {
          done(null, "timed-out");
        } else {
          setTimeout(() => {
            prior = current;
            current = Atomics.load(state, index);
            if (current === prior) {
              check(backoff >= MAX_TIMEOUT ? MAX_TIMEOUT : backoff * 2);
            } else {
              if (current === expected)
                done(null, "ok");
              else
                done(null, "not-equal");
            }
          }, backoff);
        }
      };
      check(1);
    }
    function waitDiff(state, index, expected, timeout, done) {
      const max = Date.now() + timeout;
      let current = Atomics.load(state, index);
      if (current !== expected) {
        done(null, "ok");
        return;
      }
      const check = (backoff) => {
        if (Date.now() > max) {
          done(null, "timed-out");
        } else {
          setTimeout(() => {
            current = Atomics.load(state, index);
            if (current !== expected) {
              done(null, "ok");
            } else {
              check(backoff >= MAX_TIMEOUT ? MAX_TIMEOUT : backoff * 2);
            }
          }, backoff);
        }
      };
      check(1);
    }
    module2.exports = { wait, waitDiff };
  }
});

// node_modules/thread-stream/lib/indexes.js
var require_indexes = __commonJS({
  "node_modules/thread-stream/lib/indexes.js"(exports2, module2) {
    "use strict";
    var WRITE_INDEX = 4;
    var READ_INDEX = 8;
    module2.exports = {
      WRITE_INDEX,
      READ_INDEX
    };
  }
});

// node_modules/thread-stream/index.js
var require_thread_stream = __commonJS({
  "node_modules/thread-stream/index.js"(exports2, module2) {
    "use strict";
    var { version } = require_package();
    var { EventEmitter: EventEmitter2 } = require("events");
    var { Worker } = require("worker_threads");
    var { join: join2 } = require("path");
    var { pathToFileURL } = require("url");
    var { wait } = require_wait();
    var {
      WRITE_INDEX,
      READ_INDEX
    } = require_indexes();
    var buffer = require("buffer");
    var assert = require("assert");
    var kImpl = Symbol("kImpl");
    var MAX_STRING = buffer.constants.MAX_STRING_LENGTH;
    var FakeWeakRef = class {
      constructor(value) {
        this._value = value;
      }
      deref() {
        return this._value;
      }
    };
    var FakeFinalizationRegistry = class {
      register() {
      }
      unregister() {
      }
    };
    var FinalizationRegistry2 = process.env.NODE_V8_COVERAGE ? FakeFinalizationRegistry : global.FinalizationRegistry || FakeFinalizationRegistry;
    var WeakRef2 = process.env.NODE_V8_COVERAGE ? FakeWeakRef : global.WeakRef || FakeWeakRef;
    var registry = new FinalizationRegistry2((worker) => {
      if (worker.exited) {
        return;
      }
      worker.terminate();
    });
    function createWorker(stream, opts) {
      const { filename, workerData } = opts;
      const bundlerOverrides = "__bundlerPathsOverrides" in globalThis ? globalThis.__bundlerPathsOverrides : {};
      const toExecute = bundlerOverrides["thread-stream-worker"] || join2(__dirname, "lib", "worker.js");
      const worker = new Worker(toExecute, {
        ...opts.workerOpts,
        trackUnmanagedFds: false,
        workerData: {
          filename: filename.indexOf("file://") === 0 ? filename : pathToFileURL(filename).href,
          dataBuf: stream[kImpl].dataBuf,
          stateBuf: stream[kImpl].stateBuf,
          workerData: {
            $context: {
              threadStreamVersion: version
            },
            ...workerData
          }
        }
      });
      worker.stream = new FakeWeakRef(stream);
      worker.on("message", onWorkerMessage);
      worker.on("exit", onWorkerExit);
      registry.register(stream, worker);
      return worker;
    }
    function drain(stream) {
      assert(!stream[kImpl].sync);
      if (stream[kImpl].needDrain) {
        stream[kImpl].needDrain = false;
        stream.emit("drain");
      }
    }
    function nextFlush(stream) {
      const writeIndex = Atomics.load(stream[kImpl].state, WRITE_INDEX);
      let leftover = stream[kImpl].data.length - writeIndex;
      if (leftover > 0) {
        if (stream[kImpl].buf.length === 0) {
          stream[kImpl].flushing = false;
          if (stream[kImpl].ending) {
            end(stream);
          } else if (stream[kImpl].needDrain) {
            process.nextTick(drain, stream);
          }
          return;
        }
        let toWrite = stream[kImpl].buf.slice(0, leftover);
        let toWriteBytes = Buffer.byteLength(toWrite);
        if (toWriteBytes <= leftover) {
          stream[kImpl].buf = stream[kImpl].buf.slice(leftover);
          write(stream, toWrite, nextFlush.bind(null, stream));
        } else {
          stream.flush(() => {
            if (stream.destroyed) {
              return;
            }
            Atomics.store(stream[kImpl].state, READ_INDEX, 0);
            Atomics.store(stream[kImpl].state, WRITE_INDEX, 0);
            while (toWriteBytes > stream[kImpl].data.length) {
              leftover = leftover / 2;
              toWrite = stream[kImpl].buf.slice(0, leftover);
              toWriteBytes = Buffer.byteLength(toWrite);
            }
            stream[kImpl].buf = stream[kImpl].buf.slice(leftover);
            write(stream, toWrite, nextFlush.bind(null, stream));
          });
        }
      } else if (leftover === 0) {
        if (writeIndex === 0 && stream[kImpl].buf.length === 0) {
          return;
        }
        stream.flush(() => {
          Atomics.store(stream[kImpl].state, READ_INDEX, 0);
          Atomics.store(stream[kImpl].state, WRITE_INDEX, 0);
          nextFlush(stream);
        });
      } else {
        destroy(stream, new Error("overwritten"));
      }
    }
    function onWorkerMessage(msg) {
      const stream = this.stream.deref();
      if (stream === void 0) {
        this.exited = true;
        this.terminate();
        return;
      }
      switch (msg.code) {
        case "READY":
          this.stream = new WeakRef2(stream);
          stream.flush(() => {
            stream[kImpl].ready = true;
            stream.emit("ready");
          });
          break;
        case "ERROR":
          destroy(stream, msg.err);
          break;
        case "EVENT":
          if (Array.isArray(msg.args)) {
            stream.emit(msg.name, ...msg.args);
          } else {
            stream.emit(msg.name, msg.args);
          }
          break;
        case "WARNING":
          process.emitWarning(msg.err);
          break;
        default:
          destroy(stream, new Error("this should not happen: " + msg.code));
      }
    }
    function onWorkerExit(code) {
      const stream = this.stream.deref();
      if (stream === void 0) {
        return;
      }
      registry.unregister(stream);
      stream.worker.exited = true;
      stream.worker.off("exit", onWorkerExit);
      destroy(stream, code !== 0 ? new Error("the worker thread exited") : null);
    }
    var ThreadStream = class extends EventEmitter2 {
      constructor(opts = {}) {
        super();
        if (opts.bufferSize < 4) {
          throw new Error("bufferSize must at least fit a 4-byte utf-8 char");
        }
        this[kImpl] = {};
        this[kImpl].stateBuf = new SharedArrayBuffer(128);
        this[kImpl].state = new Int32Array(this[kImpl].stateBuf);
        this[kImpl].dataBuf = new SharedArrayBuffer(opts.bufferSize || 4 * 1024 * 1024);
        this[kImpl].data = Buffer.from(this[kImpl].dataBuf);
        this[kImpl].sync = opts.sync || false;
        this[kImpl].ending = false;
        this[kImpl].ended = false;
        this[kImpl].needDrain = false;
        this[kImpl].destroyed = false;
        this[kImpl].flushing = false;
        this[kImpl].ready = false;
        this[kImpl].finished = false;
        this[kImpl].errored = null;
        this[kImpl].closed = false;
        this[kImpl].buf = "";
        this.worker = createWorker(this, opts);
        this.on("message", (message, transferList) => {
          this.worker.postMessage(message, transferList);
        });
      }
      write(data) {
        if (this[kImpl].destroyed) {
          error(this, new Error("the worker has exited"));
          return false;
        }
        if (this[kImpl].ending) {
          error(this, new Error("the worker is ending"));
          return false;
        }
        if (this[kImpl].flushing && this[kImpl].buf.length + data.length >= MAX_STRING) {
          try {
            writeSync(this);
            this[kImpl].flushing = true;
          } catch (err) {
            destroy(this, err);
            return false;
          }
        }
        this[kImpl].buf += data;
        if (this[kImpl].sync) {
          try {
            writeSync(this);
            return true;
          } catch (err) {
            destroy(this, err);
            return false;
          }
        }
        if (!this[kImpl].flushing) {
          this[kImpl].flushing = true;
          setImmediate(nextFlush, this);
        }
        this[kImpl].needDrain = this[kImpl].data.length - this[kImpl].buf.length - Atomics.load(this[kImpl].state, WRITE_INDEX) <= 0;
        return !this[kImpl].needDrain;
      }
      end() {
        if (this[kImpl].destroyed) {
          return;
        }
        this[kImpl].ending = true;
        end(this);
      }
      flush(cb) {
        if (this[kImpl].destroyed) {
          if (typeof cb === "function") {
            process.nextTick(cb, new Error("the worker has exited"));
          }
          return;
        }
        const writeIndex = Atomics.load(this[kImpl].state, WRITE_INDEX);
        wait(this[kImpl].state, READ_INDEX, writeIndex, Infinity, (err, res) => {
          if (err) {
            destroy(this, err);
            process.nextTick(cb, err);
            return;
          }
          if (res === "not-equal") {
            this.flush(cb);
            return;
          }
          process.nextTick(cb);
        });
      }
      flushSync() {
        if (this[kImpl].destroyed) {
          return;
        }
        writeSync(this);
        flushSync(this);
      }
      unref() {
        this.worker.unref();
      }
      ref() {
        this.worker.ref();
      }
      get ready() {
        return this[kImpl].ready;
      }
      get destroyed() {
        return this[kImpl].destroyed;
      }
      get closed() {
        return this[kImpl].closed;
      }
      get writable() {
        return !this[kImpl].destroyed && !this[kImpl].ending;
      }
      get writableEnded() {
        return this[kImpl].ending;
      }
      get writableFinished() {
        return this[kImpl].finished;
      }
      get writableNeedDrain() {
        return this[kImpl].needDrain;
      }
      get writableObjectMode() {
        return false;
      }
      get writableErrored() {
        return this[kImpl].errored;
      }
    };
    function error(stream, err) {
      setImmediate(() => {
        stream.emit("error", err);
      });
    }
    function destroy(stream, err) {
      if (stream[kImpl].destroyed) {
        return;
      }
      stream[kImpl].destroyed = true;
      if (err) {
        stream[kImpl].errored = err;
        error(stream, err);
      }
      if (!stream.worker.exited) {
        stream.worker.terminate().catch(() => {
        }).then(() => {
          stream[kImpl].closed = true;
          stream.emit("close");
        });
      } else {
        setImmediate(() => {
          stream[kImpl].closed = true;
          stream.emit("close");
        });
      }
    }
    function write(stream, data, cb) {
      const current = Atomics.load(stream[kImpl].state, WRITE_INDEX);
      const length = Buffer.byteLength(data);
      stream[kImpl].data.write(data, current);
      Atomics.store(stream[kImpl].state, WRITE_INDEX, current + length);
      Atomics.notify(stream[kImpl].state, WRITE_INDEX);
      cb();
      return true;
    }
    function end(stream) {
      if (stream[kImpl].ended || !stream[kImpl].ending || stream[kImpl].flushing) {
        return;
      }
      stream[kImpl].ended = true;
      try {
        stream.flushSync();
        let readIndex = Atomics.load(stream[kImpl].state, READ_INDEX);
        Atomics.store(stream[kImpl].state, WRITE_INDEX, -1);
        Atomics.notify(stream[kImpl].state, WRITE_INDEX);
        let spins = 0;
        while (readIndex !== -1) {
          Atomics.wait(stream[kImpl].state, READ_INDEX, readIndex, 1e3);
          readIndex = Atomics.load(stream[kImpl].state, READ_INDEX);
          if (readIndex === -2) {
            destroy(stream, new Error("end() failed"));
            return;
          }
          if (++spins === 10) {
            destroy(stream, new Error("end() took too long (10s)"));
            return;
          }
        }
        process.nextTick(() => {
          stream[kImpl].finished = true;
          stream.emit("finish");
        });
      } catch (err) {
        destroy(stream, err);
      }
    }
    function writeSync(stream) {
      const cb = () => {
        if (stream[kImpl].ending) {
          end(stream);
        } else if (stream[kImpl].needDrain) {
          process.nextTick(drain, stream);
        }
      };
      stream[kImpl].flushing = false;
      while (stream[kImpl].buf.length !== 0) {
        const writeIndex = Atomics.load(stream[kImpl].state, WRITE_INDEX);
        let leftover = stream[kImpl].data.length - writeIndex;
        if (leftover === 0) {
          flushSync(stream);
          Atomics.store(stream[kImpl].state, READ_INDEX, 0);
          Atomics.store(stream[kImpl].state, WRITE_INDEX, 0);
          continue;
        } else if (leftover < 0) {
          throw new Error("overwritten");
        }
        let toWrite = stream[kImpl].buf.slice(0, leftover);
        let toWriteBytes = Buffer.byteLength(toWrite);
        if (toWriteBytes <= leftover) {
          stream[kImpl].buf = stream[kImpl].buf.slice(leftover);
          write(stream, toWrite, cb);
        } else {
          flushSync(stream);
          Atomics.store(stream[kImpl].state, READ_INDEX, 0);
          Atomics.store(stream[kImpl].state, WRITE_INDEX, 0);
          while (toWriteBytes > stream[kImpl].buf.length) {
            leftover = leftover / 2;
            toWrite = stream[kImpl].buf.slice(0, leftover);
            toWriteBytes = Buffer.byteLength(toWrite);
          }
          stream[kImpl].buf = stream[kImpl].buf.slice(leftover);
          write(stream, toWrite, cb);
        }
      }
    }
    function flushSync(stream) {
      if (stream[kImpl].flushing) {
        throw new Error("unable to flush while flushing");
      }
      const writeIndex = Atomics.load(stream[kImpl].state, WRITE_INDEX);
      let spins = 0;
      while (true) {
        const readIndex = Atomics.load(stream[kImpl].state, READ_INDEX);
        if (readIndex === -2) {
          throw Error("_flushSync failed");
        }
        if (readIndex !== writeIndex) {
          Atomics.wait(stream[kImpl].state, READ_INDEX, readIndex, 1e3);
        } else {
          break;
        }
        if (++spins === 10) {
          throw new Error("_flushSync took too long (10s)");
        }
      }
    }
    module2.exports = ThreadStream;
  }
});

// node_modules/pino/lib/transport.js
var require_transport = __commonJS({
  "node_modules/pino/lib/transport.js"(exports2, module2) {
    "use strict";
    var { createRequire } = require("module");
    var getCallers = require_caller();
    var { join: join2, isAbsolute, sep } = require("path");
    var sleep = require_atomic_sleep();
    var onExit = require_on_exit_leak_free();
    var ThreadStream = require_thread_stream();
    function setupOnExit(stream) {
      onExit.register(stream, autoEnd);
      onExit.registerBeforeExit(stream, flush);
      stream.on("close", function() {
        onExit.unregister(stream);
      });
    }
    function buildStream(filename, workerData, workerOpts) {
      const stream = new ThreadStream({
        filename,
        workerData,
        workerOpts
      });
      stream.on("ready", onReady);
      stream.on("close", function() {
        process.removeListener("exit", onExit2);
      });
      process.on("exit", onExit2);
      function onReady() {
        process.removeListener("exit", onExit2);
        stream.unref();
        if (workerOpts.autoEnd !== false) {
          setupOnExit(stream);
        }
      }
      function onExit2() {
        if (stream.closed) {
          return;
        }
        stream.flushSync();
        sleep(100);
        stream.end();
      }
      return stream;
    }
    function autoEnd(stream) {
      stream.ref();
      stream.flushSync();
      stream.end();
      stream.once("close", function() {
        stream.unref();
      });
    }
    function flush(stream) {
      stream.flushSync();
    }
    function transport(fullOptions) {
      const { pipeline, targets, levels, dedupe, options = {}, worker = {}, caller = getCallers() } = fullOptions;
      const callers = typeof caller === "string" ? [caller] : caller;
      const bundlerOverrides = "__bundlerPathsOverrides" in globalThis ? globalThis.__bundlerPathsOverrides : {};
      let target = fullOptions.target;
      if (target && targets) {
        throw new Error("only one of target or targets can be specified");
      }
      if (targets) {
        target = bundlerOverrides["pino-worker"] || join2(__dirname, "worker.js");
        options.targets = targets.map((dest) => {
          return {
            ...dest,
            target: fixTarget(dest.target)
          };
        });
      } else if (pipeline) {
        target = bundlerOverrides["pino-pipeline-worker"] || join2(__dirname, "worker-pipeline.js");
        options.targets = pipeline.map((dest) => {
          return {
            ...dest,
            target: fixTarget(dest.target)
          };
        });
      }
      if (levels) {
        options.levels = levels;
      }
      if (dedupe) {
        options.dedupe = dedupe;
      }
      options.pinoWillSendConfig = true;
      return buildStream(fixTarget(target), options, worker);
      function fixTarget(origin) {
        origin = bundlerOverrides[origin] || origin;
        if (isAbsolute(origin) || origin.indexOf("file://") === 0) {
          return origin;
        }
        if (origin === "pino/file") {
          return join2(__dirname, "..", "file.js");
        }
        let fixTarget2;
        for (const filePath of callers) {
          try {
            const context = filePath === "node:repl" ? process.cwd() + sep : filePath;
            fixTarget2 = createRequire(context).resolve(origin);
            break;
          } catch (err) {
            continue;
          }
        }
        if (!fixTarget2) {
          throw new Error(`unable to determine transport target for "${origin}"`);
        }
        return fixTarget2;
      }
    }
    module2.exports = transport;
  }
});

// node_modules/pino/lib/tools.js
var require_tools = __commonJS({
  "node_modules/pino/lib/tools.js"(exports2, module2) {
    "use strict";
    var format = require_quick_format_unescaped();
    var { mapHttpRequest, mapHttpResponse } = require_pino_std_serializers();
    var SonicBoom = require_sonic_boom();
    var onExit = require_on_exit_leak_free();
    var {
      lsCacheSym,
      chindingsSym,
      writeSym,
      serializersSym,
      formatOptsSym,
      endSym,
      stringifiersSym,
      stringifySym,
      stringifySafeSym,
      wildcardFirstSym,
      nestedKeySym,
      formattersSym,
      messageKeySym,
      errorKeySym,
      nestedKeyStrSym,
      msgPrefixSym
    } = require_symbols();
    var { isMainThread } = require("worker_threads");
    var transport = require_transport();
    function noop() {
    }
    function genLog(level, hook) {
      if (!hook)
        return LOG;
      return function hookWrappedLog(...args) {
        hook.call(this, args, LOG, level);
      };
      function LOG(o, ...n) {
        if (typeof o === "object") {
          let msg = o;
          if (o !== null) {
            if (o.method && o.headers && o.socket) {
              o = mapHttpRequest(o);
            } else if (typeof o.setHeader === "function") {
              o = mapHttpResponse(o);
            }
          }
          let formatParams;
          if (msg === null && n.length === 0) {
            formatParams = [null];
          } else {
            msg = n.shift();
            formatParams = n;
          }
          if (typeof this[msgPrefixSym] === "string" && msg !== void 0 && msg !== null) {
            msg = this[msgPrefixSym] + msg;
          }
          this[writeSym](o, format(msg, formatParams, this[formatOptsSym]), level);
        } else {
          let msg = o === void 0 ? n.shift() : o;
          if (typeof this[msgPrefixSym] === "string" && msg !== void 0 && msg !== null) {
            msg = this[msgPrefixSym] + msg;
          }
          this[writeSym](null, format(msg, n, this[formatOptsSym]), level);
        }
      }
    }
    function asString(str) {
      let result = "";
      let last = 0;
      let found = false;
      let point = 255;
      const l = str.length;
      if (l > 100) {
        return JSON.stringify(str);
      }
      for (var i = 0; i < l && point >= 32; i++) {
        point = str.charCodeAt(i);
        if (point === 34 || point === 92) {
          result += str.slice(last, i) + "\\";
          last = i;
          found = true;
        }
      }
      if (!found) {
        result = str;
      } else {
        result += str.slice(last);
      }
      return point < 32 ? JSON.stringify(str) : '"' + result + '"';
    }
    function asJson(obj, msg, num, time) {
      const stringify2 = this[stringifySym];
      const stringifySafe = this[stringifySafeSym];
      const stringifiers = this[stringifiersSym];
      const end = this[endSym];
      const chindings = this[chindingsSym];
      const serializers = this[serializersSym];
      const formatters = this[formattersSym];
      const messageKey = this[messageKeySym];
      const errorKey = this[errorKeySym];
      let data = this[lsCacheSym][num] + time;
      data = data + chindings;
      let value;
      if (formatters.log) {
        obj = formatters.log(obj);
      }
      const wildcardStringifier = stringifiers[wildcardFirstSym];
      let propStr = "";
      for (const key in obj) {
        value = obj[key];
        if (Object.prototype.hasOwnProperty.call(obj, key) && value !== void 0) {
          if (serializers[key]) {
            value = serializers[key](value);
          } else if (key === errorKey && serializers.err) {
            value = serializers.err(value);
          }
          const stringifier = stringifiers[key] || wildcardStringifier;
          switch (typeof value) {
            case "undefined":
            case "function":
              continue;
            case "number":
              if (Number.isFinite(value) === false) {
                value = null;
              }
            case "boolean":
              if (stringifier)
                value = stringifier(value);
              break;
            case "string":
              value = (stringifier || asString)(value);
              break;
            default:
              value = (stringifier || stringify2)(value, stringifySafe);
          }
          if (value === void 0)
            continue;
          const strKey = asString(key);
          propStr += "," + strKey + ":" + value;
        }
      }
      let msgStr = "";
      if (msg !== void 0) {
        value = serializers[messageKey] ? serializers[messageKey](msg) : msg;
        const stringifier = stringifiers[messageKey] || wildcardStringifier;
        switch (typeof value) {
          case "function":
            break;
          case "number":
            if (Number.isFinite(value) === false) {
              value = null;
            }
          case "boolean":
            if (stringifier)
              value = stringifier(value);
            msgStr = ',"' + messageKey + '":' + value;
            break;
          case "string":
            value = (stringifier || asString)(value);
            msgStr = ',"' + messageKey + '":' + value;
            break;
          default:
            value = (stringifier || stringify2)(value, stringifySafe);
            msgStr = ',"' + messageKey + '":' + value;
        }
      }
      if (this[nestedKeySym] && propStr) {
        return data + this[nestedKeyStrSym] + propStr.slice(1) + "}" + msgStr + end;
      } else {
        return data + propStr + msgStr + end;
      }
    }
    function asChindings(instance, bindings) {
      let value;
      let data = instance[chindingsSym];
      const stringify2 = instance[stringifySym];
      const stringifySafe = instance[stringifySafeSym];
      const stringifiers = instance[stringifiersSym];
      const wildcardStringifier = stringifiers[wildcardFirstSym];
      const serializers = instance[serializersSym];
      const formatter = instance[formattersSym].bindings;
      bindings = formatter(bindings);
      for (const key in bindings) {
        value = bindings[key];
        const valid = key !== "level" && key !== "serializers" && key !== "formatters" && key !== "customLevels" && bindings.hasOwnProperty(key) && value !== void 0;
        if (valid === true) {
          value = serializers[key] ? serializers[key](value) : value;
          value = (stringifiers[key] || wildcardStringifier || stringify2)(value, stringifySafe);
          if (value === void 0)
            continue;
          data += ',"' + key + '":' + value;
        }
      }
      return data;
    }
    function hasBeenTampered(stream) {
      return stream.write !== stream.constructor.prototype.write;
    }
    var hasNodeCodeCoverage = process.env.NODE_V8_COVERAGE || process.env.V8_COVERAGE;
    function buildSafeSonicBoom(opts) {
      const stream = new SonicBoom(opts);
      stream.on("error", filterBrokenPipe);
      if (!hasNodeCodeCoverage && !opts.sync && isMainThread) {
        onExit.register(stream, autoEnd);
        stream.on("close", function() {
          onExit.unregister(stream);
        });
      }
      return stream;
      function filterBrokenPipe(err) {
        if (err.code === "EPIPE") {
          stream.write = noop;
          stream.end = noop;
          stream.flushSync = noop;
          stream.destroy = noop;
          return;
        }
        stream.removeListener("error", filterBrokenPipe);
        stream.emit("error", err);
      }
    }
    function autoEnd(stream, eventName) {
      if (stream.destroyed) {
        return;
      }
      if (eventName === "beforeExit") {
        stream.flush();
        stream.on("drain", function() {
          stream.end();
        });
      } else {
        stream.flushSync();
      }
    }
    function createArgsNormalizer(defaultOptions) {
      return function normalizeArgs(instance, caller, opts = {}, stream) {
        if (typeof opts === "string") {
          stream = buildSafeSonicBoom({ dest: opts });
          opts = {};
        } else if (typeof stream === "string") {
          if (opts && opts.transport) {
            throw Error("only one of option.transport or stream can be specified");
          }
          stream = buildSafeSonicBoom({ dest: stream });
        } else if (opts instanceof SonicBoom || opts.writable || opts._writableState) {
          stream = opts;
          opts = {};
        } else if (opts.transport) {
          if (opts.transport instanceof SonicBoom || opts.transport.writable || opts.transport._writableState) {
            throw Error("option.transport do not allow stream, please pass to option directly. e.g. pino(transport)");
          }
          if (opts.transport.targets && opts.transport.targets.length && opts.formatters && typeof opts.formatters.level === "function") {
            throw Error("option.transport.targets do not allow custom level formatters");
          }
          let customLevels;
          if (opts.customLevels) {
            customLevels = opts.useOnlyCustomLevels ? opts.customLevels : Object.assign({}, opts.levels, opts.customLevels);
          }
          stream = transport({ caller, ...opts.transport, levels: customLevels });
        }
        opts = Object.assign({}, defaultOptions, opts);
        opts.serializers = Object.assign({}, defaultOptions.serializers, opts.serializers);
        opts.formatters = Object.assign({}, defaultOptions.formatters, opts.formatters);
        if (opts.prettyPrint) {
          throw new Error("prettyPrint option is no longer supported, see the pino-pretty package (https://github.com/pinojs/pino-pretty)");
        }
        const { enabled, onChild } = opts;
        if (enabled === false)
          opts.level = "silent";
        if (!onChild)
          opts.onChild = noop;
        if (!stream) {
          if (!hasBeenTampered(process.stdout)) {
            stream = buildSafeSonicBoom({ fd: process.stdout.fd || 1 });
          } else {
            stream = process.stdout;
          }
        }
        return { opts, stream };
      };
    }
    function stringify(obj, stringifySafeFn) {
      try {
        return JSON.stringify(obj);
      } catch (_) {
        try {
          const stringify2 = stringifySafeFn || this[stringifySafeSym];
          return stringify2(obj);
        } catch (_2) {
          return '"[unable to serialize, circular reference is too complex to analyze]"';
        }
      }
    }
    function buildFormatters(level, bindings, log) {
      return {
        level,
        bindings,
        log
      };
    }
    function normalizeDestFileDescriptor(destination) {
      const fd = Number(destination);
      if (typeof destination === "string" && Number.isFinite(fd)) {
        return fd;
      }
      if (destination === void 0) {
        return 1;
      }
      return destination;
    }
    module2.exports = {
      noop,
      buildSafeSonicBoom,
      asChindings,
      asJson,
      genLog,
      createArgsNormalizer,
      stringify,
      buildFormatters,
      normalizeDestFileDescriptor
    };
  }
});

// node_modules/pino/lib/constants.js
var require_constants = __commonJS({
  "node_modules/pino/lib/constants.js"(exports2, module2) {
    var DEFAULT_LEVELS = {
      trace: 10,
      debug: 20,
      info: 30,
      warn: 40,
      error: 50,
      fatal: 60
    };
    var SORTING_ORDER = {
      ASC: "ASC",
      DESC: "DESC"
    };
    module2.exports = {
      DEFAULT_LEVELS,
      SORTING_ORDER
    };
  }
});

// node_modules/pino/lib/levels.js
var require_levels = __commonJS({
  "node_modules/pino/lib/levels.js"(exports2, module2) {
    "use strict";
    var {
      lsCacheSym,
      levelValSym,
      useOnlyCustomLevelsSym,
      streamSym,
      formattersSym,
      hooksSym,
      levelCompSym
    } = require_symbols();
    var { noop, genLog } = require_tools();
    var { DEFAULT_LEVELS, SORTING_ORDER } = require_constants();
    var levelMethods = {
      fatal: (hook) => {
        const logFatal = genLog(DEFAULT_LEVELS.fatal, hook);
        return function(...args) {
          const stream = this[streamSym];
          logFatal.call(this, ...args);
          if (typeof stream.flushSync === "function") {
            try {
              stream.flushSync();
            } catch (e) {
            }
          }
        };
      },
      error: (hook) => genLog(DEFAULT_LEVELS.error, hook),
      warn: (hook) => genLog(DEFAULT_LEVELS.warn, hook),
      info: (hook) => genLog(DEFAULT_LEVELS.info, hook),
      debug: (hook) => genLog(DEFAULT_LEVELS.debug, hook),
      trace: (hook) => genLog(DEFAULT_LEVELS.trace, hook)
    };
    var nums = Object.keys(DEFAULT_LEVELS).reduce((o, k) => {
      o[DEFAULT_LEVELS[k]] = k;
      return o;
    }, {});
    var initialLsCache = Object.keys(nums).reduce((o, k) => {
      o[k] = '{"level":' + Number(k);
      return o;
    }, {});
    function genLsCache(instance) {
      const formatter = instance[formattersSym].level;
      const { labels } = instance.levels;
      const cache = {};
      for (const label in labels) {
        const level = formatter(labels[label], Number(label));
        cache[label] = JSON.stringify(level).slice(0, -1);
      }
      instance[lsCacheSym] = cache;
      return instance;
    }
    function isStandardLevel(level, useOnlyCustomLevels) {
      if (useOnlyCustomLevels) {
        return false;
      }
      switch (level) {
        case "fatal":
        case "error":
        case "warn":
        case "info":
        case "debug":
        case "trace":
          return true;
        default:
          return false;
      }
    }
    function setLevel(level) {
      const { labels, values } = this.levels;
      if (typeof level === "number") {
        if (labels[level] === void 0)
          throw Error("unknown level value" + level);
        level = labels[level];
      }
      if (values[level] === void 0)
        throw Error("unknown level " + level);
      const preLevelVal = this[levelValSym];
      const levelVal = this[levelValSym] = values[level];
      const useOnlyCustomLevelsVal = this[useOnlyCustomLevelsSym];
      const levelComparison = this[levelCompSym];
      const hook = this[hooksSym].logMethod;
      for (const key in values) {
        if (levelComparison(values[key], levelVal) === false) {
          this[key] = noop;
          continue;
        }
        this[key] = isStandardLevel(key, useOnlyCustomLevelsVal) ? levelMethods[key](hook) : genLog(values[key], hook);
      }
      this.emit(
        "level-change",
        level,
        levelVal,
        labels[preLevelVal],
        preLevelVal,
        this
      );
    }
    function getLevel(level) {
      const { levels, levelVal } = this;
      return levels && levels.labels ? levels.labels[levelVal] : "";
    }
    function isLevelEnabled(logLevel) {
      const { values } = this.levels;
      const logLevelVal = values[logLevel];
      return logLevelVal !== void 0 && this[levelCompSym](logLevelVal, this[levelValSym]);
    }
    function compareLevel(direction, current, expected) {
      if (direction === SORTING_ORDER.DESC) {
        return current <= expected;
      }
      return current >= expected;
    }
    function genLevelComparison(levelComparison) {
      if (typeof levelComparison === "string") {
        return compareLevel.bind(null, levelComparison);
      }
      return levelComparison;
    }
    function mappings(customLevels = null, useOnlyCustomLevels = false) {
      const customNums = customLevels ? Object.keys(customLevels).reduce((o, k) => {
        o[customLevels[k]] = k;
        return o;
      }, {}) : null;
      const labels = Object.assign(
        Object.create(Object.prototype, { Infinity: { value: "silent" } }),
        useOnlyCustomLevels ? null : nums,
        customNums
      );
      const values = Object.assign(
        Object.create(Object.prototype, { silent: { value: Infinity } }),
        useOnlyCustomLevels ? null : DEFAULT_LEVELS,
        customLevels
      );
      return { labels, values };
    }
    function assertDefaultLevelFound(defaultLevel, customLevels, useOnlyCustomLevels) {
      if (typeof defaultLevel === "number") {
        const values = [].concat(
          Object.keys(customLevels || {}).map((key) => customLevels[key]),
          useOnlyCustomLevels ? [] : Object.keys(nums).map((level) => +level),
          Infinity
        );
        if (!values.includes(defaultLevel)) {
          throw Error(`default level:${defaultLevel} must be included in custom levels`);
        }
        return;
      }
      const labels = Object.assign(
        Object.create(Object.prototype, { silent: { value: Infinity } }),
        useOnlyCustomLevels ? null : DEFAULT_LEVELS,
        customLevels
      );
      if (!(defaultLevel in labels)) {
        throw Error(`default level:${defaultLevel} must be included in custom levels`);
      }
    }
    function assertNoLevelCollisions(levels, customLevels) {
      const { labels, values } = levels;
      for (const k in customLevels) {
        if (k in values) {
          throw Error("levels cannot be overridden");
        }
        if (customLevels[k] in labels) {
          throw Error("pre-existing level values cannot be used for new levels");
        }
      }
    }
    function assertLevelComparison(levelComparison) {
      if (typeof levelComparison === "function") {
        return;
      }
      if (typeof levelComparison === "string" && Object.values(SORTING_ORDER).includes(levelComparison)) {
        return;
      }
      throw new Error('Levels comparison should be one of "ASC", "DESC" or "function" type');
    }
    module2.exports = {
      initialLsCache,
      genLsCache,
      levelMethods,
      getLevel,
      setLevel,
      isLevelEnabled,
      mappings,
      assertNoLevelCollisions,
      assertDefaultLevelFound,
      genLevelComparison,
      assertLevelComparison
    };
  }
});

// node_modules/pino/lib/meta.js
var require_meta = __commonJS({
  "node_modules/pino/lib/meta.js"(exports2, module2) {
    "use strict";
    module2.exports = { version: "8.21.0" };
  }
});

// node_modules/pino/lib/proto.js
var require_proto = __commonJS({
  "node_modules/pino/lib/proto.js"(exports2, module2) {
    "use strict";
    var { EventEmitter: EventEmitter2 } = require("events");
    var {
      lsCacheSym,
      levelValSym,
      setLevelSym,
      getLevelSym,
      chindingsSym,
      parsedChindingsSym,
      mixinSym,
      asJsonSym,
      writeSym,
      mixinMergeStrategySym,
      timeSym,
      timeSliceIndexSym,
      streamSym,
      serializersSym,
      formattersSym,
      errorKeySym,
      messageKeySym,
      useOnlyCustomLevelsSym,
      needsMetadataGsym,
      redactFmtSym,
      stringifySym,
      formatOptsSym,
      stringifiersSym,
      msgPrefixSym
    } = require_symbols();
    var {
      getLevel,
      setLevel,
      isLevelEnabled,
      mappings,
      initialLsCache,
      genLsCache,
      assertNoLevelCollisions
    } = require_levels();
    var {
      asChindings,
      asJson,
      buildFormatters,
      stringify
    } = require_tools();
    var {
      version
    } = require_meta();
    var redaction = require_redaction();
    var constructor = class Pino {
    };
    var prototype = {
      constructor,
      child,
      bindings,
      setBindings,
      flush,
      isLevelEnabled,
      version,
      get level() {
        return this[getLevelSym]();
      },
      set level(lvl) {
        this[setLevelSym](lvl);
      },
      get levelVal() {
        return this[levelValSym];
      },
      set levelVal(n) {
        throw Error("levelVal is read-only");
      },
      [lsCacheSym]: initialLsCache,
      [writeSym]: write,
      [asJsonSym]: asJson,
      [getLevelSym]: getLevel,
      [setLevelSym]: setLevel
    };
    Object.setPrototypeOf(prototype, EventEmitter2.prototype);
    module2.exports = function() {
      return Object.create(prototype);
    };
    var resetChildingsFormatter = (bindings2) => bindings2;
    function child(bindings2, options) {
      if (!bindings2) {
        throw Error("missing bindings for child Pino");
      }
      options = options || {};
      const serializers = this[serializersSym];
      const formatters = this[formattersSym];
      const instance = Object.create(this);
      if (options.hasOwnProperty("serializers") === true) {
        instance[serializersSym] = /* @__PURE__ */ Object.create(null);
        for (const k in serializers) {
          instance[serializersSym][k] = serializers[k];
        }
        const parentSymbols = Object.getOwnPropertySymbols(serializers);
        for (var i = 0; i < parentSymbols.length; i++) {
          const ks = parentSymbols[i];
          instance[serializersSym][ks] = serializers[ks];
        }
        for (const bk in options.serializers) {
          instance[serializersSym][bk] = options.serializers[bk];
        }
        const bindingsSymbols = Object.getOwnPropertySymbols(options.serializers);
        for (var bi = 0; bi < bindingsSymbols.length; bi++) {
          const bks = bindingsSymbols[bi];
          instance[serializersSym][bks] = options.serializers[bks];
        }
      } else
        instance[serializersSym] = serializers;
      if (options.hasOwnProperty("formatters")) {
        const { level, bindings: chindings, log } = options.formatters;
        instance[formattersSym] = buildFormatters(
          level || formatters.level,
          chindings || resetChildingsFormatter,
          log || formatters.log
        );
      } else {
        instance[formattersSym] = buildFormatters(
          formatters.level,
          resetChildingsFormatter,
          formatters.log
        );
      }
      if (options.hasOwnProperty("customLevels") === true) {
        assertNoLevelCollisions(this.levels, options.customLevels);
        instance.levels = mappings(options.customLevels, instance[useOnlyCustomLevelsSym]);
        genLsCache(instance);
      }
      if (typeof options.redact === "object" && options.redact !== null || Array.isArray(options.redact)) {
        instance.redact = options.redact;
        const stringifiers = redaction(instance.redact, stringify);
        const formatOpts = { stringify: stringifiers[redactFmtSym] };
        instance[stringifySym] = stringify;
        instance[stringifiersSym] = stringifiers;
        instance[formatOptsSym] = formatOpts;
      }
      if (typeof options.msgPrefix === "string") {
        instance[msgPrefixSym] = (this[msgPrefixSym] || "") + options.msgPrefix;
      }
      instance[chindingsSym] = asChindings(instance, bindings2);
      const childLevel = options.level || this.level;
      instance[setLevelSym](childLevel);
      this.onChild(instance);
      return instance;
    }
    function bindings() {
      const chindings = this[chindingsSym];
      const chindingsJson = `{${chindings.substr(1)}}`;
      const bindingsFromJson = JSON.parse(chindingsJson);
      delete bindingsFromJson.pid;
      delete bindingsFromJson.hostname;
      return bindingsFromJson;
    }
    function setBindings(newBindings) {
      const chindings = asChindings(this, newBindings);
      this[chindingsSym] = chindings;
      delete this[parsedChindingsSym];
    }
    function defaultMixinMergeStrategy(mergeObject, mixinObject) {
      return Object.assign(mixinObject, mergeObject);
    }
    function write(_obj, msg, num) {
      const t = this[timeSym]();
      const mixin = this[mixinSym];
      const errorKey = this[errorKeySym];
      const messageKey = this[messageKeySym];
      const mixinMergeStrategy = this[mixinMergeStrategySym] || defaultMixinMergeStrategy;
      let obj;
      if (_obj === void 0 || _obj === null) {
        obj = {};
      } else if (_obj instanceof Error) {
        obj = { [errorKey]: _obj };
        if (msg === void 0) {
          msg = _obj.message;
        }
      } else {
        obj = _obj;
        if (msg === void 0 && _obj[messageKey] === void 0 && _obj[errorKey]) {
          msg = _obj[errorKey].message;
        }
      }
      if (mixin) {
        obj = mixinMergeStrategy(obj, mixin(obj, num, this));
      }
      const s = this[asJsonSym](obj, msg, num, t);
      const stream = this[streamSym];
      if (stream[needsMetadataGsym] === true) {
        stream.lastLevel = num;
        stream.lastObj = obj;
        stream.lastMsg = msg;
        stream.lastTime = t.slice(this[timeSliceIndexSym]);
        stream.lastLogger = this;
      }
      stream.write(s);
    }
    function noop() {
    }
    function flush(cb) {
      if (cb != null && typeof cb !== "function") {
        throw Error("callback must be a function");
      }
      const stream = this[streamSym];
      if (typeof stream.flush === "function") {
        stream.flush(cb || noop);
      } else if (cb)
        cb();
    }
  }
});

// node_modules/safe-stable-stringify/index.js
var require_safe_stable_stringify = __commonJS({
  "node_modules/safe-stable-stringify/index.js"(exports2, module2) {
    "use strict";
    var { hasOwnProperty } = Object.prototype;
    var stringify = configure();
    stringify.configure = configure;
    stringify.stringify = stringify;
    stringify.default = stringify;
    exports2.stringify = stringify;
    exports2.configure = configure;
    module2.exports = stringify;
    var strEscapeSequencesRegExp = /[\u0000-\u001f\u0022\u005c\ud800-\udfff]/;
    function strEscape(str) {
      if (str.length < 5e3 && !strEscapeSequencesRegExp.test(str)) {
        return `"${str}"`;
      }
      return JSON.stringify(str);
    }
    function sort(array, comparator) {
      if (array.length > 200 || comparator) {
        return array.sort(comparator);
      }
      for (let i = 1; i < array.length; i++) {
        const currentValue = array[i];
        let position = i;
        while (position !== 0 && array[position - 1] > currentValue) {
          array[position] = array[position - 1];
          position--;
        }
        array[position] = currentValue;
      }
      return array;
    }
    var typedArrayPrototypeGetSymbolToStringTag = Object.getOwnPropertyDescriptor(
      Object.getPrototypeOf(
        Object.getPrototypeOf(
          new Int8Array()
        )
      ),
      Symbol.toStringTag
    ).get;
    function isTypedArrayWithEntries(value) {
      return typedArrayPrototypeGetSymbolToStringTag.call(value) !== void 0 && value.length !== 0;
    }
    function stringifyTypedArray(array, separator, maximumBreadth) {
      if (array.length < maximumBreadth) {
        maximumBreadth = array.length;
      }
      const whitespace = separator === "," ? "" : " ";
      let res = `"0":${whitespace}${array[0]}`;
      for (let i = 1; i < maximumBreadth; i++) {
        res += `${separator}"${i}":${whitespace}${array[i]}`;
      }
      return res;
    }
    function getCircularValueOption(options) {
      if (hasOwnProperty.call(options, "circularValue")) {
        const circularValue = options.circularValue;
        if (typeof circularValue === "string") {
          return `"${circularValue}"`;
        }
        if (circularValue == null) {
          return circularValue;
        }
        if (circularValue === Error || circularValue === TypeError) {
          return {
            toString() {
              throw new TypeError("Converting circular structure to JSON");
            }
          };
        }
        throw new TypeError('The "circularValue" argument must be of type string or the value null or undefined');
      }
      return '"[Circular]"';
    }
    function getDeterministicOption(options) {
      let value;
      if (hasOwnProperty.call(options, "deterministic")) {
        value = options.deterministic;
        if (typeof value !== "boolean" && typeof value !== "function") {
          throw new TypeError('The "deterministic" argument must be of type boolean or comparator function');
        }
      }
      return value === void 0 ? true : value;
    }
    function getBooleanOption(options, key) {
      let value;
      if (hasOwnProperty.call(options, key)) {
        value = options[key];
        if (typeof value !== "boolean") {
          throw new TypeError(`The "${key}" argument must be of type boolean`);
        }
      }
      return value === void 0 ? true : value;
    }
    function getPositiveIntegerOption(options, key) {
      let value;
      if (hasOwnProperty.call(options, key)) {
        value = options[key];
        if (typeof value !== "number") {
          throw new TypeError(`The "${key}" argument must be of type number`);
        }
        if (!Number.isInteger(value)) {
          throw new TypeError(`The "${key}" argument must be an integer`);
        }
        if (value < 1) {
          throw new RangeError(`The "${key}" argument must be >= 1`);
        }
      }
      return value === void 0 ? Infinity : value;
    }
    function getItemCount(number) {
      if (number === 1) {
        return "1 item";
      }
      return `${number} items`;
    }
    function getUniqueReplacerSet(replacerArray) {
      const replacerSet = /* @__PURE__ */ new Set();
      for (const value of replacerArray) {
        if (typeof value === "string" || typeof value === "number") {
          replacerSet.add(String(value));
        }
      }
      return replacerSet;
    }
    function getStrictOption(options) {
      if (hasOwnProperty.call(options, "strict")) {
        const value = options.strict;
        if (typeof value !== "boolean") {
          throw new TypeError('The "strict" argument must be of type boolean');
        }
        if (value) {
          return (value2) => {
            let message = `Object can not safely be stringified. Received type ${typeof value2}`;
            if (typeof value2 !== "function")
              message += ` (${value2.toString()})`;
            throw new Error(message);
          };
        }
      }
    }
    function configure(options) {
      options = { ...options };
      const fail = getStrictOption(options);
      if (fail) {
        if (options.bigint === void 0) {
          options.bigint = false;
        }
        if (!("circularValue" in options)) {
          options.circularValue = Error;
        }
      }
      const circularValue = getCircularValueOption(options);
      const bigint = getBooleanOption(options, "bigint");
      const deterministic = getDeterministicOption(options);
      const comparator = typeof deterministic === "function" ? deterministic : void 0;
      const maximumDepth = getPositiveIntegerOption(options, "maximumDepth");
      const maximumBreadth = getPositiveIntegerOption(options, "maximumBreadth");
      function stringifyFnReplacer(key, parent, stack, replacer, spacer, indentation) {
        let value = parent[key];
        if (typeof value === "object" && value !== null && typeof value.toJSON === "function") {
          value = value.toJSON(key);
        }
        value = replacer.call(parent, key, value);
        switch (typeof value) {
          case "string":
            return strEscape(value);
          case "object": {
            if (value === null) {
              return "null";
            }
            if (stack.indexOf(value) !== -1) {
              return circularValue;
            }
            let res = "";
            let join2 = ",";
            const originalIndentation = indentation;
            if (Array.isArray(value)) {
              if (value.length === 0) {
                return "[]";
              }
              if (maximumDepth < stack.length + 1) {
                return '"[Array]"';
              }
              stack.push(value);
              if (spacer !== "") {
                indentation += spacer;
                res += `
${indentation}`;
                join2 = `,
${indentation}`;
              }
              const maximumValuesToStringify = Math.min(value.length, maximumBreadth);
              let i = 0;
              for (; i < maximumValuesToStringify - 1; i++) {
                const tmp2 = stringifyFnReplacer(String(i), value, stack, replacer, spacer, indentation);
                res += tmp2 !== void 0 ? tmp2 : "null";
                res += join2;
              }
              const tmp = stringifyFnReplacer(String(i), value, stack, replacer, spacer, indentation);
              res += tmp !== void 0 ? tmp : "null";
              if (value.length - 1 > maximumBreadth) {
                const removedKeys = value.length - maximumBreadth - 1;
                res += `${join2}"... ${getItemCount(removedKeys)} not stringified"`;
              }
              if (spacer !== "") {
                res += `
${originalIndentation}`;
              }
              stack.pop();
              return `[${res}]`;
            }
            let keys = Object.keys(value);
            const keyLength = keys.length;
            if (keyLength === 0) {
              return "{}";
            }
            if (maximumDepth < stack.length + 1) {
              return '"[Object]"';
            }
            let whitespace = "";
            let separator = "";
            if (spacer !== "") {
              indentation += spacer;
              join2 = `,
${indentation}`;
              whitespace = " ";
            }
            const maximumPropertiesToStringify = Math.min(keyLength, maximumBreadth);
            if (deterministic && !isTypedArrayWithEntries(value)) {
              keys = sort(keys, comparator);
            }
            stack.push(value);
            for (let i = 0; i < maximumPropertiesToStringify; i++) {
              const key2 = keys[i];
              const tmp = stringifyFnReplacer(key2, value, stack, replacer, spacer, indentation);
              if (tmp !== void 0) {
                res += `${separator}${strEscape(key2)}:${whitespace}${tmp}`;
                separator = join2;
              }
            }
            if (keyLength > maximumBreadth) {
              const removedKeys = keyLength - maximumBreadth;
              res += `${separator}"...":${whitespace}"${getItemCount(removedKeys)} not stringified"`;
              separator = join2;
            }
            if (spacer !== "" && separator.length > 1) {
              res = `
${indentation}${res}
${originalIndentation}`;
            }
            stack.pop();
            return `{${res}}`;
          }
          case "number":
            return isFinite(value) ? String(value) : fail ? fail(value) : "null";
          case "boolean":
            return value === true ? "true" : "false";
          case "undefined":
            return void 0;
          case "bigint":
            if (bigint) {
              return String(value);
            }
          default:
            return fail ? fail(value) : void 0;
        }
      }
      function stringifyArrayReplacer(key, value, stack, replacer, spacer, indentation) {
        if (typeof value === "object" && value !== null && typeof value.toJSON === "function") {
          value = value.toJSON(key);
        }
        switch (typeof value) {
          case "string":
            return strEscape(value);
          case "object": {
            if (value === null) {
              return "null";
            }
            if (stack.indexOf(value) !== -1) {
              return circularValue;
            }
            const originalIndentation = indentation;
            let res = "";
            let join2 = ",";
            if (Array.isArray(value)) {
              if (value.length === 0) {
                return "[]";
              }
              if (maximumDepth < stack.length + 1) {
                return '"[Array]"';
              }
              stack.push(value);
              if (spacer !== "") {
                indentation += spacer;
                res += `
${indentation}`;
                join2 = `,
${indentation}`;
              }
              const maximumValuesToStringify = Math.min(value.length, maximumBreadth);
              let i = 0;
              for (; i < maximumValuesToStringify - 1; i++) {
                const tmp2 = stringifyArrayReplacer(String(i), value[i], stack, replacer, spacer, indentation);
                res += tmp2 !== void 0 ? tmp2 : "null";
                res += join2;
              }
              const tmp = stringifyArrayReplacer(String(i), value[i], stack, replacer, spacer, indentation);
              res += tmp !== void 0 ? tmp : "null";
              if (value.length - 1 > maximumBreadth) {
                const removedKeys = value.length - maximumBreadth - 1;
                res += `${join2}"... ${getItemCount(removedKeys)} not stringified"`;
              }
              if (spacer !== "") {
                res += `
${originalIndentation}`;
              }
              stack.pop();
              return `[${res}]`;
            }
            stack.push(value);
            let whitespace = "";
            if (spacer !== "") {
              indentation += spacer;
              join2 = `,
${indentation}`;
              whitespace = " ";
            }
            let separator = "";
            for (const key2 of replacer) {
              const tmp = stringifyArrayReplacer(key2, value[key2], stack, replacer, spacer, indentation);
              if (tmp !== void 0) {
                res += `${separator}${strEscape(key2)}:${whitespace}${tmp}`;
                separator = join2;
              }
            }
            if (spacer !== "" && separator.length > 1) {
              res = `
${indentation}${res}
${originalIndentation}`;
            }
            stack.pop();
            return `{${res}}`;
          }
          case "number":
            return isFinite(value) ? String(value) : fail ? fail(value) : "null";
          case "boolean":
            return value === true ? "true" : "false";
          case "undefined":
            return void 0;
          case "bigint":
            if (bigint) {
              return String(value);
            }
          default:
            return fail ? fail(value) : void 0;
        }
      }
      function stringifyIndent(key, value, stack, spacer, indentation) {
        switch (typeof value) {
          case "string":
            return strEscape(value);
          case "object": {
            if (value === null) {
              return "null";
            }
            if (typeof value.toJSON === "function") {
              value = value.toJSON(key);
              if (typeof value !== "object") {
                return stringifyIndent(key, value, stack, spacer, indentation);
              }
              if (value === null) {
                return "null";
              }
            }
            if (stack.indexOf(value) !== -1) {
              return circularValue;
            }
            const originalIndentation = indentation;
            if (Array.isArray(value)) {
              if (value.length === 0) {
                return "[]";
              }
              if (maximumDepth < stack.length + 1) {
                return '"[Array]"';
              }
              stack.push(value);
              indentation += spacer;
              let res2 = `
${indentation}`;
              const join3 = `,
${indentation}`;
              const maximumValuesToStringify = Math.min(value.length, maximumBreadth);
              let i = 0;
              for (; i < maximumValuesToStringify - 1; i++) {
                const tmp2 = stringifyIndent(String(i), value[i], stack, spacer, indentation);
                res2 += tmp2 !== void 0 ? tmp2 : "null";
                res2 += join3;
              }
              const tmp = stringifyIndent(String(i), value[i], stack, spacer, indentation);
              res2 += tmp !== void 0 ? tmp : "null";
              if (value.length - 1 > maximumBreadth) {
                const removedKeys = value.length - maximumBreadth - 1;
                res2 += `${join3}"... ${getItemCount(removedKeys)} not stringified"`;
              }
              res2 += `
${originalIndentation}`;
              stack.pop();
              return `[${res2}]`;
            }
            let keys = Object.keys(value);
            const keyLength = keys.length;
            if (keyLength === 0) {
              return "{}";
            }
            if (maximumDepth < stack.length + 1) {
              return '"[Object]"';
            }
            indentation += spacer;
            const join2 = `,
${indentation}`;
            let res = "";
            let separator = "";
            let maximumPropertiesToStringify = Math.min(keyLength, maximumBreadth);
            if (isTypedArrayWithEntries(value)) {
              res += stringifyTypedArray(value, join2, maximumBreadth);
              keys = keys.slice(value.length);
              maximumPropertiesToStringify -= value.length;
              separator = join2;
            }
            if (deterministic) {
              keys = sort(keys, comparator);
            }
            stack.push(value);
            for (let i = 0; i < maximumPropertiesToStringify; i++) {
              const key2 = keys[i];
              const tmp = stringifyIndent(key2, value[key2], stack, spacer, indentation);
              if (tmp !== void 0) {
                res += `${separator}${strEscape(key2)}: ${tmp}`;
                separator = join2;
              }
            }
            if (keyLength > maximumBreadth) {
              const removedKeys = keyLength - maximumBreadth;
              res += `${separator}"...": "${getItemCount(removedKeys)} not stringified"`;
              separator = join2;
            }
            if (separator !== "") {
              res = `
${indentation}${res}
${originalIndentation}`;
            }
            stack.pop();
            return `{${res}}`;
          }
          case "number":
            return isFinite(value) ? String(value) : fail ? fail(value) : "null";
          case "boolean":
            return value === true ? "true" : "false";
          case "undefined":
            return void 0;
          case "bigint":
            if (bigint) {
              return String(value);
            }
          default:
            return fail ? fail(value) : void 0;
        }
      }
      function stringifySimple(key, value, stack) {
        switch (typeof value) {
          case "string":
            return strEscape(value);
          case "object": {
            if (value === null) {
              return "null";
            }
            if (typeof value.toJSON === "function") {
              value = value.toJSON(key);
              if (typeof value !== "object") {
                return stringifySimple(key, value, stack);
              }
              if (value === null) {
                return "null";
              }
            }
            if (stack.indexOf(value) !== -1) {
              return circularValue;
            }
            let res = "";
            const hasLength = value.length !== void 0;
            if (hasLength && Array.isArray(value)) {
              if (value.length === 0) {
                return "[]";
              }
              if (maximumDepth < stack.length + 1) {
                return '"[Array]"';
              }
              stack.push(value);
              const maximumValuesToStringify = Math.min(value.length, maximumBreadth);
              let i = 0;
              for (; i < maximumValuesToStringify - 1; i++) {
                const tmp2 = stringifySimple(String(i), value[i], stack);
                res += tmp2 !== void 0 ? tmp2 : "null";
                res += ",";
              }
              const tmp = stringifySimple(String(i), value[i], stack);
              res += tmp !== void 0 ? tmp : "null";
              if (value.length - 1 > maximumBreadth) {
                const removedKeys = value.length - maximumBreadth - 1;
                res += `,"... ${getItemCount(removedKeys)} not stringified"`;
              }
              stack.pop();
              return `[${res}]`;
            }
            let keys = Object.keys(value);
            const keyLength = keys.length;
            if (keyLength === 0) {
              return "{}";
            }
            if (maximumDepth < stack.length + 1) {
              return '"[Object]"';
            }
            let separator = "";
            let maximumPropertiesToStringify = Math.min(keyLength, maximumBreadth);
            if (hasLength && isTypedArrayWithEntries(value)) {
              res += stringifyTypedArray(value, ",", maximumBreadth);
              keys = keys.slice(value.length);
              maximumPropertiesToStringify -= value.length;
              separator = ",";
            }
            if (deterministic) {
              keys = sort(keys, comparator);
            }
            stack.push(value);
            for (let i = 0; i < maximumPropertiesToStringify; i++) {
              const key2 = keys[i];
              const tmp = stringifySimple(key2, value[key2], stack);
              if (tmp !== void 0) {
                res += `${separator}${strEscape(key2)}:${tmp}`;
                separator = ",";
              }
            }
            if (keyLength > maximumBreadth) {
              const removedKeys = keyLength - maximumBreadth;
              res += `${separator}"...":"${getItemCount(removedKeys)} not stringified"`;
            }
            stack.pop();
            return `{${res}}`;
          }
          case "number":
            return isFinite(value) ? String(value) : fail ? fail(value) : "null";
          case "boolean":
            return value === true ? "true" : "false";
          case "undefined":
            return void 0;
          case "bigint":
            if (bigint) {
              return String(value);
            }
          default:
            return fail ? fail(value) : void 0;
        }
      }
      function stringify2(value, replacer, space) {
        if (arguments.length > 1) {
          let spacer = "";
          if (typeof space === "number") {
            spacer = " ".repeat(Math.min(space, 10));
          } else if (typeof space === "string") {
            spacer = space.slice(0, 10);
          }
          if (replacer != null) {
            if (typeof replacer === "function") {
              return stringifyFnReplacer("", { "": value }, [], replacer, spacer, "");
            }
            if (Array.isArray(replacer)) {
              return stringifyArrayReplacer("", value, [], getUniqueReplacerSet(replacer), spacer, "");
            }
          }
          if (spacer.length !== 0) {
            return stringifyIndent("", value, [], spacer, "");
          }
        }
        return stringifySimple("", value, []);
      }
      return stringify2;
    }
  }
});

// node_modules/pino/lib/multistream.js
var require_multistream = __commonJS({
  "node_modules/pino/lib/multistream.js"(exports2, module2) {
    "use strict";
    var metadata = Symbol.for("pino.metadata");
    var { DEFAULT_LEVELS } = require_constants();
    var DEFAULT_INFO_LEVEL = DEFAULT_LEVELS.info;
    function multistream(streamsArray, opts) {
      let counter = 0;
      streamsArray = streamsArray || [];
      opts = opts || { dedupe: false };
      const streamLevels = Object.create(DEFAULT_LEVELS);
      streamLevels.silent = Infinity;
      if (opts.levels && typeof opts.levels === "object") {
        Object.keys(opts.levels).forEach((i) => {
          streamLevels[i] = opts.levels[i];
        });
      }
      const res = {
        write,
        add,
        emit,
        flushSync,
        end,
        minLevel: 0,
        streams: [],
        clone,
        [metadata]: true,
        streamLevels
      };
      if (Array.isArray(streamsArray)) {
        streamsArray.forEach(add, res);
      } else {
        add.call(res, streamsArray);
      }
      streamsArray = null;
      return res;
      function write(data) {
        let dest;
        const level = this.lastLevel;
        const { streams } = this;
        let recordedLevel = 0;
        let stream;
        for (let i = initLoopVar(streams.length, opts.dedupe); checkLoopVar(i, streams.length, opts.dedupe); i = adjustLoopVar(i, opts.dedupe)) {
          dest = streams[i];
          if (dest.level <= level) {
            if (recordedLevel !== 0 && recordedLevel !== dest.level) {
              break;
            }
            stream = dest.stream;
            if (stream[metadata]) {
              const { lastTime, lastMsg, lastObj, lastLogger } = this;
              stream.lastLevel = level;
              stream.lastTime = lastTime;
              stream.lastMsg = lastMsg;
              stream.lastObj = lastObj;
              stream.lastLogger = lastLogger;
            }
            stream.write(data);
            if (opts.dedupe) {
              recordedLevel = dest.level;
            }
          } else if (!opts.dedupe) {
            break;
          }
        }
      }
      function emit(...args) {
        for (const { stream } of this.streams) {
          if (typeof stream.emit === "function") {
            stream.emit(...args);
          }
        }
      }
      function flushSync() {
        for (const { stream } of this.streams) {
          if (typeof stream.flushSync === "function") {
            stream.flushSync();
          }
        }
      }
      function add(dest) {
        if (!dest) {
          return res;
        }
        const isStream = typeof dest.write === "function" || dest.stream;
        const stream_ = dest.write ? dest : dest.stream;
        if (!isStream) {
          throw Error("stream object needs to implement either StreamEntry or DestinationStream interface");
        }
        const { streams, streamLevels: streamLevels2 } = this;
        let level;
        if (typeof dest.levelVal === "number") {
          level = dest.levelVal;
        } else if (typeof dest.level === "string") {
          level = streamLevels2[dest.level];
        } else if (typeof dest.level === "number") {
          level = dest.level;
        } else {
          level = DEFAULT_INFO_LEVEL;
        }
        const dest_ = {
          stream: stream_,
          level,
          levelVal: void 0,
          id: counter++
        };
        streams.unshift(dest_);
        streams.sort(compareByLevel);
        this.minLevel = streams[0].level;
        return res;
      }
      function end() {
        for (const { stream } of this.streams) {
          if (typeof stream.flushSync === "function") {
            stream.flushSync();
          }
          stream.end();
        }
      }
      function clone(level) {
        const streams = new Array(this.streams.length);
        for (let i = 0; i < streams.length; i++) {
          streams[i] = {
            level,
            stream: this.streams[i].stream
          };
        }
        return {
          write,
          add,
          minLevel: level,
          streams,
          clone,
          emit,
          flushSync,
          [metadata]: true
        };
      }
    }
    function compareByLevel(a, b) {
      return a.level - b.level;
    }
    function initLoopVar(length, dedupe) {
      return dedupe ? length - 1 : 0;
    }
    function adjustLoopVar(i, dedupe) {
      return dedupe ? i - 1 : i + 1;
    }
    function checkLoopVar(i, length, dedupe) {
      return dedupe ? i >= 0 : i < length;
    }
    module2.exports = multistream;
  }
});

// node_modules/pino/pino.js
var require_pino = __commonJS({
  "node_modules/pino/pino.js"(exports2, module2) {
    "use strict";
    var os = require("os");
    var stdSerializers = require_pino_std_serializers();
    var caller = require_caller();
    var redaction = require_redaction();
    var time = require_time();
    var proto = require_proto();
    var symbols = require_symbols();
    var { configure } = require_safe_stable_stringify();
    var { assertDefaultLevelFound, mappings, genLsCache, genLevelComparison, assertLevelComparison } = require_levels();
    var { DEFAULT_LEVELS, SORTING_ORDER } = require_constants();
    var {
      createArgsNormalizer,
      asChindings,
      buildSafeSonicBoom,
      buildFormatters,
      stringify,
      normalizeDestFileDescriptor,
      noop
    } = require_tools();
    var { version } = require_meta();
    var {
      chindingsSym,
      redactFmtSym,
      serializersSym,
      timeSym,
      timeSliceIndexSym,
      streamSym,
      stringifySym,
      stringifySafeSym,
      stringifiersSym,
      setLevelSym,
      endSym,
      formatOptsSym,
      messageKeySym,
      errorKeySym,
      nestedKeySym,
      mixinSym,
      levelCompSym,
      useOnlyCustomLevelsSym,
      formattersSym,
      hooksSym,
      nestedKeyStrSym,
      mixinMergeStrategySym,
      msgPrefixSym
    } = symbols;
    var { epochTime, nullTime } = time;
    var { pid } = process;
    var hostname = os.hostname();
    var defaultErrorSerializer = stdSerializers.err;
    var defaultOptions = {
      level: "info",
      levelComparison: SORTING_ORDER.ASC,
      levels: DEFAULT_LEVELS,
      messageKey: "msg",
      errorKey: "err",
      nestedKey: null,
      enabled: true,
      base: { pid, hostname },
      serializers: Object.assign(/* @__PURE__ */ Object.create(null), {
        err: defaultErrorSerializer
      }),
      formatters: Object.assign(/* @__PURE__ */ Object.create(null), {
        bindings(bindings) {
          return bindings;
        },
        level(label, number) {
          return { level: number };
        }
      }),
      hooks: {
        logMethod: void 0
      },
      timestamp: epochTime,
      name: void 0,
      redact: null,
      customLevels: null,
      useOnlyCustomLevels: false,
      depthLimit: 5,
      edgeLimit: 100
    };
    var normalize = createArgsNormalizer(defaultOptions);
    var serializers = Object.assign(/* @__PURE__ */ Object.create(null), stdSerializers);
    function pino2(...args) {
      const instance = {};
      const { opts, stream } = normalize(instance, caller(), ...args);
      const {
        redact,
        crlf,
        serializers: serializers2,
        timestamp,
        messageKey,
        errorKey,
        nestedKey,
        base,
        name,
        level,
        customLevels,
        levelComparison,
        mixin,
        mixinMergeStrategy,
        useOnlyCustomLevels,
        formatters,
        hooks,
        depthLimit,
        edgeLimit,
        onChild,
        msgPrefix
      } = opts;
      const stringifySafe = configure({
        maximumDepth: depthLimit,
        maximumBreadth: edgeLimit
      });
      const allFormatters = buildFormatters(
        formatters.level,
        formatters.bindings,
        formatters.log
      );
      const stringifyFn = stringify.bind({
        [stringifySafeSym]: stringifySafe
      });
      const stringifiers = redact ? redaction(redact, stringifyFn) : {};
      const formatOpts = redact ? { stringify: stringifiers[redactFmtSym] } : { stringify: stringifyFn };
      const end = "}" + (crlf ? "\r\n" : "\n");
      const coreChindings = asChindings.bind(null, {
        [chindingsSym]: "",
        [serializersSym]: serializers2,
        [stringifiersSym]: stringifiers,
        [stringifySym]: stringify,
        [stringifySafeSym]: stringifySafe,
        [formattersSym]: allFormatters
      });
      let chindings = "";
      if (base !== null) {
        if (name === void 0) {
          chindings = coreChindings(base);
        } else {
          chindings = coreChindings(Object.assign({}, base, { name }));
        }
      }
      const time2 = timestamp instanceof Function ? timestamp : timestamp ? epochTime : nullTime;
      const timeSliceIndex = time2().indexOf(":") + 1;
      if (useOnlyCustomLevels && !customLevels)
        throw Error("customLevels is required if useOnlyCustomLevels is set true");
      if (mixin && typeof mixin !== "function")
        throw Error(`Unknown mixin type "${typeof mixin}" - expected "function"`);
      if (msgPrefix && typeof msgPrefix !== "string")
        throw Error(`Unknown msgPrefix type "${typeof msgPrefix}" - expected "string"`);
      assertDefaultLevelFound(level, customLevels, useOnlyCustomLevels);
      const levels = mappings(customLevels, useOnlyCustomLevels);
      if (typeof stream.emit === "function") {
        stream.emit("message", { code: "PINO_CONFIG", config: { levels, messageKey, errorKey } });
      }
      assertLevelComparison(levelComparison);
      const levelCompFunc = genLevelComparison(levelComparison);
      Object.assign(instance, {
        levels,
        [levelCompSym]: levelCompFunc,
        [useOnlyCustomLevelsSym]: useOnlyCustomLevels,
        [streamSym]: stream,
        [timeSym]: time2,
        [timeSliceIndexSym]: timeSliceIndex,
        [stringifySym]: stringify,
        [stringifySafeSym]: stringifySafe,
        [stringifiersSym]: stringifiers,
        [endSym]: end,
        [formatOptsSym]: formatOpts,
        [messageKeySym]: messageKey,
        [errorKeySym]: errorKey,
        [nestedKeySym]: nestedKey,
        // protect against injection
        [nestedKeyStrSym]: nestedKey ? `,${JSON.stringify(nestedKey)}:{` : "",
        [serializersSym]: serializers2,
        [mixinSym]: mixin,
        [mixinMergeStrategySym]: mixinMergeStrategy,
        [chindingsSym]: chindings,
        [formattersSym]: allFormatters,
        [hooksSym]: hooks,
        silent: noop,
        onChild,
        [msgPrefixSym]: msgPrefix
      });
      Object.setPrototypeOf(instance, proto());
      genLsCache(instance);
      instance[setLevelSym](level);
      return instance;
    }
    module2.exports = pino2;
    module2.exports.destination = (dest = process.stdout.fd) => {
      if (typeof dest === "object") {
        dest.dest = normalizeDestFileDescriptor(dest.dest || process.stdout.fd);
        return buildSafeSonicBoom(dest);
      } else {
        return buildSafeSonicBoom({ dest: normalizeDestFileDescriptor(dest), minLength: 0 });
      }
    };
    module2.exports.transport = require_transport();
    module2.exports.multistream = require_multistream();
    module2.exports.levels = mappings();
    module2.exports.stdSerializers = serializers;
    module2.exports.stdTimeFunctions = Object.assign({}, time);
    module2.exports.symbols = symbols;
    module2.exports.version = version;
    module2.exports.default = pino2;
    module2.exports.pino = pino2;
  }
});

// node_modules/requires-port/index.js
var require_requires_port = __commonJS({
  "node_modules/requires-port/index.js"(exports2, module2) {
    "use strict";
    module2.exports = function required(port, protocol) {
      protocol = protocol.split(":")[0];
      port = +port;
      if (!port)
        return false;
      switch (protocol) {
        case "http":
        case "ws":
          return port !== 80;
        case "https":
        case "wss":
          return port !== 443;
        case "ftp":
          return port !== 21;
        case "gopher":
          return port !== 70;
        case "file":
          return false;
      }
      return port !== 0;
    };
  }
});

// node_modules/querystringify/index.js
var require_querystringify = __commonJS({
  "node_modules/querystringify/index.js"(exports2) {
    "use strict";
    var has = Object.prototype.hasOwnProperty;
    var undef;
    function decode(input) {
      try {
        return decodeURIComponent(input.replace(/\+/g, " "));
      } catch (e) {
        return null;
      }
    }
    function encode(input) {
      try {
        return encodeURIComponent(input);
      } catch (e) {
        return null;
      }
    }
    function querystring(query) {
      var parser = /([^=?#&]+)=?([^&]*)/g, result = {}, part;
      while (part = parser.exec(query)) {
        var key = decode(part[1]), value = decode(part[2]);
        if (key === null || value === null || key in result)
          continue;
        result[key] = value;
      }
      return result;
    }
    function querystringify(obj, prefix) {
      prefix = prefix || "";
      var pairs = [], value, key;
      if ("string" !== typeof prefix)
        prefix = "?";
      for (key in obj) {
        if (has.call(obj, key)) {
          value = obj[key];
          if (!value && (value === null || value === undef || isNaN(value))) {
            value = "";
          }
          key = encode(key);
          value = encode(value);
          if (key === null || value === null)
            continue;
          pairs.push(key + "=" + value);
        }
      }
      return pairs.length ? prefix + pairs.join("&") : "";
    }
    exports2.stringify = querystringify;
    exports2.parse = querystring;
  }
});

// node_modules/url-parse/index.js
var require_url_parse = __commonJS({
  "node_modules/url-parse/index.js"(exports2, module2) {
    "use strict";
    var required = require_requires_port();
    var qs = require_querystringify();
    var controlOrWhitespace = /^[\x00-\x20\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/;
    var CRHTLF = /[\n\r\t]/g;
    var slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//;
    var port = /:\d+$/;
    var protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\\/]+)?([\S\s]*)/i;
    var windowsDriveLetter = /^[a-zA-Z]:/;
    function trimLeft(str) {
      return (str ? str : "").toString().replace(controlOrWhitespace, "");
    }
    var rules = [
      ["#", "hash"],
      // Extract from the back.
      ["?", "query"],
      // Extract from the back.
      function sanitize(address, url) {
        return isSpecial(url.protocol) ? address.replace(/\\/g, "/") : address;
      },
      ["/", "pathname"],
      // Extract from the back.
      ["@", "auth", 1],
      // Extract from the front.
      [NaN, "host", void 0, 1, 1],
      // Set left over value.
      [/:(\d*)$/, "port", void 0, 1],
      // RegExp the back.
      [NaN, "hostname", void 0, 1, 1]
      // Set left over.
    ];
    var ignore = { hash: 1, query: 1 };
    function lolcation(loc) {
      var globalVar;
      if (typeof window !== "undefined")
        globalVar = window;
      else if (typeof global !== "undefined")
        globalVar = global;
      else if (typeof self !== "undefined")
        globalVar = self;
      else
        globalVar = {};
      var location = globalVar.location || {};
      loc = loc || location;
      var finaldestination = {}, type = typeof loc, key;
      if ("blob:" === loc.protocol) {
        finaldestination = new Url(unescape(loc.pathname), {});
      } else if ("string" === type) {
        finaldestination = new Url(loc, {});
        for (key in ignore)
          delete finaldestination[key];
      } else if ("object" === type) {
        for (key in loc) {
          if (key in ignore)
            continue;
          finaldestination[key] = loc[key];
        }
        if (finaldestination.slashes === void 0) {
          finaldestination.slashes = slashes.test(loc.href);
        }
      }
      return finaldestination;
    }
    function isSpecial(scheme) {
      return scheme === "file:" || scheme === "ftp:" || scheme === "http:" || scheme === "https:" || scheme === "ws:" || scheme === "wss:";
    }
    function extractProtocol(address, location) {
      address = trimLeft(address);
      address = address.replace(CRHTLF, "");
      location = location || {};
      var match = protocolre.exec(address);
      var protocol = match[1] ? match[1].toLowerCase() : "";
      var forwardSlashes = !!match[2];
      var otherSlashes = !!match[3];
      var slashesCount = 0;
      var rest;
      if (forwardSlashes) {
        if (otherSlashes) {
          rest = match[2] + match[3] + match[4];
          slashesCount = match[2].length + match[3].length;
        } else {
          rest = match[2] + match[4];
          slashesCount = match[2].length;
        }
      } else {
        if (otherSlashes) {
          rest = match[3] + match[4];
          slashesCount = match[3].length;
        } else {
          rest = match[4];
        }
      }
      if (protocol === "file:") {
        if (slashesCount >= 2) {
          rest = rest.slice(2);
        }
      } else if (isSpecial(protocol)) {
        rest = match[4];
      } else if (protocol) {
        if (forwardSlashes) {
          rest = rest.slice(2);
        }
      } else if (slashesCount >= 2 && isSpecial(location.protocol)) {
        rest = match[4];
      }
      return {
        protocol,
        slashes: forwardSlashes || isSpecial(protocol),
        slashesCount,
        rest
      };
    }
    function resolve(relative, base) {
      if (relative === "")
        return base;
      var path = (base || "/").split("/").slice(0, -1).concat(relative.split("/")), i = path.length, last = path[i - 1], unshift = false, up = 0;
      while (i--) {
        if (path[i] === ".") {
          path.splice(i, 1);
        } else if (path[i] === "..") {
          path.splice(i, 1);
          up++;
        } else if (up) {
          if (i === 0)
            unshift = true;
          path.splice(i, 1);
          up--;
        }
      }
      if (unshift)
        path.unshift("");
      if (last === "." || last === "..")
        path.push("");
      return path.join("/");
    }
    function Url(address, location, parser) {
      address = trimLeft(address);
      address = address.replace(CRHTLF, "");
      if (!(this instanceof Url)) {
        return new Url(address, location, parser);
      }
      var relative, extracted, parse, instruction, index, key, instructions = rules.slice(), type = typeof location, url = this, i = 0;
      if ("object" !== type && "string" !== type) {
        parser = location;
        location = null;
      }
      if (parser && "function" !== typeof parser)
        parser = qs.parse;
      location = lolcation(location);
      extracted = extractProtocol(address || "", location);
      relative = !extracted.protocol && !extracted.slashes;
      url.slashes = extracted.slashes || relative && location.slashes;
      url.protocol = extracted.protocol || location.protocol || "";
      address = extracted.rest;
      if (extracted.protocol === "file:" && (extracted.slashesCount !== 2 || windowsDriveLetter.test(address)) || !extracted.slashes && (extracted.protocol || extracted.slashesCount < 2 || !isSpecial(url.protocol))) {
        instructions[3] = [/(.*)/, "pathname"];
      }
      for (; i < instructions.length; i++) {
        instruction = instructions[i];
        if (typeof instruction === "function") {
          address = instruction(address, url);
          continue;
        }
        parse = instruction[0];
        key = instruction[1];
        if (parse !== parse) {
          url[key] = address;
        } else if ("string" === typeof parse) {
          index = parse === "@" ? address.lastIndexOf(parse) : address.indexOf(parse);
          if (~index) {
            if ("number" === typeof instruction[2]) {
              url[key] = address.slice(0, index);
              address = address.slice(index + instruction[2]);
            } else {
              url[key] = address.slice(index);
              address = address.slice(0, index);
            }
          }
        } else if (index = parse.exec(address)) {
          url[key] = index[1];
          address = address.slice(0, index.index);
        }
        url[key] = url[key] || (relative && instruction[3] ? location[key] || "" : "");
        if (instruction[4])
          url[key] = url[key].toLowerCase();
      }
      if (parser)
        url.query = parser(url.query);
      if (relative && location.slashes && url.pathname.charAt(0) !== "/" && (url.pathname !== "" || location.pathname !== "")) {
        url.pathname = resolve(url.pathname, location.pathname);
      }
      if (url.pathname.charAt(0) !== "/" && isSpecial(url.protocol)) {
        url.pathname = "/" + url.pathname;
      }
      if (!required(url.port, url.protocol)) {
        url.host = url.hostname;
        url.port = "";
      }
      url.username = url.password = "";
      if (url.auth) {
        index = url.auth.indexOf(":");
        if (~index) {
          url.username = url.auth.slice(0, index);
          url.username = encodeURIComponent(decodeURIComponent(url.username));
          url.password = url.auth.slice(index + 1);
          url.password = encodeURIComponent(decodeURIComponent(url.password));
        } else {
          url.username = encodeURIComponent(decodeURIComponent(url.auth));
        }
        url.auth = url.password ? url.username + ":" + url.password : url.username;
      }
      url.origin = url.protocol !== "file:" && isSpecial(url.protocol) && url.host ? url.protocol + "//" + url.host : "null";
      url.href = url.toString();
    }
    function set(part, value, fn) {
      var url = this;
      switch (part) {
        case "query":
          if ("string" === typeof value && value.length) {
            value = (fn || qs.parse)(value);
          }
          url[part] = value;
          break;
        case "port":
          url[part] = value;
          if (!required(value, url.protocol)) {
            url.host = url.hostname;
            url[part] = "";
          } else if (value) {
            url.host = url.hostname + ":" + value;
          }
          break;
        case "hostname":
          url[part] = value;
          if (url.port)
            value += ":" + url.port;
          url.host = value;
          break;
        case "host":
          url[part] = value;
          if (port.test(value)) {
            value = value.split(":");
            url.port = value.pop();
            url.hostname = value.join(":");
          } else {
            url.hostname = value;
            url.port = "";
          }
          break;
        case "protocol":
          url.protocol = value.toLowerCase();
          url.slashes = !fn;
          break;
        case "pathname":
        case "hash":
          if (value) {
            var char = part === "pathname" ? "/" : "#";
            url[part] = value.charAt(0) !== char ? char + value : value;
          } else {
            url[part] = value;
          }
          break;
        case "username":
        case "password":
          url[part] = encodeURIComponent(value);
          break;
        case "auth":
          var index = value.indexOf(":");
          if (~index) {
            url.username = value.slice(0, index);
            url.username = encodeURIComponent(decodeURIComponent(url.username));
            url.password = value.slice(index + 1);
            url.password = encodeURIComponent(decodeURIComponent(url.password));
          } else {
            url.username = encodeURIComponent(decodeURIComponent(value));
          }
      }
      for (var i = 0; i < rules.length; i++) {
        var ins = rules[i];
        if (ins[4])
          url[ins[1]] = url[ins[1]].toLowerCase();
      }
      url.auth = url.password ? url.username + ":" + url.password : url.username;
      url.origin = url.protocol !== "file:" && isSpecial(url.protocol) && url.host ? url.protocol + "//" + url.host : "null";
      url.href = url.toString();
      return url;
    }
    function toString(stringify) {
      if (!stringify || "function" !== typeof stringify)
        stringify = qs.stringify;
      var query, url = this, host = url.host, protocol = url.protocol;
      if (protocol && protocol.charAt(protocol.length - 1) !== ":")
        protocol += ":";
      var result = protocol + (url.protocol && url.slashes || isSpecial(url.protocol) ? "//" : "");
      if (url.username) {
        result += url.username;
        if (url.password)
          result += ":" + url.password;
        result += "@";
      } else if (url.password) {
        result += ":" + url.password;
        result += "@";
      } else if (url.protocol !== "file:" && isSpecial(url.protocol) && !host && url.pathname !== "/") {
        result += "@";
      }
      if (host[host.length - 1] === ":" || port.test(url.hostname) && !url.port) {
        host += ":";
      }
      result += host + url.pathname;
      query = "object" === typeof url.query ? stringify(url.query) : url.query;
      if (query)
        result += "?" !== query.charAt(0) ? "?" + query : query;
      if (url.hash)
        result += url.hash;
      return result;
    }
    Url.prototype = { set, toString };
    Url.extractProtocol = extractProtocol;
    Url.location = lolcation;
    Url.trimLeft = trimLeft;
    Url.qs = qs;
    module2.exports = Url;
  }
});

// node_modules/psl/dist/psl.cjs
var require_psl = __commonJS({
  "node_modules/psl/dist/psl.cjs"(exports2) {
    "use strict";
    Object.defineProperties(exports2, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
    function K(e) {
      return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
    }
    var O;
    var F;
    function Q() {
      if (F)
        return O;
      F = 1;
      const e = 2147483647, s = 36, c = 1, o = 26, t = 38, d = 700, z = 72, y = 128, g = "-", P = /^xn--/, V = /[^\0-\x7F]/, G = /[\x2E\u3002\uFF0E\uFF61]/g, W = { overflow: "Overflow: input needs wider integers to process", "not-basic": "Illegal input >= 0x80 (not a basic code point)", "invalid-input": "Invalid input" }, C = s - c, h = Math.floor, I = String.fromCharCode;
      function v(a) {
        throw new RangeError(W[a]);
      }
      function U(a, i) {
        const m = [];
        let n = a.length;
        for (; n--; )
          m[n] = i(a[n]);
        return m;
      }
      function S(a, i) {
        const m = a.split("@");
        let n = "";
        m.length > 1 && (n = m[0] + "@", a = m[1]), a = a.replace(G, ".");
        const r = a.split("."), p = U(r, i).join(".");
        return n + p;
      }
      function L(a) {
        const i = [];
        let m = 0;
        const n = a.length;
        for (; m < n; ) {
          const r = a.charCodeAt(m++);
          if (r >= 55296 && r <= 56319 && m < n) {
            const p = a.charCodeAt(m++);
            (p & 64512) == 56320 ? i.push(((r & 1023) << 10) + (p & 1023) + 65536) : (i.push(r), m--);
          } else
            i.push(r);
        }
        return i;
      }
      const $ = (a) => String.fromCodePoint(...a), J = function(a) {
        return a >= 48 && a < 58 ? 26 + (a - 48) : a >= 65 && a < 91 ? a - 65 : a >= 97 && a < 123 ? a - 97 : s;
      }, D = function(a, i) {
        return a + 22 + 75 * (a < 26) - ((i != 0) << 5);
      }, T = function(a, i, m) {
        let n = 0;
        for (a = m ? h(a / d) : a >> 1, a += h(a / i); a > C * o >> 1; n += s)
          a = h(a / C);
        return h(n + (C + 1) * a / (a + t));
      }, E = function(a) {
        const i = [], m = a.length;
        let n = 0, r = y, p = z, j = a.lastIndexOf(g);
        j < 0 && (j = 0);
        for (let u = 0; u < j; ++u)
          a.charCodeAt(u) >= 128 && v("not-basic"), i.push(a.charCodeAt(u));
        for (let u = j > 0 ? j + 1 : 0; u < m; ) {
          const k = n;
          for (let l = 1, b = s; ; b += s) {
            u >= m && v("invalid-input");
            const w = J(a.charCodeAt(u++));
            w >= s && v("invalid-input"), w > h((e - n) / l) && v("overflow"), n += w * l;
            const x = b <= p ? c : b >= p + o ? o : b - p;
            if (w < x)
              break;
            const q = s - x;
            l > h(e / q) && v("overflow"), l *= q;
          }
          const f = i.length + 1;
          p = T(n - k, f, k == 0), h(n / f) > e - r && v("overflow"), r += h(n / f), n %= f, i.splice(n++, 0, r);
        }
        return String.fromCodePoint(...i);
      }, B = function(a) {
        const i = [];
        a = L(a);
        const m = a.length;
        let n = y, r = 0, p = z;
        for (const k of a)
          k < 128 && i.push(I(k));
        const j = i.length;
        let u = j;
        for (j && i.push(g); u < m; ) {
          let k = e;
          for (const l of a)
            l >= n && l < k && (k = l);
          const f = u + 1;
          k - n > h((e - r) / f) && v("overflow"), r += (k - n) * f, n = k;
          for (const l of a)
            if (l < n && ++r > e && v("overflow"), l === n) {
              let b = r;
              for (let w = s; ; w += s) {
                const x = w <= p ? c : w >= p + o ? o : w - p;
                if (b < x)
                  break;
                const q = b - x, M = s - x;
                i.push(I(D(x + q % M, 0))), b = h(q / M);
              }
              i.push(I(D(b, 0))), p = T(r, f, u === j), r = 0, ++u;
            }
          ++r, ++n;
        }
        return i.join("");
      };
      return O = { version: "2.3.1", ucs2: { decode: L, encode: $ }, decode: E, encode: B, toASCII: function(a) {
        return S(a, function(i) {
          return V.test(i) ? "xn--" + B(i) : i;
        });
      }, toUnicode: function(a) {
        return S(a, function(i) {
          return P.test(i) ? E(i.slice(4).toLowerCase()) : i;
        });
      } }, O;
    }
    var X = Q();
    var A = K(X);
    var Y = ["ac", "com.ac", "edu.ac", "gov.ac", "mil.ac", "net.ac", "org.ac", "ad", "ae", "ac.ae", "co.ae", "gov.ae", "mil.ae", "net.ae", "org.ae", "sch.ae", "aero", "airline.aero", "airport.aero", "accident-investigation.aero", "accident-prevention.aero", "aerobatic.aero", "aeroclub.aero", "aerodrome.aero", "agents.aero", "air-surveillance.aero", "air-traffic-control.aero", "aircraft.aero", "airtraffic.aero", "ambulance.aero", "association.aero", "author.aero", "ballooning.aero", "broker.aero", "caa.aero", "cargo.aero", "catering.aero", "certification.aero", "championship.aero", "charter.aero", "civilaviation.aero", "club.aero", "conference.aero", "consultant.aero", "consulting.aero", "control.aero", "council.aero", "crew.aero", "design.aero", "dgca.aero", "educator.aero", "emergency.aero", "engine.aero", "engineer.aero", "entertainment.aero", "equipment.aero", "exchange.aero", "express.aero", "federation.aero", "flight.aero", "freight.aero", "fuel.aero", "gliding.aero", "government.aero", "groundhandling.aero", "group.aero", "hanggliding.aero", "homebuilt.aero", "insurance.aero", "journal.aero", "journalist.aero", "leasing.aero", "logistics.aero", "magazine.aero", "maintenance.aero", "marketplace.aero", "media.aero", "microlight.aero", "modelling.aero", "navigation.aero", "parachuting.aero", "paragliding.aero", "passenger-association.aero", "pilot.aero", "press.aero", "production.aero", "recreation.aero", "repbody.aero", "res.aero", "research.aero", "rotorcraft.aero", "safety.aero", "scientist.aero", "services.aero", "show.aero", "skydiving.aero", "software.aero", "student.aero", "taxi.aero", "trader.aero", "trading.aero", "trainer.aero", "union.aero", "workinggroup.aero", "works.aero", "af", "com.af", "edu.af", "gov.af", "net.af", "org.af", "ag", "co.ag", "com.ag", "net.ag", "nom.ag", "org.ag", "ai", "com.ai", "net.ai", "off.ai", "org.ai", "al", "com.al", "edu.al", "gov.al", "mil.al", "net.al", "org.al", "am", "co.am", "com.am", "commune.am", "net.am", "org.am", "ao", "co.ao", "ed.ao", "edu.ao", "gov.ao", "gv.ao", "it.ao", "og.ao", "org.ao", "pb.ao", "aq", "ar", "bet.ar", "com.ar", "coop.ar", "edu.ar", "gob.ar", "gov.ar", "int.ar", "mil.ar", "musica.ar", "mutual.ar", "net.ar", "org.ar", "senasa.ar", "tur.ar", "arpa", "e164.arpa", "home.arpa", "in-addr.arpa", "ip6.arpa", "iris.arpa", "uri.arpa", "urn.arpa", "as", "gov.as", "asia", "at", "ac.at", "sth.ac.at", "co.at", "gv.at", "or.at", "au", "asn.au", "com.au", "edu.au", "gov.au", "id.au", "net.au", "org.au", "conf.au", "oz.au", "act.au", "nsw.au", "nt.au", "qld.au", "sa.au", "tas.au", "vic.au", "wa.au", "act.edu.au", "catholic.edu.au", "nsw.edu.au", "nt.edu.au", "qld.edu.au", "sa.edu.au", "tas.edu.au", "vic.edu.au", "wa.edu.au", "qld.gov.au", "sa.gov.au", "tas.gov.au", "vic.gov.au", "wa.gov.au", "schools.nsw.edu.au", "aw", "com.aw", "ax", "az", "biz.az", "com.az", "edu.az", "gov.az", "info.az", "int.az", "mil.az", "name.az", "net.az", "org.az", "pp.az", "pro.az", "ba", "com.ba", "edu.ba", "gov.ba", "mil.ba", "net.ba", "org.ba", "bb", "biz.bb", "co.bb", "com.bb", "edu.bb", "gov.bb", "info.bb", "net.bb", "org.bb", "store.bb", "tv.bb", "*.bd", "be", "ac.be", "bf", "gov.bf", "bg", "0.bg", "1.bg", "2.bg", "3.bg", "4.bg", "5.bg", "6.bg", "7.bg", "8.bg", "9.bg", "a.bg", "b.bg", "c.bg", "d.bg", "e.bg", "f.bg", "g.bg", "h.bg", "i.bg", "j.bg", "k.bg", "l.bg", "m.bg", "n.bg", "o.bg", "p.bg", "q.bg", "r.bg", "s.bg", "t.bg", "u.bg", "v.bg", "w.bg", "x.bg", "y.bg", "z.bg", "bh", "com.bh", "edu.bh", "gov.bh", "net.bh", "org.bh", "bi", "co.bi", "com.bi", "edu.bi", "or.bi", "org.bi", "biz", "bj", "africa.bj", "agro.bj", "architectes.bj", "assur.bj", "avocats.bj", "co.bj", "com.bj", "eco.bj", "econo.bj", "edu.bj", "info.bj", "loisirs.bj", "money.bj", "net.bj", "org.bj", "ote.bj", "restaurant.bj", "resto.bj", "tourism.bj", "univ.bj", "bm", "com.bm", "edu.bm", "gov.bm", "net.bm", "org.bm", "bn", "com.bn", "edu.bn", "gov.bn", "net.bn", "org.bn", "bo", "com.bo", "edu.bo", "gob.bo", "int.bo", "mil.bo", "net.bo", "org.bo", "tv.bo", "web.bo", "academia.bo", "agro.bo", "arte.bo", "blog.bo", "bolivia.bo", "ciencia.bo", "cooperativa.bo", "democracia.bo", "deporte.bo", "ecologia.bo", "economia.bo", "empresa.bo", "indigena.bo", "industria.bo", "info.bo", "medicina.bo", "movimiento.bo", "musica.bo", "natural.bo", "nombre.bo", "noticias.bo", "patria.bo", "plurinacional.bo", "politica.bo", "profesional.bo", "pueblo.bo", "revista.bo", "salud.bo", "tecnologia.bo", "tksat.bo", "transporte.bo", "wiki.bo", "br", "9guacu.br", "abc.br", "adm.br", "adv.br", "agr.br", "aju.br", "am.br", "anani.br", "aparecida.br", "app.br", "arq.br", "art.br", "ato.br", "b.br", "barueri.br", "belem.br", "bet.br", "bhz.br", "bib.br", "bio.br", "blog.br", "bmd.br", "boavista.br", "bsb.br", "campinagrande.br", "campinas.br", "caxias.br", "cim.br", "cng.br", "cnt.br", "com.br", "contagem.br", "coop.br", "coz.br", "cri.br", "cuiaba.br", "curitiba.br", "def.br", "des.br", "det.br", "dev.br", "ecn.br", "eco.br", "edu.br", "emp.br", "enf.br", "eng.br", "esp.br", "etc.br", "eti.br", "far.br", "feira.br", "flog.br", "floripa.br", "fm.br", "fnd.br", "fortal.br", "fot.br", "foz.br", "fst.br", "g12.br", "geo.br", "ggf.br", "goiania.br", "gov.br", "ac.gov.br", "al.gov.br", "am.gov.br", "ap.gov.br", "ba.gov.br", "ce.gov.br", "df.gov.br", "es.gov.br", "go.gov.br", "ma.gov.br", "mg.gov.br", "ms.gov.br", "mt.gov.br", "pa.gov.br", "pb.gov.br", "pe.gov.br", "pi.gov.br", "pr.gov.br", "rj.gov.br", "rn.gov.br", "ro.gov.br", "rr.gov.br", "rs.gov.br", "sc.gov.br", "se.gov.br", "sp.gov.br", "to.gov.br", "gru.br", "imb.br", "ind.br", "inf.br", "jab.br", "jampa.br", "jdf.br", "joinville.br", "jor.br", "jus.br", "leg.br", "leilao.br", "lel.br", "log.br", "londrina.br", "macapa.br", "maceio.br", "manaus.br", "maringa.br", "mat.br", "med.br", "mil.br", "morena.br", "mp.br", "mus.br", "natal.br", "net.br", "niteroi.br", "*.nom.br", "not.br", "ntr.br", "odo.br", "ong.br", "org.br", "osasco.br", "palmas.br", "poa.br", "ppg.br", "pro.br", "psc.br", "psi.br", "pvh.br", "qsl.br", "radio.br", "rec.br", "recife.br", "rep.br", "ribeirao.br", "rio.br", "riobranco.br", "riopreto.br", "salvador.br", "sampa.br", "santamaria.br", "santoandre.br", "saobernardo.br", "saogonca.br", "seg.br", "sjc.br", "slg.br", "slz.br", "sorocaba.br", "srv.br", "taxi.br", "tc.br", "tec.br", "teo.br", "the.br", "tmp.br", "trd.br", "tur.br", "tv.br", "udi.br", "vet.br", "vix.br", "vlog.br", "wiki.br", "zlg.br", "bs", "com.bs", "edu.bs", "gov.bs", "net.bs", "org.bs", "bt", "com.bt", "edu.bt", "gov.bt", "net.bt", "org.bt", "bv", "bw", "co.bw", "org.bw", "by", "gov.by", "mil.by", "com.by", "of.by", "bz", "co.bz", "com.bz", "edu.bz", "gov.bz", "net.bz", "org.bz", "ca", "ab.ca", "bc.ca", "mb.ca", "nb.ca", "nf.ca", "nl.ca", "ns.ca", "nt.ca", "nu.ca", "on.ca", "pe.ca", "qc.ca", "sk.ca", "yk.ca", "gc.ca", "cat", "cc", "cd", "gov.cd", "cf", "cg", "ch", "ci", "ac.ci", "a\xE9roport.ci", "asso.ci", "co.ci", "com.ci", "ed.ci", "edu.ci", "go.ci", "gouv.ci", "int.ci", "net.ci", "or.ci", "org.ci", "*.ck", "!www.ck", "cl", "co.cl", "gob.cl", "gov.cl", "mil.cl", "cm", "co.cm", "com.cm", "gov.cm", "net.cm", "cn", "ac.cn", "com.cn", "edu.cn", "gov.cn", "mil.cn", "net.cn", "org.cn", "\u516C\u53F8.cn", "\u7DB2\u7D61.cn", "\u7F51\u7EDC.cn", "ah.cn", "bj.cn", "cq.cn", "fj.cn", "gd.cn", "gs.cn", "gx.cn", "gz.cn", "ha.cn", "hb.cn", "he.cn", "hi.cn", "hk.cn", "hl.cn", "hn.cn", "jl.cn", "js.cn", "jx.cn", "ln.cn", "mo.cn", "nm.cn", "nx.cn", "qh.cn", "sc.cn", "sd.cn", "sh.cn", "sn.cn", "sx.cn", "tj.cn", "tw.cn", "xj.cn", "xz.cn", "yn.cn", "zj.cn", "co", "com.co", "edu.co", "gov.co", "mil.co", "net.co", "nom.co", "org.co", "com", "coop", "cr", "ac.cr", "co.cr", "ed.cr", "fi.cr", "go.cr", "or.cr", "sa.cr", "cu", "com.cu", "edu.cu", "gob.cu", "inf.cu", "nat.cu", "net.cu", "org.cu", "cv", "com.cv", "edu.cv", "id.cv", "int.cv", "net.cv", "nome.cv", "org.cv", "publ.cv", "cw", "com.cw", "edu.cw", "net.cw", "org.cw", "cx", "gov.cx", "cy", "ac.cy", "biz.cy", "com.cy", "ekloges.cy", "gov.cy", "ltd.cy", "mil.cy", "net.cy", "org.cy", "press.cy", "pro.cy", "tm.cy", "cz", "de", "dj", "dk", "dm", "co.dm", "com.dm", "edu.dm", "gov.dm", "net.dm", "org.dm", "do", "art.do", "com.do", "edu.do", "gob.do", "gov.do", "mil.do", "net.do", "org.do", "sld.do", "web.do", "dz", "art.dz", "asso.dz", "com.dz", "edu.dz", "gov.dz", "net.dz", "org.dz", "pol.dz", "soc.dz", "tm.dz", "ec", "com.ec", "edu.ec", "fin.ec", "gob.ec", "gov.ec", "info.ec", "k12.ec", "med.ec", "mil.ec", "net.ec", "org.ec", "pro.ec", "edu", "ee", "aip.ee", "com.ee", "edu.ee", "fie.ee", "gov.ee", "lib.ee", "med.ee", "org.ee", "pri.ee", "riik.ee", "eg", "ac.eg", "com.eg", "edu.eg", "eun.eg", "gov.eg", "info.eg", "me.eg", "mil.eg", "name.eg", "net.eg", "org.eg", "sci.eg", "sport.eg", "tv.eg", "*.er", "es", "com.es", "edu.es", "gob.es", "nom.es", "org.es", "et", "biz.et", "com.et", "edu.et", "gov.et", "info.et", "name.et", "net.et", "org.et", "eu", "fi", "aland.fi", "fj", "ac.fj", "biz.fj", "com.fj", "gov.fj", "info.fj", "mil.fj", "name.fj", "net.fj", "org.fj", "pro.fj", "*.fk", "fm", "com.fm", "edu.fm", "net.fm", "org.fm", "fo", "fr", "asso.fr", "com.fr", "gouv.fr", "nom.fr", "prd.fr", "tm.fr", "avoues.fr", "cci.fr", "greta.fr", "huissier-justice.fr", "ga", "gb", "gd", "edu.gd", "gov.gd", "ge", "com.ge", "edu.ge", "gov.ge", "net.ge", "org.ge", "pvt.ge", "school.ge", "gf", "gg", "co.gg", "net.gg", "org.gg", "gh", "com.gh", "edu.gh", "gov.gh", "mil.gh", "org.gh", "gi", "com.gi", "edu.gi", "gov.gi", "ltd.gi", "mod.gi", "org.gi", "gl", "co.gl", "com.gl", "edu.gl", "net.gl", "org.gl", "gm", "gn", "ac.gn", "com.gn", "edu.gn", "gov.gn", "net.gn", "org.gn", "gov", "gp", "asso.gp", "com.gp", "edu.gp", "mobi.gp", "net.gp", "org.gp", "gq", "gr", "com.gr", "edu.gr", "gov.gr", "net.gr", "org.gr", "gs", "gt", "com.gt", "edu.gt", "gob.gt", "ind.gt", "mil.gt", "net.gt", "org.gt", "gu", "com.gu", "edu.gu", "gov.gu", "guam.gu", "info.gu", "net.gu", "org.gu", "web.gu", "gw", "gy", "co.gy", "com.gy", "edu.gy", "gov.gy", "net.gy", "org.gy", "hk", "com.hk", "edu.hk", "gov.hk", "idv.hk", "net.hk", "org.hk", "\u4E2A\u4EBA.hk", "\u500B\u4EBA.hk", "\u516C\u53F8.hk", "\u653F\u5E9C.hk", "\u654E\u80B2.hk", "\u6559\u80B2.hk", "\u7B87\u4EBA.hk", "\u7D44\u7E54.hk", "\u7D44\u7EC7.hk", "\u7DB2\u7D61.hk", "\u7DB2\u7EDC.hk", "\u7EC4\u7E54.hk", "\u7EC4\u7EC7.hk", "\u7F51\u7D61.hk", "\u7F51\u7EDC.hk", "hm", "hn", "com.hn", "edu.hn", "gob.hn", "mil.hn", "net.hn", "org.hn", "hr", "com.hr", "from.hr", "iz.hr", "name.hr", "ht", "adult.ht", "art.ht", "asso.ht", "com.ht", "coop.ht", "edu.ht", "firm.ht", "gouv.ht", "info.ht", "med.ht", "net.ht", "org.ht", "perso.ht", "pol.ht", "pro.ht", "rel.ht", "shop.ht", "hu", "2000.hu", "agrar.hu", "bolt.hu", "casino.hu", "city.hu", "co.hu", "erotica.hu", "erotika.hu", "film.hu", "forum.hu", "games.hu", "hotel.hu", "info.hu", "ingatlan.hu", "jogasz.hu", "konyvelo.hu", "lakas.hu", "media.hu", "news.hu", "org.hu", "priv.hu", "reklam.hu", "sex.hu", "shop.hu", "sport.hu", "suli.hu", "szex.hu", "tm.hu", "tozsde.hu", "utazas.hu", "video.hu", "id", "ac.id", "biz.id", "co.id", "desa.id", "go.id", "mil.id", "my.id", "net.id", "or.id", "ponpes.id", "sch.id", "web.id", "ie", "gov.ie", "il", "ac.il", "co.il", "gov.il", "idf.il", "k12.il", "muni.il", "net.il", "org.il", "\u05D9\u05E9\u05E8\u05D0\u05DC", "\u05D0\u05E7\u05D3\u05DE\u05D9\u05D4.\u05D9\u05E9\u05E8\u05D0\u05DC", "\u05D9\u05E9\u05D5\u05D1.\u05D9\u05E9\u05E8\u05D0\u05DC", "\u05E6\u05D4\u05DC.\u05D9\u05E9\u05E8\u05D0\u05DC", "\u05DE\u05DE\u05E9\u05DC.\u05D9\u05E9\u05E8\u05D0\u05DC", "im", "ac.im", "co.im", "ltd.co.im", "plc.co.im", "com.im", "net.im", "org.im", "tt.im", "tv.im", "in", "5g.in", "6g.in", "ac.in", "ai.in", "am.in", "bihar.in", "biz.in", "business.in", "ca.in", "cn.in", "co.in", "com.in", "coop.in", "cs.in", "delhi.in", "dr.in", "edu.in", "er.in", "firm.in", "gen.in", "gov.in", "gujarat.in", "ind.in", "info.in", "int.in", "internet.in", "io.in", "me.in", "mil.in", "net.in", "nic.in", "org.in", "pg.in", "post.in", "pro.in", "res.in", "travel.in", "tv.in", "uk.in", "up.in", "us.in", "info", "int", "eu.int", "io", "co.io", "com.io", "edu.io", "gov.io", "mil.io", "net.io", "nom.io", "org.io", "iq", "com.iq", "edu.iq", "gov.iq", "mil.iq", "net.iq", "org.iq", "ir", "ac.ir", "co.ir", "gov.ir", "id.ir", "net.ir", "org.ir", "sch.ir", "\u0627\u06CC\u0631\u0627\u0646.ir", "\u0627\u064A\u0631\u0627\u0646.ir", "is", "it", "edu.it", "gov.it", "abr.it", "abruzzo.it", "aosta-valley.it", "aostavalley.it", "bas.it", "basilicata.it", "cal.it", "calabria.it", "cam.it", "campania.it", "emilia-romagna.it", "emiliaromagna.it", "emr.it", "friuli-v-giulia.it", "friuli-ve-giulia.it", "friuli-vegiulia.it", "friuli-venezia-giulia.it", "friuli-veneziagiulia.it", "friuli-vgiulia.it", "friuliv-giulia.it", "friulive-giulia.it", "friulivegiulia.it", "friulivenezia-giulia.it", "friuliveneziagiulia.it", "friulivgiulia.it", "fvg.it", "laz.it", "lazio.it", "lig.it", "liguria.it", "lom.it", "lombardia.it", "lombardy.it", "lucania.it", "mar.it", "marche.it", "mol.it", "molise.it", "piedmont.it", "piemonte.it", "pmn.it", "pug.it", "puglia.it", "sar.it", "sardegna.it", "sardinia.it", "sic.it", "sicilia.it", "sicily.it", "taa.it", "tos.it", "toscana.it", "trentin-sud-tirol.it", "trentin-s\xFCd-tirol.it", "trentin-sudtirol.it", "trentin-s\xFCdtirol.it", "trentin-sued-tirol.it", "trentin-suedtirol.it", "trentino.it", "trentino-a-adige.it", "trentino-aadige.it", "trentino-alto-adige.it", "trentino-altoadige.it", "trentino-s-tirol.it", "trentino-stirol.it", "trentino-sud-tirol.it", "trentino-s\xFCd-tirol.it", "trentino-sudtirol.it", "trentino-s\xFCdtirol.it", "trentino-sued-tirol.it", "trentino-suedtirol.it", "trentinoa-adige.it", "trentinoaadige.it", "trentinoalto-adige.it", "trentinoaltoadige.it", "trentinos-tirol.it", "trentinostirol.it", "trentinosud-tirol.it", "trentinos\xFCd-tirol.it", "trentinosudtirol.it", "trentinos\xFCdtirol.it", "trentinosued-tirol.it", "trentinosuedtirol.it", "trentinsud-tirol.it", "trentins\xFCd-tirol.it", "trentinsudtirol.it", "trentins\xFCdtirol.it", "trentinsued-tirol.it", "trentinsuedtirol.it", "tuscany.it", "umb.it", "umbria.it", "val-d-aosta.it", "val-daosta.it", "vald-aosta.it", "valdaosta.it", "valle-aosta.it", "valle-d-aosta.it", "valle-daosta.it", "valleaosta.it", "valled-aosta.it", "valledaosta.it", "vallee-aoste.it", "vall\xE9e-aoste.it", "vallee-d-aoste.it", "vall\xE9e-d-aoste.it", "valleeaoste.it", "vall\xE9eaoste.it", "valleedaoste.it", "vall\xE9edaoste.it", "vao.it", "vda.it", "ven.it", "veneto.it", "ag.it", "agrigento.it", "al.it", "alessandria.it", "alto-adige.it", "altoadige.it", "an.it", "ancona.it", "andria-barletta-trani.it", "andria-trani-barletta.it", "andriabarlettatrani.it", "andriatranibarletta.it", "ao.it", "aosta.it", "aoste.it", "ap.it", "aq.it", "aquila.it", "ar.it", "arezzo.it", "ascoli-piceno.it", "ascolipiceno.it", "asti.it", "at.it", "av.it", "avellino.it", "ba.it", "balsan.it", "balsan-sudtirol.it", "balsan-s\xFCdtirol.it", "balsan-suedtirol.it", "bari.it", "barletta-trani-andria.it", "barlettatraniandria.it", "belluno.it", "benevento.it", "bergamo.it", "bg.it", "bi.it", "biella.it", "bl.it", "bn.it", "bo.it", "bologna.it", "bolzano.it", "bolzano-altoadige.it", "bozen.it", "bozen-sudtirol.it", "bozen-s\xFCdtirol.it", "bozen-suedtirol.it", "br.it", "brescia.it", "brindisi.it", "bs.it", "bt.it", "bulsan.it", "bulsan-sudtirol.it", "bulsan-s\xFCdtirol.it", "bulsan-suedtirol.it", "bz.it", "ca.it", "cagliari.it", "caltanissetta.it", "campidano-medio.it", "campidanomedio.it", "campobasso.it", "carbonia-iglesias.it", "carboniaiglesias.it", "carrara-massa.it", "carraramassa.it", "caserta.it", "catania.it", "catanzaro.it", "cb.it", "ce.it", "cesena-forli.it", "cesena-forl\xEC.it", "cesenaforli.it", "cesenaforl\xEC.it", "ch.it", "chieti.it", "ci.it", "cl.it", "cn.it", "co.it", "como.it", "cosenza.it", "cr.it", "cremona.it", "crotone.it", "cs.it", "ct.it", "cuneo.it", "cz.it", "dell-ogliastra.it", "dellogliastra.it", "en.it", "enna.it", "fc.it", "fe.it", "fermo.it", "ferrara.it", "fg.it", "fi.it", "firenze.it", "florence.it", "fm.it", "foggia.it", "forli-cesena.it", "forl\xEC-cesena.it", "forlicesena.it", "forl\xECcesena.it", "fr.it", "frosinone.it", "ge.it", "genoa.it", "genova.it", "go.it", "gorizia.it", "gr.it", "grosseto.it", "iglesias-carbonia.it", "iglesiascarbonia.it", "im.it", "imperia.it", "is.it", "isernia.it", "kr.it", "la-spezia.it", "laquila.it", "laspezia.it", "latina.it", "lc.it", "le.it", "lecce.it", "lecco.it", "li.it", "livorno.it", "lo.it", "lodi.it", "lt.it", "lu.it", "lucca.it", "macerata.it", "mantova.it", "massa-carrara.it", "massacarrara.it", "matera.it", "mb.it", "mc.it", "me.it", "medio-campidano.it", "mediocampidano.it", "messina.it", "mi.it", "milan.it", "milano.it", "mn.it", "mo.it", "modena.it", "monza.it", "monza-brianza.it", "monza-e-della-brianza.it", "monzabrianza.it", "monzaebrianza.it", "monzaedellabrianza.it", "ms.it", "mt.it", "na.it", "naples.it", "napoli.it", "no.it", "novara.it", "nu.it", "nuoro.it", "og.it", "ogliastra.it", "olbia-tempio.it", "olbiatempio.it", "or.it", "oristano.it", "ot.it", "pa.it", "padova.it", "padua.it", "palermo.it", "parma.it", "pavia.it", "pc.it", "pd.it", "pe.it", "perugia.it", "pesaro-urbino.it", "pesarourbino.it", "pescara.it", "pg.it", "pi.it", "piacenza.it", "pisa.it", "pistoia.it", "pn.it", "po.it", "pordenone.it", "potenza.it", "pr.it", "prato.it", "pt.it", "pu.it", "pv.it", "pz.it", "ra.it", "ragusa.it", "ravenna.it", "rc.it", "re.it", "reggio-calabria.it", "reggio-emilia.it", "reggiocalabria.it", "reggioemilia.it", "rg.it", "ri.it", "rieti.it", "rimini.it", "rm.it", "rn.it", "ro.it", "roma.it", "rome.it", "rovigo.it", "sa.it", "salerno.it", "sassari.it", "savona.it", "si.it", "siena.it", "siracusa.it", "so.it", "sondrio.it", "sp.it", "sr.it", "ss.it", "s\xFCdtirol.it", "suedtirol.it", "sv.it", "ta.it", "taranto.it", "te.it", "tempio-olbia.it", "tempioolbia.it", "teramo.it", "terni.it", "tn.it", "to.it", "torino.it", "tp.it", "tr.it", "trani-andria-barletta.it", "trani-barletta-andria.it", "traniandriabarletta.it", "tranibarlettaandria.it", "trapani.it", "trento.it", "treviso.it", "trieste.it", "ts.it", "turin.it", "tv.it", "ud.it", "udine.it", "urbino-pesaro.it", "urbinopesaro.it", "va.it", "varese.it", "vb.it", "vc.it", "ve.it", "venezia.it", "venice.it", "verbania.it", "vercelli.it", "verona.it", "vi.it", "vibo-valentia.it", "vibovalentia.it", "vicenza.it", "viterbo.it", "vr.it", "vs.it", "vt.it", "vv.it", "je", "co.je", "net.je", "org.je", "*.jm", "jo", "agri.jo", "ai.jo", "com.jo", "edu.jo", "eng.jo", "fm.jo", "gov.jo", "mil.jo", "net.jo", "org.jo", "per.jo", "phd.jo", "sch.jo", "tv.jo", "jobs", "jp", "ac.jp", "ad.jp", "co.jp", "ed.jp", "go.jp", "gr.jp", "lg.jp", "ne.jp", "or.jp", "aichi.jp", "akita.jp", "aomori.jp", "chiba.jp", "ehime.jp", "fukui.jp", "fukuoka.jp", "fukushima.jp", "gifu.jp", "gunma.jp", "hiroshima.jp", "hokkaido.jp", "hyogo.jp", "ibaraki.jp", "ishikawa.jp", "iwate.jp", "kagawa.jp", "kagoshima.jp", "kanagawa.jp", "kochi.jp", "kumamoto.jp", "kyoto.jp", "mie.jp", "miyagi.jp", "miyazaki.jp", "nagano.jp", "nagasaki.jp", "nara.jp", "niigata.jp", "oita.jp", "okayama.jp", "okinawa.jp", "osaka.jp", "saga.jp", "saitama.jp", "shiga.jp", "shimane.jp", "shizuoka.jp", "tochigi.jp", "tokushima.jp", "tokyo.jp", "tottori.jp", "toyama.jp", "wakayama.jp", "yamagata.jp", "yamaguchi.jp", "yamanashi.jp", "\u4E09\u91CD.jp", "\u4EAC\u90FD.jp", "\u4F50\u8CC0.jp", "\u5175\u5EAB.jp", "\u5317\u6D77\u9053.jp", "\u5343\u8449.jp", "\u548C\u6B4C\u5C71.jp", "\u57FC\u7389.jp", "\u5927\u5206.jp", "\u5927\u962A.jp", "\u5948\u826F.jp", "\u5BAE\u57CE.jp", "\u5BAE\u5D0E.jp", "\u5BCC\u5C71.jp", "\u5C71\u53E3.jp", "\u5C71\u5F62.jp", "\u5C71\u68A8.jp", "\u5C90\u961C.jp", "\u5CA1\u5C71.jp", "\u5CA9\u624B.jp", "\u5CF6\u6839.jp", "\u5E83\u5CF6.jp", "\u5FB3\u5CF6.jp", "\u611B\u5A9B.jp", "\u611B\u77E5.jp", "\u65B0\u6F5F.jp", "\u6771\u4EAC.jp", "\u6803\u6728.jp", "\u6C96\u7E04.jp", "\u6ECB\u8CC0.jp", "\u718A\u672C.jp", "\u77F3\u5DDD.jp", "\u795E\u5948\u5DDD.jp", "\u798F\u4E95.jp", "\u798F\u5CA1.jp", "\u798F\u5CF6.jp", "\u79CB\u7530.jp", "\u7FA4\u99AC.jp", "\u8328\u57CE.jp", "\u9577\u5D0E.jp", "\u9577\u91CE.jp", "\u9752\u68EE.jp", "\u9759\u5CA1.jp", "\u9999\u5DDD.jp", "\u9AD8\u77E5.jp", "\u9CE5\u53D6.jp", "\u9E7F\u5150\u5CF6.jp", "*.kawasaki.jp", "!city.kawasaki.jp", "*.kitakyushu.jp", "!city.kitakyushu.jp", "*.kobe.jp", "!city.kobe.jp", "*.nagoya.jp", "!city.nagoya.jp", "*.sapporo.jp", "!city.sapporo.jp", "*.sendai.jp", "!city.sendai.jp", "*.yokohama.jp", "!city.yokohama.jp", "aisai.aichi.jp", "ama.aichi.jp", "anjo.aichi.jp", "asuke.aichi.jp", "chiryu.aichi.jp", "chita.aichi.jp", "fuso.aichi.jp", "gamagori.aichi.jp", "handa.aichi.jp", "hazu.aichi.jp", "hekinan.aichi.jp", "higashiura.aichi.jp", "ichinomiya.aichi.jp", "inazawa.aichi.jp", "inuyama.aichi.jp", "isshiki.aichi.jp", "iwakura.aichi.jp", "kanie.aichi.jp", "kariya.aichi.jp", "kasugai.aichi.jp", "kira.aichi.jp", "kiyosu.aichi.jp", "komaki.aichi.jp", "konan.aichi.jp", "kota.aichi.jp", "mihama.aichi.jp", "miyoshi.aichi.jp", "nishio.aichi.jp", "nisshin.aichi.jp", "obu.aichi.jp", "oguchi.aichi.jp", "oharu.aichi.jp", "okazaki.aichi.jp", "owariasahi.aichi.jp", "seto.aichi.jp", "shikatsu.aichi.jp", "shinshiro.aichi.jp", "shitara.aichi.jp", "tahara.aichi.jp", "takahama.aichi.jp", "tobishima.aichi.jp", "toei.aichi.jp", "togo.aichi.jp", "tokai.aichi.jp", "tokoname.aichi.jp", "toyoake.aichi.jp", "toyohashi.aichi.jp", "toyokawa.aichi.jp", "toyone.aichi.jp", "toyota.aichi.jp", "tsushima.aichi.jp", "yatomi.aichi.jp", "akita.akita.jp", "daisen.akita.jp", "fujisato.akita.jp", "gojome.akita.jp", "hachirogata.akita.jp", "happou.akita.jp", "higashinaruse.akita.jp", "honjo.akita.jp", "honjyo.akita.jp", "ikawa.akita.jp", "kamikoani.akita.jp", "kamioka.akita.jp", "katagami.akita.jp", "kazuno.akita.jp", "kitaakita.akita.jp", "kosaka.akita.jp", "kyowa.akita.jp", "misato.akita.jp", "mitane.akita.jp", "moriyoshi.akita.jp", "nikaho.akita.jp", "noshiro.akita.jp", "odate.akita.jp", "oga.akita.jp", "ogata.akita.jp", "semboku.akita.jp", "yokote.akita.jp", "yurihonjo.akita.jp", "aomori.aomori.jp", "gonohe.aomori.jp", "hachinohe.aomori.jp", "hashikami.aomori.jp", "hiranai.aomori.jp", "hirosaki.aomori.jp", "itayanagi.aomori.jp", "kuroishi.aomori.jp", "misawa.aomori.jp", "mutsu.aomori.jp", "nakadomari.aomori.jp", "noheji.aomori.jp", "oirase.aomori.jp", "owani.aomori.jp", "rokunohe.aomori.jp", "sannohe.aomori.jp", "shichinohe.aomori.jp", "shingo.aomori.jp", "takko.aomori.jp", "towada.aomori.jp", "tsugaru.aomori.jp", "tsuruta.aomori.jp", "abiko.chiba.jp", "asahi.chiba.jp", "chonan.chiba.jp", "chosei.chiba.jp", "choshi.chiba.jp", "chuo.chiba.jp", "funabashi.chiba.jp", "futtsu.chiba.jp", "hanamigawa.chiba.jp", "ichihara.chiba.jp", "ichikawa.chiba.jp", "ichinomiya.chiba.jp", "inzai.chiba.jp", "isumi.chiba.jp", "kamagaya.chiba.jp", "kamogawa.chiba.jp", "kashiwa.chiba.jp", "katori.chiba.jp", "katsuura.chiba.jp", "kimitsu.chiba.jp", "kisarazu.chiba.jp", "kozaki.chiba.jp", "kujukuri.chiba.jp", "kyonan.chiba.jp", "matsudo.chiba.jp", "midori.chiba.jp", "mihama.chiba.jp", "minamiboso.chiba.jp", "mobara.chiba.jp", "mutsuzawa.chiba.jp", "nagara.chiba.jp", "nagareyama.chiba.jp", "narashino.chiba.jp", "narita.chiba.jp", "noda.chiba.jp", "oamishirasato.chiba.jp", "omigawa.chiba.jp", "onjuku.chiba.jp", "otaki.chiba.jp", "sakae.chiba.jp", "sakura.chiba.jp", "shimofusa.chiba.jp", "shirako.chiba.jp", "shiroi.chiba.jp", "shisui.chiba.jp", "sodegaura.chiba.jp", "sosa.chiba.jp", "tako.chiba.jp", "tateyama.chiba.jp", "togane.chiba.jp", "tohnosho.chiba.jp", "tomisato.chiba.jp", "urayasu.chiba.jp", "yachimata.chiba.jp", "yachiyo.chiba.jp", "yokaichiba.chiba.jp", "yokoshibahikari.chiba.jp", "yotsukaido.chiba.jp", "ainan.ehime.jp", "honai.ehime.jp", "ikata.ehime.jp", "imabari.ehime.jp", "iyo.ehime.jp", "kamijima.ehime.jp", "kihoku.ehime.jp", "kumakogen.ehime.jp", "masaki.ehime.jp", "matsuno.ehime.jp", "matsuyama.ehime.jp", "namikata.ehime.jp", "niihama.ehime.jp", "ozu.ehime.jp", "saijo.ehime.jp", "seiyo.ehime.jp", "shikokuchuo.ehime.jp", "tobe.ehime.jp", "toon.ehime.jp", "uchiko.ehime.jp", "uwajima.ehime.jp", "yawatahama.ehime.jp", "echizen.fukui.jp", "eiheiji.fukui.jp", "fukui.fukui.jp", "ikeda.fukui.jp", "katsuyama.fukui.jp", "mihama.fukui.jp", "minamiechizen.fukui.jp", "obama.fukui.jp", "ohi.fukui.jp", "ono.fukui.jp", "sabae.fukui.jp", "sakai.fukui.jp", "takahama.fukui.jp", "tsuruga.fukui.jp", "wakasa.fukui.jp", "ashiya.fukuoka.jp", "buzen.fukuoka.jp", "chikugo.fukuoka.jp", "chikuho.fukuoka.jp", "chikujo.fukuoka.jp", "chikushino.fukuoka.jp", "chikuzen.fukuoka.jp", "chuo.fukuoka.jp", "dazaifu.fukuoka.jp", "fukuchi.fukuoka.jp", "hakata.fukuoka.jp", "higashi.fukuoka.jp", "hirokawa.fukuoka.jp", "hisayama.fukuoka.jp", "iizuka.fukuoka.jp", "inatsuki.fukuoka.jp", "kaho.fukuoka.jp", "kasuga.fukuoka.jp", "kasuya.fukuoka.jp", "kawara.fukuoka.jp", "keisen.fukuoka.jp", "koga.fukuoka.jp", "kurate.fukuoka.jp", "kurogi.fukuoka.jp", "kurume.fukuoka.jp", "minami.fukuoka.jp", "miyako.fukuoka.jp", "miyama.fukuoka.jp", "miyawaka.fukuoka.jp", "mizumaki.fukuoka.jp", "munakata.fukuoka.jp", "nakagawa.fukuoka.jp", "nakama.fukuoka.jp", "nishi.fukuoka.jp", "nogata.fukuoka.jp", "ogori.fukuoka.jp", "okagaki.fukuoka.jp", "okawa.fukuoka.jp", "oki.fukuoka.jp", "omuta.fukuoka.jp", "onga.fukuoka.jp", "onojo.fukuoka.jp", "oto.fukuoka.jp", "saigawa.fukuoka.jp", "sasaguri.fukuoka.jp", "shingu.fukuoka.jp", "shinyoshitomi.fukuoka.jp", "shonai.fukuoka.jp", "soeda.fukuoka.jp", "sue.fukuoka.jp", "tachiarai.fukuoka.jp", "tagawa.fukuoka.jp", "takata.fukuoka.jp", "toho.fukuoka.jp", "toyotsu.fukuoka.jp", "tsuiki.fukuoka.jp", "ukiha.fukuoka.jp", "umi.fukuoka.jp", "usui.fukuoka.jp", "yamada.fukuoka.jp", "yame.fukuoka.jp", "yanagawa.fukuoka.jp", "yukuhashi.fukuoka.jp", "aizubange.fukushima.jp", "aizumisato.fukushima.jp", "aizuwakamatsu.fukushima.jp", "asakawa.fukushima.jp", "bandai.fukushima.jp", "date.fukushima.jp", "fukushima.fukushima.jp", "furudono.fukushima.jp", "futaba.fukushima.jp", "hanawa.fukushima.jp", "higashi.fukushima.jp", "hirata.fukushima.jp", "hirono.fukushima.jp", "iitate.fukushima.jp", "inawashiro.fukushima.jp", "ishikawa.fukushima.jp", "iwaki.fukushima.jp", "izumizaki.fukushima.jp", "kagamiishi.fukushima.jp", "kaneyama.fukushima.jp", "kawamata.fukushima.jp", "kitakata.fukushima.jp", "kitashiobara.fukushima.jp", "koori.fukushima.jp", "koriyama.fukushima.jp", "kunimi.fukushima.jp", "miharu.fukushima.jp", "mishima.fukushima.jp", "namie.fukushima.jp", "nango.fukushima.jp", "nishiaizu.fukushima.jp", "nishigo.fukushima.jp", "okuma.fukushima.jp", "omotego.fukushima.jp", "ono.fukushima.jp", "otama.fukushima.jp", "samegawa.fukushima.jp", "shimogo.fukushima.jp", "shirakawa.fukushima.jp", "showa.fukushima.jp", "soma.fukushima.jp", "sukagawa.fukushima.jp", "taishin.fukushima.jp", "tamakawa.fukushima.jp", "tanagura.fukushima.jp", "tenei.fukushima.jp", "yabuki.fukushima.jp", "yamato.fukushima.jp", "yamatsuri.fukushima.jp", "yanaizu.fukushima.jp", "yugawa.fukushima.jp", "anpachi.gifu.jp", "ena.gifu.jp", "gifu.gifu.jp", "ginan.gifu.jp", "godo.gifu.jp", "gujo.gifu.jp", "hashima.gifu.jp", "hichiso.gifu.jp", "hida.gifu.jp", "higashishirakawa.gifu.jp", "ibigawa.gifu.jp", "ikeda.gifu.jp", "kakamigahara.gifu.jp", "kani.gifu.jp", "kasahara.gifu.jp", "kasamatsu.gifu.jp", "kawaue.gifu.jp", "kitagata.gifu.jp", "mino.gifu.jp", "minokamo.gifu.jp", "mitake.gifu.jp", "mizunami.gifu.jp", "motosu.gifu.jp", "nakatsugawa.gifu.jp", "ogaki.gifu.jp", "sakahogi.gifu.jp", "seki.gifu.jp", "sekigahara.gifu.jp", "shirakawa.gifu.jp", "tajimi.gifu.jp", "takayama.gifu.jp", "tarui.gifu.jp", "toki.gifu.jp", "tomika.gifu.jp", "wanouchi.gifu.jp", "yamagata.gifu.jp", "yaotsu.gifu.jp", "yoro.gifu.jp", "annaka.gunma.jp", "chiyoda.gunma.jp", "fujioka.gunma.jp", "higashiagatsuma.gunma.jp", "isesaki.gunma.jp", "itakura.gunma.jp", "kanna.gunma.jp", "kanra.gunma.jp", "katashina.gunma.jp", "kawaba.gunma.jp", "kiryu.gunma.jp", "kusatsu.gunma.jp", "maebashi.gunma.jp", "meiwa.gunma.jp", "midori.gunma.jp", "minakami.gunma.jp", "naganohara.gunma.jp", "nakanojo.gunma.jp", "nanmoku.gunma.jp", "numata.gunma.jp", "oizumi.gunma.jp", "ora.gunma.jp", "ota.gunma.jp", "shibukawa.gunma.jp", "shimonita.gunma.jp", "shinto.gunma.jp", "showa.gunma.jp", "takasaki.gunma.jp", "takayama.gunma.jp", "tamamura.gunma.jp", "tatebayashi.gunma.jp", "tomioka.gunma.jp", "tsukiyono.gunma.jp", "tsumagoi.gunma.jp", "ueno.gunma.jp", "yoshioka.gunma.jp", "asaminami.hiroshima.jp", "daiwa.hiroshima.jp", "etajima.hiroshima.jp", "fuchu.hiroshima.jp", "fukuyama.hiroshima.jp", "hatsukaichi.hiroshima.jp", "higashihiroshima.hiroshima.jp", "hongo.hiroshima.jp", "jinsekikogen.hiroshima.jp", "kaita.hiroshima.jp", "kui.hiroshima.jp", "kumano.hiroshima.jp", "kure.hiroshima.jp", "mihara.hiroshima.jp", "miyoshi.hiroshima.jp", "naka.hiroshima.jp", "onomichi.hiroshima.jp", "osakikamijima.hiroshima.jp", "otake.hiroshima.jp", "saka.hiroshima.jp", "sera.hiroshima.jp", "seranishi.hiroshima.jp", "shinichi.hiroshima.jp", "shobara.hiroshima.jp", "takehara.hiroshima.jp", "abashiri.hokkaido.jp", "abira.hokkaido.jp", "aibetsu.hokkaido.jp", "akabira.hokkaido.jp", "akkeshi.hokkaido.jp", "asahikawa.hokkaido.jp", "ashibetsu.hokkaido.jp", "ashoro.hokkaido.jp", "assabu.hokkaido.jp", "atsuma.hokkaido.jp", "bibai.hokkaido.jp", "biei.hokkaido.jp", "bifuka.hokkaido.jp", "bihoro.hokkaido.jp", "biratori.hokkaido.jp", "chippubetsu.hokkaido.jp", "chitose.hokkaido.jp", "date.hokkaido.jp", "ebetsu.hokkaido.jp", "embetsu.hokkaido.jp", "eniwa.hokkaido.jp", "erimo.hokkaido.jp", "esan.hokkaido.jp", "esashi.hokkaido.jp", "fukagawa.hokkaido.jp", "fukushima.hokkaido.jp", "furano.hokkaido.jp", "furubira.hokkaido.jp", "haboro.hokkaido.jp", "hakodate.hokkaido.jp", "hamatonbetsu.hokkaido.jp", "hidaka.hokkaido.jp", "higashikagura.hokkaido.jp", "higashikawa.hokkaido.jp", "hiroo.hokkaido.jp", "hokuryu.hokkaido.jp", "hokuto.hokkaido.jp", "honbetsu.hokkaido.jp", "horokanai.hokkaido.jp", "horonobe.hokkaido.jp", "ikeda.hokkaido.jp", "imakane.hokkaido.jp", "ishikari.hokkaido.jp", "iwamizawa.hokkaido.jp", "iwanai.hokkaido.jp", "kamifurano.hokkaido.jp", "kamikawa.hokkaido.jp", "kamishihoro.hokkaido.jp", "kamisunagawa.hokkaido.jp", "kamoenai.hokkaido.jp", "kayabe.hokkaido.jp", "kembuchi.hokkaido.jp", "kikonai.hokkaido.jp", "kimobetsu.hokkaido.jp", "kitahiroshima.hokkaido.jp", "kitami.hokkaido.jp", "kiyosato.hokkaido.jp", "koshimizu.hokkaido.jp", "kunneppu.hokkaido.jp", "kuriyama.hokkaido.jp", "kuromatsunai.hokkaido.jp", "kushiro.hokkaido.jp", "kutchan.hokkaido.jp", "kyowa.hokkaido.jp", "mashike.hokkaido.jp", "matsumae.hokkaido.jp", "mikasa.hokkaido.jp", "minamifurano.hokkaido.jp", "mombetsu.hokkaido.jp", "moseushi.hokkaido.jp", "mukawa.hokkaido.jp", "muroran.hokkaido.jp", "naie.hokkaido.jp", "nakagawa.hokkaido.jp", "nakasatsunai.hokkaido.jp", "nakatombetsu.hokkaido.jp", "nanae.hokkaido.jp", "nanporo.hokkaido.jp", "nayoro.hokkaido.jp", "nemuro.hokkaido.jp", "niikappu.hokkaido.jp", "niki.hokkaido.jp", "nishiokoppe.hokkaido.jp", "noboribetsu.hokkaido.jp", "numata.hokkaido.jp", "obihiro.hokkaido.jp", "obira.hokkaido.jp", "oketo.hokkaido.jp", "okoppe.hokkaido.jp", "otaru.hokkaido.jp", "otobe.hokkaido.jp", "otofuke.hokkaido.jp", "otoineppu.hokkaido.jp", "oumu.hokkaido.jp", "ozora.hokkaido.jp", "pippu.hokkaido.jp", "rankoshi.hokkaido.jp", "rebun.hokkaido.jp", "rikubetsu.hokkaido.jp", "rishiri.hokkaido.jp", "rishirifuji.hokkaido.jp", "saroma.hokkaido.jp", "sarufutsu.hokkaido.jp", "shakotan.hokkaido.jp", "shari.hokkaido.jp", "shibecha.hokkaido.jp", "shibetsu.hokkaido.jp", "shikabe.hokkaido.jp", "shikaoi.hokkaido.jp", "shimamaki.hokkaido.jp", "shimizu.hokkaido.jp", "shimokawa.hokkaido.jp", "shinshinotsu.hokkaido.jp", "shintoku.hokkaido.jp", "shiranuka.hokkaido.jp", "shiraoi.hokkaido.jp", "shiriuchi.hokkaido.jp", "sobetsu.hokkaido.jp", "sunagawa.hokkaido.jp", "taiki.hokkaido.jp", "takasu.hokkaido.jp", "takikawa.hokkaido.jp", "takinoue.hokkaido.jp", "teshikaga.hokkaido.jp", "tobetsu.hokkaido.jp", "tohma.hokkaido.jp", "tomakomai.hokkaido.jp", "tomari.hokkaido.jp", "toya.hokkaido.jp", "toyako.hokkaido.jp", "toyotomi.hokkaido.jp", "toyoura.hokkaido.jp", "tsubetsu.hokkaido.jp", "tsukigata.hokkaido.jp", "urakawa.hokkaido.jp", "urausu.hokkaido.jp", "uryu.hokkaido.jp", "utashinai.hokkaido.jp", "wakkanai.hokkaido.jp", "wassamu.hokkaido.jp", "yakumo.hokkaido.jp", "yoichi.hokkaido.jp", "aioi.hyogo.jp", "akashi.hyogo.jp", "ako.hyogo.jp", "amagasaki.hyogo.jp", "aogaki.hyogo.jp", "asago.hyogo.jp", "ashiya.hyogo.jp", "awaji.hyogo.jp", "fukusaki.hyogo.jp", "goshiki.hyogo.jp", "harima.hyogo.jp", "himeji.hyogo.jp", "ichikawa.hyogo.jp", "inagawa.hyogo.jp", "itami.hyogo.jp", "kakogawa.hyogo.jp", "kamigori.hyogo.jp", "kamikawa.hyogo.jp", "kasai.hyogo.jp", "kasuga.hyogo.jp", "kawanishi.hyogo.jp", "miki.hyogo.jp", "minamiawaji.hyogo.jp", "nishinomiya.hyogo.jp", "nishiwaki.hyogo.jp", "ono.hyogo.jp", "sanda.hyogo.jp", "sannan.hyogo.jp", "sasayama.hyogo.jp", "sayo.hyogo.jp", "shingu.hyogo.jp", "shinonsen.hyogo.jp", "shiso.hyogo.jp", "sumoto.hyogo.jp", "taishi.hyogo.jp", "taka.hyogo.jp", "takarazuka.hyogo.jp", "takasago.hyogo.jp", "takino.hyogo.jp", "tamba.hyogo.jp", "tatsuno.hyogo.jp", "toyooka.hyogo.jp", "yabu.hyogo.jp", "yashiro.hyogo.jp", "yoka.hyogo.jp", "yokawa.hyogo.jp", "ami.ibaraki.jp", "asahi.ibaraki.jp", "bando.ibaraki.jp", "chikusei.ibaraki.jp", "daigo.ibaraki.jp", "fujishiro.ibaraki.jp", "hitachi.ibaraki.jp", "hitachinaka.ibaraki.jp", "hitachiomiya.ibaraki.jp", "hitachiota.ibaraki.jp", "ibaraki.ibaraki.jp", "ina.ibaraki.jp", "inashiki.ibaraki.jp", "itako.ibaraki.jp", "iwama.ibaraki.jp", "joso.ibaraki.jp", "kamisu.ibaraki.jp", "kasama.ibaraki.jp", "kashima.ibaraki.jp", "kasumigaura.ibaraki.jp", "koga.ibaraki.jp", "miho.ibaraki.jp", "mito.ibaraki.jp", "moriya.ibaraki.jp", "naka.ibaraki.jp", "namegata.ibaraki.jp", "oarai.ibaraki.jp", "ogawa.ibaraki.jp", "omitama.ibaraki.jp", "ryugasaki.ibaraki.jp", "sakai.ibaraki.jp", "sakuragawa.ibaraki.jp", "shimodate.ibaraki.jp", "shimotsuma.ibaraki.jp", "shirosato.ibaraki.jp", "sowa.ibaraki.jp", "suifu.ibaraki.jp", "takahagi.ibaraki.jp", "tamatsukuri.ibaraki.jp", "tokai.ibaraki.jp", "tomobe.ibaraki.jp", "tone.ibaraki.jp", "toride.ibaraki.jp", "tsuchiura.ibaraki.jp", "tsukuba.ibaraki.jp", "uchihara.ibaraki.jp", "ushiku.ibaraki.jp", "yachiyo.ibaraki.jp", "yamagata.ibaraki.jp", "yawara.ibaraki.jp", "yuki.ibaraki.jp", "anamizu.ishikawa.jp", "hakui.ishikawa.jp", "hakusan.ishikawa.jp", "kaga.ishikawa.jp", "kahoku.ishikawa.jp", "kanazawa.ishikawa.jp", "kawakita.ishikawa.jp", "komatsu.ishikawa.jp", "nakanoto.ishikawa.jp", "nanao.ishikawa.jp", "nomi.ishikawa.jp", "nonoichi.ishikawa.jp", "noto.ishikawa.jp", "shika.ishikawa.jp", "suzu.ishikawa.jp", "tsubata.ishikawa.jp", "tsurugi.ishikawa.jp", "uchinada.ishikawa.jp", "wajima.ishikawa.jp", "fudai.iwate.jp", "fujisawa.iwate.jp", "hanamaki.iwate.jp", "hiraizumi.iwate.jp", "hirono.iwate.jp", "ichinohe.iwate.jp", "ichinoseki.iwate.jp", "iwaizumi.iwate.jp", "iwate.iwate.jp", "joboji.iwate.jp", "kamaishi.iwate.jp", "kanegasaki.iwate.jp", "karumai.iwate.jp", "kawai.iwate.jp", "kitakami.iwate.jp", "kuji.iwate.jp", "kunohe.iwate.jp", "kuzumaki.iwate.jp", "miyako.iwate.jp", "mizusawa.iwate.jp", "morioka.iwate.jp", "ninohe.iwate.jp", "noda.iwate.jp", "ofunato.iwate.jp", "oshu.iwate.jp", "otsuchi.iwate.jp", "rikuzentakata.iwate.jp", "shiwa.iwate.jp", "shizukuishi.iwate.jp", "sumita.iwate.jp", "tanohata.iwate.jp", "tono.iwate.jp", "yahaba.iwate.jp", "yamada.iwate.jp", "ayagawa.kagawa.jp", "higashikagawa.kagawa.jp", "kanonji.kagawa.jp", "kotohira.kagawa.jp", "manno.kagawa.jp", "marugame.kagawa.jp", "mitoyo.kagawa.jp", "naoshima.kagawa.jp", "sanuki.kagawa.jp", "tadotsu.kagawa.jp", "takamatsu.kagawa.jp", "tonosho.kagawa.jp", "uchinomi.kagawa.jp", "utazu.kagawa.jp", "zentsuji.kagawa.jp", "akune.kagoshima.jp", "amami.kagoshima.jp", "hioki.kagoshima.jp", "isa.kagoshima.jp", "isen.kagoshima.jp", "izumi.kagoshima.jp", "kagoshima.kagoshima.jp", "kanoya.kagoshima.jp", "kawanabe.kagoshima.jp", "kinko.kagoshima.jp", "kouyama.kagoshima.jp", "makurazaki.kagoshima.jp", "matsumoto.kagoshima.jp", "minamitane.kagoshima.jp", "nakatane.kagoshima.jp", "nishinoomote.kagoshima.jp", "satsumasendai.kagoshima.jp", "soo.kagoshima.jp", "tarumizu.kagoshima.jp", "yusui.kagoshima.jp", "aikawa.kanagawa.jp", "atsugi.kanagawa.jp", "ayase.kanagawa.jp", "chigasaki.kanagawa.jp", "ebina.kanagawa.jp", "fujisawa.kanagawa.jp", "hadano.kanagawa.jp", "hakone.kanagawa.jp", "hiratsuka.kanagawa.jp", "isehara.kanagawa.jp", "kaisei.kanagawa.jp", "kamakura.kanagawa.jp", "kiyokawa.kanagawa.jp", "matsuda.kanagawa.jp", "minamiashigara.kanagawa.jp", "miura.kanagawa.jp", "nakai.kanagawa.jp", "ninomiya.kanagawa.jp", "odawara.kanagawa.jp", "oi.kanagawa.jp", "oiso.kanagawa.jp", "sagamihara.kanagawa.jp", "samukawa.kanagawa.jp", "tsukui.kanagawa.jp", "yamakita.kanagawa.jp", "yamato.kanagawa.jp", "yokosuka.kanagawa.jp", "yugawara.kanagawa.jp", "zama.kanagawa.jp", "zushi.kanagawa.jp", "aki.kochi.jp", "geisei.kochi.jp", "hidaka.kochi.jp", "higashitsuno.kochi.jp", "ino.kochi.jp", "kagami.kochi.jp", "kami.kochi.jp", "kitagawa.kochi.jp", "kochi.kochi.jp", "mihara.kochi.jp", "motoyama.kochi.jp", "muroto.kochi.jp", "nahari.kochi.jp", "nakamura.kochi.jp", "nankoku.kochi.jp", "nishitosa.kochi.jp", "niyodogawa.kochi.jp", "ochi.kochi.jp", "okawa.kochi.jp", "otoyo.kochi.jp", "otsuki.kochi.jp", "sakawa.kochi.jp", "sukumo.kochi.jp", "susaki.kochi.jp", "tosa.kochi.jp", "tosashimizu.kochi.jp", "toyo.kochi.jp", "tsuno.kochi.jp", "umaji.kochi.jp", "yasuda.kochi.jp", "yusuhara.kochi.jp", "amakusa.kumamoto.jp", "arao.kumamoto.jp", "aso.kumamoto.jp", "choyo.kumamoto.jp", "gyokuto.kumamoto.jp", "kamiamakusa.kumamoto.jp", "kikuchi.kumamoto.jp", "kumamoto.kumamoto.jp", "mashiki.kumamoto.jp", "mifune.kumamoto.jp", "minamata.kumamoto.jp", "minamioguni.kumamoto.jp", "nagasu.kumamoto.jp", "nishihara.kumamoto.jp", "oguni.kumamoto.jp", "ozu.kumamoto.jp", "sumoto.kumamoto.jp", "takamori.kumamoto.jp", "uki.kumamoto.jp", "uto.kumamoto.jp", "yamaga.kumamoto.jp", "yamato.kumamoto.jp", "yatsushiro.kumamoto.jp", "ayabe.kyoto.jp", "fukuchiyama.kyoto.jp", "higashiyama.kyoto.jp", "ide.kyoto.jp", "ine.kyoto.jp", "joyo.kyoto.jp", "kameoka.kyoto.jp", "kamo.kyoto.jp", "kita.kyoto.jp", "kizu.kyoto.jp", "kumiyama.kyoto.jp", "kyotamba.kyoto.jp", "kyotanabe.kyoto.jp", "kyotango.kyoto.jp", "maizuru.kyoto.jp", "minami.kyoto.jp", "minamiyamashiro.kyoto.jp", "miyazu.kyoto.jp", "muko.kyoto.jp", "nagaokakyo.kyoto.jp", "nakagyo.kyoto.jp", "nantan.kyoto.jp", "oyamazaki.kyoto.jp", "sakyo.kyoto.jp", "seika.kyoto.jp", "tanabe.kyoto.jp", "uji.kyoto.jp", "ujitawara.kyoto.jp", "wazuka.kyoto.jp", "yamashina.kyoto.jp", "yawata.kyoto.jp", "asahi.mie.jp", "inabe.mie.jp", "ise.mie.jp", "kameyama.mie.jp", "kawagoe.mie.jp", "kiho.mie.jp", "kisosaki.mie.jp", "kiwa.mie.jp", "komono.mie.jp", "kumano.mie.jp", "kuwana.mie.jp", "matsusaka.mie.jp", "meiwa.mie.jp", "mihama.mie.jp", "minamiise.mie.jp", "misugi.mie.jp", "miyama.mie.jp", "nabari.mie.jp", "shima.mie.jp", "suzuka.mie.jp", "tado.mie.jp", "taiki.mie.jp", "taki.mie.jp", "tamaki.mie.jp", "toba.mie.jp", "tsu.mie.jp", "udono.mie.jp", "ureshino.mie.jp", "watarai.mie.jp", "yokkaichi.mie.jp", "furukawa.miyagi.jp", "higashimatsushima.miyagi.jp", "ishinomaki.miyagi.jp", "iwanuma.miyagi.jp", "kakuda.miyagi.jp", "kami.miyagi.jp", "kawasaki.miyagi.jp", "marumori.miyagi.jp", "matsushima.miyagi.jp", "minamisanriku.miyagi.jp", "misato.miyagi.jp", "murata.miyagi.jp", "natori.miyagi.jp", "ogawara.miyagi.jp", "ohira.miyagi.jp", "onagawa.miyagi.jp", "osaki.miyagi.jp", "rifu.miyagi.jp", "semine.miyagi.jp", "shibata.miyagi.jp", "shichikashuku.miyagi.jp", "shikama.miyagi.jp", "shiogama.miyagi.jp", "shiroishi.miyagi.jp", "tagajo.miyagi.jp", "taiwa.miyagi.jp", "tome.miyagi.jp", "tomiya.miyagi.jp", "wakuya.miyagi.jp", "watari.miyagi.jp", "yamamoto.miyagi.jp", "zao.miyagi.jp", "aya.miyazaki.jp", "ebino.miyazaki.jp", "gokase.miyazaki.jp", "hyuga.miyazaki.jp", "kadogawa.miyazaki.jp", "kawaminami.miyazaki.jp", "kijo.miyazaki.jp", "kitagawa.miyazaki.jp", "kitakata.miyazaki.jp", "kitaura.miyazaki.jp", "kobayashi.miyazaki.jp", "kunitomi.miyazaki.jp", "kushima.miyazaki.jp", "mimata.miyazaki.jp", "miyakonojo.miyazaki.jp", "miyazaki.miyazaki.jp", "morotsuka.miyazaki.jp", "nichinan.miyazaki.jp", "nishimera.miyazaki.jp", "nobeoka.miyazaki.jp", "saito.miyazaki.jp", "shiiba.miyazaki.jp", "shintomi.miyazaki.jp", "takaharu.miyazaki.jp", "takanabe.miyazaki.jp", "takazaki.miyazaki.jp", "tsuno.miyazaki.jp", "achi.nagano.jp", "agematsu.nagano.jp", "anan.nagano.jp", "aoki.nagano.jp", "asahi.nagano.jp", "azumino.nagano.jp", "chikuhoku.nagano.jp", "chikuma.nagano.jp", "chino.nagano.jp", "fujimi.nagano.jp", "hakuba.nagano.jp", "hara.nagano.jp", "hiraya.nagano.jp", "iida.nagano.jp", "iijima.nagano.jp", "iiyama.nagano.jp", "iizuna.nagano.jp", "ikeda.nagano.jp", "ikusaka.nagano.jp", "ina.nagano.jp", "karuizawa.nagano.jp", "kawakami.nagano.jp", "kiso.nagano.jp", "kisofukushima.nagano.jp", "kitaaiki.nagano.jp", "komagane.nagano.jp", "komoro.nagano.jp", "matsukawa.nagano.jp", "matsumoto.nagano.jp", "miasa.nagano.jp", "minamiaiki.nagano.jp", "minamimaki.nagano.jp", "minamiminowa.nagano.jp", "minowa.nagano.jp", "miyada.nagano.jp", "miyota.nagano.jp", "mochizuki.nagano.jp", "nagano.nagano.jp", "nagawa.nagano.jp", "nagiso.nagano.jp", "nakagawa.nagano.jp", "nakano.nagano.jp", "nozawaonsen.nagano.jp", "obuse.nagano.jp", "ogawa.nagano.jp", "okaya.nagano.jp", "omachi.nagano.jp", "omi.nagano.jp", "ookuwa.nagano.jp", "ooshika.nagano.jp", "otaki.nagano.jp", "otari.nagano.jp", "sakae.nagano.jp", "sakaki.nagano.jp", "saku.nagano.jp", "sakuho.nagano.jp", "shimosuwa.nagano.jp", "shinanomachi.nagano.jp", "shiojiri.nagano.jp", "suwa.nagano.jp", "suzaka.nagano.jp", "takagi.nagano.jp", "takamori.nagano.jp", "takayama.nagano.jp", "tateshina.nagano.jp", "tatsuno.nagano.jp", "togakushi.nagano.jp", "togura.nagano.jp", "tomi.nagano.jp", "ueda.nagano.jp", "wada.nagano.jp", "yamagata.nagano.jp", "yamanouchi.nagano.jp", "yasaka.nagano.jp", "yasuoka.nagano.jp", "chijiwa.nagasaki.jp", "futsu.nagasaki.jp", "goto.nagasaki.jp", "hasami.nagasaki.jp", "hirado.nagasaki.jp", "iki.nagasaki.jp", "isahaya.nagasaki.jp", "kawatana.nagasaki.jp", "kuchinotsu.nagasaki.jp", "matsuura.nagasaki.jp", "nagasaki.nagasaki.jp", "obama.nagasaki.jp", "omura.nagasaki.jp", "oseto.nagasaki.jp", "saikai.nagasaki.jp", "sasebo.nagasaki.jp", "seihi.nagasaki.jp", "shimabara.nagasaki.jp", "shinkamigoto.nagasaki.jp", "togitsu.nagasaki.jp", "tsushima.nagasaki.jp", "unzen.nagasaki.jp", "ando.nara.jp", "gose.nara.jp", "heguri.nara.jp", "higashiyoshino.nara.jp", "ikaruga.nara.jp", "ikoma.nara.jp", "kamikitayama.nara.jp", "kanmaki.nara.jp", "kashiba.nara.jp", "kashihara.nara.jp", "katsuragi.nara.jp", "kawai.nara.jp", "kawakami.nara.jp", "kawanishi.nara.jp", "koryo.nara.jp", "kurotaki.nara.jp", "mitsue.nara.jp", "miyake.nara.jp", "nara.nara.jp", "nosegawa.nara.jp", "oji.nara.jp", "ouda.nara.jp", "oyodo.nara.jp", "sakurai.nara.jp", "sango.nara.jp", "shimoichi.nara.jp", "shimokitayama.nara.jp", "shinjo.nara.jp", "soni.nara.jp", "takatori.nara.jp", "tawaramoto.nara.jp", "tenkawa.nara.jp", "tenri.nara.jp", "uda.nara.jp", "yamatokoriyama.nara.jp", "yamatotakada.nara.jp", "yamazoe.nara.jp", "yoshino.nara.jp", "aga.niigata.jp", "agano.niigata.jp", "gosen.niigata.jp", "itoigawa.niigata.jp", "izumozaki.niigata.jp", "joetsu.niigata.jp", "kamo.niigata.jp", "kariwa.niigata.jp", "kashiwazaki.niigata.jp", "minamiuonuma.niigata.jp", "mitsuke.niigata.jp", "muika.niigata.jp", "murakami.niigata.jp", "myoko.niigata.jp", "nagaoka.niigata.jp", "niigata.niigata.jp", "ojiya.niigata.jp", "omi.niigata.jp", "sado.niigata.jp", "sanjo.niigata.jp", "seiro.niigata.jp", "seirou.niigata.jp", "sekikawa.niigata.jp", "shibata.niigata.jp", "tagami.niigata.jp", "tainai.niigata.jp", "tochio.niigata.jp", "tokamachi.niigata.jp", "tsubame.niigata.jp", "tsunan.niigata.jp", "uonuma.niigata.jp", "yahiko.niigata.jp", "yoita.niigata.jp", "yuzawa.niigata.jp", "beppu.oita.jp", "bungoono.oita.jp", "bungotakada.oita.jp", "hasama.oita.jp", "hiji.oita.jp", "himeshima.oita.jp", "hita.oita.jp", "kamitsue.oita.jp", "kokonoe.oita.jp", "kuju.oita.jp", "kunisaki.oita.jp", "kusu.oita.jp", "oita.oita.jp", "saiki.oita.jp", "taketa.oita.jp", "tsukumi.oita.jp", "usa.oita.jp", "usuki.oita.jp", "yufu.oita.jp", "akaiwa.okayama.jp", "asakuchi.okayama.jp", "bizen.okayama.jp", "hayashima.okayama.jp", "ibara.okayama.jp", "kagamino.okayama.jp", "kasaoka.okayama.jp", "kibichuo.okayama.jp", "kumenan.okayama.jp", "kurashiki.okayama.jp", "maniwa.okayama.jp", "misaki.okayama.jp", "nagi.okayama.jp", "niimi.okayama.jp", "nishiawakura.okayama.jp", "okayama.okayama.jp", "satosho.okayama.jp", "setouchi.okayama.jp", "shinjo.okayama.jp", "shoo.okayama.jp", "soja.okayama.jp", "takahashi.okayama.jp", "tamano.okayama.jp", "tsuyama.okayama.jp", "wake.okayama.jp", "yakage.okayama.jp", "aguni.okinawa.jp", "ginowan.okinawa.jp", "ginoza.okinawa.jp", "gushikami.okinawa.jp", "haebaru.okinawa.jp", "higashi.okinawa.jp", "hirara.okinawa.jp", "iheya.okinawa.jp", "ishigaki.okinawa.jp", "ishikawa.okinawa.jp", "itoman.okinawa.jp", "izena.okinawa.jp", "kadena.okinawa.jp", "kin.okinawa.jp", "kitadaito.okinawa.jp", "kitanakagusuku.okinawa.jp", "kumejima.okinawa.jp", "kunigami.okinawa.jp", "minamidaito.okinawa.jp", "motobu.okinawa.jp", "nago.okinawa.jp", "naha.okinawa.jp", "nakagusuku.okinawa.jp", "nakijin.okinawa.jp", "nanjo.okinawa.jp", "nishihara.okinawa.jp", "ogimi.okinawa.jp", "okinawa.okinawa.jp", "onna.okinawa.jp", "shimoji.okinawa.jp", "taketomi.okinawa.jp", "tarama.okinawa.jp", "tokashiki.okinawa.jp", "tomigusuku.okinawa.jp", "tonaki.okinawa.jp", "urasoe.okinawa.jp", "uruma.okinawa.jp", "yaese.okinawa.jp", "yomitan.okinawa.jp", "yonabaru.okinawa.jp", "yonaguni.okinawa.jp", "zamami.okinawa.jp", "abeno.osaka.jp", "chihayaakasaka.osaka.jp", "chuo.osaka.jp", "daito.osaka.jp", "fujiidera.osaka.jp", "habikino.osaka.jp", "hannan.osaka.jp", "higashiosaka.osaka.jp", "higashisumiyoshi.osaka.jp", "higashiyodogawa.osaka.jp", "hirakata.osaka.jp", "ibaraki.osaka.jp", "ikeda.osaka.jp", "izumi.osaka.jp", "izumiotsu.osaka.jp", "izumisano.osaka.jp", "kadoma.osaka.jp", "kaizuka.osaka.jp", "kanan.osaka.jp", "kashiwara.osaka.jp", "katano.osaka.jp", "kawachinagano.osaka.jp", "kishiwada.osaka.jp", "kita.osaka.jp", "kumatori.osaka.jp", "matsubara.osaka.jp", "minato.osaka.jp", "minoh.osaka.jp", "misaki.osaka.jp", "moriguchi.osaka.jp", "neyagawa.osaka.jp", "nishi.osaka.jp", "nose.osaka.jp", "osakasayama.osaka.jp", "sakai.osaka.jp", "sayama.osaka.jp", "sennan.osaka.jp", "settsu.osaka.jp", "shijonawate.osaka.jp", "shimamoto.osaka.jp", "suita.osaka.jp", "tadaoka.osaka.jp", "taishi.osaka.jp", "tajiri.osaka.jp", "takaishi.osaka.jp", "takatsuki.osaka.jp", "tondabayashi.osaka.jp", "toyonaka.osaka.jp", "toyono.osaka.jp", "yao.osaka.jp", "ariake.saga.jp", "arita.saga.jp", "fukudomi.saga.jp", "genkai.saga.jp", "hamatama.saga.jp", "hizen.saga.jp", "imari.saga.jp", "kamimine.saga.jp", "kanzaki.saga.jp", "karatsu.saga.jp", "kashima.saga.jp", "kitagata.saga.jp", "kitahata.saga.jp", "kiyama.saga.jp", "kouhoku.saga.jp", "kyuragi.saga.jp", "nishiarita.saga.jp", "ogi.saga.jp", "omachi.saga.jp", "ouchi.saga.jp", "saga.saga.jp", "shiroishi.saga.jp", "taku.saga.jp", "tara.saga.jp", "tosu.saga.jp", "yoshinogari.saga.jp", "arakawa.saitama.jp", "asaka.saitama.jp", "chichibu.saitama.jp", "fujimi.saitama.jp", "fujimino.saitama.jp", "fukaya.saitama.jp", "hanno.saitama.jp", "hanyu.saitama.jp", "hasuda.saitama.jp", "hatogaya.saitama.jp", "hatoyama.saitama.jp", "hidaka.saitama.jp", "higashichichibu.saitama.jp", "higashimatsuyama.saitama.jp", "honjo.saitama.jp", "ina.saitama.jp", "iruma.saitama.jp", "iwatsuki.saitama.jp", "kamiizumi.saitama.jp", "kamikawa.saitama.jp", "kamisato.saitama.jp", "kasukabe.saitama.jp", "kawagoe.saitama.jp", "kawaguchi.saitama.jp", "kawajima.saitama.jp", "kazo.saitama.jp", "kitamoto.saitama.jp", "koshigaya.saitama.jp", "kounosu.saitama.jp", "kuki.saitama.jp", "kumagaya.saitama.jp", "matsubushi.saitama.jp", "minano.saitama.jp", "misato.saitama.jp", "miyashiro.saitama.jp", "miyoshi.saitama.jp", "moroyama.saitama.jp", "nagatoro.saitama.jp", "namegawa.saitama.jp", "niiza.saitama.jp", "ogano.saitama.jp", "ogawa.saitama.jp", "ogose.saitama.jp", "okegawa.saitama.jp", "omiya.saitama.jp", "otaki.saitama.jp", "ranzan.saitama.jp", "ryokami.saitama.jp", "saitama.saitama.jp", "sakado.saitama.jp", "satte.saitama.jp", "sayama.saitama.jp", "shiki.saitama.jp", "shiraoka.saitama.jp", "soka.saitama.jp", "sugito.saitama.jp", "toda.saitama.jp", "tokigawa.saitama.jp", "tokorozawa.saitama.jp", "tsurugashima.saitama.jp", "urawa.saitama.jp", "warabi.saitama.jp", "yashio.saitama.jp", "yokoze.saitama.jp", "yono.saitama.jp", "yorii.saitama.jp", "yoshida.saitama.jp", "yoshikawa.saitama.jp", "yoshimi.saitama.jp", "aisho.shiga.jp", "gamo.shiga.jp", "higashiomi.shiga.jp", "hikone.shiga.jp", "koka.shiga.jp", "konan.shiga.jp", "kosei.shiga.jp", "koto.shiga.jp", "kusatsu.shiga.jp", "maibara.shiga.jp", "moriyama.shiga.jp", "nagahama.shiga.jp", "nishiazai.shiga.jp", "notogawa.shiga.jp", "omihachiman.shiga.jp", "otsu.shiga.jp", "ritto.shiga.jp", "ryuoh.shiga.jp", "takashima.shiga.jp", "takatsuki.shiga.jp", "torahime.shiga.jp", "toyosato.shiga.jp", "yasu.shiga.jp", "akagi.shimane.jp", "ama.shimane.jp", "gotsu.shimane.jp", "hamada.shimane.jp", "higashiizumo.shimane.jp", "hikawa.shimane.jp", "hikimi.shimane.jp", "izumo.shimane.jp", "kakinoki.shimane.jp", "masuda.shimane.jp", "matsue.shimane.jp", "misato.shimane.jp", "nishinoshima.shimane.jp", "ohda.shimane.jp", "okinoshima.shimane.jp", "okuizumo.shimane.jp", "shimane.shimane.jp", "tamayu.shimane.jp", "tsuwano.shimane.jp", "unnan.shimane.jp", "yakumo.shimane.jp", "yasugi.shimane.jp", "yatsuka.shimane.jp", "arai.shizuoka.jp", "atami.shizuoka.jp", "fuji.shizuoka.jp", "fujieda.shizuoka.jp", "fujikawa.shizuoka.jp", "fujinomiya.shizuoka.jp", "fukuroi.shizuoka.jp", "gotemba.shizuoka.jp", "haibara.shizuoka.jp", "hamamatsu.shizuoka.jp", "higashiizu.shizuoka.jp", "ito.shizuoka.jp", "iwata.shizuoka.jp", "izu.shizuoka.jp", "izunokuni.shizuoka.jp", "kakegawa.shizuoka.jp", "kannami.shizuoka.jp", "kawanehon.shizuoka.jp", "kawazu.shizuoka.jp", "kikugawa.shizuoka.jp", "kosai.shizuoka.jp", "makinohara.shizuoka.jp", "matsuzaki.shizuoka.jp", "minamiizu.shizuoka.jp", "mishima.shizuoka.jp", "morimachi.shizuoka.jp", "nishiizu.shizuoka.jp", "numazu.shizuoka.jp", "omaezaki.shizuoka.jp", "shimada.shizuoka.jp", "shimizu.shizuoka.jp", "shimoda.shizuoka.jp", "shizuoka.shizuoka.jp", "susono.shizuoka.jp", "yaizu.shizuoka.jp", "yoshida.shizuoka.jp", "ashikaga.tochigi.jp", "bato.tochigi.jp", "haga.tochigi.jp", "ichikai.tochigi.jp", "iwafune.tochigi.jp", "kaminokawa.tochigi.jp", "kanuma.tochigi.jp", "karasuyama.tochigi.jp", "kuroiso.tochigi.jp", "mashiko.tochigi.jp", "mibu.tochigi.jp", "moka.tochigi.jp", "motegi.tochigi.jp", "nasu.tochigi.jp", "nasushiobara.tochigi.jp", "nikko.tochigi.jp", "nishikata.tochigi.jp", "nogi.tochigi.jp", "ohira.tochigi.jp", "ohtawara.tochigi.jp", "oyama.tochigi.jp", "sakura.tochigi.jp", "sano.tochigi.jp", "shimotsuke.tochigi.jp", "shioya.tochigi.jp", "takanezawa.tochigi.jp", "tochigi.tochigi.jp", "tsuga.tochigi.jp", "ujiie.tochigi.jp", "utsunomiya.tochigi.jp", "yaita.tochigi.jp", "aizumi.tokushima.jp", "anan.tokushima.jp", "ichiba.tokushima.jp", "itano.tokushima.jp", "kainan.tokushima.jp", "komatsushima.tokushima.jp", "matsushige.tokushima.jp", "mima.tokushima.jp", "minami.tokushima.jp", "miyoshi.tokushima.jp", "mugi.tokushima.jp", "nakagawa.tokushima.jp", "naruto.tokushima.jp", "sanagochi.tokushima.jp", "shishikui.tokushima.jp", "tokushima.tokushima.jp", "wajiki.tokushima.jp", "adachi.tokyo.jp", "akiruno.tokyo.jp", "akishima.tokyo.jp", "aogashima.tokyo.jp", "arakawa.tokyo.jp", "bunkyo.tokyo.jp", "chiyoda.tokyo.jp", "chofu.tokyo.jp", "chuo.tokyo.jp", "edogawa.tokyo.jp", "fuchu.tokyo.jp", "fussa.tokyo.jp", "hachijo.tokyo.jp", "hachioji.tokyo.jp", "hamura.tokyo.jp", "higashikurume.tokyo.jp", "higashimurayama.tokyo.jp", "higashiyamato.tokyo.jp", "hino.tokyo.jp", "hinode.tokyo.jp", "hinohara.tokyo.jp", "inagi.tokyo.jp", "itabashi.tokyo.jp", "katsushika.tokyo.jp", "kita.tokyo.jp", "kiyose.tokyo.jp", "kodaira.tokyo.jp", "koganei.tokyo.jp", "kokubunji.tokyo.jp", "komae.tokyo.jp", "koto.tokyo.jp", "kouzushima.tokyo.jp", "kunitachi.tokyo.jp", "machida.tokyo.jp", "meguro.tokyo.jp", "minato.tokyo.jp", "mitaka.tokyo.jp", "mizuho.tokyo.jp", "musashimurayama.tokyo.jp", "musashino.tokyo.jp", "nakano.tokyo.jp", "nerima.tokyo.jp", "ogasawara.tokyo.jp", "okutama.tokyo.jp", "ome.tokyo.jp", "oshima.tokyo.jp", "ota.tokyo.jp", "setagaya.tokyo.jp", "shibuya.tokyo.jp", "shinagawa.tokyo.jp", "shinjuku.tokyo.jp", "suginami.tokyo.jp", "sumida.tokyo.jp", "tachikawa.tokyo.jp", "taito.tokyo.jp", "tama.tokyo.jp", "toshima.tokyo.jp", "chizu.tottori.jp", "hino.tottori.jp", "kawahara.tottori.jp", "koge.tottori.jp", "kotoura.tottori.jp", "misasa.tottori.jp", "nanbu.tottori.jp", "nichinan.tottori.jp", "sakaiminato.tottori.jp", "tottori.tottori.jp", "wakasa.tottori.jp", "yazu.tottori.jp", "yonago.tottori.jp", "asahi.toyama.jp", "fuchu.toyama.jp", "fukumitsu.toyama.jp", "funahashi.toyama.jp", "himi.toyama.jp", "imizu.toyama.jp", "inami.toyama.jp", "johana.toyama.jp", "kamiichi.toyama.jp", "kurobe.toyama.jp", "nakaniikawa.toyama.jp", "namerikawa.toyama.jp", "nanto.toyama.jp", "nyuzen.toyama.jp", "oyabe.toyama.jp", "taira.toyama.jp", "takaoka.toyama.jp", "tateyama.toyama.jp", "toga.toyama.jp", "tonami.toyama.jp", "toyama.toyama.jp", "unazuki.toyama.jp", "uozu.toyama.jp", "yamada.toyama.jp", "arida.wakayama.jp", "aridagawa.wakayama.jp", "gobo.wakayama.jp", "hashimoto.wakayama.jp", "hidaka.wakayama.jp", "hirogawa.wakayama.jp", "inami.wakayama.jp", "iwade.wakayama.jp", "kainan.wakayama.jp", "kamitonda.wakayama.jp", "katsuragi.wakayama.jp", "kimino.wakayama.jp", "kinokawa.wakayama.jp", "kitayama.wakayama.jp", "koya.wakayama.jp", "koza.wakayama.jp", "kozagawa.wakayama.jp", "kudoyama.wakayama.jp", "kushimoto.wakayama.jp", "mihama.wakayama.jp", "misato.wakayama.jp", "nachikatsuura.wakayama.jp", "shingu.wakayama.jp", "shirahama.wakayama.jp", "taiji.wakayama.jp", "tanabe.wakayama.jp", "wakayama.wakayama.jp", "yuasa.wakayama.jp", "yura.wakayama.jp", "asahi.yamagata.jp", "funagata.yamagata.jp", "higashine.yamagata.jp", "iide.yamagata.jp", "kahoku.yamagata.jp", "kaminoyama.yamagata.jp", "kaneyama.yamagata.jp", "kawanishi.yamagata.jp", "mamurogawa.yamagata.jp", "mikawa.yamagata.jp", "murayama.yamagata.jp", "nagai.yamagata.jp", "nakayama.yamagata.jp", "nanyo.yamagata.jp", "nishikawa.yamagata.jp", "obanazawa.yamagata.jp", "oe.yamagata.jp", "oguni.yamagata.jp", "ohkura.yamagata.jp", "oishida.yamagata.jp", "sagae.yamagata.jp", "sakata.yamagata.jp", "sakegawa.yamagata.jp", "shinjo.yamagata.jp", "shirataka.yamagata.jp", "shonai.yamagata.jp", "takahata.yamagata.jp", "tendo.yamagata.jp", "tozawa.yamagata.jp", "tsuruoka.yamagata.jp", "yamagata.yamagata.jp", "yamanobe.yamagata.jp", "yonezawa.yamagata.jp", "yuza.yamagata.jp", "abu.yamaguchi.jp", "hagi.yamaguchi.jp", "hikari.yamaguchi.jp", "hofu.yamaguchi.jp", "iwakuni.yamaguchi.jp", "kudamatsu.yamaguchi.jp", "mitou.yamaguchi.jp", "nagato.yamaguchi.jp", "oshima.yamaguchi.jp", "shimonoseki.yamaguchi.jp", "shunan.yamaguchi.jp", "tabuse.yamaguchi.jp", "tokuyama.yamaguchi.jp", "toyota.yamaguchi.jp", "ube.yamaguchi.jp", "yuu.yamaguchi.jp", "chuo.yamanashi.jp", "doshi.yamanashi.jp", "fuefuki.yamanashi.jp", "fujikawa.yamanashi.jp", "fujikawaguchiko.yamanashi.jp", "fujiyoshida.yamanashi.jp", "hayakawa.yamanashi.jp", "hokuto.yamanashi.jp", "ichikawamisato.yamanashi.jp", "kai.yamanashi.jp", "kofu.yamanashi.jp", "koshu.yamanashi.jp", "kosuge.yamanashi.jp", "minami-alps.yamanashi.jp", "minobu.yamanashi.jp", "nakamichi.yamanashi.jp", "nanbu.yamanashi.jp", "narusawa.yamanashi.jp", "nirasaki.yamanashi.jp", "nishikatsura.yamanashi.jp", "oshino.yamanashi.jp", "otsuki.yamanashi.jp", "showa.yamanashi.jp", "tabayama.yamanashi.jp", "tsuru.yamanashi.jp", "uenohara.yamanashi.jp", "yamanakako.yamanashi.jp", "yamanashi.yamanashi.jp", "ke", "ac.ke", "co.ke", "go.ke", "info.ke", "me.ke", "mobi.ke", "ne.ke", "or.ke", "sc.ke", "kg", "com.kg", "edu.kg", "gov.kg", "mil.kg", "net.kg", "org.kg", "*.kh", "ki", "biz.ki", "com.ki", "edu.ki", "gov.ki", "info.ki", "net.ki", "org.ki", "km", "ass.km", "com.km", "edu.km", "gov.km", "mil.km", "nom.km", "org.km", "prd.km", "tm.km", "asso.km", "coop.km", "gouv.km", "medecin.km", "notaires.km", "pharmaciens.km", "presse.km", "veterinaire.km", "kn", "edu.kn", "gov.kn", "net.kn", "org.kn", "kp", "com.kp", "edu.kp", "gov.kp", "org.kp", "rep.kp", "tra.kp", "kr", "ac.kr", "co.kr", "es.kr", "go.kr", "hs.kr", "kg.kr", "mil.kr", "ms.kr", "ne.kr", "or.kr", "pe.kr", "re.kr", "sc.kr", "busan.kr", "chungbuk.kr", "chungnam.kr", "daegu.kr", "daejeon.kr", "gangwon.kr", "gwangju.kr", "gyeongbuk.kr", "gyeonggi.kr", "gyeongnam.kr", "incheon.kr", "jeju.kr", "jeonbuk.kr", "jeonnam.kr", "seoul.kr", "ulsan.kr", "kw", "com.kw", "edu.kw", "emb.kw", "gov.kw", "ind.kw", "net.kw", "org.kw", "ky", "com.ky", "edu.ky", "net.ky", "org.ky", "kz", "com.kz", "edu.kz", "gov.kz", "mil.kz", "net.kz", "org.kz", "la", "com.la", "edu.la", "gov.la", "info.la", "int.la", "net.la", "org.la", "per.la", "lb", "com.lb", "edu.lb", "gov.lb", "net.lb", "org.lb", "lc", "co.lc", "com.lc", "edu.lc", "gov.lc", "net.lc", "org.lc", "li", "lk", "ac.lk", "assn.lk", "com.lk", "edu.lk", "gov.lk", "grp.lk", "hotel.lk", "int.lk", "ltd.lk", "net.lk", "ngo.lk", "org.lk", "sch.lk", "soc.lk", "web.lk", "lr", "com.lr", "edu.lr", "gov.lr", "net.lr", "org.lr", "ls", "ac.ls", "biz.ls", "co.ls", "edu.ls", "gov.ls", "info.ls", "net.ls", "org.ls", "sc.ls", "lt", "gov.lt", "lu", "lv", "asn.lv", "com.lv", "conf.lv", "edu.lv", "gov.lv", "id.lv", "mil.lv", "net.lv", "org.lv", "ly", "com.ly", "edu.ly", "gov.ly", "id.ly", "med.ly", "net.ly", "org.ly", "plc.ly", "sch.ly", "ma", "ac.ma", "co.ma", "gov.ma", "net.ma", "org.ma", "press.ma", "mc", "asso.mc", "tm.mc", "md", "me", "ac.me", "co.me", "edu.me", "gov.me", "its.me", "net.me", "org.me", "priv.me", "mg", "co.mg", "com.mg", "edu.mg", "gov.mg", "mil.mg", "nom.mg", "org.mg", "prd.mg", "mh", "mil", "mk", "com.mk", "edu.mk", "gov.mk", "inf.mk", "name.mk", "net.mk", "org.mk", "ml", "com.ml", "edu.ml", "gouv.ml", "gov.ml", "net.ml", "org.ml", "presse.ml", "*.mm", "mn", "edu.mn", "gov.mn", "org.mn", "mo", "com.mo", "edu.mo", "gov.mo", "net.mo", "org.mo", "mobi", "mp", "mq", "mr", "gov.mr", "ms", "com.ms", "edu.ms", "gov.ms", "net.ms", "org.ms", "mt", "com.mt", "edu.mt", "net.mt", "org.mt", "mu", "ac.mu", "co.mu", "com.mu", "gov.mu", "net.mu", "or.mu", "org.mu", "museum", "mv", "aero.mv", "biz.mv", "com.mv", "coop.mv", "edu.mv", "gov.mv", "info.mv", "int.mv", "mil.mv", "museum.mv", "name.mv", "net.mv", "org.mv", "pro.mv", "mw", "ac.mw", "biz.mw", "co.mw", "com.mw", "coop.mw", "edu.mw", "gov.mw", "int.mw", "net.mw", "org.mw", "mx", "com.mx", "edu.mx", "gob.mx", "net.mx", "org.mx", "my", "biz.my", "com.my", "edu.my", "gov.my", "mil.my", "name.my", "net.my", "org.my", "mz", "ac.mz", "adv.mz", "co.mz", "edu.mz", "gov.mz", "mil.mz", "net.mz", "org.mz", "na", "alt.na", "co.na", "com.na", "gov.na", "net.na", "org.na", "name", "nc", "asso.nc", "nom.nc", "ne", "net", "nf", "arts.nf", "com.nf", "firm.nf", "info.nf", "net.nf", "other.nf", "per.nf", "rec.nf", "store.nf", "web.nf", "ng", "com.ng", "edu.ng", "gov.ng", "i.ng", "mil.ng", "mobi.ng", "name.ng", "net.ng", "org.ng", "sch.ng", "ni", "ac.ni", "biz.ni", "co.ni", "com.ni", "edu.ni", "gob.ni", "in.ni", "info.ni", "int.ni", "mil.ni", "net.ni", "nom.ni", "org.ni", "web.ni", "nl", "no", "fhs.no", "folkebibl.no", "fylkesbibl.no", "idrett.no", "museum.no", "priv.no", "vgs.no", "dep.no", "herad.no", "kommune.no", "mil.no", "stat.no", "aa.no", "ah.no", "bu.no", "fm.no", "hl.no", "hm.no", "jan-mayen.no", "mr.no", "nl.no", "nt.no", "of.no", "ol.no", "oslo.no", "rl.no", "sf.no", "st.no", "svalbard.no", "tm.no", "tr.no", "va.no", "vf.no", "gs.aa.no", "gs.ah.no", "gs.bu.no", "gs.fm.no", "gs.hl.no", "gs.hm.no", "gs.jan-mayen.no", "gs.mr.no", "gs.nl.no", "gs.nt.no", "gs.of.no", "gs.ol.no", "gs.oslo.no", "gs.rl.no", "gs.sf.no", "gs.st.no", "gs.svalbard.no", "gs.tm.no", "gs.tr.no", "gs.va.no", "gs.vf.no", "akrehamn.no", "\xE5krehamn.no", "algard.no", "\xE5lg\xE5rd.no", "arna.no", "bronnoysund.no", "br\xF8nn\xF8ysund.no", "brumunddal.no", "bryne.no", "drobak.no", "dr\xF8bak.no", "egersund.no", "fetsund.no", "floro.no", "flor\xF8.no", "fredrikstad.no", "hokksund.no", "honefoss.no", "h\xF8nefoss.no", "jessheim.no", "jorpeland.no", "j\xF8rpeland.no", "kirkenes.no", "kopervik.no", "krokstadelva.no", "langevag.no", "langev\xE5g.no", "leirvik.no", "mjondalen.no", "mj\xF8ndalen.no", "mo-i-rana.no", "mosjoen.no", "mosj\xF8en.no", "nesoddtangen.no", "orkanger.no", "osoyro.no", "os\xF8yro.no", "raholt.no", "r\xE5holt.no", "sandnessjoen.no", "sandnessj\xF8en.no", "skedsmokorset.no", "slattum.no", "spjelkavik.no", "stathelle.no", "stavern.no", "stjordalshalsen.no", "stj\xF8rdalshalsen.no", "tananger.no", "tranby.no", "vossevangen.no", "aarborte.no", "aejrie.no", "afjord.no", "\xE5fjord.no", "agdenes.no", "nes.akershus.no", "aknoluokta.no", "\xE1k\u014Boluokta.no", "al.no", "\xE5l.no", "alaheadju.no", "\xE1laheadju.no", "alesund.no", "\xE5lesund.no", "alstahaug.no", "alta.no", "\xE1lt\xE1.no", "alvdal.no", "amli.no", "\xE5mli.no", "amot.no", "\xE5mot.no", "andasuolo.no", "andebu.no", "andoy.no", "and\xF8y.no", "ardal.no", "\xE5rdal.no", "aremark.no", "arendal.no", "\xE5s.no", "aseral.no", "\xE5seral.no", "asker.no", "askim.no", "askoy.no", "ask\xF8y.no", "askvoll.no", "asnes.no", "\xE5snes.no", "audnedaln.no", "aukra.no", "aure.no", "aurland.no", "aurskog-holand.no", "aurskog-h\xF8land.no", "austevoll.no", "austrheim.no", "averoy.no", "aver\xF8y.no", "badaddja.no", "b\xE5d\xE5ddj\xE5.no", "b\xE6rum.no", "bahcavuotna.no", "b\xE1hcavuotna.no", "bahccavuotna.no", "b\xE1hccavuotna.no", "baidar.no", "b\xE1id\xE1r.no", "bajddar.no", "b\xE1jddar.no", "balat.no", "b\xE1l\xE1t.no", "balestrand.no", "ballangen.no", "balsfjord.no", "bamble.no", "bardu.no", "barum.no", "batsfjord.no", "b\xE5tsfjord.no", "bearalvahki.no", "bearalv\xE1hki.no", "beardu.no", "beiarn.no", "berg.no", "bergen.no", "berlevag.no", "berlev\xE5g.no", "bievat.no", "biev\xE1t.no", "bindal.no", "birkenes.no", "bjarkoy.no", "bjark\xF8y.no", "bjerkreim.no", "bjugn.no", "bodo.no", "bod\xF8.no", "bokn.no", "bomlo.no", "b\xF8mlo.no", "bremanger.no", "bronnoy.no", "br\xF8nn\xF8y.no", "budejju.no", "nes.buskerud.no", "bygland.no", "bykle.no", "cahcesuolo.no", "\u010D\xE1hcesuolo.no", "davvenjarga.no", "davvenj\xE1rga.no", "davvesiida.no", "deatnu.no", "dielddanuorri.no", "divtasvuodna.no", "divttasvuotna.no", "donna.no", "d\xF8nna.no", "dovre.no", "drammen.no", "drangedal.no", "dyroy.no", "dyr\xF8y.no", "eid.no", "eidfjord.no", "eidsberg.no", "eidskog.no", "eidsvoll.no", "eigersund.no", "elverum.no", "enebakk.no", "engerdal.no", "etne.no", "etnedal.no", "evenassi.no", "even\xE1\u0161\u0161i.no", "evenes.no", "evje-og-hornnes.no", "farsund.no", "fauske.no", "fedje.no", "fet.no", "finnoy.no", "finn\xF8y.no", "fitjar.no", "fjaler.no", "fjell.no", "fla.no", "fl\xE5.no", "flakstad.no", "flatanger.no", "flekkefjord.no", "flesberg.no", "flora.no", "folldal.no", "forde.no", "f\xF8rde.no", "forsand.no", "fosnes.no", "fr\xE6na.no", "frana.no", "frei.no", "frogn.no", "froland.no", "frosta.no", "froya.no", "fr\xF8ya.no", "fuoisku.no", "fuossko.no", "fusa.no", "fyresdal.no", "gaivuotna.no", "g\xE1ivuotna.no", "galsa.no", "g\xE1ls\xE1.no", "gamvik.no", "gangaviika.no", "g\xE1\u014Bgaviika.no", "gaular.no", "gausdal.no", "giehtavuoatna.no", "gildeskal.no", "gildesk\xE5l.no", "giske.no", "gjemnes.no", "gjerdrum.no", "gjerstad.no", "gjesdal.no", "gjovik.no", "gj\xF8vik.no", "gloppen.no", "gol.no", "gran.no", "grane.no", "granvin.no", "gratangen.no", "grimstad.no", "grong.no", "grue.no", "gulen.no", "guovdageaidnu.no", "ha.no", "h\xE5.no", "habmer.no", "h\xE1bmer.no", "hadsel.no", "h\xE6gebostad.no", "hagebostad.no", "halden.no", "halsa.no", "hamar.no", "hamaroy.no", "hammarfeasta.no", "h\xE1mm\xE1rfeasta.no", "hammerfest.no", "hapmir.no", "h\xE1pmir.no", "haram.no", "hareid.no", "harstad.no", "hasvik.no", "hattfjelldal.no", "haugesund.no", "os.hedmark.no", "valer.hedmark.no", "v\xE5ler.hedmark.no", "hemne.no", "hemnes.no", "hemsedal.no", "hitra.no", "hjartdal.no", "hjelmeland.no", "hobol.no", "hob\xF8l.no", "hof.no", "hol.no", "hole.no", "holmestrand.no", "holtalen.no", "holt\xE5len.no", "os.hordaland.no", "hornindal.no", "horten.no", "hoyanger.no", "h\xF8yanger.no", "hoylandet.no", "h\xF8ylandet.no", "hurdal.no", "hurum.no", "hvaler.no", "hyllestad.no", "ibestad.no", "inderoy.no", "inder\xF8y.no", "iveland.no", "ivgu.no", "jevnaker.no", "jolster.no", "j\xF8lster.no", "jondal.no", "kafjord.no", "k\xE5fjord.no", "karasjohka.no", "k\xE1r\xE1\u0161johka.no", "karasjok.no", "karlsoy.no", "karmoy.no", "karm\xF8y.no", "kautokeino.no", "klabu.no", "kl\xE6bu.no", "klepp.no", "kongsberg.no", "kongsvinger.no", "kraanghke.no", "kr\xE5anghke.no", "kragero.no", "krager\xF8.no", "kristiansand.no", "kristiansund.no", "krodsherad.no", "kr\xF8dsherad.no", "kv\xE6fjord.no", "kv\xE6nangen.no", "kvafjord.no", "kvalsund.no", "kvam.no", "kvanangen.no", "kvinesdal.no", "kvinnherad.no", "kviteseid.no", "kvitsoy.no", "kvits\xF8y.no", "laakesvuemie.no", "l\xE6rdal.no", "lahppi.no", "l\xE1hppi.no", "lardal.no", "larvik.no", "lavagis.no", "lavangen.no", "leangaviika.no", "lea\u014Bgaviika.no", "lebesby.no", "leikanger.no", "leirfjord.no", "leka.no", "leksvik.no", "lenvik.no", "lerdal.no", "lesja.no", "levanger.no", "lier.no", "lierne.no", "lillehammer.no", "lillesand.no", "lindas.no", "lind\xE5s.no", "lindesnes.no", "loabat.no", "loab\xE1t.no", "lodingen.no", "l\xF8dingen.no", "lom.no", "loppa.no", "lorenskog.no", "l\xF8renskog.no", "loten.no", "l\xF8ten.no", "lund.no", "lunner.no", "luroy.no", "lur\xF8y.no", "luster.no", "lyngdal.no", "lyngen.no", "malatvuopmi.no", "m\xE1latvuopmi.no", "malselv.no", "m\xE5lselv.no", "malvik.no", "mandal.no", "marker.no", "marnardal.no", "masfjorden.no", "masoy.no", "m\xE5s\xF8y.no", "matta-varjjat.no", "m\xE1tta-v\xE1rjjat.no", "meland.no", "meldal.no", "melhus.no", "meloy.no", "mel\xF8y.no", "meraker.no", "mer\xE5ker.no", "midsund.no", "midtre-gauldal.no", "moareke.no", "mo\xE5reke.no", "modalen.no", "modum.no", "molde.no", "heroy.more-og-romsdal.no", "sande.more-og-romsdal.no", "her\xF8y.m\xF8re-og-romsdal.no", "sande.m\xF8re-og-romsdal.no", "moskenes.no", "moss.no", "mosvik.no", "muosat.no", "muos\xE1t.no", "naamesjevuemie.no", "n\xE5\xE5mesjevuemie.no", "n\xE6r\xF8y.no", "namdalseid.no", "namsos.no", "namsskogan.no", "nannestad.no", "naroy.no", "narviika.no", "narvik.no", "naustdal.no", "navuotna.no", "n\xE1vuotna.no", "nedre-eiker.no", "nesna.no", "nesodden.no", "nesseby.no", "nesset.no", "nissedal.no", "nittedal.no", "nord-aurdal.no", "nord-fron.no", "nord-odal.no", "norddal.no", "nordkapp.no", "bo.nordland.no", "b\xF8.nordland.no", "heroy.nordland.no", "her\xF8y.nordland.no", "nordre-land.no", "nordreisa.no", "nore-og-uvdal.no", "notodden.no", "notteroy.no", "n\xF8tter\xF8y.no", "odda.no", "oksnes.no", "\xF8ksnes.no", "omasvuotna.no", "oppdal.no", "oppegard.no", "oppeg\xE5rd.no", "orkdal.no", "orland.no", "\xF8rland.no", "orskog.no", "\xF8rskog.no", "orsta.no", "\xF8rsta.no", "osen.no", "osteroy.no", "oster\xF8y.no", "valer.ostfold.no", "v\xE5ler.\xF8stfold.no", "ostre-toten.no", "\xF8stre-toten.no", "overhalla.no", "ovre-eiker.no", "\xF8vre-eiker.no", "oyer.no", "\xF8yer.no", "oygarden.no", "\xF8ygarden.no", "oystre-slidre.no", "\xF8ystre-slidre.no", "porsanger.no", "porsangu.no", "pors\xE1\u014Bgu.no", "porsgrunn.no", "rade.no", "r\xE5de.no", "radoy.no", "rad\xF8y.no", "r\xE6lingen.no", "rahkkeravju.no", "r\xE1hkker\xE1vju.no", "raisa.no", "r\xE1isa.no", "rakkestad.no", "ralingen.no", "rana.no", "randaberg.no", "rauma.no", "rendalen.no", "rennebu.no", "rennesoy.no", "rennes\xF8y.no", "rindal.no", "ringebu.no", "ringerike.no", "ringsaker.no", "risor.no", "ris\xF8r.no", "rissa.no", "roan.no", "rodoy.no", "r\xF8d\xF8y.no", "rollag.no", "romsa.no", "romskog.no", "r\xF8mskog.no", "roros.no", "r\xF8ros.no", "rost.no", "r\xF8st.no", "royken.no", "r\xF8yken.no", "royrvik.no", "r\xF8yrvik.no", "ruovat.no", "rygge.no", "salangen.no", "salat.no", "s\xE1lat.no", "s\xE1l\xE1t.no", "saltdal.no", "samnanger.no", "sandefjord.no", "sandnes.no", "sandoy.no", "sand\xF8y.no", "sarpsborg.no", "sauda.no", "sauherad.no", "sel.no", "selbu.no", "selje.no", "seljord.no", "siellak.no", "sigdal.no", "siljan.no", "sirdal.no", "skanit.no", "sk\xE1nit.no", "skanland.no", "sk\xE5nland.no", "skaun.no", "skedsmo.no", "ski.no", "skien.no", "skierva.no", "skierv\xE1.no", "skiptvet.no", "skjak.no", "skj\xE5k.no", "skjervoy.no", "skjerv\xF8y.no", "skodje.no", "smola.no", "sm\xF8la.no", "snaase.no", "sn\xE5ase.no", "snasa.no", "sn\xE5sa.no", "snillfjord.no", "snoasa.no", "sogndal.no", "sogne.no", "s\xF8gne.no", "sokndal.no", "sola.no", "solund.no", "somna.no", "s\xF8mna.no", "sondre-land.no", "s\xF8ndre-land.no", "songdalen.no", "sor-aurdal.no", "s\xF8r-aurdal.no", "sor-fron.no", "s\xF8r-fron.no", "sor-odal.no", "s\xF8r-odal.no", "sor-varanger.no", "s\xF8r-varanger.no", "sorfold.no", "s\xF8rfold.no", "sorreisa.no", "s\xF8rreisa.no", "sortland.no", "sorum.no", "s\xF8rum.no", "spydeberg.no", "stange.no", "stavanger.no", "steigen.no", "steinkjer.no", "stjordal.no", "stj\xF8rdal.no", "stokke.no", "stor-elvdal.no", "stord.no", "stordal.no", "storfjord.no", "strand.no", "stranda.no", "stryn.no", "sula.no", "suldal.no", "sund.no", "sunndal.no", "surnadal.no", "sveio.no", "svelvik.no", "sykkylven.no", "tana.no", "bo.telemark.no", "b\xF8.telemark.no", "time.no", "tingvoll.no", "tinn.no", "tjeldsund.no", "tjome.no", "tj\xF8me.no", "tokke.no", "tolga.no", "tonsberg.no", "t\xF8nsberg.no", "torsken.no", "tr\xE6na.no", "trana.no", "tranoy.no", "tran\xF8y.no", "troandin.no", "trogstad.no", "tr\xF8gstad.no", "tromsa.no", "tromso.no", "troms\xF8.no", "trondheim.no", "trysil.no", "tvedestrand.no", "tydal.no", "tynset.no", "tysfjord.no", "tysnes.no", "tysv\xE6r.no", "tysvar.no", "ullensaker.no", "ullensvang.no", "ulvik.no", "unjarga.no", "unj\xE1rga.no", "utsira.no", "vaapste.no", "vadso.no", "vads\xF8.no", "v\xE6r\xF8y.no", "vaga.no", "v\xE5g\xE5.no", "vagan.no", "v\xE5gan.no", "vagsoy.no", "v\xE5gs\xF8y.no", "vaksdal.no", "valle.no", "vang.no", "vanylven.no", "vardo.no", "vard\xF8.no", "varggat.no", "v\xE1rgg\xE1t.no", "varoy.no", "vefsn.no", "vega.no", "vegarshei.no", "veg\xE5rshei.no", "vennesla.no", "verdal.no", "verran.no", "vestby.no", "sande.vestfold.no", "vestnes.no", "vestre-slidre.no", "vestre-toten.no", "vestvagoy.no", "vestv\xE5g\xF8y.no", "vevelstad.no", "vik.no", "vikna.no", "vindafjord.no", "voagat.no", "volda.no", "voss.no", "*.np", "nr", "biz.nr", "com.nr", "edu.nr", "gov.nr", "info.nr", "net.nr", "org.nr", "nu", "nz", "ac.nz", "co.nz", "cri.nz", "geek.nz", "gen.nz", "govt.nz", "health.nz", "iwi.nz", "kiwi.nz", "maori.nz", "m\u0101ori.nz", "mil.nz", "net.nz", "org.nz", "parliament.nz", "school.nz", "om", "co.om", "com.om", "edu.om", "gov.om", "med.om", "museum.om", "net.om", "org.om", "pro.om", "onion", "org", "pa", "abo.pa", "ac.pa", "com.pa", "edu.pa", "gob.pa", "ing.pa", "med.pa", "net.pa", "nom.pa", "org.pa", "sld.pa", "pe", "com.pe", "edu.pe", "gob.pe", "mil.pe", "net.pe", "nom.pe", "org.pe", "pf", "com.pf", "edu.pf", "org.pf", "*.pg", "ph", "com.ph", "edu.ph", "gov.ph", "i.ph", "mil.ph", "net.ph", "ngo.ph", "org.ph", "pk", "ac.pk", "biz.pk", "com.pk", "edu.pk", "fam.pk", "gkp.pk", "gob.pk", "gog.pk", "gok.pk", "gon.pk", "gop.pk", "gos.pk", "gov.pk", "net.pk", "org.pk", "web.pk", "pl", "com.pl", "net.pl", "org.pl", "agro.pl", "aid.pl", "atm.pl", "auto.pl", "biz.pl", "edu.pl", "gmina.pl", "gsm.pl", "info.pl", "mail.pl", "media.pl", "miasta.pl", "mil.pl", "nieruchomosci.pl", "nom.pl", "pc.pl", "powiat.pl", "priv.pl", "realestate.pl", "rel.pl", "sex.pl", "shop.pl", "sklep.pl", "sos.pl", "szkola.pl", "targi.pl", "tm.pl", "tourism.pl", "travel.pl", "turystyka.pl", "gov.pl", "ap.gov.pl", "griw.gov.pl", "ic.gov.pl", "is.gov.pl", "kmpsp.gov.pl", "konsulat.gov.pl", "kppsp.gov.pl", "kwp.gov.pl", "kwpsp.gov.pl", "mup.gov.pl", "mw.gov.pl", "oia.gov.pl", "oirm.gov.pl", "oke.gov.pl", "oow.gov.pl", "oschr.gov.pl", "oum.gov.pl", "pa.gov.pl", "pinb.gov.pl", "piw.gov.pl", "po.gov.pl", "pr.gov.pl", "psp.gov.pl", "psse.gov.pl", "pup.gov.pl", "rzgw.gov.pl", "sa.gov.pl", "sdn.gov.pl", "sko.gov.pl", "so.gov.pl", "sr.gov.pl", "starostwo.gov.pl", "ug.gov.pl", "ugim.gov.pl", "um.gov.pl", "umig.gov.pl", "upow.gov.pl", "uppo.gov.pl", "us.gov.pl", "uw.gov.pl", "uzs.gov.pl", "wif.gov.pl", "wiih.gov.pl", "winb.gov.pl", "wios.gov.pl", "witd.gov.pl", "wiw.gov.pl", "wkz.gov.pl", "wsa.gov.pl", "wskr.gov.pl", "wsse.gov.pl", "wuoz.gov.pl", "wzmiuw.gov.pl", "zp.gov.pl", "zpisdn.gov.pl", "augustow.pl", "babia-gora.pl", "bedzin.pl", "beskidy.pl", "bialowieza.pl", "bialystok.pl", "bielawa.pl", "bieszczady.pl", "boleslawiec.pl", "bydgoszcz.pl", "bytom.pl", "cieszyn.pl", "czeladz.pl", "czest.pl", "dlugoleka.pl", "elblag.pl", "elk.pl", "glogow.pl", "gniezno.pl", "gorlice.pl", "grajewo.pl", "ilawa.pl", "jaworzno.pl", "jelenia-gora.pl", "jgora.pl", "kalisz.pl", "karpacz.pl", "kartuzy.pl", "kaszuby.pl", "katowice.pl", "kazimierz-dolny.pl", "kepno.pl", "ketrzyn.pl", "klodzko.pl", "kobierzyce.pl", "kolobrzeg.pl", "konin.pl", "konskowola.pl", "kutno.pl", "lapy.pl", "lebork.pl", "legnica.pl", "lezajsk.pl", "limanowa.pl", "lomza.pl", "lowicz.pl", "lubin.pl", "lukow.pl", "malbork.pl", "malopolska.pl", "mazowsze.pl", "mazury.pl", "mielec.pl", "mielno.pl", "mragowo.pl", "naklo.pl", "nowaruda.pl", "nysa.pl", "olawa.pl", "olecko.pl", "olkusz.pl", "olsztyn.pl", "opoczno.pl", "opole.pl", "ostroda.pl", "ostroleka.pl", "ostrowiec.pl", "ostrowwlkp.pl", "pila.pl", "pisz.pl", "podhale.pl", "podlasie.pl", "polkowice.pl", "pomorskie.pl", "pomorze.pl", "prochowice.pl", "pruszkow.pl", "przeworsk.pl", "pulawy.pl", "radom.pl", "rawa-maz.pl", "rybnik.pl", "rzeszow.pl", "sanok.pl", "sejny.pl", "skoczow.pl", "slask.pl", "slupsk.pl", "sosnowiec.pl", "stalowa-wola.pl", "starachowice.pl", "stargard.pl", "suwalki.pl", "swidnica.pl", "swiebodzin.pl", "swinoujscie.pl", "szczecin.pl", "szczytno.pl", "tarnobrzeg.pl", "tgory.pl", "turek.pl", "tychy.pl", "ustka.pl", "walbrzych.pl", "warmia.pl", "warszawa.pl", "waw.pl", "wegrow.pl", "wielun.pl", "wlocl.pl", "wloclawek.pl", "wodzislaw.pl", "wolomin.pl", "wroclaw.pl", "zachpomor.pl", "zagan.pl", "zarow.pl", "zgora.pl", "zgorzelec.pl", "pm", "pn", "co.pn", "edu.pn", "gov.pn", "net.pn", "org.pn", "post", "pr", "biz.pr", "com.pr", "edu.pr", "gov.pr", "info.pr", "isla.pr", "name.pr", "net.pr", "org.pr", "pro.pr", "ac.pr", "est.pr", "prof.pr", "pro", "aaa.pro", "aca.pro", "acct.pro", "avocat.pro", "bar.pro", "cpa.pro", "eng.pro", "jur.pro", "law.pro", "med.pro", "recht.pro", "ps", "com.ps", "edu.ps", "gov.ps", "net.ps", "org.ps", "plo.ps", "sec.ps", "pt", "com.pt", "edu.pt", "gov.pt", "int.pt", "net.pt", "nome.pt", "org.pt", "publ.pt", "pw", "belau.pw", "co.pw", "ed.pw", "go.pw", "or.pw", "py", "com.py", "coop.py", "edu.py", "gov.py", "mil.py", "net.py", "org.py", "qa", "com.qa", "edu.qa", "gov.qa", "mil.qa", "name.qa", "net.qa", "org.qa", "sch.qa", "re", "asso.re", "com.re", "ro", "arts.ro", "com.ro", "firm.ro", "info.ro", "nom.ro", "nt.ro", "org.ro", "rec.ro", "store.ro", "tm.ro", "www.ro", "rs", "ac.rs", "co.rs", "edu.rs", "gov.rs", "in.rs", "org.rs", "ru", "rw", "ac.rw", "co.rw", "coop.rw", "gov.rw", "mil.rw", "net.rw", "org.rw", "sa", "com.sa", "edu.sa", "gov.sa", "med.sa", "net.sa", "org.sa", "pub.sa", "sch.sa", "sb", "com.sb", "edu.sb", "gov.sb", "net.sb", "org.sb", "sc", "com.sc", "edu.sc", "gov.sc", "net.sc", "org.sc", "sd", "com.sd", "edu.sd", "gov.sd", "info.sd", "med.sd", "net.sd", "org.sd", "tv.sd", "se", "a.se", "ac.se", "b.se", "bd.se", "brand.se", "c.se", "d.se", "e.se", "f.se", "fh.se", "fhsk.se", "fhv.se", "g.se", "h.se", "i.se", "k.se", "komforb.se", "kommunalforbund.se", "komvux.se", "l.se", "lanbib.se", "m.se", "n.se", "naturbruksgymn.se", "o.se", "org.se", "p.se", "parti.se", "pp.se", "press.se", "r.se", "s.se", "t.se", "tm.se", "u.se", "w.se", "x.se", "y.se", "z.se", "sg", "com.sg", "edu.sg", "gov.sg", "net.sg", "org.sg", "sh", "com.sh", "gov.sh", "mil.sh", "net.sh", "org.sh", "si", "sj", "sk", "sl", "com.sl", "edu.sl", "gov.sl", "net.sl", "org.sl", "sm", "sn", "art.sn", "com.sn", "edu.sn", "gouv.sn", "org.sn", "perso.sn", "univ.sn", "so", "com.so", "edu.so", "gov.so", "me.so", "net.so", "org.so", "sr", "ss", "biz.ss", "co.ss", "com.ss", "edu.ss", "gov.ss", "me.ss", "net.ss", "org.ss", "sch.ss", "st", "co.st", "com.st", "consulado.st", "edu.st", "embaixada.st", "mil.st", "net.st", "org.st", "principe.st", "saotome.st", "store.st", "su", "sv", "com.sv", "edu.sv", "gob.sv", "org.sv", "red.sv", "sx", "gov.sx", "sy", "com.sy", "edu.sy", "gov.sy", "mil.sy", "net.sy", "org.sy", "sz", "ac.sz", "co.sz", "org.sz", "tc", "td", "tel", "tf", "tg", "th", "ac.th", "co.th", "go.th", "in.th", "mi.th", "net.th", "or.th", "tj", "ac.tj", "biz.tj", "co.tj", "com.tj", "edu.tj", "go.tj", "gov.tj", "int.tj", "mil.tj", "name.tj", "net.tj", "nic.tj", "org.tj", "test.tj", "web.tj", "tk", "tl", "gov.tl", "tm", "co.tm", "com.tm", "edu.tm", "gov.tm", "mil.tm", "net.tm", "nom.tm", "org.tm", "tn", "com.tn", "ens.tn", "fin.tn", "gov.tn", "ind.tn", "info.tn", "intl.tn", "mincom.tn", "nat.tn", "net.tn", "org.tn", "perso.tn", "tourism.tn", "to", "com.to", "edu.to", "gov.to", "mil.to", "net.to", "org.to", "tr", "av.tr", "bbs.tr", "bel.tr", "biz.tr", "com.tr", "dr.tr", "edu.tr", "gen.tr", "gov.tr", "info.tr", "k12.tr", "kep.tr", "mil.tr", "name.tr", "net.tr", "org.tr", "pol.tr", "tel.tr", "tsk.tr", "tv.tr", "web.tr", "nc.tr", "gov.nc.tr", "tt", "biz.tt", "co.tt", "com.tt", "edu.tt", "gov.tt", "info.tt", "mil.tt", "name.tt", "net.tt", "org.tt", "pro.tt", "tv", "tw", "club.tw", "com.tw", "ebiz.tw", "edu.tw", "game.tw", "gov.tw", "idv.tw", "mil.tw", "net.tw", "org.tw", "tz", "ac.tz", "co.tz", "go.tz", "hotel.tz", "info.tz", "me.tz", "mil.tz", "mobi.tz", "ne.tz", "or.tz", "sc.tz", "tv.tz", "ua", "com.ua", "edu.ua", "gov.ua", "in.ua", "net.ua", "org.ua", "cherkassy.ua", "cherkasy.ua", "chernigov.ua", "chernihiv.ua", "chernivtsi.ua", "chernovtsy.ua", "ck.ua", "cn.ua", "cr.ua", "crimea.ua", "cv.ua", "dn.ua", "dnepropetrovsk.ua", "dnipropetrovsk.ua", "donetsk.ua", "dp.ua", "if.ua", "ivano-frankivsk.ua", "kh.ua", "kharkiv.ua", "kharkov.ua", "kherson.ua", "khmelnitskiy.ua", "khmelnytskyi.ua", "kiev.ua", "kirovograd.ua", "km.ua", "kr.ua", "kropyvnytskyi.ua", "krym.ua", "ks.ua", "kv.ua", "kyiv.ua", "lg.ua", "lt.ua", "lugansk.ua", "luhansk.ua", "lutsk.ua", "lv.ua", "lviv.ua", "mk.ua", "mykolaiv.ua", "nikolaev.ua", "od.ua", "odesa.ua", "odessa.ua", "pl.ua", "poltava.ua", "rivne.ua", "rovno.ua", "rv.ua", "sb.ua", "sebastopol.ua", "sevastopol.ua", "sm.ua", "sumy.ua", "te.ua", "ternopil.ua", "uz.ua", "uzhgorod.ua", "uzhhorod.ua", "vinnica.ua", "vinnytsia.ua", "vn.ua", "volyn.ua", "yalta.ua", "zakarpattia.ua", "zaporizhzhe.ua", "zaporizhzhia.ua", "zhitomir.ua", "zhytomyr.ua", "zp.ua", "zt.ua", "ug", "ac.ug", "co.ug", "com.ug", "go.ug", "ne.ug", "or.ug", "org.ug", "sc.ug", "uk", "ac.uk", "co.uk", "gov.uk", "ltd.uk", "me.uk", "net.uk", "nhs.uk", "org.uk", "plc.uk", "police.uk", "*.sch.uk", "us", "dni.us", "fed.us", "isa.us", "kids.us", "nsn.us", "ak.us", "al.us", "ar.us", "as.us", "az.us", "ca.us", "co.us", "ct.us", "dc.us", "de.us", "fl.us", "ga.us", "gu.us", "hi.us", "ia.us", "id.us", "il.us", "in.us", "ks.us", "ky.us", "la.us", "ma.us", "md.us", "me.us", "mi.us", "mn.us", "mo.us", "ms.us", "mt.us", "nc.us", "nd.us", "ne.us", "nh.us", "nj.us", "nm.us", "nv.us", "ny.us", "oh.us", "ok.us", "or.us", "pa.us", "pr.us", "ri.us", "sc.us", "sd.us", "tn.us", "tx.us", "ut.us", "va.us", "vi.us", "vt.us", "wa.us", "wi.us", "wv.us", "wy.us", "k12.ak.us", "k12.al.us", "k12.ar.us", "k12.as.us", "k12.az.us", "k12.ca.us", "k12.co.us", "k12.ct.us", "k12.dc.us", "k12.fl.us", "k12.ga.us", "k12.gu.us", "k12.ia.us", "k12.id.us", "k12.il.us", "k12.in.us", "k12.ks.us", "k12.ky.us", "k12.la.us", "k12.ma.us", "k12.md.us", "k12.me.us", "k12.mi.us", "k12.mn.us", "k12.mo.us", "k12.ms.us", "k12.mt.us", "k12.nc.us", "k12.ne.us", "k12.nh.us", "k12.nj.us", "k12.nm.us", "k12.nv.us", "k12.ny.us", "k12.oh.us", "k12.ok.us", "k12.or.us", "k12.pa.us", "k12.pr.us", "k12.sc.us", "k12.tn.us", "k12.tx.us", "k12.ut.us", "k12.va.us", "k12.vi.us", "k12.vt.us", "k12.wa.us", "k12.wi.us", "cc.ak.us", "lib.ak.us", "cc.al.us", "lib.al.us", "cc.ar.us", "lib.ar.us", "cc.as.us", "lib.as.us", "cc.az.us", "lib.az.us", "cc.ca.us", "lib.ca.us", "cc.co.us", "lib.co.us", "cc.ct.us", "lib.ct.us", "cc.dc.us", "lib.dc.us", "cc.de.us", "cc.fl.us", "cc.ga.us", "cc.gu.us", "cc.hi.us", "cc.ia.us", "cc.id.us", "cc.il.us", "cc.in.us", "cc.ks.us", "cc.ky.us", "cc.la.us", "cc.ma.us", "cc.md.us", "cc.me.us", "cc.mi.us", "cc.mn.us", "cc.mo.us", "cc.ms.us", "cc.mt.us", "cc.nc.us", "cc.nd.us", "cc.ne.us", "cc.nh.us", "cc.nj.us", "cc.nm.us", "cc.nv.us", "cc.ny.us", "cc.oh.us", "cc.ok.us", "cc.or.us", "cc.pa.us", "cc.pr.us", "cc.ri.us", "cc.sc.us", "cc.sd.us", "cc.tn.us", "cc.tx.us", "cc.ut.us", "cc.va.us", "cc.vi.us", "cc.vt.us", "cc.wa.us", "cc.wi.us", "cc.wv.us", "cc.wy.us", "k12.wy.us", "lib.fl.us", "lib.ga.us", "lib.gu.us", "lib.hi.us", "lib.ia.us", "lib.id.us", "lib.il.us", "lib.in.us", "lib.ks.us", "lib.ky.us", "lib.la.us", "lib.ma.us", "lib.md.us", "lib.me.us", "lib.mi.us", "lib.mn.us", "lib.mo.us", "lib.ms.us", "lib.mt.us", "lib.nc.us", "lib.nd.us", "lib.ne.us", "lib.nh.us", "lib.nj.us", "lib.nm.us", "lib.nv.us", "lib.ny.us", "lib.oh.us", "lib.ok.us", "lib.or.us", "lib.pa.us", "lib.pr.us", "lib.ri.us", "lib.sc.us", "lib.sd.us", "lib.tn.us", "lib.tx.us", "lib.ut.us", "lib.va.us", "lib.vi.us", "lib.vt.us", "lib.wa.us", "lib.wi.us", "lib.wy.us", "chtr.k12.ma.us", "paroch.k12.ma.us", "pvt.k12.ma.us", "ann-arbor.mi.us", "cog.mi.us", "dst.mi.us", "eaton.mi.us", "gen.mi.us", "mus.mi.us", "tec.mi.us", "washtenaw.mi.us", "uy", "com.uy", "edu.uy", "gub.uy", "mil.uy", "net.uy", "org.uy", "uz", "co.uz", "com.uz", "net.uz", "org.uz", "va", "vc", "com.vc", "edu.vc", "gov.vc", "mil.vc", "net.vc", "org.vc", "ve", "arts.ve", "bib.ve", "co.ve", "com.ve", "e12.ve", "edu.ve", "firm.ve", "gob.ve", "gov.ve", "info.ve", "int.ve", "mil.ve", "net.ve", "nom.ve", "org.ve", "rar.ve", "rec.ve", "store.ve", "tec.ve", "web.ve", "vg", "vi", "co.vi", "com.vi", "k12.vi", "net.vi", "org.vi", "vn", "ac.vn", "ai.vn", "biz.vn", "com.vn", "edu.vn", "gov.vn", "health.vn", "id.vn", "info.vn", "int.vn", "io.vn", "name.vn", "net.vn", "org.vn", "pro.vn", "angiang.vn", "bacgiang.vn", "backan.vn", "baclieu.vn", "bacninh.vn", "baria-vungtau.vn", "bentre.vn", "binhdinh.vn", "binhduong.vn", "binhphuoc.vn", "binhthuan.vn", "camau.vn", "cantho.vn", "caobang.vn", "daklak.vn", "daknong.vn", "danang.vn", "dienbien.vn", "dongnai.vn", "dongthap.vn", "gialai.vn", "hagiang.vn", "haiduong.vn", "haiphong.vn", "hanam.vn", "hanoi.vn", "hatinh.vn", "haugiang.vn", "hoabinh.vn", "hungyen.vn", "khanhhoa.vn", "kiengiang.vn", "kontum.vn", "laichau.vn", "lamdong.vn", "langson.vn", "laocai.vn", "longan.vn", "namdinh.vn", "nghean.vn", "ninhbinh.vn", "ninhthuan.vn", "phutho.vn", "phuyen.vn", "quangbinh.vn", "quangnam.vn", "quangngai.vn", "quangninh.vn", "quangtri.vn", "soctrang.vn", "sonla.vn", "tayninh.vn", "thaibinh.vn", "thainguyen.vn", "thanhhoa.vn", "thanhphohochiminh.vn", "thuathienhue.vn", "tiengiang.vn", "travinh.vn", "tuyenquang.vn", "vinhlong.vn", "vinhphuc.vn", "yenbai.vn", "vu", "com.vu", "edu.vu", "net.vu", "org.vu", "wf", "ws", "com.ws", "edu.ws", "gov.ws", "net.ws", "org.ws", "yt", "\u0627\u0645\u0627\u0631\u0627\u062A", "\u0570\u0561\u0575", "\u09AC\u09BE\u0982\u09B2\u09BE", "\u0431\u0433", "\u0627\u0644\u0628\u062D\u0631\u064A\u0646", "\u0431\u0435\u043B", "\u4E2D\u56FD", "\u4E2D\u570B", "\u0627\u0644\u062C\u0632\u0627\u0626\u0631", "\u0645\u0635\u0631", "\u0435\u044E", "\u03B5\u03C5", "\u0645\u0648\u0631\u064A\u062A\u0627\u0646\u064A\u0627", "\u10D2\u10D4", "\u03B5\u03BB", "\u9999\u6E2F", "\u500B\u4EBA.\u9999\u6E2F", "\u516C\u53F8.\u9999\u6E2F", "\u653F\u5E9C.\u9999\u6E2F", "\u6559\u80B2.\u9999\u6E2F", "\u7D44\u7E54.\u9999\u6E2F", "\u7DB2\u7D61.\u9999\u6E2F", "\u0CAD\u0CBE\u0CB0\u0CA4", "\u0B2D\u0B3E\u0B30\u0B24", "\u09AD\u09BE\u09F0\u09A4", "\u092D\u093E\u0930\u0924\u092E\u094D", "\u092D\u093E\u0930\u094B\u0924", "\u0680\u0627\u0631\u062A", "\u0D2D\u0D3E\u0D30\u0D24\u0D02", "\u092D\u093E\u0930\u0924", "\u0628\u0627\u0631\u062A", "\u0628\u06BE\u0627\u0631\u062A", "\u0C2D\u0C3E\u0C30\u0C24\u0C4D", "\u0AAD\u0ABE\u0AB0\u0AA4", "\u0A2D\u0A3E\u0A30\u0A24", "\u09AD\u09BE\u09B0\u09A4", "\u0B87\u0BA8\u0BCD\u0BA4\u0BBF\u0BAF\u0BBE", "\u0627\u06CC\u0631\u0627\u0646", "\u0627\u064A\u0631\u0627\u0646", "\u0639\u0631\u0627\u0642", "\u0627\u0644\u0627\u0631\u062F\u0646", "\uD55C\uAD6D", "\u049B\u0430\u0437", "\u0EA5\u0EB2\u0EA7", "\u0DBD\u0D82\u0D9A\u0DCF", "\u0B87\u0BB2\u0B99\u0BCD\u0B95\u0BC8", "\u0627\u0644\u0645\u063A\u0631\u0628", "\u043C\u043A\u0434", "\u043C\u043E\u043D", "\u6FB3\u9580", "\u6FB3\u95E8", "\u0645\u0644\u064A\u0633\u064A\u0627", "\u0639\u0645\u0627\u0646", "\u067E\u0627\u06A9\u0633\u062A\u0627\u0646", "\u067E\u0627\u0643\u0633\u062A\u0627\u0646", "\u0641\u0644\u0633\u0637\u064A\u0646", "\u0441\u0440\u0431", "\u0430\u043A.\u0441\u0440\u0431", "\u043E\u0431\u0440.\u0441\u0440\u0431", "\u043E\u0434.\u0441\u0440\u0431", "\u043E\u0440\u0433.\u0441\u0440\u0431", "\u043F\u0440.\u0441\u0440\u0431", "\u0443\u043F\u0440.\u0441\u0440\u0431", "\u0440\u0444", "\u0642\u0637\u0631", "\u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629", "\u0627\u0644\u0633\u0639\u0648\u062F\u06CC\u0629", "\u0627\u0644\u0633\u0639\u0648\u062F\u06CC\u06C3", "\u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0647", "\u0633\u0648\u062F\u0627\u0646", "\u65B0\u52A0\u5761", "\u0B9A\u0BBF\u0B99\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0BC2\u0BB0\u0BCD", "\u0633\u0648\u0631\u064A\u0629", "\u0633\u0648\u0631\u064A\u0627", "\u0E44\u0E17\u0E22", "\u0E17\u0E2B\u0E32\u0E23.\u0E44\u0E17\u0E22", "\u0E18\u0E38\u0E23\u0E01\u0E34\u0E08.\u0E44\u0E17\u0E22", "\u0E40\u0E19\u0E47\u0E15.\u0E44\u0E17\u0E22", "\u0E23\u0E31\u0E10\u0E1A\u0E32\u0E25.\u0E44\u0E17\u0E22", "\u0E28\u0E36\u0E01\u0E29\u0E32.\u0E44\u0E17\u0E22", "\u0E2D\u0E07\u0E04\u0E4C\u0E01\u0E23.\u0E44\u0E17\u0E22", "\u062A\u0648\u0646\u0633", "\u53F0\u7063", "\u53F0\u6E7E", "\u81FA\u7063", "\u0443\u043A\u0440", "\u0627\u0644\u064A\u0645\u0646", "xxx", "ye", "com.ye", "edu.ye", "gov.ye", "mil.ye", "net.ye", "org.ye", "ac.za", "agric.za", "alt.za", "co.za", "edu.za", "gov.za", "grondar.za", "law.za", "mil.za", "net.za", "ngo.za", "nic.za", "nis.za", "nom.za", "org.za", "school.za", "tm.za", "web.za", "zm", "ac.zm", "biz.zm", "co.zm", "com.zm", "edu.zm", "gov.zm", "info.zm", "mil.zm", "net.zm", "org.zm", "sch.zm", "zw", "ac.zw", "co.zw", "gov.zw", "mil.zw", "org.zw", "aaa", "aarp", "abb", "abbott", "abbvie", "abc", "able", "abogado", "abudhabi", "academy", "accenture", "accountant", "accountants", "aco", "actor", "ads", "adult", "aeg", "aetna", "afl", "africa", "agakhan", "agency", "aig", "airbus", "airforce", "airtel", "akdn", "alibaba", "alipay", "allfinanz", "allstate", "ally", "alsace", "alstom", "amazon", "americanexpress", "americanfamily", "amex", "amfam", "amica", "amsterdam", "analytics", "android", "anquan", "anz", "aol", "apartments", "app", "apple", "aquarelle", "arab", "aramco", "archi", "army", "art", "arte", "asda", "associates", "athleta", "attorney", "auction", "audi", "audible", "audio", "auspost", "author", "auto", "autos", "aws", "axa", "azure", "baby", "baidu", "banamex", "band", "bank", "bar", "barcelona", "barclaycard", "barclays", "barefoot", "bargains", "baseball", "basketball", "bauhaus", "bayern", "bbc", "bbt", "bbva", "bcg", "bcn", "beats", "beauty", "beer", "bentley", "berlin", "best", "bestbuy", "bet", "bharti", "bible", "bid", "bike", "bing", "bingo", "bio", "black", "blackfriday", "blockbuster", "blog", "bloomberg", "blue", "bms", "bmw", "bnpparibas", "boats", "boehringer", "bofa", "bom", "bond", "boo", "book", "booking", "bosch", "bostik", "boston", "bot", "boutique", "box", "bradesco", "bridgestone", "broadway", "broker", "brother", "brussels", "build", "builders", "business", "buy", "buzz", "bzh", "cab", "cafe", "cal", "call", "calvinklein", "cam", "camera", "camp", "canon", "capetown", "capital", "capitalone", "car", "caravan", "cards", "care", "career", "careers", "cars", "casa", "case", "cash", "casino", "catering", "catholic", "cba", "cbn", "cbre", "center", "ceo", "cern", "cfa", "cfd", "chanel", "channel", "charity", "chase", "chat", "cheap", "chintai", "christmas", "chrome", "church", "cipriani", "circle", "cisco", "citadel", "citi", "citic", "city", "claims", "cleaning", "click", "clinic", "clinique", "clothing", "cloud", "club", "clubmed", "coach", "codes", "coffee", "college", "cologne", "commbank", "community", "company", "compare", "computer", "comsec", "condos", "construction", "consulting", "contact", "contractors", "cooking", "cool", "corsica", "country", "coupon", "coupons", "courses", "cpa", "credit", "creditcard", "creditunion", "cricket", "crown", "crs", "cruise", "cruises", "cuisinella", "cymru", "cyou", "dad", "dance", "data", "date", "dating", "datsun", "day", "dclk", "dds", "deal", "dealer", "deals", "degree", "delivery", "dell", "deloitte", "delta", "democrat", "dental", "dentist", "desi", "design", "dev", "dhl", "diamonds", "diet", "digital", "direct", "directory", "discount", "discover", "dish", "diy", "dnp", "docs", "doctor", "dog", "domains", "dot", "download", "drive", "dtv", "dubai", "dunlop", "dupont", "durban", "dvag", "dvr", "earth", "eat", "eco", "edeka", "education", "email", "emerck", "energy", "engineer", "engineering", "enterprises", "epson", "equipment", "ericsson", "erni", "esq", "estate", "eurovision", "eus", "events", "exchange", "expert", "exposed", "express", "extraspace", "fage", "fail", "fairwinds", "faith", "family", "fan", "fans", "farm", "farmers", "fashion", "fast", "fedex", "feedback", "ferrari", "ferrero", "fidelity", "fido", "film", "final", "finance", "financial", "fire", "firestone", "firmdale", "fish", "fishing", "fit", "fitness", "flickr", "flights", "flir", "florist", "flowers", "fly", "foo", "food", "football", "ford", "forex", "forsale", "forum", "foundation", "fox", "free", "fresenius", "frl", "frogans", "frontier", "ftr", "fujitsu", "fun", "fund", "furniture", "futbol", "fyi", "gal", "gallery", "gallo", "gallup", "game", "games", "gap", "garden", "gay", "gbiz", "gdn", "gea", "gent", "genting", "george", "ggee", "gift", "gifts", "gives", "giving", "glass", "gle", "global", "globo", "gmail", "gmbh", "gmo", "gmx", "godaddy", "gold", "goldpoint", "golf", "goo", "goodyear", "goog", "google", "gop", "got", "grainger", "graphics", "gratis", "green", "gripe", "grocery", "group", "gucci", "guge", "guide", "guitars", "guru", "hair", "hamburg", "hangout", "haus", "hbo", "hdfc", "hdfcbank", "health", "healthcare", "help", "helsinki", "here", "hermes", "hiphop", "hisamitsu", "hitachi", "hiv", "hkt", "hockey", "holdings", "holiday", "homedepot", "homegoods", "homes", "homesense", "honda", "horse", "hospital", "host", "hosting", "hot", "hotels", "hotmail", "house", "how", "hsbc", "hughes", "hyatt", "hyundai", "ibm", "icbc", "ice", "icu", "ieee", "ifm", "ikano", "imamat", "imdb", "immo", "immobilien", "inc", "industries", "infiniti", "ing", "ink", "institute", "insurance", "insure", "international", "intuit", "investments", "ipiranga", "irish", "ismaili", "ist", "istanbul", "itau", "itv", "jaguar", "java", "jcb", "jeep", "jetzt", "jewelry", "jio", "jll", "jmp", "jnj", "joburg", "jot", "joy", "jpmorgan", "jprs", "juegos", "juniper", "kaufen", "kddi", "kerryhotels", "kerrylogistics", "kerryproperties", "kfh", "kia", "kids", "kim", "kindle", "kitchen", "kiwi", "koeln", "komatsu", "kosher", "kpmg", "kpn", "krd", "kred", "kuokgroup", "kyoto", "lacaixa", "lamborghini", "lamer", "lancaster", "land", "landrover", "lanxess", "lasalle", "lat", "latino", "latrobe", "law", "lawyer", "lds", "lease", "leclerc", "lefrak", "legal", "lego", "lexus", "lgbt", "lidl", "life", "lifeinsurance", "lifestyle", "lighting", "like", "lilly", "limited", "limo", "lincoln", "link", "lipsy", "live", "living", "llc", "llp", "loan", "loans", "locker", "locus", "lol", "london", "lotte", "lotto", "love", "lpl", "lplfinancial", "ltd", "ltda", "lundbeck", "luxe", "luxury", "madrid", "maif", "maison", "makeup", "man", "management", "mango", "map", "market", "marketing", "markets", "marriott", "marshalls", "mattel", "mba", "mckinsey", "med", "media", "meet", "melbourne", "meme", "memorial", "men", "menu", "merck", "merckmsd", "miami", "microsoft", "mini", "mint", "mit", "mitsubishi", "mlb", "mls", "mma", "mobile", "moda", "moe", "moi", "mom", "monash", "money", "monster", "mormon", "mortgage", "moscow", "moto", "motorcycles", "mov", "movie", "msd", "mtn", "mtr", "music", "nab", "nagoya", "navy", "nba", "nec", "netbank", "netflix", "network", "neustar", "new", "news", "next", "nextdirect", "nexus", "nfl", "ngo", "nhk", "nico", "nike", "nikon", "ninja", "nissan", "nissay", "nokia", "norton", "now", "nowruz", "nowtv", "nra", "nrw", "ntt", "nyc", "obi", "observer", "office", "okinawa", "olayan", "olayangroup", "ollo", "omega", "one", "ong", "onl", "online", "ooo", "open", "oracle", "orange", "organic", "origins", "osaka", "otsuka", "ott", "ovh", "page", "panasonic", "paris", "pars", "partners", "parts", "party", "pay", "pccw", "pet", "pfizer", "pharmacy", "phd", "philips", "phone", "photo", "photography", "photos", "physio", "pics", "pictet", "pictures", "pid", "pin", "ping", "pink", "pioneer", "pizza", "place", "play", "playstation", "plumbing", "plus", "pnc", "pohl", "poker", "politie", "porn", "pramerica", "praxi", "press", "prime", "prod", "productions", "prof", "progressive", "promo", "properties", "property", "protection", "pru", "prudential", "pub", "pwc", "qpon", "quebec", "quest", "racing", "radio", "read", "realestate", "realtor", "realty", "recipes", "red", "redstone", "redumbrella", "rehab", "reise", "reisen", "reit", "reliance", "ren", "rent", "rentals", "repair", "report", "republican", "rest", "restaurant", "review", "reviews", "rexroth", "rich", "richardli", "ricoh", "ril", "rio", "rip", "rocks", "rodeo", "rogers", "room", "rsvp", "rugby", "ruhr", "run", "rwe", "ryukyu", "saarland", "safe", "safety", "sakura", "sale", "salon", "samsclub", "samsung", "sandvik", "sandvikcoromant", "sanofi", "sap", "sarl", "sas", "save", "saxo", "sbi", "sbs", "scb", "schaeffler", "schmidt", "scholarships", "school", "schule", "schwarz", "science", "scot", "search", "seat", "secure", "security", "seek", "select", "sener", "services", "seven", "sew", "sex", "sexy", "sfr", "shangrila", "sharp", "shell", "shia", "shiksha", "shoes", "shop", "shopping", "shouji", "show", "silk", "sina", "singles", "site", "ski", "skin", "sky", "skype", "sling", "smart", "smile", "sncf", "soccer", "social", "softbank", "software", "sohu", "solar", "solutions", "song", "sony", "soy", "spa", "space", "sport", "spot", "srl", "stada", "staples", "star", "statebank", "statefarm", "stc", "stcgroup", "stockholm", "storage", "store", "stream", "studio", "study", "style", "sucks", "supplies", "supply", "support", "surf", "surgery", "suzuki", "swatch", "swiss", "sydney", "systems", "tab", "taipei", "talk", "taobao", "target", "tatamotors", "tatar", "tattoo", "tax", "taxi", "tci", "tdk", "team", "tech", "technology", "temasek", "tennis", "teva", "thd", "theater", "theatre", "tiaa", "tickets", "tienda", "tips", "tires", "tirol", "tjmaxx", "tjx", "tkmaxx", "tmall", "today", "tokyo", "tools", "top", "toray", "toshiba", "total", "tours", "town", "toyota", "toys", "trade", "trading", "training", "travel", "travelers", "travelersinsurance", "trust", "trv", "tube", "tui", "tunes", "tushu", "tvs", "ubank", "ubs", "unicom", "university", "uno", "uol", "ups", "vacations", "vana", "vanguard", "vegas", "ventures", "verisign", "versicherung", "vet", "viajes", "video", "vig", "viking", "villas", "vin", "vip", "virgin", "visa", "vision", "viva", "vivo", "vlaanderen", "vodka", "volvo", "vote", "voting", "voto", "voyage", "wales", "walmart", "walter", "wang", "wanggou", "watch", "watches", "weather", "weatherchannel", "webcam", "weber", "website", "wed", "wedding", "weibo", "weir", "whoswho", "wien", "wiki", "williamhill", "win", "windows", "wine", "winners", "wme", "wolterskluwer", "woodside", "work", "works", "world", "wow", "wtc", "wtf", "xbox", "xerox", "xihuan", "xin", "\u0915\u0949\u092E", "\u30BB\u30FC\u30EB", "\u4F5B\u5C71", "\u6148\u5584", "\u96C6\u56E2", "\u5728\u7EBF", "\u70B9\u770B", "\u0E04\u0E2D\u0E21", "\u516B\u5366", "\u0645\u0648\u0642\u0639", "\u516C\u76CA", "\u516C\u53F8", "\u9999\u683C\u91CC\u62C9", "\u7F51\u7AD9", "\u79FB\u52A8", "\u6211\u7231\u4F60", "\u043C\u043E\u0441\u043A\u0432\u0430", "\u043A\u0430\u0442\u043E\u043B\u0438\u043A", "\u043E\u043D\u043B\u0430\u0439\u043D", "\u0441\u0430\u0439\u0442", "\u8054\u901A", "\u05E7\u05D5\u05DD", "\u65F6\u5C1A", "\u5FAE\u535A", "\u6DE1\u9A6C\u9521", "\u30D5\u30A1\u30C3\u30B7\u30E7\u30F3", "\u043E\u0440\u0433", "\u0928\u0947\u091F", "\u30B9\u30C8\u30A2", "\u30A2\u30DE\u30BE\u30F3", "\uC0BC\uC131", "\u5546\u6807", "\u5546\u5E97", "\u5546\u57CE", "\u0434\u0435\u0442\u0438", "\u30DD\u30A4\u30F3\u30C8", "\u65B0\u95FB", "\u5BB6\u96FB", "\u0643\u0648\u0645", "\u4E2D\u6587\u7F51", "\u4E2D\u4FE1", "\u5A31\u4E50", "\u8C37\u6B4C", "\u96FB\u8A0A\u76C8\u79D1", "\u8D2D\u7269", "\u30AF\u30E9\u30A6\u30C9", "\u901A\u8CA9", "\u7F51\u5E97", "\u0938\u0902\u0917\u0920\u0928", "\u9910\u5385", "\u7F51\u7EDC", "\u043A\u043E\u043C", "\u4E9A\u9A6C\u900A", "\u98DF\u54C1", "\u98DE\u5229\u6D66", "\u624B\u673A", "\u0627\u0631\u0627\u0645\u0643\u0648", "\u0627\u0644\u0639\u0644\u064A\u0627\u0646", "\u0628\u0627\u0632\u0627\u0631", "\u0627\u0628\u0648\u0638\u0628\u064A", "\u0643\u0627\u062B\u0648\u0644\u064A\u0643", "\u0647\u0645\u0631\u0627\u0647", "\uB2F7\uCEF4", "\u653F\u5E9C", "\u0634\u0628\u0643\u0629", "\u0628\u064A\u062A\u0643", "\u0639\u0631\u0628", "\u673A\u6784", "\u7EC4\u7EC7\u673A\u6784", "\u5065\u5EB7", "\u62DB\u8058", "\u0440\u0443\u0441", "\u5927\u62FF", "\u307F\u3093\u306A", "\u30B0\u30FC\u30B0\u30EB", "\u4E16\u754C", "\u66F8\u7C4D", "\u7F51\u5740", "\uB2F7\uB137", "\u30B3\u30E0", "\u5929\u4E3B\u6559", "\u6E38\u620F", "verm\xF6gensberater", "verm\xF6gensberatung", "\u4F01\u4E1A", "\u4FE1\u606F", "\u5609\u91CC\u5927\u9152\u5E97", "\u5609\u91CC", "\u5E7F\u4E1C", "\u653F\u52A1", "xyz", "yachts", "yahoo", "yamaxun", "yandex", "yodobashi", "yoga", "yokohama", "you", "youtube", "yun", "zappos", "zara", "zero", "zip", "zone", "zuerich", "co.krd", "edu.krd", "art.pl", "gliwice.pl", "krakow.pl", "poznan.pl", "wroc.pl", "zakopane.pl", "lib.de.us", "12chars.dev", "12chars.it", "12chars.pro", "cc.ua", "inf.ua", "ltd.ua", "611.to", "a2hosted.com", "cpserver.com", "aaa.vodka", "*.on-acorn.io", "activetrail.biz", "adaptable.app", "adobeaemcloud.com", "*.dev.adobeaemcloud.com", "aem.live", "hlx.live", "adobeaemcloud.net", "aem.page", "hlx.page", "hlx3.page", "adobeio-static.net", "adobeioruntime.net", "africa.com", "beep.pl", "airkitapps.com", "airkitapps-au.com", "airkitapps.eu", "aivencloud.com", "akadns.net", "akamai.net", "akamai-staging.net", "akamaiedge.net", "akamaiedge-staging.net", "akamaihd.net", "akamaihd-staging.net", "akamaiorigin.net", "akamaiorigin-staging.net", "akamaized.net", "akamaized-staging.net", "edgekey.net", "edgekey-staging.net", "edgesuite.net", "edgesuite-staging.net", "barsy.ca", "*.compute.estate", "*.alces.network", "kasserver.com", "altervista.org", "alwaysdata.net", "myamaze.net", "execute-api.cn-north-1.amazonaws.com.cn", "execute-api.cn-northwest-1.amazonaws.com.cn", "execute-api.af-south-1.amazonaws.com", "execute-api.ap-east-1.amazonaws.com", "execute-api.ap-northeast-1.amazonaws.com", "execute-api.ap-northeast-2.amazonaws.com", "execute-api.ap-northeast-3.amazonaws.com", "execute-api.ap-south-1.amazonaws.com", "execute-api.ap-south-2.amazonaws.com", "execute-api.ap-southeast-1.amazonaws.com", "execute-api.ap-southeast-2.amazonaws.com", "execute-api.ap-southeast-3.amazonaws.com", "execute-api.ap-southeast-4.amazonaws.com", "execute-api.ap-southeast-5.amazonaws.com", "execute-api.ca-central-1.amazonaws.com", "execute-api.ca-west-1.amazonaws.com", "execute-api.eu-central-1.amazonaws.com", "execute-api.eu-central-2.amazonaws.com", "execute-api.eu-north-1.amazonaws.com", "execute-api.eu-south-1.amazonaws.com", "execute-api.eu-south-2.amazonaws.com", "execute-api.eu-west-1.amazonaws.com", "execute-api.eu-west-2.amazonaws.com", "execute-api.eu-west-3.amazonaws.com", "execute-api.il-central-1.amazonaws.com", "execute-api.me-central-1.amazonaws.com", "execute-api.me-south-1.amazonaws.com", "execute-api.sa-east-1.amazonaws.com", "execute-api.us-east-1.amazonaws.com", "execute-api.us-east-2.amazonaws.com", "execute-api.us-gov-east-1.amazonaws.com", "execute-api.us-gov-west-1.amazonaws.com", "execute-api.us-west-1.amazonaws.com", "execute-api.us-west-2.amazonaws.com", "cloudfront.net", "auth.af-south-1.amazoncognito.com", "auth.ap-east-1.amazoncognito.com", "auth.ap-northeast-1.amazoncognito.com", "auth.ap-northeast-2.amazoncognito.com", "auth.ap-northeast-3.amazoncognito.com", "auth.ap-south-1.amazoncognito.com", "auth.ap-south-2.amazoncognito.com", "auth.ap-southeast-1.amazoncognito.com", "auth.ap-southeast-2.amazoncognito.com", "auth.ap-southeast-3.amazoncognito.com", "auth.ap-southeast-4.amazoncognito.com", "auth.ca-central-1.amazoncognito.com", "auth.ca-west-1.amazoncognito.com", "auth.eu-central-1.amazoncognito.com", "auth.eu-central-2.amazoncognito.com", "auth.eu-north-1.amazoncognito.com", "auth.eu-south-1.amazoncognito.com", "auth.eu-south-2.amazoncognito.com", "auth.eu-west-1.amazoncognito.com", "auth.eu-west-2.amazoncognito.com", "auth.eu-west-3.amazoncognito.com", "auth.il-central-1.amazoncognito.com", "auth.me-central-1.amazoncognito.com", "auth.me-south-1.amazoncognito.com", "auth.sa-east-1.amazoncognito.com", "auth.us-east-1.amazoncognito.com", "auth-fips.us-east-1.amazoncognito.com", "auth.us-east-2.amazoncognito.com", "auth-fips.us-east-2.amazoncognito.com", "auth-fips.us-gov-west-1.amazoncognito.com", "auth.us-west-1.amazoncognito.com", "auth-fips.us-west-1.amazoncognito.com", "auth.us-west-2.amazoncognito.com", "auth-fips.us-west-2.amazoncognito.com", "*.compute.amazonaws.com.cn", "*.compute.amazonaws.com", "*.compute-1.amazonaws.com", "us-east-1.amazonaws.com", "emrappui-prod.cn-north-1.amazonaws.com.cn", "emrnotebooks-prod.cn-north-1.amazonaws.com.cn", "emrstudio-prod.cn-north-1.amazonaws.com.cn", "emrappui-prod.cn-northwest-1.amazonaws.com.cn", "emrnotebooks-prod.cn-northwest-1.amazonaws.com.cn", "emrstudio-prod.cn-northwest-1.amazonaws.com.cn", "emrappui-prod.af-south-1.amazonaws.com", "emrnotebooks-prod.af-south-1.amazonaws.com", "emrstudio-prod.af-south-1.amazonaws.com", "emrappui-prod.ap-east-1.amazonaws.com", "emrnotebooks-prod.ap-east-1.amazonaws.com", "emrstudio-prod.ap-east-1.amazonaws.com", "emrappui-prod.ap-northeast-1.amazonaws.com", "emrnotebooks-prod.ap-northeast-1.amazonaws.com", "emrstudio-prod.ap-northeast-1.amazonaws.com", "emrappui-prod.ap-northeast-2.amazonaws.com", "emrnotebooks-prod.ap-northeast-2.amazonaws.com", "emrstudio-prod.ap-northeast-2.amazonaws.com", "emrappui-prod.ap-northeast-3.amazonaws.com", "emrnotebooks-prod.ap-northeast-3.amazonaws.com", "emrstudio-prod.ap-northeast-3.amazonaws.com", "emrappui-prod.ap-south-1.amazonaws.com", "emrnotebooks-prod.ap-south-1.amazonaws.com", "emrstudio-prod.ap-south-1.amazonaws.com", "emrappui-prod.ap-south-2.amazonaws.com", "emrnotebooks-prod.ap-south-2.amazonaws.com", "emrstudio-prod.ap-south-2.amazonaws.com", "emrappui-prod.ap-southeast-1.amazonaws.com", "emrnotebooks-prod.ap-southeast-1.amazonaws.com", "emrstudio-prod.ap-southeast-1.amazonaws.com", "emrappui-prod.ap-southeast-2.amazonaws.com", "emrnotebooks-prod.ap-southeast-2.amazonaws.com", "emrstudio-prod.ap-southeast-2.amazonaws.com", "emrappui-prod.ap-southeast-3.amazonaws.com", "emrnotebooks-prod.ap-southeast-3.amazonaws.com", "emrstudio-prod.ap-southeast-3.amazonaws.com", "emrappui-prod.ap-southeast-4.amazonaws.com", "emrnotebooks-prod.ap-southeast-4.amazonaws.com", "emrstudio-prod.ap-southeast-4.amazonaws.com", "emrappui-prod.ca-central-1.amazonaws.com", "emrnotebooks-prod.ca-central-1.amazonaws.com", "emrstudio-prod.ca-central-1.amazonaws.com", "emrappui-prod.ca-west-1.amazonaws.com", "emrnotebooks-prod.ca-west-1.amazonaws.com", "emrstudio-prod.ca-west-1.amazonaws.com", "emrappui-prod.eu-central-1.amazonaws.com", "emrnotebooks-prod.eu-central-1.amazonaws.com", "emrstudio-prod.eu-central-1.amazonaws.com", "emrappui-prod.eu-central-2.amazonaws.com", "emrnotebooks-prod.eu-central-2.amazonaws.com", "emrstudio-prod.eu-central-2.amazonaws.com", "emrappui-prod.eu-north-1.amazonaws.com", "emrnotebooks-prod.eu-north-1.amazonaws.com", "emrstudio-prod.eu-north-1.amazonaws.com", "emrappui-prod.eu-south-1.amazonaws.com", "emrnotebooks-prod.eu-south-1.amazonaws.com", "emrstudio-prod.eu-south-1.amazonaws.com", "emrappui-prod.eu-south-2.amazonaws.com", "emrnotebooks-prod.eu-south-2.amazonaws.com", "emrstudio-prod.eu-south-2.amazonaws.com", "emrappui-prod.eu-west-1.amazonaws.com", "emrnotebooks-prod.eu-west-1.amazonaws.com", "emrstudio-prod.eu-west-1.amazonaws.com", "emrappui-prod.eu-west-2.amazonaws.com", "emrnotebooks-prod.eu-west-2.amazonaws.com", "emrstudio-prod.eu-west-2.amazonaws.com", "emrappui-prod.eu-west-3.amazonaws.com", "emrnotebooks-prod.eu-west-3.amazonaws.com", "emrstudio-prod.eu-west-3.amazonaws.com", "emrappui-prod.il-central-1.amazonaws.com", "emrnotebooks-prod.il-central-1.amazonaws.com", "emrstudio-prod.il-central-1.amazonaws.com", "emrappui-prod.me-central-1.amazonaws.com", "emrnotebooks-prod.me-central-1.amazonaws.com", "emrstudio-prod.me-central-1.amazonaws.com", "emrappui-prod.me-south-1.amazonaws.com", "emrnotebooks-prod.me-south-1.amazonaws.com", "emrstudio-prod.me-south-1.amazonaws.com", "emrappui-prod.sa-east-1.amazonaws.com", "emrnotebooks-prod.sa-east-1.amazonaws.com", "emrstudio-prod.sa-east-1.amazonaws.com", "emrappui-prod.us-east-1.amazonaws.com", "emrnotebooks-prod.us-east-1.amazonaws.com", "emrstudio-prod.us-east-1.amazonaws.com", "emrappui-prod.us-east-2.amazonaws.com", "emrnotebooks-prod.us-east-2.amazonaws.com", "emrstudio-prod.us-east-2.amazonaws.com", "emrappui-prod.us-gov-east-1.amazonaws.com", "emrnotebooks-prod.us-gov-east-1.amazonaws.com", "emrstudio-prod.us-gov-east-1.amazonaws.com", "emrappui-prod.us-gov-west-1.amazonaws.com", "emrnotebooks-prod.us-gov-west-1.amazonaws.com", "emrstudio-prod.us-gov-west-1.amazonaws.com", "emrappui-prod.us-west-1.amazonaws.com", "emrnotebooks-prod.us-west-1.amazonaws.com", "emrstudio-prod.us-west-1.amazonaws.com", "emrappui-prod.us-west-2.amazonaws.com", "emrnotebooks-prod.us-west-2.amazonaws.com", "emrstudio-prod.us-west-2.amazonaws.com", "*.cn-north-1.airflow.amazonaws.com.cn", "*.cn-northwest-1.airflow.amazonaws.com.cn", "*.af-south-1.airflow.amazonaws.com", "*.ap-east-1.airflow.amazonaws.com", "*.ap-northeast-1.airflow.amazonaws.com", "*.ap-northeast-2.airflow.amazonaws.com", "*.ap-northeast-3.airflow.amazonaws.com", "*.ap-south-1.airflow.amazonaws.com", "*.ap-south-2.airflow.amazonaws.com", "*.ap-southeast-1.airflow.amazonaws.com", "*.ap-southeast-2.airflow.amazonaws.com", "*.ap-southeast-3.airflow.amazonaws.com", "*.ap-southeast-4.airflow.amazonaws.com", "*.ca-central-1.airflow.amazonaws.com", "*.ca-west-1.airflow.amazonaws.com", "*.eu-central-1.airflow.amazonaws.com", "*.eu-central-2.airflow.amazonaws.com", "*.eu-north-1.airflow.amazonaws.com", "*.eu-south-1.airflow.amazonaws.com", "*.eu-south-2.airflow.amazonaws.com", "*.eu-west-1.airflow.amazonaws.com", "*.eu-west-2.airflow.amazonaws.com", "*.eu-west-3.airflow.amazonaws.com", "*.il-central-1.airflow.amazonaws.com", "*.me-central-1.airflow.amazonaws.com", "*.me-south-1.airflow.amazonaws.com", "*.sa-east-1.airflow.amazonaws.com", "*.us-east-1.airflow.amazonaws.com", "*.us-east-2.airflow.amazonaws.com", "*.us-west-1.airflow.amazonaws.com", "*.us-west-2.airflow.amazonaws.com", "s3.dualstack.cn-north-1.amazonaws.com.cn", "s3-accesspoint.dualstack.cn-north-1.amazonaws.com.cn", "s3-website.dualstack.cn-north-1.amazonaws.com.cn", "s3.cn-north-1.amazonaws.com.cn", "s3-accesspoint.cn-north-1.amazonaws.com.cn", "s3-deprecated.cn-north-1.amazonaws.com.cn", "s3-object-lambda.cn-north-1.amazonaws.com.cn", "s3-website.cn-north-1.amazonaws.com.cn", "s3.dualstack.cn-northwest-1.amazonaws.com.cn", "s3-accesspoint.dualstack.cn-northwest-1.amazonaws.com.cn", "s3.cn-northwest-1.amazonaws.com.cn", "s3-accesspoint.cn-northwest-1.amazonaws.com.cn", "s3-object-lambda.cn-northwest-1.amazonaws.com.cn", "s3-website.cn-northwest-1.amazonaws.com.cn", "s3.dualstack.af-south-1.amazonaws.com", "s3-accesspoint.dualstack.af-south-1.amazonaws.com", "s3-website.dualstack.af-south-1.amazonaws.com", "s3.af-south-1.amazonaws.com", "s3-accesspoint.af-south-1.amazonaws.com", "s3-object-lambda.af-south-1.amazonaws.com", "s3-website.af-south-1.amazonaws.com", "s3.dualstack.ap-east-1.amazonaws.com", "s3-accesspoint.dualstack.ap-east-1.amazonaws.com", "s3.ap-east-1.amazonaws.com", "s3-accesspoint.ap-east-1.amazonaws.com", "s3-object-lambda.ap-east-1.amazonaws.com", "s3-website.ap-east-1.amazonaws.com", "s3.dualstack.ap-northeast-1.amazonaws.com", "s3-accesspoint.dualstack.ap-northeast-1.amazonaws.com", "s3-website.dualstack.ap-northeast-1.amazonaws.com", "s3.ap-northeast-1.amazonaws.com", "s3-accesspoint.ap-northeast-1.amazonaws.com", "s3-object-lambda.ap-northeast-1.amazonaws.com", "s3-website.ap-northeast-1.amazonaws.com", "s3.dualstack.ap-northeast-2.amazonaws.com", "s3-accesspoint.dualstack.ap-northeast-2.amazonaws.com", "s3-website.dualstack.ap-northeast-2.amazonaws.com", "s3.ap-northeast-2.amazonaws.com", "s3-accesspoint.ap-northeast-2.amazonaws.com", "s3-object-lambda.ap-northeast-2.amazonaws.com", "s3-website.ap-northeast-2.amazonaws.com", "s3.dualstack.ap-northeast-3.amazonaws.com", "s3-accesspoint.dualstack.ap-northeast-3.amazonaws.com", "s3-website.dualstack.ap-northeast-3.amazonaws.com", "s3.ap-northeast-3.amazonaws.com", "s3-accesspoint.ap-northeast-3.amazonaws.com", "s3-object-lambda.ap-northeast-3.amazonaws.com", "s3-website.ap-northeast-3.amazonaws.com", "s3.dualstack.ap-south-1.amazonaws.com", "s3-accesspoint.dualstack.ap-south-1.amazonaws.com", "s3-website.dualstack.ap-south-1.amazonaws.com", "s3.ap-south-1.amazonaws.com", "s3-accesspoint.ap-south-1.amazonaws.com", "s3-object-lambda.ap-south-1.amazonaws.com", "s3-website.ap-south-1.amazonaws.com", "s3.dualstack.ap-south-2.amazonaws.com", "s3-accesspoint.dualstack.ap-south-2.amazonaws.com", "s3-website.dualstack.ap-south-2.amazonaws.com", "s3.ap-south-2.amazonaws.com", "s3-accesspoint.ap-south-2.amazonaws.com", "s3-object-lambda.ap-south-2.amazonaws.com", "s3-website.ap-south-2.amazonaws.com", "s3.dualstack.ap-southeast-1.amazonaws.com", "s3-accesspoint.dualstack.ap-southeast-1.amazonaws.com", "s3-website.dualstack.ap-southeast-1.amazonaws.com", "s3.ap-southeast-1.amazonaws.com", "s3-accesspoint.ap-southeast-1.amazonaws.com", "s3-object-lambda.ap-southeast-1.amazonaws.com", "s3-website.ap-southeast-1.amazonaws.com", "s3.dualstack.ap-southeast-2.amazonaws.com", "s3-accesspoint.dualstack.ap-southeast-2.amazonaws.com", "s3-website.dualstack.ap-southeast-2.amazonaws.com", "s3.ap-southeast-2.amazonaws.com", "s3-accesspoint.ap-southeast-2.amazonaws.com", "s3-object-lambda.ap-southeast-2.amazonaws.com", "s3-website.ap-southeast-2.amazonaws.com", "s3.dualstack.ap-southeast-3.amazonaws.com", "s3-accesspoint.dualstack.ap-southeast-3.amazonaws.com", "s3-website.dualstack.ap-southeast-3.amazonaws.com", "s3.ap-southeast-3.amazonaws.com", "s3-accesspoint.ap-southeast-3.amazonaws.com", "s3-object-lambda.ap-southeast-3.amazonaws.com", "s3-website.ap-southeast-3.amazonaws.com", "s3.dualstack.ap-southeast-4.amazonaws.com", "s3-accesspoint.dualstack.ap-southeast-4.amazonaws.com", "s3-website.dualstack.ap-southeast-4.amazonaws.com", "s3.ap-southeast-4.amazonaws.com", "s3-accesspoint.ap-southeast-4.amazonaws.com", "s3-object-lambda.ap-southeast-4.amazonaws.com", "s3-website.ap-southeast-4.amazonaws.com", "s3.dualstack.ap-southeast-5.amazonaws.com", "s3-accesspoint.dualstack.ap-southeast-5.amazonaws.com", "s3-website.dualstack.ap-southeast-5.amazonaws.com", "s3.ap-southeast-5.amazonaws.com", "s3-accesspoint.ap-southeast-5.amazonaws.com", "s3-deprecated.ap-southeast-5.amazonaws.com", "s3-object-lambda.ap-southeast-5.amazonaws.com", "s3-website.ap-southeast-5.amazonaws.com", "s3.dualstack.ca-central-1.amazonaws.com", "s3-accesspoint.dualstack.ca-central-1.amazonaws.com", "s3-accesspoint-fips.dualstack.ca-central-1.amazonaws.com", "s3-fips.dualstack.ca-central-1.amazonaws.com", "s3-website.dualstack.ca-central-1.amazonaws.com", "s3.ca-central-1.amazonaws.com", "s3-accesspoint.ca-central-1.amazonaws.com", "s3-accesspoint-fips.ca-central-1.amazonaws.com", "s3-fips.ca-central-1.amazonaws.com", "s3-object-lambda.ca-central-1.amazonaws.com", "s3-website.ca-central-1.amazonaws.com", "s3.dualstack.ca-west-1.amazonaws.com", "s3-accesspoint.dualstack.ca-west-1.amazonaws.com", "s3-accesspoint-fips.dualstack.ca-west-1.amazonaws.com", "s3-fips.dualstack.ca-west-1.amazonaws.com", "s3-website.dualstack.ca-west-1.amazonaws.com", "s3.ca-west-1.amazonaws.com", "s3-accesspoint.ca-west-1.amazonaws.com", "s3-accesspoint-fips.ca-west-1.amazonaws.com", "s3-fips.ca-west-1.amazonaws.com", "s3-object-lambda.ca-west-1.amazonaws.com", "s3-website.ca-west-1.amazonaws.com", "s3.dualstack.eu-central-1.amazonaws.com", "s3-accesspoint.dualstack.eu-central-1.amazonaws.com", "s3-website.dualstack.eu-central-1.amazonaws.com", "s3.eu-central-1.amazonaws.com", "s3-accesspoint.eu-central-1.amazonaws.com", "s3-object-lambda.eu-central-1.amazonaws.com", "s3-website.eu-central-1.amazonaws.com", "s3.dualstack.eu-central-2.amazonaws.com", "s3-accesspoint.dualstack.eu-central-2.amazonaws.com", "s3-website.dualstack.eu-central-2.amazonaws.com", "s3.eu-central-2.amazonaws.com", "s3-accesspoint.eu-central-2.amazonaws.com", "s3-object-lambda.eu-central-2.amazonaws.com", "s3-website.eu-central-2.amazonaws.com", "s3.dualstack.eu-north-1.amazonaws.com", "s3-accesspoint.dualstack.eu-north-1.amazonaws.com", "s3.eu-north-1.amazonaws.com", "s3-accesspoint.eu-north-1.amazonaws.com", "s3-object-lambda.eu-north-1.amazonaws.com", "s3-website.eu-north-1.amazonaws.com", "s3.dualstack.eu-south-1.amazonaws.com", "s3-accesspoint.dualstack.eu-south-1.amazonaws.com", "s3-website.dualstack.eu-south-1.amazonaws.com", "s3.eu-south-1.amazonaws.com", "s3-accesspoint.eu-south-1.amazonaws.com", "s3-object-lambda.eu-south-1.amazonaws.com", "s3-website.eu-south-1.amazonaws.com", "s3.dualstack.eu-south-2.amazonaws.com", "s3-accesspoint.dualstack.eu-south-2.amazonaws.com", "s3-website.dualstack.eu-south-2.amazonaws.com", "s3.eu-south-2.amazonaws.com", "s3-accesspoint.eu-south-2.amazonaws.com", "s3-object-lambda.eu-south-2.amazonaws.com", "s3-website.eu-south-2.amazonaws.com", "s3.dualstack.eu-west-1.amazonaws.com", "s3-accesspoint.dualstack.eu-west-1.amazonaws.com", "s3-website.dualstack.eu-west-1.amazonaws.com", "s3.eu-west-1.amazonaws.com", "s3-accesspoint.eu-west-1.amazonaws.com", "s3-deprecated.eu-west-1.amazonaws.com", "s3-object-lambda.eu-west-1.amazonaws.com", "s3-website.eu-west-1.amazonaws.com", "s3.dualstack.eu-west-2.amazonaws.com", "s3-accesspoint.dualstack.eu-west-2.amazonaws.com", "s3.eu-west-2.amazonaws.com", "s3-accesspoint.eu-west-2.amazonaws.com", "s3-object-lambda.eu-west-2.amazonaws.com", "s3-website.eu-west-2.amazonaws.com", "s3.dualstack.eu-west-3.amazonaws.com", "s3-accesspoint.dualstack.eu-west-3.amazonaws.com", "s3-website.dualstack.eu-west-3.amazonaws.com", "s3.eu-west-3.amazonaws.com", "s3-accesspoint.eu-west-3.amazonaws.com", "s3-object-lambda.eu-west-3.amazonaws.com", "s3-website.eu-west-3.amazonaws.com", "s3.dualstack.il-central-1.amazonaws.com", "s3-accesspoint.dualstack.il-central-1.amazonaws.com", "s3-website.dualstack.il-central-1.amazonaws.com", "s3.il-central-1.amazonaws.com", "s3-accesspoint.il-central-1.amazonaws.com", "s3-object-lambda.il-central-1.amazonaws.com", "s3-website.il-central-1.amazonaws.com", "s3.dualstack.me-central-1.amazonaws.com", "s3-accesspoint.dualstack.me-central-1.amazonaws.com", "s3-website.dualstack.me-central-1.amazonaws.com", "s3.me-central-1.amazonaws.com", "s3-accesspoint.me-central-1.amazonaws.com", "s3-object-lambda.me-central-1.amazonaws.com", "s3-website.me-central-1.amazonaws.com", "s3.dualstack.me-south-1.amazonaws.com", "s3-accesspoint.dualstack.me-south-1.amazonaws.com", "s3.me-south-1.amazonaws.com", "s3-accesspoint.me-south-1.amazonaws.com", "s3-object-lambda.me-south-1.amazonaws.com", "s3-website.me-south-1.amazonaws.com", "s3.amazonaws.com", "s3-1.amazonaws.com", "s3-ap-east-1.amazonaws.com", "s3-ap-northeast-1.amazonaws.com", "s3-ap-northeast-2.amazonaws.com", "s3-ap-northeast-3.amazonaws.com", "s3-ap-south-1.amazonaws.com", "s3-ap-southeast-1.amazonaws.com", "s3-ap-southeast-2.amazonaws.com", "s3-ca-central-1.amazonaws.com", "s3-eu-central-1.amazonaws.com", "s3-eu-north-1.amazonaws.com", "s3-eu-west-1.amazonaws.com", "s3-eu-west-2.amazonaws.com", "s3-eu-west-3.amazonaws.com", "s3-external-1.amazonaws.com", "s3-fips-us-gov-east-1.amazonaws.com", "s3-fips-us-gov-west-1.amazonaws.com", "mrap.accesspoint.s3-global.amazonaws.com", "s3-me-south-1.amazonaws.com", "s3-sa-east-1.amazonaws.com", "s3-us-east-2.amazonaws.com", "s3-us-gov-east-1.amazonaws.com", "s3-us-gov-west-1.amazonaws.com", "s3-us-west-1.amazonaws.com", "s3-us-west-2.amazonaws.com", "s3-website-ap-northeast-1.amazonaws.com", "s3-website-ap-southeast-1.amazonaws.com", "s3-website-ap-southeast-2.amazonaws.com", "s3-website-eu-west-1.amazonaws.com", "s3-website-sa-east-1.amazonaws.com", "s3-website-us-east-1.amazonaws.com", "s3-website-us-gov-west-1.amazonaws.com", "s3-website-us-west-1.amazonaws.com", "s3-website-us-west-2.amazonaws.com", "s3.dualstack.sa-east-1.amazonaws.com", "s3-accesspoint.dualstack.sa-east-1.amazonaws.com", "s3-website.dualstack.sa-east-1.amazonaws.com", "s3.sa-east-1.amazonaws.com", "s3-accesspoint.sa-east-1.amazonaws.com", "s3-object-lambda.sa-east-1.amazonaws.com", "s3-website.sa-east-1.amazonaws.com", "s3.dualstack.us-east-1.amazonaws.com", "s3-accesspoint.dualstack.us-east-1.amazonaws.com", "s3-accesspoint-fips.dualstack.us-east-1.amazonaws.com", "s3-fips.dualstack.us-east-1.amazonaws.com", "s3-website.dualstack.us-east-1.amazonaws.com", "s3.us-east-1.amazonaws.com", "s3-accesspoint.us-east-1.amazonaws.com", "s3-accesspoint-fips.us-east-1.amazonaws.com", "s3-deprecated.us-east-1.amazonaws.com", "s3-fips.us-east-1.amazonaws.com", "s3-object-lambda.us-east-1.amazonaws.com", "s3-website.us-east-1.amazonaws.com", "s3.dualstack.us-east-2.amazonaws.com", "s3-accesspoint.dualstack.us-east-2.amazonaws.com", "s3-accesspoint-fips.dualstack.us-east-2.amazonaws.com", "s3-fips.dualstack.us-east-2.amazonaws.com", "s3-website.dualstack.us-east-2.amazonaws.com", "s3.us-east-2.amazonaws.com", "s3-accesspoint.us-east-2.amazonaws.com", "s3-accesspoint-fips.us-east-2.amazonaws.com", "s3-deprecated.us-east-2.amazonaws.com", "s3-fips.us-east-2.amazonaws.com", "s3-object-lambda.us-east-2.amazonaws.com", "s3-website.us-east-2.amazonaws.com", "s3.dualstack.us-gov-east-1.amazonaws.com", "s3-accesspoint.dualstack.us-gov-east-1.amazonaws.com", "s3-accesspoint-fips.dualstack.us-gov-east-1.amazonaws.com", "s3-fips.dualstack.us-gov-east-1.amazonaws.com", "s3.us-gov-east-1.amazonaws.com", "s3-accesspoint.us-gov-east-1.amazonaws.com", "s3-accesspoint-fips.us-gov-east-1.amazonaws.com", "s3-fips.us-gov-east-1.amazonaws.com", "s3-object-lambda.us-gov-east-1.amazonaws.com", "s3-website.us-gov-east-1.amazonaws.com", "s3.dualstack.us-gov-west-1.amazonaws.com", "s3-accesspoint.dualstack.us-gov-west-1.amazonaws.com", "s3-accesspoint-fips.dualstack.us-gov-west-1.amazonaws.com", "s3-fips.dualstack.us-gov-west-1.amazonaws.com", "s3.us-gov-west-1.amazonaws.com", "s3-accesspoint.us-gov-west-1.amazonaws.com", "s3-accesspoint-fips.us-gov-west-1.amazonaws.com", "s3-fips.us-gov-west-1.amazonaws.com", "s3-object-lambda.us-gov-west-1.amazonaws.com", "s3-website.us-gov-west-1.amazonaws.com", "s3.dualstack.us-west-1.amazonaws.com", "s3-accesspoint.dualstack.us-west-1.amazonaws.com", "s3-accesspoint-fips.dualstack.us-west-1.amazonaws.com", "s3-fips.dualstack.us-west-1.amazonaws.com", "s3-website.dualstack.us-west-1.amazonaws.com", "s3.us-west-1.amazonaws.com", "s3-accesspoint.us-west-1.amazonaws.com", "s3-accesspoint-fips.us-west-1.amazonaws.com", "s3-fips.us-west-1.amazonaws.com", "s3-object-lambda.us-west-1.amazonaws.com", "s3-website.us-west-1.amazonaws.com", "s3.dualstack.us-west-2.amazonaws.com", "s3-accesspoint.dualstack.us-west-2.amazonaws.com", "s3-accesspoint-fips.dualstack.us-west-2.amazonaws.com", "s3-fips.dualstack.us-west-2.amazonaws.com", "s3-website.dualstack.us-west-2.amazonaws.com", "s3.us-west-2.amazonaws.com", "s3-accesspoint.us-west-2.amazonaws.com", "s3-accesspoint-fips.us-west-2.amazonaws.com", "s3-deprecated.us-west-2.amazonaws.com", "s3-fips.us-west-2.amazonaws.com", "s3-object-lambda.us-west-2.amazonaws.com", "s3-website.us-west-2.amazonaws.com", "labeling.ap-northeast-1.sagemaker.aws", "labeling.ap-northeast-2.sagemaker.aws", "labeling.ap-south-1.sagemaker.aws", "labeling.ap-southeast-1.sagemaker.aws", "labeling.ap-southeast-2.sagemaker.aws", "labeling.ca-central-1.sagemaker.aws", "labeling.eu-central-1.sagemaker.aws", "labeling.eu-west-1.sagemaker.aws", "labeling.eu-west-2.sagemaker.aws", "labeling.us-east-1.sagemaker.aws", "labeling.us-east-2.sagemaker.aws", "labeling.us-west-2.sagemaker.aws", "notebook.af-south-1.sagemaker.aws", "notebook.ap-east-1.sagemaker.aws", "notebook.ap-northeast-1.sagemaker.aws", "notebook.ap-northeast-2.sagemaker.aws", "notebook.ap-northeast-3.sagemaker.aws", "notebook.ap-south-1.sagemaker.aws", "notebook.ap-south-2.sagemaker.aws", "notebook.ap-southeast-1.sagemaker.aws", "notebook.ap-southeast-2.sagemaker.aws", "notebook.ap-southeast-3.sagemaker.aws", "notebook.ap-southeast-4.sagemaker.aws", "notebook.ca-central-1.sagemaker.aws", "notebook-fips.ca-central-1.sagemaker.aws", "notebook.ca-west-1.sagemaker.aws", "notebook-fips.ca-west-1.sagemaker.aws", "notebook.eu-central-1.sagemaker.aws", "notebook.eu-central-2.sagemaker.aws", "notebook.eu-north-1.sagemaker.aws", "notebook.eu-south-1.sagemaker.aws", "notebook.eu-south-2.sagemaker.aws", "notebook.eu-west-1.sagemaker.aws", "notebook.eu-west-2.sagemaker.aws", "notebook.eu-west-3.sagemaker.aws", "notebook.il-central-1.sagemaker.aws", "notebook.me-central-1.sagemaker.aws", "notebook.me-south-1.sagemaker.aws", "notebook.sa-east-1.sagemaker.aws", "notebook.us-east-1.sagemaker.aws", "notebook-fips.us-east-1.sagemaker.aws", "notebook.us-east-2.sagemaker.aws", "notebook-fips.us-east-2.sagemaker.aws", "notebook.us-gov-east-1.sagemaker.aws", "notebook-fips.us-gov-east-1.sagemaker.aws", "notebook.us-gov-west-1.sagemaker.aws", "notebook-fips.us-gov-west-1.sagemaker.aws", "notebook.us-west-1.sagemaker.aws", "notebook-fips.us-west-1.sagemaker.aws", "notebook.us-west-2.sagemaker.aws", "notebook-fips.us-west-2.sagemaker.aws", "notebook.cn-north-1.sagemaker.com.cn", "notebook.cn-northwest-1.sagemaker.com.cn", "studio.af-south-1.sagemaker.aws", "studio.ap-east-1.sagemaker.aws", "studio.ap-northeast-1.sagemaker.aws", "studio.ap-northeast-2.sagemaker.aws", "studio.ap-northeast-3.sagemaker.aws", "studio.ap-south-1.sagemaker.aws", "studio.ap-southeast-1.sagemaker.aws", "studio.ap-southeast-2.sagemaker.aws", "studio.ap-southeast-3.sagemaker.aws", "studio.ca-central-1.sagemaker.aws", "studio.eu-central-1.sagemaker.aws", "studio.eu-north-1.sagemaker.aws", "studio.eu-south-1.sagemaker.aws", "studio.eu-south-2.sagemaker.aws", "studio.eu-west-1.sagemaker.aws", "studio.eu-west-2.sagemaker.aws", "studio.eu-west-3.sagemaker.aws", "studio.il-central-1.sagemaker.aws", "studio.me-central-1.sagemaker.aws", "studio.me-south-1.sagemaker.aws", "studio.sa-east-1.sagemaker.aws", "studio.us-east-1.sagemaker.aws", "studio.us-east-2.sagemaker.aws", "studio.us-gov-east-1.sagemaker.aws", "studio-fips.us-gov-east-1.sagemaker.aws", "studio.us-gov-west-1.sagemaker.aws", "studio-fips.us-gov-west-1.sagemaker.aws", "studio.us-west-1.sagemaker.aws", "studio.us-west-2.sagemaker.aws", "studio.cn-north-1.sagemaker.com.cn", "studio.cn-northwest-1.sagemaker.com.cn", "*.experiments.sagemaker.aws", "analytics-gateway.ap-northeast-1.amazonaws.com", "analytics-gateway.ap-northeast-2.amazonaws.com", "analytics-gateway.ap-south-1.amazonaws.com", "analytics-gateway.ap-southeast-1.amazonaws.com", "analytics-gateway.ap-southeast-2.amazonaws.com", "analytics-gateway.eu-central-1.amazonaws.com", "analytics-gateway.eu-west-1.amazonaws.com", "analytics-gateway.us-east-1.amazonaws.com", "analytics-gateway.us-east-2.amazonaws.com", "analytics-gateway.us-west-2.amazonaws.com", "amplifyapp.com", "*.awsapprunner.com", "webview-assets.aws-cloud9.af-south-1.amazonaws.com", "vfs.cloud9.af-south-1.amazonaws.com", "webview-assets.cloud9.af-south-1.amazonaws.com", "webview-assets.aws-cloud9.ap-east-1.amazonaws.com", "vfs.cloud9.ap-east-1.amazonaws.com", "webview-assets.cloud9.ap-east-1.amazonaws.com", "webview-assets.aws-cloud9.ap-northeast-1.amazonaws.com", "vfs.cloud9.ap-northeast-1.amazonaws.com", "webview-assets.cloud9.ap-northeast-1.amazonaws.com", "webview-assets.aws-cloud9.ap-northeast-2.amazonaws.com", "vfs.cloud9.ap-northeast-2.amazonaws.com", "webview-assets.cloud9.ap-northeast-2.amazonaws.com", "webview-assets.aws-cloud9.ap-northeast-3.amazonaws.com", "vfs.cloud9.ap-northeast-3.amazonaws.com", "webview-assets.cloud9.ap-northeast-3.amazonaws.com", "webview-assets.aws-cloud9.ap-south-1.amazonaws.com", "vfs.cloud9.ap-south-1.amazonaws.com", "webview-assets.cloud9.ap-south-1.amazonaws.com", "webview-assets.aws-cloud9.ap-southeast-1.amazonaws.com", "vfs.cloud9.ap-southeast-1.amazonaws.com", "webview-assets.cloud9.ap-southeast-1.amazonaws.com", "webview-assets.aws-cloud9.ap-southeast-2.amazonaws.com", "vfs.cloud9.ap-southeast-2.amazonaws.com", "webview-assets.cloud9.ap-southeast-2.amazonaws.com", "webview-assets.aws-cloud9.ca-central-1.amazonaws.com", "vfs.cloud9.ca-central-1.amazonaws.com", "webview-assets.cloud9.ca-central-1.amazonaws.com", "webview-assets.aws-cloud9.eu-central-1.amazonaws.com", "vfs.cloud9.eu-central-1.amazonaws.com", "webview-assets.cloud9.eu-central-1.amazonaws.com", "webview-assets.aws-cloud9.eu-north-1.amazonaws.com", "vfs.cloud9.eu-north-1.amazonaws.com", "webview-assets.cloud9.eu-north-1.amazonaws.com", "webview-assets.aws-cloud9.eu-south-1.amazonaws.com", "vfs.cloud9.eu-south-1.amazonaws.com", "webview-assets.cloud9.eu-south-1.amazonaws.com", "webview-assets.aws-cloud9.eu-west-1.amazonaws.com", "vfs.cloud9.eu-west-1.amazonaws.com", "webview-assets.cloud9.eu-west-1.amazonaws.com", "webview-assets.aws-cloud9.eu-west-2.amazonaws.com", "vfs.cloud9.eu-west-2.amazonaws.com", "webview-assets.cloud9.eu-west-2.amazonaws.com", "webview-assets.aws-cloud9.eu-west-3.amazonaws.com", "vfs.cloud9.eu-west-3.amazonaws.com", "webview-assets.cloud9.eu-west-3.amazonaws.com", "webview-assets.aws-cloud9.il-central-1.amazonaws.com", "vfs.cloud9.il-central-1.amazonaws.com", "webview-assets.aws-cloud9.me-south-1.amazonaws.com", "vfs.cloud9.me-south-1.amazonaws.com", "webview-assets.cloud9.me-south-1.amazonaws.com", "webview-assets.aws-cloud9.sa-east-1.amazonaws.com", "vfs.cloud9.sa-east-1.amazonaws.com", "webview-assets.cloud9.sa-east-1.amazonaws.com", "webview-assets.aws-cloud9.us-east-1.amazonaws.com", "vfs.cloud9.us-east-1.amazonaws.com", "webview-assets.cloud9.us-east-1.amazonaws.com", "webview-assets.aws-cloud9.us-east-2.amazonaws.com", "vfs.cloud9.us-east-2.amazonaws.com", "webview-assets.cloud9.us-east-2.amazonaws.com", "webview-assets.aws-cloud9.us-west-1.amazonaws.com", "vfs.cloud9.us-west-1.amazonaws.com", "webview-assets.cloud9.us-west-1.amazonaws.com", "webview-assets.aws-cloud9.us-west-2.amazonaws.com", "vfs.cloud9.us-west-2.amazonaws.com", "webview-assets.cloud9.us-west-2.amazonaws.com", "awsapps.com", "cn-north-1.eb.amazonaws.com.cn", "cn-northwest-1.eb.amazonaws.com.cn", "elasticbeanstalk.com", "af-south-1.elasticbeanstalk.com", "ap-east-1.elasticbeanstalk.com", "ap-northeast-1.elasticbeanstalk.com", "ap-northeast-2.elasticbeanstalk.com", "ap-northeast-3.elasticbeanstalk.com", "ap-south-1.elasticbeanstalk.com", "ap-southeast-1.elasticbeanstalk.com", "ap-southeast-2.elasticbeanstalk.com", "ap-southeast-3.elasticbeanstalk.com", "ca-central-1.elasticbeanstalk.com", "eu-central-1.elasticbeanstalk.com", "eu-north-1.elasticbeanstalk.com", "eu-south-1.elasticbeanstalk.com", "eu-west-1.elasticbeanstalk.com", "eu-west-2.elasticbeanstalk.com", "eu-west-3.elasticbeanstalk.com", "il-central-1.elasticbeanstalk.com", "me-south-1.elasticbeanstalk.com", "sa-east-1.elasticbeanstalk.com", "us-east-1.elasticbeanstalk.com", "us-east-2.elasticbeanstalk.com", "us-gov-east-1.elasticbeanstalk.com", "us-gov-west-1.elasticbeanstalk.com", "us-west-1.elasticbeanstalk.com", "us-west-2.elasticbeanstalk.com", "*.elb.amazonaws.com.cn", "*.elb.amazonaws.com", "awsglobalaccelerator.com", "*.private.repost.aws", "eero.online", "eero-stage.online", "apigee.io", "panel.dev", "siiites.com", "appspacehosted.com", "appspaceusercontent.com", "appudo.net", "on-aptible.com", "f5.si", "arvanedge.ir", "user.aseinet.ne.jp", "gv.vc", "d.gv.vc", "user.party.eus", "pimienta.org", "poivron.org", "potager.org", "sweetpepper.org", "myasustor.com", "cdn.prod.atlassian-dev.net", "translated.page", "myfritz.link", "myfritz.net", "onavstack.net", "*.awdev.ca", "*.advisor.ws", "ecommerce-shop.pl", "b-data.io", "balena-devices.com", "base.ec", "official.ec", "buyshop.jp", "fashionstore.jp", "handcrafted.jp", "kawaiishop.jp", "supersale.jp", "theshop.jp", "shopselect.net", "base.shop", "beagleboard.io", "*.beget.app", "pages.gay", "bnr.la", "bitbucket.io", "blackbaudcdn.net", "of.je", "bluebite.io", "boomla.net", "boutir.com", "boxfuse.io", "square7.ch", "bplaced.com", "bplaced.de", "square7.de", "bplaced.net", "square7.net", "*.s.brave.io", "shop.brendly.hr", "shop.brendly.rs", "browsersafetymark.io", "radio.am", "radio.fm", "uk0.bigv.io", "dh.bytemark.co.uk", "vm.bytemark.co.uk", "cafjs.com", "canva-apps.cn", "*.my.canvasite.cn", "canva-apps.com", "*.my.canva.site", "drr.ac", "uwu.ai", "carrd.co", "crd.co", "ju.mp", "api.gov.uk", "cdn77-storage.com", "rsc.contentproxy9.cz", "r.cdn77.net", "cdn77-ssl.net", "c.cdn77.org", "rsc.cdn77.org", "ssl.origin.cdn77-secure.org", "za.bz", "br.com", "cn.com", "de.com", "eu.com", "jpn.com", "mex.com", "ru.com", "sa.com", "uk.com", "us.com", "za.com", "com.de", "gb.net", "hu.net", "jp.net", "se.net", "uk.net", "ae.org", "com.se", "cx.ua", "discourse.group", "discourse.team", "clerk.app", "clerkstage.app", "*.lcl.dev", "*.lclstage.dev", "*.stg.dev", "*.stgstage.dev", "cleverapps.cc", "*.services.clever-cloud.com", "cleverapps.io", "cleverapps.tech", "clickrising.net", "cloudns.asia", "cloudns.be", "cloud-ip.biz", "cloudns.biz", "cloudns.cc", "cloudns.ch", "cloudns.cl", "cloudns.club", "dnsabr.com", "ip-ddns.com", "cloudns.cx", "cloudns.eu", "cloudns.in", "cloudns.info", "ddns-ip.net", "dns-cloud.net", "dns-dynamic.net", "cloudns.nz", "cloudns.org", "ip-dynamic.org", "cloudns.ph", "cloudns.pro", "cloudns.pw", "cloudns.us", "c66.me", "cloud66.ws", "cloud66.zone", "jdevcloud.com", "wpdevcloud.com", "cloudaccess.host", "freesite.host", "cloudaccess.net", "*.cloudera.site", "cf-ipfs.com", "cloudflare-ipfs.com", "trycloudflare.com", "pages.dev", "r2.dev", "workers.dev", "cloudflare.net", "cdn.cloudflare.net", "cdn.cloudflareanycast.net", "cdn.cloudflarecn.net", "cdn.cloudflareglobal.net", "cust.cloudscale.ch", "objects.lpg.cloudscale.ch", "objects.rma.cloudscale.ch", "wnext.app", "cnpy.gdn", "*.otap.co", "co.ca", "co.com", "codeberg.page", "csb.app", "preview.csb.app", "co.nl", "co.no", "webhosting.be", "hosting-cluster.nl", "ctfcloud.net", "convex.site", "ac.ru", "edu.ru", "gov.ru", "int.ru", "mil.ru", "test.ru", "dyn.cosidns.de", "dnsupdater.de", "dynamisches-dns.de", "internet-dns.de", "l-o-g-i-n.de", "dynamic-dns.info", "feste-ip.net", "knx-server.net", "static-access.net", "craft.me", "realm.cz", "on.crisp.email", "*.cryptonomic.net", "curv.dev", "cfolks.pl", "cyon.link", "cyon.site", "platform0.app", "fnwk.site", "folionetwork.site", "biz.dk", "co.dk", "firm.dk", "reg.dk", "store.dk", "dyndns.dappnode.io", "builtwithdark.com", "darklang.io", "demo.datadetect.com", "instance.datadetect.com", "edgestack.me", "dattolocal.com", "dattorelay.com", "dattoweb.com", "mydatto.com", "dattolocal.net", "mydatto.net", "ddnss.de", "dyn.ddnss.de", "dyndns.ddnss.de", "dyn-ip24.de", "dyndns1.de", "home-webserver.de", "dyn.home-webserver.de", "myhome-server.de", "ddnss.org", "debian.net", "definima.io", "definima.net", "deno.dev", "deno-staging.dev", "dedyn.io", "deta.app", "deta.dev", "dfirma.pl", "dkonto.pl", "you2.pl", "ondigitalocean.app", "*.digitaloceanspaces.com", "us.kg", "rss.my.id", "diher.solutions", "discordsays.com", "discordsez.com", "jozi.biz", "dnshome.de", "online.th", "shop.th", "drayddns.com", "shoparena.pl", "dreamhosters.com", "durumis.com", "mydrobo.com", "drud.io", "drud.us", "duckdns.org", "dy.fi", "tunk.org", "dyndns.biz", "for-better.biz", "for-more.biz", "for-some.biz", "for-the.biz", "selfip.biz", "webhop.biz", "ftpaccess.cc", "game-server.cc", "myphotos.cc", "scrapping.cc", "blogdns.com", "cechire.com", "dnsalias.com", "dnsdojo.com", "doesntexist.com", "dontexist.com", "doomdns.com", "dyn-o-saur.com", "dynalias.com", "dyndns-at-home.com", "dyndns-at-work.com", "dyndns-blog.com", "dyndns-free.com", "dyndns-home.com", "dyndns-ip.com", "dyndns-mail.com", "dyndns-office.com", "dyndns-pics.com", "dyndns-remote.com", "dyndns-server.com", "dyndns-web.com", "dyndns-wiki.com", "dyndns-work.com", "est-a-la-maison.com", "est-a-la-masion.com", "est-le-patron.com", "est-mon-blogueur.com", "from-ak.com", "from-al.com", "from-ar.com", "from-ca.com", "from-ct.com", "from-dc.com", "from-de.com", "from-fl.com", "from-ga.com", "from-hi.com", "from-ia.com", "from-id.com", "from-il.com", "from-in.com", "from-ks.com", "from-ky.com", "from-ma.com", "from-md.com", "from-mi.com", "from-mn.com", "from-mo.com", "from-ms.com", "from-mt.com", "from-nc.com", "from-nd.com", "from-ne.com", "from-nh.com", "from-nj.com", "from-nm.com", "from-nv.com", "from-oh.com", "from-ok.com", "from-or.com", "from-pa.com", "from-pr.com", "from-ri.com", "from-sc.com", "from-sd.com", "from-tn.com", "from-tx.com", "from-ut.com", "from-va.com", "from-vt.com", "from-wa.com", "from-wi.com", "from-wv.com", "from-wy.com", "getmyip.com", "gotdns.com", "hobby-site.com", "homelinux.com", "homeunix.com", "iamallama.com", "is-a-anarchist.com", "is-a-blogger.com", "is-a-bookkeeper.com", "is-a-bulls-fan.com", "is-a-caterer.com", "is-a-chef.com", "is-a-conservative.com", "is-a-cpa.com", "is-a-cubicle-slave.com", "is-a-democrat.com", "is-a-designer.com", "is-a-doctor.com", "is-a-financialadvisor.com", "is-a-geek.com", "is-a-green.com", "is-a-guru.com", "is-a-hard-worker.com", "is-a-hunter.com", "is-a-landscaper.com", "is-a-lawyer.com", "is-a-liberal.com", "is-a-libertarian.com", "is-a-llama.com", "is-a-musician.com", "is-a-nascarfan.com", "is-a-nurse.com", "is-a-painter.com", "is-a-personaltrainer.com", "is-a-photographer.com", "is-a-player.com", "is-a-republican.com", "is-a-rockstar.com", "is-a-socialist.com", "is-a-student.com", "is-a-teacher.com", "is-a-techie.com", "is-a-therapist.com", "is-an-accountant.com", "is-an-actor.com", "is-an-actress.com", "is-an-anarchist.com", "is-an-artist.com", "is-an-engineer.com", "is-an-entertainer.com", "is-certified.com", "is-gone.com", "is-into-anime.com", "is-into-cars.com", "is-into-cartoons.com", "is-into-games.com", "is-leet.com", "is-not-certified.com", "is-slick.com", "is-uberleet.com", "is-with-theband.com", "isa-geek.com", "isa-hockeynut.com", "issmarterthanyou.com", "likes-pie.com", "likescandy.com", "neat-url.com", "saves-the-whales.com", "selfip.com", "sells-for-less.com", "sells-for-u.com", "servebbs.com", "simple-url.com", "space-to-rent.com", "teaches-yoga.com", "writesthisblog.com", "ath.cx", "fuettertdasnetz.de", "isteingeek.de", "istmein.de", "lebtimnetz.de", "leitungsen.de", "traeumtgerade.de", "barrel-of-knowledge.info", "barrell-of-knowledge.info", "dyndns.info", "for-our.info", "groks-the.info", "groks-this.info", "here-for-more.info", "knowsitall.info", "selfip.info", "webhop.info", "forgot.her.name", "forgot.his.name", "at-band-camp.net", "blogdns.net", "broke-it.net", "buyshouses.net", "dnsalias.net", "dnsdojo.net", "does-it.net", "dontexist.net", "dynalias.net", "dynathome.net", "endofinternet.net", "from-az.net", "from-co.net", "from-la.net", "from-ny.net", "gets-it.net", "ham-radio-op.net", "homeftp.net", "homeip.net", "homelinux.net", "homeunix.net", "in-the-band.net", "is-a-chef.net", "is-a-geek.net", "isa-geek.net", "kicks-ass.net", "office-on-the.net", "podzone.net", "scrapper-site.net", "selfip.net", "sells-it.net", "servebbs.net", "serveftp.net", "thruhere.net", "webhop.net", "merseine.nu", "mine.nu", "shacknet.nu", "blogdns.org", "blogsite.org", "boldlygoingnowhere.org", "dnsalias.org", "dnsdojo.org", "doesntexist.org", "dontexist.org", "doomdns.org", "dvrdns.org", "dynalias.org", "dyndns.org", "go.dyndns.org", "home.dyndns.org", "endofinternet.org", "endoftheinternet.org", "from-me.org", "game-host.org", "gotdns.org", "hobby-site.org", "homedns.org", "homeftp.org", "homelinux.org", "homeunix.org", "is-a-bruinsfan.org", "is-a-candidate.org", "is-a-celticsfan.org", "is-a-chef.org", "is-a-geek.org", "is-a-knight.org", "is-a-linux-user.org", "is-a-patsfan.org", "is-a-soxfan.org", "is-found.org", "is-lost.org", "is-saved.org", "is-very-bad.org", "is-very-evil.org", "is-very-good.org", "is-very-nice.org", "is-very-sweet.org", "isa-geek.org", "kicks-ass.org", "misconfused.org", "podzone.org", "readmyblog.org", "selfip.org", "sellsyourhome.org", "servebbs.org", "serveftp.org", "servegame.org", "stuff-4-sale.org", "webhop.org", "better-than.tv", "dyndns.tv", "on-the-web.tv", "worse-than.tv", "is-by.us", "land-4-sale.us", "stuff-4-sale.us", "dyndns.ws", "mypets.ws", "ddnsfree.com", "ddnsgeek.com", "giize.com", "gleeze.com", "kozow.com", "loseyourip.com", "ooguy.com", "theworkpc.com", "casacam.net", "dynu.net", "accesscam.org", "camdvr.org", "freeddns.org", "mywire.org", "webredirect.org", "myddns.rocks", "dynv6.net", "e4.cz", "easypanel.app", "easypanel.host", "*.ewp.live", "twmail.cc", "twmail.net", "twmail.org", "mymailer.com.tw", "url.tw", "at.emf.camp", "rt.ht", "elementor.cloud", "elementor.cool", "en-root.fr", "mytuleap.com", "tuleap-partners.com", "encr.app", "encoreapi.com", "eu.encoway.cloud", "eu.org", "al.eu.org", "asso.eu.org", "at.eu.org", "au.eu.org", "be.eu.org", "bg.eu.org", "ca.eu.org", "cd.eu.org", "ch.eu.org", "cn.eu.org", "cy.eu.org", "cz.eu.org", "de.eu.org", "dk.eu.org", "edu.eu.org", "ee.eu.org", "es.eu.org", "fi.eu.org", "fr.eu.org", "gr.eu.org", "hr.eu.org", "hu.eu.org", "ie.eu.org", "il.eu.org", "in.eu.org", "int.eu.org", "is.eu.org", "it.eu.org", "jp.eu.org", "kr.eu.org", "lt.eu.org", "lu.eu.org", "lv.eu.org", "me.eu.org", "mk.eu.org", "mt.eu.org", "my.eu.org", "net.eu.org", "ng.eu.org", "nl.eu.org", "no.eu.org", "nz.eu.org", "pl.eu.org", "pt.eu.org", "ro.eu.org", "ru.eu.org", "se.eu.org", "si.eu.org", "sk.eu.org", "tr.eu.org", "uk.eu.org", "us.eu.org", "eurodir.ru", "eu-1.evennode.com", "eu-2.evennode.com", "eu-3.evennode.com", "eu-4.evennode.com", "us-1.evennode.com", "us-2.evennode.com", "us-3.evennode.com", "us-4.evennode.com", "relay.evervault.app", "relay.evervault.dev", "expo.app", "staging.expo.app", "onfabrica.com", "ru.net", "adygeya.ru", "bashkiria.ru", "bir.ru", "cbg.ru", "com.ru", "dagestan.ru", "grozny.ru", "kalmykia.ru", "kustanai.ru", "marine.ru", "mordovia.ru", "msk.ru", "mytis.ru", "nalchik.ru", "nov.ru", "pyatigorsk.ru", "spb.ru", "vladikavkaz.ru", "vladimir.ru", "abkhazia.su", "adygeya.su", "aktyubinsk.su", "arkhangelsk.su", "armenia.su", "ashgabad.su", "azerbaijan.su", "balashov.su", "bashkiria.su", "bryansk.su", "bukhara.su", "chimkent.su", "dagestan.su", "east-kazakhstan.su", "exnet.su", "georgia.su", "grozny.su", "ivanovo.su", "jambyl.su", "kalmykia.su", "kaluga.su", "karacol.su", "karaganda.su", "karelia.su", "khakassia.su", "krasnodar.su", "kurgan.su", "kustanai.su", "lenug.su", "mangyshlak.su", "mordovia.su", "msk.su", "murmansk.su", "nalchik.su", "navoi.su", "north-kazakhstan.su", "nov.su", "obninsk.su", "penza.su", "pokrovsk.su", "sochi.su", "spb.su", "tashkent.su", "termez.su", "togliatti.su", "troitsk.su", "tselinograd.su", "tula.su", "tuva.su", "vladikavkaz.su", "vladimir.su", "vologda.su", "channelsdvr.net", "u.channelsdvr.net", "edgecompute.app", "fastly-edge.com", "fastly-terrarium.com", "freetls.fastly.net", "map.fastly.net", "a.prod.fastly.net", "global.prod.fastly.net", "a.ssl.fastly.net", "b.ssl.fastly.net", "global.ssl.fastly.net", "fastlylb.net", "map.fastlylb.net", "*.user.fm", "fastvps-server.com", "fastvps.host", "myfast.host", "fastvps.site", "myfast.space", "conn.uk", "copro.uk", "hosp.uk", "fedorainfracloud.org", "fedorapeople.org", "cloud.fedoraproject.org", "app.os.fedoraproject.org", "app.os.stg.fedoraproject.org", "mydobiss.com", "fh-muenster.io", "filegear.me", "firebaseapp.com", "fldrv.com", "flutterflow.app", "fly.dev", "shw.io", "edgeapp.net", "forgeblocks.com", "id.forgerock.io", "framer.ai", "framer.app", "framercanvas.com", "framer.media", "framer.photos", "framer.website", "framer.wiki", "0e.vc", "freebox-os.com", "freeboxos.com", "fbx-os.fr", "fbxos.fr", "freebox-os.fr", "freeboxos.fr", "freedesktop.org", "freemyip.com", "*.frusky.de", "wien.funkfeuer.at", "daemon.asia", "dix.asia", "mydns.bz", "0am.jp", "0g0.jp", "0j0.jp", "0t0.jp", "mydns.jp", "pgw.jp", "wjg.jp", "keyword-on.net", "live-on.net", "server-on.net", "mydns.tw", "mydns.vc", "*.futurecms.at", "*.ex.futurecms.at", "*.in.futurecms.at", "futurehosting.at", "futuremailing.at", "*.ex.ortsinfo.at", "*.kunden.ortsinfo.at", "*.statics.cloud", "aliases121.com", "campaign.gov.uk", "service.gov.uk", "independent-commission.uk", "independent-inquest.uk", "independent-inquiry.uk", "independent-panel.uk", "independent-review.uk", "public-inquiry.uk", "royal-commission.uk", "gehirn.ne.jp", "usercontent.jp", "gentapps.com", "gentlentapis.com", "lab.ms", "cdn-edges.net", "localcert.net", "localhostcert.net", "gsj.bz", "githubusercontent.com", "githubpreview.dev", "github.io", "gitlab.io", "gitapp.si", "gitpage.si", "glitch.me", "nog.community", "co.ro", "shop.ro", "lolipop.io", "angry.jp", "babyblue.jp", "babymilk.jp", "backdrop.jp", "bambina.jp", "bitter.jp", "blush.jp", "boo.jp", "boy.jp", "boyfriend.jp", "but.jp", "candypop.jp", "capoo.jp", "catfood.jp", "cheap.jp", "chicappa.jp", "chillout.jp", "chips.jp", "chowder.jp", "chu.jp", "ciao.jp", "cocotte.jp", "coolblog.jp", "cranky.jp", "cutegirl.jp", "daa.jp", "deca.jp", "deci.jp", "digick.jp", "egoism.jp", "fakefur.jp", "fem.jp", "flier.jp", "floppy.jp", "fool.jp", "frenchkiss.jp", "girlfriend.jp", "girly.jp", "gloomy.jp", "gonna.jp", "greater.jp", "hacca.jp", "heavy.jp", "her.jp", "hiho.jp", "hippy.jp", "holy.jp", "hungry.jp", "icurus.jp", "itigo.jp", "jellybean.jp", "kikirara.jp", "kill.jp", "kilo.jp", "kuron.jp", "littlestar.jp", "lolipopmc.jp", "lolitapunk.jp", "lomo.jp", "lovepop.jp", "lovesick.jp", "main.jp", "mods.jp", "mond.jp", "mongolian.jp", "moo.jp", "namaste.jp", "nikita.jp", "nobushi.jp", "noor.jp", "oops.jp", "parallel.jp", "parasite.jp", "pecori.jp", "peewee.jp", "penne.jp", "pepper.jp", "perma.jp", "pigboat.jp", "pinoko.jp", "punyu.jp", "pupu.jp", "pussycat.jp", "pya.jp", "raindrop.jp", "readymade.jp", "sadist.jp", "schoolbus.jp", "secret.jp", "staba.jp", "stripper.jp", "sub.jp", "sunnyday.jp", "thick.jp", "tonkotsu.jp", "under.jp", "upper.jp", "velvet.jp", "verse.jp", "versus.jp", "vivian.jp", "watson.jp", "weblike.jp", "whitesnow.jp", "zombie.jp", "heteml.net", "graphic.design", "goip.de", "blogspot.ae", "blogspot.al", "blogspot.am", "*.hosted.app", "*.run.app", "web.app", "blogspot.com.ar", "blogspot.co.at", "blogspot.com.au", "blogspot.ba", "blogspot.be", "blogspot.bg", "blogspot.bj", "blogspot.com.br", "blogspot.com.by", "blogspot.ca", "blogspot.cf", "blogspot.ch", "blogspot.cl", "blogspot.com.co", "*.0emm.com", "appspot.com", "*.r.appspot.com", "blogspot.com", "codespot.com", "googleapis.com", "googlecode.com", "pagespeedmobilizer.com", "withgoogle.com", "withyoutube.com", "blogspot.cv", "blogspot.com.cy", "blogspot.cz", "blogspot.de", "*.gateway.dev", "blogspot.dk", "blogspot.com.ee", "blogspot.com.eg", "blogspot.com.es", "blogspot.fi", "blogspot.fr", "cloud.goog", "translate.goog", "*.usercontent.goog", "blogspot.gr", "blogspot.hk", "blogspot.hr", "blogspot.hu", "blogspot.co.id", "blogspot.ie", "blogspot.co.il", "blogspot.in", "blogspot.is", "blogspot.it", "blogspot.jp", "blogspot.co.ke", "blogspot.kr", "blogspot.li", "blogspot.lt", "blogspot.lu", "blogspot.md", "blogspot.mk", "blogspot.com.mt", "blogspot.mx", "blogspot.my", "cloudfunctions.net", "blogspot.com.ng", "blogspot.nl", "blogspot.no", "blogspot.co.nz", "blogspot.pe", "blogspot.pt", "blogspot.qa", "blogspot.re", "blogspot.ro", "blogspot.rs", "blogspot.ru", "blogspot.se", "blogspot.sg", "blogspot.si", "blogspot.sk", "blogspot.sn", "blogspot.td", "blogspot.com.tr", "blogspot.tw", "blogspot.ug", "blogspot.co.uk", "blogspot.com.uy", "blogspot.vn", "blogspot.co.za", "goupile.fr", "pymnt.uk", "cloudapps.digital", "london.cloudapps.digital", "gov.nl", "grafana-dev.net", "grayjayleagues.com", "g\xFCnstigbestellen.de", "g\xFCnstigliefern.de", "fin.ci", "free.hr", "caa.li", "ua.rs", "conf.se", "h\xE4kkinen.fi", "hrsn.dev", "hashbang.sh", "hasura.app", "hasura-app.io", "hatenablog.com", "hatenadiary.com", "hateblo.jp", "hatenablog.jp", "hatenadiary.jp", "hatenadiary.org", "pages.it.hs-heilbronn.de", "pages-research.it.hs-heilbronn.de", "heiyu.space", "helioho.st", "heliohost.us", "hepforge.org", "herokuapp.com", "herokussl.com", "heyflow.page", "heyflow.site", "ravendb.cloud", "ravendb.community", "development.run", "ravendb.run", "homesklep.pl", "*.kin.one", "*.id.pub", "*.kin.pub", "secaas.hk", "hoplix.shop", "orx.biz", "biz.gl", "biz.ng", "co.biz.ng", "dl.biz.ng", "go.biz.ng", "lg.biz.ng", "on.biz.ng", "col.ng", "firm.ng", "gen.ng", "ltd.ng", "ngo.ng", "plc.ng", "ie.ua", "hostyhosting.io", "hf.space", "static.hf.space", "hypernode.io", "iobb.net", "co.cz", "*.moonscale.io", "moonscale.net", "gr.com", "iki.fi", "ibxos.it", "iliadboxos.it", "smushcdn.com", "wphostedmail.com", "wpmucdn.com", "tempurl.host", "wpmudev.host", "dyn-berlin.de", "in-berlin.de", "in-brb.de", "in-butter.de", "in-dsl.de", "in-vpn.de", "in-dsl.net", "in-vpn.net", "in-dsl.org", "in-vpn.org", "biz.at", "info.at", "info.cx", "ac.leg.br", "al.leg.br", "am.leg.br", "ap.leg.br", "ba.leg.br", "ce.leg.br", "df.leg.br", "es.leg.br", "go.leg.br", "ma.leg.br", "mg.leg.br", "ms.leg.br", "mt.leg.br", "pa.leg.br", "pb.leg.br", "pe.leg.br", "pi.leg.br", "pr.leg.br", "rj.leg.br", "rn.leg.br", "ro.leg.br", "rr.leg.br", "rs.leg.br", "sc.leg.br", "se.leg.br", "sp.leg.br", "to.leg.br", "pixolino.com", "na4u.ru", "apps-1and1.com", "live-website.com", "apps-1and1.net", "websitebuilder.online", "app-ionos.space", "iopsys.se", "*.dweb.link", "ipifony.net", "ir.md", "is-a-good.dev", "is-a.dev", "iservschule.de", "mein-iserv.de", "schulplattform.de", "schulserver.de", "test-iserv.de", "iserv.dev", "mel.cloudlets.com.au", "cloud.interhostsolutions.be", "alp1.ae.flow.ch", "appengine.flow.ch", "es-1.axarnet.cloud", "diadem.cloud", "vip.jelastic.cloud", "jele.cloud", "it1.eur.aruba.jenv-aruba.cloud", "it1.jenv-aruba.cloud", "keliweb.cloud", "cs.keliweb.cloud", "oxa.cloud", "tn.oxa.cloud", "uk.oxa.cloud", "primetel.cloud", "uk.primetel.cloud", "ca.reclaim.cloud", "uk.reclaim.cloud", "us.reclaim.cloud", "ch.trendhosting.cloud", "de.trendhosting.cloud", "jele.club", "dopaas.com", "paas.hosted-by-previder.com", "rag-cloud.hosteur.com", "rag-cloud-ch.hosteur.com", "jcloud.ik-server.com", "jcloud-ver-jpc.ik-server.com", "demo.jelastic.com", "paas.massivegrid.com", "jed.wafaicloud.com", "ryd.wafaicloud.com", "j.scaleforce.com.cy", "jelastic.dogado.eu", "fi.cloudplatform.fi", "demo.datacenter.fi", "paas.datacenter.fi", "jele.host", "mircloud.host", "paas.beebyte.io", "sekd1.beebyteapp.io", "jele.io", "jc.neen.it", "jcloud.kz", "cloudjiffy.net", "fra1-de.cloudjiffy.net", "west1-us.cloudjiffy.net", "jls-sto1.elastx.net", "jls-sto2.elastx.net", "jls-sto3.elastx.net", "fr-1.paas.massivegrid.net", "lon-1.paas.massivegrid.net", "lon-2.paas.massivegrid.net", "ny-1.paas.massivegrid.net", "ny-2.paas.massivegrid.net", "sg-1.paas.massivegrid.net", "jelastic.saveincloud.net", "nordeste-idc.saveincloud.net", "j.scaleforce.net", "sdscloud.pl", "unicloud.pl", "mircloud.ru", "enscaled.sg", "jele.site", "jelastic.team", "orangecloud.tn", "j.layershift.co.uk", "phx.enscaled.us", "mircloud.us", "myjino.ru", "*.hosting.myjino.ru", "*.landing.myjino.ru", "*.spectrum.myjino.ru", "*.vps.myjino.ru", "jotelulu.cloud", "webadorsite.com", "jouwweb.site", "*.cns.joyent.com", "*.triton.zone", "js.org", "kaas.gg", "khplay.nl", "kapsi.fi", "ezproxy.kuleuven.be", "kuleuven.cloud", "keymachine.de", "kinghost.net", "uni5.net", "knightpoint.systems", "koobin.events", "webthings.io", "krellian.net", "oya.to", "git-repos.de", "lcube-server.de", "svn-repos.de", "leadpages.co", "lpages.co", "lpusercontent.com", "lelux.site", "libp2p.direct", "runcontainers.dev", "co.business", "co.education", "co.events", "co.financial", "co.network", "co.place", "co.technology", "linkyard-cloud.ch", "linkyard.cloud", "members.linode.com", "*.nodebalancer.linode.com", "*.linodeobjects.com", "ip.linodeusercontent.com", "we.bs", "filegear-sg.me", "ggff.net", "*.user.localcert.dev", "lodz.pl", "pabianice.pl", "plock.pl", "sieradz.pl", "skierniewice.pl", "zgierz.pl", "loginline.app", "loginline.dev", "loginline.io", "loginline.services", "loginline.site", "lohmus.me", "servers.run", "krasnik.pl", "leczna.pl", "lubartow.pl", "lublin.pl", "poniatowa.pl", "swidnik.pl", "glug.org.uk", "lug.org.uk", "lugs.org.uk", "barsy.bg", "barsy.club", "barsycenter.com", "barsyonline.com", "barsy.de", "barsy.dev", "barsy.eu", "barsy.gr", "barsy.in", "barsy.info", "barsy.io", "barsy.me", "barsy.menu", "barsyonline.menu", "barsy.mobi", "barsy.net", "barsy.online", "barsy.org", "barsy.pro", "barsy.pub", "barsy.ro", "barsy.rs", "barsy.shop", "barsyonline.shop", "barsy.site", "barsy.store", "barsy.support", "barsy.uk", "barsy.co.uk", "barsyonline.co.uk", "*.magentosite.cloud", "hb.cldmail.ru", "matlab.cloud", "modelscape.com", "mwcloudnonprod.com", "polyspace.com", "mayfirst.info", "mayfirst.org", "mazeplay.com", "mcdir.me", "mcdir.ru", "vps.mcdir.ru", "mcpre.ru", "mediatech.by", "mediatech.dev", "hra.health", "medusajs.app", "miniserver.com", "memset.net", "messerli.app", "atmeta.com", "apps.fbsbx.com", "*.cloud.metacentrum.cz", "custom.metacentrum.cz", "flt.cloud.muni.cz", "usr.cloud.muni.cz", "meteorapp.com", "eu.meteorapp.com", "co.pl", "*.azurecontainer.io", "azure-api.net", "azure-mobile.net", "azureedge.net", "azurefd.net", "azurestaticapps.net", "1.azurestaticapps.net", "2.azurestaticapps.net", "3.azurestaticapps.net", "4.azurestaticapps.net", "5.azurestaticapps.net", "6.azurestaticapps.net", "7.azurestaticapps.net", "centralus.azurestaticapps.net", "eastasia.azurestaticapps.net", "eastus2.azurestaticapps.net", "westeurope.azurestaticapps.net", "westus2.azurestaticapps.net", "azurewebsites.net", "cloudapp.net", "trafficmanager.net", "blob.core.windows.net", "servicebus.windows.net", "routingthecloud.com", "sn.mynetname.net", "routingthecloud.net", "routingthecloud.org", "csx.cc", "mydbserver.com", "webspaceconfig.de", "mittwald.info", "mittwaldserver.info", "typo3server.info", "project.space", "modx.dev", "bmoattachments.org", "net.ru", "org.ru", "pp.ru", "hostedpi.com", "caracal.mythic-beasts.com", "customer.mythic-beasts.com", "fentiger.mythic-beasts.com", "lynx.mythic-beasts.com", "ocelot.mythic-beasts.com", "oncilla.mythic-beasts.com", "onza.mythic-beasts.com", "sphinx.mythic-beasts.com", "vs.mythic-beasts.com", "x.mythic-beasts.com", "yali.mythic-beasts.com", "cust.retrosnub.co.uk", "ui.nabu.casa", "cloud.nospamproxy.com", "netfy.app", "netlify.app", "4u.com", "nfshost.com", "ipfs.nftstorage.link", "ngo.us", "ngrok.app", "ngrok-free.app", "ngrok.dev", "ngrok-free.dev", "ngrok.io", "ap.ngrok.io", "au.ngrok.io", "eu.ngrok.io", "in.ngrok.io", "jp.ngrok.io", "sa.ngrok.io", "us.ngrok.io", "ngrok.pizza", "ngrok.pro", "torun.pl", "nh-serv.co.uk", "nimsite.uk", "mmafan.biz", "myftp.biz", "no-ip.biz", "no-ip.ca", "fantasyleague.cc", "gotdns.ch", "3utilities.com", "blogsyte.com", "ciscofreak.com", "damnserver.com", "ddnsking.com", "ditchyourip.com", "dnsiskinky.com", "dynns.com", "geekgalaxy.com", "health-carereform.com", "homesecuritymac.com", "homesecuritypc.com", "myactivedirectory.com", "mysecuritycamera.com", "myvnc.com", "net-freaks.com", "onthewifi.com", "point2this.com", "quicksytes.com", "securitytactics.com", "servebeer.com", "servecounterstrike.com", "serveexchange.com", "serveftp.com", "servegame.com", "servehalflife.com", "servehttp.com", "servehumour.com", "serveirc.com", "servemp3.com", "servep2p.com", "servepics.com", "servequake.com", "servesarcasm.com", "stufftoread.com", "unusualperson.com", "workisboring.com", "dvrcam.info", "ilovecollege.info", "no-ip.info", "brasilia.me", "ddns.me", "dnsfor.me", "hopto.me", "loginto.me", "noip.me", "webhop.me", "bounceme.net", "ddns.net", "eating-organic.net", "mydissent.net", "myeffect.net", "mymediapc.net", "mypsx.net", "mysecuritycamera.net", "nhlfan.net", "no-ip.net", "pgafan.net", "privatizehealthinsurance.net", "redirectme.net", "serveblog.net", "serveminecraft.net", "sytes.net", "cable-modem.org", "collegefan.org", "couchpotatofries.org", "hopto.org", "mlbfan.org", "myftp.org", "mysecuritycamera.org", "nflfan.org", "no-ip.org", "read-books.org", "ufcfan.org", "zapto.org", "no-ip.co.uk", "golffan.us", "noip.us", "pointto.us", "stage.nodeart.io", "*.developer.app", "noop.app", "*.northflank.app", "*.build.run", "*.code.run", "*.database.run", "*.migration.run", "noticeable.news", "notion.site", "dnsking.ch", "mypi.co", "n4t.co", "001www.com", "myiphost.com", "forumz.info", "soundcast.me", "tcp4.me", "dnsup.net", "hicam.net", "now-dns.net", "ownip.net", "vpndns.net", "dynserv.org", "now-dns.org", "x443.pw", "now-dns.top", "ntdll.top", "freeddns.us", "nsupdate.info", "nerdpol.ovh", "nyc.mn", "prvcy.page", "obl.ong", "observablehq.cloud", "static.observableusercontent.com", "omg.lol", "cloudycluster.net", "omniwe.site", "123webseite.at", "123website.be", "simplesite.com.br", "123website.ch", "simplesite.com", "123webseite.de", "123hjemmeside.dk", "123miweb.es", "123kotisivu.fi", "123siteweb.fr", "simplesite.gr", "123homepage.it", "123website.lu", "123website.nl", "123hjemmeside.no", "service.one", "simplesite.pl", "123paginaweb.pt", "123minsida.se", "is-a-fullstack.dev", "is-cool.dev", "is-not-a.dev", "localplayer.dev", "is-local.org", "opensocial.site", "opencraft.hosting", "16-b.it", "32-b.it", "64-b.it", "orsites.com", "operaunite.com", "*.customer-oci.com", "*.oci.customer-oci.com", "*.ocp.customer-oci.com", "*.ocs.customer-oci.com", "*.oraclecloudapps.com", "*.oraclegovcloudapps.com", "*.oraclegovcloudapps.uk", "tech.orange", "can.re", "authgear-staging.com", "authgearapps.com", "skygearapp.com", "outsystemscloud.com", "*.hosting.ovh.net", "*.webpaas.ovh.net", "ownprovider.com", "own.pm", "*.owo.codes", "ox.rs", "oy.lc", "pgfog.com", "pagexl.com", "gotpantheon.com", "pantheonsite.io", "*.paywhirl.com", "*.xmit.co", "xmit.dev", "madethis.site", "srv.us", "gh.srv.us", "gl.srv.us", "lk3.ru", "mypep.link", "perspecta.cloud", "on-web.fr", "*.upsun.app", "upsunapp.com", "ent.platform.sh", "eu.platform.sh", "us.platform.sh", "*.platformsh.site", "*.tst.site", "platter-app.com", "platter-app.dev", "platterp.us", "pley.games", "onporter.run", "co.bn", "postman-echo.com", "pstmn.io", "mock.pstmn.io", "httpbin.org", "prequalifyme.today", "xen.prgmr.com", "priv.at", "protonet.io", "chirurgiens-dentistes-en-france.fr", "byen.site", "pubtls.org", "pythonanywhere.com", "eu.pythonanywhere.com", "qa2.com", "qcx.io", "*.sys.qcx.io", "myqnapcloud.cn", "alpha-myqnapcloud.com", "dev-myqnapcloud.com", "mycloudnas.com", "mynascloud.com", "myqnapcloud.com", "qoto.io", "qualifioapp.com", "ladesk.com", "qbuser.com", "*.quipelements.com", "vapor.cloud", "vaporcloud.io", "rackmaze.com", "rackmaze.net", "cloudsite.builders", "myradweb.net", "servername.us", "web.in", "in.net", "myrdbx.io", "site.rb-hosting.io", "*.on-rancher.cloud", "*.on-k3s.io", "*.on-rio.io", "ravpage.co.il", "readthedocs-hosted.com", "readthedocs.io", "rhcloud.com", "instances.spawn.cc", "onrender.com", "app.render.com", "replit.app", "id.replit.app", "firewalledreplit.co", "id.firewalledreplit.co", "repl.co", "id.repl.co", "replit.dev", "archer.replit.dev", "bones.replit.dev", "canary.replit.dev", "global.replit.dev", "hacker.replit.dev", "id.replit.dev", "janeway.replit.dev", "kim.replit.dev", "kira.replit.dev", "kirk.replit.dev", "odo.replit.dev", "paris.replit.dev", "picard.replit.dev", "pike.replit.dev", "prerelease.replit.dev", "reed.replit.dev", "riker.replit.dev", "sisko.replit.dev", "spock.replit.dev", "staging.replit.dev", "sulu.replit.dev", "tarpit.replit.dev", "teams.replit.dev", "tucker.replit.dev", "wesley.replit.dev", "worf.replit.dev", "repl.run", "resindevice.io", "devices.resinstaging.io", "hzc.io", "adimo.co.uk", "itcouldbewor.se", "aus.basketball", "nz.basketball", "git-pages.rit.edu", "rocky.page", "rub.de", "ruhr-uni-bochum.de", "io.noc.ruhr-uni-bochum.de", "\u0431\u0438\u0437.\u0440\u0443\u0441", "\u043A\u043E\u043C.\u0440\u0443\u0441", "\u043A\u0440\u044B\u043C.\u0440\u0443\u0441", "\u043C\u0438\u0440.\u0440\u0443\u0441", "\u043C\u0441\u043A.\u0440\u0443\u0441", "\u043E\u0440\u0433.\u0440\u0443\u0441", "\u0441\u0430\u043C\u0430\u0440\u0430.\u0440\u0443\u0441", "\u0441\u043E\u0447\u0438.\u0440\u0443\u0441", "\u0441\u043F\u0431.\u0440\u0443\u0441", "\u044F.\u0440\u0443\u0441", "ras.ru", "nyat.app", "180r.com", "dojin.com", "sakuratan.com", "sakuraweb.com", "x0.com", "2-d.jp", "bona.jp", "crap.jp", "daynight.jp", "eek.jp", "flop.jp", "halfmoon.jp", "jeez.jp", "matrix.jp", "mimoza.jp", "ivory.ne.jp", "mail-box.ne.jp", "mints.ne.jp", "mokuren.ne.jp", "opal.ne.jp", "sakura.ne.jp", "sumomo.ne.jp", "topaz.ne.jp", "netgamers.jp", "nyanta.jp", "o0o0.jp", "rdy.jp", "rgr.jp", "rulez.jp", "s3.isk01.sakurastorage.jp", "s3.isk02.sakurastorage.jp", "saloon.jp", "sblo.jp", "skr.jp", "tank.jp", "uh-oh.jp", "undo.jp", "rs.webaccel.jp", "user.webaccel.jp", "websozai.jp", "xii.jp", "squares.net", "jpn.org", "kirara.st", "x0.to", "from.tv", "sakura.tv", "*.builder.code.com", "*.dev-builder.code.com", "*.stg-builder.code.com", "*.001.test.code-builder-stg.platform.salesforce.com", "*.d.crm.dev", "*.w.crm.dev", "*.wa.crm.dev", "*.wb.crm.dev", "*.wc.crm.dev", "*.wd.crm.dev", "*.we.crm.dev", "*.wf.crm.dev", "sandcats.io", "logoip.com", "logoip.de", "fr-par-1.baremetal.scw.cloud", "fr-par-2.baremetal.scw.cloud", "nl-ams-1.baremetal.scw.cloud", "cockpit.fr-par.scw.cloud", "fnc.fr-par.scw.cloud", "functions.fnc.fr-par.scw.cloud", "k8s.fr-par.scw.cloud", "nodes.k8s.fr-par.scw.cloud", "s3.fr-par.scw.cloud", "s3-website.fr-par.scw.cloud", "whm.fr-par.scw.cloud", "priv.instances.scw.cloud", "pub.instances.scw.cloud", "k8s.scw.cloud", "cockpit.nl-ams.scw.cloud", "k8s.nl-ams.scw.cloud", "nodes.k8s.nl-ams.scw.cloud", "s3.nl-ams.scw.cloud", "s3-website.nl-ams.scw.cloud", "whm.nl-ams.scw.cloud", "cockpit.pl-waw.scw.cloud", "k8s.pl-waw.scw.cloud", "nodes.k8s.pl-waw.scw.cloud", "s3.pl-waw.scw.cloud", "s3-website.pl-waw.scw.cloud", "scalebook.scw.cloud", "smartlabeling.scw.cloud", "dedibox.fr", "schokokeks.net", "gov.scot", "service.gov.scot", "scrysec.com", "client.scrypted.io", "firewall-gateway.com", "firewall-gateway.de", "my-gateway.de", "my-router.de", "spdns.de", "spdns.eu", "firewall-gateway.net", "my-firewall.org", "myfirewall.org", "spdns.org", "seidat.net", "sellfy.store", "minisite.ms", "senseering.net", "servebolt.cloud", "biz.ua", "co.ua", "pp.ua", "as.sh.cn", "sheezy.games", "shiftedit.io", "myshopblocks.com", "myshopify.com", "shopitsite.com", "shopware.shop", "shopware.store", "mo-siemens.io", "1kapp.com", "appchizi.com", "applinzi.com", "sinaapp.com", "vipsinaapp.com", "siteleaf.net", "small-web.org", "aeroport.fr", "avocat.fr", "chambagri.fr", "chirurgiens-dentistes.fr", "experts-comptables.fr", "medecin.fr", "notaires.fr", "pharmacien.fr", "port.fr", "veterinaire.fr", "vp4.me", "*.snowflake.app", "*.privatelink.snowflake.app", "streamlit.app", "streamlitapp.com", "try-snowplow.com", "mafelo.net", "playstation-cloud.com", "srht.site", "apps.lair.io", "*.stolos.io", "spacekit.io", "ind.mom", "customer.speedpartner.de", "myspreadshop.at", "myspreadshop.com.au", "myspreadshop.be", "myspreadshop.ca", "myspreadshop.ch", "myspreadshop.com", "myspreadshop.de", "myspreadshop.dk", "myspreadshop.es", "myspreadshop.fi", "myspreadshop.fr", "myspreadshop.ie", "myspreadshop.it", "myspreadshop.net", "myspreadshop.nl", "myspreadshop.no", "myspreadshop.pl", "myspreadshop.se", "myspreadshop.co.uk", "w-corp-staticblitz.com", "w-credentialless-staticblitz.com", "w-staticblitz.com", "stackhero-network.com", "runs.onstackit.cloud", "stackit.gg", "stackit.rocks", "stackit.run", "stackit.zone", "musician.io", "novecore.site", "api.stdlib.com", "feedback.ac", "forms.ac", "assessments.cx", "calculators.cx", "funnels.cx", "paynow.cx", "quizzes.cx", "researched.cx", "tests.cx", "surveys.so", "storebase.store", "storipress.app", "storj.farm", "strapiapp.com", "media.strapiapp.com", "vps-host.net", "atl.jelastic.vps-host.net", "njs.jelastic.vps-host.net", "ric.jelastic.vps-host.net", "streak-link.com", "streaklinks.com", "streakusercontent.com", "soc.srcf.net", "user.srcf.net", "utwente.io", "temp-dns.com", "supabase.co", "supabase.in", "supabase.net", "syncloud.it", "dscloud.biz", "direct.quickconnect.cn", "dsmynas.com", "familyds.com", "diskstation.me", "dscloud.me", "i234.me", "myds.me", "synology.me", "dscloud.mobi", "dsmynas.net", "familyds.net", "dsmynas.org", "familyds.org", "direct.quickconnect.to", "vpnplus.to", "mytabit.com", "mytabit.co.il", "tabitorder.co.il", "taifun-dns.de", "ts.net", "*.c.ts.net", "gda.pl", "gdansk.pl", "gdynia.pl", "med.pl", "sopot.pl", "taveusercontent.com", "p.tawk.email", "p.tawkto.email", "site.tb-hosting.com", "edugit.io", "s3.teckids.org", "telebit.app", "telebit.io", "*.telebit.xyz", "*.firenet.ch", "*.svc.firenet.ch", "reservd.com", "thingdustdata.com", "cust.dev.thingdust.io", "reservd.dev.thingdust.io", "cust.disrec.thingdust.io", "reservd.disrec.thingdust.io", "cust.prod.thingdust.io", "cust.testing.thingdust.io", "reservd.testing.thingdust.io", "tickets.io", "arvo.network", "azimuth.network", "tlon.network", "torproject.net", "pages.torproject.net", "townnews-staging.com", "12hp.at", "2ix.at", "4lima.at", "lima-city.at", "12hp.ch", "2ix.ch", "4lima.ch", "lima-city.ch", "trafficplex.cloud", "de.cool", "12hp.de", "2ix.de", "4lima.de", "lima-city.de", "1337.pictures", "clan.rip", "lima-city.rocks", "webspace.rocks", "lima.zone", "*.transurl.be", "*.transurl.eu", "site.transip.me", "*.transurl.nl", "tuxfamily.org", "dd-dns.de", "dray-dns.de", "draydns.de", "dyn-vpn.de", "dynvpn.de", "mein-vigor.de", "my-vigor.de", "my-wan.de", "syno-ds.de", "synology-diskstation.de", "synology-ds.de", "diskstation.eu", "diskstation.org", "typedream.app", "pro.typeform.com", "*.uberspace.de", "uber.space", "hk.com", "inc.hk", "ltd.hk", "hk.org", "it.com", "unison-services.cloud", "virtual-user.de", "virtualuser.de", "name.pm", "sch.tf", "biz.wf", "sch.wf", "org.yt", "rs.ba", "bielsko.pl", "upli.io", "urown.cloud", "dnsupdate.info", "us.org", "v.ua", "express.val.run", "web.val.run", "vercel.app", "v0.build", "vercel.dev", "vusercontent.net", "now.sh", "2038.io", "router.management", "v-info.info", "voorloper.cloud", "*.vultrobjects.com", "wafflecell.com", "webflow.io", "webflowtest.io", "*.webhare.dev", "bookonline.app", "hotelwithflight.com", "reserve-online.com", "reserve-online.net", "cprapid.com", "pleskns.com", "wp2.host", "pdns.page", "plesk.page", "wpsquared.site", "*.wadl.top", "remotewd.com", "box.ca", "pages.wiardweb.com", "toolforge.org", "wmcloud.org", "wmflabs.org", "wdh.app", "panel.gg", "daemon.panel.gg", "wixsite.com", "wixstudio.com", "editorx.io", "wixstudio.io", "wix.run", "messwithdns.com", "woltlab-demo.com", "myforum.community", "community-pro.de", "diskussionsbereich.de", "community-pro.net", "meinforum.net", "affinitylottery.org.uk", "raffleentry.org.uk", "weeklylottery.org.uk", "wpenginepowered.com", "js.wpenginepowered.com", "half.host", "xnbay.com", "u2.xnbay.com", "u2-local.xnbay.com", "cistron.nl", "demon.nl", "xs4all.space", "yandexcloud.net", "storage.yandexcloud.net", "website.yandexcloud.net", "official.academy", "yolasite.com", "yombo.me", "ynh.fr", "nohost.me", "noho.st", "za.net", "za.org", "zap.cloud", "zeabur.app", "bss.design", "basicserver.io", "virtualserver.io", "enterprisecloud.nu"];
    var Z = Y.reduce((e, s) => {
      const c = s.replace(/^(\*\.|\!)/, ""), o = A.toASCII(c), t = s.charAt(0);
      if (e.has(o))
        throw new Error(`Multiple rules found for ${s} (${o})`);
      return e.set(o, { rule: s, suffix: c, punySuffix: o, wildcard: t === "*", exception: t === "!" }), e;
    }, /* @__PURE__ */ new Map());
    var aa = (e) => {
      const c = A.toASCII(e).split(".");
      for (let o = 0; o < c.length; o++) {
        const t = c.slice(o).join("."), d = Z.get(t);
        if (d)
          return d;
      }
      return null;
    };
    var H = { DOMAIN_TOO_SHORT: "Domain name too short.", DOMAIN_TOO_LONG: "Domain name too long. It should be no more than 255 chars.", LABEL_STARTS_WITH_DASH: "Domain name label can not start with a dash.", LABEL_ENDS_WITH_DASH: "Domain name label can not end with a dash.", LABEL_TOO_LONG: "Domain name label should be at most 63 chars long.", LABEL_TOO_SHORT: "Domain name label should be at least 1 character long.", LABEL_INVALID_CHARS: "Domain name label can only contain alphanumeric characters or dashes." };
    var oa = (e) => {
      const s = A.toASCII(e);
      if (s.length < 1)
        return "DOMAIN_TOO_SHORT";
      if (s.length > 255)
        return "DOMAIN_TOO_LONG";
      const c = s.split(".");
      let o;
      for (let t = 0; t < c.length; ++t) {
        if (o = c[t], !o.length)
          return "LABEL_TOO_SHORT";
        if (o.length > 63)
          return "LABEL_TOO_LONG";
        if (o.charAt(0) === "-")
          return "LABEL_STARTS_WITH_DASH";
        if (o.charAt(o.length - 1) === "-")
          return "LABEL_ENDS_WITH_DASH";
        if (!/^[a-z0-9\-_]+$/.test(o))
          return "LABEL_INVALID_CHARS";
      }
    };
    var _ = (e) => {
      if (typeof e != "string")
        throw new TypeError("Domain name must be a string.");
      let s = e.slice(0).toLowerCase();
      s.charAt(s.length - 1) === "." && (s = s.slice(0, s.length - 1));
      const c = oa(s);
      if (c)
        return { input: e, error: { message: H[c], code: c } };
      const o = { input: e, tld: null, sld: null, domain: null, subdomain: null, listed: false }, t = s.split(".");
      if (t[t.length - 1] === "local")
        return o;
      const d = () => (/xn--/.test(s) && (o.domain && (o.domain = A.toASCII(o.domain)), o.subdomain && (o.subdomain = A.toASCII(o.subdomain))), o), z = aa(s);
      if (!z)
        return t.length < 2 ? o : (o.tld = t.pop(), o.sld = t.pop(), o.domain = [o.sld, o.tld].join("."), t.length && (o.subdomain = t.pop()), d());
      o.listed = true;
      const y = z.suffix.split("."), g = t.slice(0, t.length - y.length);
      return z.exception && g.push(y.shift()), o.tld = y.join("."), !g.length || (z.wildcard && (y.unshift(g.pop()), o.tld = y.join(".")), !g.length) || (o.sld = g.pop(), o.domain = [o.sld, o.tld].join("."), g.length && (o.subdomain = g.join("."))), d();
    };
    var N = (e) => e && _(e).domain || null;
    var R = (e) => {
      const s = _(e);
      return !!(s.domain && s.listed);
    };
    var sa = { parse: _, get: N, isValid: R };
    exports2.default = sa;
    exports2.errorCodes = H;
    exports2.get = N;
    exports2.isValid = R;
    exports2.parse = _;
  }
});

// node_modules/tough-cookie/lib/pubsuffix-psl.js
var require_pubsuffix_psl = __commonJS({
  "node_modules/tough-cookie/lib/pubsuffix-psl.js"(exports2) {
    "use strict";
    var psl = require_psl();
    var SPECIAL_USE_DOMAINS = [
      "local",
      "example",
      "invalid",
      "localhost",
      "test"
    ];
    var SPECIAL_TREATMENT_DOMAINS = ["localhost", "invalid"];
    function getPublicSuffix(domain, options = {}) {
      const domainParts = domain.split(".");
      const topLevelDomain = domainParts[domainParts.length - 1];
      const allowSpecialUseDomain = !!options.allowSpecialUseDomain;
      const ignoreError = !!options.ignoreError;
      if (allowSpecialUseDomain && SPECIAL_USE_DOMAINS.includes(topLevelDomain)) {
        if (domainParts.length > 1) {
          const secondLevelDomain = domainParts[domainParts.length - 2];
          return `${secondLevelDomain}.${topLevelDomain}`;
        } else if (SPECIAL_TREATMENT_DOMAINS.includes(topLevelDomain)) {
          return `${topLevelDomain}`;
        }
      }
      if (!ignoreError && SPECIAL_USE_DOMAINS.includes(topLevelDomain)) {
        throw new Error(
          `Cookie has domain set to the public suffix "${topLevelDomain}" which is a special use domain. To allow this, configure your CookieJar with {allowSpecialUseDomain:true, rejectPublicSuffixes: false}.`
        );
      }
      return psl.get(domain);
    }
    exports2.getPublicSuffix = getPublicSuffix;
  }
});

// node_modules/tough-cookie/lib/store.js
var require_store = __commonJS({
  "node_modules/tough-cookie/lib/store.js"(exports2) {
    "use strict";
    var Store = class {
      constructor() {
        this.synchronous = false;
      }
      findCookie(domain, path, key, cb) {
        throw new Error("findCookie is not implemented");
      }
      findCookies(domain, path, allowSpecialUseDomain, cb) {
        throw new Error("findCookies is not implemented");
      }
      putCookie(cookie, cb) {
        throw new Error("putCookie is not implemented");
      }
      updateCookie(oldCookie, newCookie, cb) {
        throw new Error("updateCookie is not implemented");
      }
      removeCookie(domain, path, key, cb) {
        throw new Error("removeCookie is not implemented");
      }
      removeCookies(domain, path, cb) {
        throw new Error("removeCookies is not implemented");
      }
      removeAllCookies(cb) {
        throw new Error("removeAllCookies is not implemented");
      }
      getAllCookies(cb) {
        throw new Error(
          "getAllCookies is not implemented (therefore jar cannot be serialized)"
        );
      }
    };
    exports2.Store = Store;
  }
});

// node_modules/universalify/index.js
var require_universalify = __commonJS({
  "node_modules/universalify/index.js"(exports2) {
    "use strict";
    exports2.fromCallback = function(fn) {
      return Object.defineProperty(function() {
        if (typeof arguments[arguments.length - 1] === "function")
          fn.apply(this, arguments);
        else {
          return new Promise((resolve, reject) => {
            arguments[arguments.length] = (err, res) => {
              if (err)
                return reject(err);
              resolve(res);
            };
            arguments.length++;
            fn.apply(this, arguments);
          });
        }
      }, "name", { value: fn.name });
    };
    exports2.fromPromise = function(fn) {
      return Object.defineProperty(function() {
        const cb = arguments[arguments.length - 1];
        if (typeof cb !== "function")
          return fn.apply(this, arguments);
        else {
          delete arguments[arguments.length - 1];
          arguments.length--;
          fn.apply(this, arguments).then((r) => cb(null, r), cb);
        }
      }, "name", { value: fn.name });
    };
  }
});

// node_modules/tough-cookie/lib/permuteDomain.js
var require_permuteDomain = __commonJS({
  "node_modules/tough-cookie/lib/permuteDomain.js"(exports2) {
    "use strict";
    var pubsuffix = require_pubsuffix_psl();
    function permuteDomain(domain, allowSpecialUseDomain) {
      const pubSuf = pubsuffix.getPublicSuffix(domain, {
        allowSpecialUseDomain
      });
      if (!pubSuf) {
        return null;
      }
      if (pubSuf == domain) {
        return [domain];
      }
      if (domain.slice(-1) == ".") {
        domain = domain.slice(0, -1);
      }
      const prefix = domain.slice(0, -(pubSuf.length + 1));
      const parts = prefix.split(".").reverse();
      let cur = pubSuf;
      const permutations = [cur];
      while (parts.length) {
        cur = `${parts.shift()}.${cur}`;
        permutations.push(cur);
      }
      return permutations;
    }
    exports2.permuteDomain = permuteDomain;
  }
});

// node_modules/tough-cookie/lib/pathMatch.js
var require_pathMatch = __commonJS({
  "node_modules/tough-cookie/lib/pathMatch.js"(exports2) {
    "use strict";
    function pathMatch(reqPath, cookiePath) {
      if (cookiePath === reqPath) {
        return true;
      }
      const idx = reqPath.indexOf(cookiePath);
      if (idx === 0) {
        if (cookiePath.substr(-1) === "/") {
          return true;
        }
        if (reqPath.substr(cookiePath.length, 1) === "/") {
          return true;
        }
      }
      return false;
    }
    exports2.pathMatch = pathMatch;
  }
});

// node_modules/tough-cookie/lib/utilHelper.js
var require_utilHelper = __commonJS({
  "node_modules/tough-cookie/lib/utilHelper.js"(exports2) {
    function requireUtil() {
      try {
        return require("util");
      } catch (e) {
        return null;
      }
    }
    function lookupCustomInspectSymbol() {
      return Symbol.for("nodejs.util.inspect.custom");
    }
    function tryReadingCustomSymbolFromUtilInspect(options) {
      const _requireUtil = options.requireUtil || requireUtil;
      const util = _requireUtil();
      return util ? util.inspect.custom : null;
    }
    exports2.getUtilInspect = function getUtilInspect(fallback, options = {}) {
      const _requireUtil = options.requireUtil || requireUtil;
      const util = _requireUtil();
      return function inspect(value, showHidden, depth) {
        return util ? util.inspect(value, showHidden, depth) : fallback(value);
      };
    };
    exports2.getCustomInspectSymbol = function getCustomInspectSymbol(options = {}) {
      const _lookupCustomInspectSymbol = options.lookupCustomInspectSymbol || lookupCustomInspectSymbol;
      return _lookupCustomInspectSymbol() || tryReadingCustomSymbolFromUtilInspect(options);
    };
  }
});

// node_modules/tough-cookie/lib/memstore.js
var require_memstore = __commonJS({
  "node_modules/tough-cookie/lib/memstore.js"(exports2) {
    "use strict";
    var { fromCallback } = require_universalify();
    var Store = require_store().Store;
    var permuteDomain = require_permuteDomain().permuteDomain;
    var pathMatch = require_pathMatch().pathMatch;
    var { getCustomInspectSymbol, getUtilInspect } = require_utilHelper();
    var MemoryCookieStore = class extends Store {
      constructor() {
        super();
        this.synchronous = true;
        this.idx = /* @__PURE__ */ Object.create(null);
        const customInspectSymbol = getCustomInspectSymbol();
        if (customInspectSymbol) {
          this[customInspectSymbol] = this.inspect;
        }
      }
      inspect() {
        const util = { inspect: getUtilInspect(inspectFallback) };
        return `{ idx: ${util.inspect(this.idx, false, 2)} }`;
      }
      findCookie(domain, path, key, cb) {
        if (!this.idx[domain]) {
          return cb(null, void 0);
        }
        if (!this.idx[domain][path]) {
          return cb(null, void 0);
        }
        return cb(null, this.idx[domain][path][key] || null);
      }
      findCookies(domain, path, allowSpecialUseDomain, cb) {
        const results = [];
        if (typeof allowSpecialUseDomain === "function") {
          cb = allowSpecialUseDomain;
          allowSpecialUseDomain = true;
        }
        if (!domain) {
          return cb(null, []);
        }
        let pathMatcher;
        if (!path) {
          pathMatcher = function matchAll(domainIndex) {
            for (const curPath in domainIndex) {
              const pathIndex = domainIndex[curPath];
              for (const key in pathIndex) {
                results.push(pathIndex[key]);
              }
            }
          };
        } else {
          pathMatcher = function matchRFC(domainIndex) {
            Object.keys(domainIndex).forEach((cookiePath) => {
              if (pathMatch(path, cookiePath)) {
                const pathIndex = domainIndex[cookiePath];
                for (const key in pathIndex) {
                  results.push(pathIndex[key]);
                }
              }
            });
          };
        }
        const domains = permuteDomain(domain, allowSpecialUseDomain) || [domain];
        const idx = this.idx;
        domains.forEach((curDomain) => {
          const domainIndex = idx[curDomain];
          if (!domainIndex) {
            return;
          }
          pathMatcher(domainIndex);
        });
        cb(null, results);
      }
      putCookie(cookie, cb) {
        if (!this.idx[cookie.domain]) {
          this.idx[cookie.domain] = /* @__PURE__ */ Object.create(null);
        }
        if (!this.idx[cookie.domain][cookie.path]) {
          this.idx[cookie.domain][cookie.path] = /* @__PURE__ */ Object.create(null);
        }
        this.idx[cookie.domain][cookie.path][cookie.key] = cookie;
        cb(null);
      }
      updateCookie(oldCookie, newCookie, cb) {
        this.putCookie(newCookie, cb);
      }
      removeCookie(domain, path, key, cb) {
        if (this.idx[domain] && this.idx[domain][path] && this.idx[domain][path][key]) {
          delete this.idx[domain][path][key];
        }
        cb(null);
      }
      removeCookies(domain, path, cb) {
        if (this.idx[domain]) {
          if (path) {
            delete this.idx[domain][path];
          } else {
            delete this.idx[domain];
          }
        }
        return cb(null);
      }
      removeAllCookies(cb) {
        this.idx = /* @__PURE__ */ Object.create(null);
        return cb(null);
      }
      getAllCookies(cb) {
        const cookies = [];
        const idx = this.idx;
        const domains = Object.keys(idx);
        domains.forEach((domain) => {
          const paths = Object.keys(idx[domain]);
          paths.forEach((path) => {
            const keys = Object.keys(idx[domain][path]);
            keys.forEach((key) => {
              if (key !== null) {
                cookies.push(idx[domain][path][key]);
              }
            });
          });
        });
        cookies.sort((a, b) => {
          return (a.creationIndex || 0) - (b.creationIndex || 0);
        });
        cb(null, cookies);
      }
    };
    [
      "findCookie",
      "findCookies",
      "putCookie",
      "updateCookie",
      "removeCookie",
      "removeCookies",
      "removeAllCookies",
      "getAllCookies"
    ].forEach((name) => {
      MemoryCookieStore.prototype[name] = fromCallback(
        MemoryCookieStore.prototype[name]
      );
    });
    exports2.MemoryCookieStore = MemoryCookieStore;
    function inspectFallback(val) {
      const domains = Object.keys(val);
      if (domains.length === 0) {
        return "[Object: null prototype] {}";
      }
      let result = "[Object: null prototype] {\n";
      Object.keys(val).forEach((domain, i) => {
        result += formatDomain(domain, val[domain]);
        if (i < domains.length - 1) {
          result += ",";
        }
        result += "\n";
      });
      result += "}";
      return result;
    }
    function formatDomain(domainName, domainValue) {
      const indent = "  ";
      let result = `${indent}'${domainName}': [Object: null prototype] {
`;
      Object.keys(domainValue).forEach((path, i, paths) => {
        result += formatPath(path, domainValue[path]);
        if (i < paths.length - 1) {
          result += ",";
        }
        result += "\n";
      });
      result += `${indent}}`;
      return result;
    }
    function formatPath(pathName, pathValue) {
      const indent = "    ";
      let result = `${indent}'${pathName}': [Object: null prototype] {
`;
      Object.keys(pathValue).forEach((cookieName, i, cookieNames) => {
        const cookie = pathValue[cookieName];
        result += `      ${cookieName}: ${cookie.inspect()}`;
        if (i < cookieNames.length - 1) {
          result += ",";
        }
        result += "\n";
      });
      result += `${indent}}`;
      return result;
    }
    exports2.inspectFallback = inspectFallback;
  }
});

// node_modules/tough-cookie/lib/validators.js
var require_validators = __commonJS({
  "node_modules/tough-cookie/lib/validators.js"(exports2) {
    "use strict";
    var toString = Object.prototype.toString;
    function isFunction(data) {
      return typeof data === "function";
    }
    function isNonEmptyString(data) {
      return isString(data) && data !== "";
    }
    function isDate(data) {
      return isInstanceStrict(data, Date) && isInteger(data.getTime());
    }
    function isEmptyString(data) {
      return data === "" || data instanceof String && data.toString() === "";
    }
    function isString(data) {
      return typeof data === "string" || data instanceof String;
    }
    function isObject(data) {
      return toString.call(data) === "[object Object]";
    }
    function isInstanceStrict(data, prototype) {
      try {
        return data instanceof prototype;
      } catch (error) {
        return false;
      }
    }
    function isUrlStringOrObject(data) {
      return isNonEmptyString(data) || isObject(data) && "hostname" in data && "pathname" in data && "protocol" in data || isInstanceStrict(data, URL);
    }
    function isInteger(data) {
      return typeof data === "number" && data % 1 === 0;
    }
    function validate(bool, cb, options) {
      if (!isFunction(cb)) {
        options = cb;
        cb = null;
      }
      if (!isObject(options))
        options = { Error: "Failed Check" };
      if (!bool) {
        if (cb) {
          cb(new ParameterError(options));
        } else {
          throw new ParameterError(options);
        }
      }
    }
    var ParameterError = class extends Error {
      constructor(...params) {
        super(...params);
      }
    };
    exports2.ParameterError = ParameterError;
    exports2.isFunction = isFunction;
    exports2.isNonEmptyString = isNonEmptyString;
    exports2.isDate = isDate;
    exports2.isEmptyString = isEmptyString;
    exports2.isString = isString;
    exports2.isObject = isObject;
    exports2.isUrlStringOrObject = isUrlStringOrObject;
    exports2.validate = validate;
  }
});

// node_modules/tough-cookie/lib/version.js
var require_version = __commonJS({
  "node_modules/tough-cookie/lib/version.js"(exports2, module2) {
    module2.exports = "4.1.4";
  }
});

// node_modules/tough-cookie/lib/cookie.js
var require_cookie = __commonJS({
  "node_modules/tough-cookie/lib/cookie.js"(exports2) {
    "use strict";
    var punycode = require("punycode");
    var urlParse = require_url_parse();
    var pubsuffix = require_pubsuffix_psl();
    var Store = require_store().Store;
    var MemoryCookieStore = require_memstore().MemoryCookieStore;
    var pathMatch = require_pathMatch().pathMatch;
    var validators = require_validators();
    var VERSION = require_version();
    var { fromCallback } = require_universalify();
    var { getCustomInspectSymbol } = require_utilHelper();
    var COOKIE_OCTETS = /^[\x21\x23-\x2B\x2D-\x3A\x3C-\x5B\x5D-\x7E]+$/;
    var CONTROL_CHARS = /[\x00-\x1F]/;
    var TERMINATORS = ["\n", "\r", "\0"];
    var PATH_VALUE = /[\x20-\x3A\x3C-\x7E]+/;
    var DATE_DELIM = /[\x09\x20-\x2F\x3B-\x40\x5B-\x60\x7B-\x7E]/;
    var MONTH_TO_NUM = {
      jan: 0,
      feb: 1,
      mar: 2,
      apr: 3,
      may: 4,
      jun: 5,
      jul: 6,
      aug: 7,
      sep: 8,
      oct: 9,
      nov: 10,
      dec: 11
    };
    var MAX_TIME = 2147483647e3;
    var MIN_TIME = 0;
    var SAME_SITE_CONTEXT_VAL_ERR = 'Invalid sameSiteContext option for getCookies(); expected one of "strict", "lax", or "none"';
    function checkSameSiteContext(value) {
      validators.validate(validators.isNonEmptyString(value), value);
      const context = String(value).toLowerCase();
      if (context === "none" || context === "lax" || context === "strict") {
        return context;
      } else {
        return null;
      }
    }
    var PrefixSecurityEnum = Object.freeze({
      SILENT: "silent",
      STRICT: "strict",
      DISABLED: "unsafe-disabled"
    });
    var IP_REGEX_LOWERCASE = /(?:^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$)|(?:^(?:(?:[a-f\d]{1,4}:){7}(?:[a-f\d]{1,4}|:)|(?:[a-f\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|:[a-f\d]{1,4}|:)|(?:[a-f\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,2}|:)|(?:[a-f\d]{1,4}:){4}(?:(?::[a-f\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,3}|:)|(?:[a-f\d]{1,4}:){3}(?:(?::[a-f\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,4}|:)|(?:[a-f\d]{1,4}:){2}(?:(?::[a-f\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,5}|:)|(?:[a-f\d]{1,4}:){1}(?:(?::[a-f\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,6}|:)|(?::(?:(?::[a-f\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,7}|:)))$)/;
    var IP_V6_REGEX = `
\\[?(?:
(?:[a-fA-F\\d]{1,4}:){7}(?:[a-fA-F\\d]{1,4}|:)|
(?:[a-fA-F\\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|:[a-fA-F\\d]{1,4}|:)|
(?:[a-fA-F\\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,2}|:)|
(?:[a-fA-F\\d]{1,4}:){4}(?:(?::[a-fA-F\\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,3}|:)|
(?:[a-fA-F\\d]{1,4}:){3}(?:(?::[a-fA-F\\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,4}|:)|
(?:[a-fA-F\\d]{1,4}:){2}(?:(?::[a-fA-F\\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,5}|:)|
(?:[a-fA-F\\d]{1,4}:){1}(?:(?::[a-fA-F\\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,6}|:)|
(?::(?:(?::[a-fA-F\\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,7}|:))
)(?:%[0-9a-zA-Z]{1,})?\\]?
`.replace(/\s*\/\/.*$/gm, "").replace(/\n/g, "").trim();
    var IP_V6_REGEX_OBJECT = new RegExp(`^${IP_V6_REGEX}$`);
    function parseDigits(token, minDigits, maxDigits, trailingOK) {
      let count = 0;
      while (count < token.length) {
        const c = token.charCodeAt(count);
        if (c <= 47 || c >= 58) {
          break;
        }
        count++;
      }
      if (count < minDigits || count > maxDigits) {
        return null;
      }
      if (!trailingOK && count != token.length) {
        return null;
      }
      return parseInt(token.substr(0, count), 10);
    }
    function parseTime(token) {
      const parts = token.split(":");
      const result = [0, 0, 0];
      if (parts.length !== 3) {
        return null;
      }
      for (let i = 0; i < 3; i++) {
        const trailingOK = i == 2;
        const num = parseDigits(parts[i], 1, 2, trailingOK);
        if (num === null) {
          return null;
        }
        result[i] = num;
      }
      return result;
    }
    function parseMonth(token) {
      token = String(token).substr(0, 3).toLowerCase();
      const num = MONTH_TO_NUM[token];
      return num >= 0 ? num : null;
    }
    function parseDate(str) {
      if (!str) {
        return;
      }
      const tokens = str.split(DATE_DELIM);
      if (!tokens) {
        return;
      }
      let hour = null;
      let minute = null;
      let second = null;
      let dayOfMonth = null;
      let month = null;
      let year = null;
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i].trim();
        if (!token.length) {
          continue;
        }
        let result;
        if (second === null) {
          result = parseTime(token);
          if (result) {
            hour = result[0];
            minute = result[1];
            second = result[2];
            continue;
          }
        }
        if (dayOfMonth === null) {
          result = parseDigits(token, 1, 2, true);
          if (result !== null) {
            dayOfMonth = result;
            continue;
          }
        }
        if (month === null) {
          result = parseMonth(token);
          if (result !== null) {
            month = result;
            continue;
          }
        }
        if (year === null) {
          result = parseDigits(token, 2, 4, true);
          if (result !== null) {
            year = result;
            if (year >= 70 && year <= 99) {
              year += 1900;
            } else if (year >= 0 && year <= 69) {
              year += 2e3;
            }
          }
        }
      }
      if (dayOfMonth === null || month === null || year === null || second === null || dayOfMonth < 1 || dayOfMonth > 31 || year < 1601 || hour > 23 || minute > 59 || second > 59) {
        return;
      }
      return new Date(Date.UTC(year, month, dayOfMonth, hour, minute, second));
    }
    function formatDate(date) {
      validators.validate(validators.isDate(date), date);
      return date.toUTCString();
    }
    function canonicalDomain(str) {
      if (str == null) {
        return null;
      }
      str = str.trim().replace(/^\./, "");
      if (IP_V6_REGEX_OBJECT.test(str)) {
        str = str.replace("[", "").replace("]", "");
      }
      if (punycode && /[^\u0001-\u007f]/.test(str)) {
        str = punycode.toASCII(str);
      }
      return str.toLowerCase();
    }
    function domainMatch(str, domStr, canonicalize) {
      if (str == null || domStr == null) {
        return null;
      }
      if (canonicalize !== false) {
        str = canonicalDomain(str);
        domStr = canonicalDomain(domStr);
      }
      if (str == domStr) {
        return true;
      }
      const idx = str.lastIndexOf(domStr);
      if (idx <= 0) {
        return false;
      }
      if (str.length !== domStr.length + idx) {
        return false;
      }
      if (str.substr(idx - 1, 1) !== ".") {
        return false;
      }
      if (IP_REGEX_LOWERCASE.test(str)) {
        return false;
      }
      return true;
    }
    function defaultPath(path) {
      if (!path || path.substr(0, 1) !== "/") {
        return "/";
      }
      if (path === "/") {
        return path;
      }
      const rightSlash = path.lastIndexOf("/");
      if (rightSlash === 0) {
        return "/";
      }
      return path.slice(0, rightSlash);
    }
    function trimTerminator(str) {
      if (validators.isEmptyString(str))
        return str;
      for (let t = 0; t < TERMINATORS.length; t++) {
        const terminatorIdx = str.indexOf(TERMINATORS[t]);
        if (terminatorIdx !== -1) {
          str = str.substr(0, terminatorIdx);
        }
      }
      return str;
    }
    function parseCookiePair(cookiePair, looseMode) {
      cookiePair = trimTerminator(cookiePair);
      validators.validate(validators.isString(cookiePair), cookiePair);
      let firstEq = cookiePair.indexOf("=");
      if (looseMode) {
        if (firstEq === 0) {
          cookiePair = cookiePair.substr(1);
          firstEq = cookiePair.indexOf("=");
        }
      } else {
        if (firstEq <= 0) {
          return;
        }
      }
      let cookieName, cookieValue;
      if (firstEq <= 0) {
        cookieName = "";
        cookieValue = cookiePair.trim();
      } else {
        cookieName = cookiePair.substr(0, firstEq).trim();
        cookieValue = cookiePair.substr(firstEq + 1).trim();
      }
      if (CONTROL_CHARS.test(cookieName) || CONTROL_CHARS.test(cookieValue)) {
        return;
      }
      const c = new Cookie();
      c.key = cookieName;
      c.value = cookieValue;
      return c;
    }
    function parse(str, options) {
      if (!options || typeof options !== "object") {
        options = {};
      }
      if (validators.isEmptyString(str) || !validators.isString(str)) {
        return null;
      }
      str = str.trim();
      const firstSemi = str.indexOf(";");
      const cookiePair = firstSemi === -1 ? str : str.substr(0, firstSemi);
      const c = parseCookiePair(cookiePair, !!options.loose);
      if (!c) {
        return;
      }
      if (firstSemi === -1) {
        return c;
      }
      const unparsed = str.slice(firstSemi + 1).trim();
      if (unparsed.length === 0) {
        return c;
      }
      const cookie_avs = unparsed.split(";");
      while (cookie_avs.length) {
        const av = cookie_avs.shift().trim();
        if (av.length === 0) {
          continue;
        }
        const av_sep = av.indexOf("=");
        let av_key, av_value;
        if (av_sep === -1) {
          av_key = av;
          av_value = null;
        } else {
          av_key = av.substr(0, av_sep);
          av_value = av.substr(av_sep + 1);
        }
        av_key = av_key.trim().toLowerCase();
        if (av_value) {
          av_value = av_value.trim();
        }
        switch (av_key) {
          case "expires":
            if (av_value) {
              const exp = parseDate(av_value);
              if (exp) {
                c.expires = exp;
              }
            }
            break;
          case "max-age":
            if (av_value) {
              if (/^-?[0-9]+$/.test(av_value)) {
                const delta = parseInt(av_value, 10);
                c.setMaxAge(delta);
              }
            }
            break;
          case "domain":
            if (av_value) {
              const domain = av_value.trim().replace(/^\./, "");
              if (domain) {
                c.domain = domain.toLowerCase();
              }
            }
            break;
          case "path":
            c.path = av_value && av_value[0] === "/" ? av_value : null;
            break;
          case "secure":
            c.secure = true;
            break;
          case "httponly":
            c.httpOnly = true;
            break;
          case "samesite":
            const enforcement = av_value ? av_value.toLowerCase() : "";
            switch (enforcement) {
              case "strict":
                c.sameSite = "strict";
                break;
              case "lax":
                c.sameSite = "lax";
                break;
              case "none":
                c.sameSite = "none";
                break;
              default:
                c.sameSite = void 0;
                break;
            }
            break;
          default:
            c.extensions = c.extensions || [];
            c.extensions.push(av);
            break;
        }
      }
      return c;
    }
    function isSecurePrefixConditionMet(cookie) {
      validators.validate(validators.isObject(cookie), cookie);
      return !cookie.key.startsWith("__Secure-") || cookie.secure;
    }
    function isHostPrefixConditionMet(cookie) {
      validators.validate(validators.isObject(cookie));
      return !cookie.key.startsWith("__Host-") || cookie.secure && cookie.hostOnly && cookie.path != null && cookie.path === "/";
    }
    function jsonParse(str) {
      let obj;
      try {
        obj = JSON.parse(str);
      } catch (e) {
        return e;
      }
      return obj;
    }
    function fromJSON(str) {
      if (!str || validators.isEmptyString(str)) {
        return null;
      }
      let obj;
      if (typeof str === "string") {
        obj = jsonParse(str);
        if (obj instanceof Error) {
          return null;
        }
      } else {
        obj = str;
      }
      const c = new Cookie();
      for (let i = 0; i < Cookie.serializableProperties.length; i++) {
        const prop = Cookie.serializableProperties[i];
        if (obj[prop] === void 0 || obj[prop] === cookieDefaults[prop]) {
          continue;
        }
        if (prop === "expires" || prop === "creation" || prop === "lastAccessed") {
          if (obj[prop] === null) {
            c[prop] = null;
          } else {
            c[prop] = obj[prop] == "Infinity" ? "Infinity" : new Date(obj[prop]);
          }
        } else {
          c[prop] = obj[prop];
        }
      }
      return c;
    }
    function cookieCompare(a, b) {
      validators.validate(validators.isObject(a), a);
      validators.validate(validators.isObject(b), b);
      let cmp = 0;
      const aPathLen = a.path ? a.path.length : 0;
      const bPathLen = b.path ? b.path.length : 0;
      cmp = bPathLen - aPathLen;
      if (cmp !== 0) {
        return cmp;
      }
      const aTime = a.creation ? a.creation.getTime() : MAX_TIME;
      const bTime = b.creation ? b.creation.getTime() : MAX_TIME;
      cmp = aTime - bTime;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = a.creationIndex - b.creationIndex;
      return cmp;
    }
    function permutePath(path) {
      validators.validate(validators.isString(path));
      if (path === "/") {
        return ["/"];
      }
      const permutations = [path];
      while (path.length > 1) {
        const lindex = path.lastIndexOf("/");
        if (lindex === 0) {
          break;
        }
        path = path.substr(0, lindex);
        permutations.push(path);
      }
      permutations.push("/");
      return permutations;
    }
    function getCookieContext(url) {
      if (url instanceof Object) {
        return url;
      }
      try {
        url = decodeURI(url);
      } catch (err) {
      }
      return urlParse(url);
    }
    var cookieDefaults = {
      // the order in which the RFC has them:
      key: "",
      value: "",
      expires: "Infinity",
      maxAge: null,
      domain: null,
      path: null,
      secure: false,
      httpOnly: false,
      extensions: null,
      // set by the CookieJar:
      hostOnly: null,
      pathIsDefault: null,
      creation: null,
      lastAccessed: null,
      sameSite: void 0
    };
    var Cookie = class _Cookie {
      constructor(options = {}) {
        const customInspectSymbol = getCustomInspectSymbol();
        if (customInspectSymbol) {
          this[customInspectSymbol] = this.inspect;
        }
        Object.assign(this, cookieDefaults, options);
        this.creation = this.creation || /* @__PURE__ */ new Date();
        Object.defineProperty(this, "creationIndex", {
          configurable: false,
          enumerable: false,
          // important for assert.deepEqual checks
          writable: true,
          value: ++_Cookie.cookiesCreated
        });
      }
      inspect() {
        const now = Date.now();
        const hostOnly = this.hostOnly != null ? this.hostOnly : "?";
        const createAge = this.creation ? `${now - this.creation.getTime()}ms` : "?";
        const accessAge = this.lastAccessed ? `${now - this.lastAccessed.getTime()}ms` : "?";
        return `Cookie="${this.toString()}; hostOnly=${hostOnly}; aAge=${accessAge}; cAge=${createAge}"`;
      }
      toJSON() {
        const obj = {};
        for (const prop of _Cookie.serializableProperties) {
          if (this[prop] === cookieDefaults[prop]) {
            continue;
          }
          if (prop === "expires" || prop === "creation" || prop === "lastAccessed") {
            if (this[prop] === null) {
              obj[prop] = null;
            } else {
              obj[prop] = this[prop] == "Infinity" ? "Infinity" : this[prop].toISOString();
            }
          } else if (prop === "maxAge") {
            if (this[prop] !== null) {
              obj[prop] = this[prop] == Infinity || this[prop] == -Infinity ? this[prop].toString() : this[prop];
            }
          } else {
            if (this[prop] !== cookieDefaults[prop]) {
              obj[prop] = this[prop];
            }
          }
        }
        return obj;
      }
      clone() {
        return fromJSON(this.toJSON());
      }
      validate() {
        if (!COOKIE_OCTETS.test(this.value)) {
          return false;
        }
        if (this.expires != Infinity && !(this.expires instanceof Date) && !parseDate(this.expires)) {
          return false;
        }
        if (this.maxAge != null && this.maxAge <= 0) {
          return false;
        }
        if (this.path != null && !PATH_VALUE.test(this.path)) {
          return false;
        }
        const cdomain = this.cdomain();
        if (cdomain) {
          if (cdomain.match(/\.$/)) {
            return false;
          }
          const suffix = pubsuffix.getPublicSuffix(cdomain);
          if (suffix == null) {
            return false;
          }
        }
        return true;
      }
      setExpires(exp) {
        if (exp instanceof Date) {
          this.expires = exp;
        } else {
          this.expires = parseDate(exp) || "Infinity";
        }
      }
      setMaxAge(age) {
        if (age === Infinity || age === -Infinity) {
          this.maxAge = age.toString();
        } else {
          this.maxAge = age;
        }
      }
      cookieString() {
        let val = this.value;
        if (val == null) {
          val = "";
        }
        if (this.key === "") {
          return val;
        }
        return `${this.key}=${val}`;
      }
      // gives Set-Cookie header format
      toString() {
        let str = this.cookieString();
        if (this.expires != Infinity) {
          if (this.expires instanceof Date) {
            str += `; Expires=${formatDate(this.expires)}`;
          } else {
            str += `; Expires=${this.expires}`;
          }
        }
        if (this.maxAge != null && this.maxAge != Infinity) {
          str += `; Max-Age=${this.maxAge}`;
        }
        if (this.domain && !this.hostOnly) {
          str += `; Domain=${this.domain}`;
        }
        if (this.path) {
          str += `; Path=${this.path}`;
        }
        if (this.secure) {
          str += "; Secure";
        }
        if (this.httpOnly) {
          str += "; HttpOnly";
        }
        if (this.sameSite && this.sameSite !== "none") {
          const ssCanon = _Cookie.sameSiteCanonical[this.sameSite.toLowerCase()];
          str += `; SameSite=${ssCanon ? ssCanon : this.sameSite}`;
        }
        if (this.extensions) {
          this.extensions.forEach((ext) => {
            str += `; ${ext}`;
          });
        }
        return str;
      }
      // TTL() partially replaces the "expiry-time" parts of S5.3 step 3 (setCookie()
      // elsewhere)
      // S5.3 says to give the "latest representable date" for which we use Infinity
      // For "expired" we use 0
      TTL(now) {
        if (this.maxAge != null) {
          return this.maxAge <= 0 ? 0 : this.maxAge * 1e3;
        }
        let expires = this.expires;
        if (expires != Infinity) {
          if (!(expires instanceof Date)) {
            expires = parseDate(expires) || Infinity;
          }
          if (expires == Infinity) {
            return Infinity;
          }
          return expires.getTime() - (now || Date.now());
        }
        return Infinity;
      }
      // expiryTime() replaces the "expiry-time" parts of S5.3 step 3 (setCookie()
      // elsewhere)
      expiryTime(now) {
        if (this.maxAge != null) {
          const relativeTo = now || this.creation || /* @__PURE__ */ new Date();
          const age = this.maxAge <= 0 ? -Infinity : this.maxAge * 1e3;
          return relativeTo.getTime() + age;
        }
        if (this.expires == Infinity) {
          return Infinity;
        }
        return this.expires.getTime();
      }
      // expiryDate() replaces the "expiry-time" parts of S5.3 step 3 (setCookie()
      // elsewhere), except it returns a Date
      expiryDate(now) {
        const millisec = this.expiryTime(now);
        if (millisec == Infinity) {
          return new Date(MAX_TIME);
        } else if (millisec == -Infinity) {
          return new Date(MIN_TIME);
        } else {
          return new Date(millisec);
        }
      }
      // This replaces the "persistent-flag" parts of S5.3 step 3
      isPersistent() {
        return this.maxAge != null || this.expires != Infinity;
      }
      // Mostly S5.1.2 and S5.2.3:
      canonicalizedDomain() {
        if (this.domain == null) {
          return null;
        }
        return canonicalDomain(this.domain);
      }
      cdomain() {
        return this.canonicalizedDomain();
      }
    };
    Cookie.cookiesCreated = 0;
    Cookie.parse = parse;
    Cookie.fromJSON = fromJSON;
    Cookie.serializableProperties = Object.keys(cookieDefaults);
    Cookie.sameSiteLevel = {
      strict: 3,
      lax: 2,
      none: 1
    };
    Cookie.sameSiteCanonical = {
      strict: "Strict",
      lax: "Lax"
    };
    function getNormalizedPrefixSecurity(prefixSecurity) {
      if (prefixSecurity != null) {
        const normalizedPrefixSecurity = prefixSecurity.toLowerCase();
        switch (normalizedPrefixSecurity) {
          case PrefixSecurityEnum.STRICT:
          case PrefixSecurityEnum.SILENT:
          case PrefixSecurityEnum.DISABLED:
            return normalizedPrefixSecurity;
        }
      }
      return PrefixSecurityEnum.SILENT;
    }
    var CookieJar2 = class _CookieJar {
      constructor(store, options = { rejectPublicSuffixes: true }) {
        if (typeof options === "boolean") {
          options = { rejectPublicSuffixes: options };
        }
        validators.validate(validators.isObject(options), options);
        this.rejectPublicSuffixes = options.rejectPublicSuffixes;
        this.enableLooseMode = !!options.looseMode;
        this.allowSpecialUseDomain = typeof options.allowSpecialUseDomain === "boolean" ? options.allowSpecialUseDomain : true;
        this.store = store || new MemoryCookieStore();
        this.prefixSecurity = getNormalizedPrefixSecurity(options.prefixSecurity);
        this._cloneSync = syncWrap("clone");
        this._importCookiesSync = syncWrap("_importCookies");
        this.getCookiesSync = syncWrap("getCookies");
        this.getCookieStringSync = syncWrap("getCookieString");
        this.getSetCookieStringsSync = syncWrap("getSetCookieStrings");
        this.removeAllCookiesSync = syncWrap("removeAllCookies");
        this.setCookieSync = syncWrap("setCookie");
        this.serializeSync = syncWrap("serialize");
      }
      setCookie(cookie, url, options, cb) {
        validators.validate(validators.isUrlStringOrObject(url), cb, options);
        let err;
        if (validators.isFunction(url)) {
          cb = url;
          return cb(new Error("No URL was specified"));
        }
        const context = getCookieContext(url);
        if (validators.isFunction(options)) {
          cb = options;
          options = {};
        }
        validators.validate(validators.isFunction(cb), cb);
        if (!validators.isNonEmptyString(cookie) && !validators.isObject(cookie) && cookie instanceof String && cookie.length == 0) {
          return cb(null);
        }
        const host = canonicalDomain(context.hostname);
        const loose = options.loose || this.enableLooseMode;
        let sameSiteContext = null;
        if (options.sameSiteContext) {
          sameSiteContext = checkSameSiteContext(options.sameSiteContext);
          if (!sameSiteContext) {
            return cb(new Error(SAME_SITE_CONTEXT_VAL_ERR));
          }
        }
        if (typeof cookie === "string" || cookie instanceof String) {
          cookie = Cookie.parse(cookie, { loose });
          if (!cookie) {
            err = new Error("Cookie failed to parse");
            return cb(options.ignoreError ? null : err);
          }
        } else if (!(cookie instanceof Cookie)) {
          err = new Error(
            "First argument to setCookie must be a Cookie object or string"
          );
          return cb(options.ignoreError ? null : err);
        }
        const now = options.now || /* @__PURE__ */ new Date();
        if (this.rejectPublicSuffixes && cookie.domain) {
          const suffix = pubsuffix.getPublicSuffix(cookie.cdomain(), {
            allowSpecialUseDomain: this.allowSpecialUseDomain,
            ignoreError: options.ignoreError
          });
          if (suffix == null && !IP_V6_REGEX_OBJECT.test(cookie.domain)) {
            err = new Error("Cookie has domain set to a public suffix");
            return cb(options.ignoreError ? null : err);
          }
        }
        if (cookie.domain) {
          if (!domainMatch(host, cookie.cdomain(), false)) {
            err = new Error(
              `Cookie not in this host's domain. Cookie:${cookie.cdomain()} Request:${host}`
            );
            return cb(options.ignoreError ? null : err);
          }
          if (cookie.hostOnly == null) {
            cookie.hostOnly = false;
          }
        } else {
          cookie.hostOnly = true;
          cookie.domain = host;
        }
        if (!cookie.path || cookie.path[0] !== "/") {
          cookie.path = defaultPath(context.pathname);
          cookie.pathIsDefault = true;
        }
        if (options.http === false && cookie.httpOnly) {
          err = new Error("Cookie is HttpOnly and this isn't an HTTP API");
          return cb(options.ignoreError ? null : err);
        }
        if (cookie.sameSite !== "none" && cookie.sameSite !== void 0 && sameSiteContext) {
          if (sameSiteContext === "none") {
            err = new Error(
              "Cookie is SameSite but this is a cross-origin request"
            );
            return cb(options.ignoreError ? null : err);
          }
        }
        const ignoreErrorForPrefixSecurity = this.prefixSecurity === PrefixSecurityEnum.SILENT;
        const prefixSecurityDisabled = this.prefixSecurity === PrefixSecurityEnum.DISABLED;
        if (!prefixSecurityDisabled) {
          let errorFound = false;
          let errorMsg;
          if (!isSecurePrefixConditionMet(cookie)) {
            errorFound = true;
            errorMsg = "Cookie has __Secure prefix but Secure attribute is not set";
          } else if (!isHostPrefixConditionMet(cookie)) {
            errorFound = true;
            errorMsg = "Cookie has __Host prefix but either Secure or HostOnly attribute is not set or Path is not '/'";
          }
          if (errorFound) {
            return cb(
              options.ignoreError || ignoreErrorForPrefixSecurity ? null : new Error(errorMsg)
            );
          }
        }
        const store = this.store;
        if (!store.updateCookie) {
          store.updateCookie = function(oldCookie, newCookie, cb2) {
            this.putCookie(newCookie, cb2);
          };
        }
        function withCookie(err2, oldCookie) {
          if (err2) {
            return cb(err2);
          }
          const next = function(err3) {
            if (err3) {
              return cb(err3);
            } else {
              cb(null, cookie);
            }
          };
          if (oldCookie) {
            if (options.http === false && oldCookie.httpOnly) {
              err2 = new Error("old Cookie is HttpOnly and this isn't an HTTP API");
              return cb(options.ignoreError ? null : err2);
            }
            cookie.creation = oldCookie.creation;
            cookie.creationIndex = oldCookie.creationIndex;
            cookie.lastAccessed = now;
            store.updateCookie(oldCookie, cookie, next);
          } else {
            cookie.creation = cookie.lastAccessed = now;
            store.putCookie(cookie, next);
          }
        }
        store.findCookie(cookie.domain, cookie.path, cookie.key, withCookie);
      }
      // RFC6365 S5.4
      getCookies(url, options, cb) {
        validators.validate(validators.isUrlStringOrObject(url), cb, url);
        const context = getCookieContext(url);
        if (validators.isFunction(options)) {
          cb = options;
          options = {};
        }
        validators.validate(validators.isObject(options), cb, options);
        validators.validate(validators.isFunction(cb), cb);
        const host = canonicalDomain(context.hostname);
        const path = context.pathname || "/";
        let secure = options.secure;
        if (secure == null && context.protocol && (context.protocol == "https:" || context.protocol == "wss:")) {
          secure = true;
        }
        let sameSiteLevel = 0;
        if (options.sameSiteContext) {
          const sameSiteContext = checkSameSiteContext(options.sameSiteContext);
          sameSiteLevel = Cookie.sameSiteLevel[sameSiteContext];
          if (!sameSiteLevel) {
            return cb(new Error(SAME_SITE_CONTEXT_VAL_ERR));
          }
        }
        let http = options.http;
        if (http == null) {
          http = true;
        }
        const now = options.now || Date.now();
        const expireCheck = options.expire !== false;
        const allPaths = !!options.allPaths;
        const store = this.store;
        function matchingCookie(c) {
          if (c.hostOnly) {
            if (c.domain != host) {
              return false;
            }
          } else {
            if (!domainMatch(host, c.domain, false)) {
              return false;
            }
          }
          if (!allPaths && !pathMatch(path, c.path)) {
            return false;
          }
          if (c.secure && !secure) {
            return false;
          }
          if (c.httpOnly && !http) {
            return false;
          }
          if (sameSiteLevel) {
            const cookieLevel = Cookie.sameSiteLevel[c.sameSite || "none"];
            if (cookieLevel > sameSiteLevel) {
              return false;
            }
          }
          if (expireCheck && c.expiryTime() <= now) {
            store.removeCookie(c.domain, c.path, c.key, () => {
            });
            return false;
          }
          return true;
        }
        store.findCookies(
          host,
          allPaths ? null : path,
          this.allowSpecialUseDomain,
          (err, cookies) => {
            if (err) {
              return cb(err);
            }
            cookies = cookies.filter(matchingCookie);
            if (options.sort !== false) {
              cookies = cookies.sort(cookieCompare);
            }
            const now2 = /* @__PURE__ */ new Date();
            for (const cookie of cookies) {
              cookie.lastAccessed = now2;
            }
            cb(null, cookies);
          }
        );
      }
      getCookieString(...args) {
        const cb = args.pop();
        validators.validate(validators.isFunction(cb), cb);
        const next = function(err, cookies) {
          if (err) {
            cb(err);
          } else {
            cb(
              null,
              cookies.sort(cookieCompare).map((c) => c.cookieString()).join("; ")
            );
          }
        };
        args.push(next);
        this.getCookies.apply(this, args);
      }
      getSetCookieStrings(...args) {
        const cb = args.pop();
        validators.validate(validators.isFunction(cb), cb);
        const next = function(err, cookies) {
          if (err) {
            cb(err);
          } else {
            cb(
              null,
              cookies.map((c) => {
                return c.toString();
              })
            );
          }
        };
        args.push(next);
        this.getCookies.apply(this, args);
      }
      serialize(cb) {
        validators.validate(validators.isFunction(cb), cb);
        let type = this.store.constructor.name;
        if (validators.isObject(type)) {
          type = null;
        }
        const serialized = {
          // The version of tough-cookie that serialized this jar. Generally a good
          // practice since future versions can make data import decisions based on
          // known past behavior. When/if this matters, use `semver`.
          version: `tough-cookie@${VERSION}`,
          // add the store type, to make humans happy:
          storeType: type,
          // CookieJar configuration:
          rejectPublicSuffixes: !!this.rejectPublicSuffixes,
          enableLooseMode: !!this.enableLooseMode,
          allowSpecialUseDomain: !!this.allowSpecialUseDomain,
          prefixSecurity: getNormalizedPrefixSecurity(this.prefixSecurity),
          // this gets filled from getAllCookies:
          cookies: []
        };
        if (!(this.store.getAllCookies && typeof this.store.getAllCookies === "function")) {
          return cb(
            new Error(
              "store does not support getAllCookies and cannot be serialized"
            )
          );
        }
        this.store.getAllCookies((err, cookies) => {
          if (err) {
            return cb(err);
          }
          serialized.cookies = cookies.map((cookie) => {
            cookie = cookie instanceof Cookie ? cookie.toJSON() : cookie;
            delete cookie.creationIndex;
            return cookie;
          });
          return cb(null, serialized);
        });
      }
      toJSON() {
        return this.serializeSync();
      }
      // use the class method CookieJar.deserialize instead of calling this directly
      _importCookies(serialized, cb) {
        let cookies = serialized.cookies;
        if (!cookies || !Array.isArray(cookies)) {
          return cb(new Error("serialized jar has no cookies array"));
        }
        cookies = cookies.slice();
        const putNext = (err) => {
          if (err) {
            return cb(err);
          }
          if (!cookies.length) {
            return cb(err, this);
          }
          let cookie;
          try {
            cookie = fromJSON(cookies.shift());
          } catch (e) {
            return cb(e);
          }
          if (cookie === null) {
            return putNext(null);
          }
          this.store.putCookie(cookie, putNext);
        };
        putNext();
      }
      clone(newStore, cb) {
        if (arguments.length === 1) {
          cb = newStore;
          newStore = null;
        }
        this.serialize((err, serialized) => {
          if (err) {
            return cb(err);
          }
          _CookieJar.deserialize(serialized, newStore, cb);
        });
      }
      cloneSync(newStore) {
        if (arguments.length === 0) {
          return this._cloneSync();
        }
        if (!newStore.synchronous) {
          throw new Error(
            "CookieJar clone destination store is not synchronous; use async API instead."
          );
        }
        return this._cloneSync(newStore);
      }
      removeAllCookies(cb) {
        validators.validate(validators.isFunction(cb), cb);
        const store = this.store;
        if (typeof store.removeAllCookies === "function" && store.removeAllCookies !== Store.prototype.removeAllCookies) {
          return store.removeAllCookies(cb);
        }
        store.getAllCookies((err, cookies) => {
          if (err) {
            return cb(err);
          }
          if (cookies.length === 0) {
            return cb(null);
          }
          let completedCount = 0;
          const removeErrors = [];
          function removeCookieCb(removeErr) {
            if (removeErr) {
              removeErrors.push(removeErr);
            }
            completedCount++;
            if (completedCount === cookies.length) {
              return cb(removeErrors.length ? removeErrors[0] : null);
            }
          }
          cookies.forEach((cookie) => {
            store.removeCookie(
              cookie.domain,
              cookie.path,
              cookie.key,
              removeCookieCb
            );
          });
        });
      }
      static deserialize(strOrObj, store, cb) {
        if (arguments.length !== 3) {
          cb = store;
          store = null;
        }
        validators.validate(validators.isFunction(cb), cb);
        let serialized;
        if (typeof strOrObj === "string") {
          serialized = jsonParse(strOrObj);
          if (serialized instanceof Error) {
            return cb(serialized);
          }
        } else {
          serialized = strOrObj;
        }
        const jar = new _CookieJar(store, {
          rejectPublicSuffixes: serialized.rejectPublicSuffixes,
          looseMode: serialized.enableLooseMode,
          allowSpecialUseDomain: serialized.allowSpecialUseDomain,
          prefixSecurity: serialized.prefixSecurity
        });
        jar._importCookies(serialized, (err) => {
          if (err) {
            return cb(err);
          }
          cb(null, jar);
        });
      }
      static deserializeSync(strOrObj, store) {
        const serialized = typeof strOrObj === "string" ? JSON.parse(strOrObj) : strOrObj;
        const jar = new _CookieJar(store, {
          rejectPublicSuffixes: serialized.rejectPublicSuffixes,
          looseMode: serialized.enableLooseMode
        });
        if (!jar.store.synchronous) {
          throw new Error(
            "CookieJar store is not synchronous; use async API instead."
          );
        }
        jar._importCookiesSync(serialized);
        return jar;
      }
    };
    CookieJar2.fromJSON = CookieJar2.deserializeSync;
    [
      "_importCookies",
      "clone",
      "getCookies",
      "getCookieString",
      "getSetCookieStrings",
      "removeAllCookies",
      "serialize",
      "setCookie"
    ].forEach((name) => {
      CookieJar2.prototype[name] = fromCallback(CookieJar2.prototype[name]);
    });
    CookieJar2.deserialize = fromCallback(CookieJar2.deserialize);
    function syncWrap(method) {
      return function(...args) {
        if (!this.store.synchronous) {
          throw new Error(
            "CookieJar store is not synchronous; use async API instead."
          );
        }
        let syncErr, syncResult;
        this[method](...args, (err, result) => {
          syncErr = err;
          syncResult = result;
        });
        if (syncErr) {
          throw syncErr;
        }
        return syncResult;
      };
    }
    exports2.version = VERSION;
    exports2.CookieJar = CookieJar2;
    exports2.Cookie = Cookie;
    exports2.Store = Store;
    exports2.MemoryCookieStore = MemoryCookieStore;
    exports2.parseDate = parseDate;
    exports2.formatDate = formatDate;
    exports2.parse = parse;
    exports2.fromJSON = fromJSON;
    exports2.domainMatch = domainMatch;
    exports2.defaultPath = defaultPath;
    exports2.pathMatch = pathMatch;
    exports2.getPublicSuffix = pubsuffix.getPublicSuffix;
    exports2.cookieCompare = cookieCompare;
    exports2.permuteDomain = require_permuteDomain().permuteDomain;
    exports2.permutePath = permutePath;
    exports2.canonicalDomain = canonicalDomain;
    exports2.PrefixSecurityEnum = PrefixSecurityEnum;
    exports2.ParameterError = validators.ParameterError;
  }
});

// node_modules/eventemitter3/index.js
var require_eventemitter3 = __commonJS({
  "node_modules/eventemitter3/index.js"(exports2, module2) {
    "use strict";
    var has = Object.prototype.hasOwnProperty;
    var prefix = "~";
    function Events() {
    }
    if (Object.create) {
      Events.prototype = /* @__PURE__ */ Object.create(null);
      if (!new Events().__proto__)
        prefix = false;
    }
    function EE(fn, context, once) {
      this.fn = fn;
      this.context = context;
      this.once = once || false;
    }
    function addListener(emitter, event, fn, context, once) {
      if (typeof fn !== "function") {
        throw new TypeError("The listener must be a function");
      }
      var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
      if (!emitter._events[evt])
        emitter._events[evt] = listener, emitter._eventsCount++;
      else if (!emitter._events[evt].fn)
        emitter._events[evt].push(listener);
      else
        emitter._events[evt] = [emitter._events[evt], listener];
      return emitter;
    }
    function clearEvent(emitter, evt) {
      if (--emitter._eventsCount === 0)
        emitter._events = new Events();
      else
        delete emitter._events[evt];
    }
    function EventEmitter2() {
      this._events = new Events();
      this._eventsCount = 0;
    }
    EventEmitter2.prototype.eventNames = function eventNames() {
      var names = [], events, name;
      if (this._eventsCount === 0)
        return names;
      for (name in events = this._events) {
        if (has.call(events, name))
          names.push(prefix ? name.slice(1) : name);
      }
      if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
      }
      return names;
    };
    EventEmitter2.prototype.listeners = function listeners(event) {
      var evt = prefix ? prefix + event : event, handlers = this._events[evt];
      if (!handlers)
        return [];
      if (handlers.fn)
        return [handlers.fn];
      for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
        ee[i] = handlers[i].fn;
      }
      return ee;
    };
    EventEmitter2.prototype.listenerCount = function listenerCount(event) {
      var evt = prefix ? prefix + event : event, listeners = this._events[evt];
      if (!listeners)
        return 0;
      if (listeners.fn)
        return 1;
      return listeners.length;
    };
    EventEmitter2.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt])
        return false;
      var listeners = this._events[evt], len = arguments.length, args, i;
      if (listeners.fn) {
        if (listeners.once)
          this.removeListener(event, listeners.fn, void 0, true);
        switch (len) {
          case 1:
            return listeners.fn.call(listeners.context), true;
          case 2:
            return listeners.fn.call(listeners.context, a1), true;
          case 3:
            return listeners.fn.call(listeners.context, a1, a2), true;
          case 4:
            return listeners.fn.call(listeners.context, a1, a2, a3), true;
          case 5:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
          case 6:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }
        for (i = 1, args = new Array(len - 1); i < len; i++) {
          args[i - 1] = arguments[i];
        }
        listeners.fn.apply(listeners.context, args);
      } else {
        var length = listeners.length, j;
        for (i = 0; i < length; i++) {
          if (listeners[i].once)
            this.removeListener(event, listeners[i].fn, void 0, true);
          switch (len) {
            case 1:
              listeners[i].fn.call(listeners[i].context);
              break;
            case 2:
              listeners[i].fn.call(listeners[i].context, a1);
              break;
            case 3:
              listeners[i].fn.call(listeners[i].context, a1, a2);
              break;
            case 4:
              listeners[i].fn.call(listeners[i].context, a1, a2, a3);
              break;
            default:
              if (!args)
                for (j = 1, args = new Array(len - 1); j < len; j++) {
                  args[j - 1] = arguments[j];
                }
              listeners[i].fn.apply(listeners[i].context, args);
          }
        }
      }
      return true;
    };
    EventEmitter2.prototype.on = function on(event, fn, context) {
      return addListener(this, event, fn, context, false);
    };
    EventEmitter2.prototype.once = function once(event, fn, context) {
      return addListener(this, event, fn, context, true);
    };
    EventEmitter2.prototype.removeListener = function removeListener(event, fn, context, once) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt])
        return this;
      if (!fn) {
        clearEvent(this, evt);
        return this;
      }
      var listeners = this._events[evt];
      if (listeners.fn) {
        if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
          clearEvent(this, evt);
        }
      } else {
        for (var i = 0, events = [], length = listeners.length; i < length; i++) {
          if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
            events.push(listeners[i]);
          }
        }
        if (events.length)
          this._events[evt] = events.length === 1 ? events[0] : events;
        else
          clearEvent(this, evt);
      }
      return this;
    };
    EventEmitter2.prototype.removeAllListeners = function removeAllListeners(event) {
      var evt;
      if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt])
          clearEvent(this, evt);
      } else {
        this._events = new Events();
        this._eventsCount = 0;
      }
      return this;
    };
    EventEmitter2.prototype.off = EventEmitter2.prototype.removeListener;
    EventEmitter2.prototype.addListener = EventEmitter2.prototype.on;
    EventEmitter2.prefixed = prefix;
    EventEmitter2.EventEmitter = EventEmitter2;
    if ("undefined" !== typeof module2) {
      module2.exports = EventEmitter2;
    }
  }
});

// node_modules/commander/esm.mjs
var import_index = __toESM(require_commander(), 1);
var {
  program,
  createCommand,
  createArgument,
  createOption,
  CommanderError,
  InvalidArgumentError,
  InvalidOptionArgumentError,
  // deprecated old name
  Command,
  Argument,
  Option,
  Help
} = import_index.default;

// src/cli.ts
var import_promises2 = require("fs/promises");
var import_readline = require("readline");

// src/index.ts
var import_pino = __toESM(require_pino(), 1);

// src/config.ts
var import_path = require("path");
var import_url = require("url");
var import_meta = {};
var getCliDirectory = () => {
  try {
    if (typeof __dirname !== "undefined") {
      return __dirname;
    }
    const __filename = (0, import_url.fileURLToPath)(import_meta.url);
    return (0, import_path.dirname)(__filename);
  } catch {
    return process.cwd();
  }
};
var DEFAULT_CONFIG = {
  sessionFile: (0, import_path.join)(getCliDirectory(), ".config", "prospect-client", "session.json"),
  userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  auth: {
    mode: "json",
    loginPath: "/svc/auth/login",
    usernameField: "email",
    passwordField: "password",
    additionalFields: {
      redirect_url: "/app",
      trial_token: null
    }
  },
  rateLimit: {
    concurrency: 1,
    intervalMs: 1e3
  },
  retries: {
    maxRetries: 3,
    baseDelayMs: 1e3
  },
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  debug: false
};
function mergeConfig(userConfig) {
  const authConfig = {
    mode: userConfig.auth?.mode || DEFAULT_CONFIG.auth.mode,
    loginPath: userConfig.auth?.loginPath || DEFAULT_CONFIG.auth.loginPath,
    usernameField: userConfig.auth?.usernameField || DEFAULT_CONFIG.auth.usernameField,
    passwordField: userConfig.auth?.passwordField || DEFAULT_CONFIG.auth.passwordField,
    additionalFields: { ...DEFAULT_CONFIG.auth.additionalFields, ...userConfig.auth?.additionalFields },
    credentials: userConfig.auth?.credentials
  };
  const rateLimitConfig = {
    concurrency: userConfig.rateLimit?.concurrency ?? DEFAULT_CONFIG.rateLimit.concurrency,
    intervalMs: userConfig.rateLimit?.intervalMs ?? DEFAULT_CONFIG.rateLimit.intervalMs
  };
  const retriesConfig = {
    maxRetries: userConfig.retries?.maxRetries ?? DEFAULT_CONFIG.retries.maxRetries,
    baseDelayMs: userConfig.retries?.baseDelayMs ?? DEFAULT_CONFIG.retries.baseDelayMs
  };
  return {
    baseUrl: userConfig.baseUrl,
    sessionFile: userConfig.sessionFile || DEFAULT_CONFIG.sessionFile,
    userAgent: userConfig.userAgent || DEFAULT_CONFIG.userAgent,
    headers: { ...DEFAULT_CONFIG.headers, ...userConfig.headers },
    auth: authConfig,
    rateLimit: rateLimitConfig,
    retries: retriesConfig,
    debug: userConfig.debug ?? DEFAULT_CONFIG.debug
  };
}

// src/session.ts
var import_promises = require("fs/promises");
var import_path2 = require("path");
var import_tough_cookie = __toESM(require_cookie(), 1);
var SessionManager = class {
  jar;
  sessionFile;
  logger;
  constructor(sessionFile, logger) {
    this.jar = new import_tough_cookie.CookieJar();
    this.sessionFile = sessionFile;
    this.logger = logger;
  }
  /**
   * Get the cookie jar instance
   */
  getJar() {
    return this.jar;
  }
  /**
   * Load session from disk (if exists)
   */
  async load() {
    try {
      const data = await (0, import_promises.readFile)(this.sessionFile, "utf-8");
      const serialized = JSON.parse(data);
      this.jar = import_tough_cookie.CookieJar.deserializeSync(serialized);
      this.logger.debug({ sessionFile: this.sessionFile }, "Session loaded from disk");
    } catch (err) {
      if (err.code === "ENOENT") {
        this.logger.debug({ sessionFile: this.sessionFile }, "No existing session file");
      } else {
        this.logger.warn({ err, sessionFile: this.sessionFile }, "Failed to load session");
      }
    }
  }
  /**
   * Save session to disk
   */
  async save() {
    try {
      await (0, import_promises.mkdir)((0, import_path2.dirname)(this.sessionFile), { recursive: true });
      const serialized = this.jar.serializeSync();
      await (0, import_promises.writeFile)(this.sessionFile, JSON.stringify(serialized, null, 2), "utf-8");
      this.logger.debug({ sessionFile: this.sessionFile }, "Session saved to disk");
    } catch (err) {
      this.logger.error({ err, sessionFile: this.sessionFile }, "Failed to save session");
      throw err;
    }
  }
  /**
   * Load cookies from Netscape cookie file or JSON array
   */
  async loadCookiesFromFile(cookieFile) {
    const content = await (0, import_promises.readFile)(cookieFile, "utf-8");
    try {
      const cookies = JSON.parse(content);
      if (Array.isArray(cookies)) {
        for (const cookie of cookies) {
          await this.jar.setCookie(cookie, cookie.domain || "http://localhost");
        }
        this.logger.info({ count: cookies.length }, "Loaded cookies from JSON");
        return;
      }
    } catch {
    }
    const lines = content.split("\n");
    let count = 0;
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#"))
        continue;
      const parts = trimmed.split("	");
      if (parts.length < 7)
        continue;
      const [domain, , path, secure, expiresStr, name, value] = parts;
      const expires = expiresStr === "0" ? void 0 : new Date(parseInt(expiresStr) * 1e3);
      const cookieStr = `${name}=${value}; Domain=${domain}; Path=${path}${secure === "TRUE" ? "; Secure" : ""}${expires ? `; Expires=${expires.toUTCString()}` : ""}`;
      try {
        await this.jar.setCookie(cookieStr, `http${secure === "TRUE" ? "s" : ""}://${domain}${path}`);
        count++;
      } catch (err) {
        this.logger.warn({ err, line: trimmed }, "Failed to parse cookie line");
      }
    }
    this.logger.info({ count }, "Loaded cookies from Netscape format");
  }
  /**
   * Clear all cookies
   */
  async clear() {
    this.jar = new import_tough_cookie.CookieJar();
    await this.save();
    this.logger.info("Session cleared");
  }
};

// src/auth.ts
var AuthManager = class {
  config;
  session;
  logger;
  baseUrl;
  reloginMutex = null;
  constructor(baseUrl, config, session, logger) {
    this.baseUrl = baseUrl;
    this.config = config;
    this.session = session;
    this.logger = logger;
  }
  /**
   * Fetch CSRF token by visiting a page first
   */
  async fetchCsrfToken() {
    const jar = this.session.getJar();
    try {
      const csrfEndpoint = new URL("/svc/auth/csrf-token", this.baseUrl).toString();
      this.logger.debug({ url: csrfEndpoint }, "Trying CSRF endpoint");
      const cookieHeader = await jar.getCookieString(csrfEndpoint);
      const response = await fetch(csrfEndpoint, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          ...cookieHeader ? { Cookie: cookieHeader } : {}
        }
      });
      if (response.ok) {
        const data = await response.json();
        this.logger.debug({ data }, "CSRF endpoint response");
        const setCookies = response.headers.getSetCookie?.() || [];
        for (const cookie of setCookies) {
          await jar.setCookie(cookie, csrfEndpoint);
        }
        if (data.token || data.csrf_token || data.csrfToken) {
          const token = data.token || data.csrf_token || data.csrfToken;
          this.logger.info({ source: "csrf-endpoint" }, "Found CSRF token from endpoint");
          return token;
        }
      }
    } catch (err) {
      this.logger.debug({ err }, "CSRF endpoint not available");
    }
    const csrfUrls = [
      new URL("/app", this.baseUrl).toString(),
      new URL("/login", this.baseUrl).toString(),
      new URL("/", this.baseUrl).toString()
    ];
    for (const url of csrfUrls) {
      try {
        this.logger.debug({ url }, "Fetching CSRF token");
        const cookieHeader = await jar.getCookieString(url);
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            ...cookieHeader ? { Cookie: cookieHeader } : {}
          },
          redirect: "manual"
        });
        const setCookies = response.headers.getSetCookie?.() || [];
        for (const cookie of setCookies) {
          await jar.setCookie(cookie, url);
        }
        const cookies = await jar.getCookies(url);
        this.logger.debug({ cookieCount: cookies.length, cookies: cookies.map((c) => c.key) }, "Cookies after fetch");
        for (const cookie of cookies) {
          if (cookie.key.toLowerCase().includes("csrf") || cookie.key.toLowerCase().includes("xsrf") || cookie.key === "XSRF-TOKEN" || cookie.key === "csrf_token") {
            this.logger.info({ token: cookie.key, value: cookie.value.substring(0, 20) + "..." }, "Found CSRF token in cookie");
            return cookie.value;
          }
        }
        if (response.headers.get("content-type")?.includes("text/html")) {
          const html = await response.text();
          const metaMatch = html.match(/<meta[^>]*name=["']csrf-token["'][^>]*content=["']([^"']+)["']/i) || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']csrf-token["']/i);
          if (metaMatch) {
            this.logger.info({ source: "meta-tag" }, "Found CSRF token in HTML meta tag");
            return metaMatch[1];
          }
          const scriptMatch = html.match(/["']csrf["']:\s*["']([^"']+)["']/i) || html.match(/csrfToken["']:\s*["']([^"']+)["']/i) || html.match(/_csrf\s*=\s*["']([^"']+)["']/i);
          if (scriptMatch) {
            this.logger.info({ source: "script" }, "Found CSRF token in script");
            return scriptMatch[1];
          }
        }
      } catch (err) {
        this.logger.debug({ err, url }, "Failed to fetch CSRF from URL");
      }
    }
    this.logger.warn("No CSRF token found");
    return null;
  }
  /**
   * Perform login and save session
   */
  async login(credentials) {
    const creds = credentials || this.config.credentials;
    if (!creds || !creds.username || !creds.password) {
      throw new Error("Credentials required for login");
    }
    const csrfToken = await this.fetchCsrfToken();
    if (csrfToken) {
      this.logger.info({ hasToken: true }, "CSRF token obtained");
    }
    const loginUrl = new URL(this.config.loginPath || "/login", this.baseUrl).toString();
    this.logger.info({ loginUrl, mode: this.config.mode }, "Attempting login");
    const jar = this.session.getJar();
    const cookieHeader = await jar.getCookieString(loginUrl);
    let body;
    let contentType;
    if (this.config.mode === "form") {
      const params = new URLSearchParams();
      params.append(this.config.usernameField || "email", creds.username);
      params.append(this.config.passwordField || "password", creds.password);
      if (this.config.additionalFields) {
        Object.entries(this.config.additionalFields).forEach(([key, value]) => {
          params.append(key, String(value));
        });
      }
      body = params.toString();
      contentType = "application/x-www-form-urlencoded";
    } else {
      const payload = {};
      payload[this.config.usernameField || "email"] = creds.username;
      payload[this.config.passwordField || "password"] = creds.password;
      if (this.config.additionalFields) {
        Object.assign(payload, this.config.additionalFields);
      }
      body = JSON.stringify(payload);
      contentType = "application/json";
    }
    const response = await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": contentType,
        "Accept": "application/json",
        "Origin": this.baseUrl,
        "Referer": new URL("/login", this.baseUrl).toString(),
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        ...cookieHeader ? { Cookie: cookieHeader } : {},
        ...csrfToken ? { "X-CSRF-Token": csrfToken } : {}
      },
      body
    });
    const setCookies = response.headers.getSetCookie?.() || [];
    for (const cookie of setCookies) {
      await jar.setCookie(cookie, loginUrl);
    }
    if (!response.ok) {
      const text = await response.text();
      this.logger.error({ status: response.status, body: text }, "Login failed");
      throw new Error(`Login failed: ${response.status} ${response.statusText}`);
    }
    await this.session.save();
    this.logger.info("Login successful");
  }
  /**
   * Relogin with mutex to prevent concurrent relogins
   */
  async reloginIfNeeded() {
    if (this.reloginMutex) {
      this.logger.debug("Waiting for existing relogin to complete");
      await this.reloginMutex;
      return;
    }
    this.reloginMutex = this.performRelogin();
    try {
      await this.reloginMutex;
    } finally {
      this.reloginMutex = null;
    }
  }
  async performRelogin() {
    this.logger.warn("Session expired, attempting relogin");
    await this.login();
  }
  /**
   * Check if response indicates session expiry
   */
  isSessionExpired(response, body) {
    if (response.status === 401 || response.status === 403) {
      return true;
    }
    if (body && typeof body === "object") {
      const message = body.message || body.error || "";
      if (message.toLowerCase().includes("session expired") || message.toLowerCase().includes("unauthorized") || message.toLowerCase().includes("authentication")) {
        return true;
      }
    }
    return false;
  }
};

// node_modules/eventemitter3/index.mjs
var import_index2 = __toESM(require_eventemitter3(), 1);

// node_modules/p-timeout/index.js
var TimeoutError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "TimeoutError";
  }
};
var AbortError = class extends Error {
  constructor(message) {
    super();
    this.name = "AbortError";
    this.message = message;
  }
};
var getDOMException = (errorMessage) => globalThis.DOMException === void 0 ? new AbortError(errorMessage) : new DOMException(errorMessage);
var getAbortedReason = (signal) => {
  const reason = signal.reason === void 0 ? getDOMException("This operation was aborted.") : signal.reason;
  return reason instanceof Error ? reason : getDOMException(reason);
};
function pTimeout(promise, options) {
  const {
    milliseconds,
    fallback,
    message,
    customTimers = { setTimeout, clearTimeout }
  } = options;
  let timer;
  let abortHandler;
  const wrappedPromise = new Promise((resolve, reject) => {
    if (typeof milliseconds !== "number" || Math.sign(milliseconds) !== 1) {
      throw new TypeError(`Expected \`milliseconds\` to be a positive number, got \`${milliseconds}\``);
    }
    if (options.signal) {
      const { signal } = options;
      if (signal.aborted) {
        reject(getAbortedReason(signal));
      }
      abortHandler = () => {
        reject(getAbortedReason(signal));
      };
      signal.addEventListener("abort", abortHandler, { once: true });
    }
    if (milliseconds === Number.POSITIVE_INFINITY) {
      promise.then(resolve, reject);
      return;
    }
    const timeoutError = new TimeoutError();
    timer = customTimers.setTimeout.call(void 0, () => {
      if (fallback) {
        try {
          resolve(fallback());
        } catch (error) {
          reject(error);
        }
        return;
      }
      if (typeof promise.cancel === "function") {
        promise.cancel();
      }
      if (message === false) {
        resolve();
      } else if (message instanceof Error) {
        reject(message);
      } else {
        timeoutError.message = message ?? `Promise timed out after ${milliseconds} milliseconds`;
        reject(timeoutError);
      }
    }, milliseconds);
    (async () => {
      try {
        resolve(await promise);
      } catch (error) {
        reject(error);
      }
    })();
  });
  const cancelablePromise = wrappedPromise.finally(() => {
    cancelablePromise.clear();
    if (abortHandler && options.signal) {
      options.signal.removeEventListener("abort", abortHandler);
    }
  });
  cancelablePromise.clear = () => {
    customTimers.clearTimeout.call(void 0, timer);
    timer = void 0;
  };
  return cancelablePromise;
}

// node_modules/p-queue/dist/lower-bound.js
function lowerBound(array, value, comparator) {
  let first = 0;
  let count = array.length;
  while (count > 0) {
    const step = Math.trunc(count / 2);
    let it = first + step;
    if (comparator(array[it], value) <= 0) {
      first = ++it;
      count -= step + 1;
    } else {
      count = step;
    }
  }
  return first;
}

// node_modules/p-queue/dist/priority-queue.js
var PriorityQueue = class {
  #queue = [];
  enqueue(run, options) {
    options = {
      priority: 0,
      ...options
    };
    const element = {
      priority: options.priority,
      id: options.id,
      run
    };
    if (this.size === 0 || this.#queue[this.size - 1].priority >= options.priority) {
      this.#queue.push(element);
      return;
    }
    const index = lowerBound(this.#queue, element, (a, b) => b.priority - a.priority);
    this.#queue.splice(index, 0, element);
  }
  setPriority(id, priority) {
    const index = this.#queue.findIndex((element) => element.id === id);
    if (index === -1) {
      throw new ReferenceError(`No promise function with the id "${id}" exists in the queue.`);
    }
    const [item] = this.#queue.splice(index, 1);
    this.enqueue(item.run, { priority, id });
  }
  dequeue() {
    const item = this.#queue.shift();
    return item?.run;
  }
  filter(options) {
    return this.#queue.filter((element) => element.priority === options.priority).map((element) => element.run);
  }
  get size() {
    return this.#queue.length;
  }
};

// node_modules/p-queue/dist/index.js
var PQueue = class extends import_index2.default {
  #carryoverConcurrencyCount;
  #isIntervalIgnored;
  #intervalCount = 0;
  #intervalCap;
  #interval;
  #intervalEnd = 0;
  #intervalId;
  #timeoutId;
  #queue;
  #queueClass;
  #pending = 0;
  // The `!` is needed because of https://github.com/microsoft/TypeScript/issues/32194
  #concurrency;
  #isPaused;
  #throwOnTimeout;
  // Use to assign a unique identifier to a promise function, if not explicitly specified
  #idAssigner = 1n;
  /**
      Per-operation timeout in milliseconds. Operations fulfill once `timeout` elapses if they haven't already.
  
      Applies to each future operation.
      */
  timeout;
  // TODO: The `throwOnTimeout` option should affect the return types of `add()` and `addAll()`
  constructor(options) {
    super();
    options = {
      carryoverConcurrencyCount: false,
      intervalCap: Number.POSITIVE_INFINITY,
      interval: 0,
      concurrency: Number.POSITIVE_INFINITY,
      autoStart: true,
      queueClass: PriorityQueue,
      ...options
    };
    if (!(typeof options.intervalCap === "number" && options.intervalCap >= 1)) {
      throw new TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${options.intervalCap?.toString() ?? ""}\` (${typeof options.intervalCap})`);
    }
    if (options.interval === void 0 || !(Number.isFinite(options.interval) && options.interval >= 0)) {
      throw new TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${options.interval?.toString() ?? ""}\` (${typeof options.interval})`);
    }
    this.#carryoverConcurrencyCount = options.carryoverConcurrencyCount;
    this.#isIntervalIgnored = options.intervalCap === Number.POSITIVE_INFINITY || options.interval === 0;
    this.#intervalCap = options.intervalCap;
    this.#interval = options.interval;
    this.#queue = new options.queueClass();
    this.#queueClass = options.queueClass;
    this.concurrency = options.concurrency;
    this.timeout = options.timeout;
    this.#throwOnTimeout = options.throwOnTimeout === true;
    this.#isPaused = options.autoStart === false;
  }
  get #doesIntervalAllowAnother() {
    return this.#isIntervalIgnored || this.#intervalCount < this.#intervalCap;
  }
  get #doesConcurrentAllowAnother() {
    return this.#pending < this.#concurrency;
  }
  #next() {
    this.#pending--;
    this.#tryToStartAnother();
    this.emit("next");
  }
  #onResumeInterval() {
    this.#onInterval();
    this.#initializeIntervalIfNeeded();
    this.#timeoutId = void 0;
  }
  get #isIntervalPaused() {
    const now = Date.now();
    if (this.#intervalId === void 0) {
      const delay = this.#intervalEnd - now;
      if (delay < 0) {
        this.#intervalCount = this.#carryoverConcurrencyCount ? this.#pending : 0;
      } else {
        if (this.#timeoutId === void 0) {
          this.#timeoutId = setTimeout(() => {
            this.#onResumeInterval();
          }, delay);
        }
        return true;
      }
    }
    return false;
  }
  #tryToStartAnother() {
    if (this.#queue.size === 0) {
      if (this.#intervalId) {
        clearInterval(this.#intervalId);
      }
      this.#intervalId = void 0;
      this.emit("empty");
      if (this.#pending === 0) {
        this.emit("idle");
      }
      return false;
    }
    if (!this.#isPaused) {
      const canInitializeInterval = !this.#isIntervalPaused;
      if (this.#doesIntervalAllowAnother && this.#doesConcurrentAllowAnother) {
        const job = this.#queue.dequeue();
        if (!job) {
          return false;
        }
        this.emit("active");
        job();
        if (canInitializeInterval) {
          this.#initializeIntervalIfNeeded();
        }
        return true;
      }
    }
    return false;
  }
  #initializeIntervalIfNeeded() {
    if (this.#isIntervalIgnored || this.#intervalId !== void 0) {
      return;
    }
    this.#intervalId = setInterval(() => {
      this.#onInterval();
    }, this.#interval);
    this.#intervalEnd = Date.now() + this.#interval;
  }
  #onInterval() {
    if (this.#intervalCount === 0 && this.#pending === 0 && this.#intervalId) {
      clearInterval(this.#intervalId);
      this.#intervalId = void 0;
    }
    this.#intervalCount = this.#carryoverConcurrencyCount ? this.#pending : 0;
    this.#processQueue();
  }
  /**
  Executes all queued functions until it reaches the limit.
  */
  #processQueue() {
    while (this.#tryToStartAnother()) {
    }
  }
  get concurrency() {
    return this.#concurrency;
  }
  set concurrency(newConcurrency) {
    if (!(typeof newConcurrency === "number" && newConcurrency >= 1)) {
      throw new TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${newConcurrency}\` (${typeof newConcurrency})`);
    }
    this.#concurrency = newConcurrency;
    this.#processQueue();
  }
  async #throwOnAbort(signal) {
    return new Promise((_resolve, reject) => {
      signal.addEventListener("abort", () => {
        reject(signal.reason);
      }, { once: true });
    });
  }
  /**
      Updates the priority of a promise function by its id, affecting its execution order. Requires a defined concurrency limit to take effect.
  
      For example, this can be used to prioritize a promise function to run earlier.
  
      ```js
      import PQueue from 'p-queue';
  
      const queue = new PQueue({concurrency: 1});
  
      queue.add(async () => '🦄', {priority: 1});
      queue.add(async () => '🦀', {priority: 0, id: '🦀'});
      queue.add(async () => '🦄', {priority: 1});
      queue.add(async () => '🦄', {priority: 1});
  
      queue.setPriority('🦀', 2);
      ```
  
      In this case, the promise function with `id: '🦀'` runs second.
  
      You can also deprioritize a promise function to delay its execution:
  
      ```js
      import PQueue from 'p-queue';
  
      const queue = new PQueue({concurrency: 1});
  
      queue.add(async () => '🦄', {priority: 1});
      queue.add(async () => '🦀', {priority: 1, id: '🦀'});
      queue.add(async () => '🦄');
      queue.add(async () => '🦄', {priority: 0});
  
      queue.setPriority('🦀', -1);
      ```
      Here, the promise function with `id: '🦀'` executes last.
      */
  setPriority(id, priority) {
    this.#queue.setPriority(id, priority);
  }
  async add(function_, options = {}) {
    options.id ??= (this.#idAssigner++).toString();
    options = {
      timeout: this.timeout,
      throwOnTimeout: this.#throwOnTimeout,
      ...options
    };
    return new Promise((resolve, reject) => {
      this.#queue.enqueue(async () => {
        this.#pending++;
        try {
          options.signal?.throwIfAborted();
          this.#intervalCount++;
          let operation = function_({ signal: options.signal });
          if (options.timeout) {
            operation = pTimeout(Promise.resolve(operation), { milliseconds: options.timeout });
          }
          if (options.signal) {
            operation = Promise.race([operation, this.#throwOnAbort(options.signal)]);
          }
          const result = await operation;
          resolve(result);
          this.emit("completed", result);
        } catch (error) {
          if (error instanceof TimeoutError && !options.throwOnTimeout) {
            resolve();
            return;
          }
          reject(error);
          this.emit("error", error);
        } finally {
          this.#next();
        }
      }, options);
      this.emit("add");
      this.#tryToStartAnother();
    });
  }
  async addAll(functions, options) {
    return Promise.all(functions.map(async (function_) => this.add(function_, options)));
  }
  /**
  Start (or resume) executing enqueued tasks within concurrency limit. No need to call this if queue is not paused (via `options.autoStart = false` or by `.pause()` method.)
  */
  start() {
    if (!this.#isPaused) {
      return this;
    }
    this.#isPaused = false;
    this.#processQueue();
    return this;
  }
  /**
  Put queue execution on hold.
  */
  pause() {
    this.#isPaused = true;
  }
  /**
  Clear the queue.
  */
  clear() {
    this.#queue = new this.#queueClass();
  }
  /**
      Can be called multiple times. Useful if you for example add additional items at a later time.
  
      @returns A promise that settles when the queue becomes empty.
      */
  async onEmpty() {
    if (this.#queue.size === 0) {
      return;
    }
    await this.#onEvent("empty");
  }
  /**
      @returns A promise that settles when the queue size is less than the given limit: `queue.size < limit`.
  
      If you want to avoid having the queue grow beyond a certain size you can `await queue.onSizeLessThan()` before adding a new item.
  
      Note that this only limits the number of items waiting to start. There could still be up to `concurrency` jobs already running that this call does not include in its calculation.
      */
  async onSizeLessThan(limit) {
    if (this.#queue.size < limit) {
      return;
    }
    await this.#onEvent("next", () => this.#queue.size < limit);
  }
  /**
      The difference with `.onEmpty` is that `.onIdle` guarantees that all work from the queue has finished. `.onEmpty` merely signals that the queue is empty, but it could mean that some promises haven't completed yet.
  
      @returns A promise that settles when the queue becomes empty, and all promises have completed; `queue.size === 0 && queue.pending === 0`.
      */
  async onIdle() {
    if (this.#pending === 0 && this.#queue.size === 0) {
      return;
    }
    await this.#onEvent("idle");
  }
  async #onEvent(event, filter) {
    return new Promise((resolve) => {
      const listener = () => {
        if (filter && !filter()) {
          return;
        }
        this.off(event, listener);
        resolve();
      };
      this.on(event, listener);
    });
  }
  /**
  Size of the queue, the number of queued items waiting to run.
  */
  get size() {
    return this.#queue.size;
  }
  /**
      Size of the queue, filtered by the given options.
  
      For example, this can be used to find the number of items remaining in the queue with a specific priority level.
      */
  sizeBy(options) {
    return this.#queue.filter(options).length;
  }
  /**
  Number of running items (no longer in the queue).
  */
  get pending() {
    return this.#pending;
  }
  /**
  Whether the queue is currently paused.
  */
  get isPaused() {
    return this.#isPaused;
  }
};

// src/http.ts
var HttpClient = class {
  session;
  auth;
  baseUrl;
  headers;
  retryConfig;
  logger;
  queue;
  constructor(baseUrl, session, auth, headers, retryConfig, rateLimit, logger) {
    this.baseUrl = baseUrl;
    this.session = session;
    this.auth = auth;
    this.headers = headers;
    this.retryConfig = retryConfig;
    this.logger = logger;
    this.queue = new PQueue({
      concurrency: rateLimit.concurrency,
      interval: rateLimit.intervalMs,
      intervalCap: 1
    });
  }
  /**
   * Execute request with authentication, retries, and rate limiting
   */
  async requestWithAuth(path, options = {}) {
    return this.queue.add(() => this.executeRequest(path, options, 0, false));
  }
  /**
   * Internal method to execute a request with retry logic
   */
  async executeRequest(path, options, attempt, isRetry) {
    const url = new URL(path, this.baseUrl).toString();
    const jar = this.session.getJar();
    const cookieHeader = await jar.getCookieString(url);
    const requestHeaders = {
      ...this.headers,
      "Origin": this.baseUrl,
      "Referer": new URL("/app", this.baseUrl).toString(),
      ...options.headers,
      ...cookieHeader ? { Cookie: cookieHeader } : {}
    };
    this.logger.debug(
      { url, method: options.method || "GET", attempt, isRetry },
      "Executing request"
    );
    let response;
    try {
      response = await fetch(url, {
        ...options,
        headers: requestHeaders
      });
      const setCookies = response.headers.getSetCookie?.() || [];
      for (const cookie of setCookies) {
        await jar.setCookie(cookie, url);
      }
      if (setCookies.length > 0) {
        await this.session.save();
      }
    } catch (err) {
      this.logger.error({ err, url, attempt }, "Request failed with network error");
      if (attempt < this.retryConfig.maxRetries) {
        const delay = this.calculateDelay(attempt);
        this.logger.info({ delay, attempt }, "Retrying after network error");
        await this.sleep(delay);
        return this.executeRequest(path, options, attempt + 1, true);
      }
      throw err;
    }
    let body;
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      body = await response.json();
    } else {
      body = await response.text();
    }
    if (this.auth && !isRetry && this.auth.isSessionExpired(response, body)) {
      this.logger.warn("Session expired detected, attempting relogin");
      await this.auth.reloginIfNeeded();
      return this.executeRequest(path, options, 0, true);
    }
    if (response.status === 429) {
      if (attempt < this.retryConfig.maxRetries) {
        const retryAfter = response.headers.get("Retry-After");
        const delay = retryAfter ? parseInt(retryAfter) * 1e3 : this.calculateDelay(attempt);
        this.logger.warn({ delay, attempt, retryAfter }, "Rate limited, retrying");
        await this.sleep(delay);
        return this.executeRequest(path, options, attempt + 1, true);
      }
    }
    if (response.status >= 500 && response.status < 600) {
      if (attempt < this.retryConfig.maxRetries) {
        const delay = this.calculateDelay(attempt);
        this.logger.warn({ status: response.status, delay, attempt }, "Server error, retrying");
        await this.sleep(delay);
        return this.executeRequest(path, options, attempt + 1, true);
      }
    }
    if (!response.ok) {
      const error = new Error(
        `HTTP ${response.status}: ${response.statusText}
${typeof body === "string" ? body : JSON.stringify(body, null, 2)}`
      );
      this.logger.error({ status: response.status, body }, "Request failed");
      throw error;
    }
    this.logger.debug({ status: response.status }, "Request successful");
    return body;
  }
  /**
   * Calculate delay with exponential backoff and jitter
   */
  calculateDelay(attempt) {
    const exponentialDelay = this.retryConfig.baseDelayMs * Math.pow(2, attempt);
    const jitter = Math.random() * this.retryConfig.baseDelayMs;
    return Math.min(exponentialDelay + jitter, 3e4);
  }
  /**
   * Sleep utility
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  /**
   * POST request helper
   */
  async post(path, body) {
    return this.requestWithAuth(path, {
      method: "POST",
      body: JSON.stringify(body)
    });
  }
  /**
   * GET request helper
   */
  async get(path) {
    return this.requestWithAuth(path, {
      method: "GET"
    });
  }
};

// src/search.ts
function buildNextPagePayload(originalPayload, previousResponse) {
  const { scroll_token, sort_fields, last_sort } = previousResponse.body;
  const nextPayload = {
    ...originalPayload,
    // Override with pagination fields from response
    scroll_token,
    sort_fields,
    search_after: last_sort
  };
  return nextPayload;
}
var SearchManager = class {
  http;
  logger;
  searchPath;
  constructor(http, logger, searchPath = "/svc/app/prospect/search") {
    this.http = http;
    this.logger = logger;
    this.searchPath = searchPath;
  }
  /**
   * Fetch all search results with pagination
   */
  async searchAll(payload, options = {}) {
    const { maxPages = Infinity, maxItems = Infinity, pageSizeOverride } = options;
    const initialPayload = pageSizeOverride ? { ...payload, page_size: pageSizeOverride } : payload;
    const allItems = [];
    let pagesFetched = 0;
    let currentPayload = initialPayload;
    let lastResponse = null;
    this.logger.info(
      { maxPages, maxItems, pageSize: currentPayload.page_size },
      "Starting paginated search"
    );
    while (pagesFetched < maxPages && allItems.length < maxItems) {
      this.logger.debug({ page: pagesFetched + 1, itemsCollected: allItems.length }, "Fetching page");
      const response = await this.http.post(this.searchPath, currentPayload);
      lastResponse = response;
      pagesFetched++;
      const responseBody = response.body || response;
      const { data, total, total_relation } = responseBody;
      if (!data) {
        this.logger.error({ response }, "Unexpected response structure");
        throw new Error("Response missing data field");
      }
      const remainingSlots = maxItems - allItems.length;
      const itemsToAdd = data.slice(0, remainingSlots);
      allItems.push(...itemsToAdd);
      this.logger.info(
        {
          page: pagesFetched,
          itemsOnPage: data.length,
          totalCollected: allItems.length,
          total,
          totalRelation: total_relation
        },
        "Page fetched"
      );
      if (data.length === 0) {
        this.logger.info("No more data available, stopping pagination");
        break;
      }
      if (allItems.length >= maxItems) {
        this.logger.info({ maxItems }, "Reached maxItems limit, stopping pagination");
        break;
      }
      currentPayload = buildNextPagePayload(initialPayload, response);
    }
    if (pagesFetched >= maxPages) {
      this.logger.info({ maxPages }, "Reached maxPages limit");
    }
    return {
      items: allItems,
      pagesFetched,
      total: lastResponse?.body.total || 0,
      totalRelation: lastResponse?.body.total_relation || "eq",
      queryId: lastResponse?.body.query_id || "",
      lastScrollToken: lastResponse?.body.scroll_token || ""
    };
  }
  /**
   * Stream search results page by page
   */
  async *searchStream(payload, options = {}) {
    const { maxPages = Infinity, maxItems = Infinity, pageSizeOverride } = options;
    const initialPayload = pageSizeOverride ? { ...payload, page_size: pageSizeOverride } : payload;
    let pagesFetched = 0;
    let itemsYielded = 0;
    let currentPayload = initialPayload;
    this.logger.info(
      { maxPages, maxItems, pageSize: currentPayload.page_size },
      "Starting streaming search"
    );
    while (pagesFetched < maxPages && itemsYielded < maxItems) {
      this.logger.debug({ page: pagesFetched + 1, itemsYielded }, "Fetching page (stream)");
      const response = await this.http.post(this.searchPath, currentPayload);
      pagesFetched++;
      const { data } = response.body;
      if (data.length === 0) {
        this.logger.info("No more data available, stopping stream");
        break;
      }
      for (const item of data) {
        if (itemsYielded >= maxItems) {
          this.logger.info({ maxItems }, "Reached maxItems limit in stream");
          return;
        }
        yield item;
        itemsYielded++;
      }
      currentPayload = buildNextPagePayload(initialPayload, response);
    }
    if (pagesFetched >= maxPages) {
      this.logger.info({ maxPages }, "Reached maxPages limit in stream");
    }
  }
};

// src/index.ts
var ProspectClient = class {
  config;
  logger;
  session;
  auth = null;
  http;
  search;
  sessionInitialized = false;
  constructor(config) {
    this.config = mergeConfig(config);
    this.logger = (0, import_pino.default)({
      level: this.config.debug ? "debug" : "info"
    });
    this.session = new SessionManager(this.config.sessionFile, this.logger);
    if (this.config.auth.credentials) {
      this.auth = new AuthManager(
        this.config.baseUrl,
        this.config.auth,
        this.session,
        this.logger
      );
    }
    this.http = new HttpClient(
      this.config.baseUrl,
      this.session,
      this.auth,
      this.config.headers,
      this.config.retries,
      this.config.rateLimit,
      this.logger
    );
    this.search = new SearchManager(this.http, this.logger);
  }
  /**
   * Ensure session is loaded (call this before making requests)
   */
  async ensureSession() {
    if (this.sessionInitialized) {
      return;
    }
    await this.session.load();
    this.sessionInitialized = true;
  }
  /**
   * Manually trigger login and save session
   */
  async login(credentials) {
    await this.ensureSession();
    if (!this.auth) {
      this.auth = new AuthManager(
        this.config.baseUrl,
        this.config.auth,
        this.session,
        this.logger
      );
      this.http = new HttpClient(
        this.config.baseUrl,
        this.session,
        this.auth,
        this.config.headers,
        this.config.retries,
        this.config.rateLimit,
        this.logger
      );
      this.search = new SearchManager(this.http, this.logger);
    }
    await this.auth.login(credentials);
  }
  /**
   * Load cookies from a file (Netscape or JSON format)
   */
  async loadCookies(cookieFile) {
    await this.ensureSession();
    await this.session.loadCookiesFromFile(cookieFile);
    await this.session.save();
  }
  /**
   * Clear session and cookies
   */
  async clearSession() {
    await this.session.clear();
    this.sessionInitialized = false;
  }
  /**
   * Search with pagination, returning all results
   */
  async searchAll(payload, options) {
    await this.ensureSession();
    return this.search.searchAll(payload, options);
  }
  /**
   * Stream search results page by page
   */
  async *searchStream(payload, options) {
    await this.ensureSession();
    yield* this.search.searchStream(payload, options);
  }
  /**
   * Get the logger instance
   */
  getLogger() {
    return this.logger;
  }
  /**
   * Get the session file path
   */
  getSessionFile() {
    return this.config.sessionFile;
  }
};

// src/cli.ts
var import_path3 = require("path");
var program2 = new Command();
async function promptPassword(prompt) {
  const rl = (0, import_readline.createInterface)({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}
async function getCredentials() {
  let username = process.env.PROSPECT_USER || process.env.PROSPECT_EMAIL;
  let password = process.env.PROSPECT_PASS;
  if (!username) {
    username = await promptPassword("Email: ");
  }
  if (!password) {
    password = await promptPassword("Password: ");
  }
  return { username, password };
}
program2.command("auth").description("Authenticate and save session").requiredOption("--base-url <url>", "Base URL of the API").option("--session-file <path>", "Path to session file").option("--login-path <path>", "Login endpoint path (default: /login)").option("--auth-mode <mode>", "Authentication mode: form or json (default: json)").option("--username-field <field>", "Username field name (default: username)").option("--password-field <field>", "Password field name (default: password)").option("--debug", "Enable debug logging").action(async (options) => {
  try {
    console.log("Authenticating...");
    const credentials = await getCredentials();
    const config = {
      baseUrl: options.baseUrl,
      sessionFile: options.sessionFile,
      debug: options.debug,
      auth: {
        mode: options.authMode || "json",
        loginPath: options.loginPath,
        usernameField: options.usernameField,
        passwordField: options.passwordField,
        credentials
      }
    };
    const client = new ProspectClient(config);
    await client.login(credentials);
    console.log("\u2713 Authentication successful");
    console.log(`Session saved to: ${client.getSessionFile()}`);
  } catch (err) {
    console.error("\u2717 Authentication failed:", err.message);
    process.exit(1);
  }
});
program2.command("set-cookies").description("Load cookies from Netscape or JSON file").requiredOption("--cookies <file>", "Path to cookies file").option("--session-file <path>", "Path to session file").option("--base-url <url>", "Base URL of the API (required for validation)").option("--debug", "Enable debug logging").action(async (options) => {
  try {
    if (!options.baseUrl) {
      console.error("\u2717 --base-url is required");
      process.exit(1);
    }
    console.log(`Loading cookies from: ${options.cookies}`);
    const config = {
      baseUrl: options.baseUrl,
      sessionFile: options.sessionFile,
      debug: options.debug
    };
    const client = new ProspectClient(config);
    await client.loadCookies(options.cookies);
    console.log("\u2713 Cookies loaded successfully");
    console.log(`Session saved to: ${config.sessionFile || "~/.config/prospect-client/session.json"}`);
  } catch (err) {
    console.error("\u2717 Failed to load cookies:", err.message);
    process.exit(1);
  }
});
program2.command("search").description("Search and paginate results").requiredOption("--base-url <url>", "Base URL of the API").requiredOption("--payload <file>", "Path to JSON payload file").requiredOption("--out <file>", "Output file path").option("--session-file <path>", "Path to session file").option("--max-pages <number>", "Maximum pages to fetch", parseInt).option("--max-items <number>", "Maximum items to fetch", parseInt).option("--page-size <number>", "Override page size", parseInt).option("--raw-pages <dir>", "Save raw page responses to directory").option("--debug", "Enable debug logging").action(async (options) => {
  try {
    console.log("Starting search...");
    const payloadContent = await (0, import_promises2.readFile)(options.payload, "utf-8");
    const payload = JSON.parse(payloadContent);
    const config = {
      baseUrl: options.baseUrl,
      sessionFile: options.sessionFile,
      debug: options.debug
    };
    const client = new ProspectClient(config);
    const searchOptions = {
      maxPages: options.maxPages,
      maxItems: options.maxItems,
      pageSizeOverride: options.pageSize
    };
    console.log("Fetching results...");
    console.log(`  Max pages: ${options.maxPages || "\u221E"}`);
    console.log(`  Max items: ${options.maxItems || "\u221E"}`);
    console.log(`  Page size: ${options.pageSize || payload.page_size || "default"}`);
    const result = await client.searchAll(payload, searchOptions);
    await (0, import_promises2.mkdir)((0, import_path3.dirname)(options.out), { recursive: true });
    await (0, import_promises2.writeFile)(options.out, JSON.stringify(result.items, null, 2), "utf-8");
    console.log("\n\u2713 Search complete");
    console.log(`  Items fetched: ${result.items.length}`);
    console.log(`  Pages fetched: ${result.pagesFetched}`);
    console.log(`  Total available: ${result.total} (${result.totalRelation})`);
    console.log(`  Output: ${options.out}`);
    if (options.rawPages) {
      console.log(`
Saving raw pages to: ${options.rawPages}`);
      await (0, import_promises2.mkdir)(options.rawPages, { recursive: true });
      let pageNum = 0;
      for await (const item of client.searchStream(payload, searchOptions)) {
        pageNum++;
      }
      console.log(`\u2713 Raw pages saved`);
    }
  } catch (err) {
    console.error("\u2717 Search failed:", err.message);
    if (options.debug) {
      console.error(err);
    }
    process.exit(1);
  }
});
program2.command("clear").description("Clear session and cookies").option("--session-file <path>", "Path to session file").requiredOption("--base-url <url>", "Base URL of the API").action(async (options) => {
  try {
    const config = {
      baseUrl: options.baseUrl,
      sessionFile: options.sessionFile
    };
    const client = new ProspectClient(config);
    await client.clearSession();
    console.log("\u2713 Session cleared");
  } catch (err) {
    console.error("\u2717 Failed to clear session:", err.message);
    process.exit(1);
  }
});
program2.name("prospect-cli").description("CLI for authenticated prospect search API").version("1.0.0");
program2.parse();
/*! Bundled license information:

tough-cookie/lib/pubsuffix-psl.js:
  (*!
   * Copyright (c) 2018, Salesforce.com, Inc.
   * All rights reserved.
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice,
   * this list of conditions and the following disclaimer.
   *
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   * this list of conditions and the following disclaimer in the documentation
   * and/or other materials provided with the distribution.
   *
   * 3. Neither the name of Salesforce.com nor the names of its contributors may
   * be used to endorse or promote products derived from this software without
   * specific prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
   * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
   * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
   * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
   * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
   * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
   * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
   * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
   * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
   * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
   * POSSIBILITY OF SUCH DAMAGE.
   *)

tough-cookie/lib/store.js:
  (*!
   * Copyright (c) 2015, Salesforce.com, Inc.
   * All rights reserved.
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice,
   * this list of conditions and the following disclaimer.
   *
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   * this list of conditions and the following disclaimer in the documentation
   * and/or other materials provided with the distribution.
   *
   * 3. Neither the name of Salesforce.com nor the names of its contributors may
   * be used to endorse or promote products derived from this software without
   * specific prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
   * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
   * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
   * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
   * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
   * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
   * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
   * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
   * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
   * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
   * POSSIBILITY OF SUCH DAMAGE.
   *)

tough-cookie/lib/permuteDomain.js:
  (*!
   * Copyright (c) 2015, Salesforce.com, Inc.
   * All rights reserved.
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice,
   * this list of conditions and the following disclaimer.
   *
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   * this list of conditions and the following disclaimer in the documentation
   * and/or other materials provided with the distribution.
   *
   * 3. Neither the name of Salesforce.com nor the names of its contributors may
   * be used to endorse or promote products derived from this software without
   * specific prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
   * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
   * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
   * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
   * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
   * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
   * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
   * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
   * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
   * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
   * POSSIBILITY OF SUCH DAMAGE.
   *)

tough-cookie/lib/pathMatch.js:
  (*!
   * Copyright (c) 2015, Salesforce.com, Inc.
   * All rights reserved.
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice,
   * this list of conditions and the following disclaimer.
   *
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   * this list of conditions and the following disclaimer in the documentation
   * and/or other materials provided with the distribution.
   *
   * 3. Neither the name of Salesforce.com nor the names of its contributors may
   * be used to endorse or promote products derived from this software without
   * specific prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
   * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
   * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
   * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
   * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
   * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
   * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
   * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
   * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
   * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
   * POSSIBILITY OF SUCH DAMAGE.
   *)

tough-cookie/lib/memstore.js:
  (*!
   * Copyright (c) 2015, Salesforce.com, Inc.
   * All rights reserved.
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice,
   * this list of conditions and the following disclaimer.
   *
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   * this list of conditions and the following disclaimer in the documentation
   * and/or other materials provided with the distribution.
   *
   * 3. Neither the name of Salesforce.com nor the names of its contributors may
   * be used to endorse or promote products derived from this software without
   * specific prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
   * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
   * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
   * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
   * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
   * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
   * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
   * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
   * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
   * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
   * POSSIBILITY OF SUCH DAMAGE.
   *)

tough-cookie/lib/cookie.js:
  (*!
   * Copyright (c) 2015-2020, Salesforce.com, Inc.
   * All rights reserved.
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice,
   * this list of conditions and the following disclaimer.
   *
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   * this list of conditions and the following disclaimer in the documentation
   * and/or other materials provided with the distribution.
   *
   * 3. Neither the name of Salesforce.com nor the names of its contributors may
   * be used to endorse or promote products derived from this software without
   * specific prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
   * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
   * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
   * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
   * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
   * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
   * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
   * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
   * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
   * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
   * POSSIBILITY OF SUCH DAMAGE.
   *)
*/
//# sourceMappingURL=cli.cjs.map
