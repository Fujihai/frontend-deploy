const arg = require("arg");

const args = arg({
  // Types
  "--help": Boolean,
  "--version": Boolean,
  "--verbose": arg.COUNT, // Counts the number of times --verbose is passed
  "--port": Number, // --port <number> or --port=<number>
  "--name": String, // --name <string> or --name=<string>
  "--tag": [String], // --tag <string> or --tag=<string>

  // Aliases
  "-v": "--verbose",
  "-n": "--name", // -n <string>; result is stored in --name
  "--label": "--name", // --label <string> or --label=<string>;
  //     result is stored in --name
});

console.log(args, args._[0]);
/*
{
	_: ["foo", "bar", "--foobar"],
	'--port': 1234,
	'--verbose': 4,
	'--name': "My name",
	'--tag': ["qux", "qix"]
}
*/

// run command: node ./arg_usage.js --verbose -vvv --port=1234 -n 'My name' foo bar --tag qux --tag=qix -- --foobar
