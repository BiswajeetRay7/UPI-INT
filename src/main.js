#!/usr/bin/env node
const { default: axios } = require("axios");
const Bluebird = require("bluebird");
const lolcatjs = require("lolcatjs");
const figlet = require("figlet");
const { prompt } = require("enquirer");
const chalk = require("chalk");
const ora = require("ora");
// const pkg = require("../package.json");

const instance = axios.create({
    validateStatus: (status) => status >= 0 && status <= 1000,
    timeout: 3500,
});

const banner = () => new Promise((resolve) => {
    lolcatjs.options.seed = Math.round(Math.random() * 1000);
    lolcatjs.options.colors = true;
    figlet.text(
        "UPI-INT",
        {
            font: "Big Money-ne",
            horizontalLayout: "fitted",
        },
        (err, data) => {
            if (err) return;
            console.log("\n");
            lolcatjs.fromString(data);
            lolcatjs.options.seed = Math.round(Math.random() * 1000);
            lolcatjs.fromString("\t\tMade by DevXprite & BiswajeetRay7\n\n");
            resolve();
        },
    );
});

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
    "abfspay",
    "allbank",
    "apl",
    "aubank",
    "axisb",
    "axisbank",
    "axl",
    "bandhan",
    "barodampay",
    "citi",
    "citigold",
    "dbs",
    "dlb",
    "fbl",
    "federal",
    "freecharge",
    "hsbc",
    "ibl",
    "icici",
    "idbi",
    "idfcbank",
    "ikwik",
    "indianbank",
    "indus",
    "jupiteraxis",
    "kbl",
    "kmbl",
    "kotak",
    "okaxis",
    "okhdfcbank",
    "okicici",
    "oksbi",
    "paytm",
    "pingpay",
    "rbl",
    "sbi",
    "sib",
    "tapicici",
    "timecosmos",
    "ubio",
    "uco",
    "unionbank",
    "unionbankofindia",
    "upi",
    "waaxis",
    "wahdfcbank",
    "waicici",
    "wasbi",
    "yapl",
    "ybl",
    "yesbank",
    "boi",
    "cbin",
    "cboi",
    "centralbank",
    "cnrb",
    "eazypay",
    "ezeepay",
    "hdfcbank",
    "idbibank",
    "imobile",
    "kaypay",
    "mahb",
    "payzapp",
    "pnb",
    "pockets",
    "rajgovhdfcbank",
    "ubi",
    "united",
    "utbi",
    "yesbankltd",
];

const checkUpi = async (upi) => new Promise((resolve) => {
    const spinner = ora(`Checking ${upi}`).start();
    instance
        .post(`https://upibankvalidator.com/api/upiValidation?upi=${upi}`)
        .then((response) => {
            const { data } = response;
            if (data.isUpiRegistered) {
                spinner.succeed(`UPI ${chalk.cyanBright(upi)} is registered to ${chalk.magentaBright(data.name)}.`);
            } else {
                spinner.fail(`UPI ${chalk.cyanBright(upi)} is not yet registered to any person or entity.`);
            }
            resolve();
        })
    // eslint-disable-next-line no-unused-vars
        .catch((error) => {
            spinner.fail(`UPI ${chalk.cyanBright(upi)} is not yet registered to any person or entity.`);
            resolve();
        });
});

(async () => {
    await banner();

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

    console.log(chalk.greenBright(`\n\nThank You for using ${chalk.hex("#FFA500")("UPI-INT")}.`));
})();
