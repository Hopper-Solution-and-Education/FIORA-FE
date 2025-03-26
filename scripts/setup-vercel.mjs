#!/usr/bin/env node

/**
 * This script helps set up a Vercel project with the necessary environment variables.
 * It uses the Vercel CLI to configure the project.
 *
 * Usage:
 * 1. Make sure you have the Vercel CLI installed: npm i -g vercel
 * 2. Run this script: npm run setup-vercel
 * 3. For CI/CD: npm run setup-vercel -- --ci
 *
 * The script will:
 * - Link your local project to a Vercel project
 * - Pull environment variables from .env.production.local
 * - Push them to Vercel
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create readline interface if not in CI mode
const isCIMode = process.argv.includes('--ci');
const rl = !isCIMode
  ? readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
  : null;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

console.log(`${colors.blue}Vercel Project Setup Script${colors.reset}`);
console.log(
  `${colors.yellow}This script will help you set up your Vercel project with environment variables.${colors.reset}\n`,
);

// Check if Vercel CLI is installed
try {
  execSync('vercel --version', { stdio: 'ignore' });
} catch (error) {
  console.error(`${colors.red}Error: Vercel CLI is not installed.${colors.reset}`);
  console.log(`Please install it with: npm i -g vercel`);
  process.exit(1);
}

// Check if .env.production.local exists
const envFilePath = path.join(process.cwd(), '.env.production.local');
if (!fs.existsSync(envFilePath)) {
  console.error(`${colors.red}Error: .env.production.local file not found.${colors.reset}`);
  console.log(`Please create this file with your production environment variables.`);
  process.exit(1);
}

// Function to run a command and return its output
function runCommand(command) {
  try {
    return execSync(command, { encoding: 'utf8' }).trim();
  } catch (error) {
    console.error(`${colors.red}Error executing command: ${command}${colors.reset}`);
    console.error(error.message);
    return null;
  }
}

// Main function
async function main() {
  // Check if project is already linked to Vercel
  console.log(`${colors.blue}Checking Vercel project link...${colors.reset}`);

  let isLinked = false;
  try {
    const vercelConfig = path.join(process.cwd(), '.vercel', 'project.json');
    isLinked = fs.existsSync(vercelConfig);
  } catch (error) {
    isLinked = false;
  }

  if (!isLinked) {
    console.log(`${colors.yellow}Project not linked to Vercel. Linking now...${colors.reset}`);
    console.log(`You'll be prompted to log in to Vercel if you're not already logged in.`);

    runCommand('vercel link');
  } else {
    console.log(`${colors.green}Project already linked to Vercel.${colors.reset}`);
  }

  // Pull environment variables from .env.production.local
  console.log(
    `\n${colors.blue}Reading environment variables from .env.production.local...${colors.reset}`,
  );
  const envContent = fs.readFileSync(envFilePath, 'utf8');
  const envVars = {};

  envContent.split('\n').forEach((line) => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();

        // Remove quotes if present
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.substring(1, value.length - 1);
        }

        envVars[key] = value;
      }
    }
  });

  console.log(
    `${colors.green}Found ${Object.keys(envVars).length} environment variables.${colors.reset}`,
  );

  // Handle environment variables based on mode
  if (isCIMode) {
    // In CI mode, automatically push all environment variables
    console.log(
      `\n${colors.blue}CI Mode: Automatically pushing environment variables to Vercel...${colors.reset}`,
    );

    for (const [key, value] of Object.entries(envVars)) {
      console.log(`Setting ${key}...`);
      runCommand(`vercel env add ${key} production --yes`);
    }

    console.log(
      `\n${colors.green}Environment variables have been pushed to Vercel.${colors.reset}`,
    );
    console.log(`\n${colors.blue}Setup complete!${colors.reset}`);
  } else {
    // In interactive mode, ask user if they want to push variables
    rl.question(
      `\n${colors.yellow}Do you want to push these environment variables to Vercel? (y/n) ${colors.reset}`,
      async (answer) => {
        if (answer.toLowerCase() === 'y') {
          console.log(`\n${colors.blue}Pushing environment variables to Vercel...${colors.reset}`);

          for (const [key, value] of Object.entries(envVars)) {
            console.log(`Setting ${key}...`);
            runCommand(`vercel env add ${key} production`);
          }

          console.log(
            `\n${colors.green}Environment variables have been pushed to Vercel.${colors.reset}`,
          );
          console.log(
            `\n${colors.yellow}Note: You may need to redeploy your project for the changes to take effect.${colors.reset}`,
          );
        } else {
          console.log(`\n${colors.yellow}Skipping environment variable push.${colors.reset}`);
        }

        console.log(`\n${colors.blue}Setup complete!${colors.reset}`);
        console.log(`You can now deploy your project to Vercel using GitHub Actions.`);
        console.log(`Make sure to add the following secrets to your GitHub repository:`);
        console.log(`  - VERCEL_TOKEN: Your Vercel token`);
        console.log(`  - VERCEL_ORG_ID: Your Vercel Organization ID`);
        console.log(`  - VERCEL_PROJECT_ID: Your Vercel Project ID`);

        rl.close();
      },
    );
  }
}

main().catch((error) => {
  console.error(`${colors.red}Error:${colors.reset}`, error);
  process.exit(1);
});
