using musicShopProject.Model.Manufacturers.Enums;

namespace musicShopProject.Model.Manufacturers;

public partial class ManufacturerBlank
{
    public Guid? Id { get; set; }

    public String? Name { get; set; }

    public String? Logo { get; set; }

    public Countries? Country { get; set; }
}

public partial class ManufacturerBlank
{
    public class Validated
    {
        public Guid Id { get; }

        public String Name { get; }

        public String Logo { get; }

        public Countries Country { get; }

        public Validated(Guid id, String name, String logo, Countries country)
        {
            Id = id;
            Name = name;
            Logo = logo;
            Country = country;
        }
    }
}
