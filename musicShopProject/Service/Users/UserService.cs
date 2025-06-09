using musicShopProject.Model.Users;
using musicShopProject.Service.Users.Repository;
using musicShopProject.Tools.Extensions;
using musicShopProject.Tools.Types;
using System.Text.RegularExpressions;

namespace musicShopProject.Service.Users;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public DataResult<User> Login(String? phoneNumber, String? password)
    {
        if (phoneNumber.IsNullOrWhiteSpace()) return DataResult<User>.Fail("Укажите логин");
        if (password.IsNullOrWhiteSpace()) return DataResult<User>.Fail("Укажите пароль");

        User? existUser = _userRepository.GetUserByPhoneNumber(phoneNumber!, password!.GetHash());
        if (existUser is not { } user) return DataResult<User>.Fail("Неправильный логин или пароль");

        return DataResult<User>.Success(user);
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
        if (!Regex.IsMatch(blank.PhoneNumber, @"^\+?[1-9][0-9]{7,14}$")) return Result.Fail("Номер телефона указан не корректно");

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

    public User[] GetUsers(Guid[] usersIds)
    {
        return _userRepository.GetUsers(usersIds);
    }

    public User? GetUser(String phoneNumber)
    {
        return _userRepository.GetUser(phoneNumber);
    }

    public User? GetUserByToken(string email)
    {
        throw new NotImplementedException();
    }
}

