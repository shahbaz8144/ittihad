// // azure-storage.service.ts
// (global as any).Buffer = (global as any).Buffer || Buffer;
// import { Injectable } from '@angular/core';
// import { BlobServiceClient, ContainerClient, BlobUploadCommonResponse } from '@azure/storage-blob';
// //, BlockBlobClient

// @Injectable({
//   providedIn: 'root'
// })
// export class AzureStorageService {
//   private blobServiceClient: BlobServiceClient;
//   // private containerClient: ContainerClient;
//   constructor() {
//     // const connectionString = 'DefaultEndpointsProtocol=https;AccountName=yrglobaldocuments;AccountKey=BpcizQ8jUtvYwrmsp71yIrsfJMEoCqCf/n6Ayro/dS/Ak4WPxRXlXTc9LWN8dKw6Yv9c79IyUzO3tOx1sf3rbA==;EndpointSuffix=core.windows.net';
//     // this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
//     // this.containerClient = this.blobServiceClient.getContainerClient('documents');
//     // Set your Azure Storage connection string
//     const connectionString = 'DefaultEndpointsProtocol=https;AccountName=yrglobaldocuments;AccountKey=BpcizQ8jUtvYwrmsp71yIrsfJMEoCqCf/n6Ayro/dS/Ak4WPxRXlXTc9LWN8dKw6Yv9c79IyUzO3tOx1sf3rbA==;EndpointSuffix=core.windows.net';

//     // Initialize the BlobServiceClient using the connection string
//     this.blobServiceClient = new BlobServiceClient(connectionString);
//   }

//   async uploadFileII(file: File): Promise<BlobUploadCommonResponse> {
//     // Get the current date to create a date-wise folder
//     const currentDate = new Date();
//     const folderName = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
//       .toString()
//       .padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

//     // Set your container name
//     const containerName = 'documents';

//     // Create a container client
//     const containerClient: ContainerClient = this.blobServiceClient.getContainerClient(containerName);

//     // Create the date-wise folder within the container
//     const folderClient = containerClient.getBlobClient(`${folderName}/`);

//     // Create a block blob client for the file within the folder
//     const blockBlobClient = folderClient.getBlockBlobClient();

//     // Convert the File to an ArrayBuffer
//     const arrayBuffer = await file.arrayBuffer();

//     // Upload the file to Azure Blob Storage
//     const response = await blockBlobClient.uploadData(arrayBuffer, { concurrency: 20 });

//     return response;
//   }

//   async uploadFile(file: File): Promise<BlobUploadCommonResponse> {
//     debugger
//     // Get the current date to create a date-wise folder
//     const currentDate = new Date();
//     const folderName = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
//       .toString()
//       .padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

//     // Set your container name
//     const containerName = 'documents';

//     // Create a container client
//     const containerClient: ContainerClient = this.blobServiceClient.getContainerClient(containerName);

//     // Create the date-wise folder within the container
//     const folderClient = containerClient.getBlobClient(`${folderName}/`);
//       alert(folderClient)
//     // Create a block blob client for the file within the folder
//     const blockBlobClient = folderClient.getBlockBlobClient();
//     alert(blockBlobClient)
//     // Convert the File to an ArrayBuffer
//     const arrayBuffer = await file.arrayBuffer();

//     // Upload the file to Azure Blob Storage
//     const response = await blockBlobClient.uploadData(arrayBuffer, { concurrency: 20 });

//     return response;
//     // const containerName = 'documents';
//     // const containerClient: ContainerClient = this.blobServiceClient.getContainerClient(containerName);
//     // const blockBlobClient = containerClient.getBlockBlobClient(fileName);

//     // // Convert the File to an ArrayBuffer
//     // const arrayBuffer = await file.arrayBuffer();

//     // // Upload the file to Azure Blob Storage
//     // await blockBlobClient.uploadData(arrayBuffer,);
//   }

//   // uploadFile(file: File): Promise<string> {
//   //   return new Promise((resolve, reject) => {
//   //     debugger
//   //     const blockBlobClient = this.containerClient.getBlockBlobClient(file.name);
//   //     const options = { blobHTTPHeaders: { blobContentType: file.type } };

//   //     blockBlobClient.uploadBrowserData(file, options)
//   //       .then(() => {
//   //         const blobUrl = blockBlobClient.url;
//   //         alert(blobUrl)
//   //         resolve(blobUrl);
//   //       })
//   //       .catch((error) => {
//   //         reject(error);
//   //       });
//   //   });
//   // }
// }
