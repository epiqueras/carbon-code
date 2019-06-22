<?php // phpcs:ignore
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
function carbon_code_init() { // phpcs:ignore
	wp_register_script(
		'carbon-code/blocks-js',
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ),
		array(
			'wp-blocks',
			'wp-i18n',
			'wp-element',
		),
		null,
		true
	);
	register_block_type( 'carbon-code/carbon-code', array( 'editor_script' => 'carbon-code/blocks-js' ) );
}
add_action( 'init', 'carbon_code_init' );
