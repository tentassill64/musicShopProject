using musicShopProject.Model.Manufacturers;
using musicShopProject.Service.Manufacturers.Repository.Models;

namespace musicShopProject.Service.Manufacturers.Repository.Converters;

public static class ManufacturerConverter
{
    public static Manufacturer ToManufacturer(this ManufacturerDB? manufacturerDB)
    {
        return new Manufacturer(manufacturerDB.Id, manufacturerDB.Name, manufacturerDB.Logo, manufacturerDB.Country);
    }
}
