<?php
/**
 * Conditional Vite assets (tree-shaken per module).
 *
 * In functions.php:
 *
 *   require_once get_template_directory() . '/wordpress/enqueue-assets.php';
 *   add_action( 'wp_enqueue_scripts', function () {
 *       // Global app always loads. Pass only what this request needs:
 *       wp_html_template_enqueue_assets( array( 'accordion', 'slider', 'gallery' ) );
 *   } );
 *
 * Scripts are type="module" (Chrome 61+, Safari 11+, Firefox 60+, all current browsers).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'WP_HTML_TEMPLATE_ASSETS_URI' ) ) {
	define( 'WP_HTML_TEMPLATE_ASSETS_URI', get_template_directory_uri() . '/assets' );
}

if ( ! defined( 'WP_HTML_TEMPLATE_ASSETS_PATH' ) ) {
	define( 'WP_HTML_TEMPLATE_ASSETS_PATH', get_template_directory() . '/assets' );
}

/**
 * @param string[] $modules accordion|modals|drawers|tabs|dropdown|slider|gallery
 */
function wp_html_template_enqueue_assets( array $modules = array() ): void {
	$allowed = array( 'accordion', 'modals', 'drawers', 'tabs', 'dropdown', 'slider', 'gallery' );
	$modules = array_values( array_intersect( $modules, $allowed ) );

	add_filter( 'script_loader_tag', 'wp_html_template_module_tag', 10, 3 );

	wp_html_template_enqueue_style( 'style', 'css/style.css' );
	wp_html_template_enqueue_script( 'app', 'js/app.js' );

	foreach ( $modules as $name ) {
		wp_html_template_enqueue_style( $name, "css/{$name}.css" );
		wp_html_template_enqueue_script( $name, "js/{$name}.js", array( 'wp-html-template-app' ) );
	}
}

function wp_html_template_enqueue_style( string $name, string $relative ): void {
	$path = WP_HTML_TEMPLATE_ASSETS_PATH . '/' . ltrim( $relative, '/' );
	if ( ! file_exists( $path ) ) {
		return;
	}

	wp_enqueue_style(
		'wp-html-template-' . $name,
		WP_HTML_TEMPLATE_ASSETS_URI . '/' . ltrim( $relative, '/' ),
		'style' === $name ? array() : array( 'wp-html-template-style' ),
		(string) filemtime( $path )
	);
}

/**
 * @param string[] $deps
 */
function wp_html_template_enqueue_script( string $name, string $relative, array $deps = array() ): void {
	$path = WP_HTML_TEMPLATE_ASSETS_PATH . '/' . ltrim( $relative, '/' );
	if ( ! file_exists( $path ) ) {
		return;
	}

	wp_enqueue_script(
		'wp-html-template-' . $name,
		WP_HTML_TEMPLATE_ASSETS_URI . '/' . ltrim( $relative, '/' ),
		$deps,
		(string) filemtime( $path ),
		true
	);
}

function wp_html_template_module_tag( string $tag, string $handle, string $src ): string {
	if ( 0 !== strpos( $handle, 'wp-html-template-' ) ) {
		return $tag;
	}

	return '<script type="module" src="' . esc_url( $src ) . '" id="' . esc_attr( $handle ) . '-js"></script>' . "\n";
}
