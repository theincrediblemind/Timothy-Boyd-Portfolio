using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class GameData
    {

        public Guid checksum { get; set; }
        public string name { get; set; }
        public string summary { get; set; }

        public int[] genres {get; set;}

        public double aggregated_rating {get; set;}

        public int[] videos {get; set;}

        public int cover {get; set;}

        public int[] game_modes {get; set;}

        public List<string> genreNames {get; set;}

        public List<string> videoUrls {get; set;}

        public string coverUrl {get; set;}

        [JsonPropertyName("discount")]
        public double discount {get;  set;}

        [JsonPropertyName("price")]
        public double price {get;  set;}

        [JsonPropertyName("genre")]
        public string genre {get;  set;}

        public string difficulty {get; set;}
        
        // Add more properties to match the actual data returned by IGDB
    }
}