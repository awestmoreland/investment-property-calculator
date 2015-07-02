$(function(){

  var taxRate           = 0.0496;
  var maintenanceRate   = 0.05;
  var vacancyRate       = 0.08;
  var collectionsRate   = 0.1;
  var monthly           = 0.0833;

  var loan_duration_years = getVal('loan-duration-years');
  var annual_payments = getVal('annual-payments');

  $('.input input').on('input', function(){

    principal           = getVal('purchase-price');
    downpayment         = getVal('purchase-price') * 0.2;
    loan_amount         = getVal('purchase-price') * 0.8;
    loan_rate           = getVal('loan-rate');
    loan_years          = getVal('loan-years');
    monthly_payment     = pmt(loan_amount, loan_rate / 100 / 12, loan_years * 12)
    property_tax        = Math.round(getVal('sev') * taxRate);
    property_insurance  = Math.round(getVal('insurance') * monthly);
    maintenance         = Math.round(monthly_payment * maintenanceRate);
    vacancy_factor      = Math.round(monthly_payment * vacancyRate);
    collections_factor  = Math.round(monthly_payment * collectionsRate);


    setVal('purchase-price', principal);
    setVal('downpayment', downpayment);
    setVal('loan-amount', loan_amount);
    setVal('property-tax', Math.round(property_tax / 12), "("+property_tax + " annually)");
    setVal('mortgage-payment', monthly_payment);

    setVal('property-insurance', property_insurance);
    setVal('maintenance', maintenance);
    setVal('vacancy-factor', vacancy_factor);
    setVal('collections-factor', collections_factor);

    incoming = 0;
    outgoing = 0;
    $('.output tbody td.val.tally').each(function(){
      outgoing = outgoing + eval($(this).text());
    });
    setVal('outgoing', outgoing);
    setVal('return', getVal('income-rent') - outgoing);


  });

});



function getVal(field) {
  return eval($('#'+field).val());
}

function setVal(field, val, notes) {
  $('.output tr.'+field+' td.val').html(Math.round(val));
  $('.output tr.'+field+' td.notes').html(notes || "");
}


function pmt(PR, IN, PE) {
  var PAY = (PR * IN) / (1 - Math.pow(1 + IN, -PE))
  return PAY
}

