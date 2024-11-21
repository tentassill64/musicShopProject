using musicShopProject.Model.Users;

namespace musicShopProject.Tools.Infrastructure;

public class SystemUser
{
    public Guid UserId { get; }

    public User User { get; }

    public SystemUser(User user)
    {
        User = user;
    }
}
