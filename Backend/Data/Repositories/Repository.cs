//using Microsoft.EntityFrameworkCore;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Linq.Expressions;
//using System.Threading.Tasks;

//namespace IPLLive.API.Data.Repositories
//{
//    public class Repository<T> : IRepository<T> where T : class
//    {
//        protected readonly ApplicationDbContext _context;
//        internal DbSet<T> _dbSet;

//        public Repository(ApplicationDbContext context)
//        {
//            _context = context;
//            _dbSet = context.Set<T>();
//        }

//        public virtual async Task<IEnumerable<T>> GetAllAsync()
//        {
//            return await _dbSet.ToListAsync();
//        }

//        public virtual async Task<IEnumerable<T>> GetAsync(Expression<Func<T, bool>> predicate)
//        {
//            return await _dbSet.Where(predicate).ToListAsync();
//        }

//        public virtual async Task<IEnumerable<T>> GetAsync(
//            Expression<Func<T, bool>> predicate,
//            Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
//            string includeProperties = null,
//            int? skip = null,
//            int? take = null)
//        {
//            IQueryable<T> query = _dbSet;

//            if (predicate != null)
//            {
//                query = query.Where(predicate);
//            }

//            if (includeProperties != null)
//            {
//                foreach (var includeProperty in includeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
//                {
//                    query = query.Include(includeProperty);
//                }
//            }

//            if (orderBy != null)
//            {
//                query = orderBy(query);
//            }

//            if (skip.HasValue)
//            {
//                query = query.Skip(skip.Value);
//            }

//            if (take.HasValue)
//            {
//                query = query.Take(take.Value);
//            }

//            return await query.ToListAsync();
//        }

//        public virtual async Task<T> GetByIdAsync(int id)
//        {
//            return await _dbSet.FindAsync(id);
//        }

//        public virtual async Task<T> GetFirstOrDefaultAsync(Expression<Func<T, bool>> predicate, string includeProperties = null)
//        {
//            IQueryable<T> query = _dbSet;

//            if (predicate != null)
//            {
//                query = query.Where(predicate);
//            }

//            if (includeProperties != null)
//            {
//                foreach (var includeProperty in includeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
//                {
//                    query = query.Include(includeProperty);
//                }
//            }

//            return await query.FirstOrDefaultAsync();
//        }

//        public virtual async Task AddAsync(T entity)
//        {
//            await _dbSet.AddAsync(entity);
//        }

//        public virtual Task UpdateAsync(T entity)
//        {
//            // EntityFramework tracks changes automatically
//            _context.Entry(entity).State = EntityState.Modified;
//            return Task.CompletedTask;
//        }

//        public virtual async Task DeleteAsync(int id)
//        {
//            T entity = await _dbSet.FindAsync(id);
//            await DeleteAsync(entity);
//        }

//        public virtual Task DeleteAsync(T entity)
//        {
//            _dbSet.Remove(entity);
//            return Task.CompletedTask;
//        }

//        public virtual async Task SaveAsync()
//        {
//            await _context.SaveChangesAsync();
//        }
//    }
//}
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace IPLLive.API.Data.Repositories
{
    public class Repository<T> : IRepository<T> where T : class
    {
        protected readonly ApplicationDbContext _context;
        internal DbSet<T> _dbSet;

        public Repository(ApplicationDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public virtual async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        public virtual async Task<IEnumerable<T>> GetAllAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.Where(predicate).ToListAsync();
        }

        public virtual async Task<IEnumerable<T>> GetAsync(
            Expression<Func<T, bool>> predicate,
            Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
            string includeProperties = null,
            int? skip = null,
            int? take = null)
        {
            IQueryable<T> query = _dbSet;

            if (predicate != null)
            {
                query = query.Where(predicate);
            }

            if (includeProperties != null)
            {
                foreach (var includeProperty in includeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    query = query.Include(includeProperty);
                }
            }

            if (orderBy != null)
            {
                query = orderBy(query);
            }

            if (skip.HasValue)
            {
                query = query.Skip(skip.Value);
            }

            if (take.HasValue)
            {
                query = query.Take(take.Value);
            }

            return await query.ToListAsync();
        }

        public virtual async Task<T> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public virtual async Task<T> GetFirstOrDefaultAsync(Expression<Func<T, bool>> predicate, string includeProperties = null)
        {
            IQueryable<T> query = _dbSet;

            if (predicate != null)
            {
                query = query.Where(predicate);
            }

            if (includeProperties != null)
            {
                foreach (var includeProperty in includeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    query = query.Include(includeProperty);
                }
            }

            return await query.FirstOrDefaultAsync();
        }

        public virtual async Task AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
        }

        public virtual Task UpdateAsync(T entity)
        {
            _context.Entry(entity).State = EntityState.Modified;
            return Task.CompletedTask;
        }

        public virtual async Task DeleteAsync(int id)
        {
            T entity = await _dbSet.FindAsync(id);
            await DeleteAsync(entity);
        }

        public virtual Task DeleteAsync(T entity)
        {
            _dbSet.Remove(entity);
            return Task.CompletedTask;
        }

        public virtual async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}