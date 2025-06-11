
export enum Countries
{
    // 1. Северная Америка
    USA = 1,         // Fender, Gibson, PRS, Music Man, Shure, Mesa/Boogie
    Canada = 2,      // Seagull, Godin

    // 2. Европа
    Germany = 3,     // Neumann, Sennheiser, Beyerdynamic, Kemper
    UK = 4,          // Focusrite, Marshall, Orange
    Sweden = 5,      // Nord
    France = 6,      // Selmer, Buffet Crampon
    Austria = 7,     // AKG
    Liechtenstein = 8, // Neutrik
    Denmark = 9,     // TC Electronic

    // 3. Азия
    Japan = 10,      // Yamaha, Roland, Korg, Ibanez, Boss, ESP
    Taiwan = 11,     // Mapex, Jupiter
    SouthKorea = 12, // Cort, Schecter (часть производств)
    China = 13,      // бюджетные бренды (Harley Benton, некоторые Alesis)

    // 4. Австралия
    Australia = 14   // Rode
}

export namespace Countries {
    export function getDisplayName(country: Countries): string {
        switch(country) {
            case Countries.USA: return "США";
            case Countries.Canada: return "Канада";
            case Countries.Germany: return "Германия";
            case Countries.UK: return "Великобритания";
            case Countries.Sweden: return "Швеция";
            case Countries.France: return "Франция";
            case Countries.Austria: return "Австрия";
            case Countries.Liechtenstein: return "Лихтенштейн";
            case Countries.Denmark: return "Дания";
            case Countries.Japan: return "Япония";
            case Countries.Taiwan: return "Тайвань";
            case Countries.SouthKorea: return "Южная Корея";
            case Countries.China: return "Китай";
            case Countries.Australia: return "Австралия";
        }
    }
}