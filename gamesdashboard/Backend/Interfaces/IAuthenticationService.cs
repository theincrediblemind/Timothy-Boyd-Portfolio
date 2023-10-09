using System;
using System.Threading.Tasks;

namespace Backend.Interfaces
{
    public interface IAuthenticationService
    {
        Task<string> GetAccessToken(string clientID, string clientSecret);
    }
}