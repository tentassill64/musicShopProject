using Dapper;
using musicShopProject.Tools.DataBase.Interfaces;
using Npgsql;

namespace musicShopProject.Tools.DataBase;

public class MainConnector : IMainConnector
{
    private String _connectionString { get; }

    public MainConnector(String connectionString)
    {
        _connectionString = connectionString;
    }

    public T? Get<T>(String query, params NpgsqlParameter[] parameters)
    {
        DynamicParameters dynamicParameters = new();
        foreach (NpgsqlParameter parameter in parameters)
        {
            dynamicParameters.Add(parameter.ParameterName, parameter.Value, parameter.DbType, parameter.Direction, parameter.Size);
        }

        using NpgsqlConnection connection = new NpgsqlConnection(_connectionString);
        connection.Open();

        return connection.QueryFirstOrDefault<T>(query, dynamicParameters);
    }

    public T[] GetArray<T>(String query, params NpgsqlParameter[] parameters)
    {
        DynamicParameters dynamicParameters = new();
        foreach (NpgsqlParameter parameter in parameters)
        {
            dynamicParameters.Add(parameter.ParameterName, parameter.Value, parameter.DbType, parameter.Direction, parameter.Size);
        }

        using NpgsqlConnection connection = new NpgsqlConnection(_connectionString);
        connection.Open();

        return connection.Query<T>(query, dynamicParameters).ToArray();

    }

    public void ExecuteNonQuery(String query, params NpgsqlParameter[] parameters)
    {
        using NpgsqlConnection connection = new NpgsqlConnection(_connectionString);
        connection.Open();

        using NpgsqlCommand command = new NpgsqlCommand(query, connection);
        foreach (NpgsqlParameter parameter in parameters)
        {
            command.AddParameter(parameter.ParameterName, parameter.Value);
        }

        command.ExecuteNonQuery();

        connection.Close();
        connection.Dispose();
    }
}
