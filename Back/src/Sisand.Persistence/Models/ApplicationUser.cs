using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sisand.Persistence.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Nome { get; set; }
        public string? Sobrenome { get; set; }
        public string? Telefone { get; set; }
        public DateTime? DataNascimento { get; set; }
        public string? Endereco { get; set; }

        public ICollection<UserPermission> UserPermissions { get; set; }

        public DateTime? DataCadastro { get; set; } = DateTime.UtcNow;
        public DateTime? DataAtualizacao { get; set; }
    }
}
