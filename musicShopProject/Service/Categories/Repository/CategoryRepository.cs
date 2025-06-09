using musicShopProject.Model.Categories;
using musicShopProject.Service.Categories.Repository.Converters;
using musicShopProject.Service.Categories.Repository.Models;
using musicShopProject.Tools.DataBase.Interfaces;
using Npgsql;

namespace musicShopProject.Service.Categories.Repository;

public class CategoryRepository : ICategoryRepository
{
    private readonly IMainConnector _mainConnector;
    public CategoryRepository(IMainConnector mainConnector)
    {
        _mainConnector = mainConnector;
    }
    public void SaveCategory(CategoryBlank.Validated validatedBlank)
    {
        String query = @"INSERT INTO categories (
                       id, name, isremoved, createddatetimeutc, 
                       createduserid, photo
                       )
                       VALUES ( @p_id, @p_name, false, @p_datetime, @p_createdUserId, @p_photo) 
                       ON CONFLICT (id) 
                       DO UPDATE SET 
                       name = @p_name, 
                       modifieddatetimeutc = @p_datetime, 
                       photo = @p_photo,
                       modifieduserid = @p_modifiedUserId";

        NpgsqlParameter[] parameters =
        {
            new("p_id", validatedBlank.Id),
            new("p_name", validatedBlank.Name),
            new("p_datetime", DateTime.UtcNow),
            new("p_createdUserId", validatedBlank.CreatedUserId),
            new("p_modifiedUserId", validatedBlank.ModifiedUserId),
            new("p_photo", validatedBlank.Photo)
        };

        _mainConnector.ExecuteNonQuery(query, parameters);
    }

    public Category[] GetAllCategories()
    {
        String query = @"SELECT * FROM categories WHERE isremoved = false";

        CategoryDB[] categoriesDB = _mainConnector.GetAllArray<CategoryDB>(query);

        return categoriesDB.Select(categoryDB => categoryDB.ToCategory()).ToArray();
    }

    public void RemoveCategory(Guid categoryId)
    {
        String query = @"UPDATE categories 
                    SET isremoved = true, 
                        modifieddatetimeutc = @p_datetime
                    WHERE id = @p_id";

        NpgsqlParameter[] parameters =
        {
        new("p_id", categoryId),
        new("p_datetime", DateTime.UtcNow)
    };

        _mainConnector.ExecuteNonQuery(query, parameters);
    }
}
