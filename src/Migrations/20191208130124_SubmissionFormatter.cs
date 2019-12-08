using Microsoft.EntityFrameworkCore.Migrations;

namespace src.Migrations
{
    public partial class SubmissionFormatter : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "QualityRatio",
                table: "Submissions",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<string>(
                name: "QualityStatus",
                table: "Submissions",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "QualityRatio",
                table: "Submissions");

            migrationBuilder.DropColumn(
                name: "QualityStatus",
                table: "Submissions");
        }
    }
}
