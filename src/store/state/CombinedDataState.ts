import { ICompiledData, ITerminal } from "@djonnyx/tornado-types";
import { IProgress } from "@djonnyx/tornado-refs-processor/dist/DataCombiner";

export interface ICombinedDataState {
    data: ICompiledData | null;
    terminal: ITerminal | null;
    progress: IProgress;
}