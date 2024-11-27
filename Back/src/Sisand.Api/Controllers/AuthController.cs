using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Sisand.Persistence.Context;
using Sisand.Persistence.DTO;
using Sisand.Persistence.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Sisand.Api.Controllers
{
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly SisandContext _context;
        private readonly IConfiguration _config;
        public AuthController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, SisandContext context, IConfiguration config)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _context = context;
            _config = config;
        }

        // Endpoint de login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            // Buscar o usuário pelo e-mail
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null)
                return Unauthorized("Usuário ou senha inválidos");

            // Verificar a senha
            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
            if (!result.Succeeded)
                return Unauthorized("Usuário ou senha inválidos");

            // Buscar as permissões do usuário
            var userPermissions = await _context.UserPermissions
                                                .Where(up => up.UserId == user.Id)
                                                .Include(up => up.Permission) // Inclui as permissões associadas
                                                .ToListAsync();

            // Adicionar claims ao token
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Role, "Admin") // Você pode usar roles dinâmicas aqui, ou uma role específica
            };

            // Adicionar permissões como claims
            foreach (var userPermission in userPermissions)
            {
                if (!string.IsNullOrEmpty(userPermission.Permission.Name)) // Verifica se o nome da permissão está presente
                {
                    claims.Add(new Claim("permission", userPermission.Permission.Name)); // Adiciona a permissão ao token
                }
            }

            // Gerar o token JWT
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["TokenConfiguration:Issuer"],
                audience: _config["TokenConfiguration:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(20),
                signingCredentials: creds
            );

            return Ok(new { Token = new JwtSecurityTokenHandler().WriteToken(token) });
        }

        private string GenerateJwtToken(ApplicationUser user, List<UserPermission> userPermissions)
        {
            // Adicionar claims ao token
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Role, "Admin") // Ajuste conforme a sua lógica de roles
            };

            // Adicionar permissões como claims
            foreach (var userPermission in userPermissions)
            {
                if (!string.IsNullOrEmpty(userPermission.Permission.Name))
                {
                    claims.Add(new Claim("permission", userPermission.Permission.Name));
                }
            }

            // Gerar o token JWT
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["TokenConfiguration:Issuer"],
                audience: _config["TokenConfiguration:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(20),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            // Criar um novo usuário
            var user = new ApplicationUser
            {
                UserName = registerDto.UserName,
                Email = registerDto.Email,
                EmailConfirmed = true,
                Nome = registerDto.Nome
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            // Atribuir permissões ao usuário (Ex: permissões do admin)
            var permissions = await _context.Permissions.ToListAsync(); // Pega todas as permissões
            foreach (var permission in permissions)
            {
                _context.UserPermissions.Add(new UserPermission
                {
                    UserId = user.Id,
                    PermissionId = permission.Id
                });
            }

            // Salvar as permissões no banco
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Usuário registrado com sucesso!" });
        }
    }





}
