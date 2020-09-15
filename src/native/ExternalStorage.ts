import {
    NativeModules
} from 'react-native';

interface IExternalStorage {
    isExternalStorageReadOnly: () => Promise<boolean>;
    isExternalStorageAvailable: () => Promise<boolean>;
    writeToSDFile: (path: string, fileName: string, data: Blob) => Promise<any>;
    readFromSDFile: (path: string, fileName: string, data: Blob) => Promise<any>;
}

export const ExternalStorage: IExternalStorage = NativeModules.ExternalStorage;
