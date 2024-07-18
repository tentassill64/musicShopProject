using Npgsql;

namespace musicShopProject.Tools.DataBase.Interfaces;

public interface IMainConnector
{
    T? Get<T>(String query, params NpgsqlParameter[] parameters);

    void ExecuteNonQuery(String query, params NpgsqlParameter[] parameters);

    T[] GetArray<T>(String query, params NpgsqlParameter[] parameters);
}
