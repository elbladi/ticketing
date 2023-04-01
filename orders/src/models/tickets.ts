import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Order, OrderStatus } from "./orders";

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  isReserved(): Promise<boolean>;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
}

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

schema.set("versionKey", "version");
schema.plugin(updateIfCurrentPlugin);

schema.statics.build = (attrs: TicketAttrs) =>
  new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });

schema.statics.findByEvent = async (event: { id: string; version: number }) => {
  return await Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

schema.statics.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayement,
        OrderStatus.Complete,
      ],
    },
  });
  return !!existingOrder;
};
const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", schema);

export { Ticket };
