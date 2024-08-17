// app3.js

import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';

async function FileUpload() {
    const fileInput = document.getElementById('fileSelect');
    const file = fileInput.files[0];
    const message = document.getElementById('message');

    // Validate file selection
    if (!file) {
        message.textContent = "Please select a file to upload.";
        return;
    }

    // Validate file type
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (!allowedExtensions.includes(`.${fileExtension}`)) {
        message.textContent = "Invalid file type. Please upload a .jpg, .jpeg, or .png file.";
        return;
    }

    // Validate file size
    const maxFileSize = 50 * 1024 * 1024; // 50 MB
    if (file.size > maxFileSize) {
        message.textContent = "File size exceeds the 50MB limit.";
        return;
    }

    try {
        message.textContent = "Uploading file...";

        // Azure Blob Storage configuration
        const accountName = "jawastr1"; // Your storage account name
        const accountKey = "skXNZ3nC3mapYiYJ2s236RF2Yr9Fp/xT9k8lUB4cKAcwv
