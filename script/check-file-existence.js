const fs = require('fs');
const filePath = 'cypress/support/yll/new-accounts.js';

const checkFileExistence = () => {
	// check if file exists
	if (fs.existsSync(filePath)) {
		// delete file
		fs.unlinkSync(filePath);
		console.log('File deleted!✅');
	} else {
		console.log('File does not exist.👌🏻');
	}
};

checkFileExistence();
