/*
 * 
 * // Define an enum to define the states. Anything could work, a string, int.. but enums are likely the easiest to manage
	enum Season
	{
		Winter,
		Spring,
		Summer,
		Fall
	}

	// Create the FSM
	FSM<Season> fsm = new FSM<Season>("seasons-fsm");

	public void Init()
	{
		// Initialize the states, adding them to the FSM and configuring their behaviour

		fsm.Add(Season.Winter)
			.Expires(3f)
			.GoesTo(Season.Spring)
			.OnEnter(() => Console.ForegroundColor = ConsoleColor.White)
			.OnLeave(() => Console.WriteLine("Winter is ending..."))
			.Calls(d => Console.WriteLine("Winter is going on.. {0}%", d.StateProgress * 100f));

		fsm.Add(Season.Spring)
			.Expires(3f)
			.GoesTo(Season.Summer)
			.OnEnter(() => Console.ForegroundColor = ConsoleColor.Green)
			.OnLeave(() => Console.WriteLine("Spring is ending..."))
			.Calls(d => Console.WriteLine("Spring is going on.. {0}%", d.StateProgress * 100f));

		fsm.Add(Season.Summer)
			.Expires(3f)
			.GoesTo(Season.Fall)
			.OnEnter(() => Console.ForegroundColor = ConsoleColor.Red)
			.OnLeave(() => Console.WriteLine("Summer is ending..."))
			.Calls(d => Console.WriteLine("Summer is going on.. {0}%", d.StateProgress * 100f));

		fsm.Add(Season.Fall)
			.Expires(3f)
			.GoesTo(Season.Winter)
			.OnEnter(() => Console.ForegroundColor = ConsoleColor.DarkYellow)
			.OnLeave(() => Console.WriteLine("Fall is ending..."))
			.Calls(d => Console.WriteLine("Fall is going on.. {0}%", d.StateProgress * 100f));

		// Very important! set the starting state
		fsm.CurrentState = Season.Winter;
	}

	public void Run()
	{
		// Define a base time. This seems pedantic in a pure .NET world, but allows to use custom time providers,
		// Unity3D Time class (scaled or unscaled), MonoGame timing, etc.
		DateTime baseTime = DateTime.Now;

		// Initialize the FSM
		Init();

		// Call the FSM periodically... in a real world scenario this will likely be in a timer callback, or frame handling (e.g.
		// Unity's Update() method).
		while (true)
		{
			// 
			fsm.Process((float)(DateTime.Now - baseTime).TotalSeconds);
			Thread.Sleep(100);
		}
	}
 * 
 */
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GameEngine.Engine.FiniteStateMachine
{
    /// <summary>
	/// A Finite State Machine. 
	/// T is a type which will be used as descriptors of the state. Usually this is an enum, string or an integral type,
	/// but any type can be used.
	/// </summary>
	/// <typeparam name="T">A type which will be used as descriptors of the state. Usually this is an enum, string or an integral type,
	/// but any type can be used.</typeparam>
	public class FSM<T>
    {
        Dictionary<T, FsmStateBehaviour<T>> m_StateBehaviours = new Dictionary<T, FsmStateBehaviour<T>>();
        T m_CurrentState = default(T);
        FsmStateBehaviour<T> m_CurrentStateBehaviour;
        float m_StateAge = -1f;
        string m_FsmName = null;

        /// <summary>
        /// Initializes a new instance of the <see cref="FSM{T}"/> class.
        /// </summary>
        /// <param name="name">The name of the FSM, used in throw exception and for debug purposes.</param>
        public FSM(string name)
        {
            m_FsmName = name;
        }


        /// <summary>
        /// Gets or sets a callback which will be called when the FSM logs state transitions. Used to track state transition for debug purposes.
        /// </summary>
        /// <value>
        /// The debug log handler.
        /// </value>
        public Action<string> DebugLogHandler { get; set; }


        /// <summary>
        /// Adds the specified state.
        /// </summary>
        /// <param name="state">The state.</param>
        /// <returns>The newly created behaviour, so that it could be configured with a fluent-like syntax.</returns>
        public FsmStateBehaviour<T> Add(T state)
        {
            var behaviour = new FsmStateBehaviour<T>(state);
            m_StateBehaviours.Add(state, behaviour);
            return behaviour;
        }

        /// <summary>
        /// Gets the number of states currently in the FSM.
        /// </summary>
        /// <value>
        /// The number of states currently in the FSM.
        /// </value>
        public int Count
        {
            get { return m_StateBehaviours.Count; }
        }

        /// <summary>
        /// Processes the logic for the FSM. 
        /// </summary>
        /// <param name="time">The time, expressed in seconds.</param>
        /// <exception cref="InvalidOperationException"></exception>
        public void Process(float time)
        {
            if (m_StateAge < 0f)
                m_StateAge = time;

            float totalTime = time;
            float stateTime = (totalTime - m_StateAge);
            float stateProgress = 0f;

            if (m_CurrentStateBehaviour == null)
            {
                throw new InvalidOperationException(string.Format("[FSM {0}] : Can't call 'Process' before setting the starting state.", m_FsmName));
            }

            if (m_CurrentStateBehaviour.Duration.HasValue)
            {
                stateProgress = Math.Max(0f, Math.Min(1f, stateTime / m_CurrentStateBehaviour.Duration.Value));
            }

            var data = new FsmStateData<T>()
            {
                Machine = this,
                Behaviour = m_CurrentStateBehaviour,
                State = m_CurrentState,
                StateTime = stateTime,
                AbsoluteTime = totalTime,
                StateProgress = stateProgress
            };

            m_CurrentStateBehaviour.Trigger(data);

            if (stateProgress >= 1f && m_CurrentStateBehaviour.NextStateSelector != null)
            {
                CurrentState = m_CurrentStateBehaviour.NextStateSelector();
                m_StateAge = time;
            }
        }

        /// <summary>
        /// Gets or sets the current state of the FSM.
        /// </summary>
        public T CurrentState
        {
            get { return m_CurrentState; }
            set
            {
                if (DebugLogHandler != null)
                    DebugLogHandler(string.Format("[FSM {0}] : Changing state from {1} to {2}", m_FsmName, m_CurrentState, value));

                if (m_CurrentStateBehaviour != null)
                    m_CurrentStateBehaviour.TriggerLeave();

                m_StateAge = -1f;

                m_CurrentStateBehaviour = m_StateBehaviours[value];
                m_CurrentState = value;

                if (m_CurrentStateBehaviour != null)
                    m_CurrentStateBehaviour.TriggerEnter();
            }
        }

        /// <summary>
        /// Moves the FSM to the next state as configured using FsmStateBehaviour.GoesTo(...).
        /// Note: to change the state freely, use the CurrentState property.
        /// </summary>
        /// <exception cref="InvalidOperationException">If the behaviour has not a next state / state selector configured.</exception>
        public void Next()
        {
            if (m_CurrentStateBehaviour.NextStateSelector != null)
                this.CurrentState = m_CurrentStateBehaviour.NextStateSelector();
            else
                throw new InvalidOperationException(string.Format("[FSM {0}] : Can't call 'Next' on current behaviour.", m_FsmName));
        }

        /// <summary>
        /// Saves a snapshot of the FSM
        /// </summary>
        /// <returns>The snapshot.</returns>
        public FsmSnapshot<T> SaveSnapshot()
        {
            return new FsmSnapshot<T>(m_StateAge, m_CurrentState);
        }

        /// <summary>
        /// Restores a snapshot of the FSM taken with SaveSnapshot
        /// </summary>
        /// <param name="snap">The snapshot.</param>
        public void RestoreSnapshot(FsmSnapshot<T> snap)
        {
            CurrentState = snap.CurrentState;
            m_StateAge = snap.StateAge;
        }
    }
}
