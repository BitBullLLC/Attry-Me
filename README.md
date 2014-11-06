Attry-Me
==

Attry-Me is a lightweight, in-depth JavaScript form validation plugin allowing users to add specific custom attributes to form elements as a means to customize how they want their forms to validate. It gives the user control, so all the validation can be handled in one simple file.

In-Depth instructions will be added and modified here.

	NOTES:
		- You need to define the custom attributes on the form element itself.
		- You need to make sure that an ID is defined for every element, not just a name.
		- All attributes will validate to FALSE if not in the element, and validation for the unspecified attribute will be skipped.
		- Attributes "e_value" & "e_type" are required for this to work, they are pulled directly from the form.element node.
		- If you need an attribute type that isn't in here, you need to add it to both attrNameArr and to the switch statement.
		- Only ONE ATTRIBUTE TYPE PER FIELD. This function will not validate multiple attribute types in one form field.
		- MODAL WINDOW PLUGIN NOT INCLUDED. If you want to include your own, the code is available to work with it, but will require some tweaking and testing.
		- Modal window plugin and the Alert/Confirm boxes are in beta. They worked for me, but there are likely still bugs, please report any bugs you find and any fixes you used.
		- This has been tested on the IE9+, FF30+, and Chrome 30+, if you find any extra compatibilities or incompatibilties, please don't hesitate to contribute that.
		
	FUNCTIONS:
		- validateForm
		- validateBoxes
		- buildErrorMessage
		- confirmBox
		- alertBox
	
	UPDATES:
		[2014-10-10 M.BENITEZMEISS] Created File.
		[2014-10-17 M.BENITEZMEISS] hasAttribute is not "Quirks Mode" IE9 compatible, had to change method.
		
	ATTRIBUTES:
		e_defaul	: the default value of this option. Example: select menu has a default option of 'SELECT'.			e_nam		: the display name of this option, for error alert. Example, your form calls the field "Boat Name", the e_name will be "Boat Name".
		e_require	: whether the field is required or not, values are true/false - converted to boolean in code.
		e_invalid	: a list of invalid options for this field, comma seperated. Example: "Cat,Dog,Bird,Fish,Reptile,Other".
		e_mi		: the minimum value (int) for this element, converted to number in code.
		e_ma		: the maximum value (int) for this element, converted to number in code.
		e_list		: a list of valid options for this element (cannot combine with string type).  Example: "Houseboat,Motorboat,Sailboat,Catamaran,Other".
		e_length	: the minimum string length allowed, converted to number in code.
		e_confir	: whether to display a confirm, values are true/false - converted to boolean in code.
		e_confirmMs	: the custom confirm message, can be an empty string.

