$(function(){

  // example call:
  // [URL]?price=260000&taxable=47000&insurance=2000&water=800&trash=50&rent=2400


  // Hard-coded values
  var monthly           = 0.0833;


  // Populate input values from URL GET params or use defaults

  $('#purchase-price').val( GetURLParameter('price') || 100000 );
  $('#downpayment-rate').val( GetURLParameter('downrate') || 25 );
  $('#loan-rate').val( GetURLParameter('loanrate') || 4.25);
  $('#loan-years').val( GetURLParameter('loanyears') || 30);

  $('#taxval').val( GetURLParameter('taxable') || $('#purchase-price').val()/2 );
  $('#taxrate').val( GetURLParameter('taxrate') || 49.6 );

  $('#insurance').val( GetURLParameter('insurance') || 1200 );
  $('#water').val( GetURLParameter('water') || 400 );
  $('#trash').val( GetURLParameter('trash') || 25 );

  $('#maintenance-factor').val( GetURLParameter('maintenance') || 0.05 );
  $('#vacancy-factor').val( GetURLParameter('vacancy') || 0.08 );
  $('#collections-factor').val( GetURLParameter('collections') || 0.1 );

  $('#income-rent').val( GetURLParameter('rent') || 1200 );



  $('.input input').on('input', function(){

    // Read values from input fields when any of them change

    principal           = getVal('purchase-price');
    downpayment_rate    = getVal('downpayment-rate');
    downpayment         = getVal('purchase-price') * (downpayment_rate/100);
    loan_amount         = getVal('purchase-price') - downpayment;
    loan_rate           = getVal('loan-rate');
    loan_years          = getVal('loan-years');
    mortgage_m          = pmt(loan_amount, loan_rate / 100 / 12, loan_years * 12);
    mortgage_y          = annually(mortgage_m);
    tax_rate            = getVal('taxrate');
    property_tax_y      = getVal('taxval') * (tax_rate/1000);
    property_insure_y   = getVal('insurance');
    water_y             = getVal('water');
    trash_m             = getVal('trash');
    trash_y             = annually(trash_m);
    utils_y             = water_y + trash_y;

    maintenance_factor  = getVal('maintenance-factor');
    vacancy_factor  = getVal('vacancy-factor');
    collections_factor  = getVal('collections-factor');
    maintenance_y       = mortgage_y * maintenance_factor;
    vacancy_factor_y    = mortgage_y * vacancy_factor;
    collection_factor_y = mortgage_y * collections_factor;


    $('#downpayment').val(downpayment);
    $('#loan-amount').val(loan_amount);

    setVal('purchase-price', principal);
    setVal('downpayment', downpayment);
    setVal('loan-amount', loan_amount);

    setVal('property-tax', property_tax_y);
    setVal('mortgage-payment', mortgage_y);
    setVal('insurance', property_insure_y);
    setVal('utilities', utils_y );
    setVal('maintenance', maintenance_y);
    setVal('vacancy-factor', vacancy_factor_y);
    setVal('collections-factor', collection_factor_y);

    // setVal('collections-factor', collection_factor_y, toPercent(collectionsRate));

    setTotals();

    setURL();

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

function setURL(){
  base_url = window.location.href.split('?')[0];
  url = base_url;
  url += '?price=' + getVal('purchase-price');
  url += '&downrate=' + getVal('downpayment-rate');
  url += '&loanrate=' + getVal('loan-rate');
  url += '&loanyears=' + getVal('loan-years');
  url += '&taxable=' + getVal('taxval');
  url += '&taxrate=' + getVal('taxrate');
  url += '&insurance=' + getVal('insurance');
  url += '&water=' + getVal('water');
  url += '&trash=' + getVal('trash');

  url += '&maintenance=' + getVal('maintenance-factor');
  url += '&vacancy=' + getVal('vacancy-factor');
  url += '&collections=' + getVal('collections-factor');


  url += '&rent=' + getVal('income-rent');

  $('a#link').attr('href', url);
  $('a#reset').attr('href', base_url);
  $('input#url').val(url);

  $('#url').on('focus', function(){
    $(this).select();
  });
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


function GetURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }
}
