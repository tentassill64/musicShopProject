
export interface IOptionGroup<T> {
    label: string;
    options: IOption<T>[];
}

export interface IOption<T> {
    label: string;
    value: T;
    group?: string;
}

export class Option<T> implements IOption<T> {
    constructor(
        public label: string,
        public value: T,
        public group?: string,
    ) { }
}

const getIndex = <T>(array: IOptionGroup<T>[], key: string): number | null => {
    for (let i = 0; i < array.length; i++) {
        if (array[i].label === key) return i;
    }

    return null;
};

export const groupOptions = <T>(options: IOption<T>[]): IOptionGroup<T>[] => {
    return options.reduce(
        (previousValue: IOptionGroup<T>[], currentItem: IOption<T>) => {
            const key = currentItem.group || '';
            const index = getIndex(previousValue, key);

            if (index !== null)
                previousValue[index].options.push(currentItem);
            else
                previousValue.push({ label: key, options: [currentItem] });

            return previousValue;
        }, []);
};

export const isOptionGroup = (option: any) => {
    return option.label != undefined && option.options != undefined;
};

export const mapToOption = <T>(data: any): IOption<T> => {
    const group = data.group ? data.group.name : undefined;
    return { label: data.label || data.text, value: data.value, group: group };
}

export const mapToOptions = <T>(data: any[]): IOption<T>[] => {
    return data.map(value => mapToOption<T>(value));
}

export const mapToDictinaryOptions = <T>(data: any[]) => {
    const dictionary: { [key: string]: IOption<T>[] } = {};

    for (var key in data) {
        dictionary[key] = mapToOptions<T>(data[key]);
    }

    return dictionary;
}

export const mapFromKeyValueToDictonaryOptions = <T>(data: any[]) => {
    const dictionary: { [key: string]: IOption<T>[] } = {};

    for (var keyValue of data) {
        dictionary[keyValue.key] = mapToOptions<T>(keyValue.value);
    }

    return dictionary;
}