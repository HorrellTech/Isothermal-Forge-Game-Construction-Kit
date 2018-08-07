﻿using Microsoft.Xna.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GameEngine.Engine
{
    static class MathHelper
    {
        public const float E = (float)Math.E;
        public const float Log10E = 0.4342945f;
        public const float Log2E = 1.442695f;
        public const float Pi = (float)Math.PI;
        public const float PiOver2 = (float)(Math.PI / 2.0);
        public const float PiOver4 = (float)(Math.PI / 4.0);
        public const float TwoPi = (float)(Math.PI * 2.0);

        /// <summary>
        /// Gets the angle between 2 points
        /// </summary>
        /// <param name="x1">point 1 x</param>
        /// <param name="y1">point 1 y</param>
        /// <param name="x2">point 2 x</param>
        /// <param name="y2">point 2 y</param>
        /// <returns>Double</returns>
        public static float PointDirection(float x1, float y1, float x2, float y2)
        {
            float xDiff = x2 - x1;
            float yDiff = y2 - y1;

            return (float)(-(System.Math.Atan2(yDiff, xDiff) * 180.0 / System.Math.PI));
        }

        /// <summary>
        /// Get the distance between 2 points
        /// </summary>
        /// <param name="x1">point 1 x</param>
        /// <param name="y1">point 1 y</param>
        /// <param name="x2">point 2 x</param>
        /// <param name="y2">point 2 y</param>
        /// <returns>Double</returns>
        public static float PointDistance(float x1, float y1, float x2, float y2)
        {
            return (float)(System.Math.Sqrt(System.Math.Pow((x2 - x1), 2) + System.Math.Pow((y2 - y1), 2)));
        }

        /// <summary>
        /// Check if there is a point inside of a rectangle
        /// </summary>
        /// <param name="x1"></param>
        /// <param name="y1"></param>
        /// <param name="x2"></param>
        /// <param name="y2"></param>
        /// <returns></returns>
        public static bool PointInside(float x, float y, float x1, float y1, float width, float height)
        {
            return (new Rectangle((int)x1, (int)y1, (int)(width), (int)(height)).Contains((int)x, (int)y));
        }

        /// <summary>
        /// Returns the length and direction, like that off Game Maker
        /// </summary>
        /// <param name="len">Length from the point</param>
        /// <param name="dir">Angle(360 degrees from 0)</param>
        /// <returns>Double</returns>
        public static float LengthDirX(float len, float dir)
        {
            return (float)(len * System.Math.Cos(dir * deg2Rad()));
        }

        /// <summary>
        /// Returns the length and direction, like that off Game Maker
        /// </summary>
        /// <param name="len">Length from the point</param>
        /// <param name="dir">Angle(360 degrees from 0)</param>
        /// <returns>Double</returns>
        public static float LengthDirY(float len, float dir)
        {
            return (float)(len * -System.Math.Sin(dir * deg2Rad()));
        }

        /// <summary>
        /// Returns the distance between 2 floating points
        /// </summary>
        /// <param name="value1"></param>
        /// <param name="value2"></param>
        /// <returns></returns>
        public static float Distance(float value1, float value2)
        {
            return Math.Abs(value1 - value2);
        }

        /// <summary>
        /// Clamp a value
        /// </summary>
        /// <param name="value"></param>
        /// <param name="min"></param>
        /// <param name="max"></param>
        /// <returns></returns>
        public static float Clamp(float value, float min, float max)
        {
            // First we check to see if we're greater than the max
            value = (value > max) ? max : value;

            // Then we check to see if we're less than the min.
            value = (value < min) ? min : value;

            // There's no check to see if min > max.
            return value;
        }

        /// <summary>
        /// Snap a position to an invisible grid space
        /// </summary>
        /// <param name="position"></param>
        /// <param name="gridSize"></param>
        /// <returns></returns>
        public static float Snap(float position, float gridSize)
        {
            return (float)(Math.Floor(position / gridSize) * gridSize);
        }

        /// <summary>
        /// Lerp a point towards another point
        /// </summary>
        /// <param name="from"></param>
        /// <param name="to"></param>
        /// <param name="amount"></param>
        /// <returns></returns>
        public static float Lerp(float from, float to, float amount)
        {
            return (from + amount * (to - from));
        }

        /// <summary>
        /// It smooths a value from start to stop in the said amount of time.
        /// Example: Tween(X, 40, X, X + 20)
        /// </summary>
        /// <param name="value">The value to tween</param>
        /// <param name="time">Amount of steps between the tween</param>
        /// <param name="startValue">The start value to tween from</param>
        /// <param name="stopValue">The final value to tween to</param>
        /// <returns></returns>
        public static float Tween(float value, float time, float startValue, float stopValue)
        {
            return Median(startValue, value + (stopValue - startValue) / time, stopValue);
        }

        /// <summary>
        /// Smoothly step a value to another value in a set amount
        /// </summary>
        /// <param name="value1"></param>
        /// <param name="value2"></param>
        /// <param name="amount"></param>
        /// <returns></returns>
        public static float SmoothStep(float value1, float value2, float amount)
        {
            // It is expected that 0 < amount < 1
            // If amount < 0, return value1
            // If amount > 1, return value2
#if(USE_FARSEER)
            float result = SilverSpriteMathHelper.Clamp(amount, 0f, 1f);
            result = SilverSpriteMathHelper.Hermite(value1, 0f, value2, 0f, result);
#else
            float result = MathHelper.Clamp(amount, 0f, 1f);
            result = MathHelper.Hermite(value1, 0f, value2, 0f, result);
#endif
            return result;
        }

        /// <summary>
        /// Approach a value toward another value in the step of max
        /// </summary>
        /// <param name="start"></param>
        /// <param name="end"></param>
        /// <param name="max"></param>
        /// <returns></returns>
        public static float Approach(float start, float end, float max)
        {
            if (start < end)
                return Math.Min(start + max, end);
            else
                return Math.Max(start - max, end);
        }

        /// <summary>
        /// Returns if the number is between -0.1 and 0.1
        /// </summary>
        /// <param name="number"></param>
        /// <returns></returns>
        public static bool ApproximatelyZero(float number)
        {
            if (number > -0.1 && number < 0.1)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        /// <summary>
        /// Gets the average of the given values
        /// </summary>
        /// <param name="sourceNumbers"></param>
        /// <returns></returns>
        public static float Median(params float[] sourceNumbers)
        {
            Array.Sort(sourceNumbers);
            return Ceil(sourceNumbers[sourceNumbers.Length / 2]);
        }

        /// <summary>
        /// Round a number to the nearest whole number
        /// </summary>
        /// <param name="number"></param>
        /// <returns></returns>
        public static float Round(float number)
        {
            return (float)(Math.Round(number));
        }

        /// <summary>
        /// Return the largest whole number less than or equal to the specified number
        /// </summary>
        /// <param name="number"></param>
        /// <returns></returns>
        public static float Floor(float number)
        {
            return (float)(Math.Floor(number));
        }

        /// <summary>
        /// Returns the smallest whole number that is greater than or equal to the specified number
        /// </summary>
        /// <param name="number"></param>
        /// <returns></returns>
        public static float Ceil(float number)
        {
            return (float)(Math.Ceiling(number));
        }

        /// <summary>
        /// Returns an absolute value of a number
        /// </summary>
        /// <param name="number"></param>
        /// <returns></returns>
        public static float Abs(float number)
        {
            return (Math.Abs(number));
        }

        /// <summary>
        /// Returns a value indicating the sign of a single-precision floating-point number
        /// </summary>
        /// <param name="number"></param>
        /// <returns></returns>
        public static float Sign(float number)
        {
            return (Math.Sign(number));
        }

        /// <summary>
        /// Returns the sine of a specified angle
        /// </summary>
        /// <param name="number"></param>
        /// <returns></returns>
        public static float Sin(float number)
        {
            return (float)(Math.Sin((double)number));
        }

        /// <summary>
        /// Returns the cosine of a specified angle
        /// </summary>
        /// <param name="number"></param>
        /// <returns></returns>
        public static float Cos(float number)
        {
            return (float)(Math.Cos(number));
        }

        /// <summary>
        /// Returns the cosine of a specified angle to radians
        /// </summary>
        /// <param name="number"></param>
        /// <returns></returns>
        public static float DCos(float angle)
        {
            return (float)(Math.Cos(Deg2Rad(angle)));
        }

        /// <summary>
        /// Return a random number
        /// </summary>
        /// <param name="max"></param>
        /// <returns></returns>
        public static float Random(float max)
        {
            return (new Random(Guid.NewGuid().GetHashCode()).Next((int)max));
        }

        /// <summary>
        /// Return a random number between min and max
        /// </summary>
        /// <param name="min"></param>
        /// <param name="max"></param>
        /// <returns></returns>
        public static float RandomRange(float min, float max)
        {
            return (new Random(Guid.NewGuid().GetHashCode()).Next((int)min, (int)max));
        }

        /// <summary>
        /// Returns wether or not the chance out of 'max' is 1, if so return true
        /// </summary>
        /// <param name="max"></param>
        /// <returns></returns>
        public static bool Chance(float max)
        {
            return (Random(max) == 1);
        }

        public static string String(object val)
        {
            return (val.ToString());
        }

        public static float Real(object val)
        {
            return (float.Parse(val.ToString()));
        }

        public static bool Boolean(object val)
        {
            return (bool.Parse(val.ToString()));
        }

        private static float deg2Rad()
        {
            return (float)((System.Math.PI * 2) / 360);
        }

        public static float Deg2Rad(float angle)
        {
            return (float)((System.Math.PI / 180) * angle);
        }

        public static float ToDegrees(float radians)
        {
            // This method uses double precission internally,
            // though it returns single float
            // Factor = 180 / pi
            return (float)(radians * 57.295779513082320876798154814105);
        }

        public static float ToRadians(float degrees)
        {
            // This method uses double precission internally,
            // though it returns single float
            // Factor = pi / 180
            return (float)(degrees * 0.017453292519943295769236907684886);
        }

        public static float Hermite(float value1, float tangent1, float value2, float tangent2, float amount)
        {
            // All transformed to double not to lose precission
            // Otherwise, for high numbers of param:amount the result is NaN instead of Infinity
            double v1 = value1, v2 = value2, t1 = tangent1, t2 = tangent2, s = amount, result;
            double sCubed = s * s * s;
            double sSquared = s * s;

            if (amount == 0f)
                result = value1;
            else if (amount == 1f)
                result = value2;
            else
                result = (2 * v1 - 2 * v2 + t2 + t1) * sCubed +
                    (3 * v2 - 3 * v1 - 2 * t1 - t2) * sSquared +
                    t1 * s +
                    v1;
            return (float)result;
        }
    }
}
