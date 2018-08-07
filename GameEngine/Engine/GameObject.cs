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
    }
}
