const { default: axios } = require("axios");
const Bluebird = require("bluebird");
const { prompt } = require("enquirer");
const chalk = require("chalk");
const ora = require("ora");
const pkg = require("./package.json");

const instance = axios.create({
    validateStatus: (status) => status >= 0 && status <= 1000,
});

const banner = () => {
    // console.log(`

    //     ${chalk.green(`v${pkg.version}`)}
    // `);
};

const input = (inputName) => new Promise((resolve) => {
    prompt({
        type: "input",
        name: inputName,
        message: "Enter a Phone Number or UPI ",
    }).then((data) => {
        console.log("\n");
        resolve(data[inputName]);
    });
});

const banks = [
    "apl",
    "ybl",
    "oksbi",
    "okhdfcbank",
    "axl",
    "paytm",
    "ibl",
    "upi",
    "icici",
    "sbi",
    "kotak",
    "postbank",
    "axisbank",
    "okicici",
    "okaxis",
    "dbs",
    "barodampay",
    "idfcbank",
];

const checkUpi = async (upi) => new Promise((resolve) => {
    const spinner = ora(`Checking ${upi}`).start();
    instance.post(`https://upibankvalidator.com/api/upiValidation?upi=${upi}`).then((response) => {
        const { data } = response;
        if (data.isUpiRegistered) {
            spinner.succeed(`UPI ${chalk.cyanBright(upi)} is registered to ${chalk.magentaBright(data.name)}.`);
        } else {
            spinner.fail(`UPI ${chalk.cyanBright(upi)} is not yet registered to any person or entity.`);
        }
        resolve();
    });
});

(async () => {
    banner();

    const inputUPI = await input("UPI");

    const UPIs = banks.map((bank) => `${inputUPI.replace(/\s/g, "").split("@")[0]}@${bank}`);

    await Bluebird.map(
        UPIs,
        (upi) => new Promise((resolve) => {
            checkUpi(upi).then(() => {
                resolve();
            });
        }),
        { concurrency: 1 },
    );

    console.log(chalk.greenBright(`\n\nThank You! for using ${pkg.name}.`));
})();
