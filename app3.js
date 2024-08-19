async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file first.");
        return;
    }

    const accountName = "jawastr1 ";
    const containerName = "uploadfile";
    const sasToken = "sv=2022-11-02&ss=bfqt&srt=c&sp=rwdlacupiytfx&se=2024-08-20T07:25:04Z&st=2024-08-19T23:25:04Z&spr=https&sig=spcKFJsCPBQ2IDFBNtAiGj%2FTLRLmnqtcmPXATkyb3Gc%3D"; // Or connection string if using that method

    const blobServiceClient = new Azure.Storage.Blob.BlobServiceClient(
        `https://${accountName}.blob.core.windows.net?${sasToken}`
    );

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(file.name);

    try {
        const uploadResponse = await blobClient.uploadData(file, {
            onProgress: (ev) => console.log(`Upload progress: ${ev.loadedBytes} bytes`)
        });
        console.log("File uploaded successfully:", uploadResponse);
        alert("File uploaded successfully!");
    } catch (error) {
        console.error("Error uploading file:", error.message);
        alert("Error uploading file: " + error.message);
    }
}
