using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Sisand.Persistence.Models;

namespace Sisand.Persistence.Context
{
    public class SisandContext : IdentityDbContext<ApplicationUser, IdentityRole, string>
    {

        public DbSet<Permission> Permissions { get; set; }
        public DbSet<UserPermission> UserPermissions { get; set; }

        public SisandContext(DbContextOptions<SisandContext> options) : base(options) { }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuração de Permission
            modelBuilder.Entity<Permission>()
                .HasKey(p => p.Id);  // Define a chave primária de Permission

            // Configuração de UserPermission
            modelBuilder.Entity<UserPermission>()
                .HasKey(up => new { up.UserId, up.PermissionId });  // Define a chave primária composta

            // Relacionamento entre UserPermission e ApplicationUser (User)
            modelBuilder.Entity<UserPermission>()
                .HasOne(up => up.User)
                .WithMany(u => u.UserPermissions)  // Nome do relacionamento em ApplicationUser
                .HasForeignKey(up => up.UserId)  // Chave estrangeira para ApplicationUser
                .IsRequired();  // Garantir que o UserId seja obrigatório

            // Relacionamento entre UserPermission e Permission
            modelBuilder.Entity<UserPermission>()
                .HasOne(up => up.Permission)
                .WithMany(p => p.UserPermissions)  // Nome do relacionamento em Permission
                .HasForeignKey(up => up.PermissionId)  // Chave estrangeira para Permission
                .IsRequired();  // Garantir que o PermissionId seja obrigatório
        }


    }
}
