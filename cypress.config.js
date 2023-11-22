const { defineConfig } = require('cypress');
const fs = require('fs');
const XLSX = require('xlsx');
const cypressSplit = require('cypress-split');

// Populate process.env with values from .env file
require('dotenv').config();

let blanketTimeout = 30000;

module.exports = defineConfig({
	projectId: process.env.PROJECT_ID,

	trashAssetsBeforeRuns: true,

	viewportWidth: 1366,
	viewportHeight: 768,
	watchForFileChanges: false,
	chromeWebSecurity: false,
	processVideoOnPassingTest: false,
	videoCompression: false,
	video: false,
	retries: {
		runMode: 3, // Configure retry attempts for `cypress run`
		openMode: 1, // Configure retry attempts for `cypress open`
	},

	//Timouts
	defaultCommandTimeout: blanketTimeout,
	execTimeout: blanketTimeout,
	taskTimeout: blanketTimeout,
	pageLoadTimeout: blanketTimeout,
	requestTimeout: blanketTimeout,
	responseTimeout: blanketTimeout,
	includeShadowDom: true,

	e2e: {
		excludeSpecPattern: '**/manual/**',
		testIsolation: false,
		env: {
			googleEmail: process.env.GOOGLE_EMAIL,
			googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN,
			googleClientId: process.env.GOOGLE_CLIENTID,
			googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
			apiLoginId: process.env.AUTHORIZE_DEV_API_LOGIN_ID,
			transactionKey: process.env.AUTHORIZE_DEV_TRANSACTION_KEY,
			appEmailSender: process.env.APP_EMAIL_SENDER,
			projectId: process.env.PROJECT_ID,
			devAppUrl: process.env.DEV_APP_URL,
			prodAppUrl: process.env.PROD_APP_URL,
			devMarketingSiteUrl: process.env.DEV_MARKETING_SITE_URL,
			devApiUrl: process.env.DEV_API_URL,
			lEmail: process.env.L_EMAIL,
			lPassword: process.env.L_PASSWORD,
			lWithCreditCardEmail: process.env.L_W_C_C_EMAIL,
			lWithCreditCardPassword: process.env.L_W_C_C_PASSWORD,
		},
		setupNodeEvents(on, config) {
			on('task', {
				parseXlsx({ filePath }) {
					return new Promise((resolve, reject) => {
						try {
							// Read the Excel file
							const workbook = XLSX.readFile(filePath);
							const arrOfTablesInJSON = [];

							// Get the first sheet name
							const sheetName = workbook.SheetNames;

							for (let index = 0; index < sheetName.length; index++) {
								// Get the sheet data as a JSON object and push in arr
								arrOfTablesInJSON.push(
									XLSX.utils.sheet_to_json(workbook.Sheets[sheetName[index]])
								);
							}

							resolve(arrOfTablesInJSON);
						} catch (e) {
							reject(e);
						}
					});
				},
				readFileMaybe(filename) {
					if (fs.existsSync(filename)) {
						return fs.readFileSync(filename, 'utf8');
					}

					return null;
				},
			});

			cypressSplit(on, config);

			return config;
		},
	},

	component: {
		devServer: {
			framework: 'create-react-app',
			bundler: 'webpack',
		},
	},
});
