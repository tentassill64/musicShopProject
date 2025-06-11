import { HttpClient } from "../../tools/httpClient";
import { mapToResult, Result } from "../../tools/types/results";
import { ManufacturerBlank } from "./manufacturerBlank";
import { Manufacturer, mapToManufacturers } from "./manufactured";

export class ManufacturerProvider {

    static async getManufacturer(): Promise<Manufacturer[]> {
        const response = await HttpClient.get("Manufacturer/Get/All");

        const values =  mapToManufacturers((response as Manufacturer[]));

        return values;
    } 

    static async saveManufacturer(manufacturerBlank: ManufacturerBlank) :Promise<Result> {

        const response = await HttpClient.post("Manufacturer/Save", manufacturerBlank);

        const result = mapToResult(response);

        return response;
    }
}