using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GameEngine.Engine
{
    class Variables
    {
        private List<string> var = new List<string>();
        private List<object> val = new List<object>();

        /// <summary>
        /// Create a new place to store variables
        /// </summary>
        public Variables()
        {
        }

        public Variables(Variables var)
        {
            this.var.Clear();
            val.Clear();

            this.var.AddRange(var.var);
            val.AddRange(var.val);
        }

        public void Set(string var, object val)
        {
            if (!this.var.Contains(var)) // If there is no variable with that name
            {
                this.var.Add(var);
                this.val.Add(val);
            }
            else
            {
                var ind = this.var.IndexOf(var);
                this.val[ind] = val;
            }
        }

        public object Get(string var)
        {
            if (this.var.Contains(var))
            {
                var ind = this.var.IndexOf(var);
                return (val[ind]);
            }
            else
            {
                return (null);
            }
        }
    }
}
