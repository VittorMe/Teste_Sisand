using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sisand.Persistence.Models
{
    public class Permission
    {
        public int Id { get; set; }
        public string Name { get; set; }  // Nome da permissão (ex: "Admin", "User", etc)

        public ICollection<UserPermission> UserPermissions { get; set; }
    }

}
