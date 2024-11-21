

export type Result = SuccessResult | FailResult;

export namespace Result {
    export function success(): SuccessResult {
        return new SuccessResult();
    }

    export function fail(errors: string[]): FailResult {
        return new FailResult(errors);
    }
}

export const mapToResult = (resultData: any): Result => {
    return !resultData.isSuccess
        ? Result.fail(resultData.errors)
        : Result.success();
}





export type DataResult<T> = SuccessDataResult<T> | FailResult;

export namespace DataResult {
    export function success<T>(value: T): SuccessDataResult<T> {
        return new SuccessDataResult<T>(value);
    }

    export function fail(errors: string[]): FailResult {
        return new FailResult(errors);
    }
}

export const mapToDataResult = <T>(resultData: any, dataConverter?: (data: any) => T): DataResult<T> => {
    if (!resultData.isSuccess) {
        const errors = resultData.errors;
        return DataResult.fail(errors);
    }

    const payload = dataConverter != undefined
        ? dataConverter(resultData.data)
        : resultData.data;
    return DataResult.success(payload);
}





class SuccessDataResult<T> {
    public isSuccess: true = true;
    public data: T

    constructor(data: T) {
        this.data = data;
    }
}

class SuccessResult {
    public isSuccess: true = true;
}

class FailResult {
    public isSuccess: false = false;
    public errors: string[];

    constructor(errors: string[]) {
        this.errors = errors;
    }

    public get errorsString(): string {
        return this.toString();
    }

    toString() {
        return this.errors.map(error => error).join('. ')
    }
}
