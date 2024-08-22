from flask import Flask, request, redirect, url_for # type: ignore
from werkzeug.utils import secure_filename # type: ignore
from azure.storage.blob import BlobServiceClient # type: ignore
import os

app = Flask(__name__)

# Provided information
account_url = "https://jawastorage1.blob.core.windows.net"
container_name = "uploadfile"
sas_token = "sv=2022-11-02&ss=b&srt=sco&sp=rwdlaciytfx&se=2024-08-23T09:12:53Z&st=2024-08-21T01:12:53Z&spr=https&sig=ZcVGowalkTpnCAaZpIWhcahN2gbtAwBa5BnWjwZKCrI%3D"

@app.route('/')
def index():
    return open('upload.html').read()

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return redirect(request.url)
    file = request.files['file']
    if file.filename == '':
        return redirect(request.url)
    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join('temp', filename)  # Save file temporarily

        # Save the file temporarily
        file.save(file_path)

        # Upload to Azure Blob Storage
        blob_service_client = BlobServiceClient(account_url=account_url, credential=sas_token)
        container_client = blob_service_client.get_container_client(container_name)
        blob_client = container_client.get_blob_client(filename)

        try:
            with open(file_path, "rb") as data:
                blob_client.upload_blob(data)
            os.remove(file_path)  # Clean up the temporary file
            return 'File uploaded successfully'
        except Exception as e:
            return f"Error uploading file: {e}"

if __name__ == '__main__':
    app.run(debug=True)
