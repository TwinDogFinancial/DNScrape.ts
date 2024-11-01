# DNSScrape

A CLI tool to scrape DNS records from a domain and save to a JSON file.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Installation

Follow these steps to set up the DNS Scraper CLI Tool on your local machine.

### Prerequisites

Ensure you have the following installed on your system:

- **[Node.js](https://nodejs.org/)** (v14 or later)
- **[npm](https://www.npmjs.com/)** (comes with Node.js)
- **[TypeScript](https://www.typescriptlang.org/)**

### Steps

1. **Clone the Repository**

   Clone the repository to your local machine using Git:

   ```bash
   git clone https://github.com/pstagner/your-repository-name.git
   ```

   Replace `your-repository-name` with the actual name of your repository.

2. **Navigate to the Project Directory**

   ```bash
   cd your-repository-name
   ```

3. **Install Dependencies**

   Install the required npm packages:

   ```bash
   npm install
   ```

   This command installs both dependencies and devDependencies listed in the `package.json` file, including TypeScript and Commander.

4. **Build the Project**

   Compile the TypeScript code to JavaScript:

   ```bash
   npm run build
   ```

   This command runs the `build` script defined in `package.json`, which uses the TypeScript compiler (`tsc`) to transpile the code. The compiled files will be located in the `dist/` directory as specified in the `tsconfig.json`.

5. **Run the Application**

   After building the project, you can run the DNS Scraper CLI Tool using:

   ```bash
   npm start -- --domain example.com --output dns-records.json
   ```

   **Parameters:**

   - `--domain` (or `-d`): The domain you want to query DNS records for.
   - `--output` (or `-o`): The path to the output JSON file where DNS records will be saved.

   **Example:**

   ```bash
   npm start -- --domain github.com --output github-dns.json
   ```

6. **Optional: Running in Development Mode**

   If you want to run the project without building every time you make changes, you can use a development tool like `ts-node`. First, install `ts-node` globally:

   ```bash
   npm install -g ts-node
   ```

   Then, run the TypeScript file directly:

   ```bash
   ts-node src/index.ts --domain example.com --output dns-records.json
   ```

### Additional Information

- **TypeScript Configuration**

  The `tsconfig.json` file is configured to compile TypeScript files from the `src/` directory into JavaScript files in the `dist/` directory with strict type checking enabled.

- **Scripts Overview**

  - `npm run build`: Compiles TypeScript to JavaScript.
  - `npm start`: Runs the compiled JavaScript application.
  - `npm test`: Placeholder for test scripts (currently not specified).

### Troubleshooting

- **Node.js and npm Versions**

  Ensure you are using compatible versions of Node.js and npm. You can check your installed versions with:

  ```bash
  node -v
  npm -v
  ```

- **Missing Dependencies**

  If you encounter issues related to missing packages, try reinstalling dependencies:

  ```bash
  npm install
  ```

- **TypeScript Errors**

  If TypeScript compilation fails, ensure your TypeScript code adheres to the configurations specified in `tsconfig.json`. You can also run the TypeScript compiler in watch mode for continuous feedback:

  ```bash
  npx tsc --watch
  ```

---

By following these steps, you should have the DNS Scraper CLI Tool up and running on your local machine. If you encounter any issues or have questions, feel free to reach out through the [Contact](#contact) section.

## Usage

Provide examples and instructions on how to use your project.

## Features

- Scrape AllDNS records from a domain
- Save to in JSON format
- Import to New DNS Provider

## Contributing

Guidelines for how other developers can contribute to your project.

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a Pull Request.

## License

Specify the license under which your project is distributed. For example:

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Provide your contact information for users to reach out.

- **Email**: paul@twindogfinancial.com
- **GitHub**: [StaxBentley](https://github.com/pstagner)
