using Microsoft.Xna.Framework.Graphics;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GameEngine.Engine
{
    class Surface : Texture2D
    {

        public Surface(GraphicsDevice graphics, int width, int height)
            :base(graphics, width, height)
        {

        }

        /*public Bitmap GetBitmap()
        {
            return (this.);
        }*/
    }
}
