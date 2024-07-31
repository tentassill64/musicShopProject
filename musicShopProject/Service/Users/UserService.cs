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

    public Result Login(String? phoneNumber, String? password)
    {
        if (phoneNumber.IsNullOrWhiteSpace()) return Result.Fail("Укажите логин");
        if (password.IsNullOrWhiteSpace()) return Result.Fail("Укажите пароль");

        User? existUser = _userRepository.GetUserByPhoneNumber(phoneNumber!, password!.GetHash());
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

        if (blank.Password.IsNullOrWhiteSpace() && blank.PasswordBeChanged) return Result.Fail("Укажите пароль");
        if (blank.PhoneNumber.IsNullOrWhiteSpace()) return Result.Fail("Укажите номер телефона");

        //Валидация номера

        Password password = new(
            isCreating
            ? blank.Password!
            : blank.Password ?? existUser!.PasswordHash
        );

        validatedUser = new UserBlank.Validated(id,  password, blank.PhoneNumber!, blank.PasswordBeChanged!);

        return Result.Success();
    }

    public User? GetUser(Guid id)
    {
        return _userRepository.GetUser(id);
    }

    public Result UpdatePassword(String? phoneNumber, String? oldPassword, String? newPassword)
    {
        if (phoneNumber.IsNullOrWhiteSpace()) return Result.Fail("Укажите номер телефона");
        if (oldPassword.IsNullOrWhiteSpace()) return Result.Fail("Укажите старый пароль");
        if (newPassword.IsNullOrWhiteSpace()) return Result.Fail("Укажите новый пароль");

        User? user = _userRepository.GetUserByEmail(phoneNumber!, oldPassword!.GetHash());
        if (user is null) return Result.Fail("Пользователя с такими данными не существует");

        _userRepository.UpdateUserPassword(user.Id, newPassword!.GetHash());

        return Result.Success();
    }

    public User[] GetAllUsers()
    {
        return _userRepository.GetAllUsers();
    }

    public User? GetUser(String phoneNumber)
    {
        return _userRepository.GetUser(phoneNumber);
    }
}

