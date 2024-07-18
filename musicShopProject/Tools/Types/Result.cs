namespace musicShopProject.Tools.Types;

public class Result
{
    public Boolean IsSuccess => Errors.Length == 0; 
    public String[] Errors { get;}
    public String ErrorsAsString => String.Join(", ", Errors);

    public Result(string[] errors)
    {
        Errors = errors;
    }

    public static Result Success()
    {
        return new Result([]);
    }

    public static Result Fail(String error)
    {
        return new Result([error]);
    }

    public static Result Fail(IEnumerable<String> error)
    {
        return new Result(error.ToArray());
    }
}
