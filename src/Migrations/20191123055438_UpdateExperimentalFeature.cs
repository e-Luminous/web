using Microsoft.EntityFrameworkCore.Migrations;

namespace src.Migrations
{
    public partial class UpdateExperimentalFeature : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ScriptFunctionToEvaluateExperiment",
                table: "Experiments",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ScriptFunctionToEvaluateExperiment",
                table: "Experiments");
        }
    }
}
