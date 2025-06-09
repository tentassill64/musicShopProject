using System.Text.Json.Serialization;

namespace musicShopProject.Model.Categories;

public class Category
{
    public Guid Id { get; }

    public String Name { get; }

    public String Photo { get; }

    [JsonIgnore]
    public Guid CreatedUserId { get; }

    [JsonIgnore]
    public Guid? ModifiedUserId { get; }

    public Category(Guid id, String name, String photo, Guid createdUserId, Guid? modifiedUserId)
    {
        Id = id;
        Name = name;
        Photo = photo;
        CreatedUserId = createdUserId;
        ModifiedUserId = modifiedUserId;
    }
}
