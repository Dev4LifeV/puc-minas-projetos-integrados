require("dotenv").config();
const requiredVariables = [
  "NEXT_PUBLIC_API_KEY",
  "NEXT_PUBLIC_AUTH_DOMAIN",
  "NEXT_PUBLIC_PROJECT_ID",
  "NEXT_PUBLIC_STORAGE_BUCKET",
  "NEXT_PUBLIC_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_APP_ID",
  "NEXT_PUBLIC_MEASUREMENT_ID",
];

requiredVariables.forEach((variable) => {
  if (!process.env[variable]) {
    console.error(
      `Error: The ${variable} environment variable is empty or undefined`
    );
    process.exit(1); // Exit with an error code
  } else {
    console.info("All Variables are available");
  }
});
