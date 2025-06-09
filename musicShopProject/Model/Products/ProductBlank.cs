namespace musicShopProject.Model.Products;

public partial class ProductBlank
{
    public Guid? Id { get; set; }
    public String? Name { get; set; }
    public String? Description { get; set; }
    public Guid? CategoryId { get; set; }
    public Decimal? Price { get; set; }
    public Decimal? Weight { get; set; }
    public Guid? ManufacturerId { get; set; }
    public Int32? Quantity { get; set; }
    public String[]? Images {  get; set; }
    public Int32? Status { get; set; }
    public Boolean? IsHidden { get; set; }
}
public partial class ProductBlank
{
    public class Validated
    {
        public Guid Id { get; }
        public String Name { get; }
        public String Description { get; }
        public Guid CategoryId { get; }
        public Decimal Price { get; }
        public Decimal Weight { get; }
        public Guid ManufacturerId { get; }
        public Int32 Quantity { get; }
        public String[] Images { get; }
        public Int32 Status { get; }
        public Boolean IsHidden { get; }
        //public Guid UserId { get; }

        public Validated(
            Guid id, String name, String description, Decimal price, 
            Guid categoryId, Decimal weight, Guid manufacturer, 
            Int32 quantity, String[] image, Int32 status, Boolean isHidden
            //Guid userId
        )
        {
            Id = id;
            Name = name;
            Description = description;
            CategoryId = categoryId;
            Price = price;
            Weight = weight;
            ManufacturerId = manufacturer;
            Quantity = quantity;
            Images = image;
            Status = status;
            IsHidden = isHidden;
            //UserId = userId;
        }
    }
}
