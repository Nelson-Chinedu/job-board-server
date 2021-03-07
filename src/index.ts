import express, { Request, Response } from 'express';
import cors, { CorsOptions } from 'cors';
import Stripe from 'stripe';
import winstonEnvLogger from 'winston-env-logger';
const app = express();
const port = process.env.PORT || 4000;

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
    success_url: `${process.env.CLIENT_URL}payment/success`,
    cancel_url: `${process.env.CLIENT_URL}/payment/failure`,
  });

  res.json({ id: session.id });
});

app.get('/', (_req: Request, res: Response) => {
  res.send('Api for job board');
});

app.listen(port, () => {
  winstonEnvLogger.info({
    message: `Server started on port ${port}`
  });
});
