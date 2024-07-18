using Npgsql;

namespace musicShopProject.Tools.DataBase;

public static class DataBaseFuncs
{
    public static NpgsqlConnection CreateConnection()
    {
        return new NpgsqlConnection("Host=localhost;Port=5432;Username=postgres;Password=postgres;Database=postgres;");
    }

    public static NpgsqlCommand CreateCommand(this NpgsqlConnection connection, String query)
    {
        return new NpgsqlCommand(query, connection);
    }

    public static void AddParameter<T> (this NpgsqlCommand command,String name, T? value)
    {
        if (value is not null) command.Parameters.AddWithValue(name, value);
        else command.Parameters.AddWithValue(name,DBNull.Value);
    }
}
