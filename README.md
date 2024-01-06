## Your Land Loans - Automations

## Getting started

- Recommended `node js 16+` and `npm 6+`
- Install dependencies: `npm install` or `yarn install`
- Start the server: `npm run cypress:open`
- Add the .env file manually. This file contains sentive credentials and needs to be obtained securly. It should contain the following values:

```
GOOGLE_EMAIL = 'xxxxxx...'
GOOGLE_CLIENTID = 'xxxxxx...'
GOOGLE_CLIENT_SECRET = 'xxxxxx...' this is private and nees to be optianed from a team member or lastpass.
GOOGLE_REFRESH_TOKEN = 'xxxxxx...' member or lastpass.
AUTHORIZE_DEV_API_LOGIN_ID = 'xxxxxx...'
AUTHORIZE_DEV_TRANSACTION_KEY = 'xxxxxx...'

APP_EMAIL_SENDER = 'xxxxxx...'
PROJECT_ID = 'xxxxxx...'

DEV_APP_URL = 'xxxxxx...'
PROD_APP_URL = 'xxxxxx...'
DEV_MARKETING_SITE_URL = 'xxxxxx...'
DEV_API_URL = 'xxxxxx...'

CYPRESS_RECORD_KEY = 'xxxxxx...'
```

### Windows

If you get the error:

`yarn.ps1 cannot be loaded because running scripts is disabled on this system. For more information, see about_Execution_Policies`

run the following as an admin in powershell:
`Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine`

### VSCode

#### Run

To run in VSCode use the command `Run Cypress`.

`cypress:open` - for running with cypress panel
`cypress:run` - for running in the background
`cy:parallel` - is expermental for running locally (not stable and need power machine)

#### Record to Cypress.io

To record and save a run to to the cloud use `Record Cypress`. This will save and can be viewed here: https://dashboard.cypress.io/projects/ggicp7/runs

## License

Private

## Contact

Technical Contact: michaelkatic+yll@gmail.com
