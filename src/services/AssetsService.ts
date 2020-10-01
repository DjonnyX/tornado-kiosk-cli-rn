import { IAssetStoreFileService } from "@djonnyx/tornado-assets-store";
import { ExternalStorage } from "../native";
import { from } from "rxjs";
import { map } from "rxjs/operators";
import { Buffer } from "buffer";
import { IAsset } from "@djonnyx/tornado-types";
import { config } from "../Config";

class AssetsService implements IAssetStoreFileService {

    public readonly manifestFileName = "manifest.json";

    normalizeFilePath(path: string): string {
        let result: string;
        result = path.startsWith("file://") ? path.slice(7) : path;
        result = path.indexOf("/") === 0 ? path.slice(1) : path;
        return result;
    }

    readManifest(path: string): Promise<Array<IAsset>> {
        return this.readFile<Array<IAsset>>(`${path}/${this.manifestFileName}`);
    }

    writeManifest(path: string, data: Array<IAsset>): Promise<void> {
        return this.writeFile(`${path}/${this.manifestFileName}`, data);
    }

    writeFile(path: string, data: any): Promise<void> {
        return ExternalStorage.writeFile(
            this.normalizeFilePath(path),
            new Buffer(JSON.stringify(data), "utf8").toString("base64"),
        );
    }

    readFile<T = any>(path: string): Promise<T> {
        return from(
            ExternalStorage.readFile(
                this.normalizeFilePath(path)
            ),
        ).pipe(
            map(data => new Buffer(data, "base64")),
            map(string => {
                return JSON.parse(string.toString("utf8"));
            })
        ).toPromise();
    }

    downloadAsset(url: string, outputPath: string): Promise<void> {
        return from(
            ExternalStorage.downloadFile(
                `${config.refServer.address}/${url}`.replace("\\", "/"),
                this.normalizeFilePath(outputPath),
            ),
        ).toPromise();
    }

    deleteAsset(filePath: string): Promise<void> {
        return ExternalStorage.unlink(
            this.normalizeFilePath(filePath),
        );
    }

    exists(filePath: string): Promise<boolean> {
        return ExternalStorage.exists(
            this.normalizeFilePath(filePath),
        );
    }

    mkdir(dirPath: string): Promise<void> {
        return ExternalStorage.mkdir(
            this.normalizeFilePath(dirPath),
        );
    }
}

export const assetsService = new AssetsService();