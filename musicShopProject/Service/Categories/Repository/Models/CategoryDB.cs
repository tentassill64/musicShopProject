namespace musicShopProject.Service.Categories.Repository.Models;

public class CategoryDB
{
    public Guid Id { get; set; }
    public String Name { get; set; }
    public Boolean IsRemoved { get; set; }
    public DateTime CreatedDateTime { get; set; }
    public DateTime? ModifiedDateTime { get; set; }
    public Guid CreatedUserId { get; set; }
    public Guid? ModifiedUserId { get; set; }
}
