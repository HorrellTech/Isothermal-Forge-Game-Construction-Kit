using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GameEngine.Engine
{
    class Drawer
    {
        private Game game;
        private SpriteBatch spriteBatch;

        private Color color;
        private SpriteFont spriteFont;
        private float alpha;

        public Drawer(Game game, SpriteBatch spriteBatch)
        {
            this.game = game;
            this.spriteBatch = spriteBatch;
            color = Color.White;
            alpha = 255;
            spriteFont = null;
        }

        public void DrawSetFont(SpriteFont spriteFont)
        {
            this.spriteFont = spriteFont;
        }

        public void DrawSetColor(Color color)
        {
            this.color = color;
        }

        public void DrawSetAlpha(float alpha)
        {
            this.alpha = alpha;
        }

        public void DrawSprite(Sprite sprite, int imageSingle, float x, float y)
        {
            var w = sprite.Image.Width / sprite.GetNumber();
            spriteBatch.Draw(sprite.Image, new Rectangle((int)x, (int)y, (w), (sprite.Image.Height)), new Rectangle(w * imageSingle, 0, w, sprite.Image.Height), Color.White, 0, new Vector2(sprite.OriginX, sprite.OriginY), SpriteEffects.None, 0);
        }

        public void DrawSpriteExt(Sprite sprite, int imageSingle, float x, float y, float imageXScale, float imageYScale, float imageAngle, Color imageBlend, float imageAlpha, int depth)
        {
            var w = sprite.Image.Width / sprite.GetNumber();
            if (imageXScale > 0 && imageYScale > 0)
            {
                spriteBatch.Draw(sprite.Image, new Vector2(x, y), new Rectangle(w * imageSingle, 0, w, sprite.Image.Height), new Color(imageBlend.R, imageBlend.G, imageBlend.B, imageAlpha), imageAngle, new Vector2(sprite.OriginX, sprite.OriginY), new Vector2(imageXScale, imageYScale), SpriteEffects.None, 0);
            }
        }

        public void DrawTexture(Texture2D texture, float x, float y)
        {
            spriteBatch.Draw(texture, new Vector2(x, y), Color.White);
        }

        public void DrawTextureExt(Texture2D texture, float x, float y, float imageXScale, float imageYScale, float angle, Color color, float alpha)
        {
            spriteBatch.Draw(texture, new Rectangle((int)x, (int)y, (int)(texture.Width * imageXScale), (int)(texture.Height * imageYScale)), null, color, angle, Vector2.Zero, SpriteEffects.None, 0);
        }

        public void DrawText(float x, float y, string text)
        {
            if (spriteFont != null)
            {
                spriteBatch.DrawString(spriteFont, text, new Vector2(x, y), new Color(color, alpha));
            }
        }
    }
}
