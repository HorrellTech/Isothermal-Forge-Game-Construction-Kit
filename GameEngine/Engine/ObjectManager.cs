using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GameEngine.Engine
{
    class ObjectManager
    {
        private List<GameObject> objects = new List<GameObject>();
        private GameManager manager;

        private long instanceId = 0;
        private List<GameObject> toBeDeleted = new List<GameObject>(); // Hold objects to be deleted
        private List<GameObject> toBeCreated = new List<GameObject>(); // Hold objects to be created

        public ObjectManager(GameManager manager)
        {
            this.manager = manager;
        }

        public void Update()
        {
            
        }

        public void Draw()
        {

        }

        public void InstanceDestroy(long id)
        {
            GameObject ob = null;

            foreach (var o in objects)
            {
                if (o.ID == id)
                {
                    ob = o;
                }
            }
            ob.InstanceDestroy();

            toBeDeleted.Add(ob);
        }

        public void InstanceDestroy(string name)
        {
            GameObject ob = null;

            foreach (var o in objects)
            {
                if (o.GetType().Name == name)
                {
                    ob = o;
                }
            }
            ob.InstanceDestroy();

            toBeDeleted.Add(ob);
        }

        public void UpdateDeleted()
        {
            if (toBeDeleted.Count > 0) // If there are objects that need to be removed
            {
                foreach (var o in toBeDeleted) // For each object that needs to be removed
                {
                    if (objects.Contains(o))
                    {
                        objects.Remove(o); // Remove the object from our objects list
                    }
                }

                toBeDeleted.Clear(); // Clear the toBeDeleted list
            }
        }

        public bool UpdateCreated()
        {
            if (toBeCreated.Count > 0) // If there are objects that need to be removed
            {
                foreach (var o in toBeCreated) // For each object that needs to be removed
                {
                    if (!objects.Contains(o))
                    {
                        // Objects.AddRange(toBeCreated);
                        InstanceAdd(o.X, o.Y, o);
                    }
                }

                toBeCreated.Clear();
                return (true);
            }
            return (false);
        }

        public bool InstanceExists<T>()
        {
            return !(objects.Select(x => x.GetType()).OfType<T>().Count() > 0);
        }

        public int InstanceCount
        {
            get
            {
                return (objects.Count);
            }
        }

        public int ObjectCount
        {
            get
            {
                return (objects.Select(x => x.GetType()).Distinct().Count());
            }
        }

        /// <summary>
        /// Hopefully, return a list of objects of a certain type
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public List<GameObject> GetObjectsOfType<T>()
        {
            List<GameObject> ob = new List<GameObject>();

            foreach (var o in objects.OfType<T>())
            {
                ob.Add((GameObject)(object)o);
            }

            return (ob);
        }

        /// <summary>
        /// Adds a new instance to the toBeCreated list
        /// </summary>
        /// <param name="x"></param>
        /// <param name="y"></param>
        /// <param name="obj"></param>
        /// <returns></returns>
        private void InstanceAddRange(List<GameObject> obj)
        {
            List<GameObject> ob = new List<GameObject>();//obj.InstanceCreate(x, y);
            Type t = Type.GetType("GameMakerMono." + obj[0].GetType().Name);

            object o = Activator.CreateInstance(t, manager);
            var oo = (GameObject)o;
            ob.Add(oo);

            instanceId += 1;

            objects.AddRange(ob);
        }

        /// <summary>
        /// Adds a new instance to the toBeCreated list
        /// </summary>
        /// <param name="x"></param>
        /// <param name="y"></param>
        /// <param name="obj"></param>
        /// <returns></returns>
        private GameObject InstanceAdd(float x, float y, GameObject obj)
        {
            GameObject ob = null;//obj.InstanceCreate(x, y);
            Type t = Type.GetType("GameMakerMono." + obj.GetType().Name);

            object o = Activator.CreateInstance(t, manager);
            ob = (GameObject)o;

            ob.X = x;
            ob.Y = y;
            ob.ID = instanceId;

            instanceId += 1;

            objects.Add(ob);

            return (ob);
        }

        /// <summary>
        /// Creates an instance of an object
        /// </summary>
        /// <param name="x"></param>
        /// <param name="y"></param>
        /// <param name="obj"></param>
        /// <returns></returns>
        public GameObject InstanceCreate(float x, float y, GameObject obj)
        {
            GameObject ob = null;//obj.InstanceCreate(x, y);
            Type t = Type.GetType("GameMakerMono." + obj.GetType().Name);

            object o = Activator.CreateInstance(t, manager);
            ob = (GameObject)o;

            ob.X = x;
            ob.Y = y;
            ob.ID = instanceId;

            toBeCreated.Add(ob);

            return (ob);
        }

        /// <summary>
        /// Creates an instance of an object
        /// </summary>
        /// <param name="x"></param>
        /// <param name="y"></param>
        /// <param name="obj"></param>
        /// <returns></returns>
        public GameObject InstanceCreate(float x, float y, string name)
        {
            GameObject ob = null;//obj.InstanceCreate(x, y);
            Type t = Type.GetType("GameMakerMono." + name);

            object o = Activator.CreateInstance(t, manager);
            ob = (GameObject)o;

            ob.X = x;
            ob.Y = y;
            ob.ID = instanceId;

            toBeCreated.Add(ob);

            return (ob);
        }
    }
}
