using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Sisand.Persistence.DTO;
using Sisand.Persistence.Models;
using Microsoft.EntityFrameworkCore;

namespace Sisand.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]  // Exige autentica��o via JWT
    public class UsuariosController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public UsuariosController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        // Endpoint para listar usu�rios - apenas acess�vel por usu�rios autenticados
        [HttpGet]
        public async Task<IActionResult> GetUsuarios()
        {
            var users = _userManager.Users.Select(u => new
            {
                u.Id,
                u.UserName,
                u.Email,
                u.Nome,
                u.Sobrenome,
                u.DataCadastro,
                u.DataAtualizacao
            }).ToList();

            return Ok(users);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUsuariosById(string id)
        {
            // Busca o usu�rio pelo ID
            var user = await _userManager.Users
                .Where(u => u.Id == id)
                .Select(u => new
                {
                    u.Id,
                    u.UserName,
                    u.Email,
                    u.Nome,
                    u.Sobrenome,
                    u.DataCadastro,
                    u.DataAtualizacao,
                    u.Endereco,
                    u.DataNascimento,
                    u.Telefone
                })
                .FirstOrDefaultAsync();

            // Verifica se o usu�rio foi encontrado
            if (user == null)
            {
                return NotFound("Usu�rio n�o encontrado.");
            }

            // Retorna o usu�rio encontrado
            return Ok(user);
        }

        // Endpoint para criar um novo usu�rio - somente acess�vel por usu�rios autenticados
        [HttpPost]
        public async Task<IActionResult> CreateUsuario([FromBody] CreateUsuarioDto createUserDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = new ApplicationUser
            {
                UserName = createUserDto.UserName,
                Email = createUserDto.Email,
                Nome = createUserDto.Nome,
                Sobrenome = createUserDto.Sobrenome,
                Telefone = createUserDto.Telefone,
                DataNascimento = createUserDto.DataNascimento,
                Endereco = createUserDto.Endereco,
                DataCadastro = DateTime.Now,
            };

            var result = await _userManager.CreateAsync(user, createUserDto.Password);

            if (result.Succeeded)
            {
                // Retornar o objeto com os dados criados (incluindo o ID gerado)
                return CreatedAtAction(nameof(GetUsuarios), new { id = user.Id }, user);
            }

            return BadRequest(result.Errors);
        }

        // Endpoint para atualizar um usu�rio existente - acess�vel por usu�rios autenticados
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUsuario(string id, [FromBody] CreateUsuarioDto updateUserDto)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound("Usu�rio n�o encontrado.");

            user.Nome = updateUserDto.Nome;
            user.Sobrenome = updateUserDto.Sobrenome;
            user.Telefone = updateUserDto.Telefone;
            user.DataNascimento = updateUserDto.DataNascimento;
            user.Endereco = updateUserDto.Endereco;
            user.Endereco = updateUserDto.Endereco;
            user.DataAtualizacao = DateTime.Now;

            if (!string.IsNullOrEmpty(updateUserDto.Password) && updateUserDto.Password != user.PasswordHash)
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                await _userManager.ResetPasswordAsync(user, token, updateUserDto.Password);
                //await _userManager.UpdatePasswordHash(user, updateUserDto.Password,true);

            }
            var result = await _userManager.UpdateAsync(user);
            if (result.Succeeded)
            {
                // Retornar o objeto atualizado
                return Ok(user);
            }

            return BadRequest(result.Errors);
        }

        // Endpoint para excluir um usu�rio - acess�vel por usu�rios autenticados
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsuario(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound("Usu�rio n�o encontrado.");

            var result = await _userManager.DeleteAsync(user);
            if (result.Succeeded)
            {
                // Retornar o objeto exclu�do
                return Ok(user);
            }

            return BadRequest(result.Errors);
        }
    }
}
