import chalk from "chalk";
import { Command } from "commander";
import inquirer from "inquirer";
import fetch from "node-fetch";
import { config } from "./config.js";

const program = new Command();

let token = "";
let login = "";

program
  .name("ppo cli")
  .description("CLI to make requests to ppo project")
  .version("0.0.1");

program
  .command("login")
  .description("login in your account")
  .action(() => {
    inquirer
      .prompt([
        {
          type: "input",
          name: "username",
          message: "Input your username:",
        },
        {
          type: "password",
          name: "password",
          message: "Input your password:",
          mask: "*",
        },
      ])
      .then(async (answers) => {
        const f = await fetch(
          `${config.url}/api/user/login?login=${answers.username}&password=${answers.password}`,
          { method: "POST" }
        );

        if (f.ok) {
          console.log(chalk.green("Logged in successfully"));
          token = await f.text();
          login = answers.username;
        } else {
          console.log(chalk.red(`Error: ${((await f.json()) as any).errors}`));
        }

        mainMenu();
      });
  });

program
  .command("signup")
  .description("Account registration")
  .action(() => {
    inquirer
      .prompt([
        {
          type: "input",
          name: "username",
          message: "Input your username:",
        },
        {
          type: "password",
          name: "password",
          message: "Input your password:",
          mask: "*",
        },
      ])
      .then(async (answers) => {
        const f = await fetch(`${config.url}/api/user/signup`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            login: answers.username,
            password: answers.password,
          }),
        });

        if (f.ok) {
          console.log(chalk.green("signup succesfully"));
        } else {
          console.log(chalk.red(`Error: ${((await f.json()) as any).errors}`));
        }

        mainMenu();
      });
  });

program
  .command("addAdvertisiment")
  .description("Add advertisiment")
  .action(() => {
    if (token === "") {
      console.log(chalk.red("Login firstly"));
      mainMenu();
    } else {
      inquirer
        .prompt([
          {
            type: "input",
            name: "description",
            message: "Input advertisiment's description",
          },
          {
            type: "input",
            name: "address",
            message: "Input advertisiment's address",
          },
          {
            type: "input",
            name: "cost",
            message: "Input advertisiment's cost",
          },
        ])
        .then(async (answers) => {
          const f = await fetch(
            `${config.url}/api/listing/createAdvertisiment`,
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
              },
              method: "POST",
              body: JSON.stringify({
                description: answers.description,
                address: answers.address,
                cost: answers.cost,
              }),
            }
          );

          if (f.ok) {
            console.log(chalk.green("Advertisiment created successfully"));
            console.log(chalk.cyan("Id: ") + (await f.text()));
          } else {
            console.log(
              chalk.red(`Error: ${((await f.json()) as any).errors}`)
            );
          }

          mainMenu();
        });
    }
  });

program
  .command("getMyAdvertisiments")
  .description("Get my advertisiments")
  .action(async () => {
    if (login === "") {
      console.log(chalk.red("Login firstly"));
      mainMenu();
    } else {
      const ru = await fetch(`${config.url}/api/user/getUser?login=${login}`);

      if (!ru.ok) {
        console.log(chalk.red(`Error: ${((await ru.json()) as any).errors}`));
        mainMenu();
      }

      const user = (await ru.json()) as any;
      const f = await fetch(
        `${config.url}/api/listing/getUsersAdvertisiments?ownerId=${user.id}`
      );

      if (f.ok) {
        const ads = (await f.json()) as Array<any>;
        console.log(chalk.green("Success: "));
        for (const ad of ads) {
          console.log("--------------------------------------");
          console.log(chalk.cyan("id: ") + ad.id);
          console.log(chalk.cyan("description: ") + ad.description);
          console.log(chalk.cyan("cost: ") + ad.cost);
          console.log(chalk.cyan("address: ") + ad.address);
          console.log("--------------------------------------");
        }
      } else {
        console.log(chalk.red(`Error: ${((await f.json()) as any).errors}`));
      }

      mainMenu();
    }
  });

function mainMenu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "menuChoice",
        message: "Choose action",
        choices: [
          "login",
          "signup",
          "addAdvertisiment",
          "getMyAdvertisiments",
          "exit",
        ],
      },
    ])
    .then((answers) => {
      const { menuChoice } = answers;

      if (menuChoice === "exit") {
        console.log("exitting...");
        return;
      }

      program.parse(["", "", menuChoice]);
    });
}

mainMenu();
