using musicShopProject.Model.Manufacturers.Enums;
using musicShopProject.Model.Manufacturers;
using musicShopProject.Tools.Types;

namespace musicShopProject.Service.Manufacturers.Repository;

public interface IManufacturerRepository
{
    public void SaveManufacturer(ManufacturerBlank.Validated validatedManufacturerBlank);

    public Manufacturer? GetManufacturerById(Guid manufacturerId);

    public Manufacturer[] GetManufacturersBySeatchText(String searchText);

    public Manufacturer[] GetManufacturersByCountry(Countries manufacturerCountry);

    public void RemoveManufacturerById(Guid manufacturerId);

    Manufacturer[] GetManufacturers();
}
