namespace musicShopProject.Model.Categories;

public partial class CategoryBlank
{
    public Guid? Id { get; set; }

    public String? Name { get; set; }

    public String? Photo { get; set; }

    public Guid? CreatedUserId { get; set; }

    public Guid? ModifiedUserId { get; set; }
}

public partial class CategoryBlank
{
    public class Validated
    {
        public Guid Id { get; }

        public String Name { get; }

        public String Photo { get; }

        public Guid CreatedUserId { get; }

        public Guid? ModifiedUserId { get; }

        public Validated(Guid id, String name, String photo, Guid createdUserId, Guid? modifiedUserId)
        {
            Id = id;
            Name = name;
            Photo = photo;
            CreatedUserId = createdUserId;
            ModifiedUserId = modifiedUserId;
        }
    }
}
