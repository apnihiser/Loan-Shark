// Monthly Payment = 
// Monthly Mortgatge payment (m) = (principle (p) * interest rate(r)( 1 + r) ^ total number of payments(n)) / (( 1 + interest rate r) ^ total number of payments (n) - 1)
// or
// m = (P * r( 1 + r) ^ n) / (( 1 + r) ^ n - 1 )

// p = 300,000
// r = 5% or .05 annualy interest rate
// r = 0.05 / 12 to get monthly interest rate
// n = 30 * 12 = 360
// M = 300,000 (.05/12)(1+.05/12) ^ 360 / (1+.05/12) ^ 360 - 1

// M = 300,000 (.05/12)(1+.05/12) ^ 360 / (1+.05/12) ^ 360 - 1
// m = 1250 * 4.467744314 / 3.467744314
// m = 1,610.46


//can also use m = p * r / 1 - (1 + r) ^ -n
// m = 300,000 * 0.05/12  / 1 - (1 + 0.05/12) ^ -360
// m = 1250 / .7761734044
// m = $1610.46

// T = total amount of money that she will have to repay.
// T = $1610.46 * 360 = $579,765.60

// Total interest I = Total amout of money - P
// $579,765.60 - 300,000 = $279,765.60

// Coder F Math
//
// rate = 5% or .05 yearly rate or .05/12 for monthly rate 
// loanAmount = 25000
// term = 60
//
// m = (25000) * (.05/12) / (1 - (1 + .05/12) -60)
// m = 25000 * 0.004166666 / (1 - (1 + 0.004166666) ^ -60)
// m = 104.166666666 / 0.220794609
// m = $471.78

//Controller function
//gather data from webform
function getValues() {

    let loanTerms = {};
    //define principle
    loanTerms.principal = parseInt(document.getElementById("inputLoanAmount").value);
    //define number of payments 12 per year by Month
    loanTerms.numberMonths = parseInt(document.getElementById("inputTermLength").value);
    //define loan rate / 100 per month / per days
    loanTerms.rate = parseInt(document.getElementById("inputInterestRate").value);
    

    //form is validating numbers but we do a check here to ensure there is a value provided as well
    if ( !Number.isInteger(loanTerms.principal) || !Number.isInteger(loanTerms.numberMonths) || !Number.isInteger(loanTerms.rate) ) {

        alert("Please check your entries and try again.")

    } else {

        loanTerms.rate = loanTerms.rate / 1200;
        //perform value computations and return object that describe the amortization Table
        let amorTable = generateTable(loanTerms);

        //accept object and display components
        displayValues(loanTerms, amorTable);

    }
}

function generateTable(loanRequest) {

    //Define Terms for Monthly Payment Formula
    let p = loanRequest.principal;
    let r = loanRequest.rate
    let n = loanRequest.numberMonths

    //Define Terms for Amortization Table
    let amorTable = {};
    
    //Solve for Monthly Payment using the following: m = ( p * r ) / ( 1 - ( 1 + r ) ^ -n ) p=principle, r=rate (APR 5% would be .05 per year or .05/12 per month), n=loan term in months
    amorTable.monthlyPayment = ( p * r ) / ( 1 - Math.pow(1 + r, -n) );

    //Create Balance sheet
    amorTable.balance = p;

    //Solve for Total Cost on the loan
    amorTable.totalCost = ( amorTable.monthlyPayment * n );

    //Solve for Total Interest on the loan
    amorTable.totalInterest = amorTable.totalCost - loanRequest.principal;
    amorTable.currentInterest = 0;

    return amorTable;

}

function displayValues(loanTerms, amorTable) {

    //get the table body element from the page
    let tableBody = document.getElementById("results");

    //get the template row
    let templateRow = document.getElementById("lsTemplate");

    //clear tablebody
    tableBody.innerHTML = "";

    //Loop to create table out of the data created from the loan terms and amortization object.
    for ( let i = 1; i <= loanTerms.numberMonths; i++) {

        //Each loop grab the template and import the table row.
        let tableRow = document.importNode(templateRow.content, true);

        //grab just the tds and put them into an array
        let rowCols = tableRow.querySelectorAll("td");

        interestPayment = amorTable.balance * loanTerms.rate;
        amorTable.currentInterest += interestPayment;
        principalPayment = amorTable.monthlyPayment - interestPayment;
        amorTable.balance -= principalPayment;
        

        rowCols[0].textContent = i;
        rowCols[1].textContent = Math.round( amorTable.monthlyPayment * 100) / 100 ;
        rowCols[2].textContent = Math.ceil( principalPayment * 100) / 100;
        rowCols[3].textContent = Math.ceil( interestPayment * 100) / 100;
        rowCols[4].textContent = Math.ceil( amorTable.currentInterest * 100) / 100;
        rowCols[5].textContent = Math.ceil( amorTable.balance * 100) / 100;

        tableBody.appendChild(tableRow);
    }
}