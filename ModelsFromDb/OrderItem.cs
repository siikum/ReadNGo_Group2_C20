using System;
using System.Collections.Generic;

namespace ReadNGo_Group2_C20.ModelsFromDb;

public partial class OrderItem
{
    public int Id { get; set; }

    public int BookId { get; set; }

    public int Quantity { get; set; }

    public decimal Price { get; set; }

    public int OrderId { get; set; }

    public virtual Book Book { get; set; } = null!;

    public virtual Order Order { get; set; } = null!;
}
