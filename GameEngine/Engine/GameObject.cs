using Microsoft.Xna.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GameEngine.Engine
{
    public class GameObject
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

        private GameManager manager;

        public string Name = "object";

        // Basic variables
        public float X = 0;
        public float Y = 0;
        public float XStart = 0;
        public float YStart = 0;
        public float XPrevious = 0;
        public float YPrevious = 0;

        // Image stuff
        public Sprite SpriteIndex = null;

        public int ImageSingle = 0;
        public float ImageIndex = 0;
        public float ImageSpeed = 1.0f;
        public float ImageAngle = 0;
        public float ImageXScale = 1;
        public float ImageYScale = 1;
        public Color ImageBlend = Color.White;
        public float ImageAlpha = 1.0f;

        public float Direction = 0;
        public float Speed = 0;
        public float HSpeed = 0;
        public float VSpeed = 0;

        public float Gravity = 0;
        public float GravityDirection = 270;
        public float Friction = 0;

        public bool Persistent = false;
        public bool Active = true;
        public bool Visible = true;
        public bool UseBuiltInPhysics = true;

        public int Depth = 0;

        public long ID = 0; // The ID

        private bool createEventRan = false;

        public GameObject(GameManager manager)
        {
            this.manager = manager;
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
            createEventRan = true;
        }

        /// <summary>
        /// Every loop of the game, this event gets called
        /// </summary>
        public void Update()
        {
            // Run the create event if it hasn't been run yet
            if (!createEventRan)
            {
                XStart = X;
                YStart = Y;
                Awake();
            }

            // Store the previous position
            XPrevious = X;
            YPrevious = Y;

            if (OnUpdateBegin != null)
            {
                OnUpdateBegin();
            }

            if(OnUpdate != null)
            {
                OnUpdate();
            }

            if (UseBuiltInPhysics)
            {
                // Move towards a position at a speed
                if (Speed != 0)
                {
                    HSpeed = MathHelper.LengthDirX(Speed, Direction);
                    VSpeed = MathHelper.LengthDirY(Speed, Direction);
                }

                // Horizontal speed
                if (HSpeed != 0)
                {
                    X += HSpeed;
                }

                // Vertical speed
                if (VSpeed != 0)
                {
                    Y += VSpeed;
                }

                // Gravity
                if (Gravity != 0)
                {
                    HSpeed += MathHelper.LengthDirX(Gravity, GravityDirection);
                    VSpeed += MathHelper.LengthDirY(Gravity, GravityDirection);
                }
            }

            if (OnUpdateEnd != null)
            {
                OnUpdateEnd();
            }

            // Fix the directiom
            Direction = Direction % 360;

            //Sprite animation
            if (SpriteIndex != null)
            {
                if (ImageIndex >= 1)
                {
                    ImageIndex = 0;

                    ImageSingle += 1;

                    if (ImageSingle > SpriteIndex.GetNumber() - 1)
                    {
                        ImageSingle = 0;
                    }
                }

                ImageIndex += ImageSpeed;
            }

            // Friction ( Different Way )
            //HSpeed *= (Friction);
            //VSpeed *= (Friction);

            if (UseBuiltInPhysics)
            {
                // Friction
                if (HSpeed > 0)
                {
                    HSpeed -= Friction;
                    if (HSpeed < 0)
                    {
                        HSpeed = 0;
                    }
                }
                if (HSpeed < 0)
                {
                    HSpeed += Friction;
                    if (HSpeed > 0)
                    {
                        HSpeed = 0;
                    }
                }
                if (VSpeed > 0)
                {
                    VSpeed -= Friction;
                    if (VSpeed < 0)
                    {
                        VSpeed = 0;
                    }
                }
                if (VSpeed < 0)
                {
                    VSpeed += Friction;
                    if (VSpeed > 0)
                    {
                        VSpeed = 0;
                    }
                }
            }
        }

        /// <summary>
        /// Adds motion towards a set driection
        /// 
        /// REQUIRES UseBuiltInPhysics
        /// </summary>
        /// <param name="direction"></param>
        /// <param name="speed"></param>
        public void MotionAdd(float direction, float speed)
        {
            Speed += speed;
            Direction = direction;
        }

        /// <summary>
        /// Sets motion towards a direction
        /// 
        /// REQUIRES UseBuiltInPhysics
        /// </summary>
        /// <param name="direction"></param>
        /// <param name="speed"></param>
        public void MotionSet(float direction, float speed)
        {
            Direction = direction;
            Speed = speed;
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

        public void InstanceDestroy()
        {
            Active = false;
        }
    }
}
