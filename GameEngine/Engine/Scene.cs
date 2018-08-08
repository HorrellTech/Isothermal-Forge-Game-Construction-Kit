using Microsoft.Xna.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GameEngine.Engine
{
    class Scene
    {
        private ObjectManager objectManager;

        public Scene(GameManager manager)
        {
            objectManager = new ObjectManager(manager);
        }

        /// <summary>
        /// Update all of the objects in the scene
        /// </summary>
        public void Update()
        {
            objectManager.Update();
        }

        /// <summary>
        /// Draw all of the objects in the scene
        /// </summary>
        public void Draw()
        {
            objectManager.Draw();
        }

        /// <summary>
        /// Create a new object
        /// </summary>
        /// <param name="x"></param>
        /// <param name="y"></param>
        /// <param name="objectClassName"></param>
        /// <returns></returns>
        public GameObject Instantiate(float x, float y, GameObject obj)
        {
            return(objectManager.Instantiate(x, y, obj));
        }

        /// <summary>
        /// Create a new object
        /// </summary>
        /// <param name="x"></param>
        /// <param name="y"></param>
        /// <param name="objectClassName"></param>
        /// <returns></returns>
        public GameObject Instantiate(float x, float y, string objectClassName)
        {
            return (objectManager.Instantiate(x, y, objectClassName));
        }
    }
}
