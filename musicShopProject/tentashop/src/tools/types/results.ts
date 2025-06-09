

export class Result{
    constructor(
       public isSuccess: boolean,
       public errors: string[] | null
    ){}
}

export namespace Result {
    export function success(): Result {
        return new Result(true, null);
    }

    export function fail(errors: string[]): Result {
        return new Result(false, errors);
    }
}

export const mapToResult = (resultData: any): Result => {
    return !resultData.isSuccess
        ? Result.fail(resultData.errors)
        : Result.success();
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
