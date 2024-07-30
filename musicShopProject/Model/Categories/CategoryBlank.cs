namespace musicShopProject.Model.Categories;

public partial class CategoryBlank
{
    public Guid? Id { get; set; }
    public String? Name { get; set; }
}

public partial class CategoryBlank
{
    public class Validated
    {
        public Guid Id { get; }
        public String Name { get; }

        public Validated(Guid id, String name)
        {
            Id = id;
            Name = name;
        }
    }
}
