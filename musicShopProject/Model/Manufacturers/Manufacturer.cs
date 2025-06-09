using musicShopProject.Model.Manufacturers.Enums;

namespace musicShopProject.Model.Manufacturers;

public class Manufacturer
{
    public Guid Id { get;  }

    public String Name { get; }

    public String Logo { get; }

    public Countries Country { get; }

    public Manufacturer(Guid id, String name, String logo, Countries country)
    {
        Id = id;
        Name = name;
        Logo = logo;
        Country = country;
    }
}
