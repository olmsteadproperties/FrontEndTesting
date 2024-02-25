# **Cypress Test Documentation**

# Table of Contents

1. [BEFORE the tests](#before-the-tests)
1. [AFTER each the tests](#after-each-the-tests)
1. [Delete All Loans](#delete-all-loans)

### Borrower

1. [Add and Remove Borrower](#add-and-remove-borrower)
1. [Add Bank Account For Borrower](#add-bank-account-for-borrower)
1. [Add Borrower Assist](#add-borrower-assist)
1. [Borrower Sessions](#borrower-sessions)
1. [Creation Of Scheduled Payments](#creation-of-scheduled-payments)
1. [Credit Card Account](#credit-card-account-borrower)
1. [Edit Borrower In Loan Details](#edit-borrower-in-loan-details)
1. [Edit Profile (Borrower)](#edit-profile-borrower)
1. [First Login (Borrower)](#first-login-borrower)
1. [Forgot Password (Borrower)](#forget-password-borrower)
1. [Resend Invite (Borrower)](#resend-invite-borrower)
1. [Signup Pay Flow IAV](#signup-pay-flow-iav)
1. [Signup Pay Flow](#signup-pay-flow)
1. [Verify Loan Status](#verify-loan-status)

### Dwolla

1. [Signup Dwolla Change Of Statuses](#signup-dwolla-change-of-statuses)
1. [Signup Dwolla with Corporation](#signup-dwolla-corporation)
1. [Signup Dwolla Has Individual](#signup-dwolla-has-individual.cy.js)
1. [Signup Dwolla with LLC](#signup-dwolla-llc)
1. [Signup Dwolla with Partnership](#signup-dwolla-Partnership)
1. [Signup Dwolla with Sole Proprietorship](#signup-dwolla-sole-proprietorship)

### Lender

1. [Add And Remove All Roles](#add-and-remove-all-roles)
1. [Add Different Banks](#add-different-banks)
1. [Add Loan With Ballon Payment](#add-loan-with-ballon-payment)
1. [Add Payment Sharing Summary](#add-payment-sharing-summary)
1. [Add Second Bank Account](#add-second-bank-account)
1. [Check Accessability Plan Levels](#check-accessability-plan-levels)
1. [Check Accessibility Of Loan Statuses](#check-accessibility-of-loan-statuses)
1. [Create Many Loan Types](#create-many-loan-types)
1. [Credit Card Account](#credit-card-account)
1. [Down Payments](#down-payments)
1. [Duplicate Existing Loan](#duplicate-existing-loan)
1. [Edit Profile Lender](#edit-profile-Lender)
1. [Email History Working](#email-history-working)
1. [Feature Voting](#feature-voting)
1. [First Login (Lender)](#first-login-Lender)
1. [Forgot Password (Lender)](#forget-password)
1. [Manage Download](#manage-download)
1. [Manage Fees](#manage-fees)
1. [Manual Payment](#manual-payment)
1. [Marketing Site Links](#marketing-site-links)
1. [Multiple Payments](#multiple-payments)
1. [Record Payment Lender](#record-payment-Lender)
1. [Required Payment Override (Lender)](#required-payment-override)
1. [Save Loan As Draft](#save-loan-as-draft)
1. [Signup](#signup)
1. [Upgrading Lenders Payment Plans](#upgrading-Lenders-payment-plans)
1. [Upload Document For Loan](#upload-document-for-loan)

### Partner

1. [Add And Remove (Partner)](#add-and-remove-Partner)
1. [Edit Profile (Partner)](#edit-profile-Partner)
1. [First Login (Partner)](#first-login-Partner)
1. [Forgot Password (Partner)](#forget-password-Partner)
1. [Resend Invite (Partner)](#resend-invite-Partner)

### Team Member

1. [Add And Remove (Team Member)](#add-and-remove-team-member)
1. [Check Accessibility Of Loan Statuses (Team Member)](#check-accessibility-of-loan-statuses-team-member)
1. [Create Many Loan Types (Team Member)](#create-many-loan-types-team-member)
1. [Duplicate Existing Loan (Team Member)](#duplicate-existing-loan-team-member)
1. [Edit Profile (Team Member)](#edit-profile-team-member)
1. [First Login (Team Member)](#first-login-team-member)
1. [Forgot Password (Team Member)](#forget-password-team-member)
1. [Manage Download (Team Member)](#manage-download-team-member)
1. [Manage Fees (Team Member)](#manage-fees-team-member)
1. [Multiple Payments (Team Member)](#multiple-payments-team-member)
1. [Record Payment (Team Member)](#record-payment-team-member)

---

### BEFORE the tests

**_File:_** cypress/support/yll/createNewLoanutil.js (`clearAllLocalData()`)

**_Description:_** Cleaning up all caching data

**_Steps:_**

1. Clear all cookies
1. Clear all local storage
1. Clear all session storage
1. Clear last logged in user

---

### AFTER each the tests

**_File:_** cypress/support/yll/util.js (`stopOnFirstFailure()`)

**_Description:_** Checking prev the test on fail

**_Steps:_**

1. Check `currentTest.state` on status `"failed"`
1. Check `currentTest.currentRetry()` on count of retrys

---

### Delete All Loans

**_File:_** e2e/manual/delete-all-loans.cy.js

**_Description:_** Deleting all the loans that the Lender has, by the manual request

**_Steps:_**

1. Login and get all loans
1. Deleting by `request` all loans in the loop
1. Check the `length` loans list (must be 0)

---

# BORROWER

---

### Add and Remove Borrower

**_File:_** e2e/trigger/borrower/add-and-remove-borrower.cy.js

**_Description:_** Adding `Borrower` to `loan` and remove it.

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Creates a `new loan`
1. Creates and add a new `Borrower `account
1. Accepts email invite sent to `Borrower` email
1. Check `Borrower` in loan
1. Remove `Borrower` from loan
1. Delete loans

---

### Add Bank Account For Borrower

**_File:_** e2e/trigger/borrower/add-bank-account-for-borrower.cy.js

**_Description:_** Adding bank-account for `Borrower`.

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for `Lenders` (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Change `plan level` to the `highest`
1. Creates a `new loan`
1. Creates and add a new `Borrower `account
1. Accepts email invite sent to `Borrower` email
1. Signup `Dwolla` for `Borrower` (`LLC`, `verified`)
1. Add `bank` for `Borrower`
1. Check payment method
1. Delete loans

---

### Add Borrower Assist

**_File:_** e2e/trigger/borrower/add-borrower-assist.cy.js

**_Description:_** Add Borrower Assist

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for `Lenders` (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Add `Borrower Assist` for `Lender`
1. Click `Approve` and check `Approved` status
1. Click `Reject` and check `Rejected` status
1. Delete all loans

---

### Borrower Sessions

**_File:_** e2e/trigger/borrower/borrower-sessions.cy.js

**_Description:_** Borrower Sessions

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for `Lenders` (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Change `plan level` to the `highest`
1. Creates a `new loan`
1. Creates and add a new `Borrower `account
1. Accepts email invite sent to `Borrower` email
1. Check `Borrower Sessions` by email with `4` borrower sessions
1. Check `Borrower Sessions` search input with `4` borrower sessions
1. Delete all loans

---

### Creation Of Scheduled Payments

**_File:_** e2e/trigger/borrower/creation-of-scheduled-payments.cy.js

**_Description:_** Creating of scheduled payments `Recurring`
and `One Time`

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for `Lenders` (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Creates a `new loan`
1. Creates and add a new `Borrower `account
1. Accepts email invite sent to `Borrower` email
1. Signup `Dwolla` for `Borrower` (`LLC`, `verified`)
1. Sets up `Borrower` payment account with `IAV`
1. Makes a static `payment` on the new `loan`
1. Makes `One Time` schedule Payment
1. Compare `One Time` Schedule Payment
1. Makes `Recurring` schedule Payment
1. Compare `Recurring` Schedule Payment
1. Edite `Recurring` Schedule Payment
1. Compare `Recurring` Schedule Payment
1. Delete loans

---

### Credit Card Account (Borrower)

**_File:_** e2e/trigger/borrower/credit-card-account-borrower.cy.js

**_Description:_** Add Credit Card Account (Borrower)

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Sets up `Credit Card Account` payment account for `Lender`
1. Creates a `new loan`
1. Creates and add a new `Borrower `account
1. Accepts email invite sent to `Borrower` email
1. Signup `Dwolla` for `Borrower` (`LLC`, `verified`)
1. Sets up `Credit Card Account` payment account for `Borrower`
1. Delete loans

---

### Edit Borrower In Loan Details (Borrower)

**_File:_** e2e/trigger/borrower/edit-borrower-in-loan-details.cy.js

**_Description:_** Edit Borrower data in the loan Borrower Details

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for `Lenders` (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Creates a `new loan`
1. Creates and add a new `Borrower `account
1. Accepts email invite sent to `Borrower` email
1. Edite `Borrower` profile data
1. Check `Borrower` in loan
1. Delete loans

---

### Edit Profile (Borrower)

**_File:_** e2e/trigger/borrower/edit-profile-borrower.cy.js

**_Description:_** Edit Borrower data on the profile page

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for `Lenders` (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Creates a `new loan`
1. Creates and add a new `Borrower `account
1. Accepts email invite sent to `Borrower` email
1. Edite `Borrower` profile data
1. Check `Borrower` after edite
1. Delete loans

---

### First Login (Borrower)

**_File:_** e2e/trigger/borrower/first-login-borrower.cy.js

**_Description:_** Test button `First Login` for first login of user

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for `Lenders` (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Creates a `new loan`
1. Creates and add a new `Borrower `account
1. Check `First Login` with `4` clicks
1. Accepts email invite sent to `Borrower` email and check for `5` messages
1. Delete loans

---

### Forgot Password (Borrower)

**_File:_** e2e/trigger/borrower/forget-password-borrower.cy.js

**_Description:_** Testing button `Forgot Password` for Borrower

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for `Lenders` (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Creates a `new loan`
1. Creates and add a new `Borrower `account
1. Accepts email invite sent to `Borrower` email
1. `Forgot` your `password`, get code, and generate a new password
1. Delete loans

---

### Resend Invite (Borrower)

**_File:_** e2e/trigger/borrower/resend-invite-borrower.cy.js

**_Description:_** Testing button `Resend Invite` for Borrower in the loan popup

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Change `plan level` in turn to the `highest`
1. Creates a `new loan`
1. Creates and add a new `Borrower `account
1. Open loan with current `Borrower` and click on button `Resend Invite`
1. Accepts email invite sent to `Borrower` email `and` check count messages must be 2
1. Remove `Borrower` from loan
1. Delete loans

---

### Signup Pay Flow IAV

**_File:_** e2e/trigger/borrower/signup-pay-flow-iav.cy.js

**_Description:_** Delteting and add payment account for the Lender. Borrower signup flow IAV (Instant Account Verification) taking a new user from email invite all the way through creating their => first payment. With subsequent removal of loan.

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for `Lenders` (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Creates a `new loan`
1. Creates and add a new `Borrower` account
1. Accepts email invite sent to `Borrower` email
1. Signup `Dwolla` for `Borrower` (`LLC`, `verified`)
1. Sets up `Borrower` payment account
1. Makes a static `payment` on the new `loan`
1. Delete payment method from Lender
1. Delete loans

---

### Sign Up Pay Flow

**_File:_** e2e/trigger/borrower/signup-pay-flow.cy.js

**_Description:_** Borrower signup flow taking a new user from email invite all the way through creating their => first payment.

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Verifies `Lender` payments account using the deposit method
1. Creates a `new loan`
1. Creates and add a new `Borrower `account
1. Accepts email invite sent to `Borrower` email
1. Sets up `Borrower` payment account with `Dwolla`
1. Verifies `Borrower` payments account using the deposit method
1. Makes a static `payment` on the new `loan`
1. Cancel for borrower `ACH` payment with amount `500`
1. Delete loans

---

### Verify Loan Status

**_File:_** e2e/trigger/borrower/verify-loan-status.cy.js

**_Description:_** Checking correct `Loan Status` with different date

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Change `plan level` to the `highest`
1. Create array of mock accounts loan and appy to each account(Default, Grace period, Late):

   - Creates a `new loan`
   - Creates and add a new `Borrower `account
   - Accepts email invite sent to `Borrower` email
   - Review loan details (save loan balace and payment due)
   - Signup `Dwolla` for Lenders (`LLC`, `verified`)
   - Sets up `Borrower` payment account
   - Makes a static `payment` on the new `loan`
   - Review loan details (check loan balace)

1. Delete loans

---

# DWOLLA

---

### Signup Dwolla Change Of Statuses

**_File:_** e2e/trigger/dwolla/signup-dwolla-change-of-statuses.cy.js

**_Description:_** Signup Dwolla change of statuses (`verified`, `suspended`, `document`, `retry`)

**_Steps:_**

1. Preparing an array of emails statuses and Lender data
1. Changing the array of emails
1. Signup a new Lenders
1. Accepts email invites sent to Lender's email
1. Signup `Dwolla` for Lenders with the status:
   - `verified`
   - `suspended`
   - `document`
   - `retry`

---

### Signup Dwolla with Corporation

**_File:_** e2e/trigger/dwolla/signup-dwolla-corporation.cy.js

**_Description:_** Signup Dwolla with `Corporation`

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`Corporation`, `verified`)

---

### Signup Dwolla Has Individual

**_File:_** e2e/trigger/dwolla/signup-dwolla-has-individual.cy.js

**_Description:_** Signup Dwolla where `has at least one individual who owns 25% or more of the business.`

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders with `isHasIndividual`

---

### Signup Dwolla with LLC

**_File:_** e2e/trigger/dwolla/signup-dwolla-llc.cy.js

**_Description:_** Signup Dwolla with `LLC`

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)

---

### Signup Dwolla with Partnership

**_File:_** e2e/trigger/dwolla/signup-dwolla-Partnership.cy.js

**_Description:_** Signup Dwolla with `Partnership`

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`Partnership`, `verified`)

---

### Signup Dwolla with Sole Proprietorship

**_File:_** e2e/trigger/dwolla/signup-dwolla-sole-proprietorship.cy.js

**_Description:_** Signup Dwolla with `Sole Proprietorship`

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`Sole Proprietorship`, `verified`)

---

# LENDER

---

### Add And Remove All Roles

**_File:_** e2e/trigger/lender/add-and-remove-all-roles.cy.js

**_Description:_** Adding and remove all users to 1 loan and remove them

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV` and `TD Bank`:
1. Change `plan level` to the `highest`
1. Creates a `new loan`
1. Creates and add a new `Borrower `account
1. Accepts email invite sent to `Borrower` email
1. Add `Partner`
1. Accepts email invite sent to `Partner` email
1. Add `Team Member`
1. Accepts email invite sent to `Team Member` email
1. Remove `Borrower` from loan
1. Remove `Partner` from loan
1. Delete `Team Member`
1. Delete loans

---

### Add Different Banks

**_File:_** e2e/trigger/lender/add-different-banks.cy.js

**_Description:_** Add and remove different banks accounts

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`:
   - add`Regions Bank` and remove it
   - add`TD Bank` and remove it
   - add`Navy Federal Credit Union` and remove it
   - add`Citizens Bank` and remove it
   - add`Huntington Bank` and remove it
   - add`Wealthfront` and remove it
   - add`Betterment` and remove it

---

### Add Loan With Ballon Payment

**_File:_** e2e/trigger/lender/add-loan-with-ballon-payment.cy.js

**_Description:_** Add (edit and delete) loan with ballon payment

**_Steps:_**

1. Preparing `input data`
1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Create new `new loan` with `ballon payment`
1. Edit `ballon payment field` on `new loan`
1. Check Fields on the `Loan Page`
1. Delete `ballon payment` field
1. Delete `new loan`

---

### Add Second Bank Account

**_File:_** e2e/trigger/lender/add-second-bank-account.cy.js

**_Description:_** Add second bank account

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`:
   - add `TD BANK`
1. Add second bank account `Navy Federal Credit Union`
1. Remove all bank account

---

### Add Payment Sharing Summary

**_File:_** e2e/trigger/lender/add-payment-sharing-summary.cy.js

**_Description:_** Add Payment Sharing Summary

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV` and `TD Bank`:
1. Change `plan level` to the `highest`
1. Creates a `new loan`
1. Add `Partner`
1. Accepts email invite sent to `Partner` email
1. Add `Team Member`
1. Accepts email invite sent to `Team Member` email
1. Add `Payment Sharing Summary` and `Add First Position` with `amountPercentage: 10`, `firstPositionAmount: 40`(for `Partner`, and `TeamMember`)
1. Check `Payment Sharing Summary` and `Add First Position` (for `Partner`, and `TeamMember`)
1. Update `Payment Sharing Summary` and `Add First Position` with `amountPercentage: 21`, `firstPositionAmount: 51` (for `Partner`, and `TeamMember`)
1. Check `Payment Sharing Summary` and `Add First Position` (for `Partner`, and `TeamMember`)
1. Remove `Payment Sharing Summary` and `Add First Position` (for `Partner`, and `TeamMember`)
1. Remove `Partner` from loan
1. Delete `Team Member`
1. Delete loans

---

### Check Accessability Plan Levels

**_File:_** e2e/trigger/lender/check-accessability-plan-levels.cy.js

**_Description:_** Checking limits of plan-levels

**_Steps:_**

1. Preparing an array of data
1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`:
1. Create `2` a `new loan`
1. Trying to add a new `Team Member`account
1. Trying to add a new `Partner`account
1. Change plan level to `Starter`
1. Create `5` a `new loan`
1. Trying to add a new `Team Member`account
1. Trying to add a new `Partner`account
1. Change plan level to `Getting Serious`
1. Create `11` a `new loan`
1. Add a new `Team Member`account
1. Add a new `Partner`account
1. Change plan level to `Full Tilt`
1. Create `3` a `new loan`
1. Add a new `Team Member`account
1. Add a new `Partner`account
1. Delete all `Team Members`
1. Remove all `Partners` from loan
1. Delete loans

---

### Check Accessibility Of Loan Statuses (Lender)

**_File:_** e2e/trigger/lender/check-accessibility-of-loan-statuses.cy.js

**_Description:_** Changing `Loan Statuses`, editing different fees (if possible) and checking `accessibility`

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Change `plan level` to the `highest`
1. Creates a `new loan`
   - edit `Payments`(edited)
   - edit `Interest`(edited)
   - edit `Miscellaneous`(edited)
   - edit `Late Fees`(edited)
   - edit `Transactional Fees`(edited)
   - edit `Monthly Fees`(edited)
   - checking `Make a payment` should `not` be disabled
   - checking `Add Borrower` should `not` be disabled
   - checking `Add Partner` should `not` be disabled
   - checking `Add Doc` should `not` be disabled
   - checking `Add One Time Fee` should `not` be disabled
   - checking `Remove One Time Fee` should `not` be disabled
   - checking `Add Late Fee` should `not` be disabled
   - checking `Remove Late Fee` should `not` be disabled
   - checking `Edit Loan` should `not` be disabled
   - checking `Download Loan Data` should `not` be disabled
   - checking `Payment History` should `can` edit `Due Date`
1. Changing Loan Status from `Active` to `Frozen`
   - edit `Payments`(disabled for edit)
   - edit `Interest`(disabled for edit)
   - edit `Miscellaneous`(disabled for edit)
   - edit `Late Fees`(disabled for edit)
   - edit `Transactional Fees`(disabled for edit)
   - edit `Monthly Fees`(disabled for edit)
   - checking `Make a payment` should be disabled
   - checking `Add Borrower` should be disabled
   - checking `Add Partner` should be disabled
   - checking `Add Doc` should be disabled
   - checking `Add One Time Fee` should be disabled
   - checking `Remove One Time Fee` should be disabled
   - checking `Add Late Fee` should be disabled
   - checking `Remove Late Fee` should be disabled
   - checking `Edit Loan` should `not` be disabled
   - checking `Download Loan Data` should be disabled
   - checking `Payment History` should `can't` edit `Due Date`
1. Changing Loan Status from `Frozen` to `PaidOff`
   - edit `Payments`(disabled for edit)
   - edit `Interest`(disabled for edit)
   - edit `Miscellaneous`(disabled for edit)
   - edit `Late Fees`(disabled for edit)
   - edit `Transactional Fees`(disabled for edit)
   - edit `Monthly Fees`(can be edite)
   - checking `Make a payment` should `not` be disabled
   - checking `Add Borrower` should `not` be disabled
   - checking `Add Partner` should `not` be disabled
   - checking `Add Doc` should `not` be disabled
   - checking `Add One Time Fee` should `not` be disabled
   - checking `Remove One Time Fee` should `not` be disabled
   - checking `Add Late Fee` should `not` be disabled
   - checking `Remove Late Fee` should `not` be disabled
   - checking `Edit Loan` should `not` be disabled
   - checking `Download Loan Data` should `not` be disabled
   - checking `Payment History` should `can` edit `Due Date`
1. Changing Loan Status from `PaidOff` to `Cancelled`
   - edit `Payments`(disabled for edit)
   - edit `Interest`(disabled for edit)
   - edit `Miscellaneous`(disabled for edit)
   - edit `Late Fees`(disabled for edit)
   - edit `Transactional Fees`(disabled for edit)
   - edit `Monthly Fees`(disabled for edit)
   - checking `Add Borrower` should be disabled
   - checking `Add Partner` should be disabled
   - checking `Add Doc` should be disabled
   - checking `Add One Time Fee` should be disabled
   - checking `Remove One Time Fee` should be disabled
   - checking `Add Late Fee` should be disabled
   - checking `Remove Late Fee` should be disabled
   - checking `Edit Loan` should `not` be disabled
   - checking `Download Loan Data` should be disabled
   - checking `Payment History` should `can't`edit `Due Date`
1. Changing Loan Status from `Cancelled` to `Foreclosed`
   - edit `Payments`(disabled for edit)
   - edit `Interest`(disabled for edit)
   - edit `Miscellaneous`(disabled for edit)
   - edit `Late Fees`(disabled for edit)
   - edit `Transactional Fees`(disabled for edit)
   - edit `Monthly Fees`(disabled for edit)
   - checking `Add Borrower` should be disabled
   - checking `Add Partner` should be disabled
   - checking `Add Doc` should be disabled
   - checking `Add One Time Fee` should be disabled
   - checking `Remove One Time Fee` should be disabled
   - checking `Add Late Fee` should be disabled
   - checking `Remove Late Fee` should be disabled
   - checking `Edit Loan` should `not` be disabled
   - checking `Download Loan Data` should be disabled
   - checking `Payment History` should `can't`edit `Due Date`
1. Changing Loan Status from `Foreclosed` to `Closed`
   - edit `Payments`(disabled for edit)
   - edit `Interest`(disabled for edit)
   - edit `Miscellaneous`(disabled for edit)
   - edit `Late Fees`(disabled for edit)
   - edit `Transactional Fees`(disabled for edit)
   - edit `Monthly Fees`(disabled for edit)
   - checking `Add Borrower` should be disabled
   - checking `Add Partner` should be disabled
   - checking `Add Doc` should be disabled
   - checking `Add One Time Fee` should be disabled
   - checking `Remove One Time Fee` should be disabled
   - checking `Add Late Fee` should be disabled
   - checking `Remove Late Fee` should be disabled
   - checking `Edit Loan` should `not` be disabled
   - checking `Download Loan Data` should be disabled
   - checking `Payment History` should `can't`edit `Due Date`
1. Changing Loan Status from `Closed` to `Active`
1. Changing сhanges
1. Delete loans

---

### Create Many Loan Types

**_File:_** e2e/trigger/lender/create-many-loan-types.cy.js

**_Description:_** Creating many loan different types

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Change `plan level` to the `highest`
1. Creates loan with fees
1. Creates loan with percent fees
1. Creates loan with alt interest method
1. Creates loan with old dates
1. Delete loans

---

### Credit Card Account

**_File:_** e2e/trigger/lender/credit-card-account.cy.js

**_Description:_** Add Credit Card Account

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Sets up `Credit Card Account` payment account for `Lender`

---

### Down Payments

**_File:_** e2e/trigger/lender/down-payments.cy.js

**_Description:_** Down Payments

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Change `plan level` to the `highest`
1. Sets up `Credit Card Account` payment account for `Lender`
1. `Down Payments` for `Lender`
1. Check `Down Payments` link from clipboard

---

### Duplicate Existing Loan (Lender)

**_File:_** e2e/trigger/lender/duplicate-existing-loan.cy.js

**_Description:_** Testing Duplicate loan

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Change `plan level` to the `highest`
1. Creates a `new loan`
1. Duplicate Existing Loan and check them
1. Delete loans

---

### Edit Profile Lender

**_File:_** e2e/trigger/lender/edit-profile-lender.cy.js

**_Description:_** Edit Profile Lender data

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Edite `Lender` profile data
1. Check `Lender` after edite

---

### Email History Working

**_File:_** e2e/trigger/lender/email-history-working.cy.js

**_Description:_** Checking `Email History` in the loan

**_Steps:_**

1. Preparing data and date
1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Change `plan level` to the `highest`
1. Creates a `new loan`
1. Add `Partner`
1. Accepts email invite sent to `Partner` email
1. Creates and add a new `Borrower `account
1. Accepts email invite sent to `Borrower` email
1. Signup `Dwolla` for `Borrower` (`LLC`, `verified`)
1. Sets up `Borrower` payment account with `IAV`
1. Makes a static `payment` on the new `loan`
1. Duplicate Existing Loan and check them
1. Adds a `Borrower` account to duplicated loan
1. Adds a `Partner` account to duplicated loan
1. Makes `One Time` schedule Payment
1. Makes `Recurring` schedule Payment
1. Delete payment method from `Borrower`
1. Checking messages for `Lender` in the `original` loan by:
   - `Loan Payment Successfully submitted`
1. Checking messages for `Borrower` in the `original` loan by:
   - `Recurring Payments starting on ${dateAsWeNeedFor_Recurring}`
   - `One Time Payment Scheduled for ${dateAsWeNeedFor_OneTime}`
   - `Loan Payment Successfully Submitted`
   - `Welcome to Your Land Loans!`
   - `Payment Method Removed`
1. Checking messages for `Borrower` in the `duplicate` loan by:
   - `Your Account has a new Loan!`
1. Checking messages for `Partner` in the `original` loan by:
   - `Welcome to Your Land Loans!`
1. Checking messages for `Partner` in the `duplicate` loan by:
   - `Your Account has a new Loan!`
1. Remove `Partner` from `original` loan
1. Remove `Partner` from `duplicate` loan
1. Delete loans

---

### Feature Voting

**_File:_** e2e/trigger/lender/feature-voting.cy.js

**_Description:_** Checking `Feature Voting` for `Lender`, and `Team Member`

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email

1. Check `Feature Voting` for `Lender`:
   - navigate to `Feature Voting` page
   - create new `test` feature
   - like `all` features
   - dislike almost `all` features (all -3)
   - submit voting
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Sets up `Lender` payment account with `TD Bank`
1. Change `plan level` to the `highest`
1. Creates a `new loan`
1. Add `Team Member`
1. Accepts email invite sent to `Team Member` email
1. Check `Feature Voting` for `Team Member`:
   - navigate to `Feature Voting` page
   - create new `test` feature
   - like `all` features
   - dislike almost `all` features (all -3)
   - submit voting
1. Delete `Team Member`
1. Delete loans

---

### First Login (Lender)

**_File:_** e2e/trigger/lender/first-login-lender.cy.js

**_Description:_** Test button `First Login` for first login of user

**_Steps:_**

1. Signup a new Lender
1. Check `First Login` with `6` clicks
1. Accepts email invite sent to `Lender` email and check for `7` messages

---

### Forgot Password (Lender)

**_File:_** e2e/trigger/lender/forget-password.cy.js

**_Description:_** Testing button `Forgot Password` for Lender

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. `Forgot` your `password`, get code, and generate a new password

---

### Manage Download

**_File:_** e2e/trigger/lender/manage-download.cy.js

**_Description:_** Download `xlsx`, parse to `JSON`, comparing the data

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Change `plan level` to the `highest`
1. Creates a `new loans` (2)
1. Download `One Loan Data`
1. Parse from `xlsx` to `JSON`
1. Formatting data and comparing `JSON` with loan data on the page
1. Download `All Loan Data For Lender`
1. Parse from `xlsx` to `JSON`
1. Formatting data and comparing `JSON` with `each` loan data on the page
1. Delete loans

---

### Manage Fees

**_File:_** e2e/trigger/lender/manage-fees.cy.js

**_Description:_** Adding different fees and removed them

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Change `plan level` to the `highest`
1. Creates a `new loan`
1. Creates `One Time Fee` to loan
1. Remove `One Time Fee`
1. Creates `Late Fee` to loan
1. Remove `Late Fee`
1. Delete loans

---

### Manual Payment

**_File:_** e2e/trigger/lender/manual-payment.cy.js

**_Description:_** Doing manual payment

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Change `plan level` to the `highest`
1. Creates a `new loan`
1. Make manual payment
1. Delete loans

---

### Marketing Site Links

**_File:_** e2e/trigger/lender/marketing-site-links.cy.js

**_Description:_** Checking all links

**_Steps:_**

1. Find all links on `marketingPaths.base` page
1. Do the `request` on each
1. Check the status `response` of each link

---

### Multiple Payments

**_File:_** e2e/trigger/lender/multiple-payments.cy.js

**_Description:_** Doing multiple payments

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Change `plan level` to the `highest`
1. Creates a `new loan`
1. Make multiple payments (Amount per month: `1000$`, `50` payments with late fee of `$10` on one month)
1. Delete loans

---

### Record Payment Lender

**_File:_** e2e/trigger/lender/record-payment-lender.cy.js

**_Description:_** Record payment for Lender

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Change `plan level` to the `highest`
1. Creates a `new loan`
1. Create record payment
1. Update record payment
1. Update `Due Date` in the Loan
1. Delete record payment
1. Delete loans

---

### Required Payment Override (Lender)

**_File:_** e2e/trigger/lender/required-payment-override.cy.js

**_Description:_** Required Payment Override

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Change `plan level` to the `highest`
1. Creates a `new loan`
1. Test `Required Payment Override`
1. Delete loans

---

### Save Loan As Draft (Borrower)

**_File:_** e2e/trigger/borrower/save-loan-as-draft.cy.js

**_Description:_** Saving the loan as draft and check

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Change `plan level` to the `highest`
1. Creates a `new loan` with `Draft`
1. Refresh loan calculations
1. Changing Loan Status from `Draft` to `Active`
1. Delete loans

---

### Signup

**_File:_** e2e/trigger/lender/signup.cy.js

**_Description:_** Signup a new Lender

**_Steps:_**

1. Check validation form adding Lender
1. Signup a new Lender
1. Accepts email invite sent to `Lender` email

---

### Upgrading Lenders Payment Plans

**_File:_** e2e/trigger/lender/upgrading-Lenders-payment-plans.cy.js

**_Description:_** Update payment plans of creditors in turn to the highest and one level back

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Change `plan level` in turn to the `highest` and one level back

---

### Upload Document For Loan

**_File:_** e2e/trigger/lender/upload-document-for-loan.cy.js

**_Description:_** Uploading document for loan

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Creates a `new loan`
1. Upload documens for Loan
   - Should upload file `test-document-upload-fail.png`
   - Should upload file `test-document-upload-success.png`
   - Should upload file `test-document-upload-success_3.png`
   - Should upload file `test-document-upload-success_4.png`
   - Should upload file `test-document-upload-success_5.png`
   - Should be disabled button `Add Document` (because 5/5 docs)
   - Should check Download `test-document-upload-fail.png`
   - Should check Remove `test-document-upload-success.png`
   - Should check Remove `test-document-upload-success_3.png`
   - Should check Remove `test-document-upload-success_4.png`
   - Should check Remove `test-document-upload-success_5.png`
1. Delete loans

---

# Partner

---

### Add And Remove Partner

**_File:_** e2e/trigger/partner/add-and-remove-partner.cy.js

**_Description:_** Adding `Partner` and remove it from loan

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Change `plan level` in turn to the `highest`
1. Creates a `new loan`
1. Add `Partner`
1. Accepts email invite sent to `Partner` email
1. Check `Partner` in loan
1. Remove `Partner` from loan
1. Delete loans

---

### Edit Profile (Partner)

**_File:_** e2e/trigger/partner/edit-profile-partner.cy.js

**_Description:_** Edit profile of Partner data

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Change `plan level` in turn to the `highest`
1. Creates a `new loan`
1. Add `Partner`
1. Accepts email invite sent to `Partner` email
1. Edite profile (only Full Name)
1. Check profile after edite (only Full Name)
1. Remove `Partner` from loan
1. Delete loans

---

### First Login (Partner)

**_File:_** e2e/trigger/partner/first-login-partner.cy.js

**_Description:_** Test button `First Login` for first login of user

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Change `plan level` in turn to the `highest`
1. Creates a `new loan`
1. Add `Partner`
1. Check `First Login` with `3` clicks
1. Accepts email invite sent to `Partner` email and check for `4` messages
1. Remove `Partner` from loan
1. Delete loans

---

### Forgot Password (Partner)

**_File:_** e2e/trigger/partner/forget-password-partner.cy.js

**_Description:_** Testing button `Forgot Password` for Partner

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Change `plan level` in turn to the `highest`
1. Creates a `new loan`
1. Add `Partner`
1. Accepts email invite sent to `Partner` email
1. `Forgot` your `password`, get code, and generate a new password
1. Remove `Partner` from loan
1. Delete loans

---

### Resend Invite (Partner)

**_File:_** e2e/trigger/partner/resend-invite-partner.cy.js

**_Description:_** Testing button `Resend Invite` for Partner in the loan popup

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Change `plan level` in turn to the `highest`
1. Creates a `new loan`
1. Add `Partner`
1. Open loan with current `Partner` and click on button `Resend Invite`
1. Accepts email invite sent to `Partner` email `and` check count messages must be 2
1. Remove `Partner` from loan
1. Delete loans

---

# Team Member

---

### Add and Remove (Team Member)

**_File:_** e2e/trigger/team-member/add-and-remove-team-member.cy.js

**_Description:_** Adding `Borrower` to `loan` and remove it.

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Change `plan level` in turn to the `highest`
1. Creates a `new loan`
1. Creates and add a new `Team Member `account
1. Accepts email invite sent to `Team Member` email
1. Delete `Team Member`
1. Delete loans

---

### Create Many Loan Types (Team Member)

**_File:_** e2e/trigger/team-member/create-many-loan-types-team-member.cy.js

**_Description:_** Creating many loan different types

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Change `plan level` to the `highest`
1. Creates a `new loan`
1. Add `Team Member`
1. Accepts email invite sent to `Team Member` email
1. Creates loan with `fees`
1. Creates loan with `percent fees`
1. Creates loan with `alt interest method`
1. Creates loan with `old dates`
1. Delete `Team Member`
1. Delete loans

---

### Duplicate Existing Loan (Team Member)

**_File:_** e2e/trigger/team-member/duplicate-existing-loan-team-member.cy.js

**_Description:_** Testing Duplicate loan

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Change `plan level` to the `highest`
1. Creates a `new loan`
1. Add `Team Member`
1. Accepts email invite sent to `Team Member` email
1. Duplicate Existing Loan and check them
1. Delete loans

---

### Edit Profile (Team Member)

**_File:_** e2e/trigger/team-member/edit-profile-team-member.cy.js

**_Description:_** Edit Profile Lender data

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Change `plan level` to the `highest`
1. Creates a `new loan`
1. Add `Team Member`
1. Accepts email invite sent to `Team Member` email
1. Edite `Team Member` profile data
1. Check profile after edit
1. Delete `Team Member`
1. Delete loans

---

### First Login (Team Member)

**_File:_** e2e/trigger/team-member/first-login-team-member.cy.js

**_Description:_** Test button `First Login` for first login of user

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Change `plan level` to the `highest`
1. Creates a `new loan`
1. Add `Team Member`
1. Check `First Login` with `5` clicks
1. Accepts email invite sent to `team member` email and check for `6` messages
1. Delete `Team Member`
1. Delete loans

---

### Forgot Password (Team Member)

**_File:_** e2e/trigger/team-member/forget-password-team-member.cy.js

**_Description:_** Testing button `Forgot Password` for Team Member

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Change `plan level` to the `highest`
1. Creates a `new loan`
1. Add `Team Member`
1. Accepts email invite sent to `Team Member` email
1. `Forgot` your `password`, get code, and generate a new password
1. Delete `Team Member`
1. Delete loans

---

### Manage Download (Team Member)

**_File:_** e2e/trigger/team-member/manage-download-team-member.cy.js

**_Description:_** Download `xlsx`, parse to `JSON`, comparing the data

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Change `plan level` to the `highest`
1. Creates a new loans (2)
1. Add `Team Member`
1. Accepts email invite sent to `Team Member` email
1. Download `One Loan`
1. Parse from `xlsx` to `JSON`
1. Formatting data and comparing `JSON` with loan data on the page
1. Download `All Loan Data For Lender`
1. Parse from `xlsx` to `JSON`
1. Formatting data and comparing `JSON` with `each` loan data on the page
1. Delete `Team Member`
1. Delete loans

---

### Check Accessibility Of Loan Statuses (Team Member)

**_File:_** e2e/trigger/team-member/check-accessibility-of-loan-statuses-team-member.cy.js

**_Description:_** Changing `Loan Statuses`, editing different fees (if possible) and checking `accessibility`

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Change `plan level` to the `highest`
1. Creates a `new loan`
1. Add `Team Member`
1. Accepts email invite sent to `Team Member` email
1. Creates a `new loan`
   - edit `Payments`(edited)
   - edit `Interest`(edited)
   - edit `Miscellaneous`(edited)
   - edit `Late Fees`(edited)
   - edit `Transactional Fees`(edited)
   - edit `Monthly Fees`(edited)
   - checking `Make a payment` should `not` be disabled
   - checking `Add Borrower` should `not` be disabled
   - checking `Add Partner` should `not` be disabled
   - checking `Add Doc` should `not` be disabled
   - checking `Add One Time Fee` should `not` be disabled
   - checking `Remove One Time Fee` should `not` be disabled
   - checking `Add Late Fee` should `not` be disabled
   - checking `Remove Late Fee` should `not` be disabled
   - checking `Edit Loan` should `not` be disabled
   - checking `Download Loan Data` should `not` be disabled
   - checking `Payment History` should `can` edit `Due Date`
1. Changing Loan Status from `Active` to `Frozen`
   - edit `Payments`(disabled for edit)
   - edit `Interest`(disabled for edit)
   - edit `Miscellaneous`(disabled for edit)
   - edit `Late Fees`(disabled for edit)
   - edit `Transactional Fees`(disabled for edit)
   - edit `Monthly Fees`(disabled for edit)
   - checking `Make a payment` should be disabled
   - checking `Add Borrower` should be disabled
   - checking `Add Partner` should be disabled
   - checking `Add Doc` should be disabled
   - checking `Add One Time Fee` should be disabled
   - checking `Remove One Time Fee` should be disabled
   - checking `Add Late Fee` should be disabled
   - checking `Remove Late Fee` should be disabled
   - checking `Edit Loan` should `not` be disabled
   - checking `Download Loan Data` should be disabled
   - checking `Payment History` should `can't` edit `Due Date`
1. Changing Loan Status from `Frozen` to `PaidOff`
   - edit `Payments`(disabled for edit)
   - edit `Interest`(disabled for edit)
   - edit `Miscellaneous`(disabled for edit)
   - edit `Late Fees`(disabled for edit)
   - edit `Transactional Fees`(disabled for edit)
   - edit `Monthly Fees`(can be edite)
   - checking `Make a payment` should `not` be disabled
   - checking `Add Borrower` should `not` be disabled
   - checking `Add Partner` should `not` be disabled
   - checking `Add Doc` should `not` be disabled
   - checking `Add One Time Fee` should `not` be disabled
   - checking `Remove One Time Fee` should `not` be disabled
   - checking `Add Late Fee` should `not` be disabled
   - checking `Remove Late Fee` should `not` be disabled
   - checking `Edit Loan` should `not` be disabled
   - checking `Download Loan Data` should `not` be disabled
   - checking `Payment History` should `can` edit `Due Date`
1. Changing Loan Status from `PaidOff` to `Cancelled`
   - edit `Payments`(disabled for edit)
   - edit `Interest`(disabled for edit)
   - edit `Miscellaneous`(disabled for edit)
   - edit `Late Fees`(disabled for edit)
   - edit `Transactional Fees`(disabled for edit)
   - edit `Monthly Fees`(disabled for edit)
   - checking `Add Borrower` should be disabled
   - checking `Add Partner` should be disabled
   - checking `Add Doc` should be disabled
   - checking `Add One Time Fee` should be disabled
   - checking `Remove One Time Fee` should be disabled
   - checking `Add Late Fee` should be disabled
   - checking `Remove Late Fee` should be disabled
   - checking `Edit Loan` should `not` be disabled
   - checking `Download Loan Data` should be disabled
   - checking `Payment History` should `can't`edit `Due Date`
1. Changing Loan Status from `Cancelled` to `Foreclosed`
   - edit `Payments`(disabled for edit)
   - edit `Interest`(disabled for edit)
   - edit `Miscellaneous`(disabled for edit)
   - edit `Late Fees`(disabled for edit)
   - edit `Transactional Fees`(disabled for edit)
   - edit `Monthly Fees`(disabled for edit)
   - checking `Add Borrower` should be disabled
   - checking `Add Partner` should be disabled
   - checking `Add Doc` should be disabled
   - checking `Add One Time Fee` should be disabled
   - checking `Remove One Time Fee` should be disabled
   - checking `Add Late Fee` should be disabled
   - checking `Remove Late Fee` should be disabled
   - checking `Edit Loan` should `not` be disabled
   - checking `Download Loan Data` should be disabled
   - checking `Payment History` should `can't`edit `Due Date`
1. Changing Loan Status from `Foreclosed` to `Closed`
   - edit `Payments`(disabled for edit)
   - edit `Interest`(disabled for edit)
   - edit `Miscellaneous`(disabled for edit)
   - edit `Late Fees`(disabled for edit)
   - edit `Transactional Fees`(disabled for edit)
   - edit `Monthly Fees`(disabled for edit)
   - checking `Add Borrower` should be disabled
   - checking `Add Partner` should be disabled
   - checking `Add Doc` should be disabled
   - checking `Add One Time Fee` should be disabled
   - checking `Remove One Time Fee` should be disabled
   - checking `Add Late Fee` should be disabled
   - checking `Remove Late Fee` should be disabled
   - checking `Edit Loan` should `not` be disabled
   - checking `Download Loan Data` should be disabled
   - checking `Payment History` should `can't`edit `Due Date`
1. Changing Loan Status from `Closed` to `Active`
1. Changing сhanges
1. Delete `Team Member`
1. Delete loans

---

### Manage Fees (Team Member)

**_File:_** e2e/trigger/team-member/manage-fees-team-member.cy.js

**_Description:_** Adding different fees and removed them

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Change `plan level` to the `highest`
1. Creates a `new loan`
1. Add `Team Member`
1. Accepts email invite sent to `Team Member` email
1. Creates `One Time Fee` to loan
1. Remove `One Time Fee`
1. Creates `Late Fee` to loan
1. Remove `Late Fee`
1. Delete `Team Member`
1. Delete loans

---

### Multiple Payments (Team Member)

**_File:_** e2e/trigger/team-member/multiple-payments-team-member.cy.js

**_Description:_** Doing multiple payments

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Change `plan level` to the `highest`
1. Creates a `new loan`
1. Add `Team Member`
1. Accepts email invite sent to `Team Member` email
1. Make multiple payments (Amount per month: `1000$`, `50` payments with late fee of `$10` on one month)
1. Delete `Team Member`
1. Delete loans

---

### Record Payment Team Member (Team Member)

**_File:_** e2e/trigger/team-member/record-payment-team-member.cy.js

**_Description:_** Record payment for Lender

**_Steps:_**

1. Signup a new Lender
1. Accepts email invite sent to `Lender` email
1. Signup `Dwolla` for Lenders (`LLC`, `verified`)
1. Sets up `Lender` payment account with `IAV`
1. Change `plan level` to the `highest`
1. Creates a `new loan`
1. Add `Team Member`
1. Accepts email invite sent to `Team Member` email
1. Create record payment
1. Update record payment
1. Update `Due Date` in the Loan
1. Delete record payment
1. Delete `Team Member`
1. Delete loans

---
