using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Configs;

public partial class UpdateUserTable : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // Drop existing Age column if it exists
        migrationBuilder.DropColumn(
            name: "Age",
            table: "Users");

        // Add new columns
        migrationBuilder.AddColumn<string>(
            name: "Name",
            table: "Users",
            type: "varchar(100)",
            nullable: false);
            
        migrationBuilder.AddColumn<string>(
            name: "Surname",
            table: "Users",
            type: "varchar(100)",
            nullable: false);
            
        migrationBuilder.AddColumn<string>(
            name: "Email",
            table: "Users",
            type: "varchar(255)",
            nullable: false);
            
        migrationBuilder.AddColumn<string>(
            name: "Password",
            table: "Users",
            type: "varchar(255)",
            nullable: false);
            
        migrationBuilder.AddColumn<DateTime>(
            name: "DateOfBirth",
            table: "Users",
            type: "datetime",
            nullable: false);
            
        migrationBuilder.AddColumn<bool>(
            name: "IsAdmin",
            table: "Users",
            type: "tinyint(1)",
            nullable: false,
            defaultValue: false);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(
            name: "Name",
            table: "Users");
            
        migrationBuilder.DropColumn(
            name: "Surname",
            table: "Users");
            
        migrationBuilder.DropColumn(
            name: "Email",
            table: "Users");
            
        migrationBuilder.DropColumn(
            name: "Password",
            table: "Users");
            
        migrationBuilder.DropColumn(
            name: "DateOfBirth",
            table: "Users");
            
        migrationBuilder.DropColumn(
            name: "IsAdmin",
            table: "Users");

        // Add back the Age column
        migrationBuilder.AddColumn<int>(
            name: "Age",
            table: "Users",
            type: "int",
            nullable: false,
            defaultValue: 0);
    }
}