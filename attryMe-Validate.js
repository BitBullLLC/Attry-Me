/*
	NAME: attryMe-Validate.js
	DATE: 2014-10-10
	PURPOSE: This is a JavaScript Function I made to validate a form based on custom attributes.
	
	NOTES:
		- You need to define the custom attributes on the form element itself.
		- You need to make sure that an ID is defined for every element, not just a name.
		- All attributes will validate to FALSE if not in the element, and validation for the unspecified attribute will be skipped.
		- Attributes 'e_value' & 'e_type' are required for this to work, they are pulled directly from the form.element node.
		- If you need an attribute type that isn't in here, you need to add it to both attrNameArr and to the switch statement.
		- Only ONE ATTRIBUTE TYPE PER FIELD. This function will not validate multiple attribute types in one form field.
		- MODAL WINDOW PLUGIN NOT INCLUDED. If you want to include your own, the code is available to work with it.
		
	FUNCTIONS:
		- validateForm
		- validateBoxes
		- buildErrorMessage
		- confirmBox
		- alertBox
	
	UPDATES:
		[2014-10-10 M.BENITEZMEISS] Created File & added this header comment.
		[2014-10-17 M.BENITEZMEISS] hasAttribute is not "Quirks Mode" compatible, had to change method.
		
	ATTRIBUTES:
		e_default		: the default value of this option. Example: select menu has a default option of 'SELECT'.				
		e_name			: the display name of this option, for error alert. Example, your form calls the field "Boat Name", the e_name will be "Boat Name".
		e_required		: whether the field is required or not, values are true/false - converted to boolean in code.
		e_invalid		: a list of invalid options for this field, comma seperated. Example: "Houseboat,Motorboat,Sailboat,Catamaran,Other".
		e_min			: the minimum value (int) for this element, converted to number in code.
		e_max			: the maximum value (int) for this element, converted to number in code.
		e_list			: a list of valid options for this element (cannot combine with string type).  Example: "Houseboat,Motorboat,Sailboat,Catamaran,Other".
		e_length		: the minimum string length allowed, converted to number in code.
		e_confirm		: whether to display a confirm, values are true/false - converted to boolean in code.
		e_confirmMsg	: the custom confirm message, can be an empty string.
*/
// JavaScript Document
function AttryMe(formName)
{	// set flags to true/false
	var isValid 		= false; // set valid to false by default.
	var isModal			= false; // set this to "true" if you want to use your own Modal Window plugin.
	// set error message defaults
	var errorMessages	= ''; 	// set error messages to empty string by default, appends values later, null value will throw error.
	// set arrays to defaults
	var allErrors 		= new Array(); // set array to be used later, needs to be before the loop, appends errors as the loop processes.
	// names of all the attribute types that can be validated.
	var attrNameArr		= new Array('e_type', 'e_default', 'e_name', 'e_required', 'e_invalid', 'e_min', 'e_max', 'e_length', 'e_list', 'e_confirm', 'e_confirmMsg');
	// set regular expressions
	var dateRegEx		= /(^(((0[1-9]|[12][0-8])[\/](0[1-9]|1[012]))|((29|30|31)[\/](0[13578]|1[02]))|((29|30)[\/](0[4,6,9]|11)))[\/](19|[2-9][0-9])\d\d$)|(^29[\/]02[\/](19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)/g;
	var emailRegEx		= /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i;
	var phoneRegEx		= /^\+?[0-99]?(\s||\.||-||\))??[0-9]{3}(\s||\.||-||\))?([0-9]{3})(\s||\.||-){1}([0-9]{4})$/g;
	var stateRegEx		= /^((AL)|(AK)|(AS)|(AZ)|(AR)|(CA)|(CO)|(CT)|(DE)|(DC)|(FM)|(FL)|(GA)|(GU)|(HI)|(ID)|(IL)|(IN)|(IA)|(KS)|(KY)|(LA)|(ME)|(MH)|(MD)|(MA)|(MI)|(MN)|(MS)|(MO)|(MT)|(NE)|(NV)|(NH)|(NJ)|(NM)|(NY)|(NC)|(ND)|(MP)|(OH)|(OK)|(OR)|(PW)|(PA)|(PR)|(RI)|(SC)|(SD)|(TN)|(TX)|(UT)|(VT)|(VI)|(VA)|(WA)|(WV)|(WI)|(WY))$/i;
	var usZipRegEx		= /^\d{5}((-|\s)?\d{4})?$/g;
	var digitRegEx		= /^[-+]?\d+$/g;
	var ipAddRegex		= /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/g;
	var passRegex		= /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{4,16}$/g;
	var trimRegex		= /^\s+|\s+$/g;
	// pull the form into a variable for looping
	var form = document.forms[formName];
	
	// loop through the form elements
	for (var i=0; i<form.elements.length; i++)
	{	// elements are updated/reset every loop.
		var element 		= form.elements[i];	// set the element to current element.
		var id				= element.id;		// set the id of the element.
		var attr 			= new Array();		// set the attribute array will be populated later on (associative array).
		var confirmResults	= false;			// set the default to false.
		var isDefaultValue	= false;			// set the default to false.
		var isEmptyValue	= false;			// set the default to false.
		var isChecked		= false;			// set the default to false.
		
		// set the attribute to the element's value (string format).
		attr['e_value']		= (''+document.getElementById(id).value).replace(trimRegex,'');
		
		// loop through the attribute array values, setting the attr associative array key to the attrNameArr values, and the attr[key] to the attribute DOM values
		for(var x=0;x<attrNameArr.length;x++)
		{	// drop the attribute name into a variable for cleaner code.
			var attrName = attrNameArr[x];
			// pull the attribute value, defaulting to boolean 'false' if attribute is not specified in element
			var attrVal = (!((element.getAttribute(attrName) === null) || (element.getAttribute(attrName) === '')) ? element.getAttribute(attrName)+'' : false);
			// set attribute values to true/false on boolean based attributes (i.e. 'e_required' or 'e_confirm')
			if(attrVal === "true"){attrVal = true;}
			// set attr associative array to use the attribute Name as the key and the DOM value of the element's attribute as the value.
			attr[attrName] = attrVal;
		}
		
		// set the booleans for empty and default values - cleaner code
		if(attr['e_value'] == attr['e_default']){isDefaultValue = true;}
		if(attr['e_value'].length == 0){isEmptyValue = true;}
		
		// if the element has the required flag to true, check to make sure it's not a default value or empty.
		if(attr['e_required'])
		{	// if the element type is not a checkbos or a radio & the value is either equal to the default, or the value is an empty string
			if((attr['e_type'] != "checkbox" && attr['e_type'] != "radio") && (isEmptyValue || isDefaultValue))
			{	// then add the required to the error array
				allErrors.push(attr['e_name']+" is required.");
			}
			// else if it is a checkbox or radio type
			else if(attr['e_type'] == "checkbox" || attr['e_type'] == "radio")
			{	// use subfunction to make sure at least one item is selected
				isChecked = validateBoxes(element);
				// if there are no selected items
				if(!isChecked)
				{	// then add the required to the error array
					allErrors.push("At least one "+attr['e_name']+" selected option is required.");
				}
			}
		}
		
		// if the value is not an empty string (required elements are checked above) & the value & type are not false (indicates error), check attributes.
		if(attr['e_value'].length > 0 && !attr['e_value'] && !attr['e_type'])
		{	// switch based on the e_type, only one e_type is allowed (switch is faster than if/elseif/else)
			switch(attr['e_type'])
			{				
				case "password":
					// test the password against the password regular expression pattern.
					if(!passRegEx.test(attr['e_value']))
					{	// if the test fails, add error to the array
						allErrors.push(attr['e_name']+" contains an invalid format. Must by at least 4 characters long and contain one (1) Upper Case, one (1) lower case, and one (1) number. Example: MyPassword_123");
					}
				break;
				
				case "digit":
					// test the digit against the digit regular expression pattern.
					if(!digitRegEx.test(attr['e_value']))
					{	// if the test fails, add error to the array
						allErrors.push(attr['e_name']+" contains an invalid format. Must be a digit, your value is: "+attr['e_value']);
					}
				break;
				
				case "date":
					if(!dateRegEx.test(attr['e_value']))
					{	// if the test fails, add error to the array
						allErrors.push(attr['e_name']+" contains an invalid format. Must be a date in MM/DD/YYYY, your value is: "+attr['e_value']);
					}
				break;
				
				case "email":
					if(!emailRegEx.test(attr['e_value']))
					{	// if the test fails, add error to the array
						allErrors.push(attr['e_name']+" contains an invalid format. Must be a valid email address, your value is: "+attr['e_value']);
					}
				break;
				
				case "phone":
					if(!phoneRegEx.test(attr['e_value']))
					{	// if the test fails, add error to the array
						allErrors.push(attr['e_name']+" contains an invalid format. Must be a valid phone number from 7-10 digits, your value is: "+attr['e_value']);
					}
				break;
				
				case "zip":
					if(!usZipRegEx.test(attr['e_value']))
					{	// if the test fails, add error to the array
						allErrors.push(attr['e_name']+" contains an invalid format. Must be a valid 5 or 9 digit US Zip Code, your value is: "+attr['e_value']);
					}
				break;
				
				case "rangemax":
					if(attr['e_value'] >= attr['e_max'])
					{	// if the test fails, add error to the array
						allErrors.push(attr['e_name']+" must not exceed "+attr['e_max']+", your value is: "+attr['e_value']);
					}
				break;
				
				case "rangemin":
					if(attr['e_value'] <= attr['e_min'])
					{	// if the test fails, add error to the array
						allErrors.push(attr['e_name']+" must be "+attr['e_min']+" or greater, your value is: "+attr['e_value']);
					}
				break;
				
				case "rangebetween":
					if(attr['e_value'] <= attr['e_min'] || attr['e_value'] >= attr['e_max'])
					{	// if the test fails, add error to the array
						allErrors.push(attr['e_name']+" must be between "+attr['e_min']+" and "+attr['e_max']+", your value is: "+attr['e_value']);
					}
				break;
				
				case "ipaddress":
					if(!ipAddRegEx.test(attr['e_value']))
					{	// if the test fails, add error to the array
						allErrors.push(attr['e_name']+" contains an invalid format. Must be a valid IP Address, your value is: "+attr['e_value']);
					}
				break;
				
				default:
				
			}
		}
		if(attr['e_length'] != false && attr['e_value'].length < attr['e_length'])
		{	// if the test fails, add error to the array
			allErrors.push(attr['e_name']+" must contain "+attr['e_length']+" or more characters. Your value is: "+attr['e_value']);
		}
		
		if(attr['e_invalid'].length > 0)
		{
			if(attr['e_invalid'].indexOf(attr['e_value']) > -1)
			{	// if the test fails, add error to the array
				allErrors.push(attr['e_name']+" contains an invalid option. Your value is: "+attr['e_value']);
			}
		}
		
		if(attr['e_list'].length > 0 && attr['e_type'] != "string")
		{
			if(attr['e_list'].indexOf(attr['e_value']) == -1)
			{	// if the test fails, add error to the array
				allErrors.push(attr['e_name']+" contains an invalid option. Your value is: "+attr['e_value']);
			}
		}
		
		if(attr['e_confirm'])
		{	// if true, trigger confirm dialog box.
			if(!attr['e_confirmMsg']){attr['e_confirmMsg']='';} // if the confirm message is false, default the value to an empty string
			attr['e_confirmMsg'] += 'Click "OK" to continue, or click "CANCEL" to return without any changes.' // append text to the end.
			confirmResults = confirmBox(attr['e_confirmMsg'], isModal); // trigger the confirm box and store results in variable
			// if the user clicked cancel, results are false
			if(!confirmResults)
			{	// if false, flip valid to false so the form is not submitted.
				isValid = false;
			}
		}
	}
	
	// build the error message string via the subfunction. if isModal is true, the message will be in HTML, else plain text.
	errorMessages += buildErrorMessage(allErrors, isModal);
	
	// if the error array has no entries and EITHER the confirm attribute is false OR the confirm is true AND the confirmResults are true
	if(allErrors.length == 0 && !attr['e_confirm'] || (allErrors.length == 0 && attr['e_confirm'] && confirmResults))
	{	// form is valid, return true and submit form
		isValid = true;
	}
	// else the form is invalid, throw errors
	else
	{	// trigger alert
		alertBox(errorMessages, isModal);
	}
	// return whether the form is valid or not.
	return isValid;
}

function validateBoxes(element)
{	// subfunction used to loop through any checkboxes/radio buttons to validate that at least one is checked.
	var isChecked = false; // set isChecked to false by default
	for(var x=1;x<element.length;x++)
	{	// loop through the element's options
		if(element[x].checked)
		{	// if one of the elements options are selected, then the element has one checked
			isChecked = true;
		}
	}
	// return the results.
	return isChecked;	
}

function buildErrorMessage(errors, isModal)
{	// subfunction used to generate the text for errors based on the array that's passed in, and the modal flag.
	var text = ""; // build empty string text variable.
	for(var x=0; x<errors.length; x++)
	{	// loop through error array.
		var count = x+1; // set count to +1, since arrays start at 0
		if(isModal)
		{	// if modal flag is true, use HTML list.
			text += "<li>"+errors[x]+"</li>";
		}
		else
		{	// if modal flag is false, use text list.
			text += (count)+") "+errors[x]+"\n";
		}
	}
	// if modal flag is true, put ordered list tags around text.
	if(isModal){text = "<ol style='list-style-type: decimal;'>"+text+"</ol>";}
	
	// return generated text.
	return text;	
}

function confirmBox(message, isModal)
{	// subfunction used to generate the confirm box based on the modal flag.
	var confirmResults = false;
	switch(isModal)
	{
		case true: // if the isModal flag is true use jQuery Modal, add your own custom modal function.
			confirmResults = confirmModal(message);
		break;
		
		case false: // if the Modal flag is flase, use regular confirm.
			confirmResults = confirm(message);
		break;
		
		default:	// if not true/false, use regular confirm.
			confirmResults = confirm(message);
		
	}
	// return confirmResults, defaults to false.
	return confirmResults;
}

function alertBox(message, isModal)
{	// subfunction used to generate the alert box based on the modal flag.
	var messageHdr = "The following fields need to be corrected, in order to submit this form:";
	
	switch(isModal)
	{
		case true: // if the isModal flag is true use jQuery Modal, add your own custom modal function.
			message = "<div id='modal-msg'>"+message+"</div>";
			alertModal(message,messageHeader);
		break;
		
		case false: // if the Modal flag is flase, use regular confirm.
			alert(messageHdr+"\n\n"+message);
		break;
		
		default:	// if not true/false, use regular confirm.
			alert(message);
		
	}
}
