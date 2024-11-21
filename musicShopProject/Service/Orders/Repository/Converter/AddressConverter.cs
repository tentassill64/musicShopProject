using musicShopProject.Model.Addresses;
using musicShopProject.Service.Orders.Repository.Model;

namespace musicShopProject.Service.Orders.Repository.Converter
{
    public static class AddressConverter
    {
        public static Address ToAddress(this AddressDB db)
        {
            return new Address(db.Id, db.City, db.Street, db.Home, db.Apartment);
        }
    }
}
