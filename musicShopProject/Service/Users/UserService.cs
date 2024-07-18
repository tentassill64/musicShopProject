using musicShopProject.Model.Users;
using musicShopProject.Service.Users.Repository;
using musicShopProject.Tools.Extensions;
using musicShopProject.Tools.Types;

namespace musicShopProject.Service.Users;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public Result Login(String? login, String? password)
    {
        if (login.IsNullOrWhiteSpace()) return Result.Fail("Укажите логин");
        if (password.IsNullOrWhiteSpace()) return Result.Fail("Укажите пароль");

        User? existUser = _userRepository.GetUserByLogin(login!, password!.GetHash());
        if(existUser is null) return Result.Fail("Такого пользователя не существует");

        return Result.Success();
    }   

    public Result Register(UserBlank blank)
    {
         blank.Id ??= Guid.NewGuid();

        Result validateResult = ValidateUserBlank(blank, out UserBlank.Validated validatedBlank);
        if (!validateResult.IsSuccess) return Result.Fail(validateResult.Errors);

        _userRepository.Save(validatedBlank);

        return Result.Success(); 
    }

    private Result ValidateUserBlank(UserBlank blank, out UserBlank.Validated validatedUser)
    {
        validatedUser = null!;

        if (blank.Id is not { } id) throw new Exception("ID null у пользователя");

        User? existUser = GetUser(id);
        Boolean isCreating = existUser is null;

        if (blank.Login.IsNullOrWhiteSpace()) return Result.Fail("Укажите логин");
        if (blank.Password.IsNullOrWhiteSpace() && blank.PasswordBeChanged) return Result.Fail("Укажите пароль");
        if (blank.Email.IsNullOrWhiteSpace()) return Result.Fail("Укажите почту");

        Boolean isLoginUnique = IsUniqueLogin(blank.Login!);
        if (!isLoginUnique) return Result.Fail("Такой логин занят");

        Password password = new(
            isCreating
            ? blank.Password!
            : blank.Password ?? existUser!.PasswordHash
        );

        validatedUser = new UserBlank.Validated(id, blank.Login!, password, blank.Email!, blank.PasswordBeChanged!);

        return Result.Success();
    }

    private Boolean IsUniqueLogin(String login)
    {
        User? user = _userRepository.GetUser(login);
        return user is null;
    }

    public User? GetUser(Guid id)
    {
        return _userRepository.GetUser(id);
    }

    public Result UpdatePassword(String? email, String? oldPassword, String? newPassword)
    {
        if (email.IsNullOrWhiteSpace()) return Result.Fail("Укажите почту");
        if (oldPassword.IsNullOrWhiteSpace()) return Result.Fail("Укажите старый пароль");
        if (newPassword.IsNullOrWhiteSpace()) return Result.Fail("Укажите новый пароль");

        User? user = _userRepository.GetUserByEmail(email!, oldPassword!.GetHash());
        if (user is null) return Result.Fail("Пользователя с такими данными не существует");

        _userRepository.UpdateUserPassword(user.Id, newPassword!.GetHash());

        return Result.Success();
    }
}

