// Import the BlobServiceClient from the Azure SDK
import { BlobServiceClient } from '@azure/storage-blob';

// DOMContentLoaded event to ensure DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('fileSelect');
    const messageElement = document.getElementById('message');

    uploadForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the default form submission

        const file = fileInput.files[0];
        const allowedExt = ["jpg", "jpeg", "png"];
        const maxSize = 50 * 1024 * 1024; // 50MB

        // Clear previous message
        messageElement.textContent = "";

        // Check if a file was selected
        if (!file) {
            messageElement.textContent = "Error: No file selected!";
            return;
        }

        const fileName = file.name;
        const fileSize = file.size;
        const fileExt = fileName.split('.').pop().toLowerCase();

        // Verify file extension
        if (!allowedExt.includes(fileExt)) {
            messageElement.textContent = "Error: Please select a valid file format (.jpg, .jpeg, .png).";
            return;
        }

        // Verify file size
        if (fileSize > maxSize) {
            messageElement.textContent = "Error: File size is larger than the allowed limit of 50MB.";
            return;
        }

        try {
            const sasUrl = 'https://jawastr1.blob.core.windows.net/uploadfile?sp=racwd&st=2024-08-15T23:51:17Z&se=2024-08-16T07:51:17Z&spr=https&sv=2022-11-02&sr=c&sig=LrA5mXc1g4GGJ2rNNJ1JSWqWAVSE3BAEf0f5pWtiM6M%3D';  // Replace with your actual SAS URL

            // Create the BlobServiceClient object with the SAS URL
            const blobServiceClient = new BlobServiceClient(sasUrl);

            // Get a container client
            const containerClient = blobServiceClient.getContainerClient('uploadfile'); // Replace with your existing container name

            // Create a unique name for the blob
            const blobName = new Date().getTime() + '-' + file.name;

            // Get a block blob client
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);

            // Upload the file
            await blockBlobClient.uploadBrowserData(file);

            messageElement.textContent = 'File uploaded successfully!';
        } catch (error) {
            console.error("Upload Error: ", error);
            messageElement.textContent = 'File upload failed. Check the console for more details.';
        }
    });
});
