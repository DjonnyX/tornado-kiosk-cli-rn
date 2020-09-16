import { IAssetStoreFSService } from "@djonnyx/tornado-assets-store";
import { ExternalStorage } from "../native";
import { from } from "rxjs";
import { map } from "rxjs/operators";

class FSService implements IAssetStoreFSService {
    normalizeFilePath(path: string): string {
        return path.startsWith('file://') ? path.slice(7) : path;
    }

    readFile(path: string, fileName: string): Promise<Buffer> {
        return from(
            ExternalStorage.readFile(
                this.normalizeFilePath(`${path}/${fileName}`)
            ),
        ).pipe(
            map(data => Buffer.from(data, 'base64')),
        ).toPromise();
    }

    writeFile(path: string, fileName: string, data: any): Promise<void> {
        return ExternalStorage.writeFile(
            this.normalizeFilePath(`${path}/${fileName}`),
            new Buffer(data).toString("base64")
        );
    }

    exists(filePath: string): Promise<boolean> {
        return ExternalStorage.exists(
            this.normalizeFilePath(filePath)
        );
    }

    deleteFile(filePath: string): Promise<void> {
        return ExternalStorage.unlink(
            this.normalizeFilePath(filePath)
        );
    }

    mkdir(dirPath: string): Promise<void> {
        return ExternalStorage.mkdir(
            this.normalizeFilePath(dirPath)
        );
    }
}

export const fsService = new FSService();