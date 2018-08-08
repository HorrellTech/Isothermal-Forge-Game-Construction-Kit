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
        private GameManager manager;

        public SceneManager(GameManager manager)
        {
            this.manager = manager;
            currentSceneId = 0;
        }

        public Scene SceneAdd()
        {
            Scene scene = new Scene(manager);

            scenes.Add(scene);

            return (scene);
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

        public Scene GetScene(int index)
        {
            return (scenes[index]);
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
