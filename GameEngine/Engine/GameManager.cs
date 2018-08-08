using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;

namespace GameEngine.Engine
{
    /// <summary>
    /// Enum holding the mouse buttons
    /// </summary>
    public enum MouseButtons
    {
        Left,
        Right,
        Middle
    }

    class GameManager
    {
        /// <summary>
        /// Get the mouse X position
        /// </summary>
        public float MouseX = 0;
        /// <summary>
        /// Get the mouse Y position
        /// </summary>
        public float MouseY = 0;

        public bool Paused = false;
        
        private SpriteBatch spriteBatch;
        private Drawer drawer;
        private Game game;
        private GraphicsDeviceManager graphics;

        private KeyboardState keyboardState;
        private KeyboardState previousKeyboardState;

        private MouseState mouseState;
        private MouseState previousMouseState;

        private ResourceManager resourceManager;

        private SceneManager sceneManager;
        private int currentSceneId;

        /// <summary>
        /// Initialize the game manager
        /// </summary>
        /// <param name="game"></param>
        /// <param name="spriteBatch"></param>
        public GameManager(int width, int height, Game game, SpriteBatch spriteBatch, GraphicsDeviceManager graphics)
        {
            this.game = game;
            this.spriteBatch = spriteBatch;
            resourceManager = new ResourceManager(game, this);
            drawer = new Drawer(game, spriteBatch);
            this.graphics = graphics;
            currentSceneId = 0;
            sceneManager = new SceneManager(this);

            SetWindowSize(width, height, true);
        }

        public SceneManager SceneManager
        {
            get
            {
                return (sceneManager);
            }
        }

        /// <summary>
        /// Set the title of the game window
        /// </summary>
        /// <param name="text"></param>
        public void SetWindowTitle(string text)
        {
            game.Window.Title = text;
        }

        /// <summary>
        /// Set the size of the game window
        /// </summary>
        /// <param name="width"></param>
        /// <param name="height"></param>
        /// <param name="showBorder"></param>
        public void SetWindowSize(int width, int height, bool showBorder)
        {
            game.Window.IsBorderless = !showBorder;

            graphics.PreferredBackBufferWidth = width;
            graphics.PreferredBackBufferHeight = height;

            graphics.ApplyChanges();

            // Center the game window
            game.Window.Position = new Point((GraphicsAdapter.DefaultAdapter.CurrentDisplayMode.Width / 2) - (graphics.PreferredBackBufferWidth / 2), (GraphicsAdapter.DefaultAdapter.CurrentDisplayMode.Height / 2) - (graphics.PreferredBackBufferHeight / 2));

        }

        /// <summary>
        /// Perform the update loop
        /// </summary>
        public void Loop()
        {
            // Get the keyboard state
            keyboardState = Keyboard.GetState();
            mouseState = Mouse.GetState();

            // Set the mouse position
            MouseX = Mouse.GetState().X;
            MouseY = Mouse.GetState().Y;

            // Use F4 to switch to and from full screen
            if (KeyboardCheckPressed(Keys.F4) == 1)
            {
                graphics.ToggleFullScreen();
            }

            if (sceneManager.Scenes.Count > 0)
            {
                sceneManager.Scenes[currentSceneId].Update();
            }

            previousKeyboardState = keyboardState;
            previousMouseState = mouseState;
        }

        /// <summary>
        /// Loop through the instances and draw them
        /// </summary>
        public void Draw()
        {
            // Get the keyboard state
            keyboardState = Keyboard.GetState();
            mouseState = Mouse.GetState();

            spriteBatch.Begin();

            if (sceneManager.Scenes.Count > 0)
            {
                sceneManager.Scenes[currentSceneId].Draw();
            }

            spriteBatch.End();

            previousKeyboardState = keyboardState;
            previousMouseState = mouseState;
        }

        // Input stuff

        /// <summary>
        /// Show the mouse cursor
        /// </summary>
        /// <param name="show"></param>
        public void ShowCursor(bool show)
        {
            game.IsMouseVisible = show;
        }

        /// <summary>
        /// Check if the Left mouse button is being held down
        /// </summary>
        /// <returns></returns>
        public int MouseCheck(MouseButtons mouseButton)
        {
            if (mouseButton == MouseButtons.Left)
            {
                var val = (mouseState.LeftButton == ButtonState.Pressed);
                if (val)
                {
                    return (1);
                }
                else
                {
                    return (0);
                }
            }
            else if (mouseButton == MouseButtons.Right)
            {
                var val = (mouseState.RightButton == ButtonState.Pressed);
                if (val)
                {
                    return (1);
                }
                else
                {
                    return (0);
                }
            }
            else if (mouseButton == MouseButtons.Middle)
            {
                var val = (mouseState.MiddleButton == ButtonState.Pressed);
                if (val)
                {
                    return (1);
                }
                else
                {
                    return (0);
                }
            }
            else
            {
                return (0);
            }
        }

        /// <summary>
        /// Check if the Left mouse button has been pressed
        /// </summary>
        /// <returns></returns>
        public int MouseCheckPressed(MouseButtons mouseButton)
        {
            if (mouseButton == MouseButtons.Left)
            {
                var val = (previousMouseState.LeftButton == ButtonState.Released && mouseState.LeftButton == ButtonState.Pressed);
                if (val)
                {
                    return (1);
                }
                else
                {
                    return (0);
                }
            }
            else if (mouseButton == MouseButtons.Right)
            {
                var val = (previousMouseState.RightButton == ButtonState.Released && mouseState.RightButton == ButtonState.Pressed);
                if (val)
                {
                    return (1);
                }
                else
                {
                    return (0);
                }
            }
            else if (mouseButton == MouseButtons.Middle)
            {
                var val = (previousMouseState.MiddleButton == ButtonState.Released && mouseState.MiddleButton == ButtonState.Pressed);
                if (val)
                {
                    return (1);
                }
                else
                {
                    return (0);
                }
            }
            else
            {
                return (0);
            }
        }

        /// <summary>
        /// Check if the Left mouse button has been released
        /// </summary>
        /// <returns></returns>
        public int MouseCheckReleased(MouseButtons mouseButton)
        {
            if (mouseButton == MouseButtons.Left)
            {
                var val = (previousMouseState.LeftButton == ButtonState.Pressed && mouseState.LeftButton == ButtonState.Released);
                if (val)
                {
                    return (1);
                }
                else
                {
                    return (0);
                }
            }
            else if (mouseButton == MouseButtons.Right)
            {
                var val = (previousMouseState.RightButton == ButtonState.Pressed && mouseState.RightButton == ButtonState.Released);
                if (val)
                {
                    return (1);
                }
                else
                {
                    return (0);
                }
            }
            else if (mouseButton == MouseButtons.Middle)
            {
                var val = (previousMouseState.MiddleButton == ButtonState.Pressed && mouseState.MiddleButton == ButtonState.Released);
                if (val)
                {
                    return (1);
                }
                else
                {
                    return (0);
                }
            }
            else
            {
                return (0);
            }
        }

        /// <summary>
        /// Chekc if a keyboard key is being held down
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public int KeyboardCheck(Keys key)
        {
            var val = (keyboardState.IsKeyDown(key));
            if (val)
            {
                return (1);
            }
            else
            {
                return (0);
            }
        }

        /// <summary>
        /// Check if the user presses a key
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public int KeyboardCheckPressed(Keys key)
        {
            if (previousKeyboardState.IsKeyUp(key) && keyboardState.IsKeyDown(key))
            {
                return (1);
            }
            else
            {
                return (0);
            }
        }

        /// <summary>
        /// Check if a user has released a key
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public int KeyboardCheckReleased(Keys key)
        {
            if (previousKeyboardState.IsKeyDown(key) && keyboardState.IsKeyUp(key))
            {
                return (1);
            }
            else
            {
                return (0);
            }
        }
    }
}
