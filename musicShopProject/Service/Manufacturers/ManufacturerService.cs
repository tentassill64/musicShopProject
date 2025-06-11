using musicShopProject.Model.Manufacturers;
using musicShopProject.Model.Manufacturers.Enums;
using musicShopProject.Service.Manufacturers.Repository;
using musicShopProject.Service.Manufacturers.Repository.Models;
using musicShopProject.Tools.Extensions;
using musicShopProject.Tools.Types;
using System.Diagnostics.Metrics;
using System.Text.RegularExpressions;

namespace musicShopProject.Service.Manufacturers;

public class ManufacturerService : IManufacturerService
{
    private readonly IManufacturerRepository _manufacturerRepository;

    public ManufacturerService(IManufacturerRepository manufacturerRepository)
    {
        _manufacturerRepository = manufacturerRepository;
    }

    public Result SaveManufacturer(ManufacturerBlank? manufacturerBlank)
    {
        manufacturerBlank.Id ??= Guid.NewGuid();
        Result validatedResult = ManufacturerBlankPreProcess(manufacturerBlank, out ManufacturerBlank.Validated validatedManufacturerBlank);
        if (!validatedResult.IsSuccess) return Result.Fail(validatedResult.Errors.FirstOrDefault());

        _manufacturerRepository.SaveManufacturer(validatedManufacturerBlank);

        return Result.Success();
    }

    private Result ManufacturerBlankPreProcess(ManufacturerBlank? manufacturerBlank, out ManufacturerBlank.Validated validatedManufacturerBlank)
    {
        validatedManufacturerBlank = null;

        if (manufacturerBlank.Id is not { } id) throw new Exception("Id производителя пришел null");

        if (manufacturerBlank.Name is not { } name) throw new Exception("Название бренда пришло null");
        if (name.IsNullOrWhiteSpace()) return Result.Fail("Название бренда обязательно к заполнению");

        if (manufacturerBlank.Logo is not { } logo) throw new Exception("Ссылка на логотип пришло null");

        if (logo.IsNullOrWhiteSpace()) return Result.Fail("Логотип бренда обязателен");

        if (logo.IsUrlValid()) return Result.Fail("Логотип бренда неккоректен");

        if (manufacturerBlank.Country is not { } countryId) throw new Exception("Id страны пришел Null");

        validatedManufacturerBlank = new ManufacturerBlank.Validated(id, name, logo, countryId);

        return Result.Success();
    }

    public Manufacturer? GetManufacturerById(Guid? manufacturerId)
    {
        if (manufacturerId is not { } id) throw new Exception("Id производителя пришел null");

        return _manufacturerRepository.GetManufacturerById(id);
    }

    public Manufacturer[] GetManufacturersByCountry(Countries? manufacturerCountry)
    {
        if (manufacturerCountry is not { } country) throw new Exception("Country производителя пришел null");

        return _manufacturerRepository.GetManufacturersByCountry(country);
    }

    public Manufacturer[] GetManufacturersBySeatchText(string? searchText)
    {

        return _manufacturerRepository.GetManufacturersBySeatchText(searchText ?? String.Empty);
    }

    public Result RemoveManufacturerById(Guid? manufacturerId)
    {
        if (manufacturerId is not { } id) throw new Exception("Id производителя пришел null");

        _manufacturerRepository.RemoveManufacturerById(id);

        return Result.Success();
    }

    public Manufacturer[] GetManufacturers()
    {
        return _manufacturerRepository.GetManufacturers();
    }

}
