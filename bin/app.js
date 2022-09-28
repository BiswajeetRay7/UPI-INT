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

const _require2 = require("enquirer");

const { prompt } = _require2;

const chalk = require("chalk");

const ora = require("ora");

const pkg = require("../package.json");

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

const checkUpi = /* #__PURE__ */ (function () {
    const _ref = _asyncToGenerator(function* (upi) {
        return new Promise((resolve) => {
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
    });

    return function checkUpi(_x) {
        return Reflect.apply(_ref, this, arguments);
    };
}());

_asyncToGenerator(function* () {
    banner();
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
    console.log(chalk.greenBright(`\n\nThank You! for using ${pkg.name}.`));
})();
