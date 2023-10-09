using System;
using System.Threading.Tasks;
using Backend.Models;

namespace Backend.Interfaces
{
    public interface IIGDBService
    {
        Task<string> GetGameData(string access_token, string clientId);
    }
}