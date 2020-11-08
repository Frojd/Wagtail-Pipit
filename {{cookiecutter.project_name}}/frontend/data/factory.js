export const factoryGenerator = (name, baseStructure) => (overrides) => {
    const _return = { ...baseStructure };

    for (const key of Object.keys(overrides)) {
        if (typeof baseStructure[key] === 'undefined') {
            throw new Error(
                `Unknown Property: ${name} does not property '${key}'`
            );
        }

        _return[key] = overrides[key];
    }

    return _return;
};
