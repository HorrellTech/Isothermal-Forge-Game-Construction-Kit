using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Audio;
using Microsoft.Xna.Framework.Graphics;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GameEngine.Engine
{
    class ResourceManager
    {
        private Game game;
        private GameManager manager;

        private Variables sprites = new Variables();

        private Variables images = new Variables();
        private Variables fonts = new Variables();

        public ResourceManager(Game game, GameManager manager)
        {
            this.game = game;
            this.manager = manager;
        }

        public Sprite SpriteAdd(string name, Texture2D image, int frameCount)
        {
            var s = new Sprite(image, frameCount);

            sprites.Set(name, s);

            return (s);
        }

        public Sprite Sprites(string refName)
        {
            return ((Sprite)sprites.Get(refName));
        }

        public Texture2D Image(string refName)
        {
            return ((Texture2D)images.Get(refName));
        }

        public SpriteFont Font(string refName)
        {
            return ((SpriteFont)fonts.Get(refName));
        }

        public Texture2D ImageLoad(string refName, string fileName)
        {
            var s = game.Content.Load<Texture2D>(fileName);
            images.Set(refName, s);

            return (s);
        }

        public SpriteFont FontLoad(string refName, string fileName)
        {
            var s = game.Content.Load<SpriteFont>(fileName);
            fonts.Set(refName, s);

            return (s);
        }

        public SoundEffect SoundLoad(string fileName)
        {
            var s = game.Content.Load<SoundEffect>(fileName);

            return (s);
        }
    }
}
