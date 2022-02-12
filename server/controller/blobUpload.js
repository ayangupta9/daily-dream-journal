const AzureStorageBlob = require('@azure/storage-blob')
const { Buffer } = require('buffer')
const { BlobServiceClient } = AzureStorageBlob
require('dotenv').config()

CONNECTION_STRING = process.env.AZURE_ANALYSIS_BLOB_STORAGE_CONNECTION_STRING

const blob_service_client = BlobServiceClient.fromConnectionString(CONNECTION_STRING)

async function streamToBuffer (readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = []
    readableStream.on('data', data => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data))
    })
    readableStream.on('end', () => {
      resolve(Buffer.concat(chunks))
    })
    readableStream.on('error', reject)
  })
}

async function uploadBlobToStorage (imageBuffer, profileId, entryId) {
  user_container_client = blob_service_client.getContainerClient(profileId)
  const containerCreated = await user_container_client.createIfNotExists()

  const blobClient = user_container_client.getBlockBlobClient(entryId)

  try {
    fs.readFile(imageBuffer.upload.filepath, async (err, data) => {
      const uploadedData = await blobClient.upload(data, data.length)
      console.log(uploadedData)
      fs.unlink(imageBuffer.upload.filepath, err => {
        if (err) {
          throw err
        }
      })
    })
  } catch (err) {
    console.error(err)
  }
}

async function downloadBlobsFromStorage (profileId) {
  const containerClient = blob_service_client.getContainerClient(profileId)

  let downloadedBlobStrings = {}

  if (await containerClient.exists()) {
    let blobs = containerClient.listBlobsFlat()

    for await (const blob of blobs) {
      const blobClient = containerClient.getBlobClient(blob.name)
      const downloadBlockResponse = await blobClient.download()
      const downloaded = (
        await streamToBuffer(downloadBlockResponse.readableStreamBody)
      ).toString('base64')
      downloadedBlobStrings[blob.name] = downloaded
    }
  }

  if (Object.keys(downloadedBlobStrings).length > 0) {
    return downloadedBlobStrings
  } else {
    return false
  }
}

async function downloadSingleBlobFromStorage (container_name, blob_name) {
  const containerClient = blob_service_client.getContainerClient(container_name)

  if (containerClient.exists()) {
    const blobClient = containerClient.getBlobClient(blob_name)

    if (blobClient.exists()) {
      const downloadBlockBlobResponse = await blobClient.download()
      const downloaded = (
        await streamToBuffer(downloadBlockBlobResponse.readableStreamBody)
      ).toString('base64')

      return downloaded
    } else {
      return False
    }
  } else {
    return False
  }
}

module.exports = {
  uploadBlobToStorage,
  downloadBlobsFromStorage,
  downloadSingleBlobFromStorage
}
