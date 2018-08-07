using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GameEngine.Engine
{
    class SceneManager
    {
        public List<Scene> scenes = new List<Scene>(); // Hold a list of the scenes in the game
        public int currentSceneId;

        public SceneManager()
        {
            currentSceneId = 0;
        }

        public void Update()
        {
            if(scenes.Count > 0)
            {
                scenes[currentSceneId].Update();
            }
        }

        public void Draw()
        {
            if (scenes.Count > 0)
            {
                scenes[currentSceneId].Draw();
            }
        }

        /// <summary>
        /// Returns a list of the scenes
        /// </summary>
        public List<Scene> Scenes
        {
            get
            {
                return (scenes);
            }
        }
    }
}
