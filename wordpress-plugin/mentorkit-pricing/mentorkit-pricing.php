<?php
/**
 * Plugin Name: MentorKit Pricing Calculator
 * Plugin URI: https://mentorkit.io
 * Description: Interactive pricing calculator for MentorKit products. Use shortcode [mentorkit_pricing] to display.
 * Version: 1.0.0
 * Author: MentorKit
 * Author URI: https://mentorkit.io
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: mentorkit-pricing
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('MENTORKIT_PRICING_VERSION', '1.0.0');
define('MENTORKIT_PRICING_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('MENTORKIT_PRICING_PLUGIN_URL', plugin_dir_url(__FILE__));

/**
 * Enqueue scripts and styles for the pricing calculator
 */
function mentorkit_pricing_enqueue_assets() {
    // Only load if shortcode is present
    global $post;
    if (!is_a($post, 'WP_Post') || !has_shortcode($post->post_content, 'mentorkit_pricing')) {
        return;
    }

    // Enqueue the React app
    wp_enqueue_script(
        'mentorkit-pricing-js',
        MENTORKIT_PRICING_PLUGIN_URL . 'build/pricing.js',
        array(), // No dependencies - React is bundled
        MENTORKIT_PRICING_VERSION,
        true // Load in footer
    );

    // Enqueue styles
    wp_enqueue_style(
        'mentorkit-pricing-css',
        MENTORKIT_PRICING_PLUGIN_URL . 'build/pricing.css',
        array(),
        MENTORKIT_PRICING_VERSION
    );

    // Pass WordPress data to React if needed
    wp_localize_script('mentorkit-pricing-js', 'mentorkitPricingConfig', array(
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('mentorkit_pricing_nonce'),
        'siteUrl' => get_site_url(),
    ));
}
add_action('wp_enqueue_scripts', 'mentorkit_pricing_enqueue_assets');

/**
 * Shortcode callback for [mentorkit_pricing]
 */
function mentorkit_pricing_shortcode($atts) {
    // Parse shortcode attributes
    $atts = shortcode_atts(array(
        'theme' => 'auto', // auto, light, dark
    ), $atts, 'mentorkit_pricing');

    // Build container with optional theme class
    $theme_class = '';
    if ($atts['theme'] === 'dark') {
        $theme_class = ' data-theme="dark"';
    } elseif ($atts['theme'] === 'light') {
        $theme_class = ' data-theme="light"';
    }

    // Return the container div where React will mount
    return sprintf(
        '<div id="mentorkit-pricing-root"%s></div>',
        $theme_class
    );
}
add_shortcode('mentorkit_pricing', 'mentorkit_pricing_shortcode');

/**
 * Add Gutenberg block registration (optional - for block editor support)
 */
function mentorkit_pricing_register_block() {
    if (!function_exists('register_block_type')) {
        return;
    }

    register_block_type('mentorkit/pricing-calculator', array(
        'editor_script' => 'mentorkit-pricing-editor',
        'render_callback' => 'mentorkit_pricing_shortcode',
        'attributes' => array(
            'theme' => array(
                'type' => 'string',
                'default' => 'auto',
            ),
        ),
    ));
}
add_action('init', 'mentorkit_pricing_register_block');

/**
 * Enqueue editor assets for Gutenberg block
 */
function mentorkit_pricing_enqueue_editor_assets() {
    wp_enqueue_script(
        'mentorkit-pricing-editor',
        MENTORKIT_PRICING_PLUGIN_URL . 'build/editor.js',
        array('wp-blocks', 'wp-element', 'wp-editor', 'wp-components'),
        MENTORKIT_PRICING_VERSION
    );
}
add_action('enqueue_block_editor_assets', 'mentorkit_pricing_enqueue_editor_assets');
