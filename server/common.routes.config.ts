import express from 'express';
export abstract class CommonRoutesConfig {
    app: express.Application;
    name: string;

    constructor(app: express.Application, name: string) {
        this.app = app;
        this.name = name;
        this.configureRouters();
    }
    getName() {
        return this.name;
    }

    abstract configureRouters(): express.Application;
}