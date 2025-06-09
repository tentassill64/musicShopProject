using musicShopProject.Model.Manufacturers;
using musicShopProject.Model.Manufacturers.Enums;
using musicShopProject.Tools.Types;

namespace musicShopProject.Service.Manufacturers;

public interface IManufacturerService
{
    public Result SaveManufacturer(ManufacturerBlank? manufacturerBlank);

    public Manufacturer? GetManufacturerById(Guid? manufacturerId);

    public Manufacturer[] GetManufacturersBySeatchText(String? searchText);

    public Manufacturer[] GetManufacturersByCountry(Countries? manufacturerCountry);

    public Result RemoveManufacturerById(Guid? manufacturerId);

    Manufacturer[] GetManufacturers();
}
