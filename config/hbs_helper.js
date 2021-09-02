// const hbs = require('hbs');
// const _ = require('lodash');
// var paginate = require('handlebars-paginate');
// var HandlebarsIntl = require('handlebars-intl');
// const helpers = require('handlebars-helpers')();

// hbs.registerHelper('paginate', paginate);

// HandlebarsIntl.registerWith(hbs);

// hbs.registerHelper(helpers);

// hbs.registerHelper('json', (context) => {
//     return JSON.stringify(context);
// });

// hbs.registerHelper('dateFormat', require('handlebars-dateformat'));

// hbs.registerHelper('ternary', require('handlebars-helper-ternary'));

// hbs.registerHelper('encodeMyString',(inputData) => {
//     return new hbs.SafeString(inputData);
// });


// hbs.registerHelper('formatAsNumber',(inputData) => {

//    if (isNaN(inputData)) return "n/a";

//    return new Intl.NumberFormat('en-us').format(inputData);
// });

const hbs = require('hbs');
const _ = require('lodash');
var paginate = require('handlebars-paginate');
var HandlebarsIntl = require('handlebars-intl');
const helpers = require('handlebars-helpers')();

hbs.registerHelper('paginate', paginate);

HandlebarsIntl.registerWith(hbs);

hbs.registerHelper(helpers);

hbs.registerHelper('json', (context) => {
    return JSON.stringify(context);
});

hbs.registerHelper('dateFormat', require('handlebars-dateformat'));

hbs.registerHelper('ternary', require('handlebars-helper-ternary'));

hbs.registerHelper('encodeMyString',(inputData) => {
    return new hbs.SafeString(inputData);
});

hbs.registerHelper('formatColor',(numerator, denominator, className, valueThreshold, colorIfAbove, colofIfMid, colorIfBelow) => {

    const num = numerator ? numerator : 0;
    const denom = denominator ? denominator : 0;
    if (!denom) return "";

    const value = parseFloat(num) / parseFloat(denom);
    if (isNaN(value)) return "";
    let returnStyle = "";
    
    if (value < valueThreshold && colorIfBelow !== "") returnStyle = `${className}: ${colorIfBelow};`;
    if (value >= (valueThreshold/2) && colofIfMid !== "") returnStyle = `${className}: ${colofIfMid};`;
    if (value >= valueThreshold && colorIfAbove !== "") returnStyle = `${className}: ${colorIfAbove};`;

    return returnStyle;
});




hbs.registerHelper('formatAsNumber',(inputData) => {

   if (isNaN(inputData)) return "n/a";

   return new Intl.NumberFormat('en-us').format(inputData);
});

// used to force any prices in variants to a 2 digit format
hbs.registerHelper('formatAsPriceNumber',(inputData) => {

   if (isNaN(inputData)) return "0.00";

   return inputData.toFixed(2);
});

hbs.registerHelper('formatAsCurrency',(inputData) => {

   if (isNaN(inputData)) return "n/a";

   return new Intl.NumberFormat('en-us', {style: 'currency', currency: 'USD'}).format(inputData);
});


hbs.registerHelper('times', (n, block) => {
    var accum = '';
    for(var i = 0; i < n; ++i)
        accum += block.fn(i);
    return accum;
});

hbs.registerHelper('ternaryCompare', (elem, value, truth, lies) => {
  if(elem == value) {
    return truth;
  }
  return lies;
});


hbs.registerHelper("ifvalue", function(conditional, options) {
    if (conditional == options.hash.equals[0]) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

hbs.registerHelper('ifIn', function(elem, list, options) {
  if(list.indexOf(elem) > -1) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('ifCond', function(v1, v2, options) {
  if(v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('eqObjID', (v1, v2) => {

  if (v1 && v2) {
    return v1.toString() === v2.toString();
  } else {
    return false;
  }



});

hbs.registerHelper({

    ne: function (v1, v2) {
        return v1 !== v2;
    },
    and: function () {
        return Array.prototype.slice.call(arguments).every(Boolean);
    },
    or: function () {
        return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
    }
});

hbs.registerHelper('split', (v1) => {
  var value = v1.split(">");
  return value[value.length - 1].trim();
});

hbs.registerHelper('arrayget', (v1,v2) => {
    for (var i=0; i < v2.length; i++) {
        if (v2[i].title.toUpperCase().trim() === v1.toUpperCase().trim()) {
            return v2[i].cost;
        }
    }
});


hbs.registerHelper('objectLenght', (value) => {
    return value.length;
});

hbs.registerHelper('checklength', function (v1, v2, options) {
'use strict';
   if (v1.length>v2) {
     return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('formatNotification', (v1, options) => {
    switch (v1) {
      case "primary":
        return "General";
        break;
      case "secondary":
        return "Info";
        break;
      default:
        return v1.charAt(0).toUpperCase() + v1.slice(1);

    }
});
/**
hbs.registerHelper('replaceContent', (template, options) => {
    //console.log(template)
    let discount =  0;
    if(options && options.variants )
      discount = ((options.variants[0].pricing.list-options.variants[0].pricing.sale)/options.variants[0].pricing.list).toFixed(2);

    if(options &&  options.shopify )
    {
      template     = template.replace('{{PRODUCT_IMAGE}}', options.shopify.images[0].src);
      template     = template.replace('{{SHOPIFY_HANDLE}}', options.shopify.handle);
    }

    if(options && options.title )
      template     = template.replace('{{PRODUCT_TITLE}}', options.title);

    template     = template.replace('{{PRODUCT_DISCOUNT}}', discount);


    return new hbs.SafeString(template);
});
**/

hbs.registerHelper('showDeal', (deal, dealList, imagePrefix, allowUpdate) => {

  const DEALNAME = deal;
  const DEALTITLE = _.startCase(deal.split("_").join(" "));
  const DEALTYPE = deal.split("_")[0] || "";
  const IMAGE = (dealList && dealList[DEALNAME]) ? `<img src="${imagePrefix}/${dealList[DEALNAME]._id}/${dealList[DEALNAME].productImages[0] ? dealList[DEALNAME].productImages[0].name : ""}" width="100px">` : "";
  const ALLOW = allowUpdate ? `<a href="javascript:void(0)" targetVal="${DEALNAME}" class="btn btn-info addModal btn-rounded mdi mdi-plus" title="Add Product"></a>` : "";
  const ID = (dealList && dealList[DEALNAME]) ? dealList[DEALNAME]._id : "";
  const TITLE = (dealList && dealList[DEALNAME]) ? dealList[DEALNAME].title : "";
  const SKU = (dealList && dealList[DEALNAME] && dealList[DEALNAME].variants[0] && dealList[DEALNAME].variants[0].sku )  ? dealList[DEALNAME].variants[0].sku : "";

  const VENDOR = (dealList && dealList[DEALNAME]) ? dealList[DEALNAME].details.vendor.name : "";
  const CATEGORYTREE = (dealList && dealList[DEALNAME]) ? dealList[DEALNAME].product_tree : "tree";

  let dealColor = "";
  let textColor = "";

  switch (DEALTYPE) {
    case 'featured':
      dealColor = "primary";
      textColor = "white";
      break;
    case 'daily':
      dealColor = "success";
      textColor = "white";
      break;
    case 'extra':
      dealColor = "secondary";
      textColor = "black";
      break;
    case 'afternoon':
      dealColor = "warning";
      textColor = "white";
      break;
    case 'cart':
      dealColor = "danger";
      textColor = "white";
      break;
    default:

  }



  let html;

  if (TITLE !== "") {
    html =  `<tr class="table-${dealColor}" id="${DEALNAME}rowStyle">
      <td class="cell-detail" ><span style="font-size: 1.1em;">${DEALTITLE}</span></td>
      <td class="${DEALNAME}image" id="${DEALNAME}image">${IMAGE}</td>
      <td class="cell-detail "><input type="hidden" name="${DEALNAME}pid" id="${DEALNAME}input" value="${ID}"/><span id="${DEALNAME}span" class="${DEALNAME}input" style="font-size: 1.2em; font-weight: 900;">${TITLE}</span><br/>
        <ul class="${DEALNAME}input"><li><a href="/products/?ugSKU=${SKU}" style="color: ${textColor}; text-decoration: underline;">${SKU}</a></li> <li> <span>${VENDOR}</span> </li><li> <span>${CATEGORYTREE}</span> </li></ul></td>
      <td class="cell-detail"><span>${ALLOW}</span><td class="cell-detail"><a dealId="${DEALNAME}input" class="deleteDeal  mdi mdi-delete btn btn-danger btn-rounded"></a></td></td>
      </tr>`;
  } else {
    html =  `<tr class="table-${dealColor}" id="${DEALNAME}rowStyle">
     <td class="cell-detail" ><span style="font-size: 1.1em;">${DEALTITLE}</span></td>
     <td class="${DEALNAME}image" id="${DEALNAME}image">${IMAGE}</td>
     <td class="cell-detail "><input type="hidden" name="${DEALNAME}pid" id="${DEALNAME}input" value="${ID}"/><span id="${DEALNAME}span" class="${DEALNAME}input" style="font-size: 1.2em; font-weight: 900;">${TITLE}</span></td>
     <td class="cell-detail"><span>${ALLOW}</span><td class="cell-detail"><a dealId="${DEALNAME}input" class="deleteDeal  mdi mdi-delete btn btn-danger btn-rounded"></a></td></td>
     </tr>`;
  }


  return new hbs.SafeString(html);


});



hbs.registerHelper('ternaryNotAvailable', (value) => {

    return ( value || value === '0' )? value : 'N/A';

});

hbs.registerHelper('pacificTime', todaydate => {

  todaydate.toISOString();
  todaydate.valueOf() ;
  return todaydate.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });

});
