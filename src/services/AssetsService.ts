import { Observable, from } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { config } from "../Config";
import { IAssetStoreApiService } from "@djonnyx/tornado-assets-store";

class AssetsService implements IAssetStoreApiService {
    getAsset(path: string): Promise<Buffer> {
        return from(
            fetch(`${config.refServer.address}/${path}`,
                {
                    method: "GET",
                    headers: {
                        "x-auth-token": config.license.apiKey,
                    }
                })
        ).pipe(
            switchMap(res => from(res.arrayBuffer())),
            map(buff => buff as Buffer)
        ).toPromise();
    }
}

export const assetsService = new AssetsService();