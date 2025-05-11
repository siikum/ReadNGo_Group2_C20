using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReadNGo_Group2_C20.Migrations
{
    /// <inheritdoc />
    public partial class UpdateMembershipIdToGuid : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // First, drop the existing string column
            migrationBuilder.DropColumn(
                name: "MembershipId",
                table: "Users");

            // Then add it back as a UUID column
            migrationBuilder.AddColumn<Guid>(
                name: "MembershipId",
                table: "Users",
                type: "uuid",
                nullable: false,
                defaultValue: Guid.NewGuid());
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Drop the UUID column
            migrationBuilder.DropColumn(
                name: "MembershipId",
                table: "Users");

            // Add it back as a string column
            migrationBuilder.AddColumn<string>(
                name: "MembershipId",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}