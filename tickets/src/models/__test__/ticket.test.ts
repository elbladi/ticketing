import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async () => {
  // Create Ticket instance
  const ticket = Ticket.build({ title: "test", price: 2, userId: "123" });

  // Save ticket to DB
  await ticket.save();

  // fetch ticket twice
  const ticket1 = await Ticket.findById(ticket.id);
  const ticket2 = await Ticket.findById(ticket.id);

  // make 2 separate changes to the tickets we fetched
  ticket1!.set({ price: 10 });
  ticket2!.set({ price: 15 });

  // save the first fetched ticket
  await ticket1!.save();

  // save the second fetched ticket and expect an error
  try {
    await ticket2!.save();
  } catch (error) {
    return;
  }
  throw new Error("This should not be thrown");
});

it("increments the version number on multiple saves", async () => {
  const ticket = Ticket.build({
    title: "123",
    price: 20,
    userId: "1211",
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
