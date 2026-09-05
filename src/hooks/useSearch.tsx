import { useEffect, useState } from "react";








export default function useDebouncedValue<T>(value: T, delays: number = 500):T {
   const [debouncedValue, setDebouncedValue] = useState(value);

   useEffect(() => {
      const timer = setTimeout(() => {
         setDebouncedValue(value);
      }, delays);

      return () => clearTimeout(timer);
   }, [value, debouncedValue]);

   return debouncedValue
};