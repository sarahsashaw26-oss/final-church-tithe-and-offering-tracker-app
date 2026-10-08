/*
 CHURCH TITHE AND OFFERING TRACKER

 Author: Nabukenya Sarah
 Course: Web and Mobile Application Development (JS Assignment 1)

 Description:
 This program helps a church treasurer record the tithes and offerings
 given during a service. The treasurer enters each giving (member name,
 type of giving and amount). When finished, the program prints a report
 showing totals per category, the grand total, the top giver, and a
 short summary for every entry.

 How to run:
 1. Open a terminal.
 2. Navigate to the folder containing this file.
 3. Run: node ACCESS_NUMBER.js   (use your real file name)

 How to use:
 1. Type the member's name when asked.
 2. Choose the type of giving (1-4).
 3. Type the amount in UGX (numbers only, e.g. 50000).
 4. Choose whether to add another entry (y/n).
 5. When you answer "n", the report is displayed.
*/

const readline = require("readline");

// Set up the terminal for reading user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// The categories of giving the treasurer can choose from
const CATEGORIES = ["Tithe", "Offering", "Thanksgiving", "Building Fund"];

// FUNCTION 1: asks a question and returns the answer (as a Promise)
function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

// FUNCTION 2: asks for one giving and returns it as an object.
// Uses loops to keep asking until the input is valid.
async function recordGiving() {
  // Name must not be empty
  let name = "";
  while (name === "") {
    name = (await ask("\nMember name: ")).trim();
    if (name === "") {
      console.log("Name cannot be empty. Please try again.");
    }
  }

  // Category must be a number from 1 to 4
  console.log("Type of giving:");
  for (let i = 0; i < CATEGORIES.length; i++) {
    console.log(`  ${i + 1}. ${CATEGORIES[i]}`);
  }
  let choice = 0;
  while (choice < 1 || choice > CATEGORIES.length) {
    choice = Number(await ask("Choose (1-4): "));
    if (!Number.isInteger(choice) || choice < 1 || choice > CATEGORIES.length) {
      console.log("Invalid choice. Enter a number from 1 to 4.");
      choice = 0;
    }
  }

  // Amount must be a positive number
  let amount = 0;
  while (amount <= 0) {
    amount = Number(await ask("Amount (UGX): "));
    if (isNaN(amount) || amount <= 0) {
      console.log("Amount must be a number greater than 0.");
      amount = 0;
    }
  }

  return { name: name, category: CATEGORIES[choice - 1], amount: amount };
}

// FUNCTION 3: adds up the amounts. If a category is given,
// only entries of that category are counted; otherwise all entries.
function calculateTotal(entries, category) {
  let total = 0;
  for (const entry of entries) {
    if (category === undefined || entry.category === category) {
      total += entry.amount;
    }
  }
  return total;
}

// FUNCTION 4: decides a thank-you message based on the amount given
function getAppreciation(amount) {
  if (amount >= 500000) {
    return "Generous giver, God bless you!";
  } else if (amount >= 100000) {
    return "Faithful giver, thank you!";
  } else if (amount >= 20000) {
    return "Thank you for giving!";
  } else {
    return "Every gift counts, thank you!";
  }
}

// FUNCTION 5: finds the entry with the highest amount
function findTopGiver(entries) {
  let top = entries[0];
  for (const entry of entries) {
    if (entry.amount > top.amount) {
      top = entry;
    }
  }
  return top;
}

// FUNCTION 6: prints the full report for the treasurer
function displayReport(entries) {
  console.log("        TITHE AND OFFERING REPORT");

  // If nothing was entered, there is nothing to report
  if (entries.length === 0) {
    console.log("No entries were recorded.");
    return;
  }

  // List every entry with its appreciation message
  console.log("\nEntries:");
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    console.log(
      `${i + 1}. ${e.name} - ${e.category}: UGX ${e.amount.toLocaleString()} (${getAppreciation(e.amount)})`
    );
  }

  // Totals per category
  console.log("\nTotals by category:");
  for (const category of CATEGORIES) {
    const total = calculateTotal(entries, category);
    console.log(`  ${category}: UGX ${total.toLocaleString()}`);
  }

  // Grand total and top giver
  const top = findTopGiver(entries);
  console.log("\n----------------------------------------------");
  console.log(`Grand total: UGX ${calculateTotal(entries).toLocaleString()}`);
  console.log(
    `Top giver: ${top.name} (UGX ${top.amount.toLocaleString()} - ${top.category})`
  );
}

// MAIN FUNCTION: controls the whole program
async function main() {
  console.log("   CHURCH TITHE AND OFFERING TRACKER");
  console.log("Enter each giving one by one. The report shows at the end.");

  const entries = [];
  let addMore = true;

  // Keep recording entries until the treasurer says no
  while (addMore) {
    const entry = await recordGiving();
    entries.push(entry);
    console.log(
      `Recorded: ${entry.name} - ${entry.category} - UGX ${entry.amount.toLocaleString()}`
    );
    console.log(getAppreciation(entry.amount));
    const answer = (await ask("\nAdd another entry? (y/n): ")).trim().toLowerCase();
    if (answer !== "y" && answer !== "yes") {
      addMore = false;
    }
  }

  displayReport(entries);
  rl.close();
}

main();
