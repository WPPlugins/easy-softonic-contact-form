<?php
/*
Plugin Name: Easy Softonic Contact Form
Plugin URI: http://www.easysoftonic.com/
Description: Easy Softonic Contact Form for WordPress. An easy and powerful form builder that lets your visitors send you email. Blocks all automated spammers.
Version: 1.1.1
Author: Umair Saleem
Author URI: http://www.easysoftonic.com/
*/



//do not allow direct access
if ( strpos(strtolower($_SERVER['SCRIPT_NAME']),strtolower(basename(__FILE__))) ) {
 header('HTTP/1.0 403 Forbidden');
 exit('Forbidden');
}


/********************
 * Global constants
 ********************/
define( 'ESCF_VERSION', '1.1.1' );
define( 'ESCF_BUILD', '');		// Used to force load of latest .js files
define( 'ESCF_FILE', __FILE__ );	               // /path/to/wp-content/plugins/easy-softonic-contact-form/easy-softonic-contact-form.php
define( 'ESCF_PATH', plugin_dir_path(__FILE__) );  // /path/to/wp-content/plugins/easy-softonic-contact-form/
define( 'ESCF_URL', plugin_dir_url( __FILE__ ) );  // http://www.yoursite.com/wp-content/plugins/easy-softonic-contact-form/
define( 'ESCF_ADMIN_URL', admin_url( 'plugins.php?page=easy-softonic-contact-form/easy-softonic-contact-form.php'));
define( 'ESCF_PLUGIN_NAME', 'Easy Softonic Contact Form' );
define( 'ESCF_CAPTCHA_PATH', ESCF_PATH . 'captcha');
define( 'ESCF_ATTACH_DIR', ESCF_PATH . 'attachments/' );
define( 'ESCF_MAX_SLUG_LEN', 40 );

// Set constants for standard field numbers
define( 'ESCF_NAME_FIELD', '1' );
define( 'ESCF_EMAIL_FIELD', '2' );
define( 'ESCF_SUBJECT_FIELD', '3' );
define( 'ESCF_MESSAGE_FIELD', '4' );

global $escf_special_slugs;		// List of reserve slug names
$escf_special_slugs = array( 'f_name', 'm_name', 'mi_name', 'l_name', 'email2', 'mailto_id', 'subject_id' );

/********************
 * Includes
 ********************/
require_once ESCF_PATH . 'includes/class-escf-util.php';
require_once ESCF_PATH . 'includes/class-escf-display.php';
require_once ESCF_PATH . 'includes/class-escf-process.php';

if ( is_admin() ) {
	require_once ESCF_PATH . 'includes/class-escf-action.php';	
	require_once ESCF_PATH . 'includes/class-escf-options.php'; 
}


// Initialize plugin settings and hooks
ESCF_Util::setup();

register_activation_hook( __FILE__, 'ESCF_Util::import' );

if (!class_exists('esContactForm')) {
   class esContactForm {
      function es_contact_form_short_code($atts) {
         // backwards compatibility with manual PHP call from 3.xx
         echo ESCF_Display::process_short_code($atts);
      }
   }
}
$es_contact_form = new esContactForm();

// Show activation time errors
//echo get_option( 'plugin_error' );

// end of file