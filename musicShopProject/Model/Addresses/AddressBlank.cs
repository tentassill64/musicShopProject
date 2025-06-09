namespace musicShopProject.Model.Addresses;

public partial class AddressBlank
{
    public Guid? Id { get; set; }
    public String? City { get; set; }
    public String? Street { get; set; }
    public String? Home { get; set; }
    public String? Apartment { get; set; }
}

public partial class AddressBlank
{
    public class Validated
    {
        public Guid Id { get; }
        public String City { get;  }
        public String Street { get; }
        public String Home { get; }
        public String Apartment { get; }

        public Validated(Guid id, String city, String street, String home, String apartment)
        {
            Id = id;
            City = city;
            Street = street;
            Home = home;
            Apartment = apartment;
        }
    }
}
