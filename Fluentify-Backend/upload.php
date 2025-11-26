<?php
/**
 * Simple File Upload Handler
 * Place this file in the root of your website: C:\inetpub\vhosts\newtechtest.in\inventory.newtechtest.in\upload.php
 * Access it via: https://inventory.newtechtest.in/upload.php
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Security: Simple API Key check (change this!)
$API_KEY = 'fluentify_secure_upload_key_2024';

// Get headers
$headers = getallheaders();
$auth_header = isset($headers['Authorization']) ? $headers['Authorization'] : '';

// Check API Key
if ($auth_header !== 'Bearer ' . $API_KEY && $_POST['api_key'] !== $API_KEY) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Only POST allowed']);
    exit;
}

if (!isset($_FILES['file'])) {
    echo json_encode(['success' => false, 'message' => 'No file uploaded']);
    exit;
}

// Get upload path from request
$upload_path = isset($_POST['path']) ? $_POST['path'] : '';
// Remove any suspicious characters to prevent directory traversal
$upload_path = str_replace('..', '', $upload_path);

// Base directory for PDF storage
$base_dir = __DIR__ . '/LanguagePDF'; // C:\inetpub\vhosts\newtechtest.in\inventory.newtechtest.in\LanguagePDF

// Full target directory
$target_dir = $base_dir . '/' . $upload_path;

// Create directory if it doesn't exist
if (!file_exists($target_dir)) {
    mkdir($target_dir, 0777, true);
}

$file = $_FILES['file'];
$filename = basename($file['name']);
$target_file = $target_dir . '/' . $filename;

if (move_uploaded_file($file['tmp_name'], $target_file)) {
    echo json_encode([
        'success' => true, 
        'message' => 'File uploaded successfully',
        'path' => $upload_path . '/' . $filename
    ]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to move uploaded file']);
}
?>
