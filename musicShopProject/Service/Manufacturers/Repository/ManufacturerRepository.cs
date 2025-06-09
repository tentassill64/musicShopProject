using musicShopProject.Model.Manufacturers;
using musicShopProject.Model.Manufacturers.Enums;
using musicShopProject.Service.Manufacturers.Repository.Converters;
using musicShopProject.Service.Manufacturers.Repository.Models;
using musicShopProject.Service.Orders.Repository.Model;
using musicShopProject.Tools.DataBase.Interfaces;
using Npgsql;
using System.Numerics;

namespace musicShopProject.Service.Manufacturers.Repository;
public class ManufacturerRepository : IManufacturerRepository
{
    private readonly IMainConnector _mainConnector;

    public ManufacturerRepository(IMainConnector mainConnector)
    {
        _mainConnector = mainConnector;
    }

    public void SaveManufacturer(ManufacturerBlank.Validated validatedManufacturerBlank)
    {
        String query = "Insert into manufacturers (id, name, logo, createddatetimeutc, isremoved, country) " +
            "values(@p_id, @p_name, @p_logo, @p_timeUtcNow, false, @p_country) ON Conflict(id) do Update set name = @p_name, " +
            "logo = @p_logo, modifieddatetimeutc = @p_timeUtcNow, country = @p_country";

        NpgsqlParameter[] parameters =
        {
            new("p_id", validatedManufacturerBlank.Id),
            new("p_name", validatedManufacturerBlank.Name),
            new("p_logo", validatedManufacturerBlank.Logo),
            new("p_timeUtcNow", DateTime.UtcNow),
            new("p_country", validatedManufacturerBlank.Country),
        };

        _mainConnector.ExecuteNonQuery(query, parameters);
    }

    public Manufacturer? GetManufacturerById(Guid manufacturerId)
    {
        String query = "Select * from manufacturers WHERE id = @p_id and isremoved = false";

        NpgsqlParameter[] parameters =
        {
            new("p_id", manufacturerId),
        };

        ManufacturerDB? manufacturerDB = _mainConnector.Get<ManufacturerDB>(query, parameters);

        return manufacturerDB.ToManufacturer();
    }

    public Manufacturer[] GetManufacturersByCountry(Countries manufacturerCountry)
    {
        String query = "Select * from manufacturers WHERE country = @p_country and isremoved = false";

        NpgsqlParameter[] parameters =
        {
            new("p_country", manufacturerCountry),
        };

        ManufacturerDB[] manufacturerDBs = _mainConnector.GetArray<ManufacturerDB>(query, parameters);

        return manufacturerDBs.Select(manufacturerDB => manufacturerDB.ToManufacturer()).ToArray();
    }

    public Manufacturer[] GetManufacturersBySeatchText(string searchText)
    {
        String query = "Select * from manufacturers WHERE name ILIKE @p_name and isremoved = false";

        NpgsqlParameter[] parameters =
        {
            new("p_name", '%' + searchText + '%'),
        };

        ManufacturerDB[] manufacturerDBs = _mainConnector.GetArray<ManufacturerDB>(query, parameters);

        return manufacturerDBs.Select(manufacturerDB => manufacturerDB.ToManufacturer()).ToArray();
    }

    public void RemoveManufacturerById(Guid manufacturerId)
    {
        String query = "Update town SET isremoved = true," +
            "modifieddatetimeutc = @p_timeNowUtc WHERE id = @p_id";

        NpgsqlParameter[] parameters =
        {
            new("p_id", manufacturerId),
            new("p_timeUtcNow", DateTime.UtcNow)
        };

        _mainConnector.ExecuteNonQuery(query, parameters);
    }

   public Manufacturer[] GetManufacturers()
   {
        String query = "Select * from manufacturers WHERE isremoved = false";

        ManufacturerDB[] manufacturerDBs = _mainConnector.GetArray<ManufacturerDB>(query);

        return manufacturerDBs.Select(manufacturerDB => manufacturerDB.ToManufacturer()).ToArray();
    }
}
