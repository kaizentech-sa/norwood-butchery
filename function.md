<?php
/**
 * Twenty Twenty-Five functions and definitions.
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package WordPress
 * @subpackage Twenty_Twenty_Five
 * @since Twenty Twenty-Five 1.0
 */

// Adds theme support for post formats.
if ( ! function_exists( 'twentytwentyfive_post_format_setup' ) ) :
    /**
     * Adds theme support for post formats.
     *
     * @since Twenty Twenty-Five 1.0
     *
     * @return void
     */
    function twentytwentyfive_post_format_setup() {
        add_theme_support( 'post-formats', array( 'aside', 'audio', 'chat', 'gallery', 'image', 'link', 'quote', 'status', 'video' ) );
    }
endif;
add_action( 'after_setup_theme', 'twentytwentyfive_post_format_setup' );

// Enqueues editor-style.css in the editors.
if ( ! function_exists( 'twentytwentyfive_editor_style' ) ) :
    /**
     * Enqueues editor-style.css in the editors.
     *
     * @since Twenty Twenty-Five 1.0
     *
     * @return void
     */
    function twentytwentyfive_editor_style() {
        add_editor_style( 'assets/css/editor-style.css' );
    }
endif;
add_action( 'after_setup_theme', 'twentytwentyfive_editor_style' );

// Enqueues style.css on the front.
if ( ! function_exists( 'twentytwentyfive_enqueue_styles' ) ) :
    /**
     * Enqueues style.css on the front.
     *
     * @since Twenty Twenty-Five 1.0
     *
     * @return void
     */
    function twentytwentyfive_enqueue_styles() {
        wp_enqueue_style(
            'twentytwentyfive-style',
            get_parent_theme_file_uri( 'style.css' ),
            array(),
            wp_get_theme()->get( 'Version' )
        );
    }
endif;
add_action( 'wp_enqueue_scripts', 'twentytwentyfive_enqueue_styles' );

// Registers custom block styles.
if ( ! function_exists( 'twentytwentyfive_block_styles' ) ) :
    /**
     * Registers custom block styles.
     *
     * @since Twenty Twenty-Five 1.0
     *
     * @return void
     */
    function twentytwentyfive_block_styles() {
        register_block_style(
            'core/list',
            array(
                'name'         => 'checkmark-list',
                'label'        => __( 'Checkmark', 'twentytwentyfive' ),
                'inline_style' => '
                ul.is-style-checkmark-list {
                    list-style-type: "\2713";
                }

                ul.is-style-checkmark-list li {
                    padding-inline-start: 1ch;
                }',
            )
        );
    }
endif;
add_action( 'init', 'twentytwentyfive_block_styles' );

// Registers pattern categories.
if ( ! function_exists( 'twentytwentyfive_pattern_categories' ) ) :
    /**
     * Registers pattern categories.
     *
     * @since Twenty Twenty-Five 1.0
     *
     * @return void
     */
    function twentytwentyfive_pattern_categories() {

        register_block_pattern_category(
            'twentytwentyfive_page',
            array(
                'label'       => __( 'Pages', 'twentytwentyfive' ),
                'description' => __( 'A collection of full page layouts.', 'twentytwentyfive' ),
            )
        );

        register_block_pattern_category(
            'twentytwentyfive_post-format',
            array(
                'label'       => __( 'Post formats', 'twentytwentyfive' ),
                'description' => __( 'A collection of post format patterns.', 'twentytwentyfive' ),
            )
        );
    }
endif;
add_action( 'init', 'twentytwentyfive_pattern_categories' );

// Registers block binding sources.
if ( ! function_exists( 'twentytwentyfive_register_block_bindings' ) ) :
    /**
     * Registers the post format block binding source.
     *
     * @since Twenty Twenty-Five 1.0
     *
     * @return void
     */
    function twentytwentyfive_register_block_bindings() {
        register_block_bindings_source(
            'twentytwentyfive/format',
            array(
                'label'              => _x( 'Post format name', 'Label for the block binding placeholder in the editor', 'twentytwentyfive' ),
                'get_value_callback' => 'twentytwentyfive_format_binding',
            )
        );
    }
endif;
add_action( 'init', 'twentytwentyfive_register_block_bindings' );

// Registers block binding callback function for the post format name.
if ( ! function_exists( 'twentytwentyfive_format_binding' ) ) :
    /**
     * Callback function for the post format name block binding source.
     *
     * @since Twenty Twenty-Five 1.0
     *
     * @return string|void Post format name, or nothing if the format is 'standard'.
     */
    function twentytwentyfive_format_binding() {
        $post_format_slug = get_post_format();

        if ( $post_format_slug && 'standard' !== $post_format_slug ) {
            return get_post_format_string( $post_format_slug );
        }
    }
endif;


//  ██╗  ██╗ █████╗ ██╗███████╗███████╗███╗   ██╗    ████████╗███████╗ ██████╗██╗  ██╗
//  ██║ ██╔╝██╔══██╗██║╚══███╔╝██╔════╝████╗  ██║    ╚══██╔══╝██╔════╝██╔════╝██║  ██║
//  █████╔╝ ███████║██║  ███╔╝ █████╗  ██╔██╗ ██║       ██║   █████╗  ██║     ███████║
//  ██╔═██╗ ██╔══██║██║ ███╔╝  ██╔══╝  ██║╚██╗██║       ██║   ██╔══╝  ██║     ██╔══██║
//  ██║  ██╗██║  ██║██║███████╗███████╗██║ ╚████║       ██║   ███████╗╚██████╗██║  ██║
//  ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚═╝  ╚═══╝       ╚═╝   ╚══════╝ ╚═════╝╚═╝  ╚═╝

// ============================================================================
// KAIZEN TECH BOILERPLATE SECURE API ENDPOINTS
// ============================================================================

// ============================================================================
// CLEAR CACHE 
// Curl: 
//      curl -X POST https://wp-api.kaizentech.co.za/wp-json/store/v1/cache/clear -H "X-API-Key: store-react-2024" -H "Content-Type: application/json"
//
// Powershell:
//      Invoke-RestMethod -Uri https://wp-api.kaizentech.co.za/wp-json/store/v1/cache/clear -Method POST -Headers @{ "X-API-Key" = "store-react-2024"; "Content-Type" = "application/json" }
//
// Replace "https://wp-api.kaizentech.co.za" and "store-react-2024" with your own values.
// ============================================================================



// KAIZEN BOILERPLATE SECURE API ENDPOINTS - CONFIGURE THESE WITH YOUR ACTUAL VALUES 
define('PAYFAST_MERCHANT_ID', '10041260');  // TODO: Replace with your store PayFast Merchant ID
define('PAYFAST_MERCHANT_KEY', 'obea3b7ropv2x');  // TODO: Replace with your store PayFast Merchant Key
define('PAYFAST_PASSPHRASE', 'Jiggas123456');  // TODO: Replace with your store PayFast Passphrase
define('BOBGO_API_KEY', 'cea6c50d2cd048e893742fea52c59607');  // TODO: Replace with store bobgo API Key
define('PAYFAST_API_URL', 'https://sandbox.payfast.co.za/eng/process'); // TODO: Replace with https://www.payfast.co.za/eng/process for live
define('BOBGO_API_URL', 'https://sandbox.bobgo.co.za/rates-at-checkout'); // TODO: Replace with https://api.bobgo.co.za/v2/rates-at-checkout for live

// CORS Configuration - Only allow your React app domain
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        // Define allowed origins for Store
        $allowed_origins = array(
            'https://www.store.co.za', // Production
            'https://store.co.za',     // Production
            'https://store.vercel.app', // QA Link
			'http://localhost:3000',    // DEV link
        );
        
        // Get the origin of the request
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        
        // Handle OPTIONS preflight request
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            if (in_array($origin, $allowed_origins)) {
                header('Access-Control-Allow-Origin: ' . $origin);
            }
            header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type, X-API-Key, X-User-ID, Authorization');
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Max-Age: 86400');
            exit(0);
        }
        
        // Check if the origin is in the allowed list
        if (in_array($origin, $allowed_origins)) {
            header('Access-Control-Allow-Origin: ' . $origin);
        }
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, X-API-Key, X-User-ID, Authorization');
        header('Access-Control-Allow-Credentials: true'); // Allow cookies
        header('Access-Control-Max-Age: 86400');
        return $value;
    });
});

// Security Functions - OPTIMIZED with environment-aware rate limiting
function verify_store_request($request) {
    // Check API key
    $api_key = $request->get_header('X-API-Key');
    if ($api_key !== 'store-react-2024') {
        error_log('[store] Invalid API key received');
        return new WP_Error('unauthorized', 'Invalid API key', array('status' => 401));
    }
    
    // Dynamic rate limiting based on environment
    $ip = $_SERVER['REMOTE_ADDR'];
    
    // Development detection (localhost or specific dev IPs)
    $is_dev = (
        strpos($_SERVER['HTTP_HOST'], 'localhost') !== false ||
        strpos($_SERVER['HTTP_HOST'], '127.0.0.1') !== false ||
        strpos($_SERVER['HTTP_REFERER'] ?? '', 'localhost') !== false
    );
    
    // Rate limits: 10000/hour for dev, 5000/hour for production
    $rate_limit = $is_dev ? 10000 : 5000;
    
    $requests = get_transient('api_requests_' . $ip) ?: 0;
    if ($requests > $rate_limit) {
        error_log('[store] Rate limit exceeded for IP ' . $ip . ' (' . $requests . '/' . $rate_limit . ')');
        return new WP_Error('rate_limit', 'Too many requests. Limit: ' . $rate_limit . '/hour', array('status' => 429));
    }
    set_transient('api_requests_' . $ip, $requests + 1, HOUR_IN_SECONDS);
    
    return true;
}

// Register Secure Endpoints
add_action('rest_api_init', function () {
    // PayFast payment endpoint
    register_rest_route('store/v1', '/payments/create', array(
        'methods' => 'POST',
        'callback' => 'handle_payfast_payment',
        'permission_callback' => 'verify_store_request',
    ));
    
    // BobGo shipping endpoint
    register_rest_route('store/v1', '/shipping/calculate', array(
        'methods' => 'POST',
        'callback' => 'handle_bobgo_shipping',
        'permission_callback' => 'verify_store_request',
    ));

    // ✅ NEW: Delivery options (Delivery Options by KaizenTech)
    // GET  /wp-json/store/v1/delivery/options
    // POST /wp-json/store/v1/delivery/calculate
    register_rest_route('store/v1', '/delivery/options', array(
        'methods'             => 'GET',
        'callback'            => 'ktdo_get_delivery_options_secure',
        'permission_callback' => 'verify_store_request',
    ));

    register_rest_route('store/v1', '/delivery/calculate', array(
        'methods'             => 'POST',
        'callback'            => 'ktdo_calculate_delivery_secure',
        'permission_callback' => 'verify_store_request',
        'args'                => array(
            'option_id' => array(
                'required'          => true,
                'type'              => 'string',
                'sanitize_callback' => 'sanitize_text_field',
            ),
            'lat' => array(
                'required' => false,
                'type'     => 'number',
            ),
            'lng' => array(
                'required' => false,
                'type'     => 'number',
            ),
            'cart_subtotal' => array(
                'required' => false,
                'type'     => 'number',
            ),
        ),
    ));
    
    // WooCommerce products endpoint (list)
    register_rest_route('store/v1', '/products', array(
        'methods' => 'GET',
        'callback' => 'get_products_secure',
        'permission_callback' => 'verify_store_request',
    ));
    
    // WooCommerce single product endpoint
    register_rest_route('store/v1', '/products/(?P<id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'get_product_secure',
        'permission_callback' => 'verify_store_request',
    ));

    // WooCommerce product variations endpoint
    register_rest_route('store/v1', '/products/(?P<id>\\d+)/variations', array(
        'methods' => 'GET',
        'callback' => 'get_product_variations_secure',
        'permission_callback' => 'verify_store_request',
    ));
    
    // WooCommerce brands endpoint
    register_rest_route('store/v1', '/products/brands', array(
        'methods' => 'GET',
        'callback' => 'get_brands_secure',
        'permission_callback' => 'verify_store_request',
    ));
    
    // WooCommerce categories endpoint
    register_rest_route('store/v1', '/products/categories', array(
        'methods' => 'GET',
        'callback' => 'get_categories_secure',
        'permission_callback' => 'verify_store_request',
    ));
    
    // WooCommerce child categories endpoint (for dropdown under a parent like 'singles')
    register_rest_route('store/v1', '/products/categories/children', array(
        'methods' => 'GET',
        'callback' => 'get_child_categories_secure',
        'permission_callback' => 'verify_store_request',
    ));
    
    // WooCommerce orders endpoints
    register_rest_route('store/v1', '/orders/create', array(
        'methods' => 'POST',
        'callback' => 'create_order_secure',
        'permission_callback' => 'verify_store_request',
    ));
    
    // Also register /orders for frontend compatibility
    register_rest_route('store/v1', '/orders', array(
        'methods' => 'POST',
        'callback' => 'create_order_secure',
        'permission_callback' => 'verify_store_request',
    ));

    // âœ… NEW: Custom design upload endpoint (accepts PNG/JPEG base64, returns media URL)
    register_rest_route('store/v1', '/custom-designs', array(
        'methods' => 'POST',
        'callback' => 'save_custom_design_secure',
        'permission_callback' => 'verify_store_request',
    ));

    // âœ… NEW: Base64 image proxy for customiser (avoids CORS tainting)
    register_rest_route('store/v1', '/images/base64', array(
        'methods' => 'GET',
        'callback' => 'get_image_base64_secure',
        'permission_callback' => 'verify_store_request',
        'args' => array(
            'url' => array(
                'required' => true,
                'type' => 'string',
            ),
        ),
    ));
    
    // Update order status endpoint
    register_rest_route('store/v1', '/orders/(?P<id>\d+)', array(
        'methods' => 'PUT',
        'callback' => 'update_order_secure',
        'permission_callback' => 'verify_store_request',
    ));
    
    // Cache clearing endpoint (for debugging)
    register_rest_route('store/v1', '/cache/clear', array(
        'methods' => 'POST',
        'callback' => 'clear_store_cache',
        'permission_callback' => 'verify_store_request',
    ));
    
    // Debug logs endpoint (for debugging)
    register_rest_route('store/v1', '/debug/logs', array(
        'methods' => 'GET',
        'callback' => 'get_debug_logs',
        'permission_callback' => 'verify_store_request',
    ));

    // Product attributes (for brand fallback in frontend)
    register_rest_route('store/v1', '/products/attributes', array(
        'methods' => 'GET',
        'callback' => 'get_product_attributes_secure',
        'permission_callback' => 'verify_store_request',
    ));

    // Gallery media (installation gallery images from media library)
    register_rest_route('store/v1', '/gallery/media', array(
        'methods' => 'GET',
        'callback' => 'get_gallery_media_secure',
        'permission_callback' => 'verify_store_request',
    ));

    // Product attribute terms
    register_rest_route('store/v1', '/products/attributes/(?P<id>\\d+)/terms', array(
        'methods' => 'GET',
        'callback' => 'get_product_attribute_terms_secure',
        'permission_callback' => 'verify_store_request',
    ));
    
    // Linked products endpoint (cross-sells and upsells)
    register_rest_route('store/v1', '/products/(?P<id>\\d+)/linked', array(
        'methods' => 'GET',
        'callback' => 'get_linked_products_secure',
        'permission_callback' => 'verify_store_request',
    ));

    // Slideshow endpoint (Meta Slider by KaizenTech)
    register_rest_route('store/v1', '/slideshow', array(
        'methods' => 'GET',
        'callback' => 'get_slideshow_secure',
        'permission_callback' => 'verify_store_request',
    ));
    
    // âœ… NEW: Stock validation endpoint
register_rest_route('store/v1', '/validate-stock', array(
    'methods' => 'POST',
    'callback' => 'validate_stock_before_payment',
    'permission_callback' => 'verify_store_request',
));

    // Product customisation logo upload (PNG) – returns URL for order meta
    register_rest_route('store/v1', '/logo/upload', array(
        'methods' => 'POST',
        'callback' => 'store_upload_product_customisation_logo',
        'permission_callback' => 'verify_store_request',
    ));
    
});

// âœ… Save a custom design image (base64) to the media library and return URL + attachment ID
function save_custom_design_secure($request) {
    $data = $request->get_json_params();
    $product_id = intval($data['productId'] ?? 0);
    $image_base64 = $data['imageBase64'] ?? '';

    if (!$image_base64 || strpos($image_base64, 'data:image/') !== 0) {
        return new WP_Error('invalid_image', 'Invalid image data', array('status' => 400));
    }

    // Validate mime/extension
    if (preg_match('/^data:image\\/(png|jpeg|jpg);base64,/', $image_base64, $matches) !== 1) {
        return new WP_Error('invalid_format', 'Only PNG and JPEG images are supported', array('status' => 400));
    }
    $ext = $matches[1] === 'jpeg' ? 'jpg' : $matches[1];

    // Strip header
    $image_base64 = preg_replace('/^data:image\\/(png|jpeg|jpg);base64,/', '', $image_base64);
    $binary = base64_decode($image_base64);
    if ($binary === false) {
        return new WP_Error('decode_failed', 'Failed to decode base64 image', array('status' => 400));
    }

    // Save to uploads
    $filename = 'custom-design-' . time() . '-' . wp_generate_uuid4() . '.' . $ext;
    $upload = wp_upload_bits($filename, null, $binary);
    if ($upload['error']) {
        return new WP_Error('upload_failed', $upload['error'], array('status' => 500));
    }

    // Insert attachment into media library
    $filetype = wp_check_filetype($upload['file'], null);
    $attachment = array(
        'post_mime_type' => $filetype['type'],
        'post_title'     => sanitize_file_name($filename),
        'post_content'   => '',
        'post_status'    => 'inherit'
    );
    $attach_id = wp_insert_attachment($attachment, $upload['file']);

    require_once ABSPATH . 'wp-admin/includes/image.php';
    $attach_data = wp_generate_attachment_metadata($attach_id, $upload['file']);
    wp_update_attachment_metadata($attach_id, $attach_data);

    // Optionally link to product
    if ($product_id > 0) {
        add_post_meta($attach_id, '_related_product_id', $product_id, true);
    }

    return array(
        'success' => true,
        'id' => $attach_id,
        'url' => $upload['url'],
    );
}

/**
 * Upload product customisation logo (PNG). Accepts base64 image data.
 * Returns the full image URL for storage in order meta so the business owner can view it.
 */
function store_upload_product_customisation_logo($request) {
    $data = $request->get_json_params();
    $image_base64 = $data['imageBase64'] ?? '';

    if (!$image_base64 || strpos($image_base64, 'data:image/') !== 0) {
        return new WP_Error('invalid_image', 'Invalid image data', array('status' => 400));
    }

    if (preg_match('/^data:image\\/png;base64,/', $image_base64) !== 1) {
        return new WP_Error('invalid_format', 'Only PNG images are supported for logo upload', array('status' => 400));
    }

    $image_base64 = preg_replace('/^data:image\\/png;base64,/', '', $image_base64);
    $binary = base64_decode($image_base64);
    if ($binary === false) {
        return new WP_Error('decode_failed', 'Failed to decode image', array('status' => 400));
    }

    $filename = 'product-logo-' . time() . '-' . wp_rand(1000, 9999) . '.png';
    $upload = wp_upload_bits($filename, null, $binary);
    if ($upload['error']) {
        return new WP_Error('upload_failed', $upload['error'], array('status' => 500));
    }

    $filetype = wp_check_filetype($upload['file'], null);
    $attachment = array(
        'post_mime_type' => $filetype['type'],
        'post_title'     => sanitize_file_name($filename),
        'post_content'   => '',
        'post_status'    => 'inherit'
    );
    $attach_id = wp_insert_attachment($attachment, $upload['file']);
    if (is_wp_error($attach_id)) {
        return new WP_Error('attachment_failed', $attach_id->get_error_message(), array('status' => 500));
    }

    require_once ABSPATH . 'wp-admin/includes/image.php';
    $attach_data = wp_generate_attachment_metadata($attach_id, $upload['file']);
    wp_update_attachment_metadata($attach_id, $attach_data);

    return array(
        'success' => true,
        'id'      => $attach_id,
        'url'     => $upload['url'],
    );
}

// Convert remote image to base64 data URL (PNG/JPEG/WEBP) for safe client-side use
function get_image_base64_secure($request) {
    $url = isset($_GET['url']) ? esc_url_raw($_GET['url']) : '';
    if (!$url) {
        return new WP_Error('invalid_url', 'Missing image URL', array('status' => 400));
    }

    // Basic SSRF guard: only allow http/https
    $scheme = wp_parse_url($url, PHP_URL_SCHEME);
    if (!in_array($scheme, array('http', 'https'), true)) {
        return new WP_Error('invalid_scheme', 'Invalid URL scheme', array('status' => 400));
    }

    // Fetch image
    $resp = wp_remote_get($url, array('timeout' => 20));
    if (is_wp_error($resp)) {
        return new WP_Error('fetch_failed', $resp->get_error_message(), array('status' => 500));
    }
    $code = wp_remote_retrieve_response_code($resp);
    if ($code < 200 || $code >= 300) {
        return new WP_Error('fetch_failed', 'Failed to fetch image: HTTP ' . $code, array('status' => 500));
    }
    $body = wp_remote_retrieve_body($resp);
    $mime = wp_remote_retrieve_header($resp, 'content-type');
    if (!$mime) {
        // Try detect from extension
        $ext = pathinfo(parse_url($url, PHP_URL_PATH), PATHINFO_EXTENSION);
        $ext = strtolower($ext);
        $mime = $ext === 'png' ? 'image/png' : ($ext === 'jpg' || $ext === 'jpeg' ? 'image/jpeg' : ($ext === 'webp' ? 'image/webp' : 'application/octet-stream'));
    }
    if (strpos($mime, 'image/') !== 0) {
        return new WP_Error('invalid_mime', 'URL does not point to an image', array('status' => 400));
    }

    $base64 = base64_encode($body);
    $data_url = 'data:' . esc_attr($mime) . ';base64,' . $base64;
    return array(
        'success' => true,
        'mime' => $mime,
        'data_url' => $data_url,
    );
}

// Cache clearing function
function clear_store_cache($request) {
    global $wpdb;
    
    // Delete all store transients (including linked products cache)
    $wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_store_%' OR option_name LIKE '_transient_timeout_store_%'");
    
    return array(
        'success' => true,
        'message' => 'Cache cleared successfully (including linked products)'
    );
}

// Debug logs endpoint
function get_debug_logs($request) {
    // Get the last 200 lines of debug log
    $log_file = WP_CONTENT_DIR . '/debug.log';
    
    if (!file_exists($log_file)) {
        return array(
            'success' => false,
            'message' => 'Debug log file not found. Make sure WP_DEBUG_LOG is enabled in wp-config.php',
            'log_file_path' => $log_file
        );
    }
    
    // Read the last 200 lines
    $lines = array();
    $file = new SplFileObject($log_file, 'r');
    $file->seek(PHP_INT_MAX);
    $last_line = $file->key();
    $start_line = max(0, $last_line - 200);
    
    $file->seek($start_line);
    while (!$file->eof()) {
        $line = $file->current();
        if (strpos($line, 'Store Debug') !== false) {
            $lines[] = trim($line);
        }
        $file->next();
    }
    
    return array(
        'success' => true,
        'logs' => $lines,
        'total_lines' => count($lines),
        'log_file' => $log_file
    );
}

// Validate Stock Before Payment Endpoint
function validate_stock_before_payment($request) {
    global $wpdb;
    
    $order_data = $request->get_json_params();
    
    $wpdb->query('START TRANSACTION');
    
    try {
        if (isset($order_data['line_items']) && is_array($order_data['line_items']) && count($order_data['line_items']) > 0) {
            foreach ($order_data['line_items'] as $item) {
                // Use variation_id if present for stock check, otherwise product_id
                $check_id = !empty($item['variation_id']) ? $item['variation_id'] : $item['product_id'];
                $quantity = $item['quantity'];
                
                // Check if stock is managed for this product/variation
                $manage_stock_row = $wpdb->get_row($wpdb->prepare(
                    "SELECT meta_value FROM {$wpdb->postmeta} 
                     WHERE post_id = %d AND meta_key = '_manage_stock'",
                    $check_id
                ));
                
                $is_stock_managed = $manage_stock_row && $manage_stock_row->meta_value === 'yes';
                
                if ($is_stock_managed) {
                    // Lock the product stock row for update
                    $stock_row = $wpdb->get_row($wpdb->prepare(
                        "SELECT meta_value FROM {$wpdb->postmeta} 
                         WHERE post_id = %d AND meta_key = '_stock' 
                         FOR UPDATE",
                        $check_id
                    ));
                    
                    $current_stock = $stock_row ? intval($stock_row->meta_value) : 0;
                    
                    if ($current_stock < $quantity) {
                        throw new Exception("Insufficient stock for product ID: {$check_id}. Available: {$current_stock}, Required: {$quantity}");
                    }
                } else {
                     // Stock not managed - just check stock status
                     $stock_status_row = $wpdb->get_row($wpdb->prepare(
                        "SELECT meta_value FROM {$wpdb->postmeta} 
                         WHERE post_id = %d AND meta_key = '_stock_status'",
                        $check_id
                    ));
                    
                    $status = $stock_status_row ? $stock_status_row->meta_value : 'instock';
                    
                    if ($status === 'outofstock') {
                        throw new Exception("Product ID: {$check_id} is out of stock");
                    }
                }
            }
        }
        
        $wpdb->query('COMMIT');
        
        return array(
            'success' => true,
            'message' => 'Stock validated successfully'
        );
        
    } catch (Exception $e) {
        $wpdb->query('ROLLBACK');
        return new WP_Error('insufficient_stock', $e->getMessage(), array('status' => 400));
    }
}

// PayFast Payment Handler - UPDATED with stock validation
function handle_payfast_payment($request) {
    global $wpdb;
    
    $order_data = $request->get_json_params();
    
    // âœ… VALIDATE STOCK WITH DATABASE LOCKING (only when line_items provided)
    // âš ï¸ IMPORTANT: We VALIDATE but do NOT reduce stock here
    // Stock will be reduced only when payment is confirmed (in ITN handler on COMPLETE)
    // This prevents products from appearing out of stock before payment is confirmed
    $wpdb->query('START TRANSACTION');
    
    try {
        // Validate stock only if the client provided line_items
        if (isset($order_data['line_items']) && is_array($order_data['line_items']) && count($order_data['line_items']) > 0) {
        foreach ($order_data['line_items'] as $item) {
            // Use variation_id if present for stock check, otherwise product_id
            $check_id = !empty($item['variation_id']) ? $item['variation_id'] : $item['product_id'];
            $quantity = $item['quantity'];
            
            // Check if stock is managed for this product/variation
            $manage_stock_row = $wpdb->get_row($wpdb->prepare(
                "SELECT meta_value FROM {$wpdb->postmeta} 
                 WHERE post_id = %d AND meta_key = '_manage_stock'",
                $check_id
            ));
            
            $is_stock_managed = $manage_stock_row && $manage_stock_row->meta_value === 'yes';
            
            if ($is_stock_managed) {
                // Lock the product stock row for update (prevents concurrent purchases)
                $stock_row = $wpdb->get_row($wpdb->prepare(
                    "SELECT meta_value FROM {$wpdb->postmeta} 
                     WHERE post_id = %d AND meta_key = '_stock' 
                     FOR UPDATE",
                    $check_id
                ));
                
                // If stock row missing but managed, assume 0
                $current_stock = $stock_row ? intval($stock_row->meta_value) : 0;
                
                // âœ… VALIDATE stock availability (do NOT reduce yet)
                if ($current_stock < $quantity) {
                    throw new Exception("Insufficient stock for product ID: {$check_id}. Available: {$current_stock}, Required: {$quantity}");
                }
                
                // Log the validation (not reduction)
                error_log("Store Debug: Stock validated for product {$check_id}: Available: {$current_stock}, Required: {$quantity}");
            } else {
                 // Stock not managed - just check stock status
                 $stock_status_row = $wpdb->get_row($wpdb->prepare(
                    "SELECT meta_value FROM {$wpdb->postmeta} 
                     WHERE post_id = %d AND meta_key = '_stock_status'",
                    $check_id
                ));
                
                $status = $stock_status_row ? $stock_status_row->meta_value : 'instock';
                
                if ($status === 'outofstock') {
                    throw new Exception("Product ID: {$check_id} is out of stock");
                }
                 error_log("Store Debug: Stock skipped for unmanaged product {$check_id} (Status: {$status})");
            }
        }
        }
        
        // Commit the transaction (validation only, no stock reduction)
        $wpdb->query('COMMIT');

        // âœ… Stock validation passed (or skipped) - proceed to PayFast
        
        // Split customer name into first and last name
        $customer_name = trim($order_data['customer_name']);
        $name_parts = explode(' ', $customer_name, 2);
        $first_name = $name_parts[0];
        $last_name = isset($name_parts[1]) ? $name_parts[1] : '';
        
        // Log the payment request for debugging
        error_log("Store Debug: Creating PayFast payment - Order ID: {$order_data['order_id']}, Amount: {$order_data['amount']}, Customer: {$customer_name}");
        
        // Append order ID to return_url so PaymentSuccess page can update status
        $return_base = $order_data['return_url'];
        $return_url = add_query_arg('order', $order_data['order_id'], $return_base);
        $payfast_data = array(
            'merchant_id' => PAYFAST_MERCHANT_ID,
            'merchant_key' => PAYFAST_MERCHANT_KEY,
            'return_url' => $return_url,
            'cancel_url' => $order_data['cancel_url'],
            'notify_url' => home_url('/wc-api/payfast'),
            'name_first' => $first_name,
            'name_last' => $last_name,
            'email_address' => $order_data['customer_email'],
            'amount' => $order_data['amount'],
            'item_name' => $order_data['item_name'],
            'custom_str1' => $order_data['order_id'],
        );
        
        // Generate signature
        $signature = generate_payfast_signature($payfast_data);
        $payfast_data['signature'] = $signature;
        
        // Log the PayFast data being sent (without sensitive info)
        error_log("Store Debug: PayFast data prepared - Fields: " . implode(', ', array_keys($payfast_data)) . ", Signature: " . substr($signature, 0, 10) . "...");
        
        // Provide an ordered field list (exact insertion order) so the frontend
        // can render inputs verbatim without transformation or reordering
        $ordered_fields = array();
        foreach ($payfast_data as $k => $v) {
            $ordered_fields[] = array('key' => (string)$k, 'value' => (string)$v);
        }
        
        // NOTE: Use the defined PAYFAST_API_URL constant
        return array(
            'success' => true,
            'payment_url' => PAYFAST_API_URL,
            'form_data' => $payfast_data,
            'ordered_fields' => $ordered_fields,
        );
        
    } catch (Exception $e) {
        // Rollback transaction on error
        $wpdb->query('ROLLBACK');
        
        // Log the error
        error_log("Store Debug: Stock validation failed - " . $e->getMessage());
        
        return array(
            'success' => false,
            'error' => 'insufficient_stock',
            'message' => 'Sorry, one or more items are no longer available',
            'redirect_url' => '/payment-failure?reason=out_of_stock'
        );
    }
}

function normalize_sa_zone($zone) {
    $map = array(
        'Gauteng' => 'GP', 'gp' => 'GP', 'GAUTENG' => 'GP', 'GP' => 'GP',
        'Western Cape' => 'WC', 'WC' => 'WC',
        'KwaZulu-Natal' => 'KZN', 'KwaZulu Natal' => 'KZN', 'KZN' => 'KZN',
        'Eastern Cape' => 'EC', 'EC' => 'EC',
        'Free State' => 'FS', 'FS' => 'FS',
        'Limpopo' => 'LP', 'LP' => 'LP',
        'Mpumalanga' => 'MP', 'MP' => 'MP',
        'North West' => 'NW', 'NW' => 'NW',
        'Northern Cape' => 'NC', 'NC' => 'NC',
    );
    $t = is_string($zone) ? trim($zone) : '';
    if ($t === '') return 'GP';
    if (isset($map[$t])) return $map[$t];
    $upper = strtoupper($t);
    if (isset($map[$upper])) return $map[$upper];
    return $t;
}

// BobGo Shipping Handler
function handle_bobgo_shipping($request) {
    $shipping_data = $request->get_json_params();
    // Log incoming request payload (limited)
    if ($shipping_data) {
        $log_payload = json_encode($shipping_data);
        if (strlen($log_payload) > 2000) {
            $log_payload = substr($log_payload, 0, 2000) . '...';
        }
        error_log('[BobGo] Incoming shipping payload: ' . $log_payload);
    } else {
        error_log('[BobGo] No shipping payload received');
    }
    
    $origin = isset($shipping_data['collection_address']) ? $shipping_data['collection_address'] : null;
    if (!$origin || !is_array($origin)) {
        $store_addr = get_option('woocommerce_store_address', '');
        $store_addr_2 = get_option('woocommerce_store_address_2', '');
        $store_city = get_option('woocommerce_store_city', '');
        $store_postcode = get_option('woocommerce_store_postcode', '');
        $default_country = get_option('woocommerce_default_country', 'ZA');
        $country_parts = explode(':', $default_country);
        $country = $country_parts[0] ?: 'ZA';
        $state_code = isset($country_parts[1]) ? $country_parts[1] : null;
        $origin = array(
            'street_address' => trim($store_addr . ($store_addr_2 ? ', ' . $store_addr_2 : '')),
            'local_area' => null,
            'city' => $store_city,
            'zone' => $state_code ?: 'GP',
            'country' => $country,
            'code' => $store_postcode,
            'company' => get_bloginfo('name'),
        );
        $shipping_data['collection_address'] = $origin;
    }
    
    $dest = isset($shipping_data['delivery_address']) ? $shipping_data['delivery_address'] : null;
    if ($dest && is_array($dest)) {
        $dest_zone = isset($dest['zone']) ? $dest['zone'] : (isset($dest['state']) ? $dest['state'] : null);
        $dest['zone'] = normalize_sa_zone($dest_zone);
        if (!isset($dest['country']) || !$dest['country']) {
            $dest['country'] = 'ZA';
        }
        if (!isset($dest['local_area']) || !$dest['local_area']) {
            $dest['local_area'] = isset($dest['suburb']) && $dest['suburb'] ? $dest['suburb'] : (isset($dest['city']) ? $dest['city'] : '');
        }
        $shipping_data['delivery_address'] = $dest;
    }
    
    $parcels = isset($shipping_data['parcels']) && is_array($shipping_data['parcels']) ? $shipping_data['parcels'] : array();
    $enriched = array();
    foreach ($parcels as $p) {
        $sku = isset($p['sku']) ? $p['sku'] : null;
        $weight = isset($p['weight']) ? floatval($p['weight']) : null;
        $length = isset($p['length']) ? floatval($p['length']) : null;
        $width = isset($p['width']) ? floatval($p['width']) : null;
        $height = isset($p['height']) ? floatval($p['height']) : null;
        if ((!$weight || !$length || !$width || !$height) && $sku) {
            $product = wc_get_product(intval($sku));
            if ($product) {
                $w = $product->get_weight();
                $l = $product->get_length();
                $w2 = $product->get_width();
                $h = $product->get_height();
                if (!$weight && $w !== '') $weight = floatval($w);
                if (!$length && $l !== '') $length = floatval($l);
                if (!$width && $w2 !== '') $width = floatval($w2);
                if (!$height && $h !== '') $height = floatval($h);
            }
        }
        if (!$weight) $weight = 1.0;
        if (!$length) $length = 10.0;
        if (!$width) $width = 10.0;
        if (!$height) $height = 10.0;
        $p['weight'] = $weight;
        $p['length'] = $length;
        $p['width'] = $width;
        $p['height'] = $height;
        $enriched[] = $p;
    }
    $shipping_data['parcels'] = $enriched;
    
    if (!isset($shipping_data['delivery_address']) || empty($shipping_data['parcels'])) {
        return array(
            'success' => false,
            'error' => 'invalid_payload',
            'message' => 'Missing address or parcels'
        );
    }
    
    $bobgo_payload = array(
        'collection_address' => $shipping_data['collection_address'],
        'delivery_address' => $shipping_data['delivery_address'],
        'items' => array_map(function($p) {
            return array(
                'sku' => isset($p['sku']) ? (string)$p['sku'] : null,
                'description' => isset($p['description']) ? $p['description'] : '',
                'quantity' => isset($p['quantity']) ? intval($p['quantity']) : 1,
                'value' => isset($p['value']) ? floatval($p['value']) : 0.0,
                'declared_value' => isset($p['value']) ? floatval($p['value']) : 0.0,
                'weight' => isset($p['weight']) ? floatval($p['weight']) : 1.0,
                'length' => isset($p['length']) ? floatval($p['length']) : 10.0,
                'width' => isset($p['width']) ? floatval($p['width']) : 10.0,
                'height' => isset($p['height']) ? floatval($p['height']) : 10.0,
            );
        }, $enriched),
    );
    
    $enriched_log = json_encode($bobgo_payload);
    if (strlen($enriched_log) > 2000) {
        $enriched_log = substr($enriched_log, 0, 2000) . '...';
    }
    error_log('[BobGo] Enriched shipping payload: ' . $enriched_log);

    // Use the defined BOBGO_API_URL constant
    $response = wp_remote_post(BOBGO_API_URL, array(
        'headers' => array(
            'Authorization' => 'Bearer ' . BOBGO_API_KEY,
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
        ),
        'body' => json_encode($bobgo_payload),
        'timeout' => 30,
    ));
    
    if (is_wp_error($response)) {
        error_log('[BobGo] wp_remote_post error: ' . $response->get_error_message());
        return new WP_Error('bobgo_error', $response->get_error_message(), array('status' => 500));
    }
    
    $code = wp_remote_retrieve_response_code($response);
    $body = wp_remote_retrieve_body($response);
    error_log('[BobGo] Response code: ' . $code);
    error_log('[BobGo] Response body (truncated): ' . substr($body, 0, 2000));

    if ($code < 200 || $code >= 300) {
        $decoded_err = json_decode($body, true);
        $err_message = 'BobGo returned HTTP ' . $code;
        if (is_array($decoded_err)) {
            if (isset($decoded_err['message']) && is_string($decoded_err['message'])) {
                $err_message = $decoded_err['message'];
            } elseif (isset($decoded_err['errors']) && is_array($decoded_err['errors'])) {
                $err_message = implode('; ', array_map(function($e) {
                    return is_string($e) ? $e : json_encode($e);
                }, $decoded_err['errors']));
            }
        }
        return array(
            'success' => false,
            'error' => 'Failed to load shipping rates',
            'message' => $err_message,
            'details' => is_array($decoded_err) ? $decoded_err : $body,
        );
    }

    $decoded = json_decode($body, true);
    if ($decoded === null && json_last_error() !== JSON_ERROR_NONE) {
        error_log('[BobGo] JSON decode error: ' . json_last_error_msg());
        return array(
            'success' => false,
            'error' => 'Failed to load shipping rates',
            'message' => 'Invalid JSON response from BobGo'
        );
    }

    $raw_rates = array();
    if (is_array($decoded)) {
        if (isset($decoded['rates']) && is_array($decoded['rates'])) {
            $raw_rates = $decoded['rates'];
        } elseif (isset($decoded['data']) && is_array($decoded['data']) && isset($decoded['data']['rates']) && is_array($decoded['data']['rates'])) {
            $raw_rates = $decoded['data']['rates'];
        } elseif (isset($decoded[0]) && is_array($decoded[0])) {
            $raw_rates = $decoded;
        }
    }

    $normalized = array();
    foreach ($raw_rates as $rate) {
        $nr = array();
        $nr['service_name'] = isset($rate['service_name']) ? $rate['service_name'] : (isset($rate['serviceName']) ? $rate['serviceName'] : 'Shipping');
        $nr['service_code'] = isset($rate['service_code']) ? $rate['service_code'] : (isset($rate['serviceCode']) ? $rate['serviceCode'] : '');
        if (isset($rate['carrier_code']) || isset($rate['carrierCode'])) {
            $nr['carrier_code'] = isset($rate['carrier_code']) ? $rate['carrier_code'] : $rate['carrierCode'];
        }
        if (isset($rate['carrier_name']) || isset($rate['carrierName'])) {
            $nr['carrier_name'] = isset($rate['carrier_name']) ? $rate['carrier_name'] : $rate['carrierName'];
        }
        $price_candidates = array('rate','price','total','amount','cost');
        $price_value = 0.0;
        foreach ($price_candidates as $key) {
            if (isset($rate[$key])) {
                $price_value = floatval($rate[$key]);
                break;
            }
        }
        $nr['rate'] = $price_value;
        $nr['rate_currency'] = isset($rate['rate_currency']) ? $rate['rate_currency'] : (isset($rate['currency']) ? $rate['currency'] : 'ZAR');
        if (isset($rate['min_delivery_days']) || isset($rate['minDeliveryDays'])) {
            $md = isset($rate['min_delivery_days']) ? $rate['min_delivery_days'] : $rate['minDeliveryDays'];
            if ($md !== null && $md !== '' && is_numeric($md)) {
                $nr['min_delivery_days'] = intval($md);
            }
        }
        if (isset($rate['max_delivery_days']) || isset($rate['maxDeliveryDays'])) {
            $xd = isset($rate['max_delivery_days']) ? $rate['max_delivery_days'] : $rate['maxDeliveryDays'];
            if ($xd !== null && $xd !== '' && is_numeric($xd)) {
                $nr['max_delivery_days'] = intval($xd);
            }
        }
        if (isset($rate['delivery_date_from']) || isset($rate['deliveryDateFrom'])) {
            $nr['delivery_date_from'] = isset($rate['delivery_date_from']) ? $rate['delivery_date_from'] : $rate['deliveryDateFrom'];
        }
        if (isset($rate['delivery_date_to']) || isset($rate['deliveryDateTo'])) {
            $nr['delivery_date_to'] = isset($rate['delivery_date_to']) ? $rate['delivery_date_to'] : $rate['deliveryDateTo'];
        }
        $normalized[] = $nr;
    }
    error_log('[BobGo] Normalized rates: ' . substr(json_encode($normalized), 0, 1000));

    if (empty($normalized)) {
        return array(
            'success' => false,
            'error' => 'No rates available',
            'message' => isset($decoded['message']) ? $decoded['message'] : 'No rates returned'
        );
    }

    return array(
        'success' => true,
        'rates' => $normalized,
        'message' => 'Shipping rates loaded'
    );
}

// ============================================================================
// ✅ NEW: DELIVERY OPTIONS (Delivery Options by KaizenTech)
// Plugin: kaizentech-delivery-options/delivery-options-kaizentech.php
// Docs:   kaizentech-delivery-options/api-documentation.md
//
// GET  /wp-json/store/v1/delivery/options   – list enabled options + store location
// POST /wp-json/store/v1/delivery/calculate – cost for option_id + lat/lng
//
// Curl (options):
//   curl -X GET https://wp-api.kaizentech.co.za/wp-json/store/v1/delivery/options -H "X-API-Key: store-react-2024"
//
// Curl (calculate):
//   curl -X POST https://wp-api.kaizentech.co.za/wp-json/store/v1/delivery/calculate -H "X-API-Key: store-react-2024" -H "Content-Type: application/json" -d "{\"option_id\":\"del_per_km\",\"lat\":-33.918861,\"lng\":18.423300,\"cart_subtotal\":350}"
// ============================================================================

/**
 * Return all enabled delivery options, store location, and default pricing.
 * Requires Delivery Options by KaizenTech plugin.
 */
function ktdo_get_delivery_options_secure($request) {
    if (!function_exists('ktdo_get_all_for_api')) {
        return array(
            'success' => true,
            'store'   => null,
            'options' => array(),
            'pricing' => null,
        );
    }

    $data = ktdo_get_all_for_api();

    return array(
        'success' => true,
        'store'   => $data['store'],
        'options' => $data['options'],
        'pricing' => $data['pricing'],
    );
}

/**
 * Calculate delivery cost for a given option and destination coordinates.
 * Requires Delivery Options by KaizenTech plugin.
 *
 * @param WP_REST_Request $request Contains option_id, lat, lng, cart_subtotal.
 * @return array
 */
function ktdo_calculate_delivery_secure($request) {
    if (!function_exists('ktdo_calculate_delivery_cost')) {
        return array(
            'success'   => false,
            'available' => false,
            'cost'      => 0,
            'message'   => 'Delivery Options plugin not active.',
        );
    }

    $data = $request->get_json_params();
    if (!is_array($data)) $data = array();

    $option_id     = sanitize_text_field($data['option_id'] ?? $request->get_param('option_id') ?? '');
    $lat           = isset($data['lat']) ? floatval($data['lat']) : floatval($request->get_param('lat'));
    $lng           = isset($data['lng']) ? floatval($data['lng']) : floatval($request->get_param('lng'));
    $cart_subtotal = isset($data['cart_subtotal']) ? floatval($data['cart_subtotal']) : floatval($request->get_param('cart_subtotal'));

    if (empty($option_id)) {
        return array(
            'success'   => false,
            'available' => false,
            'cost'      => 0,
            'message'   => 'Delivery option ID is required.',
        );
    }

    $option = ktdo_get_option_by_id($option_id);
    if ($option && $option['type'] === 'per_km' && (!$lat || !$lng)) {
        return array(
            'success'   => false,
            'available' => false,
            'cost'      => 0,
            'message'   => 'Latitude and longitude are required for per-kilometre delivery.',
        );
    }

    $result = ktdo_calculate_delivery_cost($option_id, $lat, $lng, $cart_subtotal);

    return array(
        'success'        => $result['success'],
        'available'      => $result['available'],
        'option_id'      => $option_id,
        'cost'           => $result['cost'],
        'cost_formatted' => wc_price($result['cost']),
        'distance_km'    => $result['distance_km'],
        'message'        => $result['message'],
    );
}

// Helper function to get the active brand taxonomy
function get_active_brand_taxonomy() {
    // Cache the result
    static $active_taxonomy = null;
    
    if ($active_taxonomy !== null) {
        return $active_taxonomy;
    }
    
    // Check all possible brand taxonomies in order of likelihood
    $possible_taxonomies = array(
        'product_brand',      // WooCommerce Brands (default)
        'pa_brand',          // Product Attribute Brand
        'pwb-brand',         // Perfect WooCommerce Brands
        'yith_product_brand', // YITH WooCommerce Brands
        'berocket_brand',    // BeRocket Brands
    );
    
    foreach ($possible_taxonomies as $taxonomy) {
        if (taxonomy_exists($taxonomy)) {
            $active_taxonomy = $taxonomy;
            error_log('Store Debug: Found active brand taxonomy: ' . $taxonomy);
            return $active_taxonomy;
        }
    }
    
    // DEBUG: Log all registered taxonomies
    $all_taxonomies = get_taxonomies(array('object_type' => array('product')));
    error_log('Store Debug: All product taxonomies: ' . print_r($all_taxonomies, true));
    
    // No brand taxonomy found
    $active_taxonomy = false;
    error_log('Store Debug: No brand taxonomy found!');
    return $active_taxonomy;
}

// Build colour swatches from WooCommerce attribute term meta (plugins store hex in term meta)
function _build_variation_attribute_swatches($variation_attributes) {
    if (empty($variation_attributes) || !is_array($variation_attributes)) {
        return null;
    }
    $swatches = array();
    foreach ($variation_attributes as $taxonomy => $options) {
        $tax_lower = strtolower($taxonomy);
        if (strpos($tax_lower, 'colour') === false && strpos($tax_lower, 'color') === false) {
            continue;
        }
        if (!is_array($options)) {
            continue;
        }
        $term_hex_map = array();
        foreach ($options as $opt) {
            $opt = trim((string) $opt);
            if ($opt === '') continue;
            $term = get_term_by('slug', $opt, $taxonomy);
            if (!$term || is_wp_error($term)) {
                $term = get_term_by('name', $opt, $taxonomy);
            }
            if (!$term || is_wp_error($term)) {
                continue;
            }
            $hex = _get_term_color_hex($term->term_id, $taxonomy);
            if ($hex) {
                $term_hex_map[$opt] = $hex;
                $term_hex_map[$term->slug] = $hex;
                $term_hex_map[$term->name] = $hex;
                $term_hex_map[strtolower($opt)] = $hex;
            }
        }
        if (!empty($term_hex_map)) {
            $swatches[$taxonomy] = array(
                'type' => 'color',
                'swatches' => $term_hex_map,
            );
        }
    }
    return empty($swatches) ? null : $swatches;
}

function _get_term_color_hex($term_id, $taxonomy) {
    $meta_keys = array(
        'product_attribute_color',
        $taxonomy . '_value',
        $taxonomy . '_yith_wccl_value',
        'color',
    );
    $meta_keys = apply_filters('soochuh_product_attribute_color_meta_keys', $meta_keys, $term_id, $taxonomy);
    foreach ($meta_keys as $key) {
        $val = get_term_meta($term_id, $key, true);
        if (!is_string($val)) continue;
        $val = trim($val);
        if (preg_match('/^#[0-9a-fA-F]{3,8}$/', $val)) {
            return $val;
        }
        if (preg_match('/^[0-9a-fA-F]{3,8}$/', $val)) {
            return '#' . $val;
        }
    }
    $hex = apply_filters('soochuh_get_term_color_hex', null, $term_id, $taxonomy);
    return is_string($hex) && preg_match('/^#[0-9a-fA-F]{3,8}$/', trim($hex)) ? trim($hex) : null;
}

// Helper function to format a single product - FIXED with better brand detection
function format_product_data($product) {
    if (!$product) {
        return null;
    }
    
    // Get all product images
    $images = array();
    
    // Main image
    $image_id = $product->get_image_id();
    if ($image_id) {
        $images[] = array(
            'id' => $image_id,
            'src' => wp_get_attachment_url($image_id),
            'name' => get_post_field('post_title', $image_id),
            'alt' => get_post_meta($image_id, '_wp_attachment_image_alt', true)
        );
    }
    
    // Gallery images
    $gallery_ids = $product->get_gallery_image_ids();
    foreach ($gallery_ids as $gallery_id) {
        $images[] = array(
            'id' => $gallery_id,
            'src' => wp_get_attachment_url($gallery_id),
            'name' => get_post_field('post_title', $gallery_id),
            'alt' => get_post_meta($gallery_id, '_wp_attachment_image_alt', true)
        );
    }
    
    // Get categories
    $categories = array();
    $product_categories = $product->get_category_ids();
    foreach ($product_categories as $cat_id) {
        $term = get_term($cat_id, 'product_cat');
        if ($term && !is_wp_error($term)) {
            $categories[] = array(
                'id' => $term->term_id,
                'name' => $term->name,
                'slug' => $term->slug
            );
        }
    }
    
    // Get attributes
    $attributes = array();
    $product_attributes = $product->get_attributes();
    foreach ($product_attributes as $attribute) {
        // Ensure options is always an array of strings
        $options = $attribute->get_options();
        if (!is_array($options)) {
            // If options is a string (pipe-separated), convert to array
            if (is_string($options)) {
                $options = array_map('trim', explode('|', $options));
            } else {
                $options = array();
            }
        }
        // Filter out empty options and ensure all are strings
        $options = array_filter(array_map('strval', $options), function($opt) {
            return !empty(trim($opt));
        });
        
        $attributes[] = array(
            'id' => $attribute->get_id(),
            'name' => $attribute->get_name(),
            'position' => $attribute->get_position(),
            'visible' => $attribute->get_visible(),
            'variation' => $attribute->get_variation(),
            'options' => array_values($options) // Re-index array
        );
    }

    // If variable product, capture variation attribute map & defaults
    $variation_attributes = array();
    $variation_attribute_swatches = null;
    $default_attributes = array();
    $has_variations = false;
    $min_price = null;
    $max_price = null;
    $variations_list = null;
    if ($product->is_type('variable')) {
        $has_variations = true;
        // Build full variations list first (needed for derivation)
        $variation_ids = $product->get_children();
        $vars = array();
        foreach ($variation_ids as $vid) {
            $vars[] = format_variation_data(wc_get_product($vid));
        }
        if (!empty($vars)) {
            $variations_list = $vars;
        }
        // Derive variation_attributes from variations (source of truth) - get_variation_attributes()
        // can be empty/inconsistent when product has colour + size.
        $variation_attributes = array();
        foreach ($vars as $v) {
            $attrs = isset($v['attributes']) ? $v['attributes'] : array();
            foreach ($attrs as $key => $val) {
                if ($val === '' || $val === null) continue;
                $k = preg_replace('/^attribute_/', '', $key);
                if (!isset($variation_attributes[$k])) $variation_attributes[$k] = array();
                if (!in_array($val, $variation_attributes[$k], true)) {
                    $variation_attributes[$k][] = $val;
                }
            }
        }
        if (empty($variation_attributes)) {
            $variation_attributes = $product->get_variation_attributes();
        }
        // Build variation_attribute_swatches from WooCommerce attribute term meta (hex from plugins)
        $variation_attribute_swatches = _build_variation_attribute_swatches($variation_attributes);
        // Defaults selected on the product
        $default_attributes = $product->get_default_attributes();
        // Price range across variations
        $min_price = wc_get_price_to_display($product, array('price' => (float) $product->get_variation_price('min', true)));
        $max_price = wc_get_price_to_display($product, array('price' => (float) $product->get_variation_price('max', true)));
    }
    
    // Get linked products (cross-sells and upsells)
    $upsell_ids = $product->get_upsell_ids();
    $cross_sell_ids = $product->get_cross_sell_ids();
    
    // IMPROVED: Get brand from the active taxonomy
    $brand = null;
    $active_taxonomy = get_active_brand_taxonomy();
    
    error_log('Store Debug - Product ID ' . $product->get_id() . ': Active taxonomy = ' . ($active_taxonomy ?: 'NONE'));
    
    if ($active_taxonomy) {
        $terms = get_the_terms($product->get_id(), $active_taxonomy);
        error_log('Store Debug - Product ID ' . $product->get_id() . ': Terms = ' . print_r($terms, true));
        if ($terms && !is_wp_error($terms) && !empty($terms)) {
            $brand = $terms[0]->name;
            error_log('Store Debug - Product ID ' . $product->get_id() . ': Brand from taxonomy = ' . $brand);
        }
    }
    
    // Fallback: Try to get from product attributes
    if (!$brand) {
        $brand_attr = $product->get_attribute('brand') ?: $product->get_attribute('pa_brand');
        if ($brand_attr) {
            $brand = $brand_attr;
            error_log('Store Debug - Product ID ' . $product->get_id() . ': Brand from attribute = ' . $brand);
        }
    }
    
    error_log('Store Debug - Product ID ' . $product->get_id() . ': Final brand = ' . ($brand ?: 'NULL'));

    // Product addons (Product Customisation by KaizenTech, WowAddons, etc.)
    $product_addons = _get_product_addons_for_api($product);
    $customisation_profile = null;
    if ($product_addons && function_exists('ktpc_get_profile_for_product')) {
        $prof = ktpc_get_profile_for_product($product->get_id());
        if ($prof && !empty($prof['name'])) {
            $customisation_profile = array('id' => $prof['id'], 'name' => $prof['name']);
        }
    }

    // Stock for simple products: same postmeta logic as validate_stock_before_payment
    // (_manage_stock==='yes' → _stock, else _stock_status; default 'instock' when missing)
    $stock_status = $product->get_stock_status();
    $stock_quantity = $product->get_stock_quantity();
    if ($product->is_type('simple')) {
        $pid = (int) $product->get_id();
        $manage = get_post_meta($pid, '_manage_stock', true);
        if ($manage === 'yes') {
            $s = get_post_meta($pid, '_stock', true);
            $stock_quantity = (is_numeric($s) || $s === '0' || $s === 0) ? (int) $s : 0;
            $stock_status = ($stock_quantity > 0) ? 'instock' : 'outofstock';
        } else {
            $raw = get_post_meta($pid, '_stock_status', true);
            $stock_status = ($raw === 'outofstock' || $raw === 'onbackorder') ? $raw : 'instock';
            $stock_quantity = null;
        }
    }

    return array(
        'id' => $product->get_id(),
        'name' => $product->get_name(),
        'type' => $product->get_type(),
        'slug' => $product->get_slug(),
        'permalink' => $product->get_permalink(),
        'price' => $product->get_price(),
        'regular_price' => $product->get_regular_price(),
        'sale_price' => $product->get_sale_price(),
        'on_sale' => $product->is_on_sale(),
        'description' => $product->get_description(),
        'short_description' => $product->get_short_description(),
        'stock_status' => $stock_status,
        'stock_quantity' => $stock_quantity,
		'sold_individually' => $product->get_sold_individually(),
        'images' => $images,
        'categories' => $categories,
        // Tags: include id, name, slug for client-side filtering and display
        'tags' => (function() use ($product) {
            $tag_ids = method_exists($product, 'get_tag_ids') ? $product->get_tag_ids() : array();
            $tags = array();
            foreach ($tag_ids as $tid) {
                $term = get_term($tid, 'product_tag');
                if ($term && !is_wp_error($term)) {
                    $tags[] = array(
                        'id' => $term->term_id,
                        'name' => $term->name,
                        'slug' => $term->slug,
                    );
                }
            }
            return $tags;
        })(),
        'attributes' => $attributes,
        // Variation-related metadata (no heavy variation list by default)
        'has_variations' => $has_variations,
        'variation_attributes' => $variation_attributes,
        'variation_attribute_swatches' => isset($variation_attribute_swatches) ? $variation_attribute_swatches : null,
        'default_attributes' => $default_attributes,
        'price_range' => ($has_variations ? array('min' => $min_price, 'max' => $max_price) : null),
        'variations' => $variations_list,
        'brand' => $brand,
        'product_addons' => $product_addons,
        'customisation_profile' => $customisation_profile,
        // Linked products for cross-sells and upsells
        'upsell_ids' => $upsell_ids,
        'cross_sell_ids' => $cross_sell_ids,
    );
}

/**
 * Get product addons for API (Product Customisation by KaizenTech, WowAddons, etc.)
 * Products in allowed categories (e.g. Customisable) get addons from Product Customisation plugin.
 * Addons with the same 'price_group' share one price: charge once if customer uses any in that group.
 * Frontend: group addons by price_group for display (e.g. card/block with shared price label).
 */
function _get_product_addons_for_api($product) {
    if (!$product) return null;
    $pid = (int) $product->get_id();
    $addons = array();

    // 1. Product Customisation by KaizenTech (product-customisation-kaizentech.php)
    if (function_exists('ktpc_is_allowed_product') && function_exists('ktpc_get_customisation_options') && ktpc_is_allowed_product($pid)) {
        $options = ktpc_get_customisation_options($pid);
        foreach ($options as $opt) {
            $type = isset($opt['type']) ? $opt['type'] : 'text';
            if ($type !== 'file' && $type !== 'radio') {
                $type = 'text';
            }
            $addon = array(
                'id'        => $opt['id'],
                'name'      => $opt['id'],
                'label'     => $opt['label'],
                'type'      => $type,
                'required'  => false,
                'price'     => (float) (isset($opt['price']) ? $opt['price'] : 0),
                'options'   => $type === 'radio' && isset($opt['options']) && is_array($opt['options']) ? $opt['options'] : array(),
            );
            if (isset($opt['placeholder']) && $opt['placeholder'] !== '') {
                $addon['placeholder'] = $opt['placeholder'];
            } elseif ($type === 'text') {
                $addon['placeholder'] = 'e.g. ' . strtolower($opt['label']);
            }
            if (isset($opt['price_group']) && $opt['price_group'] !== '') {
                $addon['price_group'] = $opt['price_group'];
            }
            $addons[] = $addon;
        }
    }

    // 2. Filter for other plugins (WowAddons, etc.)
    $addons = apply_filters('soochuh_product_addons', $addons, $product);

    if (empty($addons) || !is_array($addons)) return null;
    return _normalize_product_addons($addons);
}

function _normalize_product_addons($addons) {
    $normalized = array();
    foreach ($addons as $idx => $addon) {
        $a = is_array($addon) ? $addon : (array) $addon;
        $type = isset($a['type']) ? $a['type'] : (isset($a['field_type']) ? $a['field_type'] : 'text');
        if (in_array(strtolower($type), array('file', 'file_upload', 'upload', 'image_upload'))) {
            $type = 'file';
        } elseif (strtolower($type) !== 'radio') {
            $type = 'text';
        }
        $options = isset($a['options']) ? $a['options'] : (isset($a['choices']) ? $a['choices'] : array());
        $field = array(
            'id'        => isset($a['id']) ? $a['id'] : (isset($a['name']) ? $a['name'] : $idx),
            'name'      => isset($a['name']) ? $a['name'] : (isset($a['label']) ? sanitize_title($a['label']) : 'addon_' . $idx),
            'label'     => isset($a['label']) ? $a['label'] : (isset($a['name']) ? $a['name'] : ''),
            'type'      => $type,
            'required'  => !empty($a['required']),
            'price'     => isset($a['price']) ? floatval($a['price']) : 0,
            'price_type'=> isset($a['price_type']) ? $a['price_type'] : 'flat_fee',
            'options'   => is_array($options) ? $options : array(),
        );
        if (isset($a['placeholder'])) $field['placeholder'] = $a['placeholder'];
        if (isset($a['description'])) $field['description'] = $a['description'];
        if (isset($a['price_group']) && $a['price_group'] !== '') $field['price_group'] = $a['price_group'];
        $normalized[] = $field;
    }
    return $normalized;
}

// Helper: format a single variation product
// Stock: same postmeta rules as validate_stock_before_payment / handle_payfast_payment:
//   _manage_stock==='yes' → use _stock; in stock if qty>0. Else → use _stock_status; default 'instock'.
// Attributes: resolve pa_* slugs to term names for frontend matching.
function format_variation_data($variation) {
    if (!$variation) { return null; }
    $image_id = $variation->get_image_id();
    $image = null;
    if ($image_id) {
        $image = array(
            'id' => $image_id,
            'src' => wp_get_attachment_url($image_id),
            'name' => get_post_field('post_title', $image_id),
            'alt' => get_post_meta($image_id, '_wp_attachment_image_alt', true)
        );
    }
    // Stock: use SAME postmeta logic as validate_stock_before_payment / handle_payfast_payment
    // (_manage_stock, _stock, _stock_status on the variation post)
    $vid = (int) $variation->get_id();
    $manage = get_post_meta($vid, '_manage_stock', true);
    $is_managed = ($manage === 'yes');
    if ($is_managed) {
        $s = get_post_meta($vid, '_stock', true);
        $stock_quantity = (is_numeric($s) || $s === '0' || $s === 0) ? (int) $s : 0;
        $stock_status = ($stock_quantity > 0) ? 'instock' : 'outofstock';
    } else {
        $stock_quantity = null;
        $raw = get_post_meta($vid, '_stock_status', true);
        $stock_status = ($raw === 'outofstock' || $raw === 'onbackorder') ? $raw : 'instock';
    }

    // Build attributes: keep slugs for consistency with get_variation_attributes()
    // (variation_attributes uses slugs; mismatched names would break colour/size selection)
    $raw_attrs = $variation->get_attributes();
    $attrs = array();
    foreach ($raw_attrs as $k => $v) {
        $key = (string) $k;
        $val = $v;
        if (strpos($key, 'attribute_pa_') === 0) {
            $attrs[$key] = $val;
            $attrs[substr($key, 10)] = $val; // pa_colour from attribute_pa_colour
        } else {
            $attrs[$key] = $val;
            if (strpos($key, 'attribute_') === 0) {
                $attrs[substr($key, 10)] = $val;
            }
        }
    }

    return array(
        'id' => $variation->get_id(),
        'sku' => $variation->get_sku(),
        'attributes' => $attrs,
        'price' => $variation->get_price(),
        'regular_price' => $variation->get_regular_price(),
        'sale_price' => $variation->get_sale_price(),
        'on_sale' => $variation->is_on_sale(),
        'stock_status' => $stock_status,
        'stock_quantity' => $stock_quantity,
        'manage_stock' => $is_managed,
        'image' => $image,
        'permalink' => $variation->get_permalink(),
    );
}

// Helper to find products matching a broad search term (Title, Content, SKU, Category, Brand, Tag)
function find_matching_product_ids($search_term) {
    global $wpdb;
    $search_term = trim($search_term);
    if (empty($search_term)) return array();
    
    $like = '%' . $wpdb->esc_like($search_term) . '%';
    
    // 1. Search Posts (Title, Content, Excerpt)
    $post_ids = $wpdb->get_col($wpdb->prepare(
        "SELECT ID FROM {$wpdb->posts} 
         WHERE (post_title LIKE %s OR post_content LIKE %s OR post_excerpt LIKE %s) 
         AND post_type = 'product' AND post_status = 'publish'",
        $like, $like, $like
    ));
    
    // 2. Search Meta (SKU)
    $sku_ids = $wpdb->get_col($wpdb->prepare(
        "SELECT post_id FROM {$wpdb->postmeta} 
         WHERE meta_key = '_sku' AND meta_value LIKE %s",
        $like
    ));
    
    // 3. Search Taxonomies (Category, Tag, Brand)
    $taxonomies = array('product_cat', 'product_tag');
    $brand_tax = get_active_brand_taxonomy();
    if ($brand_tax) {
        $taxonomies[] = $brand_tax;
    }
    
    // We need to find terms that match the name
    $term_ids = array();
    foreach ($taxonomies as $tax) {
        $terms = get_terms(array(
            'taxonomy' => $tax,
            'name__like' => $search_term,
            'fields' => 'ids',
            'hide_empty' => false
        ));
        if (!is_wp_error($terms) && !empty($terms)) {
            $term_ids = array_merge($term_ids, $terms);
        }
    }
    
    $tax_product_ids = array();
    if (!empty($term_ids)) {
        $tax_product_ids = get_objects_in_term($term_ids, $taxonomies);
    }
    
    // Combine all IDs
    $all_ids = array_unique(array_merge($post_ids, $sku_ids, $tax_product_ids));
    
    return array_map('intval', $all_ids);
}

// WooCommerce Products Handler - SIMPLIFIED (following Invictus Nutrition approach)
function get_products_secure($request) {
    $params = $request->get_params();
    
    // Create cache key from params
    $cache_key = 'store_products_' . md5(serialize($params));
    
    // Check cache first (5 minutes)
    $cached = get_transient($cache_key);
    if ($cached !== false) {
        return $cached;
    }
    
    $args = array(
        'status' => 'publish',
        'limit' => $params['per_page'] ?? 12,
        'page' => $params['page'] ?? 1,
    );
    
    // Category filtering using tax_query
    if (isset($params['category']) && $params['category'] !== '') {
        $category_param = $params['category'];
        
        if (strpos($category_param, ',') !== false) {
            $category_ids = array_map('intval', explode(',', $category_param));
        } else {
            $category_ids = array(intval($category_param));
        }
        
        // Filter out invalid IDs
        $category_ids = array_filter($category_ids, function($id) { return $id > 0; });

        if (!empty($category_ids)) {
            $args['tax_query'] = array(
                array(
                    'taxonomy' => 'product_cat',
                    'field' => 'term_id',
                    'terms' => $category_ids,
                    'operator' => 'IN'
                )
            );
        }
    }
    
    // Search filtering (Broadened to include Categories, Brands, Tags, SKU)
    if (isset($params['search']) && $params['search'] !== '') {
        $search_ids = find_matching_product_ids($params['search']);
        if (empty($search_ids)) {
            // No matches found, force empty result
            $args['include'] = array(0);
        } else {
            $args['include'] = $search_ids;
        }
    }
    
    // Sorting
    if (isset($params['orderby'])) {
        $args['orderby'] = $params['orderby'];
    }
    
    if (isset($params['order'])) {
        $args['order'] = $params['order'];
    }
    
    // Featured filtering
    if (isset($params['featured']) && $params['featured'] === 'true') {
        $args['featured'] = true;
    }
    
    // Tag filtering using tax_query on product_tag (supports slug or name)
    if (isset($params['tag']) && $params['tag'] !== '') {
        $tag_value = sanitize_text_field($params['tag']);
        $tag_query = array(
            'taxonomy' => 'product_tag',
            'field'    => 'slug',
            'terms'    => array($tag_value),
            'operator' => 'IN',
        );
        if (isset($args['tax_query']) && is_array($args['tax_query'])) {
            $args['tax_query'][] = $tag_query;
        } else {
            $args['tax_query'] = array($tag_query);
        }
    }
    
    // Get products
    $products = wc_get_products($args);
    
    // Format products
    $formatted_products = array();
    foreach ($products as $product) {
        $formatted_product = format_product_data($product);
        if ($formatted_product) {
            $formatted_products[] = $formatted_product;
        }
    }
    
    // On Sale filtering - MUST be done after formatting because wc_get_products doesn't support 'on_sale'
    // Support both boolean and string 'true'/'false'
    if (isset($params['onSale'])) {
        // Check for truthy values (string 'true', boolean true, or '1')
        if ($params['onSale'] === 'true' || $params['onSale'] === true || $params['onSale'] === '1') {
            $formatted_products = array_filter($formatted_products, function($product) {
                return isset($product['on_sale']) && $product['on_sale'] === true;
            });
            // Re-index array after filtering
            $formatted_products = array_values($formatted_products);
        }
        // Explicitly ignore false/falsy values - don't filter by sale status
    }
    
    // Apply brand filtering AFTER formatting (post-filtering only, like Invictus)
    if (isset($params['brand']) && $params['brand'] !== '') {
        $brand_param = $params['brand'];
        
        // Handle comma-separated values
        if (strpos($brand_param, ',') !== false) {
            $brands = array_map('trim', explode(',', $brand_param));
        } else {
            $brands = array(trim($brand_param));
        }
        
        // Remove empty values
        $brands = array_filter($brands);
        
        if (!empty($brands)) {
            // Normalize all requested brands for comparison
            $normalized_brands = array_map(function($b) {
                return preg_replace('/[\s\-_]+/', '', strtolower($b));
            }, $brands);
            
            $formatted_products = array_filter($formatted_products, function($product) use ($normalized_brands, $brands) {
                if (empty($product['brand'])) {
                    return false;
                }
                
                // Check if product brand matches ANY of the requested brands
                
                // 1. Exact match (case-insensitive) against any requested brand
                foreach ($brands as $b) {
                    if (strcasecmp($product['brand'], $b) === 0) {
                        return true;
                    }
                }
                
                // 2. Normalized match against any normalized requested brand
                $normalized_product_brand = preg_replace('/[\s\-_]+/', '', strtolower($product['brand']));
                if (in_array($normalized_product_brand, $normalized_brands)) {
                    return true;
                }
                
                return false;
            });
            
            // Re-index array after filtering
            $formatted_products = array_values($formatted_products);
        }
    }
    
    $result = array(
        'success' => true,
        'data' => $formatted_products,
        'total' => count($formatted_products), // Return count of filtered results (like Invictus)
    );
    
    // Cache the result for 5 minutes
    set_transient($cache_key, $result, 5 * MINUTE_IN_SECONDS);
    
    return $result;
}

// Single Product Handler
function get_product_secure($request) {
    $product_id = $request->get_param('id');
    $include_variations = filter_var($request->get_param('include_variations') ?? 'false', FILTER_VALIDATE_BOOLEAN);
    
    // Check cache first
    $cache_key = 'store_product_' . $product_id;
    $cached = get_transient($cache_key);
    if ($cached !== false) {
        return $cached;
    }
    
    $product = wc_get_product($product_id);
    
    if (!$product) {
        return new WP_Error('not_found', 'Product not found', array('status' => 404));
    }
    
    $formatted_product = format_product_data($product);
    
    // Optionally include full variations list
    if ($include_variations && $product->is_type('variable')) {
        $variation_ids = $product->get_children();
        $variations = array();
        foreach ($variation_ids as $vid) {
            $variations[] = format_variation_data(wc_get_product($vid));
        }
        $formatted_product['variations'] = $variations;
    }
    
    if (!$formatted_product) {
        return new WP_Error('error', 'Failed to format product', array('status' => 500));
    }
    
    // Return product data directly (not wrapped)
    $result = $formatted_product;
    
    // Cache for 10 minutes
    set_transient($cache_key, $result, 10 * MINUTE_IN_SECONDS);
    
    return $result;
}

// Variations endpoint handler
function get_product_variations_secure($request) {
    $product_id = intval($request->get_param('id'));
    $product = wc_get_product($product_id);
    if (!$product || !$product->is_type('variable')) {
        return array('success' => true, 'data' => array(), 'total' => 0);
    }
    $variation_ids = $product->get_children();
    $formatted = array();
    foreach ($variation_ids as $vid) {
        $formatted[] = format_variation_data(wc_get_product($vid));
    }
    return array(
        'success' => true,
        'product_id' => $product_id,
        'data' => $formatted,
        'total' => count($formatted),
    );
}

// Linked products endpoint handler (cross-sells and upsells)
function get_linked_products_secure($request) {
    $product_id = intval($request->get_param('id'));
    
    // Check cache first
    $cache_key = 'store_linked_products_' . $product_id;
    $cached = get_transient($cache_key);
    if ($cached !== false) {
        return $cached;
    }
    
    $product = wc_get_product($product_id);
    
    if (!$product) {
        return new WP_Error('not_found', 'Product not found', array('status' => 404));
    }
    
    // Get linked product IDs
    $upsell_ids = $product->get_upsell_ids();
    $cross_sell_ids = $product->get_cross_sell_ids();
    
    // Format upsell products
    $upsells = array();
    foreach ($upsell_ids as $upsell_id) {
        $upsell_product = wc_get_product($upsell_id);
        if ($upsell_product && $upsell_product->is_visible()) {
            $formatted = format_product_data($upsell_product);
            if ($formatted) {
                $upsells[] = $formatted;
            }
        }
    }
    
    // Format cross-sell products
    $cross_sells = array();
    foreach ($cross_sell_ids as $cross_sell_id) {
        $cross_sell_product = wc_get_product($cross_sell_id);
        if ($cross_sell_product && $cross_sell_product->is_visible()) {
            $formatted = format_product_data($cross_sell_product);
            if ($formatted) {
                $cross_sells[] = $formatted;
            }
        }
    }
    
    $result = array(
        'success' => true,
        'product_id' => $product_id,
        'upsells' => $upsells,
        'cross_sells' => $cross_sells,
        'total_upsells' => count($upsells),
        'total_cross_sells' => count($cross_sells),
    );
    
    // Cache for 10 minutes
    set_transient($cache_key, $result, 10 * MINUTE_IN_SECONDS);
    
    return $result;
}

// WooCommerce Brands Handler - IMPROVED with better taxonomy detection
function get_brands_secure($request) {
    $params = $request->get_params();
    
    // Create cache key
    $cache_key = 'store_brands_' . md5(serialize($params));
    
    // Check cache first (30 minutes)
    $cached = get_transient($cache_key);
    if ($cached !== false) {
        return $cached;
    }
    
    // Get the active brand taxonomy
    $active_taxonomy = get_active_brand_taxonomy();
    
    if (!$active_taxonomy) {
        return array(
            'success' => true,
            'data' => array(),
            'total' => 0,
            'message' => 'No brand taxonomy found'
        );
    }
    
    $args = array(
        'taxonomy' => $active_taxonomy,
        'hide_empty' => isset($params['hide_empty']) ? filter_var($params['hide_empty'], FILTER_VALIDATE_BOOLEAN) : true,
        'number' => $params['per_page'] ?? 100,
    );
    
    $terms = get_terms($args);
    
    if (is_wp_error($terms) || empty($terms)) {
        return array(
            'success' => true,
            'data' => array(),
            'total' => 0,
        );
    }
    
    $formatted_brands = array();
    foreach ($terms as $term) {
        // Get brand/term thumbnail image
        $thumbnail_id = get_term_meta($term->term_id, 'thumbnail_id', true);
        $image = null;
        
        if ($thumbnail_id) {
            $image_url = wp_get_attachment_url($thumbnail_id);
            if ($image_url) {
                $image = array(
                    'src' => $image_url,
                    'alt' => get_post_meta($thumbnail_id, '_wp_attachment_image_alt', true) ?: $term->name
                );
            }
        }
        
        $formatted_brands[] = array(
            'id' => $term->term_id,
            'name' => $term->name,
            'slug' => $term->slug,
            'count' => $term->count,
            'description' => $term->description,
            'image' => $image
        );
    }
    
    $result = array(
        'success' => true,
        'data' => $formatted_brands,
        'total' => count($formatted_brands),
    );
    
    // Cache for 30 minutes
    set_transient($cache_key, $result, 30 * MINUTE_IN_SECONDS);
    
    return $result;
}

/**
 * Format slideshow slides for API (Meta Slider by KaizenTech).
 * Returns active slides with separate desktop and mobile images resolved from attachment IDs.
 */
function _format_slideshow_slides_for_api($slides) {
    if (empty($slides) || !is_array($slides)) return array();

    $formatted = array();
    foreach ($slides as $slide) {
        $desktop_id = isset($slide['desktop_image_id']) ? (int) $slide['desktop_image_id'] : (isset($slide['image_id']) ? (int) $slide['image_id'] : 0);
        $mobile_id  = isset($slide['mobile_image_id']) ? (int) $slide['mobile_image_id'] : 0;

        $desktop_image = null;
        if ($desktop_id) {
            $full   = wp_get_attachment_image_url($desktop_id, 'full');
            $large  = wp_get_attachment_image_url($desktop_id, 'large');
            $medium = wp_get_attachment_image_url($desktop_id, 'medium');
            $desktop_image = array(
                'id'        => $desktop_id,
                'url'       => $full ?: ($large ?: $medium),
                'url_full'  => $full,
                'url_large' => $large,
                'url_medium'=> $medium,
            );
        }

        $mobile_image = null;
        if ($mobile_id) {
            $full   = wp_get_attachment_image_url($mobile_id, 'full');
            $large  = wp_get_attachment_image_url($mobile_id, 'large');
            $medium = wp_get_attachment_image_url($mobile_id, 'medium');
            $mobile_image = array(
                'id'        => $mobile_id,
                'url'       => $full ?: ($large ?: $medium),
                'url_full'  => $full,
                'url_large' => $large,
                'url_medium'=> $medium,
            );
        }

        $formatted[] = array(
            'id'             => isset($slide['id']) ? $slide['id'] : '',
            'title'          => isset($slide['title']) ? $slide['title'] : '',
            'description'    => isset($slide['description']) ? $slide['description'] : '',
            'button_label'   => isset($slide['button_label']) ? $slide['button_label'] : '',
            'button_link'    => isset($slide['button_link']) ? $slide['button_link'] : '',
            'alignment'      => isset($slide['alignment']) && in_array($slide['alignment'], array('left', 'center', 'right'), true)
                ? $slide['alignment'] : 'left',
            // New fields for responsive images:
            'image_desktop'  => $desktop_image,
            'image_mobile'   => $mobile_image,
            // Backward-compatible single image field (prefer desktop, fall back to mobile).
            'image'          => $desktop_image ?: $mobile_image,
        );
    }
    return $formatted;
}

/**
 * Slideshow endpoint handler (Meta Slider by KaizenTech).
 */
function get_slideshow_secure($request) {
    if (!function_exists('ktms_get_active_slides')) {
        return array(
            'success' => true,
            'data' => array(),
            'total' => 0,
        );
    }

    $slides = ktms_get_active_slides();
    $formatted = _format_slideshow_slides_for_api($slides);

    return array(
        'success' => true,
        'data' => $formatted,
        'total' => count($formatted),
    );
}

// Gallery media handler - returns images from media library tagged with "installation-gallery"
function get_gallery_media_secure($request) {
    $params = $request->get_params();
    
    $page = isset($params['page']) ? max(1, intval($params['page'])) : 1;
    $per_page = isset($params['per_page']) ? min(100, max(1, intval($params['per_page']))) : 40;
    $category_slug = isset($params['category_slug']) && $params['category_slug'] !== '' ? sanitize_title($params['category_slug']) : 'installation-gallery';
    
    // Build cache key based on params
    $cache_key = 'store_gallery_media_' . md5(json_encode(array(
        'page' => $page,
        'per_page' => $per_page,
        'category_slug' => $category_slug,
    )));
    
    $cached = get_transient($cache_key);
    if ($cached !== false) {
        return $cached;
    }
    
    // Detect the correct taxonomy used by the site for media categories
    $taxonomy_candidates = array('media_category', 'attachment_category', 'category', 'mla_category');
    $media_tax = null;
    foreach ($taxonomy_candidates as $tax) {
        if (taxonomy_exists($tax) && is_object_in_taxonomy('attachment', $tax)) {
            $media_tax = $tax;
            break;
        }
    }
    
    if (!$media_tax) {
        return array(
            'success' => true,
            'data' => array(),
            'total' => 0,
            'message' => 'No media category taxonomy found for attachments'
        );
    }
    
    // Resolve the term ID by slug
    $term_id = 0;
    $term = get_term_by('slug', $category_slug, $media_tax);
    if ($term && !is_wp_error($term)) {
        $term_id = intval($term->term_id);
    }
    
    // Build query
    $tax_query = array();
    if ($term_id > 0) {
        $tax_query[] = array(
            'taxonomy' => $media_tax,
            'field'    => 'term_id',
            'terms'    => array($term_id),
            'include_children' => false,
        );
    } else {
        // Fallback: still try with slug if term resolution failed (some plugins may allow slug filter)
        $tax_query[] = array(
            'taxonomy' => $media_tax,
            'field'    => 'slug',
            'terms'    => array($category_slug),
            'include_children' => false,
        );
    }
    
    $args = array(
        'post_type'      => 'attachment',
        'post_status'    => 'inherit',
        'post_mime_type' => 'image',
        'posts_per_page' => $per_page,
        'paged'          => $page,
        'orderby'        => 'date',
        'order'          => 'DESC',
        'tax_query'      => $tax_query,
    );
    
    $query = new WP_Query($args);
    $items = array();
    
    foreach ($query->posts as $attachment) {
        $id   = $attachment->ID;
        $src  = wp_get_attachment_url($id);
        if (!$src) {
            continue;
        }
        
        $title   = get_the_title($id);
        $caption = wp_get_attachment_caption($id);
        $alt     = get_post_meta($id, '_wp_attachment_image_alt', true) ?: $title;
        
        // Basic size variants (if available)
        $sizes = array();
        $thumb = wp_get_attachment_image_src($id, 'thumbnail');
        if ($thumb) {
            $sizes['thumbnail'] = array(
                'src'    => $thumb[0],
                'width'  => $thumb[1],
                'height' => $thumb[2],
            );
        }
        $medium = wp_get_attachment_image_src($id, 'medium');
        if ($medium) {
            $sizes['medium'] = array(
                'src'    => $medium[0],
                'width'  => $medium[1],
                'height' => $medium[2],
            );
        }
        $large = wp_get_attachment_image_src($id, 'large');
        if ($large) {
            $sizes['large'] = array(
                'src'    => $large[0],
                'width'  => $large[1],
                'height' => $large[2],
            );
        }
        
        $items[] = array(
            'id'          => $id,
            'title'       => $title,
            'caption'     => $caption,
            'alt'         => $alt,
            'src'         => $src,
            'sizes'       => $sizes,
            'uploaded_at' => get_the_date('c', $id),
        );
    }
    
    $result = array(
        'success' => true,
        'data'    => $items,
        'total'   => intval($query->found_posts),
        'page'    => $page,
        'per_page'=> $per_page,
    );
    
    // Cache for 10 minutes
    set_transient($cache_key, $result, 10 * MINUTE_IN_SECONDS);
    
    return $result;
}

// Product attributes list (for brand fallback)
function get_product_attributes_secure($request) {
    // WooCommerce stores attributes as taxonomy and wc_attribute_taxonomies
    if (!function_exists('wc_get_attribute_taxonomies')) {
        return array('success' => true, 'data' => array());
    }
    $taxonomies = wc_get_attribute_taxonomies();
    $data = array();
    foreach ($taxonomies as $tax) {
        $data[] = array(
            'id' => intval($tax->attribute_id),
            'name' => $tax->attribute_label,
            'slug' => wc_attribute_taxonomy_name($tax->attribute_name),
        );
    }
    return array('success' => true, 'data' => $data);
}

// Product attribute terms list
function get_product_attribute_terms_secure($request) {
    $attr_id = intval($request->get_param('id'));
    if (!$attr_id) {
        return array('success' => true, 'data' => array());
    }
    // Find taxonomy by attribute id
    if (!function_exists('wc_get_attribute_taxonomies')) {
        return array('success' => true, 'data' => array());
    }
    $taxonomies = wc_get_attribute_taxonomies();
    $taxonomy_name = '';
    foreach ($taxonomies as $tax) {
        if (intval($tax->attribute_id) === $attr_id) {
            $taxonomy_name = wc_attribute_taxonomy_name($tax->attribute_name);
            break;
        }
    }
    if (!$taxonomy_name) {
        return array('success' => true, 'data' => array());
    }
    $terms = get_terms(array(
        'taxonomy' => $taxonomy_name,
        'hide_empty' => false,
        'number' => $request->get_param('per_page') ?: 100,
    ));
    if (is_wp_error($terms)) {
        return array('success' => true, 'data' => array());
    }
    $data = array();
    foreach ($terms as $t) {
        $data[] = array(
            'id' => $t->term_id,
            'name' => $t->name,
            'slug' => $t->slug,
        );
    }
    return array('success' => true, 'data' => $data);
}

// WooCommerce Categories Handler
function get_categories_secure($request) {
    $params = $request->get_params();
    
    // Create cache key
    $cache_key = 'store_categories_' . md5(serialize($params));
    
    // Optional: bypass cache when force_refresh=true (useful after taxonomy changes)
    $force_refresh = isset($params['force_refresh']) ? filter_var($params['force_refresh'], FILTER_VALIDATE_BOOLEAN) : false;
    
    // Check cache first (30 minutes) unless forced refresh
    if (!$force_refresh) {
        $cached = get_transient($cache_key);
        if ($cached !== false) {
            return $cached;
        }
    }
    
    $args = array(
        'taxonomy' => 'product_cat',
        'hide_empty' => isset($params['hide_empty']) ? filter_var($params['hide_empty'], FILTER_VALIDATE_BOOLEAN) : false,
        'number' => $params['per_page'] ?? 500,
        'orderby' => isset($params['orderby']) ? $params['orderby'] : 'name',
        'order' => isset($params['order']) ? $params['order'] : 'ASC',
    );
    
    $terms = get_terms($args);
    
    if (is_wp_error($terms)) {
        return array(
            'success' => false,
            'data' => array(),
            'total' => 0,
        );
    }
    
    $formatted_categories = array();
    foreach ($terms as $term) {
        // Get category thumbnail image (if set)
        $thumbnail_id = get_term_meta($term->term_id, 'thumbnail_id', true);
        $image = null;
        if ($thumbnail_id) {
            $image_url = wp_get_attachment_url($thumbnail_id);
            if ($image_url) {
                $image = array(
                    'src' => $image_url,
                    'alt' => get_post_meta($thumbnail_id, '_wp_attachment_image_alt', true) ?: $term->name,
                );
            }
        }

        $formatted_categories[] = array(
            'id' => $term->term_id,
            'name' => $term->name,
            'slug' => $term->slug,
            'count' => $term->count,
            'parent' => $term->parent,
            'image' => $image,
        );
    }
    
    $result = array(
        'success' => true,
        'data' => $formatted_categories,
        'total' => count($formatted_categories),
    );
    
    // Cache for 30 minutes
    if (!$force_refresh) {
        set_transient($cache_key, $result, 30 * MINUTE_IN_SECONDS);
    }
    
    return $result;
}

// WooCommerce Child Categories Handler (for dropdowns under a parent category like 'singles')
function get_child_categories_secure($request) {
    $params = $request->get_params();
    
    // Determine parent category: by slug (preferred), id, or default 'singles'
    $parent_slug = isset($params['parent_slug']) && $params['parent_slug'] !== '' ? sanitize_title($params['parent_slug']) : 'singles';
    $parent_id = isset($params['parent_id']) ? intval($params['parent_id']) : 0;
    
    // Resolve parent term by slug if id not provided
    if ($parent_id <= 0) {
        $parent_term = get_term_by('slug', $parent_slug, 'product_cat');
        if ($parent_term && !is_wp_error($parent_term)) {
            $parent_id = intval($parent_term->term_id);
        }
    }
    
    // If still no valid parent, return empty
    if ($parent_id <= 0) {
        return array(
            'success' => true,
            'data' => array(),
            'total' => 0,
            'message' => 'Parent category not found'
        );
    }
    
    // Cache key includes parent and params
    $cache_key = 'store_child_categories_' . md5(json_encode(array(
        'parent_id' => $parent_id,
        'hide_empty' => isset($params['hide_empty']) ? $params['hide_empty'] : '1',
        'number' => isset($params['per_page']) ? $params['per_page'] : '100',
    )));
    
    $cached = get_transient($cache_key);
    if ($cached !== false) {
        return $cached;
    }
    
    $args = array(
        'taxonomy' => 'product_cat',
        'hide_empty' => isset($params['hide_empty']) ? filter_var($params['hide_empty'], FILTER_VALIDATE_BOOLEAN) : true,
        'parent' => $parent_id,
        'number' => $params['per_page'] ?? 100,
        'orderby' => $params['orderby'] ?? 'name',
        'order' => $params['order'] ?? 'ASC',
    );
    
    $terms = get_terms($args);
    
    if (is_wp_error($terms)) {
        return array(
            'success' => false,
            'data' => array(),
            'total' => 0,
        );
    }
    
    $formatted = array();
    foreach ($terms as $term) {
        $formatted[] = array(
            'id' => $term->term_id,
            'name' => $term->name,
            'slug' => $term->slug,
            'count' => $term->count,
            'parent' => $term->parent,
            'description' => $term->description,
        );
    }
    
    $result = array(
        'success' => true,
        'data' => $formatted,
        'total' => count($formatted),
        'parent' => array(
            'id' => $parent_id,
            'slug' => $parent_slug,
        ),
    );
    
    // Cache 30 minutes
    set_transient($cache_key, $result, 30 * MINUTE_IN_SECONDS);
    
    return $result;
}

// WooCommerce Order Creation Handler - FIXED with shipping support
function create_order_secure($request) {
    $order_data = $request->get_json_params();
    
    $order = wc_create_order();
    
    // Add line items with variation support
    foreach ($order_data['line_items'] as $li) {
        $product = wc_get_product($li['product_id']);
        
        // âœ… PREPARE VARIATION ARGS
        $args = array();
        
        // If this is a variation, add variation-specific data
        if (isset($li['variation_id']) && $li['variation_id']) {
            $args['variation_id'] = $li['variation_id'];
            
            // âœ… ADD VARIATION ATTRIBUTES TO THE 'variation' KEY
            // WooCommerce expects variation attributes under the 'variation' key in $args
            if (isset($li['variation']) && is_array($li['variation'])) {
                $args['variation'] = $li['variation'];
            }
        }
        
        // âœ… USE CUSTOM PRICE FROM FRONTEND (includes addon fees: line_1, line_2, logo)
        $item_price = isset($li['price']) ? floatval($li['price']) : null;
        if ($item_price !== null && $product) {
            $qty = isset($li['quantity']) ? max(1, intval($li['quantity'])) : 1;
            $line_total = $item_price * $qty;
            $args['subtotal'] = $line_total;
            $args['total'] = $line_total;
        }
        
        // âœ… ADD PRODUCT WITH VARIATION SUPPORT
        $order_item_id = $order->add_product($product, $li['quantity'], $args);

        // âœ… OPTIONAL: Attach customiser metadata per line item (URL or base64)
        if ($order_item_id && isset($li['meta_data']) && is_array($li['meta_data'])) {
            $order_item = new WC_Order_Item_Product($order_item_id);
            foreach ($li['meta_data'] as $md) {
                if (isset($md['key']) && isset($md['value'])) {
                    $order_item->add_meta_data(sanitize_text_field($md['key']), $md['value'], true);
                }
            }
            $order_item->save();
        }
    }
    
    // Set billing address
    $order->set_billing_first_name($order_data['billing']['first_name']);
    $order->set_billing_last_name($order_data['billing']['last_name']);
    $order->set_billing_email($order_data['billing']['email']);
    $order->set_billing_phone($order_data['billing']['phone']);
    $order->set_billing_address_1($order_data['billing']['address_1']);
    $order->set_billing_city($order_data['billing']['city']);
    $order->set_billing_state($order_data['billing']['state']);
    $order->set_billing_postcode($order_data['billing']['postcode']);
    $order->set_billing_country($order_data['billing']['country']);
    
    // Set shipping address
    $order->set_shipping_first_name($order_data['shipping']['first_name']);
    $order->set_shipping_last_name($order_data['shipping']['last_name']);
    $order->set_shipping_address_1($order_data['shipping']['address_1']);
    $order->set_shipping_city($order_data['shipping']['city']);
    $order->set_shipping_state($order_data['shipping']['state']);
    $order->set_shipping_postcode($order_data['shipping']['postcode']);
    $order->set_shipping_country($order_data['shipping']['country']);
    
    // ADD SHIPPING LINES - THIS WAS MISSING!
    if (isset($order_data['shipping_lines']) && !empty($order_data['shipping_lines'])) {
        foreach ($order_data['shipping_lines'] as $shipping_line) {
            $item = new WC_Order_Item_Shipping();
            $item->set_method_title($shipping_line['method_title'] ?? 'Shipping');
            $item->set_method_id($shipping_line['method_id'] ?? 'flat_rate');
            $item->set_total($shipping_line['total'] ?? '0.00');
            $order->add_item($item);
        }
    }

    // ✅ NEW: Delivery option (Delivery Options by KaizenTech)
    if (!empty($order_data['delivery_option_id']) && function_exists('ktdo_get_option_by_id')) {
        $option_id = sanitize_text_field($order_data['delivery_option_id']);
        $option    = ktdo_get_option_by_id($option_id);
        $calc      = null;

        if ($option && !empty($option['enabled'])) {
            $delivery_cost = isset($order_data['delivery_cost']) ? floatval($order_data['delivery_cost']) : null;

            if ($delivery_cost === null && function_exists('ktdo_calculate_delivery_cost')) {
                $lat = isset($order_data['delivery_lat']) ? floatval($order_data['delivery_lat']) : 0;
                $lng = isset($order_data['delivery_lng']) ? floatval($order_data['delivery_lng']) : 0;
                $subtotal = 0;
                if (!empty($order_data['line_items']) && is_array($order_data['line_items'])) {
                    foreach ($order_data['line_items'] as $item) {
                        $subtotal += floatval($item['price'] ?? 0) * intval($item['quantity'] ?? 1);
                    }
                }
                $calc = ktdo_calculate_delivery_cost($option_id, $lat, $lng, $subtotal);
                if ($calc['available']) {
                    $delivery_cost = $calc['cost'];
                }
            }

            if ($delivery_cost !== null && $delivery_cost >= 0) {
                $shipping_item = new WC_Order_Item_Shipping();
                $shipping_item->set_method_title($option['name']);
                $shipping_item->set_method_id('ktdo_' . $option_id);
                $shipping_item->set_total($delivery_cost);
                $order->add_item($shipping_item);

                $order->update_meta_data('_ktdo_delivery_option_id', $option_id);
                if (isset($order_data['delivery_lat'])) {
                    $order->update_meta_data('_ktdo_delivery_lat', floatval($order_data['delivery_lat']));
                }
                if (isset($order_data['delivery_lng'])) {
                    $order->update_meta_data('_ktdo_delivery_lng', floatval($order_data['delivery_lng']));
                }
                if ($calc && isset($calc['distance_km'])) {
                    $order->update_meta_data('_ktdo_delivery_distance_km', $calc['distance_km']);
                }
            }
        }
    }
    
    // Set payment method
    $order->set_payment_method('payfast');
    $order->set_payment_method_title('PayFast');
    
    // Set initial status
    $order->set_status('pending', 'Order received, awaiting payment');
    
    // Calculate totals and save
    $order->calculate_totals();
    $order->save();
    
    return array(
        'success' => true,
        'order_id' => $order->get_id(),
        'order_number' => $order->get_order_number(),
    );
}

// WooCommerce Order Update Handler
function update_order_secure($request) {
    $order_id = $request->get_param('id');
    $update_data = $request->get_json_params();
    
    error_log("Store Debug: update_order_secure called for Order ID: {$order_id} with data: " . json_encode($update_data));
    
    $order = wc_get_order($order_id);
    
    if (!$order) {
        error_log("Store Debug: Order not found: {$order_id}");
        return new WP_Error('order_not_found', 'Order not found', array('status' => 404));
    }
    
    // Update status if provided
    if (isset($update_data['status'])) {
        error_log("Store Debug: Updating status to: {$update_data['status']}");
        $order->set_status($update_data['status'], 'Status updated via secure API');
        $order->save();
    }
    
    return array(
        'success' => true,
        'order_id' => $order->get_id(),
        'status' => $order->get_status(),
    );
}

// PayFast Signature Generation
function generate_payfast_signature($data) {
    $pfOutput = '';
    
    // Only include non-empty values, exclude signature and passphrase fields
    foreach ($data as $key => $value) {
        if ($value !== '' && $value !== null && $key !== 'signature' && $key !== 'passphrase') {
            if ($pfOutput !== '') {
                $pfOutput .= '&';
            }
            $pfOutput .= $key . '=' . urlencode(trim($value));
        }
    }
    
    // Add passphrase at the end (but don't include it in the data sent to PayFast)
    if (defined('PAYFAST_PASSPHRASE') && PAYFAST_PASSPHRASE) {
        $pfOutput .= '&passphrase=' . urlencode(trim(PAYFAST_PASSPHRASE));
    }
    
    return md5($pfOutput);
}

// PayFast ITN (Instant Transaction Notification) Handler
add_action('woocommerce_api_payfast', 'handle_payfast_itn');
// âœ… REMOVED: Scheduled stock release hook - no longer needed since we don't reduce stock early
// Stock is now only reduced when payment is confirmed (WooCommerce handles it on payment_complete())

function handle_payfast_itn() {
    // Get the POST data from PayFast
    $pfData = $_POST;
    
    // Log the ITN for debugging
    error_log('PayFast ITN received: ' . print_r($pfData, true));
    
    // Verify that we have data
    if (empty($pfData)) {
        error_log('PayFast ITN: No data received');
        header('HTTP/1.0 400 Bad Request');
        exit;
    }
    
    // Get order ID from custom_str1
    $order_id = isset($pfData['custom_str1']) ? intval($pfData['custom_str1']) : 0;
    
    if (!$order_id) {
        error_log('PayFast ITN: No order ID found');
        header('HTTP/1.0 400 Bad Request');
        exit;
    }
    
    // Load the order
    $order = wc_get_order($order_id);
    
    if (!$order) {
        error_log('PayFast ITN: Order not found - ID: ' . $order_id);
        header('HTTP/1.0 404 Not Found');
        exit;
    }
    
    // Verify the signature
    $pfParamString = '';
    foreach ($pfData as $key => $val) {
        if ($key !== 'signature') {
            // Fix for WordPress magic quotes
            $val = stripslashes($val);
            
            // PayFast excludes empty values from signature
            if ($val !== '') {
                $pfParamString .= $key . '=' . urlencode(trim($val)) . '&';
            }
        }
    }
    // Remove last ampersand
    $pfParamString = rtrim($pfParamString, '&');
    
    // Add passphrase
    if (defined('PAYFAST_PASSPHRASE') && PAYFAST_PASSPHRASE) {
        $pfParamString .= '&passphrase=' . urlencode(trim(PAYFAST_PASSPHRASE));
    }
    
    $signature = md5($pfParamString);
    
    // Verify signature
    if ($signature !== $pfData['signature']) {
        error_log("PayFast ITN: Invalid signature. Generated: $signature, Expected: " . $pfData['signature']);
        error_log("PayFast ITN: Signature String: $pfParamString");
        header('HTTP/1.0 403 Forbidden');
        exit;
    }
    
    // Check payment status
    $payment_status = $pfData['payment_status'] ?? '';
    
    switch ($payment_status) {
        case 'COMPLETE':
            // Payment successful - WooCommerce automatically reduces stock on payment_complete()
            $order->payment_complete($pfData['pf_payment_id'] ?? '');
            $order->add_order_note('PayFast payment completed. Transaction ID: ' . ($pfData['pf_payment_id'] ?? 'N/A'));
            error_log('PayFast ITN: Payment completed for order ' . $order_id);
            break;
            
        case 'FAILED':
            // No stock to restore - stock was never reduced (only validated)
            $order->update_status('failed', 'PayFast payment failed');
            error_log('PayFast ITN: Payment failed for order ' . $order_id);
            break;
            
        case 'CANCELLED':
            // No stock to restore - stock was never reduced (only validated)
            $order->update_status('cancelled', 'PayFast payment cancelled by user');
            error_log('PayFast ITN: Payment cancelled for order ' . $order_id);
            break;
            
        default:
            error_log('PayFast ITN: Unknown payment status: ' . $payment_status);
    }
    
    // Send 200 OK response to PayFast
    header('HTTP/1.0 200 OK');
    flush();
}

// âœ… NEW: Clear product cache when stock changes
function clear_product_cache_on_stock_change($meta_id, $post_id, $meta_key, $meta_value) {
    // Only clear cache for stock-related meta changes
    if ($meta_key === '_stock' || $meta_key === '_stock_status') {
        // Clear the specific product cache
        delete_transient('store_product_' . $post_id);
        
        // Clear the products list cache (since stock affects product listings)
        global $wpdb;
        $wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_store_products_%'");
        
        // Log the cache clearing
        error_log("Store Debug: Product cache cleared for stock change on product {$post_id}");
    }
}

// Hook into meta updates
add_action('updated_post_meta', 'clear_product_cache_on_stock_change', 10, 4);







// ============================================================================
// ADMIN DEBUG LOGS VIEWER
// ============================================================================

// Add admin menu for viewing logs
add_action('admin_menu', 'store_add_debug_menu');

function store_add_debug_menu() {
    add_menu_page(
        'Store Debug Logs',
        'Debug Logs',              // Menu title
        'manage_options',          // Capability
        'store-debug-logs',       // Menu slug
        'store_debug_logs_page',
        'dashicons-editor-code',   // Icon
        100                        // Position
    );
}

function store_debug_logs_page() {
    ?>
    <div class="wrap">
        <h1>ðŸ” Store Debug Logs</h1>
        
        <div style="margin: 20px 0;">
            <button class="button button-primary" onclick="refreshLogs()">
                <span class="dashicons dashicons-update" style="margin-top: 3px;"></span> Refresh Logs
            </button>
            <button class="button" onclick="clearLogsFile()">
                <span class="dashicons dashicons-trash" style="margin-top: 3px;"></span> Clear All Logs
            </button>
            <button class="button" onclick="downloadLogs()">
                <span class="dashicons dashicons-download" style="margin-top: 3px;"></span> Download Logs
            </button>
            
            <label style="margin-left: 20px;">
                <input type="checkbox" id="autoRefresh" onchange="toggleAutoRefresh(this)"> 
                Auto-refresh every 5 seconds
            </label>
            
            <span id="logCount" style="margin-left: 20px; color: #666;"></span>
        </div>
        
        <div style="background: #fff; border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; border-radius: 4px;">
            <strong>Filter:</strong>
            <input type="text" id="logFilter" placeholder="Search logs..." style="width: 300px; margin-left: 10px;" oninput="filterLogs()">
            
            <select id="logLevel" onchange="filterLogs()" style="margin-left: 10px;">
                <option value="">All Levels</option>
                <option value="PayFast">PayFast</option>
                <option value="Stock">Stock</option>
                <option value="Order">Order</option>
                <option value="ERROR">Errors Only</option>
                <option value="SUCCESS">Success Only</option>
            </select>
        </div>
        
        <div id="log-content" style="
            background: #1e1e1e; 
            color: #d4d4d4; 
            padding: 20px; 
            border-radius: 5px; 
            max-height: 70vh; 
            overflow-y: auto; 
            font-family: 'Courier New', 'Consolas', monospace; 
            font-size: 13px;
            line-height: 1.6;
        ">
            <div style="color: #61afef;">Loading logs...</div>
        </div>
    </div>
    
    <style>
        .log-line {
            margin-bottom: 8px;
            padding: 8px;
            border-left: 3px solid transparent;
            border-radius: 3px;
        }
        .log-line:hover {
            background: rgba(255,255,255,0.05);
        }
        .log-error {
            color: #f48771 !important;
            border-left-color: #f48771;
            background: rgba(244, 135, 113, 0.1);
        }
        .log-success {
            color: #89d185 !important;
            border-left-color: #89d185;
        }
        .log-warning {
            color: #e5c07b !important;
            border-left-color: #e5c07b;
        }
        .log-info {
            color: #61afef !important;
        }
        .log-payfast {
            color: #c678dd !important;
        }
        .log-timestamp {
            color: #5c6370;
            font-size: 11px;
        }
    </style>
    
    <script>
    let allLogs = [];
    let autoRefreshInterval = null;
    
    function refreshLogs() {
        document.getElementById('log-content').innerHTML = '<div style="color: #61afef;">â³ Loading logs...</div>';
        
        fetch('<?php echo rest_url('store/v1/debug/logs'); ?>', {
            headers: {
                'X-API-Key': 'store-react-2024'
            }
        })
        .then(r => r.json())
        .then(data => {
            if (data.success && data.logs && data.logs.length > 0) {
                allLogs = data.logs.reverse(); // Show newest first
                displayLogs(allLogs);
                document.getElementById('logCount').innerHTML = `<strong>${allLogs.length}</strong> log entries`;
            } else {
                document.getElementById('log-content').innerHTML = `
                    <div style="color: #e5c07b;">
                        âš ï¸ No logs found.<br><br>
                        Make sure WP_DEBUG_LOG is enabled in wp-config.php:<br>
                        <code style="background: #2c313c; padding: 10px; display: block; margin-top: 10px; border-radius: 3px;">
                        define('WP_DEBUG', true);<br>
                        define('WP_DEBUG_LOG', true);<br>
                        define('WP_DEBUG_DISPLAY', false);
                        </code>
                    </div>`;
                document.getElementById('logCount').innerHTML = '';
            }
        })
        .catch(err => {
            document.getElementById('log-content').innerHTML = `<div style="color: #f48771;">âŒ Error loading logs: ${err.message}</div>`;
        });
    }
    
    function displayLogs(logs) {
        const logsHtml = logs.map(log => {
            let cssClass = 'log-line';
            let icon = 'â—';
            
            // Detect log type and colorize
            if (log.includes('ERROR') || log.includes('âŒ') || log.includes('Failed')) {
                cssClass += ' log-error';
                icon = 'âŒ';
            } else if (log.includes('SUCCESS') || log.includes('âœ…') || log.includes('completed')) {
                cssClass += ' log-success';
                icon = 'âœ…';
            } else if (log.includes('WARNING') || log.includes('âš ï¸')) {
                cssClass += ' log-warning';
                icon = 'âš ï¸';
            } else if (log.includes('PayFast') || log.includes('payment')) {
                cssClass += ' log-payfast';
                icon = 'ðŸ’³';
            } else if (log.includes('Stock')) {
                cssClass += ' log-info';
                icon = 'ðŸ“¦';
            } else {
                cssClass += ' log-info';
                icon = 'ðŸ”¹';
            }
            
            // Extract timestamp if present
            const timestampMatch = log.match(/\[(.*?)\]/);
            const timestamp = timestampMatch ? `<span class="log-timestamp">[${timestampMatch[1]}]</span> ` : '';
            const logContent = log.replace(/\[.*?\]\s*/, '');
            
            return `<div class="${cssClass}">${icon} ${timestamp}${logContent}</div>`;
        }).join('');
        
        document.getElementById('log-content').innerHTML = logsHtml;
    }
    
    function filterLogs() {
        const filterText = document.getElementById('logFilter').value.toLowerCase();
        const logLevel = document.getElementById('logLevel').value;
        
        let filtered = allLogs.filter(log => {
            const matchesText = !filterText || log.toLowerCase().includes(filterText);
            const matchesLevel = !logLevel || log.includes(logLevel);
            return matchesText && matchesLevel;
        });
        
        displayLogs(filtered);
        document.getElementById('logCount').innerHTML = `<strong>${filtered.length}</strong> of ${allLogs.length} log entries`;
    }
    
    function clearLogsFile() {
        if (!confirm('Are you sure you want to clear ALL logs? This cannot be undone.')) {
            return;
        }
        
        // You would need to add a clear endpoint for this
        alert('Clear logs functionality: Please manually delete /wp-content/debug.log via FTP/File Manager');
    }
    
    function downloadLogs() {
        const logText = allLogs.join('\n');
        const blob = new Blob([logText], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `store-debug-logs-${new Date().toISOString().slice(0,10)}.txt`;
        a.click();
        window.URL.revokeObjectURL(url);
    }
    
    function toggleAutoRefresh(checkbox) {
        if (checkbox.checked) {
            autoRefreshInterval = setInterval(refreshLogs, 5000);
            console.log('Auto-refresh enabled');
        } else {
            clearInterval(autoRefreshInterval);
            console.log('Auto-refresh disabled');
        }
    }
    
    // Load logs on page load
    refreshLogs();
    </script>
    <?php
}

// ============================================================================
// USER AUTHENTICATION & ACCOUNT MANAGEMENT (Phase 1 - Gamification)
// ============================================================================

/**
 * Register authentication endpoints
 * These endpoints leverage WordPress's built-in user system
 */
add_action('rest_api_init', function () {
    // User Registration
    register_rest_route('store/v1', '/auth/register', array(
        'methods' => 'POST',
        'callback' => 'store_handle_user_registration',
        'permission_callback' => '__return_true', // Public endpoint
    ));
    
    // User Login
    register_rest_route('store/v1', '/auth/login', array(
        'methods' => 'POST',
        'callback' => 'store_handle_user_login',
        'permission_callback' => '__return_true', // Public endpoint
    ));
    
    // Validate Token (check if user is logged in)
    register_rest_route('store/v1', '/auth/validate', array(
        'methods' => 'POST',
        'callback' => 'store_validate_auth',
        'permission_callback' => '__return_true',
    ));
    
    // Get Current User Profile
    register_rest_route('store/v1', '/user/profile', array(
        'methods' => 'GET',
        'callback' => 'store_get_user_profile',
        'permission_callback' => 'store_check_user_logged_in',
    ));
    
    // Update User Profile
    register_rest_route('store/v1', '/user/profile', array(
        'methods' => 'PUT',
        'callback' => 'store_update_user_profile',
        'permission_callback' => 'store_check_user_logged_in',
    ));
    
    // Get User Orders
    register_rest_route('store/v1', '/user/orders', array(
        'methods' => 'GET',
        'callback' => 'store_get_user_orders',
        'permission_callback' => 'store_check_user_logged_in',
    ));
    
    // Logout
    register_rest_route('store/v1', '/auth/logout', array(
        'methods' => 'POST',
        'callback' => 'store_handle_user_logout',
        'permission_callback' => 'store_check_user_logged_in',
    ));
});

/**
 * User Registration Handler
 * Uses WordPress's wp_create_user() and wp_update_user()
 */
function store_handle_user_registration($request) {
    $params = $request->get_json_params();
    
    // Validate required fields
    if (empty($params['email']) || empty($params['password'])) {
        return new WP_Error('missing_fields', 'Email and password are required', array('status' => 400));
    }
    
    if (empty($params['firstName'])) {
        return new WP_Error('missing_fields', 'First name is required', array('status' => 400));
    }
    
    // Validate email format
    $email = sanitize_email($params['email']);
    if (!is_email($email)) {
        return new WP_Error('invalid_email', 'Invalid email address', array('status' => 400));
    }
    
    // Check if email already exists
    if (email_exists($email)) {
        return new WP_Error('email_exists', 'This email is already registered', array('status' => 409));
    }
    
    // Validate password strength
    if (strlen($params['password']) < 6) {
        return new WP_Error('weak_password', 'Password must be at least 6 characters', array('status' => 400));
    }
    
    // Create username from email (or use email as username)
    $username = $email;
    
    // Check if username exists (shouldn't since we checked email)
    if (username_exists($username)) {
        $username = $email . rand(100, 999); // Add random number if collision
    }
    
    // Create user using WordPress function
    $user_id = wp_create_user(
        $username,
        $params['password'],
        $email
    );
    
    if (is_wp_error($user_id)) {
        return new WP_Error('registration_failed', $user_id->get_error_message(), array('status' => 500));
    }
    
    // Set additional user data
    $first_name = sanitize_text_field($params['firstName']);
    $last_name = sanitize_text_field($params['lastName'] ?? '');
    
    wp_update_user(array(
        'ID' => $user_id,
        'first_name' => $first_name,
        'last_name' => $last_name,
        'display_name' => $first_name . ($last_name ? ' ' . $last_name : ''),
        'role' => 'customer', // WooCommerce customer role
    ));
    
    // Log the user in automatically
    wp_set_current_user($user_id);
    wp_set_auth_cookie($user_id, true); // Remember user
    
    // Log registration
    error_log("Store Debug: New user registered - ID: {$user_id}, Email: {$email}");
    
    // Get user data for response
    $user = get_userdata($user_id);
    
    // Create auth token (using WordPress nonces for now)
    $token = wp_create_nonce('store_auth_' . $user_id);
    
    return array(
        'success' => true,
        'message' => 'Registration successful',
        'user' => array(
            'id' => $user->ID,
            'email' => $user->user_email,
            'firstName' => $user->first_name,
            'lastName' => $user->last_name,
            'displayName' => $user->display_name,
            'avatarUrl' => get_avatar_url($user->ID),
        ),
        'token' => $token,
        'authCookie' => true, // Indicates WordPress auth cookie is set
    );
}

/**
 * User Login Handler
 * Uses WordPress's wp_authenticate() and wp_set_auth_cookie()
 */
function store_handle_user_login($request) {
    $params = $request->get_json_params();
    
    // Validate required fields
    if (empty($params['email']) || empty($params['password'])) {
        return new WP_Error('missing_fields', 'Email and password are required', array('status' => 400));
    }
    
    $email = sanitize_email($params['email']);
    
    // Authenticate user using WordPress
    $user = wp_authenticate($email, $params['password']);
    
    if (is_wp_error($user)) {
        error_log("Store Debug: Login failed for {$email} - " . $user->get_error_message());
        return new WP_Error('login_failed', 'Invalid email or password', array('status' => 401));
    }
    
    // Set WordPress auth cookie
    wp_set_current_user($user->ID);
    wp_set_auth_cookie($user->ID, true); // Remember user
    
    // Update last login time
    update_user_meta($user->ID, 'last_login', current_time('mysql'));
    
    // Log successful login
    error_log("Store Debug: User logged in - ID: {$user->ID}, Email: {$email}");
    
    // Create auth token
    $token = wp_create_nonce('store_auth_' . $user->ID);
    
    return array(
        'success' => true,
        'message' => 'Login successful',
        'user' => array(
            'id' => $user->ID,
            'email' => $user->user_email,
            'firstName' => $user->first_name,
            'lastName' => $user->last_name,
            'displayName' => $user->display_name,
            'avatarUrl' => get_avatar_url($user->ID),
        ),
        'token' => $token,
        'authCookie' => true,
    );
}

/**
 * Validate Auth (Check if user is logged in)
 * Uses the same authentication logic as other protected endpoints
 */
function store_validate_auth($request) {
    // Use the same permission check logic
    $is_authenticated = store_check_user_logged_in($request);
    
    if (!$is_authenticated) {
        return array(
            'success' => false,
            'authenticated' => false,
            'message' => 'Not authenticated',
        );
    }
    
    $user_id = get_current_user_id();
    $user = get_userdata($user_id);
    
    if (!$user) {
        return array(
            'success' => false,
            'authenticated' => false,
            'message' => 'User not found',
        );
    }
    
    return array(
        'success' => true,
        'authenticated' => true,
        'user' => array(
            'id' => $user->ID,
            'email' => $user->user_email,
            'firstName' => $user->first_name,
            'lastName' => $user->last_name,
            'displayName' => $user->display_name,
            'avatarUrl' => get_avatar_url($user->ID),
        ),
    );
}

/**
 * Get User Profile
 */
function store_get_user_profile($request) {
    $user_id = get_current_user_id();
    
    if (!$user_id) {
        return new WP_Error('unauthorized', 'User not authenticated', array('status' => 401));
    }
    
    $user = get_userdata($user_id);
    
    if (!$user) {
        return new WP_Error('user_not_found', 'User not found', array('status' => 404));
    }
    
    // Get WooCommerce customer data if available
    $customer_data = array();
    if (function_exists('wc_get_customer')) {
        $customer = new WC_Customer($user_id);
        $customer_data = array(
            'billing' => array(
                'firstName' => $customer->get_billing_first_name(),
                'lastName' => $customer->get_billing_last_name(),
                'address1' => $customer->get_billing_address_1(),
                'address2' => $customer->get_billing_address_2(),
                'city' => $customer->get_billing_city(),
                'state' => $customer->get_billing_state(),
                'postcode' => $customer->get_billing_postcode(),
                'country' => $customer->get_billing_country(),
                'phone' => $customer->get_billing_phone(),
            ),
            'shipping' => array(
                'firstName' => $customer->get_shipping_first_name(),
                'lastName' => $customer->get_shipping_last_name(),
                'address1' => $customer->get_shipping_address_1(),
                'address2' => $customer->get_shipping_address_2(),
                'city' => $customer->get_shipping_city(),
                'state' => $customer->get_shipping_state(),
                'postcode' => $customer->get_shipping_postcode(),
                'country' => $customer->get_shipping_country(),
            ),
        );
    }
    
    return array(
        'success' => true,
        'user' => array(
            'id' => $user->ID,
            'email' => $user->user_email,
            'firstName' => $user->first_name,
            'lastName' => $user->last_name,
            'displayName' => $user->display_name,
            'avatarUrl' => get_avatar_url($user->ID),
            'registered' => $user->user_registered,
        ),
        'customer' => $customer_data,
    );
}

/**
 * Update User Profile
 */
function store_update_user_profile($request) {
    $user_id = get_current_user_id();
    
    if (!$user_id) {
        return new WP_Error('unauthorized', 'User not authenticated', array('status' => 401));
    }
    
    $params = $request->get_json_params();
    
    // Update WordPress user data
    $user_data = array('ID' => $user_id);
    
    if (isset($params['firstName'])) {
        $user_data['first_name'] = sanitize_text_field($params['firstName']);
    }
    
    if (isset($params['lastName'])) {
        $user_data['last_name'] = sanitize_text_field($params['lastName']);
    }
    
    if (isset($params['displayName'])) {
        $user_data['display_name'] = sanitize_text_field($params['displayName']);
    }
    
    // Update user
    $result = wp_update_user($user_data);
    
    if (is_wp_error($result)) {
        return new WP_Error('update_failed', $result->get_error_message(), array('status' => 500));
    }
    
    // Update WooCommerce customer data if provided
    if (isset($params['billing']) || isset($params['shipping'])) {
        if (function_exists('wc_get_customer')) {
            $customer = new WC_Customer($user_id);
            
            if (isset($params['billing'])) {
                $billing = $params['billing'];
                if (isset($billing['firstName'])) $customer->set_billing_first_name($billing['firstName']);
                if (isset($billing['lastName'])) $customer->set_billing_last_name($billing['lastName']);
                if (isset($billing['address1'])) $customer->set_billing_address_1($billing['address1']);
                if (isset($billing['city'])) $customer->set_billing_city($billing['city']);
                if (isset($billing['state'])) $customer->set_billing_state($billing['state']);
                if (isset($billing['postcode'])) $customer->set_billing_postcode($billing['postcode']);
                if (isset($billing['country'])) $customer->set_billing_country($billing['country']);
                if (isset($billing['phone'])) $customer->set_billing_phone($billing['phone']);
            }
            
            if (isset($params['shipping'])) {
                $shipping = $params['shipping'];
                if (isset($shipping['firstName'])) $customer->set_shipping_first_name($shipping['firstName']);
                if (isset($shipping['lastName'])) $customer->set_shipping_last_name($shipping['lastName']);
                if (isset($shipping['address1'])) $customer->set_shipping_address_1($shipping['address1']);
                if (isset($shipping['city'])) $customer->set_shipping_city($shipping['city']);
                if (isset($shipping['state'])) $customer->set_shipping_state($shipping['state']);
                if (isset($shipping['postcode'])) $customer->set_shipping_postcode($shipping['postcode']);
                if (isset($shipping['country'])) $customer->set_shipping_country($shipping['country']);
            }
            
            $customer->save();
        }
    }
    
    // Get updated user data
    $user = get_userdata($user_id);
    
    return array(
        'success' => true,
        'message' => 'Profile updated successfully',
        'user' => array(
            'id' => $user->ID,
            'email' => $user->user_email,
            'firstName' => $user->first_name,
            'lastName' => $user->last_name,
            'displayName' => $user->display_name,
        ),
    );
}

/**
 * Get User Orders
 */
function store_get_user_orders($request) {
    $user_id = get_current_user_id();
    
    if (!$user_id) {
        return new WP_Error('unauthorized', 'User not authenticated', array('status' => 401));
    }
    
    // Get WooCommerce orders for user
    $orders = wc_get_orders(array(
        'customer_id' => $user_id,
        'limit' => $request->get_param('per_page') ?? 50,
        'page' => $request->get_param('page') ?? 1,
        'orderby' => 'date',
        'order' => 'DESC',
    ));
    
    $formatted_orders = array();
    foreach ($orders as $order) {
        $formatted_orders[] = array(
            'id' => $order->get_id(),
            'orderNumber' => $order->get_order_number(),
            'status' => $order->get_status(),
            'date' => $order->get_date_created()->format('Y-m-d H:i:s'),
            'total' => $order->get_total(),
            'currency' => $order->get_currency(),
            'itemsCount' => $order->get_item_count(),
            'paymentMethod' => $order->get_payment_method_title(),
        );
    }
    
    return array(
        'success' => true,
        'orders' => $formatted_orders,
        'total' => count($formatted_orders),
    );
}

/**
 * Logout Handler
 */
function store_handle_user_logout($request) {
    $user_id = get_current_user_id();
    
    if ($user_id) {
        error_log("Store Debug: User logged out - ID: {$user_id}");
    }
    
    // Clear WordPress auth
    wp_logout();
    
    return array(
        'success' => true,
        'message' => 'Logged out successfully',
    );
}

/**
 * Permission callback: Check if user is logged in
 * Also accepts user ID from X-User-ID header if API key is valid (for cross-domain scenarios)
 */
function store_check_user_logged_in($request) {
    // First, check if user is logged in via WordPress session (cookies)
    if (is_user_logged_in()) {
        return true;
    }
    
    // Fallback: If API key is valid and user ID is provided in header, verify that user exists
    $api_key = $request->get_header('X-API-Key');
    if ($api_key === 'store-react-2024') {
        $user_id = $request->get_header('X-User-ID');
        if ($user_id && is_numeric($user_id)) {
            $user = get_user_by('ID', intval($user_id));
            if ($user) {
                // Set the current user for this request
                wp_set_current_user($user->ID);
                return true;
            }
        }
    }
    
    return false;
}

/**
 * Link orders to logged-in users during checkout
 */
add_action('woocommerce_checkout_order_processed', 'store_link_order_to_user', 10, 1);

function store_link_order_to_user($order_id) {
    $user_id = get_current_user_id();
    
    if ($user_id) {
        $order = wc_get_order($order_id);
        if ($order && $order->get_customer_id() === 0) {
            $order->set_customer_id($user_id);
            $order->save();
            error_log("Store Debug: Order {$order_id} linked to user {$user_id}");
        }
    }
}

// ============================================================================
// GAMIFICATION API ENDPOINTS (Phase 2 - Points System)
// ============================================================================

/**
 * Register gamification endpoints
 */
add_action('rest_api_init', function () {
    // Get user points
    register_rest_route('store/v1', '/gamification/points', array(
        'methods' => 'GET',
        'callback' => 'store_get_user_points',
        'permission_callback' => 'store_check_user_logged_in',
    ));
    
    // Get points history
    register_rest_route('store/v1', '/gamification/points/history', array(
        'methods' => 'GET',
        'callback' => 'store_get_points_history',
        'permission_callback' => 'store_check_user_logged_in',
    ));
    
    // Get user rank
    register_rest_route('store/v1', '/gamification/rank', array(
        'methods' => 'GET',
        'callback' => 'store_get_user_rank',
        'permission_callback' => 'store_check_user_logged_in',
    ));
    
    // Get user achievements
    register_rest_route('store/v1', '/gamification/achievements', array(
        'methods' => 'GET',
        'callback' => 'store_get_user_achievements',
        'permission_callback' => 'store_check_user_logged_in',
    ));
});

/**
 * Get User Points
 * Returns the current user's point balance
 */
function store_get_user_points($request) {
    $user_id = get_current_user_id();
    
    if (!$user_id) {
        return new WP_Error('unauthorized', 'User not authenticated', array('status' => 401));
    }
    
    // Get points from GamiPress
    $points = 0;
    
    if (function_exists('gamipress_get_user_points')) {
        // Try to get points - GamiPress may have different point type slugs
        // First, try to get all point types for this user
        $point_types = gamipress_get_points_types();
        
        if (!empty($point_types)) {
            // Get the first point type (or try common slugs)
            $point_type_slug = null;
            
            // Try common point type slugs
            $possible_slugs = array('store-points', 'store_points', 'points', 'point');
            
            foreach ($possible_slugs as $slug) {
                if (isset($point_types[$slug])) {
                    $point_type_slug = $slug;
                    break;
                }
            }
            
            // If no match, use the first available point type
            if (!$point_type_slug && !empty($point_types)) {
                $point_type_slug = array_key_first($point_types);
            }
            
            if ($point_type_slug) {
                $points = gamipress_get_user_points($user_id, $point_type_slug);
                error_log("Store Debug: Fetched {$points} points for user {$user_id} using point type '{$point_type_slug}'");
            } else {
                error_log("Store Debug: No point types found in GamiPress");
            }
        } else {
            error_log("Store Debug: GamiPress point types not available");
        }
    } else {
        error_log("Store Debug: GamiPress function gamipress_get_user_points not available");
    }
    
    return array(
        'success' => true,
        'points' => intval($points),
        'formatted' => number_format($points) . ' Points',
    );
}

/**
 * Get Points History
 * Returns the user's points transaction log
 */
function store_get_points_history($request) {
    $user_id = get_current_user_id();
    
    if (!$user_id) {
        return new WP_Error('unauthorized', 'User not authenticated', array('status' => 401));
    }
    
    global $wpdb;
    
    // Query GamiPress logs for points
    $table_name = $wpdb->prefix . 'gamipress_logs';
    
    // Check if table exists
    if ($wpdb->get_var("SHOW TABLES LIKE '{$table_name}'") != $table_name) {
        return array(
            'success' => true,
            'history' => array(),
            'total' => 0,
            'message' => 'GamiPress not installed or tables not created',
        );
    }
    
    $logs = $wpdb->get_results($wpdb->prepare(
        "SELECT * FROM {$table_name} 
         WHERE user_id = %d 
         AND type = 'points_award' 
         ORDER BY date DESC 
         LIMIT 50",
        $user_id
    ));
    
    $formatted_logs = array();
    foreach ($logs as $log) {
        $formatted_logs[] = array(
            'id' => $log->log_id,
            'points' => intval($log->points),
            'title' => $log->title,
            'description' => $log->description ?? '',
            'date' => $log->date,
        );
    }
    
    return array(
        'success' => true,
        'history' => $formatted_logs,
        'total' => count($formatted_logs),
    );
}

/**
 * Get User Rank
 * Returns the current user's rank/tier
 */
function store_get_user_rank($request) {
    $user_id = get_current_user_id();
    
    if (!$user_id) {
        return new WP_Error('unauthorized', 'User not authenticated', array('status' => 401));
    }
    
    // Default rank data
    $rank_data = array(
        'id' => null,
        'title' => 'Bronze',
        'slug' => 'bronze',
        'points' => 0,
    );
    
    // Get rank from GamiPress
    if (function_exists('gamipress_get_rank_types')) {
        $rank_types = gamipress_get_rank_types();
        
        if (!empty($rank_types)) {
            // Try common rank type slugs
            $possible_slugs = array('store-rank', 'store_rank', 'rank', 'ranks');
            $rank_type_slug = null;
            
            foreach ($possible_slugs as $slug) {
                if (isset($rank_types[$slug])) {
                    $rank_type_slug = $slug;
                    break;
                }
            }
            
            // If no match, use the first available rank type
            if (!$rank_type_slug && !empty($rank_types)) {
                $rank_type_slug = array_key_first($rank_types);
            }
            
            if ($rank_type_slug && function_exists('gamipress_get_user_rank')) {
                $rank = gamipress_get_user_rank($user_id, $rank_type_slug);
                
                if ($rank) {
                    $rank_data = array(
                        'id' => $rank->ID,
                        'title' => $rank->post_title,
                        'slug' => $rank->post_name,
                    );
                    error_log("Store Debug: Fetched rank '{$rank->post_title}' for user {$user_id} using rank type '{$rank_type_slug}'");
                } else {
                    error_log("Store Debug: No rank found for user {$user_id} in rank type '{$rank_type_slug}'");
                }
            }
        } else {
            error_log("Store Debug: No rank types found in GamiPress");
        }
    } else {
        error_log("Store Debug: GamiPress rank functions not available");
    }
    
    // Get current points (reuse the points function logic)
    $points = 0;
    if (function_exists('gamipress_get_user_points')) {
        $point_types = gamipress_get_points_types();
        if (!empty($point_types)) {
            $possible_slugs = array('store-points', 'store_points', 'points', 'point');
            $point_type_slug = null;
            
            foreach ($possible_slugs as $slug) {
                if (isset($point_types[$slug])) {
                    $point_type_slug = $slug;
                    break;
                }
            }
            
            if (!$point_type_slug && !empty($point_types)) {
                $point_type_slug = array_key_first($point_types);
            }
            
            if ($point_type_slug) {
                $points = gamipress_get_user_points($user_id, $point_type_slug);
            }
        }
    }
    
    $rank_data['points'] = intval($points);
    
    return array(
        'success' => true,
        'rank' => $rank_data,
    );
}

/**
 * Get User Achievements
 * Returns earned and unearned achievements for the current user
 */
function store_get_user_achievements($request) {
    $user_id = get_current_user_id();
    
    if (!$user_id) {
        return new WP_Error('unauthorized', 'User not authenticated', array('status' => 401));
    }
    
    $achievements_data = array(
        'earned' => array(),
        'unearned' => array(),
        'total_earned' => 0,
        'total_available' => 0,
    );
    
    if (function_exists('gamipress_get_achievement_types')) {
        $achievement_types = gamipress_get_achievement_types();
        
        if (!empty($achievement_types)) {
            // Get all achievements from all types
            foreach ($achievement_types as $type => $type_data) {
                $achievements = get_posts(array(
                    'post_type' => $type,
                    'posts_per_page' => -1,
                    'post_status' => 'publish',
                ));
                
                foreach ($achievements as $achievement) {
                    $earned = false;
                    $earned_date = null;
                    
                    if (function_exists('gamipress_has_user_earned_achievement')) {
                        $earned = gamipress_has_user_earned_achievement($achievement->ID, $user_id);
                        if ($earned && function_exists('gamipress_get_user_achievement_earned_date')) {
                            $earned_date = gamipress_get_user_achievement_earned_date($user_id, $achievement->ID);
                        }
                    } else {
                        // Fallback: Check user meta for earned achievements
                        $earned_achievements = get_user_meta($user_id, '_gamipress_earned_achievements', true);
                        if (is_array($earned_achievements) && in_array($achievement->ID, $earned_achievements)) {
                            $earned = true;
                        }
                    }
                    
                    $points = 0;
                    if (function_exists('gamipress_get_achievement_points')) {
                        $points = gamipress_get_achievement_points($achievement->ID);
                    } else {
                        // Fallback: Get points from post meta
                        $points = get_post_meta($achievement->ID, '_gamipress_points', true);
                        if (!$points) {
                            $points = get_post_meta($achievement->ID, 'points', true);
                        }
                    }
                    
                    $image_url = null;
                    $thumbnail_id = get_post_thumbnail_id($achievement->ID);
                    if ($thumbnail_id) {
                        $image_url = wp_get_attachment_url($thumbnail_id);
                    }
                    
                    $achievement_data = array(
                        'id' => $achievement->ID,
                        'title' => $achievement->post_title,
                        'description' => wp_strip_all_tags($achievement->post_content),
                        'points' => intval($points),
                        'image' => $image_url,
                        'earned' => $earned,
                        'earned_date' => $earned_date,
                        'type' => $type,
                    );
                    
                    if ($earned) {
                        $achievements_data['earned'][] = $achievement_data;
                    } else {
                        $achievements_data['unearned'][] = $achievement_data;
                    }
                }
            }
            
            $achievements_data['total_earned'] = count($achievements_data['earned']);
            $achievements_data['total_available'] = count($achievements_data['earned']) + count($achievements_data['unearned']);
            
            // Sort earned by date (newest first), unearned by points (highest first)
            usort($achievements_data['earned'], function($a, $b) {
                if (!$a['earned_date'] || !$b['earned_date']) return 0;
                return strtotime($b['earned_date']) - strtotime($a['earned_date']);
            });
            
            usort($achievements_data['unearned'], function($a, $b) {
                return $b['points'] - $a['points'];
            });
            
            error_log("Store Debug: Fetched {$achievements_data['total_earned']} earned and " . count($achievements_data['unearned']) . " unearned achievements for user {$user_id}");
        } else {
            error_log("Store Debug: No achievement types found in GamiPress");
        }
    } else {
        error_log("Store Debug: GamiPress achievement functions not available");
    }
    
    return array(
        'success' => true,
        'achievements' => $achievements_data,
    );
}

// ============================================================================
// LEADERBOARD API ENDPOINT (Phase 2 - Gamification)
// ============================================================================

/**
 * Register leaderboard endpoint
 */
add_action('rest_api_init', function () {
    // Get leaderboard (public endpoint - anyone can view leaderboard)
    register_rest_route('store/v1', '/gamification/leaderboard', array(
        'methods' => 'GET',
        'callback' => 'store_get_leaderboard',
        'permission_callback' => '__return_true', // Public endpoint
    ));
});

/**
 * Get Leaderboard
 * Returns top users ranked by points from GamiPress
 * 
 * @param WP_REST_Request $request The request object
 * @return array|WP_Error Leaderboard data or error
 */
function store_get_leaderboard($request) {
    global $wpdb;
    
    // Get query parameters
    $limit = intval($request->get_param('limit')) ?: 50; // Default to top 50
    $limit = min($limit, 100); // Cap at 100 for performance
    
    // Get point type slug (same logic as store_get_user_points)
    $point_type_slug = null;
    $point_types = array();
    
    if (function_exists('gamipress_get_points_types')) {
        $point_types = gamipress_get_points_types();
        
        if (!empty($point_types)) {
            // Try common point type slugs
            $possible_slugs = array('store-points', 'store_points', 'points', 'point');
            
            foreach ($possible_slugs as $slug) {
                if (isset($point_types[$slug])) {
                    $point_type_slug = $slug;
                    break;
                }
            }
            
            // If no match, use the first available point type
            if (!$point_type_slug && !empty($point_types)) {
                $point_type_slug = array_key_first($point_types);
            }
        }
    }
    
    if (!$point_type_slug) {
        return array(
            'success' => true,
            'leaderboard' => array(),
            'total' => 0,
            'message' => 'No point types configured in GamiPress',
        );
    }
    
    // GamiPress stores points in usermeta with key: _gamipress_{point_type_slug}_points
    $meta_key = '_gamipress_' . $point_type_slug . '_points';
    
    // Query users with highest points
    // Exclude administrators from leaderboard (optional - can be removed if needed)
    $admin_ids = get_users(array(
        'role' => 'administrator',
        'fields' => 'ID',
    ));
    
    // Build safe admin exclusion clause
    $admin_exclusion = '';
    if (!empty($admin_ids)) {
        $admin_ids_int = array_map('intval', $admin_ids);
        $admin_placeholders = implode(',', array_fill(0, count($admin_ids_int), '%d'));
        $admin_exclusion = "AND um.user_id NOT IN ({$admin_placeholders})";
    }
    
    // Build query with proper prepared statement
    $query = "SELECT 
            um.user_id,
            CAST(um.meta_value AS UNSIGNED) as points
        FROM {$wpdb->usermeta} um
        INNER JOIN {$wpdb->users} u ON um.user_id = u.ID
        WHERE um.meta_key = %s
        AND CAST(um.meta_value AS UNSIGNED) > 0
        {$admin_exclusion}
        ORDER BY CAST(um.meta_value AS UNSIGNED) DESC
        LIMIT %d";
    
    // Prepare arguments for prepared statement
    $prepare_args = array($meta_key);
    if (!empty($admin_ids)) {
        $prepare_args = array_merge($prepare_args, $admin_ids_int);
    }
    $prepare_args[] = $limit;
    
    $users = $wpdb->get_results($wpdb->prepare($query, ...$prepare_args));
    
    $leaderboard = array();
    $rank = 1;
    $current_user_id = get_current_user_id(); // For highlighting current user
    
    foreach ($users as $user_data) {
        $user_id = intval($user_data->user_id);
        $user = get_userdata($user_id);
        
        if (!$user) {
            continue; // Skip if user doesn't exist
        }
        
        // Get user rank from GamiPress if available
        $user_rank = null;
        if (function_exists('gamipress_get_rank_types')) {
            $rank_types = gamipress_get_rank_types();
            if (!empty($rank_types)) {
                $rank_type_slug = null;
                $possible_rank_slugs = array('store-rank', 'store_rank', 'rank', 'ranks');
                
                foreach ($possible_rank_slugs as $slug) {
                    if (isset($rank_types[$slug])) {
                        $rank_type_slug = $slug;
                        break;
                    }
                }
                
                if (!$rank_type_slug && !empty($rank_types)) {
                    $rank_type_slug = array_key_first($rank_types);
                }
                
                if ($rank_type_slug && function_exists('gamipress_get_user_rank')) {
                    $rank_obj = gamipress_get_user_rank($user_id, $rank_type_slug);
                    if ($rank_obj) {
                        $user_rank = $rank_obj->post_title;
                    }
                }
            }
        }
        
        $leaderboard[] = array(
            'rank' => $rank++,
            'user_id' => $user_id,
            'display_name' => $user->display_name ?: $user->user_login,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'avatar_url' => get_avatar_url($user_id, array('size' => 64)),
            'points' => intval($user_data->points),
            'rank_title' => $user_rank ?: null,
            'is_current_user' => ($current_user_id === $user_id),
        );
    }
    
    // Log for debugging
    error_log("Store Debug: Leaderboard fetched - {$point_type_slug}, " . count($leaderboard) . " users");
    
    return array(
        'success' => true,
        'leaderboard' => $leaderboard,
        'total' => count($leaderboard),
        'point_type' => $point_type_slug,
    );
}



