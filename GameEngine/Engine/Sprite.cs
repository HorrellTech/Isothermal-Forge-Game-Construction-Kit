using Microsoft.Xna.Framework.Graphics;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GameEngine.Engine
{
    public class Sprite
    {
        public float OriginX = 0;
        public float OriginY = 0;

        private Texture2D image;
        private int frameCount;

        public Sprite(Texture2D image, int frameCount)
        {
            this.image = image;
            this.frameCount = frameCount;
        }

        public int GetNumber()
        {
            return (frameCount);
        }

        public Texture2D Image
        {
            get
            {
                return (image);
            }
        }
    }
}
