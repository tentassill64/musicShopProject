using Microsoft.AspNetCore.Mvc;
using musicShopProject.Model.Manufacturers;
using musicShopProject.Model.Manufacturers.Enums;
using musicShopProject.Service.Manufacturers;
using musicShopProject.Tools.Types;

namespace musicShopProject.Controllers;

public class ManufactoryController : ControllerBase
{
    private readonly IManufacturerService _manufacturersService;

    public ManufactoryController(IManufacturerService manufacturersService)
    {
        _manufacturersService = manufacturersService;
    }

    [HttpPost("Manufacturer/Save")]
    public Result SaveManufacturer([FromBody] ManufacturerBlank? manufacturerBlank)
    {
        return _manufacturersService.SaveManufacturer(manufacturerBlank);
    }

    [HttpGet("ManufacturerBlank/GetById")]
    public Manufacturer GetManufacturerById([FromQuery] Guid? manufacturerId)
    {
        return _manufacturersService.GetManufacturerById(manufacturerId);
    }

    [HttpGet("ManufacturerBlank/GetBySeatchText")]
    public Manufacturer[] GetManufacturersBySeatchText([FromQuery] String? searchText)
    {
        return _manufacturersService.GetManufacturersBySeatchText(searchText);
    }

    [HttpGet("ManufacturerBlank/GetByCountry")]
    public Manufacturer[] GetManufacturersByCountry([FromQuery] Countries? manufacturerCountry)
    {
        return _manufacturersService.GetManufacturersByCountry(manufacturerCountry);
    }

    [HttpGet("ManufacturerBlank/RemoveById")]
    public Result RemoveManufacturerById([FromQuery] Guid? manufacturerId)
    {
        return _manufacturersService.RemoveManufacturerById(manufacturerId);
    }

    [HttpGet("Manufacturer/Get/All")]
    public Manufacturer[] GetManufacturers()
    {
        return _manufacturersService.GetManufacturers();
    }
}
