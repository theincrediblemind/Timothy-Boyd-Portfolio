using System;
using System.Collections.Generic;

namespace Backend.Models
{
    public class GameData
    {
        public int checksum { get; set; }
        public string name { get; set; }
        public string summary { get; set; }

        public double rating {get; set;}
        // Add more properties to match the actual data returned by IGDB
    }
}