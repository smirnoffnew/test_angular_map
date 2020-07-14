import {MakerModel} from "../models/makers.models";

export abstract class Helper<T> {
    PIPE(...items: T[]): T[] {
        let state: T[] = [];
        if (Array.isArray(items)) {
            for (const item of items) {
                state = typeof item === 'function' ? item(state) : item;
            }
        }
        return state;
    }


    CONCAT_ALL(data: T[]): T[] {
        return Array.isArray(data) ? data.reduce<T[]>((flat: T[], toFlatten: T) => {
            return flat.concat(
                Array.isArray(toFlatten) ? this.CONCAT_ALL(toFlatten) : toFlatten
            );
        }, []) : [];
    }

    getDateAllSec(
        year: number,
        month: number,
        date: number
    ): string {
        return new Date(year, month, date).getTime().toString();
    }

    getDataSourceArray(array: T[], name: string): T[] {
        return [...(array || [])]
            .map<T>((i: T ): T => i[name])
            .filter((_: T ): boolean => !!_);
    }


    strToJson(func, def){
        try {
            return func()
        } catch (e) {
            return def;
        }
    }

    search(
        array: MakerModel[],
        text: string = ''
    ): MakerModel[] {
        if (!text) {
            return array;
        }

        text = text.toLowerCase();

        return array.filter((i: MakerModel): boolean => {
            return !!Object.values(i as any)
                .find((item: any) => {
                    const lower = typeof item === 'string' && item.toLowerCase();
                    return lower && lower.includes(text)
                });
        });
    }


    searchByCategoryArray(
        arrayData: MakerModel[],
        arraySearch: string[] = []
    ){
        return arrayData.filter((i: MakerModel): boolean => {
            return arraySearch.some(item => i.category.includes(item))
        });
    }

}
