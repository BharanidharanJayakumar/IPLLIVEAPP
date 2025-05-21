using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IPLLive.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Seasons",
                columns: table => new
                {
                    SeasonId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Year = table.Column<int>(type: "int", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Seasons", x => x.SeasonId);
                });

            migrationBuilder.CreateTable(
                name: "Umpires",
                columns: table => new
                {
                    UmpireId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CountryCode = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Umpires", x => x.UmpireId);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    IsAdmin = table.Column<bool>(type: "bit", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastLogin = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "Venues",
                columns: table => new
                {
                    VenueId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    City = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Country = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Capacity = table.Column<int>(type: "int", nullable: true),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Venues", x => x.VenueId);
                });

            migrationBuilder.CreateTable(
                name: "Teams",
                columns: table => new
                {
                    TeamId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ShortName = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    LogoUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PrimaryColor = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    SecondaryColor = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    HomeVenueId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Teams", x => x.TeamId);
                    table.ForeignKey(
                        name: "FK_Teams_Venues_HomeVenueId",
                        column: x => x.HomeVenueId,
                        principalTable: "Venues",
                        principalColumn: "VenueId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Coaches",
                columns: table => new
                {
                    CoachId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Role = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CountryCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TeamId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Coaches", x => x.CoachId);
                    table.ForeignKey(
                        name: "FK_Coaches_Teams_TeamId",
                        column: x => x.TeamId,
                        principalTable: "Teams",
                        principalColumn: "TeamId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Matches",
                columns: table => new
                {
                    MatchId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SeasonId = table.Column<int>(type: "int", nullable: false),
                    HomeTeamId = table.Column<int>(type: "int", nullable: false),
                    AwayTeamId = table.Column<int>(type: "int", nullable: false),
                    VenueId = table.Column<int>(type: "int", nullable: false),
                    ScheduledDateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    MatchNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    TossWinnerTeamId = table.Column<int>(type: "int", nullable: true),
                    TossDecision = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    WinnerTeamId = table.Column<int>(type: "int", nullable: true),
                    WinMargin = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    MatchNotes = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Matches", x => x.MatchId);
                    table.ForeignKey(
                        name: "FK_Matches_Seasons_SeasonId",
                        column: x => x.SeasonId,
                        principalTable: "Seasons",
                        principalColumn: "SeasonId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Matches_Teams_AwayTeamId",
                        column: x => x.AwayTeamId,
                        principalTable: "Teams",
                        principalColumn: "TeamId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Matches_Teams_HomeTeamId",
                        column: x => x.HomeTeamId,
                        principalTable: "Teams",
                        principalColumn: "TeamId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Matches_Teams_TossWinnerTeamId",
                        column: x => x.TossWinnerTeamId,
                        principalTable: "Teams",
                        principalColumn: "TeamId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Matches_Teams_WinnerTeamId",
                        column: x => x.WinnerTeamId,
                        principalTable: "Teams",
                        principalColumn: "TeamId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Matches_Venues_VenueId",
                        column: x => x.VenueId,
                        principalTable: "Venues",
                        principalColumn: "VenueId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Players",
                columns: table => new
                {
                    PlayerId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CountryCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "date", nullable: true),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<int>(type: "int", nullable: false),
                    IsOverseasPlayer = table.Column<bool>(type: "bit", nullable: false),
                    BattingStyle = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    BowlingStyle = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    TeamId = table.Column<int>(type: "int", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Players", x => x.PlayerId);
                    table.ForeignKey(
                        name: "FK_Players_Teams_TeamId",
                        column: x => x.TeamId,
                        principalTable: "Teams",
                        principalColumn: "TeamId",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "PointsTableEntries",
                columns: table => new
                {
                    PointsTableEntryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SeasonId = table.Column<int>(type: "int", nullable: false),
                    TeamId = table.Column<int>(type: "int", nullable: false),
                    MatchesPlayed = table.Column<int>(type: "int", nullable: false),
                    Won = table.Column<int>(type: "int", nullable: false),
                    Lost = table.Column<int>(type: "int", nullable: false),
                    Tied = table.Column<int>(type: "int", nullable: false),
                    NoResult = table.Column<int>(type: "int", nullable: false),
                    Points = table.Column<int>(type: "int", nullable: false),
                    NetRunRate = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    ForRuns = table.Column<int>(type: "int", nullable: false),
                    ForOvers = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    AgainstRuns = table.Column<int>(type: "int", nullable: false),
                    AgainstOvers = table.Column<decimal>(type: "decimal(5,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PointsTableEntries", x => x.PointsTableEntryId);
                    table.ForeignKey(
                        name: "FK_PointsTableEntries_Seasons_SeasonId",
                        column: x => x.SeasonId,
                        principalTable: "Seasons",
                        principalColumn: "SeasonId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PointsTableEntries_Teams_TeamId",
                        column: x => x.TeamId,
                        principalTable: "Teams",
                        principalColumn: "TeamId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Innings",
                columns: table => new
                {
                    InningsId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MatchId = table.Column<int>(type: "int", nullable: false),
                    BattingTeamId = table.Column<int>(type: "int", nullable: false),
                    BowlingTeamId = table.Column<int>(type: "int", nullable: false),
                    InningsNumber = table.Column<int>(type: "int", nullable: false),
                    Runs = table.Column<int>(type: "int", nullable: false),
                    Wickets = table.Column<int>(type: "int", nullable: false),
                    Overs = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    Wides = table.Column<int>(type: "int", nullable: false),
                    NoBalls = table.Column<int>(type: "int", nullable: false),
                    Byes = table.Column<int>(type: "int", nullable: false),
                    LegByes = table.Column<int>(type: "int", nullable: false),
                    PenaltyRuns = table.Column<int>(type: "int", nullable: false),
                    IsCompleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Innings", x => x.InningsId);
                    table.ForeignKey(
                        name: "FK_Innings_Matches_MatchId",
                        column: x => x.MatchId,
                        principalTable: "Matches",
                        principalColumn: "MatchId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Innings_Teams_BattingTeamId",
                        column: x => x.BattingTeamId,
                        principalTable: "Teams",
                        principalColumn: "TeamId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Innings_Teams_BowlingTeamId",
                        column: x => x.BowlingTeamId,
                        principalTable: "Teams",
                        principalColumn: "TeamId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MatchUmpires",
                columns: table => new
                {
                    MatchesMatchId = table.Column<int>(type: "int", nullable: false),
                    UmpiresUmpireId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MatchUmpires", x => new { x.MatchesMatchId, x.UmpiresUmpireId });
                    table.ForeignKey(
                        name: "FK_MatchUmpires_Matches_MatchesMatchId",
                        column: x => x.MatchesMatchId,
                        principalTable: "Matches",
                        principalColumn: "MatchId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MatchUmpires_Umpires_UmpiresUmpireId",
                        column: x => x.UmpiresUmpireId,
                        principalTable: "Umpires",
                        principalColumn: "UmpireId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BallByBallData",
                columns: table => new
                {
                    BallId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    InningsId = table.Column<int>(type: "int", nullable: false),
                    OverNumber = table.Column<int>(type: "int", nullable: false),
                    BallNumber = table.Column<int>(type: "int", nullable: false),
                    BowlerId = table.Column<int>(type: "int", nullable: false),
                    BatsmanId = table.Column<int>(type: "int", nullable: false),
                    NonStrikerId = table.Column<int>(type: "int", nullable: false),
                    RunsScored = table.Column<int>(type: "int", nullable: false),
                    IsWicket = table.Column<bool>(type: "bit", nullable: false),
                    WicketType = table.Column<int>(type: "int", nullable: true),
                    PlayerOutId = table.Column<int>(type: "int", nullable: true),
                    FielderId = table.Column<int>(type: "int", nullable: true),
                    IsExtra = table.Column<bool>(type: "bit", nullable: false),
                    ExtraType = table.Column<int>(type: "int", nullable: true),
                    ExtraRuns = table.Column<int>(type: "int", nullable: false),
                    Commentary = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Timestamp = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BallByBallData", x => x.BallId);
                    table.ForeignKey(
                        name: "FK_BallByBallData_Innings_InningsId",
                        column: x => x.InningsId,
                        principalTable: "Innings",
                        principalColumn: "InningsId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BallByBallData_Players_BatsmanId",
                        column: x => x.BatsmanId,
                        principalTable: "Players",
                        principalColumn: "PlayerId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BallByBallData_Players_BowlerId",
                        column: x => x.BowlerId,
                        principalTable: "Players",
                        principalColumn: "PlayerId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BallByBallData_Players_FielderId",
                        column: x => x.FielderId,
                        principalTable: "Players",
                        principalColumn: "PlayerId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BallByBallData_Players_NonStrikerId",
                        column: x => x.NonStrikerId,
                        principalTable: "Players",
                        principalColumn: "PlayerId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BallByBallData_Players_PlayerOutId",
                        column: x => x.PlayerOutId,
                        principalTable: "Players",
                        principalColumn: "PlayerId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "BattingPerformances",
                columns: table => new
                {
                    BattingPerformanceId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    InningsId = table.Column<int>(type: "int", nullable: false),
                    PlayerId = table.Column<int>(type: "int", nullable: false),
                    Runs = table.Column<int>(type: "int", nullable: false),
                    BallsFaced = table.Column<int>(type: "int", nullable: false),
                    Fours = table.Column<int>(type: "int", nullable: false),
                    Sixes = table.Column<int>(type: "int", nullable: false),
                    DismissalType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    BowledById = table.Column<int>(type: "int", nullable: true),
                    CaughtById = table.Column<int>(type: "int", nullable: true),
                    BattingPosition = table.Column<int>(type: "int", nullable: false),
                    IsNotOut = table.Column<bool>(type: "bit", nullable: false),
                    DateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateUpdated = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BattingPerformances", x => x.BattingPerformanceId);
                    table.ForeignKey(
                        name: "FK_BattingPerformances_Innings_InningsId",
                        column: x => x.InningsId,
                        principalTable: "Innings",
                        principalColumn: "InningsId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BattingPerformances_Players_BowledById",
                        column: x => x.BowledById,
                        principalTable: "Players",
                        principalColumn: "PlayerId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BattingPerformances_Players_CaughtById",
                        column: x => x.CaughtById,
                        principalTable: "Players",
                        principalColumn: "PlayerId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BattingPerformances_Players_PlayerId",
                        column: x => x.PlayerId,
                        principalTable: "Players",
                        principalColumn: "PlayerId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "BowlingPerformances",
                columns: table => new
                {
                    BowlingPerformanceId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    InningsId = table.Column<int>(type: "int", nullable: false),
                    PlayerId = table.Column<int>(type: "int", nullable: false),
                    Overs = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    Maidens = table.Column<int>(type: "int", nullable: false),
                    RunsConceded = table.Column<int>(type: "int", nullable: false),
                    Wickets = table.Column<int>(type: "int", nullable: false),
                    Wides = table.Column<int>(type: "int", nullable: false),
                    NoBalls = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BowlingPerformances", x => x.BowlingPerformanceId);
                    table.ForeignKey(
                        name: "FK_BowlingPerformances_Innings_InningsId",
                        column: x => x.InningsId,
                        principalTable: "Innings",
                        principalColumn: "InningsId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BowlingPerformances_Players_PlayerId",
                        column: x => x.PlayerId,
                        principalTable: "Players",
                        principalColumn: "PlayerId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Scores",
                columns: table => new
                {
                    ScoreId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MatchId = table.Column<int>(type: "int", nullable: false),
                    InningsId = table.Column<int>(type: "int", nullable: false),
                    TeamId = table.Column<int>(type: "int", nullable: false),
                    Runs = table.Column<int>(type: "int", nullable: false),
                    Wickets = table.Column<int>(type: "int", nullable: false),
                    Overs = table.Column<int>(type: "int", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Scores", x => x.ScoreId);
                    table.ForeignKey(
                        name: "FK_Scores_Innings_InningsId",
                        column: x => x.InningsId,
                        principalTable: "Innings",
                        principalColumn: "InningsId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Scores_Matches_MatchId",
                        column: x => x.MatchId,
                        principalTable: "Matches",
                        principalColumn: "MatchId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Scores_Teams_TeamId",
                        column: x => x.TeamId,
                        principalTable: "Teams",
                        principalColumn: "TeamId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BallByBallData_BatsmanId",
                table: "BallByBallData",
                column: "BatsmanId");

            migrationBuilder.CreateIndex(
                name: "IX_BallByBallData_BowlerId",
                table: "BallByBallData",
                column: "BowlerId");

            migrationBuilder.CreateIndex(
                name: "IX_BallByBallData_FielderId",
                table: "BallByBallData",
                column: "FielderId");

            migrationBuilder.CreateIndex(
                name: "IX_BallByBallData_InningsId",
                table: "BallByBallData",
                column: "InningsId");

            migrationBuilder.CreateIndex(
                name: "IX_BallByBallData_NonStrikerId",
                table: "BallByBallData",
                column: "NonStrikerId");

            migrationBuilder.CreateIndex(
                name: "IX_BallByBallData_PlayerOutId",
                table: "BallByBallData",
                column: "PlayerOutId");

            migrationBuilder.CreateIndex(
                name: "IX_BattingPerformances_BowledById",
                table: "BattingPerformances",
                column: "BowledById");

            migrationBuilder.CreateIndex(
                name: "IX_BattingPerformances_CaughtById",
                table: "BattingPerformances",
                column: "CaughtById");

            migrationBuilder.CreateIndex(
                name: "IX_BattingPerformances_InningsId",
                table: "BattingPerformances",
                column: "InningsId");

            migrationBuilder.CreateIndex(
                name: "IX_BattingPerformances_PlayerId",
                table: "BattingPerformances",
                column: "PlayerId");

            migrationBuilder.CreateIndex(
                name: "IX_BowlingPerformances_InningsId",
                table: "BowlingPerformances",
                column: "InningsId");

            migrationBuilder.CreateIndex(
                name: "IX_BowlingPerformances_PlayerId",
                table: "BowlingPerformances",
                column: "PlayerId");

            migrationBuilder.CreateIndex(
                name: "IX_Coaches_TeamId",
                table: "Coaches",
                column: "TeamId");

            migrationBuilder.CreateIndex(
                name: "IX_Innings_BattingTeamId",
                table: "Innings",
                column: "BattingTeamId");

            migrationBuilder.CreateIndex(
                name: "IX_Innings_BowlingTeamId",
                table: "Innings",
                column: "BowlingTeamId");

            migrationBuilder.CreateIndex(
                name: "IX_Innings_MatchId",
                table: "Innings",
                column: "MatchId");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_AwayTeamId",
                table: "Matches",
                column: "AwayTeamId");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_HomeTeamId",
                table: "Matches",
                column: "HomeTeamId");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_SeasonId",
                table: "Matches",
                column: "SeasonId");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_TossWinnerTeamId",
                table: "Matches",
                column: "TossWinnerTeamId");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_VenueId",
                table: "Matches",
                column: "VenueId");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_WinnerTeamId",
                table: "Matches",
                column: "WinnerTeamId");

            migrationBuilder.CreateIndex(
                name: "IX_MatchUmpires_UmpiresUmpireId",
                table: "MatchUmpires",
                column: "UmpiresUmpireId");

            migrationBuilder.CreateIndex(
                name: "IX_Players_TeamId",
                table: "Players",
                column: "TeamId");

            migrationBuilder.CreateIndex(
                name: "IX_PointsTableEntries_SeasonId",
                table: "PointsTableEntries",
                column: "SeasonId");

            migrationBuilder.CreateIndex(
                name: "IX_PointsTableEntries_TeamId",
                table: "PointsTableEntries",
                column: "TeamId");

            migrationBuilder.CreateIndex(
                name: "IX_Scores_InningsId",
                table: "Scores",
                column: "InningsId");

            migrationBuilder.CreateIndex(
                name: "IX_Scores_MatchId",
                table: "Scores",
                column: "MatchId");

            migrationBuilder.CreateIndex(
                name: "IX_Scores_TeamId",
                table: "Scores",
                column: "TeamId");

            migrationBuilder.CreateIndex(
                name: "IX_Teams_HomeVenueId",
                table: "Teams",
                column: "HomeVenueId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Username",
                table: "Users",
                column: "Username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BallByBallData");

            migrationBuilder.DropTable(
                name: "BattingPerformances");

            migrationBuilder.DropTable(
                name: "BowlingPerformances");

            migrationBuilder.DropTable(
                name: "Coaches");

            migrationBuilder.DropTable(
                name: "MatchUmpires");

            migrationBuilder.DropTable(
                name: "PointsTableEntries");

            migrationBuilder.DropTable(
                name: "Scores");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Players");

            migrationBuilder.DropTable(
                name: "Umpires");

            migrationBuilder.DropTable(
                name: "Innings");

            migrationBuilder.DropTable(
                name: "Matches");

            migrationBuilder.DropTable(
                name: "Seasons");

            migrationBuilder.DropTable(
                name: "Teams");

            migrationBuilder.DropTable(
                name: "Venues");
        }
    }
}
