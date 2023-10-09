using System;
using System.Threading.Tasks;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Interfaces
{
    public interface IIGDBService
    {
        Task<IActionResult> GetGameData(string access_token, string clientId);
    }
}