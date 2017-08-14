/*
 * javascript functions for Easy Softonic Contact Form admin area
 */

// The following was moved to display_options() so I could set the default tab
//// Set up tabs for options page
//jQuery(function() {
//	jQuery( "#tabs" ).tabs({ active: 1 });
////	$( ".selector" ).tabs({ active: 1 });
////	jQuery( "#tab-list" ).attr('display', 'block');
//});

// Give a warning if the user tries to leave the page w/o saving changes
var escf_warning = false;
var escf_submit = false;
window.onbeforeunload = function() { 
  // alert('escf_submit='+escf_submit+ '   escf_warning='+escf_warning);
  if (escf_warning && !escf_submit) {
    return escf_transl.unsaved_changes;  // This text will appear on IE and Chrome, but not Firefox
  }
}

// Detect whether the form has been changed
// If the form has changed, set a hidden field to "1"
jQuery(document).ready(function(){
    // for a list of possible selectors in the statement below, see http://www.w3schools.com/jquery/jquery_ref_selectors.asp
    jQuery("#escf-optionsform").change(function() {
        jQuery("input[name='form-changed']").val('1'); // XXX do I even use form-changed ?
		// Ignore changes on tab 8 (Tools) and tab 9 (Newsletter) since these are beyond the form and not saved in the options table
		var tabId = jQuery("li.ui-state-active").attr("id");
		tabId = tabId.substr(8); //escf-tab4
        if (tabId < 8) {
			escf_warning = true;
			// Turn on notices to save changes
			jQuery(".escf-save-notice").css('display','block');
		}
//        alert('Something changed');
    });
	
    // Detect the press of the submit button
    jQuery(".submit").click(function() {
//		alert('Button pressed was ' + document.pressed);
		var tools_url = document.getElementById("tools-admin-url").value;
		var myform = document.getElementById("escf-optionsform");
//		alert('Tools url is ' + tools_url);
		var resp;
		// Find out which button was pressed
		switch (document.pressed) {
			case escf_transl.save_changes:
				escf_submit = true;		// Don't issue a warning about leaving the page
				// Store the tab ID for use in the validate function
				var tabId = jQuery("li.ui-state-active").attr("id");
				tabId = tabId.substr(8); //escf-tab4
				jQuery("input[name='current_tab']").val(tabId);
//				document.escf-optionsform.action = "options.php";  // This is now the default
				break;
			case escf_transl.send_test:
				// the following line doesn't work in IE because WP adds a hidden field named 'action'
				// document.escf-optionsform.action = tools_url;
				myform.setAttribute( "action", tools_url );
				break;
			case escf_transl.copy_settings:
				resp = confirm( escf_transl.confirm_change );
				if ( resp ) myform.setAttribute( "action", tools_url );
				else return(false);
				break;
			case escf_transl.backup_settings:
				myform.setAttribute( "action", tools_url );
				break;
			case escf_transl.restore_settings:
				resp = confirm( escf_transl.confirm_change );
				if ( resp ) myform.setAttribute( "action", tools_url );
				else return(false);
				break;
		}
		return(true);

    });

	// Update field order using drag and drop
	jQuery('.escf_field_settings').sortable({
		items: '.escf_field',
		opacity: 0.6,
		cursor: 'move',
		axis: 'y',
		//update: function() {
            //var order = $(this).sortable('serialize');
			//$.post(ajaxurl, order, function(response) {
				// alert(response);
			//});
	   //	}
	});

//	jQuery( "#tab-list" ).attr('display', 'block');
	jQuery('#escf-tab-list').css('visibility','visible');
	jQuery("a.show-in-popup").click(function(e ){
    popupCenter(jQuery(this).attr('href'), 800, 650, jQuery(this).data().popup_window);
    e.stopPropagation();
    e.preventDefault();
  });
  jQuery(".no-save-changes").click(function(e){
    escf_warning = false;
  });
});  // end document ready function

function escf_set_form( $text ) {
	// $text is the translated version of "Add Form"
	// parm was: val
	//Load options page to display selected form
//	alert('  jQuery verion is ' + jQuery.fn.jquery);
	var sel = document.getElementById("form_select");
	var theValue = sel.options[sel.selectedIndex].value;
	var theIndex = sel.options[sel.selectedIndex].index;
//	alert('Form number is ' + theValue);
//	alert('Select index is ' + theIndex);
//	var theIndex = val.formSelect.options[val.formSelect.selectedIndex].value ;
	
	var $resp, theUrl;
	if ( '0' === theValue ) {
		// "Add a New Form" was selected
		if (escf_warning) {
			$resp = confirm("You have unsaved changes to your form.  If you proceed, any changes will be lost.\n\nAre you sure you want to continue?");
			// Reset the selection to the current form, in case we stay on the page
			sel.selectedIndex = +sel.name - 1;	// The name was set to the current form number
		} else { $resp = true; }
		if ($resp) {
			// Create a new form
			// Find the form number for the new form
			var last_index = sel.length - 2;
			var last_form = sel.options[last_index].value;
//			alert("Last form is " + last_form);
			var new_form = +last_form+1;
//			alert('Next form number is ' + new_form);
			theUrl = escf_get_url(true) + '&escf_form=' + new_form + '&escf_tab=1';	// get the URL, strip escf_form
//			escf_postwith(theUrl, {ctf_action: $text});

			// Change the form action, set ctf_action value, and submit the form
			var myForm = document.getElementById("escf_form_control");
			myForm.action = theUrl;
			var myAction = document.getElementById("ctf_action");
			myAction.setAttribute("value", $text);
			myForm.submit();
		} 
	} else {
		// Change the form number in the form action url
		theUrl = escf_get_url(true);	// get URL, strip escf_form parm
		theUrl = theUrl + '&escf_form=' + theValue;
//		alert("New url is " + theUrl);
		if ( theUrl !== "" ){
			if (escf_warning) {
				// The form has been changed, so we might not be leaving the page
				// Reset the selection to the current form, in case we stay on the page
				sel.selectedIndex = +sel.name - 1;	// The name was set to the current form number
			}
			var myForm = document.getElementById("escf_form_control");
			myForm.action = theUrl;	
			// Diaplay "loading" gif
			jQuery("#ctf-loading").css('display','block');		
			myForm.submit();			
		// location.href = theUrl ;
		}
	}
	// This should give the id of the current tab: var id = jQuery("li.tab:eq("+selected+")").attr('id');
	// to select a certain tab: jQuery("#tabs").tabs("select","#tabs-3");
}

function escf_get_url(strip_form) {
	// Gets the current URL, and updates the escf_tab parm
	// Optionally, remove the escf_form parm based on the boolean parm strip_form
//	var tabId = jQuery("li.ui-tabs-selected").attr("id");
	var tabId = jQuery("li.ui-state-active").attr("id");
//	alert('Tab ID is ' + tabId);
	if ( typeof(tabId)=='string' ) tabId = tabId.substr(8); //escf-tab4
	else tabId = '1';
	if ( ! typeof(tabId)=='number' ) tabId = '1';

	var parts = document.location.href.split("&");
	var theUrl = parts[0];
	if ( ! strip_form ) {
		var i = 1;
		while ( i < parts.length ) {
			if ( "escf_form=" == parts[i].substr(0,10) )  
				theUrl = theUrl + "&" + parts[i];
			i++;
		}
	}
//	var i = 1;
//	while ( i < parts.length ) {
//		if ( ! ( ( no_form && ( "escf_form=" == parts[i].substr(0,10))) || ( "escf_tab=" == parts[i].substr(0,9) ) ) )
//			theUrl = theUrl + "&" + parts[i];
//		i++;
//		}
	theUrl = theUrl + '&escf_tab=' + tabId;
	
	return theUrl;
}

function escf_postwith (toUrl,parms) {
	// Create a form, set POST variables from parms, submit to toUrl
	// ref: http://mentaljetsam.wordpress.com/2008/06/02/using-javascript-to-post-data-between-pages/
	var myForm = document.createElement("form");
	myForm.method="post" ;
	myForm.action = toUrl ;
	for ( var k in parms ) {
		var myInput = document.createElement("input");
		myInput.setAttribute("name", k) ;
		myInput.setAttribute("value", parms[k]);
		myForm.appendChild(myInput) ;
	}
	document.body.appendChild(myForm) ;
	myForm.submit() ;
	document.body.removeChild(myForm) ;
}

function toggleVisibility(id) {
	var e = document.getElementById(id);
	if ( e.style.display == 'block' )
		e.style.display = 'none';
	else
		e.style.display = 'block';
}

// show hide toggle button for fields settings
function toggleVisibilitybutton(id) {
	var thisid = id;
   	var oDiv = document.getElementById('field'+thisid)
	var oBtn = document.getElementById('button'+thisid)
	if (oDiv.style.display == 'block') {
        oDiv.style.display = 'none';
		oBtn.value='Show Details';
	} else {
        oDiv.style.display = 'block';
		oBtn.value='Hide Details';
	}
}

function escf_add_field($text) {
	// $text is the translated "Add Field" text
    var n = document.getElementById('es_options');
	nonce = n.value;
	if ( escf_warning ) {
		$resp = confirm("You have unsaved changes to your form.  If you proceed, any changes will be lost.\n\nAre you sure you want to continue?");
	} else { $resp = true; }
	if ( $resp ) {
		// Add a new field
//		escf_warning = true;	// This doesn't seem to have any effect
		var theUrl = escf_get_url(false);	// get the URL, don't strip escf_form
		escf_postwith(theUrl,{ctf_action:$text,es_options:nonce});
	}
}

function escf_delete_field(key) {
	// Mark the field for deletion.  It will be deleted in validate()
	var e = document.getElementById('es_contact_field'+key+'_label');
	var resp = confirm("This will permanently delete the field '" + e.value + "'.\n\nAre you sure?\n\nThe field will be deleted when you Save Changes.");
	if ( resp ) {
	   //	alert('The field will be deleted when you Save Changes.');
		escf_warning = true;
		// Mark field for deletion
		e = document.getElementById('delete-'+key);
		e.value="true";
		// Hide the field on the display
		e = document.getElementById('field-'+key);
		e.style.display = 'none';
	}
}


function escf_reset_form() {
	// escf_transl.reset_form is the translated version of "Reset Form"
    var n = document.getElementById('es_options');
	nonce = n.value;
	$resp = confirm("This will set this form back to the default settings.  All tabs will be affected.  This cannot be reversed.\n\nAre you sure?");
	if ($resp) {
//		alert("This will eventually reset the form.");  // XXX write function for reset form
		var theUrl = escf_get_url(false);	// get the URL, don't strip escf_form
		escf_postwith(theUrl,{ctf_action:escf_transl.reset_form,es_options:nonce});
	}
}

function escf_reset_all_styles() {
	// escf_transl.reset_all_styles is the translated version of "Reset Styles on all forms"
    var n = document.getElementById('es_options');
	nonce = n.value;
	$resp = confirm("This will reset default style settings on all forms. This cannot be reversed.\n\nAre you sure?");
	if ($resp) {
//		alert("This will reset all styles.");
		var theUrl = escf_get_url(false);	// get the URL, don't strip escf_form
		escf_postwith(theUrl,{ctf_action:escf_transl.reset_all_styles,es_options:nonce});
	}
}

function ESCF_Import_old_forms() {
	// escf_transl.import_all_forms is the translated version of "Import forms from 3.xx version"
    var n = document.getElementById('es_options');
	nonce = n.value;
	$resp = confirm("This will import forms and settings from the 3.xx version and will replace the current 4.xx forms. This cannot be reversed.\n\nAre you sure?");
	if ($resp) {
//		alert("This will reset all styles.");
		var theUrl = escf_get_url(false);	// get the URL, don't strip escf_form
		escf_postwith(theUrl,{ctf_action:escf_transl.import_old_forms,es_options:nonce});
	}
}

function escf_delete_form(num) {
	// the form num and name re used in the messages
//	alert('Current form is ' + num);
	var e = document.getElementById('es_contact_form_name');
	name = e.value;
    var n = document.getElementById('es_options');
	nonce = n.value;
//	alert('Form name is ' + name);
	// name id='es_contact_form_name'
	var resp = confirm("Form " +num+ ": "+name+".\nThis will permanently delete this form.  This cannot be reversed.\n\nAre you sure?");
	if ( resp ) {
		var theUrl = escf_get_url(true);	// get the URL, strip escf_form (so we default to Form 1
		escf_postwith(theUrl,{ctf_action:escf_transl.delete_form,form_num:num,form_name:name,es_options:nonce});
	}
}

// XXX The following two functions are no longer used

function escf_submit_preview($conf) {
	// Submit function for the preview contact form
	// $conf is the confirmation message text, if any
	
	var resp = true;
	if ( $conf.length > 0) {
		resp = confirm($conf);
	}
	if (resp) {
		// Submit the form
//		alert('Submit the form now..');
		var myform = document.getElementById("escf-optionsform");
		myform.setAttribute( "action", document.URL );
	} else {
		// Don't submit the form
		return false;
	}
	
	return true;
}

function escf_reset_preview($conf) {
	// Submit function for the preview contact form
	// $conf is the confirmation message text
	
	var resp = confirm($conf);
	if (resp) {
//		alert('The form will be reset');
		var myform = document.getElementById("escf-optionsform");
		myform.setAttribute( "action", document.URL );
		return(true);
	} 
	else {
//		alert ('The form won\'t be reset');
		return(false);
	}
	
}

function popupCenter(url, width, height, name) {
  var left = (screen.width/2)-(width/2);
  var top = (screen.height/2)-(height/2);
  return window.open(url, name, "location=0,resizable=1,scrollbars=1,width="+width+",height="+height+",left="+left+",top="+top);
}

function confirmChangeAccount() {
  if(confirm('Are you sure you want change account - all data for current account will be lost?')){
  	document.getElementById('vcita_disconnect_button').click();
  	return false;
  }
}
