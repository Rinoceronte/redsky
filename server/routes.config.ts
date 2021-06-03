import express from 'express';
import {IUser, BaseUser, IResult} from './models/interfaces';
import axios from 'axios';
import { CommonRoutesConfig } from './common.routes.config';

export class UsersRoutes extends CommonRoutesConfig{

    id: number = 1;
    users: Array<IUser> = [];
    page: number = 1;
    total: number = 12;
    total_pages: number = 2;
    initialized: boolean = false;


    constructor(app: express.Application) {
        super(app, 'UsersRoutes');
        
    }

    async initialize() {
        let curPage = 1;
        while(this.users.length < this.total) {
            await axios.get(`https://reqres.in/api/users?page=${curPage++}`).then(({data}) => {
                let results: IResult = data;
                this.page = results.page;
                this.total = results.total;
                this.total_pages = results.total_pages;
                this.users = [...this.users, ...results.data];
                return true;
            }) 
        }


        this.users.forEach(u => {
            if(u.id > this.id) {
                this.id = u.id
            }
        });
        this.initialized = true;
    }

    configureRouters() {
        this.app.route("/api/users")
        .all(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
            // console.log('how many times called?');
            if(!this.initialized) {
                await this.initialize();
            }
            next();
        })
        .post((req: express.Request, res: express.Response) => {
            const body: BaseUser = req.body;
            
            const user: IUser = {...body, id: ++this.id};
            this.users.push(user);
            this.total++;

            let results_users: Array<IUser> = this.users.slice((this.page-1)*6, ((this.page-1)*6) + 6);
            this.total_pages = Math.ceil(this.users.length / 6);

            res.status(201).send({page: this.page, total: this.total, total_pages: this.total_pages, users: results_users});
        })
        .get((req: express.Request, res: express.Response) => {
            let reqPage: any = 1;
            if(req.query.page) {
                reqPage = req.query.page;
                reqPage = parseInt(reqPage);
            }
            this.page = reqPage;
            let results_users: Array<IUser> = this.users.slice((reqPage-1)*6, ((reqPage-1)*6) + 6);
            res.status(200).send({page: this.page, total: this.total, total_pages: this.total_pages, users: results_users});
        })
        .put((req: express.Request, res: express.Response) => {
            const user: IUser = req.body;
            this.users.splice(this.users.findIndex((u: IUser) => u.id === user.id), 1, user);

            
            let results_users: Array<IUser> = this.users.slice((this.page-1)*6, ((this.page-1)*6) + 6);
            res.status(200).send({page: this.page, total: this.total, total_pages: this.total_pages, users: results_users});
        });

        this.app.route("/api/users/:id")
        .delete((req: express.Request, res: express.Response) => {
            this.users.splice(this.users.findIndex((u: IUser) => u.id === parseInt(req.params.id)), 1);
            this.total--;
            this.total_pages = Math.ceil(this.users.length / 6);
            if(this.page > this.total_pages) {
                this.page--;
            }
            let results_users: Array<IUser> = this.users.slice((this.page-1)*6, ((this.page-1)*6) + 6);
            res.status(200).send({page: this.page, total: this.total, total_pages: this.total_pages, users: results_users});
        });

        return this.app;
    }
}