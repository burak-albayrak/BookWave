using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Configs;

public partial class AddAddressTable : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "Addresses",
            columns: table => new
            {
                AddressID = table.Column<int>(type: "int", nullable: false)
                    .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                UserID = table.Column<int>(type: "int", nullable: false),
                Country = table.Column<string>(type: "varchar(100)", nullable: false),
                City = table.Column<string>(type: "varchar(100)", nullable: false),
                District = table.Column<string>(type: "varchar(100)", nullable: false),
                PostalCode = table.Column<string>(type: "varchar(20)", nullable: false),
                AddressLine = table.Column<string>(type: "varchar(255)", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Addresses", x => x.AddressID);
                table.ForeignKey(
                    name: "FK_Addresses_Users_UserID",
                    column: x => x.UserID,
                    principalTable: "Users",
                    principalColumn: "UserID",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateIndex(
            name: "IX_Addresses_UserID",
            table: "Addresses",
            column: "UserID",
            unique: true);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(
            name: "Addresses");
    }
}