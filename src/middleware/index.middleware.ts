import express, { Application } from "express";
import cors from "cors";

const middleware = (app: Application) => {

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
};

export default middleware;
