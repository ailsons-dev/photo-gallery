import { CompileShallowModuleMetadata } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Plugins, CameraResultType, Capacitor, FilesystemDirectory, 
  CameraPhoto, CameraSource } from '@capacitor/core';

//Azure Blob
//import { BlobUploadsViewStateService } from '../services/blob-uploads-view-state.service';
import { BlobStorageService } from '../services/blob-storage.service';
import { BlobFileRequest } from '../azure-storage';
import { SasGeneratorService } from './sas-generator.service';


//Azure Blob
//import { BlobService, UploadConfig, UploadParams } from 'angular-azure-blob-service';
//const Config: UploadParams = {
//  sas: 'my sas',
//  storageAccount: 'my dev storage account',
//  containerName: 'my container name'
//};

//AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=stoaccimages;AccountKey=Ev/xhlHof67jNvzeoZOwwh3A8DAdmZkBc0D8A7YD6j0/Lmde0gnCG7+/YWJ+Oq3P5Uow8DCBcDwU64LZqgcBVg==;EndpointSuffix=core.windows.net

const { Camera, Filesystem, Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  
  public photos: Photo[] = [];
  private PHOTO_STORAGE: string = "photos";


  //constructor(private blobState: BlobUploadsViewStateService) { };
  constructor(private blobStorage: BlobStorageService  ) { };
  
  private blobFile : BlobFileRequest;

  private async readAsBase64(cameraPhoto: CameraPhoto) {
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(cameraPhoto.webPath!);
    const blob = await response.blob();
  
    return await this.convertBlobToBase64(blob) as string;  
  }
  
  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  private async savePicture(cameraPhoto: CameraPhoto) {
    // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await this.readAsBase64(cameraPhoto);

    // Write the file to the data directory
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: FilesystemDirectory.Data
    });

    // Use webPath to display the new image instead of base64 since it's
    // already loaded into memory
    return {
      filepath: fileName,
      webviewPath: cameraPhoto.webPath
    };
  }

  public async addNewToGallery() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri, 
      source: CameraSource.Camera, 
      quality: 100 
    });
    // Save the picture and add it to photo collection
    const savedImageFile = await this.savePicture(capturedPhoto);
    this.photos.unshift(savedImageFile);

    //this.photos.unshift({
    //  filepath: "soon...",
    //  webviewPath: capturedPhoto.webPath
    //});
    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos)
    });
    
    
    //Upload photo to Azure 
    this.uploadPhotoToCloud(savedImageFile.filepath);
  }

  public async loadSaved() {
    // Retrieve cached photo array data
    const photoList = await Storage.get({ key: this.PHOTO_STORAGE });
    this.photos = JSON.parse(photoList.value) || [];
  
    // Display the photo by reading into base64 format
    for (let photo of this.photos) {
      // Read each saved photo's data from the Filesystem
      const readFile = await Filesystem.readFile({
          path: photo.filepath,
          directory: FilesystemDirectory.Data          
      });
      console.log(FilesystemDirectory.Data);
      console.log(photo.filepath);

      // Web platform only: Load the photo as base64 data
      photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
    }
  }

  public async deleteAllFromGallery(){
    Storage.clear();
    this.loadSaved();
  }

  //Azure Blob
  private async uploadPhotoToCloud(filename: string)
  {
    //Azure Blob
    // Retrieve cached photo array data
    const photoList = await Storage.get({ key: this.PHOTO_STORAGE });
    this.photos = JSON.parse(photoList.value) || [];

    // Read each saved photo's data from the Filesystem
    const readFile = await Filesystem.readFile({
      path: this.photos[0].filepath,
      directory: FilesystemDirectory.Data          
    });
  
  // Web platform only: Load the photo as base64 data
    let list = new DataTransfer();
    let file = new File([readFile.data], filename);
    list.items.add(file);
    
    let myFileList = list.files;

   // this.blobState.uploadItems(myFileList);
   // this.blobState.uploadQueue$;
   
   let s1 = 'DefaultEndpointsProtocol=https;AccountName=myazfunctionailsons;AccountKey=YhvopWUWb6X59rpQzIg+B8/F1yodaBhMDNl4q0KK9CUgWL+EKZ1G+2vDmnqo4WSsNq/mHNwguTMQbH6MF+r6mw==;EndpointSuffix=core.windows.net';
   
   this.blobFile = {filename:"", storageAccessToken:"", containerName: "", storageUri:"" };
   this.blobFile.filename = filename;
   this.blobFile.storageAccessToken = s1;
   this.blobFile.containerName = "azfunc-tratablob";
   //this.blobFile.storageUri
   this.blobStorage.uploadToBlobStorage(file, this.blobFile);
  }
}


export interface Photo {
  filepath: string;
  webviewPath: string;
}
