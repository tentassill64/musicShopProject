namespace musicShopProject.Model.Products;

public partial class ProductBlank
{
    public Guid? Id { get; set; }
    public String? Name { get; set; }
    public String? Description { get; set; }
    public String? Category { get; set; }
    public Decimal? Price { get; set; }
    public Decimal? Weight { get; set; }
    public String? Manufacturer { get; set; }
    public Int32? Quantity { get; set; }
    public String? Image {  get; set; }
    public String? Status { get; set; }
}
public partial class ProductBlank
{
    public class Validated
    {
        public Guid Id { get; }
        public String Name { get; }
        public String Description { get; }
        public String Category { get; }
        public Decimal Price { get; }
        public Decimal Weight { get; }
        public String Manufacturer { get; }
        public Int32 Quantity { get; }
        public String Image { get; }
        public String Status { get; }
        public Validated(Guid id, String name, String description, Decimal price, String category, Decimal weight, String manufacturer, Int32 quantity, String image, String status)
        {
            Id = id;
            Name = name;
            Description = description;
            Category = category;
            Price = price;
            Weight = weight;
            Manufacturer = manufacturer;
            Quantity = quantity;
            Image = image;
            Status = status;
        }
    }
}
