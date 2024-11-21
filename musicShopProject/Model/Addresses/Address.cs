namespace musicShopProject.Model.Addresses
{
    public class Address
    {
        public Guid Id { get; }
        public String City { get; }
        public String Street { get; }
        public String Home {  get; }
        public String? Apartment { get; }

        public Address(Guid id, String city, String street, String home, String? apartment)
        {
            Id = id;
            City = city;
            Street = street;
            Home = home;
            Apartment = apartment;
        }
    }
}
