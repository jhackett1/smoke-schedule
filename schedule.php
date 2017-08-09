<?php
/*
Plugin Name: Smoke Schedule
Plugin URI: https://github.com/jhackett1/smoke-schedule
Description: Fetches a weekly schedule from via the Wordpress API and displays in an interactive grid. Display with [smoke-schedule].
Author: Joshua Hackett
Author URI: http://joshuahackett.com
Version: 1.0.0
*/

function show_schedule(){
  wp_enqueue_script('jquery');
  // Get plugin CSS
  wp_enqueue_style('yuhh', plugin_dir_url( __FILE__ ) . 'css/style.css');
  // Get scripts
  wp_enqueue_script('app', plugin_dir_url( __FILE__ ) . 'app.js');
  // Lastly, include the markup template
  ob_start();
  $template = include 'schedule-template.php';
  return ob_get_clean();
};

// Register the shortcode
add_shortcode('smoke-schedule', 'show_schedule');
