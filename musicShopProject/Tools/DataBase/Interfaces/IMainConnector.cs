using musicShopProject.Tools.Types;
using Npgsql;

namespace musicShopProject.Tools.DataBase.Interfaces;

public interface IMainConnector
{
    void ExecuteNonQuery(String query, params NpgsqlParameter[] parameters);

    T? Get<T>(String query, params NpgsqlParameter[] parameters);

    Page<T> GetPage<T>(String query, params NpgsqlParameter[] parameters);

    T[] GetArray<T>(String query, params NpgsqlParameter[] parameters);

    public T[] GetAllArray<T>(String query);
}
