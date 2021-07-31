//Controller function
//gather data from webform
function getValues() {
    
    //Define a new loan object
    loan = {};
    loan.payment = 0.00;
    loan.totalInterest = 0.00;
    loan.totalCost = 0.00;
    loan.rate = 0.00;
    loan.amount = 0.00;
    loan.term = 0.00;
    loan.payments = [];

    //Grab data from the Form
    loan.amount = parseInt(document.getElementById("inputLoanAmount").value);
    loan.term = parseInt(document.getElementById("inputTermLength").value);
    loan.rate = parseInt(document.getElementById("inputInterestRate").value);

    //Calculate the loan and get payments
    newLoan = getPayments(loan);

    //Send newLoan object to be displayed in HTML
    displayValues(newLoan);

}

function getPayments(loan) {

    //Calculate Monthly Payment
    loan.payment = calcPayment(loan.amount, loan.rate, loan.term);

    //For loop from month 1 to the term to calculate a payment schedule
    let balance = loan.amount;
    let totalInterest = 0.00;
    let monthlyInterest = 0.00;
    let monthlyPrincipal = 0.0;
    let monthlyRate = calcMonthlyRate(loan.rate)

    for (let month = 1; month <= loan.term; month++) {

        //Logic based on requirements provided by Business Unit
        monthlyInterest = calcMonthlyInterest(balance, monthlyRate);
        totalInterest += monthlyInterest;
        monthlyPrincipal = loan.payment - monthlyInterest;
        balance -= monthlyPrincipal;

        //Define loan Payment object and shape data per month / loop.
        loanPayment = {};

        loanPayment.month = month;
        loanPayment.payment = loan.payment;
        loanPayment.monthlyPrincipal = monthlyPrincipal;
        loanPayment.monthlyInterest = monthlyInterest;
        loanPayment.totalInterest = totalInterest;
        loanPayment.balance = balance;

        //Push payments into the loan object
        loan.payments.push(loanPayment);
    }

    loan.totalInterest = totalInterest;
    loan.totalCost = loan.amount + totalInterest;

    //Return the loan to the view
    return loan;

}

//Calculate monthly payment using mortgage formula
function calcPayment(amount, rate, term) {

    let monthlyRate = calcMonthlyRate(rate);
    
    payment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));

    return payment;
}

//convert annual rate into monthly
function calcMonthlyRate(rate) {

    return rate / 1200;

}

//Calculate monthly interest
function calcMonthlyInterest(balance, monthlyRate) {

    return balance * monthlyRate;
}


//Use information from loan object to append to HTML Table Body
function displayValues(loan) {

    //Use this to format currency
    const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
    })



    //get the table body element from the page
    let tableBody = document.getElementById("results");

    //get the template row
    let templateRow = document.getElementById("lsTemplate");

    //clear tablebody
    tableBody.innerHTML = "";

    //Push results to the summary section of the application page
    document.getElementById("payment").innerHTML =  formatter.format(loan.payment);
    document.getElementById("principal").innerHTML = formatter.format(loan.amount);
    document.getElementById("interest").innerHTML = formatter.format(loan.totalInterest);
    document.getElementById("cost").innerHTML = formatter.format(loan.totalCost);

    //Loop to append each payment to HTML table
    loan.payments.forEach (payment => {

        //Each loop grab the template and import the table row.
        let tableRow = document.importNode(templateRow.content, true);

        //grab just the tds and put them into an array
        let rowCols = tableRow.querySelectorAll("td");

        //fill template array with monthly payment schedule
        rowCols[0].textContent = payment.month;
        rowCols[1].textContent = formatter.format(payment.payment);
        rowCols[2].textContent = formatter.format(payment.monthlyPrincipal);
        rowCols[3].textContent = formatter.format(payment.monthlyInterest);
        rowCols[4].textContent = formatter.format(payment.totalInterest);
        rowCols[5].textContent = formatter.format(payment.balance);

        //Append to Table body
        tableBody.appendChild(tableRow);

    });
}