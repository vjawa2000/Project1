async function handleFileUpload() {
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
        const connectionString = "DefaultEndpointsProtocol=https;AccountName=jawastr1;AccountKey=skXNZ3nC3mapYiYJ2s236RF2Yr9Fp/xT9k8lUB4cKAcwvPkrE5NO8ZxCZa4poGLqZRKDaMGbB9jM+AStE2w6lg==;EndpointSuffix=core.windows.net"; // Replace with your connection string
        const containerName = "uploadfile"; // Replace with your container name

        const { BlobServiceClient } = window.Azure.Storage.Blob;
        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        const containerClient = blobServiceClient.getContainerClient(containerName);

        // Ensure container exists
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
