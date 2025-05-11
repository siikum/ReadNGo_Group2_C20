﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReadNGo_Group2_C20.Migrations
{
    /// <inheritdoc />
    public partial class MakeMembershipIdProvidedNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "MembershipIdProvided",
                table: "OrderProcessingLogs",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "MembershipIdProvided",
                table: "OrderProcessingLogs",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);
        }
    }
}
