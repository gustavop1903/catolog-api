import dotenv from 'dotenv'
dotenv.config()
import mongoose from "mongoose";
import express from "express";
import session from 'express-session';
import MongoStore from 'connect-mongo';
import helmet from 'helmet';

import routes from "./routes";


const app = express();

const uri: string = process.env.CONNECTIONSTRING ?? '';
mongoose.connect(uri)
  .then(() => {
    console.log("Conectado ao MongoDB com sucesso!");
  }).catch(err => {
    console.error("Erro ao conectar ao MongoDB:", err);
  });

app.use(helmet())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const sessionOptions = session({
  secret: 'akasdfj0út23453456+54qt23qv  qwf qwer qwer qewr asdasdasda a6()',
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
});
app.use(sessionOptions);

app.use(routes);

app.listen(3000, () => {
  console.log('Acessar http://localhost:3000');
  console.log('Servidor executando na porta 3000');
});
