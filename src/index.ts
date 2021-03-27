import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import cors, { CorsOptions } from 'cors';
import Stripe from 'stripe';
import winstonEnvLogger from 'winston-env-logger';
import mongoose from 'mongoose';

import Jobs from './model/job';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

mongoose.connect(process.env.MONGOLAB_URI as string,{
  useUnifiedTopology: true,
  useNewUrlParser: true
});

mongoose.connection.once('open', () => {
  winstonEnvLogger.info('connected to db 🚀🚀');
});

const stripe = new Stripe(process.env.SECRET_KEY as string,{
  apiVersion: '2020-08-27',
});

const corsOptions: CorsOptions = {
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

interface IRequest {
  plan: string;
  price: number;
}

app.post('/create-checkout-session', async (req: Request, res: Response) => {

  const { plan, price }: IRequest = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${plan} Plan`,
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/payment/success`,
      cancel_url: `${process.env.CLIENT_URL}/payment/failure`,
    });
    res.json({ id: session.id });
  } catch (error) {
    winstonEnvLogger.error({
      message: 'An error occured',
      error: error.message
    });
  }
});

app.get('/api/jobs', (_req: any, res: any) => {
  Jobs.find({}).then((job: any) => {
    return res.send(job);
  });

});

app.get('/', (_req: Request, res: Response) => {
  res.send('Fuck off!!!');
});

app.listen(port, () => {
  winstonEnvLogger.info({
    message: `Server started on port ${port}`
  });
});
