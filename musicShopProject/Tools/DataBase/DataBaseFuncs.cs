using Npgsql;

namespace musicShopProject.Tools.DataBase;

public static class DataBaseFuncs
{
    public static void AddParameter<T> (this NpgsqlCommand command,String name, T? value)
    {
        if (value is not null) command.Parameters.AddWithValue(name, value);
        else command.Parameters.AddWithValue(name,DBNull.Value);
    }
}
