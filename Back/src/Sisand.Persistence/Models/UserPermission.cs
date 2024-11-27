using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sisand.Persistence.Models
{
    public  class UserPermission
    {
        public string UserId { get; set; }  // FK para ApplicationUser
        public ApplicationUser User { get; set; }

        public int PermissionId { get; set; }  // FK para Permission
        public Permission Permission { get; set; }
    }
}
