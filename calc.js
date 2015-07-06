$(function(){

  // Hard-coded values
  var loan_duration_years = getVal('loan-duration-years');
  var downpayment_rate  = 0.25;
  var taxRate           = 0.0496;
  var maintenanceRate   = 0.05;
  var vacancyRate       = 0.08;
  var collectionsRate   = 0.1;
  var monthly           = 0.0833;


  $('.input input').on('input', function(){

    principal           = getVal('purchase-price');
    downpayment         = getVal('purchase-price') * downpayment_rate;
    loan_amount         = getVal('purchase-price') * (1-downpayment_rate);
    loan_rate           = getVal('loan-rate');
    loan_years          = getVal('loan-years');

    mortgage_m          = pmt(loan_amount, loan_rate / 100 / 12, loan_years * 12);
    mortgage_y          = annually(mortgage_m);
    property_tax_y      = getVal('taxval') * taxRate;
    property_insure_y   = getVal('insurance');
    maintenance_y       = mortgage_y * maintenanceRate;
    vacancy_factor_y    = mortgage_y * vacancyRate;
    collection_factor_y = mortgage_y * collectionsRate;


    $('#downpayment').val(downpayment);
    $('#loan-amount').val(loan_amount);

    setVal('purchase-price', principal);
    setVal('downpayment', downpayment);
    setVal('loan-amount', loan_amount);

    setVal('property-tax', property_tax_y, toPercent(taxRate));
    setVal('mortgage-payment', mortgage_y);
    setVal('property-insurance', property_insure_y);
    setVal('maintenance', maintenance_y, toPercent(maintenanceRate));
    setVal('vacancy-factor', vacancy_factor_y, toPercent(vacancyRate));
    setVal('collections-factor', collection_factor_y, toPercent(collectionsRate));

    setTotals();

  });

  // trigger change on first field when page loads
  $('#purchase-price').trigger('input');

});



function toPercent(val) {
  return 100 * val + "%";
}


function setTotals() {

  var incoming_y = annually(getVal('income-rent'));
  var outgoing_y = 0;

  $('.output tbody tr.tally .val_annually').each(function(){
    outgoing_y = outgoing_y + eval($(this).text());
  });

  setVal('incoming', incoming_y);
  setVal('outgoing', outgoing_y);
  setVal('return', incoming_y - outgoing_y);

}

function monthly(val) {
  return Math.round(val * monthly);
}

function annually(val) {
  return Math.round(val * 12);
}


function getVal(field) {
  return eval($('#'+field).val());
}


function setVal(field, val_y, notes) {

  val_y = Math.round(val_y);
  val_m = Math.round(val_y/12);

  $('.output tr.'+field+' td.val_annually').html(val_y);
  $('.output tr.'+field+' td.val_monthly').html(val_m);
  $('.output tr.'+field+' td.notes').html(notes || "");
}


function pmt(PR, IN, PE) {
  var PAY = (PR * IN) / (1 - Math.pow(1 + IN, -PE))
  return PAY
}

