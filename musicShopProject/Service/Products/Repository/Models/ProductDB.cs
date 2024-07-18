namespace musicShopProject.Service.Products.Repository.Models
{
    public class ProductDB
    {
        public Guid Id { get; set; }
        public String Name { get; set; }
        public String Description { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public DateTime UpdatedDateTime { get; set;}
        public Decimal Price { get; set; }
        public Decimal Weight { get; set; }
        public String Manufacturer { get; set; }
        public Int32 Quantity { get; set; }
        public String Category { get; set;}
        public String Image {  get; set; }
        public String Status { get; set; }
    }
}
