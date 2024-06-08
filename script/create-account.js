const fs = require('fs');

const createAccount = () => {
	const accountFor = process.argv[2];
	const dateNow = Date.now();
	const googleEmail = 'yourlandloans@gmail.com';

	const account = {
		email: googleEmail.replace('@', `+${accountFor}_${dateNow}@`),
		password: 'Qwertyuiop123455$',
	};

	fs.appendFileSync(
		`cypress/support/yll/new-accounts.js`,
		`export const ${accountFor} = ${JSON.stringify(account)};\n`
	);

	return account;
};

createAccount();
