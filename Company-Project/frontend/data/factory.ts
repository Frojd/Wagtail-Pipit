export const factoryGenerator =
    <T extends object>(name: string, baseStructure: T) =>
    (overrides: Partial<T>): T => {
        for (const key of Object.keys(overrides)) {
            if (!(key in baseStructure)) {
                throw new Error(
                    `Unknown Property: ${name} does not property '${key}'`
                );
            }
        }

        return { ...baseStructure, ...overrides };
    };
