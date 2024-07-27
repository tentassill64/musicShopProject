namespace musicShopProject.Model.Products;

public partial class ProductBlank
{
    public Guid? Id { get; set; }
    public String? Name { get; set; }
    public String? Description { get; set; }
    //TODO Guid
    public Int32? CategoryId { get; set; }
    public Decimal? Price { get; set; }
    public Decimal? Weight { get; set; }
    public String? Manufacturer { get; set; }
    public Int32? Quantity { get; set; }
    public String[]? Image {  get; set; }
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
        //TODO Guid
        public Int32 CategoryId { get; }
        public Decimal Price { get; }
        public Decimal Weight { get; }
        public String Manufacturer { get; }
        public Int32 Quantity { get; }

        //TODO Images
        public String[] Image { get; }
        public Int32 Status { get; }
        public Boolean IsHidden { get; }

        public Validated(
            Guid id, String name, String description, Decimal price, 
            Int32 categoryId, Decimal weight, String manufacturer, 
            Int32 quantity, String[] image, Int32 status, Boolean isHidden
        )
        {
            Id = id;
            Name = name;
            Description = description;
            CategoryId = categoryId;
            Price = price;
            Weight = weight;
            Manufacturer = manufacturer;
            Quantity = quantity;
            Image = image;
            Status = status;
            IsHidden = isHidden;
        }
    }
}
