export interface File {
  name: string;
  size: number;
  uri: string;
  contentType: string;
}

export interface Folder {
  name: string;
  folders: { [key: string]: Folder };
  files: File[];
  totalSize: number;
}

export interface RootFolder {
  name: string;
  folders: { [key: string]: Folder };
  files: File[];
  totalSize: number;
}
