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

        //Convert loan rate into APR that will compound monthly.
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

//Use information from amorTable to determine and append to HTML Table Body
function displayValues(loanTerms, amorTable) {

        //Use this to 
        const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
        })

        //Write results to the summary section of the application page
        document.getElementById("payment").innerHTML =  formatter.format(amorTable.monthlyPayment);
        document.getElementById("principal").innerHTML = formatter.format(loanTerms.principal);
        document.getElementById("interest").innerHTML = formatter.format(amorTable.totalInterest);
        document.getElementById("cost").innerHTML = formatter.format(amorTable.totalCost);

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

            //Calculate final information to the written to the table body results
            interestPayment = amorTable.balance * loanTerms.rate;
            amorTable.currentInterest += interestPayment;
            principalPayment = amorTable.monthlyPayment - interestPayment;
            amorTable.balance -= principalPayment;

            //fill template array with information
            rowCols[0].textContent = i;
            rowCols[1].textContent = formatter.format(amorTable.monthlyPayment);
            rowCols[2].textContent = formatter.format(principalPayment);
            rowCols[3].textContent = formatter.format(interestPayment);
            rowCols[4].textContent = formatter.format(amorTable.currentInterest);
            rowCols[5].textContent = formatter.format(amorTable.balance);

            //Append to Table body
            tableBody.appendChild(tableRow);

    }
}