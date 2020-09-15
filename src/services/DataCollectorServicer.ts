import { IAsset } from "@djonnyx/tornado-types";
import { DataCombiner } from "@djonnyx/tornado-refs-processor";
import { refApiService } from "./RefApiService";
import { config } from "../Config";
import { of } from "rxjs";

class DataCollectorService {
    run(): void {
        const dataCombiner = new DataCombiner({
            assetsTransformer: (assets: Array<IAsset>) => {
              return of(assets); //assetsStore.setManifest(assets);
            },
            dataService: refApiService,
            updateTimeout: config.refServer.updateTimeout,
          })
        
          dataCombiner.onChange.subscribe(
            data => {
              
            }
          );
          dataCombiner.init();
    }
}

export const dataCollectorService = new DataCollectorService();