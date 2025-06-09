import { HttpClient } from "../../tools/httpClient";
import { Manufacturer, mapToManufacturers } from "./manufactured";

export class ManufacturerProvider {

    static async getManufacturer(): Promise<Manufacturer[]> {
        const response = await HttpClient.get("Manufacturer/Get/All");

        const values =  mapToManufacturers((response as Manufacturer[]));

        return values;
    } 
}