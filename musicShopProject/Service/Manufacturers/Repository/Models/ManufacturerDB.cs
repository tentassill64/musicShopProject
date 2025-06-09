using musicShopProject.Model.Manufacturers;
using musicShopProject.Model.Manufacturers.Enums;

namespace musicShopProject.Service.Manufacturers.Repository.Models;

public class ManufacturerDB
{
    public Guid Id { get; set; }

    public String Name { get; set; }

    public String Logo { get; set; }

    public Countries Country { get; set; }
}
