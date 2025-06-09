namespace musicShopProject.Tools.Types;

public class DataResult<T>
{
    public Result Result { get; }
    public T? Data { get; }

    public DataResult(Result result, T? data)
    {
        Result = result;
        Data = data;
    }

    public static DataResult<T?> Fail(String error)
    {
        return new DataResult<T?>(Result.Fail(error), default(T?));
    }

    public static DataResult<T> Success(T data)
    {
        return new DataResult<T>(Result.Success(), data);
    }
}
