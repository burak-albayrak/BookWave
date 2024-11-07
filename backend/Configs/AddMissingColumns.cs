using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Configs;

public partial class AddMissingColumns : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<bool>(
            name: "IsAvailable",
            table: "Books",
            type: "tinyint(1)",
            nullable: false,
            defaultValue: true);

        migrationBuilder.AddColumn<string>(
            name: "ImageUrl",
            table: "Books",
            type: "varchar(255)",
            nullable: true);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(
            name: "IsAvailable",
            table: "Books");

        migrationBuilder.DropColumn(
            name: "ImageUrl",
            table: "Books");
    }
}