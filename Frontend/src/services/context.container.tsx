import React from "react";

/**
 * Creates a context container with a provider and a hook to use the context.
 *
 * @template P - The type of the props passed to the provider.
 * @template V - The type of the value provided by the context.
 * 
 * @param {function} useValue - A function that takes props and returns the value to be provided by the context.
 * 
 * @returns {object} An object containing:
 * - `useContext`: A hook to use the context.
 * - `Context`: The created context.
 * - `Provider`: The provider component for the context.
 * 
 */
export function container<P, V>(
  useValue: (props: P & { stateOverrides?: any }) => V
) {
  const Context = React.createContext({} as V);
  const Provider: any = (props: any) => {
    const { children } = props;
    const value = useValue(props);
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };
  const useContext = () => React.useContext(Context);
  return {
    useContext,
    Context,
    Provider,
  };
}


