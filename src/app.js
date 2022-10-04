function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var { value } = info;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}

function _asyncToGenerator(fn) {
    return function () {
        const self = this;
        const args = arguments;
        return new Promise((resolve, reject) => {
            const gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next();
        });
    };
}

const _require = require("axios");

const axios = _require.default;
const Bluebird = require("bluebird");
const lolcatjs = require("lolcatjs");
const figlet = require("figlet");
const _require2 = require("enquirer");

const { prompt } = _require2;
const chalk = require("chalk");
const ora = require("ora");

const instance = axios.create({
    validateStatus: (status) => status >= 0 && status <= 1000,
    timeout: 7500,
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
            lolcatjs.options.seed = Math.round(Math.random() * 1000); // lolcatjs.fromString("\b\b\tMade by Biswajeet7 & Devxprite\n\n\n");

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

const checkUpi = /* #__PURE__ */ (function () {
    const _ref = _asyncToGenerator(function* (upi) {
        return new Promise((resolve) => {
            const spinner = ora(`Checking ${upi}`).start();
            instance
                .post(`https://upibankvalidator.com/api/upiValidation?upi=${upi}`)
                .then((response) => {
                    const { data } = response;

                    if (data.isUpiRegistered) {
                        spinner.succeed(
                            `UPI ${chalk.cyanBright(upi)} is registered to ${chalk.magentaBright(data.name)}.`,
                        );
                    } else {
                        spinner.fail(`UPI ${chalk.cyanBright(upi)} is not yet registered to any person or entity.`);
                    }

                    resolve();
                })
                .catch((error) => {
                    spinner.fail(`UPI ${chalk.cyanBright(upi)} is not yet registered to any person or entity.`);
                    resolve();
                });
        });
    });

    return function checkUpi(_x) {
        return Reflect.apply(_ref, this, arguments);
    };
}());

_asyncToGenerator(function* () {
    yield banner();
    const inputUPI = yield input("UPI");
    const UPIs = banks.map((bank) => `${inputUPI.replace(/\s/g, "").split("@")[0]}@${bank}`);
    yield Bluebird.map(
        UPIs,
        (upi) => new Promise((resolve) => {
            checkUpi(upi).then(() => {
                resolve();
            });
        }),
        {
            concurrency: 1,
        },
    );
    console.log(chalk.greenBright(`\n\nThank You for using ${chalk.hex("#FFA500")("UPI-INT")}.`));
})();
