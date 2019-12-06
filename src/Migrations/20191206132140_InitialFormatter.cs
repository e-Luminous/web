using Microsoft.EntityFrameworkCore.Migrations;

namespace src.Migrations
{
    public partial class InitialFormatter : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "HasRadioButton",
                table: "Experiments",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "RadioBasicMarkup",
                table: "Experiments",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RadioGroupNameAttribute",
                table: "Experiments",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RadioStringKeyword",
                table: "Experiments",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StandardJsonForMachineLearning",
                table: "Experiments",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HasRadioButton",
                table: "Experiments");

            migrationBuilder.DropColumn(
                name: "RadioBasicMarkup",
                table: "Experiments");

            migrationBuilder.DropColumn(
                name: "RadioGroupNameAttribute",
                table: "Experiments");

            migrationBuilder.DropColumn(
                name: "RadioStringKeyword",
                table: "Experiments");

            migrationBuilder.DropColumn(
                name: "StandardJsonForMachineLearning",
                table: "Experiments");
        }
    }
}
