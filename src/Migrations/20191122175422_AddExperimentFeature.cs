using Microsoft.EntityFrameworkCore.Migrations;

namespace src.Migrations
{
    public partial class AddExperimentFeature : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ExperimentTableHeaderMarkUp",
                table: "Experiments",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ExperimentalTableBodyMarkUp",
                table: "Experiments",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ExperimentalTableJsonStructure",
                table: "Experiments",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExperimentTableHeaderMarkUp",
                table: "Experiments");

            migrationBuilder.DropColumn(
                name: "ExperimentalTableBodyMarkUp",
                table: "Experiments");

            migrationBuilder.DropColumn(
                name: "ExperimentalTableJsonStructure",
                table: "Experiments");
        }
    }
}
