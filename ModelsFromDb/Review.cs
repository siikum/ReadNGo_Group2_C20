using System;
using System.Collections.Generic;

namespace ReadNGo_Group2_C20.ModelsFromDb;

public partial class Review
{
    public int Id { get; set; }

    public int BookId { get; set; }

    public int UserId { get; set; }

    public string Comment { get; set; } = null!;

    public int Rating { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Book Book { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
