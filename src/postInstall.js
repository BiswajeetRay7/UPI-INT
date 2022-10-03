const chalk = require("chalk");
const boxen = require("boxen");
const pkg = require("../package.json");

(async () => {
    console.log(
        `\n\n\n${boxen(`${chalk.hex("#FFA500")(`Thank You for Installing ${pkg.name}@${pkg.version}`)}`, {
            padding: 1,
            borderColor: "cyanBright",
            textAlignment: "center",
            margin: 1,
            borderStyle: "round",
        })}\n\n\n`,
    );
})();
