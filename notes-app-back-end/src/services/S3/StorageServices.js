const AWS = require('aws-sdk')

class StorageService {
  constructor () {
    this._S3 = new AWS.S3()
  }

  writeFile (file, meta) {
    const parameter = {
      // Nama S3 Bucket yang digunakan
      Bucket: process.env.AWS_BUCKET_NAME,
      // Nama berkas yang akan disimpan
      Key: +new Date() + meta.filename,
      // Berkas (dalam bentuk Buffer) yang akan disimpan
      Body: file._data,
      // MIME Type berkas yang akan disimpan
      ContentType: meta.headers['content-type']
    }

    return new Promise((resolve, reject) => {
      this._S3.upload(parameter, (error, data) => {
        if (error) {
          return reject(error)
        }

        return resolve(data.Location)
      })
    })
  }
}

module.exports = StorageService
