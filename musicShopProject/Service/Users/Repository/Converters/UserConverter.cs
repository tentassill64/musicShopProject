using musicShopProject.Model.Users;
using musicShopProject.Service.Users.Repository.Models;

namespace musicShopProject.Service.Users.Repository.Converters;

public static class UserConverter
{
    public static User ToUser(this UserDB db)
    {
        return new User(db.Id, db.PhoneNumber, db.Email);
    }
}
