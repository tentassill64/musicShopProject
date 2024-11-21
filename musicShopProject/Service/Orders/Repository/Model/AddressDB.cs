namespace musicShopProject.Service.Orders.Repository.Model
{
    public class AddressDB
    {
        public Guid Id { get; set; }
        public String City { get; set; }
        public String Street { get; set; }
        public String Home { get; set; }
        public String? Apartment { get; set; }
        public DateTime CreatedDateTimeUtc { get; set; }
        public DateTime? ModifiedDateTimeUtc { get; set;}
        public Boolean IsRemoved { get; set; }
    }
}
