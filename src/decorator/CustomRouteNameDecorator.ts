/**
 * This class decorator makes the route have a custom route name instead of the class' name.
 * @param name - the route name to be used by the RoutesInitializer
 */
function CustomRouteName(name: string) {
    // It's not possible to infer the type of args and anything else than any will crash
    // eslint-disable-next-line
    return function <T extends { new (...args: any[]): {} }>(
        constructor: T
    ): T {
        // Here we override the object inserting a new attribute called routeName and
        // initialize it with the name parameter.
        return class extends constructor {
            routeName = name;
        };
    };
}

export default CustomRouteName;
