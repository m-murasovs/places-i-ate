declare global {
    // eslint-disable-next-line
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export {};
