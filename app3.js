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
        const accountName = "jawastr1";
        const accountKey = "skXNZ3nC3mapYiYJ2s236RF2Yr9Fp/xT9k8lUB4cKAcwvPkrE5NO8ZxCZa4poGLqZRKDaMGbB9jM+AStE2w6lg==";
        const containerName = "uploadfile";

        // Create a new blob service client using the account name and key
        const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
        const blobServiceClient = new BlobServiceClient(
            `https://${accountName}.blob.core.windows.net`,
            sharedKeyCredential
        );

        // Get a container client and check if the container exists
        const containerClient = blobServiceClient.getContainerClient(containerName);
        if (!(await containerClient.exists())) {
            throw new Error("Container does not exist.");
        }

        // Upload the file
        const blobName = file.name;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        await blockBlobClient.uploadBrowserData(file);

        message.textContent = `File uploaded successfully: ${blobName}`;
    } catch (error) {
        console.error("Error uploading file:", error);
        message.textContent = `Error uploading file: ${error.message}`;
    }
}

// Handle file upload when the button is clicked
function handleFileUpload() {
    FileUpload();
}

// Get the button element
const uploadButton = document.getElementById('uploadButton');

// Add an event listener for the click event
uploadButton.addEventListener('click', handleFileUpload);
