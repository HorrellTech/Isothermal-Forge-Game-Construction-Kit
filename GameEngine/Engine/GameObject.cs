using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GameEngine.Engine
{
    class GameObject
    {
        // Delegates and events for 
        public delegate void AwakeEvent();
        public delegate void UpdateEvent();
        public delegate void UpdateBeginEvent();
        public delegate void UpdateEndEvent();
        public delegate void DrawEvent();

        public event AwakeEvent OnAwake;
        public event UpdateEvent OnUpdate;
        public event UpdateBeginEvent OnUpdateBegin;
        public event UpdateEndEvent OnUpdateEnd;
        public event DrawEvent OnDraw;

        public GameObject()
        {
        }

        /// <summary>
        /// When the object first spawns in the scene
        /// </summary>
        public void Awake()
        {
            if(OnAwake != null)
            {
                OnAwake();
            }
        }

        /// <summary>
        /// Every loop of the game, this event gets called
        /// </summary>
        public void Update()
        {
            if(OnUpdateBegin != null)
            {
                OnUpdateBegin();
            }

            if(OnUpdate != null)
            {
                OnUpdate();
            }

            if(OnUpdateEnd != null)
            {
                OnUpdateEnd();
            }
        }

        /// <summary>
        /// When we draw using the object
        /// </summary>
        public void Draw()
        {
            if(OnDraw != null)
            {
                OnDraw();
            }
        }
    }
}
