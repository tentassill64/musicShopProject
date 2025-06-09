namespace musicShopProject.Service.Categories.Repository.Models;

public class CategoryDB
{
    public Guid Id { get; set; }

    public String Name { get; set; }

    public String Photo { get; set; }

    public Guid CreatedUserId { get; set; }

    public Guid? ModifiedUserId { get; set; }
}
